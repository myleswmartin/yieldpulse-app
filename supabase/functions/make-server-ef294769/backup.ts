import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "npm:@supabase/supabase-js@2";
import Stripe from "npm:stripe@17";

const app = new Hono();

// Initialize Stripe with secret key from environment
const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
    apiVersion: "2024-12-18.acacia",
});

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
    "/*",
    cors({
        origin: "*",
        allowHeaders: ["Content-Type", "Authorization"],
        allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        exposeHeaders: ["Content-Length", "X-Request-ID"],
        maxAge: 600,
    }),
);

// Middleware to add X-Request-ID to all responses
app.use('*', async (c, next) => {
    const requestId = crypto.randomUUID();
    c.set('requestId', requestId);
    await next();
    c.header('X-Request-ID', requestId);
});

// Health check endpoint
app.get("/make-server-ef294769/health", (c) => {
    return c.json({ status: "ok" });
});

// ================================================================
// AUTH ROUTES
// ================================================================

app.post("/make-server-ef294769/auth/signup", async (c) => {
    try {
        const { email, password, fullName } = await c.req.json();

        if (!email || !password) {
            return c.json({ error: "Email and password are required" }, 400);
        }

        const supabase = createClient(
            Deno.env.get("SUPABASE_URL")!,
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
        );

        const { data, error } = await supabase.auth.admin.createUser({
            email,
            password,
            user_metadata: { full_name: fullName || "" },
            // Automatically confirm the user's email since an email server hasn't been configured.
            email_confirm: true,
        });

        if (error) {
            console.error("Error creating user:", error);
            return c.json({ error: error.message }, 400);
        }

        // Get the session for the new user
        const { data: sessionData, error: sessionError } =
            await supabase.auth.signInWithPassword({
                email,
                password,
            });

        if (sessionError) {
            console.error("Error creating session:", sessionError);
            return c.json({ error: sessionError.message }, 400);
        }

        return c.json({
            user: data.user,
            session: sessionData.session,
        });
    } catch (error) {
        console.error("Signup error:", error);
        return c.json({ error: "Internal server error during signup" }, 500);
    }
});

// ================================================================
// ANALYSIS ROUTES
// ================================================================

// Simplified POST /analyses endpoint for saving calculations
app.post("/make-server-ef294769/analyses", async (c) => {
    try {
        const accessToken = c.req.header("Authorization")?.split(" ")[1];
        const supabase = createClient(
            Deno.env.get("SUPABASE_URL")!,
            Deno.env.get("SUPABASE_ANON_KEY")!,
            {
                global: {
                    headers: { Authorization: `Bearer ${accessToken}` },
                },
            }
        );

        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser(accessToken);

        if (authError || !user) {
            return c.json({ error: "Unauthorized" }, 401);
        }

        const { inputs, results } = await c.req.json();

        // Map inputs and results to database columns
        const analysisData = {
            user_id: user.id,
            portal_source: inputs.portalSource,
            listing_url: inputs.listingUrl,
            area_sqft: inputs.areaSqft,
            purchase_price: inputs.purchasePrice,
            down_payment_percent: inputs.downPaymentPercent,
            mortgage_interest_rate: inputs.mortgageInterestRate,
            mortgage_term_years: inputs.mortgageTermYears,
            expected_monthly_rent: inputs.expectedMonthlyRent,
            service_charge_annual: inputs.serviceChargeAnnual,
            annual_maintenance_percent: inputs.annualMaintenancePercent,
            property_management_fee_percent: inputs.propertyManagementFeePercent,
            dld_fee_percent: inputs.dldFeePercent,
            agent_fee_percent: inputs.agentFeePercent,
            capital_growth_percent: inputs.capitalGrowthPercent,
            rent_growth_percent: inputs.rentGrowthPercent,
            vacancy_rate_percent: inputs.vacancyRatePercent,
            holding_period_years: inputs.holdingPeriodYears,
            gross_yield: results.grossRentalYield,
            net_yield: results.netRentalYield,
            monthly_cash_flow: results.monthlyCashFlow,
            annual_cash_flow: results.annualCashFlow,
            cash_on_cash_return: results.cashOnCashReturn,
            calculation_results: results,
            is_paid: false,
        };

        // Insert the analysis
        const { data, error } = await supabase
            .from("analyses")
            .insert(analysisData)
            .select()
            .single();

        if (error) {
            console.error("Error saving analysis:", error);
            return c.json({ error: error.message }, 400);
        }

        return c.json(data);
    } catch (error) {
        console.error("Error in save analysis:", error);
        return c.json({ error: "Internal server error during analysis save" }, 500);
    }
});

