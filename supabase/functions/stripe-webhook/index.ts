import { Hono } from "npm:hono";
import type { Context } from "npm:hono";
import { logger } from "npm:hono/logger";
import Stripe from "npm:stripe@17";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "../make-server-ef294769/kv_store.ts";
import {
  sendPurchaseConfirmation,
  sendReportReady,
  sendPaymentFailed,
} from "../make-server-ef294769/emails/index.ts";

const app = new Hono();
app.use("*", logger());

// Initialize Stripe with secret key from environment
const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2024-12-18.acacia",
});

const baseAppUrl = (() => {
  const envBase =
    Deno.env.get("APP_BASE_URL") ||
    Deno.env.get("PUBLIC_SITE_URL") ||
    Deno.env.get("SITE_URL") ||
    Deno.env.get("NEXT_PUBLIC_SITE_URL");
  if (envBase) return envBase.replace(/\/$/, "");
  const env = (Deno.env.get("ENVIRONMENT") || "production").toLowerCase();
  return env === "development" ? "http://localhost:5173" : "https://www.yieldpulse.ae";
})();

const dashboardUrl = `${baseAppUrl}/dashboard`;

const getServiceClient = () => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey =
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase service credentials");
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
};

const fetchProfile = async (userId: string) => {
  try {
    const svc = getServiceClient();
    const { data, error } = await svc
      .from("profiles")
      .select("email, full_name")
      .eq("id", userId)
      .maybeSingle();
    if (error) throw error;
    return data || null;
  } catch (err) {
    console.warn("fetchProfile failed", err);
    return null;
  }
};

const logWebhookEvent = async (log: any) => {
  try {
    await kv.set(`webhook_log:${Date.now()}:${log.event_id || log.eventId}`, log);
  } catch (err) {
    console.warn("Webhook logging failed:", err);
  }
};

