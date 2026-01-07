import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";

const app = new Hono().basePath("/make-server-ef294769");

// ------------------------------------------------------------
// ENV (Supabase sets these automatically in Edge runtime)
// ------------------------------------------------------------
const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
const serviceRoleKey =
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ??
  Deno.env.get("SERVICE_ROLE_KEY") ??
  "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Missing SUPABASE_URL or SUPABASE_ANON_KEY in Edge Function env");
}

// ------------------------------------------------------------
// CORS
// ------------------------------------------------------------
// Keep this simple for now: allow the requesting origin.
// If you use cookies/credentials later, you MUST NOT use "*".
// For bearer token auth, this is fine.
app.use(
  "/*",
  cors({
    origin: (origin) => origin || "*",
    allowHeaders: ["content-type", "authorization", "apikey", "x-client-info"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    maxAge: 600,
  })
);

// Explicit preflight handler
app.options("/*", (c) => c.body(null, 204));

// Logger
app.use("*", logger());

// Request ID header (handy for debugging)
app.use("*", async (c, next) => {
  const requestId = crypto.randomUUID();
  c.set("requestId", requestId);
  await next();
  c.header("X-Request-ID", requestId);
});

// Global error handler
app.onError((err, c) => {
  console.error("Unhandled error:", err);
  return c.json(
    { error: "Internal server error", requestId: c.get("requestId") },
    500
  );
});

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------
const getAccessToken = (c: any): string | undefined => {
  const authHeader =
    c.req.header("authorization") ?? c.req.header("Authorization");
  if (authHeader?.startsWith("Bearer ")) return authHeader.slice(7);
  return undefined;
};

const requireUser = async (c: any) => {
  const accessToken = getAccessToken(c);
  if (!accessToken) return { user: null, accessToken: null, error: "Unauthorized" };

  // Validate JWT using service role if available; fallback to anon.
  const authClient = createClient(
    supabaseUrl,
    serviceRoleKey || supabaseAnonKey,
    {
      global: { headers: { Authorization: `Bearer ${accessToken}` } },
      auth: { autoRefreshToken: false, persistSession: false },
    }
  );

  const { data, error } = await authClient.auth.getUser(accessToken);

  if (error || !data?.user) {
    console.error("Auth getUser failed:", error?.message);
    return { user: null, accessToken, error: "Unauthorized" };
  }

  return { user: data.user, accessToken, error: null };
};

// Stripe: lazy init (won't boot-crash if key missing until route is hit)
let stripeClient: any | null = null;
const getStripe = async () => {
  if (stripeClient) return stripeClient;

  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  if (!stripeKey) throw new Error("Missing STRIPE_SECRET_KEY");

  const { default: Stripe } = await import("npm:stripe@17");
  stripeClient = new Stripe(stripeKey, {
    // For edge runtimes, Stripe often needs fetch client. Use if available.
    httpClient: (Stripe as any).createFetchHttpClient
      ? (Stripe as any).createFetchHttpClient()
      : undefined,
  } as any);

  return stripeClient;
};

// ------------------------------------------------------------
// Routes (IMPORTANT: NO "/make-server-ef294769" prefix here)
// These are mounted under:
// /functions/v1/make-server-ef294769/<route>
// ------------------------------------------------------------

app.get("/health", (c) => c.json({ status: "ok" }));

// ================================================================
// AUTH
// ================================================================
app.post("/auth/signup", async (c) => {
  try {
    if (!serviceRoleKey) {
      return c.json({ error: "Missing service role key on server" }, 500);
    }

    const { email, password, fullName } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: "Email and password are required" }, 400);
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    const { data, error } = await adminClient.auth.admin.createUser({
      email,
      password,
      user_metadata: { full_name: fullName || "" },
      email_confirm: true,
    });

    if (error) {
      console.error("Error creating user:", error);
      return c.json({ error: error.message }, 400);
    }

    // Optional: sign in user right away
    const { data: sessionData, error: sessionError } =
      await adminClient.auth.signInWithPassword({ email, password });

    if (sessionError) {
      console.error("Error creating session:", sessionError);
      return c.json({ error: sessionError.message }, 400);
    }

    return c.json({ user: data.user, session: sessionData.session });
  } catch (error) {
    console.error("Signup error:", error);
    return c.json({ error: "Internal server error during signup" }, 500);
  }
});

