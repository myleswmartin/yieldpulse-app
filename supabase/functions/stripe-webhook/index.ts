import { Hono } from "npm:hono";
import type { Context } from "npm:hono";
import { logger } from "npm:hono/logger";
import Stripe from "npm:stripe@17";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "../make-server-ef294769/kv_store.ts";

const app = new Hono();
app.use("*", logger());

// Initialize Stripe with secret key from environment
const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2024-12-18.acacia",
});

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

      console.log("Webhook: Purchase marked as paid", purchaseId);
      logBase.status = "success";
      logBase.response = { received: true, purchaseId: purchase.id };
      logBase.processed_at = new Date().toISOString();
      await logWebhookEvent(logBase);
      return c.json({ received: true, purchaseId: purchase.id });
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