const handleWebhook = async (c: Context) => {
  const logBase: any = {
    id: crypto.randomUUID(),
    event_id: null,
    event_type: null,
    status: "pending",
    source: "stripe",
    payload: null,
    response: null,
    error_message: null,
    attempts: 1,
    next_retry: null,
    created_at: new Date().toISOString(),
    processed_at: null,
  };

  try {
    const signature = c.req.header("stripe-signature");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

    if (!signature || !webhookSecret) {
      console.error("Webhook: Missing signature or webhook secret");
      logBase.status = "failed";
      logBase.error_message = "Missing signature or webhook secret";
      await logWebhookEvent(logBase);
      return c.json({ error: "Webhook authentication failed" }, 401);
    }

    // Get raw body for signature verification
    const body = await c.req.text();

    let event;
    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook: Signature verification failed", err);
      logBase.status = "failed";
      logBase.error_message = "Invalid signature";
      await logWebhookEvent(logBase);
      return c.json({ error: "Invalid signature" }, 400);
    }

    console.log("Webhook event received:", event.type);
    logBase.event_id = event.id;
    logBase.event_type = event.type;
    logBase.payload = event.data?.object || null;

    // Handle checkout.session.completed
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const purchaseId = session.metadata?.purchase_id;
      const isGuest = session.metadata?.guest_purchase === "true";
      logBase.session_id = session.id;

      if (!purchaseId) {
        console.error("Webhook: Missing purchase_id in metadata");
        logBase.status = "failed";
        logBase.error_message = "Missing purchase metadata";
        await logWebhookEvent(logBase);
        return c.json({ error: "Missing purchase metadata" }, 400);
      }

      const supabaseUrl = Deno.env.get("SUPABASE_URL");
      const serviceRoleKey =
        Deno.env.get("SERVICE_ROLE_KEY") ??
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

      if (!supabaseUrl || !serviceRoleKey) {
        console.error("Webhook: Missing Supabase configuration");
        logBase.status = "failed";
        logBase.error_message = "Server configuration error";
        await logWebhookEvent(logBase);
        return c.json({ error: "Server configuration error" }, 500);
      }

      // Use service role to update purchase
      const supabase = createClient(supabaseUrl, serviceRoleKey);

      // Check if already processed (idempotency)
      const { data: existingPurchase } = await supabase
        .from("report_purchases")
        .select("*")
        .eq("id", purchaseId)
        .single();

      if (!existingPurchase) {
        if (isGuest) {
          // Guest checkout: update KV record instead of report_purchases
          try {
            const guestKey = `guest_purchase:${purchaseId}`;
            const guestPurchase = await kv.get(guestKey);

            if (!guestPurchase) {
              console.error("Webhook: Guest purchase not found", purchaseId);
              logBase.status = "failed";
              logBase.error_message = "Guest purchase not found";
              logBase.processed_at = new Date().toISOString();
              await logWebhookEvent(logBase);
              // Return 200 to avoid endless retries for missing guest record
              return c.json({ received: true, guestPurchase: "missing" });
            }

            if (guestPurchase.status === "paid") {
              console.log("Webhook: Guest purchase already marked paid", purchaseId);
              logBase.status = "success";
              logBase.response = { received: true, guestPurchase: "already_paid" };
              logBase.processed_at = new Date().toISOString();
              await logWebhookEvent(logBase);
              return c.json({ received: true, guestPurchase: "already_paid" });
            }

            guestPurchase.status = "paid";
            guestPurchase.purchased_at = new Date().toISOString();
            guestPurchase.stripe_payment_intent_id = session.payment_intent as string;
            guestPurchase.stripe_checkout_session_id = session.id;

            await kv.set(guestKey, guestPurchase);

            // Send guest purchase confirmation emails (best-effort)
            try {
              const to =
                (session.customer_details as any)?.email ||
                (session as any).customer_email ||
                guestPurchase.snapshot?.metadata?.customer_email ||
                null;
              if (to) {
                const snapshotInputs: any = guestPurchase.snapshot?.inputs || {};
                const propertyName =
                  snapshotInputs.property_name ||
                  snapshotInputs.propertyName ||
                  snapshotInputs.portal_source ||
                  null;

                await sendPurchaseConfirmation({
                  to,
                  property_name: propertyName,
                  report_id: purchaseId,
                  dashboard_url: dashboardUrl,
                  first_name: null,
                  support_email: "support@yieldpulse.ae",
                });

                await sendReportReady({
                  to,
                  property_name: propertyName,
                  report_url: `${dashboardUrl}?purchaseId=${purchaseId}`,
                  report_id: purchaseId,
                  first_name: null,
                });
              } else {
                console.warn("Webhook guest purchase: no email for receipt", purchaseId);
              }
            } catch (err) {
              console.warn("Webhook guest purchase email failed", err);
            }

            console.log("Webhook: Guest purchase marked paid", purchaseId);
            logBase.status = "success";
            logBase.response = { received: true, guestPurchase: "paid" };
            logBase.processed_at = new Date().toISOString();
            await logWebhookEvent(logBase);
            return c.json({ received: true, guestPurchase: "paid" });
          } catch (err) {
            console.error("Webhook: Failed to update guest purchase", err);
            logBase.status = "failed";
            logBase.error_message = "Failed to update guest purchase";
            logBase.processed_at = new Date().toISOString();
            await logWebhookEvent(logBase);
            return c.json({ error: "Failed to update guest purchase" }, 500);
          }
        }

        console.error("Webhook: Purchase not found", purchaseId);
        logBase.status = "failed";
        logBase.error_message = "Purchase not found";
        logBase.processed_at = new Date().toISOString();
        await logWebhookEvent(logBase);
        return c.json({ error: "Purchase not found" }, 404);
      }

      if (existingPurchase.status === "paid") {
        console.log("Webhook: Already processed", purchaseId);
        logBase.status = "success";
        logBase.response = { received: true, alreadyProcessed: true };
        logBase.processed_at = new Date().toISOString();
        await logWebhookEvent(logBase);
        return c.json({ received: true, alreadyProcessed: true });
      }

      // Update purchase to paid
      const { data: purchase, error: updateError } = await supabase
        .from("report_purchases")
        .update({
          status: "paid",
          stripe_payment_intent_id: session.payment_intent as string,
          purchased_at: new Date().toISOString(),
        })
        .eq("id", purchaseId)
        .select()
        .single();

      if (updateError) {
        console.error("Webhook: Failed to update purchase", updateError);
        logBase.status = "failed";
        logBase.error_message = "Failed to update purchase";
        logBase.processed_at = new Date().toISOString();
        await logWebhookEvent(logBase);
        return c.json({ error: "Failed to update purchase" }, 500);
      }

      // Send purchase confirmation + report ready emails (non-blocking)
      try {
        const profile = purchase.user_id ? await fetchProfile(purchase.user_id) : null;
        const to =
          profile?.email ||
          (session.customer_details as any)?.email ||
          (session as any).customer_email ||
          null;
        if (to) {
          const snapshotInputs: any = (purchase as any)?.snapshot?.inputs || {};
          const propertyName =
            snapshotInputs.property_name ||
            snapshotInputs.propertyName ||
            snapshotInputs.portal_source ||
            null;

          await sendPurchaseConfirmation({
            to,
            property_name: propertyName,
            report_id: purchase.id,
            dashboard_url: dashboardUrl,
            first_name: profile?.full_name || null,
            support_email: "support@yieldpulse.ae",
          });

          await sendReportReady({
            to,
            property_name: propertyName,
            report_url: `${dashboardUrl}?purchaseId=${purchase.id}`,
            report_id: purchase.id,
            first_name: profile?.full_name || null,
          });
        } else {
          console.warn("Webhook: No email found for purchase", purchaseId);
        }
      } catch (err) {
        console.warn("Webhook: email dispatch failed", err);
      }

      console.log("Webhook: Purchase marked as paid", purchaseId);
      logBase.status = "success";
      logBase.response = { received: true, purchaseId: purchase.id };
      logBase.processed_at = new Date().toISOString();
      await logWebhookEvent(logBase);
      return c.json({ received: true, purchaseId: purchase.id });
    }

    // Handle payment failures (checkout or payment intent)
    if (
      event.type === "payment_intent.payment_failed" ||
      event.type === "checkout.session.async_payment_failed" ||
      event.type === "checkout.session.expired"
    ) {
      const obj: any = event.data.object;
      const session = event.type.startsWith("checkout") ? obj : null;
      const intent = event.type === "payment_intent.payment_failed" ? obj : null;

      const purchaseId =
        session?.metadata?.purchase_id ||
        intent?.metadata?.purchase_id ||
        null;
      const userId =
        session?.metadata?.user_id ||
        intent?.metadata?.user_id ||
        null;

      let to =
        (session?.customer_details as any)?.email ||
        session?.customer_email ||
        intent?.receipt_email ||
        null;

      if (!to && userId) {
        const profile = await fetchProfile(userId);
        to = profile?.email || null;
      }

      if (to) {
        try {
          await sendPaymentFailed({
            to,
            retry_url: `${dashboardUrl}${purchaseId ? `?purchaseId=${purchaseId}` : ""}`,
            first_name: null,
          });
          logBase.status = "success";
          logBase.response = { received: true, paymentFailed: true };
          logBase.processed_at = new Date().toISOString();
          await logWebhookEvent(logBase);
          return c.json({ received: true, paymentFailed: true });
        } catch (err) {
          console.warn("Payment failed email dispatch error", err);
        }
      }
    }

    // Acknowledge other events
    logBase.status = "success";
    logBase.response = { received: true };
    logBase.processed_at = new Date().toISOString();
    await logWebhookEvent(logBase);
    return c.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    logBase.status = "failed";
    logBase.error_message = error?.message || "Webhook processing failed";
    logBase.processed_at = new Date().toISOString();
    await logWebhookEvent(logBase);
    return c.json({ error: "Webhook processing failed" }, 500);
  }
};

// Accept root or /stripe/webhook for flexibility in Stripe config
app.post("/", handleWebhook);
app.post("/stripe-webhook", handleWebhook);
app.post("/stripe/webhook", handleWebhook);

// Start the server
Deno.serve(app.fetch);