// ================================================================
// ANALYSES
// ================================================================
app.post("/analyses", async (c) => {
  try {
    const accessToken = getAccessToken(c);
    if (!accessToken) return c.json({ error: "Unauthorized" }, 401);

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${accessToken}` } },
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: userRes, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !userRes?.user) {
      console.error("Auth getUser failed:", authError?.message);
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { inputs, results } = await c.req.json();

    const analysisData = {
      user_id: userRes.user.id,
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

app.get("/analyses/user/me", async (c) => {
  try {
    const { user, accessToken, error } = await requireUser(c);
    if (!user) return c.json({ error: error || "Unauthorized" }, 401);

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${accessToken}` } },
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data, error: dbError } = await supabase
      .from("analyses")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (dbError) {
      console.error("Error fetching user analyses:", dbError);
      return c.json({ error: dbError.message }, 400);
    }

    return c.json(data || []);
  } catch (err) {
    console.error("Error in get user analyses:", err);
    return c.json({ error: "Internal server error" }, 500);
  }
});

app.post("/analyses/create", async (c) => {
  try {
    const { user, accessToken, error } = await requireUser(c);
    if (!user) return c.json({ error: error || "Unauthorized" }, 401);

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${accessToken}` } },
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const analysisData = await c.req.json();

    const { data, error: dbError } = await supabase
      .from("analyses")
      .insert({ user_id: user.id, ...analysisData })
      .select()
      .single();

    if (dbError) {
      console.error("Error creating analysis:", dbError);
      return c.json({ error: dbError.message }, 400);
    }

    return c.json(data);
  } catch (err) {
    console.error("Error in create analysis:", err);
    return c.json({ error: "Internal server error" }, 500);
  }
});

app.get("/analyses/:id", async (c) => {
  try {
    const { user, accessToken, error } = await requireUser(c);
    if (!user) return c.json({ error: error || "Unauthorized" }, 401);

    const analysisId = c.req.param("id");
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${accessToken}` } },
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data, error: dbError } = await supabase
      .from("analyses")
      .select("*")
      .eq("id", analysisId)
      .single();

    if (dbError) {
      console.error("Error fetching analysis:", dbError);
      return c.json({ error: dbError.message }, 404);
    }

    return c.json(data);
  } catch (err) {
    console.error("Error in get analysis:", err);
    return c.json({ error: "Internal server error" }, 500);
  }
});

