import { Hono } from "npm:hono";
import type { Context } from "npm:hono";
import { logger } from "npm:hono/logger";
import Stripe from "npm:stripe@17";
import { createClient } from "npm:@supabase/supabase-js@2";

const app = new Hono();
app.use("*", logger());

// Initialize Stripe with secret key from environment
const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2024-12-18.acacia",
});

const handleWebhook = async (c: Context) => {
  try {
    const signature = c.req.header("stripe-signature");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

    if (!signature || !webhookSecret) {
      console.error("Webhook: Missing signature or webhook secret");
      return c.json({ error: "Webhook authentication failed" }, 401);
    }

    // Get raw body for signature verification
    const body = await c.req.text();

    let event;
    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook: Signature verification failed", err);
      return c.json({ error: "Invalid signature" }, 400);
    }

    console.log("Webhook event received:", event.type);

    // Handle checkout.session.completed
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const purchaseId = session.metadata?.purchase_id;

      if (!purchaseId) {
        console.error("Webhook: Missing purchase_id in metadata");
        return c.json({ error: "Missing purchase metadata" }, 400);
      }

      const supabaseUrl = Deno.env.get("SUPABASE_URL");
      const serviceRoleKey =
        Deno.env.get("SERVICE_ROLE_KEY") ??
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

      if (!supabaseUrl || !serviceRoleKey) {
        console.error("Webhook: Missing Supabase configuration");
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
        console.error("Webhook: Purchase not found", purchaseId);
        return c.json({ error: "Purchase not found" }, 404);
      }

      if (existingPurchase.status === "paid") {
        console.log("Webhook: Already processed", purchaseId);
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
        return c.json({ error: "Failed to update purchase" }, 500);
      }

      console.log("Webhook: Purchase marked as paid", purchaseId);
      return c.json({ received: true, purchaseId: purchase.id });
    }

    // Acknowledge other events
    return c.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return c.json({ error: "Webhook processing failed" }, 500);
  }
};

// Accept root or /stripe/webhook for flexibility in Stripe config
app.post("/", handleWebhook);
app.post("/stripe-webhook", handleWebhook);
app.post("/stripe/webhook", handleWebhook);

// Start the server
Deno.serve(app.fetch);