app.post("/make-server-ef294769/analyses/create", async (c) => {
    try {
        const accessToken = c.req.header("Authorization")?.split(" ")[1];
        const supabase = createClient(
            Deno.env.get("SUPABASE_URL")!,
            Deno.env.get("SUPABASE_ANON_KEY")!,
            {
                global: {
                    headers: { Authorization: `Bearer ${accessToken}` },
                },
            }
        );

        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser(accessToken);

        if (authError || !user) {
            return c.json({ error: "Unauthorized" }, 401);
        }

        const analysisData = await c.req.json();

        // Insert the analysis
        const { data, error } = await supabase
            .from("analyses")
            .insert({
                user_id: user.id,
                ...analysisData,
            })
            .select()
            .single();

        if (error) {
            console.error("Error creating analysis:", error);
            return c.json({ error: error.message }, 400);
        }

        return c.json(data);
    } catch (error) {
        console.error("Error in create analysis:", error);
        return c.json({ error: "Internal server error" }, 500);
    }
});

app.get("/make-server-ef294769/analyses/:id", async (c) => {
    try {
        const accessToken = c.req.header("Authorization")?.split(" ")[1];
        const analysisId = c.req.param("id");

        const supabase = createClient(
            Deno.env.get("SUPABASE_URL")!,
            Deno.env.get("SUPABASE_ANON_KEY")!,
            {
                global: {
                    headers: { Authorization: `Bearer ${accessToken}` },
                },
            }
        );

        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser(accessToken);

        if (authError || !user) {
            return c.json({ error: "Unauthorized" }, 401);
        }

        const { data, error } = await supabase
            .from("analyses")
            .select("*")
            .eq("id", analysisId)
            .single();

        if (error) {
            console.error("Error fetching analysis:", error);
            return c.json({ error: error.message }, 404);
        }

        return c.json(data);
    } catch (error) {
        console.error("Error in get analysis:", error);
        return c.json({ error: "Internal server error" }, 500);
    }
});

app.put("/make-server-ef294769/analyses/:id", async (c) => {
    try {
        const accessToken = c.req.header("Authorization")?.split(" ")[1];
        const analysisId = c.req.param("id");

        const supabase = createClient(
            Deno.env.get("SUPABASE_URL")!,
            Deno.env.get("SUPABASE_ANON_KEY")!,
            {
                global: {
                    headers: { Authorization: `Bearer ${accessToken}` },
                },
            }
        );

        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser(accessToken);

        if (authError || !user) {
            return c.json({ error: "Unauthorized" }, 401);
        }

        const updateData = await c.req.json();

        const { data, error } = await supabase
            .from("analyses")
            .update(updateData)
            .eq("id", analysisId)
            .select()
            .single();

        if (error) {
            console.error("Error updating analysis:", error);
            return c.json({ error: error.message }, 400);
        }

        return c.json(data);
    } catch (error) {
        console.error("Error in update analysis:", error);
        return c.json({ error: "Internal server error" }, 500);
    }
});

app.delete("/make-server-ef294769/analyses/:id", async (c) => {
    try {
        const accessToken = c.req.header("Authorization")?.split(" ")[1];
        const analysisId = c.req.param("id");

        const supabase = createClient(
            Deno.env.get("SUPABASE_URL")!,
            Deno.env.get("SUPABASE_ANON_KEY")!,
            {
                global: {
                    headers: { Authorization: `Bearer ${accessToken}` },
                },
            }
        );

        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser(accessToken);

        if (authError || !user) {
            return c.json({ error: "Unauthorized" }, 401);
        }

        const { error } = await supabase
            .from("analyses")
            .delete()
            .eq("id", analysisId);

        if (error) {
            console.error("Error deleting analysis:", error);
            return c.json({ error: error.message }, 400);
        }

        return c.json({ success: true });
    } catch (error) {
        console.error("Error in delete analysis:", error);
        return c.json({ error: "Internal server error" }, 500);
    }
});

app.get("/make-server-ef294769/analyses/user/me", async (c) => {
    try {
        const accessToken = c.req.header("Authorization")?.split(" ")[1];

        const supabase = createClient(
            Deno.env.get("SUPABASE_URL")!,
            Deno.env.get("SUPABASE_ANON_KEY")!,
            {
                global: {
                    headers: { Authorization: `Bearer ${accessToken}` },
                },
            }
        );

        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser(accessToken);

        if (authError || !user) {
            return c.json({ error: "Unauthorized" }, 401);
        }

        const { data, error } = await supabase
            .from("analyses")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching user analyses:", error);
            return c.json({ error: error.message }, 400);
        }

        return c.json(data || []);
    } catch (error) {
        console.error("Error in get user analyses:", error);
        return c.json({ error: "Internal server error" }, 500);
    }
});

// ================================================================
// PROFILE ROUTES
// ================================================================