app.put("/analyses/:id", async (c) => {
  try {
    const { user, accessToken, error } = await requireUser(c);
    if (!user) return c.json({ error: error || "Unauthorized" }, 401);

    const analysisId = c.req.param("id");
    const updateData = await c.req.json();

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${accessToken}` } },
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data, error: dbError } = await supabase
      .from("analyses")
      .update(updateData)
      .eq("id", analysisId)
      .select()
      .single();

    if (dbError) {
      console.error("Error updating analysis:", dbError);
      return c.json({ error: dbError.message }, 400);
    }

    return c.json(data);
  } catch (err) {
    console.error("Error in update analysis:", err);
    return c.json({ error: "Internal server error" }, 500);
  }
});

app.delete("/analyses/:id", async (c) => {
  try {
    const { user, accessToken, error } = await requireUser(c);
    if (!user) return c.json({ error: error || "Unauthorized" }, 401);

    const analysisId = c.req.param("id");
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${accessToken}` } },
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { error: dbError } = await supabase
      .from("analyses")
      .delete()
      .eq("id", analysisId);

    if (dbError) {
      console.error("Error deleting analysis:", dbError);
      return c.json({ error: dbError.message }, 400);
    }

    return c.json({ success: true });
  } catch (err) {
    console.error("Error in delete analysis:", err);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// ================================================================
// PROFILE
// ================================================================
app.get("/profile/me", async (c) => {
  try {
    const { user, accessToken, error } = await requireUser(c);
    if (!user) return c.json({ error: error || "Unauthorized" }, 401);

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${accessToken}` } },
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: profile, error: dbError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (dbError) {
      console.error("Error fetching profile:", dbError);
      return c.json({ error: dbError.message }, 404);
    }

    return c.json(profile);
  } catch (err) {
    console.error("Error in get profile:", err);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// ================================================================
// PURCHASE STATUS
// ================================================================
app.get("/purchases/status", async (c) => {
  try {
    const { user, error } = await requireUser(c);
    if (!user) return c.json({ error: error || "Unauthorized" }, 401);

    if (!serviceRoleKey) {
      return c.json({ error: "Missing service role key on server" }, 500);
    }

    const analysisId = c.req.query("analysisId");
    if (!analysisId) {
      return c.json({ error: "analysisId query parameter is required" }, 400);
    }

    const serviceSupabase = createClient(supabaseUrl, serviceRoleKey);

    const { data: purchase, error: purchaseError } = await serviceSupabase
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
// STRIPE CHECKOUT (webhook handled in separate function)
// ================================================================
app.post("/stripe/checkout-session", async (c) => {
  try {
    const { user, accessToken, error } = await requireUser(c);
    if (!user) {
      console.error("Checkout session: Authentication failed", error);
      return c.json({ error: "Unauthorized" }, 401);
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${accessToken}` } },
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { analysisId, origin } = await c.req.json();
    if (!analysisId || !origin) {
      return c.json({ error: "analysisId and origin are required" }, 400);
    }

    const allowedOrigins = [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://makeproxy-c.figma.site",
      "https://yieldpulse.vercel.app",
      "https://www.yieldpulse.ae",
    ];

    if (!allowedOrigins.includes(origin)) {
      console.error("Checkout session: Origin not allowed:", origin);
      return c.json({ error: "Origin not allowed" }, 403);
    }

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
      purchase = recentPendingPurchases[0];
      console.log("Checkout session: Reusing pending purchase", purchase.id);
    } else {
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

      const { data: newPurchase, error: purchaseError } = await supabase
        .from("report_purchases")
        .insert({
          user_id: user.id,
          analysis_id: analysisId,
          amount_aed: 49,
          currency: "aed",
          status: "pending",
          report_version: "v1",
          snapshot,
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

    const stripe = await getStripe();
    const checkoutMetadata = {
      platform: "yieldpulse",
      user_id: user.id,
      user_email: user.email || "",
      analysis_id: analysisId,
      purchase_id: purchase.id,
      environment: Deno.env.get("ENVIRONMENT") || "production",
    };

    const session = await stripe.checkout.sessions.create({
      customer_email: user.email || undefined,
      client_reference_id: purchase.id,
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "aed",
            product_data: {
              name: "YieldPulse Premium Report",
              description: "Unlock full ROI analysis with detailed projections and PDF export",
            },
            unit_amount: 4900,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/dashboard?payment=success&analysisId=${analysisId}`,
      cancel_url: `${origin}/results?payment=cancelled`,
      metadata: checkoutMetadata,
      payment_intent_data: { metadata: checkoutMetadata },
    });

    const { error: updateError } = await supabase
      .from("report_purchases")
      .update({ stripe_checkout_session_id: session.id })
      .eq("id", purchase.id);

    if (updateError) {
      console.error("Checkout session: Failed to update session ID", updateError);
    }

    console.log("Checkout session created:", session.id);
    return c.json({ url: session.url });
  } catch (err) {
    console.error("Checkout session error:", err);
    return c.json({ error: "Failed to create checkout session" }, 500);
  }
});

// Debug 404 handler to reveal unmatched paths
app.notFound((c) => {
  console.warn("Route not found", c.req.path);
  return c.json({ error: "Not Found", path: c.req.path }, 404);
});

Deno.serve(app.fetch);


