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
  const authHeader = c.req.header("Authorization");
  if (authHeader?.startsWith("Bearer ")) return authHeader.split(" ")[1];

  // Safely attempt cookie access (may not exist without cookie middleware)
  try {
    const cookieFn = (c.req as any)?.cookie;
    if (typeof cookieFn === 'function') {
      const cookieToken = cookieFn.call(c.req, "sb-access-token");
      if (cookieToken) return cookieToken;
    }
  } catch {
    // ignore cookie access errors
  }

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

const requireAdmin = async (c: any) => {
  const { user, accessToken, error } = await requireUser(c);
  if (!user) return { user: null, accessToken: null, error: error || "Unauthorized" };

  if (!serviceRoleKey) {
    console.error('SERVICE_ROLE_KEY missing for admin check');
    return { user: null, accessToken: null, error: 'Server misconfigured' };
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: profile, error: profileError } = await adminClient
    .from('profiles')
    .select('id, is_admin')
    .eq('id', user.id)
    .maybeSingle();

  if (profileError) {
    console.error('Admin check failed:', profileError.message);
    return { user: null, accessToken: null, error: 'Admin check failed' };
  }

  if (!profile?.is_admin) {
    return { user: null, accessToken: null, error: 'Forbidden' };
  }

  return { user, accessToken, error: null };
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

// ================================================================
// ADMIN ROUTES
// ================================================================

app.get('/admin/stats', async (c) => {
  try {
    const { user, error } = await requireAdmin(c);
    if (!user) return c.json({ error: error || 'Unauthorized' }, error === 'Forbidden' ? 403 : 401);

    if (!serviceRoleKey) {
      return c.json({ error: 'SERVICE_ROLE_KEY missing' }, 500);
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const [{ count: totalUsers }, { count: paidPurchases }, { count: pendingPurchases }] = await Promise.all([
      adminClient.from('profiles').select('id', { count: 'exact', head: true }),
      adminClient.from('report_purchases').select('id', { count: 'exact', head: true }).eq('status', 'paid'),
      adminClient.from('report_purchases').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    ]);

    const { data: revenueRows, error: revenueError } = await adminClient
      .from('report_purchases')
      .select('amount_aed')
      .eq('status', 'paid');

    if (revenueError) {
      console.error('Revenue query failed:', revenueError.message);
    }

    const totalRevenue = (revenueRows || []).reduce((sum: number, row: any) => sum + (row.amount_aed || 0), 0);

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { count: recentPurchases } = await adminClient
      .from('report_purchases')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'paid')
      .gte('created_at', sevenDaysAgo);

    const usersCount = totalUsers || 0;
    const paidCount = paidPurchases || 0;
    const conversionRate = usersCount > 0 ? Math.round((paidCount / usersCount) * 1000) / 10 : 0;

    return c.json({
      totalUsers: usersCount,
      totalRevenue: totalRevenue,
      conversionRate: conversionRate,
      openTickets: 0,
      pendingPurchases: pendingPurchases || 0,
      paidPurchases: paidCount,
      recentPurchases: recentPurchases || 0,
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    return c.json({ error: 'Failed to load admin stats' }, 500);
  }
});

// ================================================================
// ADMIN USERS
// ================================================================
app.get('/admin/users', async (c) => {
  try {
    const { user, error } = await requireAdmin(c);
    if (!user) return c.json({ error: error || 'Unauthorized' }, error === 'Forbidden' ? 403 : 401);

    if (!serviceRoleKey) {
      return c.json({ error: 'SERVICE_ROLE_KEY missing' }, 500);
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const page = Math.max(parseInt(c.req.query('page') || '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(c.req.query('limit') || '20', 10), 1), 100);
    const search = (c.req.query('search') || '').trim();
    const adminFilter = c.req.query('admin_filter');

    let query = adminClient
      .from('profiles')
      .select('id,email,full_name,is_admin,created_at', { count: 'exact' });

    if (search) {
      query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`);
    }

    if (adminFilter === 'true' || adminFilter === 'false') {
      query = query.eq('is_admin', adminFilter === 'true');
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data: users, error: usersError, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (usersError) {
      console.error('Admin users list error:', usersError.message);
      return c.json({ error: 'Failed to load users' }, 500);
    }

    const userIds = (users || []).map((u: any) => u.id);
    const purchaseCounts: Record<string, number> = {};

    if (userIds.length > 0) {
      const { data: purchases, error: purchasesError } = await adminClient
        .from('report_purchases')
        .select('user_id')
        .in('user_id', userIds);

      if (purchasesError) {
        console.error('Admin users purchase count error:', purchasesError.message);
      } else {
        for (const row of purchases || []) {
          purchaseCounts[row.user_id] = (purchaseCounts[row.user_id] || 0) + 1;
        }
      }
    }

    const usersWithCounts = (users || []).map((u: any) => ({
      ...u,
      purchase_count: purchaseCounts[u.id] || 0,
    }));

    const total = count || 0;
    const totalPages = Math.max(1, Math.ceil(total / limit));

    return c.json({
      users: usersWithCounts,
      total,
      totalPages,
      page,
      limit,
    });
  } catch (err) {
    console.error('Admin users list error:', err);
    return c.json({ error: 'Failed to load users' }, 500);
  }
});

app.get('/admin/users/:id', async (c) => {
  try {
    const { user, error } = await requireAdmin(c);
    if (!user) return c.json({ error: error || 'Unauthorized' }, error === 'Forbidden' ? 403 : 401);

    if (!serviceRoleKey) {
      return c.json({ error: 'SERVICE_ROLE_KEY missing' }, 500);
    }

    const userId = c.req.param('id');
    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: profile, error: profileError } = await adminClient
      .from('profiles')
      .select('id,email,full_name,is_admin,created_at')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      return c.json({ error: 'User not found' }, 404);
    }

    const [
      { count: totalAnalyses },
      { count: totalPurchases },
      { count: paidPurchases },
    ] = await Promise.all([
      adminClient.from('analyses').select('id', { count: 'exact', head: true }).eq('user_id', userId),
      adminClient.from('report_purchases').select('id', { count: 'exact', head: true }).eq('user_id', userId),
      adminClient.from('report_purchases').select('id', { count: 'exact', head: true }).eq('user_id', userId).eq('status', 'paid'),
    ]);

    const { data: revenueRows, error: revenueError } = await adminClient
      .from('report_purchases')
      .select('amount_aed')
      .eq('user_id', userId)
      .eq('status', 'paid');

    if (revenueError) {
      console.error('Admin user revenue error:', revenueError.message);
    }

    const totalSpent = (revenueRows || []).reduce(
      (sum: number, row: any) => sum + (row.amount_aed || 0),
      0
    );

    const { data: purchases } = await adminClient
      .from('report_purchases')
      .select('id,analysis_id,amount_aed,status,created_at,stripe_payment_intent_id')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    const { data: analyses } = await adminClient
      .from('analyses')
      .select('id,created_at,purchase_price,gross_yield,is_paid')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    return c.json({
      user: profile,
      stats: {
        total_analyses: totalAnalyses || 0,
        total_purchases: totalPurchases || 0,
        paid_purchases: paidPurchases || 0,
        total_spent: totalSpent,
      },
      purchases: purchases || [],
      analyses: analyses || [],
    });
  } catch (err) {
    console.error('Admin user details error:', err);
    return c.json({ error: 'Failed to load user details' }, 500);
  }
});

app.put('/admin/users/:id', async (c) => {
  try {
    const { user, error } = await requireAdmin(c);
    if (!user) return c.json({ error: error || 'Unauthorized' }, error === 'Forbidden' ? 403 : 401);

    if (!serviceRoleKey) {
      return c.json({ error: 'SERVICE_ROLE_KEY missing' }, 500);
    }

    const userId = c.req.param('id');
    const payload = await c.req.json();
    const update: Record<string, any> = {};

    if (typeof payload.is_admin === 'boolean') {
      update.is_admin = payload.is_admin;
    }
    if (typeof payload.full_name === 'string') {
      update.full_name = payload.full_name;
    }

    if (Object.keys(update).length === 0) {
      return c.json({ error: 'No valid fields to update' }, 400);
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: updated, error: updateError } = await adminClient
      .from('profiles')
      .update(update)
      .eq('id', userId)
      .select('id,email,full_name,is_admin,created_at')
      .single();

    if (updateError || !updated) {
      console.error('Admin user update error:', updateError?.message);
      return c.json({ error: 'Failed to update user' }, 400);
    }

    return c.json({ user: updated });
  } catch (err) {
    console.error('Admin user update error:', err);
    return c.json({ error: 'Failed to update user' }, 500);
  }
});

app.delete('/admin/users/:id', async (c) => {
  try {
    const { user, error } = await requireAdmin(c);
    if (!user) return c.json({ error: error || 'Unauthorized' }, error === 'Forbidden' ? 403 : 401);

    if (!serviceRoleKey) {
      return c.json({ error: 'SERVICE_ROLE_KEY missing' }, 500);
    }

    const userId = c.req.param('id');
    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { error: deleteError } = await adminClient.auth.admin.deleteUser(userId);

    if (deleteError) {
      console.error('Admin user delete error:', deleteError.message);
      return c.json({ error: 'Failed to delete user' }, 400);
    }

    return c.json({ success: true });
  } catch (err) {
    console.error('Admin user delete error:', err);
    return c.json({ error: 'Failed to delete user' }, 500);
  }
});

// Debug 404 handler to reveal unmatched paths
app.notFound((c) => {
  console.warn("Route not found", c.req.path);
  return c.json({ error: "Not Found", path: c.req.path }, 404);
});

Deno.serve(app.fetch);