app.get("/make-server-ef294769/profile/me", async (c) => {
    try {
        const accessToken = c.req.header("Authorization")?.split(" ")[1];

        const supabase = createClient(
            Deno.env.get("SUPABASE_URL")!,
            Deno.env.get("SUPABASE_ANON_KEY")!,
            {
                global: {
                    headers: { Authorization: `Bearer ${accessToken}` },
                },
            }
        );

        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser(accessToken);

        if (authError || !user) {
            return c.json({ error: "Unauthorized" }, 401);
        }

        const { data: profile, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

        if (error) {
            console.error("Error fetching profile:", error);
            return c.json({ error: error.message }, 404);
        }

        return c.json(profile);
    } catch (error) {
        console.error("Error in get profile:", error);
        return c.json({ error: "Internal server error" }, 500);
    }
});

// ================================================================
// PAYMENT ROUTES
// ================================================================

// ================================================================
// STRIPE CHECKOUT AND WEBHOOK ROUTES
// ================================================================

app.post("/make-server-ef294769/stripe/checkout-session", async (c) => {
    try {
        const accessToken = c.req.header("Authorization")?.split(" ")[1];

        if (!accessToken) {
            console.error("Checkout session: Missing Authorization header");
            return c.json({ error: "Unauthorized" }, 401);
        }

        const supabase = createClient(
            Deno.env.get("SUPABASE_URL")!,
            Deno.env.get("SUPABASE_ANON_KEY")!,
            {
                global: {
                    headers: { Authorization: `Bearer ${accessToken}` },
                },
            }
        );

        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser(accessToken);

        if (authError || !user) {
            console.error("Checkout session: Authentication failed", authError);
            return c.json({ error: "Unauthorized" }, 401);
        }

        const { analysisId, origin } = await c.req.json();

        if (!analysisId || !origin) {
            return c.json({ error: "analysisId and origin are required" }, 400);
        }

        // Origin allowlist
        const allowedOrigins = [
            "http://localhost:5173",
            "http://localhost:3000",
            "https://makeproxy-c.figma.site",
            "https://yieldpulse.vercel.app",
        ];

        if (!allowedOrigins.includes(origin)) {
            console.error("Checkout session: Origin not allowed:", origin);
            return c.json({ error: "Origin not allowed" }, 403);
        }

        // Fetch analysis owned by user
        const { data: analysis, error: analysisError } = await supabase
            .from("analyses")
            .select("*")
            .eq("id", analysisId)
            .eq("user_id", user.id)
            .single();

        if (analysisError || !analysis) {
            console.error("Checkout session: Analysis not found", analysisError);
            return c.json({ error: "Analysis not found" }, 404);
        }

        // Check for existing paid purchase
        const { data: existingPaidPurchases } = await supabase
            .from("report_purchases")
            .select("*")
            .eq("user_id", user.id)
            .eq("analysis_id", analysisId)
            .eq("status", "paid");

        if (existingPaidPurchases && existingPaidPurchases.length > 0) {
            console.log("Checkout session: Already purchased", analysisId);
            return c.json({ error: "Report already purchased", alreadyPurchased: true }, 400);
        }

        // Check for recent pending purchase (within 30 minutes)
        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
        const { data: recentPendingPurchases } = await supabase
            .from("report_purchases")
            .select("*")
            .eq("user_id", user.id)
            .eq("analysis_id", analysisId)
            .eq("status", "pending")
            .gte("created_at", thirtyMinutesAgo)
            .order("created_at", { ascending: false })
            .limit(1);

        let purchase;

        if (recentPendingPurchases && recentPendingPurchases.length > 0) {
            // Reuse existing pending purchase
            purchase = recentPendingPurchases[0];
            console.log("Checkout session: Reusing pending purchase", purchase.id);
        } else {
            // Create snapshot from analysis
            const snapshot = {
                inputs: {
                    portal_source: analysis.portal_source,
                    listing_url: analysis.listing_url,
                    purchase_price: analysis.purchase_price,
                    expected_monthly_rent: analysis.expected_monthly_rent,
                    down_payment_percent: analysis.down_payment_percent,
                    mortgage_interest_rate: analysis.mortgage_interest_rate,
                    loan_term_years: analysis.mortgage_term_years,
                    service_charge_per_year: analysis.service_charge_annual,
                    maintenance_per_year: analysis.annual_maintenance_percent,
                    property_management_fee: analysis.property_management_fee_percent,
                    vacancy_rate: analysis.vacancy_rate_percent,
                    rent_growth_rate: analysis.rent_growth_percent,
                    capital_growth_rate: analysis.capital_growth_percent,
                    holding_period_years: analysis.holding_period_years,
                    area_sqft: analysis.area_sqft,
                },
                results: analysis.calculation_results || {
                    grossYield: analysis.gross_yield,
                    netYield: analysis.net_yield,
                    cashOnCashReturn: analysis.cash_on_cash_return,
                    monthlyCashFlow: analysis.monthly_cash_flow,
                    annualCashFlow: analysis.annual_cash_flow,
                },
                metadata: {
                    report_version: "v1",
                    generated_at: new Date().toISOString(),
                    analysis_id: analysisId,
                },
            };

            // Create new pending purchase
            const { data: newPurchase, error: purchaseError } = await supabase
                .from("report_purchases")
                .insert({
                    user_id: user.id,
                    analysis_id: analysisId,
                    amount_aed: 49,
                    currency: "aed",
                    status: "pending",
                    report_version: "v1",
                    snapshot: snapshot,
                })
                .select()
                .single();

            if (purchaseError || !newPurchase) {
                console.error("Checkout session: Failed to create purchase", purchaseError);
                return c.json({ error: "Failed to create purchase record" }, 500);
            }

            purchase = newPurchase;
            console.log("Checkout session: Created new purchase", purchase.id);
        }

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "aed",
                        product_data: {
                            name: "YieldPulse Premium Report",
                            description: "Unlock full ROI analysis with detailed projections and PDF export",
                        },
                        unit_amount: 4900, // AED 49.00 in fils
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${origin}/dashboard?payment=success&analysisId=${analysisId}`,
            cancel_url: `${origin}/results?payment=cancelled`,
            metadata: {
                platform: "yieldpulse",
                user_id: user.id,
                analysis_id: analysisId,
                purchase_id: purchase.id,
                environment: Deno.env.get("ENVIRONMENT") || "production",
            },
        });

        // Update purchase with Stripe session ID
        const { error: updateError } = await supabase
            .from("report_purchases")
            .update({ stripe_checkout_session_id: session.id })
            .eq("id", purchase.id);

        if (updateError) {
            console.error("Checkout session: Failed to update session ID", updateError);
            // Continue anyway - webhook will still work
        }

        console.log("Checkout session created:", session.id);
        return c.json({ url: session.url });
    } catch (error) {
        console.error("Checkout session error:", error);
        return c.json({ error: "Failed to create checkout session" }, 500);
    }
});

app.post("/make-server-ef294769/stripe/webhook", async (c) => {
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
            event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
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

            // Use service role to update purchase
            const supabase = createClient(
                Deno.env.get("SUPABASE_URL")!,
                Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
            );

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
});

// ================================================================
// PREMIUM PURCHASE STATUS CHECK
// ================================================================
app.get("/make-server-ef294769/purchases/status", async (c) => {
    try {
        const accessToken = c.req.header("Authorization")?.split(" ")[1];
        if (!accessToken) {
            return c.json({ error: "Unauthorized" }, 401);
        }

        // Authenticate user with anon client
        const anonSupabase = createClient(
            Deno.env.get("SUPABASE_URL")!,
            Deno.env.get("SUPABASE_ANON_KEY")!,
            {
                global: {
                    headers: { Authorization: `Bearer ${accessToken}` },
                },
            }
        );

        const { data: { user }, error: authError } =
            await anonSupabase.auth.getUser();

        if (authError || !user) {
            return c.json({ error: "Unauthorized" }, 401);
        }

        const analysisId = c.req.query("analysisId");
        if (!analysisId) {
            return c.json(
                { error: "analysisId query parameter is required" },
                400
            );
        }

        // Query paid purchases using service role
        const serviceSupabase = createClient(
            Deno.env.get("SUPABASE_URL")!,
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
        );

        const { data: purchase, error: purchaseError } =
            await serviceSupabase
                .from("report_purchases")
                .select("id, analysis_id, created_at, purchased_at, status")
                .eq("user_id", user.id)
                .eq("analysis_id", analysisId)
                .eq("status", "paid")
                .order("created_at", { ascending: false })
                .limit(1)
                .maybeSingle();

        if (purchaseError) {
            console.error("Purchase status DB error:", purchaseError);
            return c.json({ error: "Failed to check purchase status" }, 500);
        }

        return c.json({
            isPaid: !!purchase,
            purchase: purchase
                ? {
                    id: purchase.id,
                    analysis_id: purchase.analysis_id,
                    created_at: purchase.created_at,
                    purchased_at: purchase.purchased_at,
                    status: purchase.status,
                }
                : null,
        });
    } catch (err) {
        console.error("Purchase status error:", err);
        return c.json({ error: "Failed to check purchase status" }, 500);
    }
});

// ================================================================
// SIMULATED PAYMENTS (DEV ONLY - LEGACY - NOT USED BY PREMIUM UNLOCK)
// ================================================================

// Start the server
Deno.serve(app.fetch);