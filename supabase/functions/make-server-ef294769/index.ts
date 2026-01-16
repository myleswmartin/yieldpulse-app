import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import Stripe from "npm:stripe@17";

const app = new Hono();

const hashString = (value: string): string => {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16);
};

const stableStringify = (value: any): string => {
  const seen = new WeakSet();

  const normalize = (input: any): any => {
    if (input === null || input === undefined) return input;
    if (typeof input !== "object") return input;
    if (seen.has(input)) return undefined;
    seen.add(input);

    if (Array.isArray(input)) {
      return input.map((item) => normalize(item));
    }

    const output: Record<string, any> = {};
    const keys = Object.keys(input).sort();
    for (const key of keys) {
      if (key === "timestamp" || key === "signature") continue;
      const normalizedValue = normalize(input[key]);
      if (normalizedValue !== undefined) {
        output[key] = normalizedValue;
      }
    }
    return output;
  };

  return JSON.stringify(normalize(value));
};

const buildAnalysisSignature = (inputs: any, results: any): string | null => {
  try {
    const raw = stableStringify({ inputs, results });
    if (!raw) return null;
    return hashString(raw);
  } catch (err) {
    console.warn("Failed to build analysis signature:", err);
    return null;
  }
};

// Lazy-load Stripe only when needed to prevent initialization errors
let stripeInstance: Stripe | null = null;

function getStripe(): Stripe {
  if (!stripeInstance) {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY environment variable is not set. Please configure Stripe in Supabase Dashboard > Project Settings > Edge Functions > Secrets.");
    }
    stripeInstance = new Stripe(stripeKey, {
      apiVersion: "2024-12-18.acacia",
    });
  }
  return stripeInstance;
}

// Helper: extract human-readable Stripe error
function stripeErrorMessage(err: any): string {
  if (err?.raw?.message) return err.raw.message;
  if (err?.message) return err.message;
  return "Stripe operation failed";
}

const getPlatformSettings = async () => {
  try {
    const stored = await kv.get(PLATFORM_SETTINGS_KEY);
    return sanitizeSettings(stored);
  } catch (err) {
    console.warn("Failed to load platform settings, using defaults", err);
    return sanitizeSettings(null);
  }
};

const ZERO_DECIMAL_CURRENCIES = new Set([
  "BIF","CLP","DJF","GNF","JPY","KMF","KRW","MGA","PYG","RWF","UGX","VND","VUV","XAF","XOF","XPF"
]);

const toStripeUnitAmount = (price: number, currency: string) => {
  const normalized = String(currency || "AED").toUpperCase();
  if (ZERO_DECIMAL_CURRENCIES.has(normalized)) {
    return Math.round(price);
  }
  return Math.round(price * 100);
};

// Admin audit helper (non-blocking)
async function logAdminAction(adminId: string, action: string, data: Record<string, any>) {
  try {
    const payload = {
      admin_id: adminId,
      action,
      data,
      timestamp: new Date().toISOString(),
    };
    await kv.set(`admin_action:${action.toLowerCase()}:${Date.now()}`, payload);
  } catch (err) {
    console.warn("Admin audit log failed:", err);
  }
}

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: [
      "Content-Type",
      "Authorization",
      "apikey",
      "x-client-info",
      "X-Client-Info",
    ],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
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
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { inputs, results } = await c.req.json();
    const signature = buildAnalysisSignature(inputs, results);

    console.log('📝 [Save Analysis] Received data:', {
      hasPropertyName: !!inputs.propertyName,
      propertyName: inputs.propertyName,
      portalSource: inputs.portalSource,
      userId: user.id
    });

    if (signature) {
      const { data: existingAnalysis } = await supabase
        .from("analyses")
        .select("*")
        .eq("user_id", user.id)
        .eq("analysis_signature", signature)
        .maybeSingle();

      if (existingAnalysis) {
        console.log("Duplicate analysis detected, returning existing record", existingAnalysis.id);
        return c.json(existingAnalysis);
      }
    }

    // Map inputs and results to database columns
    const analysisData = {
      user_id: user.id,
      property_name: inputs.propertyName,
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
      analysis_signature: signature,
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
    } = await supabase.auth.getUser();

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
    } = await supabase.auth.getUser();

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
    } = await supabase.auth.getUser();

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

app.patch("/make-server-ef294769/analyses/:id/property-name", async (c) => {
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
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { propertyName } = await c.req.json();

    console.log('🏷️ [Update Property Name] Analysis:', analysisId, 'New name:', propertyName);

    const { data, error } = await supabase
      .from("analyses")
      .update({ property_name: propertyName })
      .eq("id", analysisId)
      .eq("user_id", user.id) // Ensure user owns this analysis
      .select()
      .single();

    if (error) {
      console.error("Error updating property name:", error);
      return c.json({ error: error.message }, 400);
    }

    if (!data) {
      return c.json({ error: "Analysis not found or unauthorized" }, 404);
    }

    return c.json(data);
  } catch (error) {
    console.error("Error in update property name:", error);
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
    } = await supabase.auth.getUser();

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

    // Also delete associated note from KV store
    await kv.del(`analysis_note:${user.id}:${analysisId}`);

    return c.json({ success: true });
  } catch (error) {
    console.error("Error in delete analysis:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

app.get("/make-server-ef294769/analyses/user/me", async (c) => {
  try {
    console.log("[GET /analyses/user/me] Request received");
    const accessToken = c.req.header("Authorization")?.split(" ")[1];

    if (!accessToken) {
      console.error("[GET /analyses/user/me] Missing access token");
      return c.json({ error: "Unauthorized - Missing access token" }, 401);
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

    console.log("[GET /analyses/user/me] Verifying user...");
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      console.error("[GET /analyses/user/me] Auth error:", authError);
      return c.json({ error: "Unauthorized - " + authError.message }, 401);
    }

    if (!user) {
      console.error("[GET /analyses/user/me] No user found");
      return c.json({ error: "Unauthorized - No user found" }, 401);
    }

    console.log("[GET /analyses/user/me] User verified:", user.id);
    console.log("[GET /analyses/user/me] Fetching analyses from database...");

    const { data, error } = await supabase
      .from("analyses")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[GET /analyses/user/me] Database error:", error);
      console.error("[GET /analyses/user/me] Error code:", error.code);
      console.error("[GET /analyses/user/me] Error details:", error.details);
      console.error("[GET /analyses/user/me] Error hint:", error.hint);
      return c.json({ 
        error: `Database error: ${error.message}`,
        code: error.code,
        details: error.details 
      }, 400);
    }

    console.log("[GET /analyses/user/me] Found", data?.length || 0, "analyses");

    // Fetch notes from KV store for all analyses
    console.log("[GET /analyses/user/me] Fetching notes from KV store...");
    const analysesWithNotes = await Promise.all(
      (data || []).map(async (analysis) => {
        try {
          const note = await kv.get(`analysis_note:${user.id}:${analysis.id}`);
          return {
            ...analysis,
            notes: note || null,
          };
        } catch (kvError) {
          console.error("[GET /analyses/user/me] KV error for analysis", analysis.id, kvError);
          // Return analysis without note if KV fails
          return {
            ...analysis,
            notes: null,
          };
        }
      })
    );

    console.log("[GET /analyses/user/me] Successfully returning", analysesWithNotes.length, "analyses with notes");
    return c.json(analysesWithNotes);
  } catch (error) {
    console.error("[GET /analyses/user/me] Unexpected error:", error);
    console.error("[GET /analyses/user/me] Error stack:", error.stack);
    return c.json({ 
      error: "Internal server error: " + (error.message || "Unknown error"),
      stack: error.stack 
    }, 500);
  }
});

// ================================================================
// NOTES ROUTES (Using KV Store)
// ================================================================

app.get("/make-server-ef294769/analyses/:id/note", async (c) => {
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
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Get note from KV store
    const note = await kv.get(`analysis_note:${user.id}:${analysisId}`);

    return c.json({ note: note || null });
  } catch (error) {
    console.error("Error getting note:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

app.put("/make-server-ef294769/analyses/:id/note", async (c) => {
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
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { note } = await c.req.json();

    // Verify user owns this analysis
    const { data: analysis, error: analysisError } = await supabase
      .from("analyses")
      .select("id")
      .eq("id", analysisId)
      .eq("user_id", user.id)
      .single();

    if (analysisError || !analysis) {
      return c.json({ error: "Analysis not found" }, 404);
    }

    // Store note in KV store
    await kv.set(`analysis_note:${user.id}:${analysisId}`, note || "");

    return c.json({ success: true, note });
  } catch (error) {
    console.error("Error saving note:", error);
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
    } = await supabase.auth.getUser();

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
    } = await supabase.auth.getUser();

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
      "https://www.yieldpulse.ae",
      "https://yieldpulse.ae",
    ];

    // Check if origin is allowed (exact match or makeproxy-c.figma.site subdomain or figmaiframepreview.figma.site)
    const isOriginAllowed = allowedOrigins.includes(origin) || 
      (origin.startsWith("https://") && origin.endsWith(".makeproxy-c.figma.site")) ||
      (origin.startsWith("https://") && origin.endsWith(".figmaiframepreview.figma.site")) ||
      (origin.startsWith("https://") && origin.includes(".figma.site"));

    if (!isOriginAllowed) {
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

    const platformSettings = await getPlatformSettings();
    if (!platformSettings.stripeEnabled) {
      return c.json({ error: "Stripe payments are currently disabled" }, 503);
    }
    const currency = platformSettings.currency || "AED";
    const currencyCode = currency.toLowerCase();
    const unitAmount = toStripeUnitAmount(platformSettings.premiumReportPrice, currency);

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
          amount_aed: platformSettings.premiumReportPrice,
          currency: currencyCode,
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
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: currencyCode,
            product_data: {
              name: "YieldPulse Premium Report",
              description: "Unlock full ROI analysis with detailed projections and PDF export",
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      allow_promotion_codes: true,
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

    // Update purchase with Stripe session ID (using service role to bypass RLS)
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );
    
    const { error: updateError } = await supabaseAdmin
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

// ================================================================
// GUEST CHECKOUT - NO AUTH REQUIRED
// ================================================================

app.post("/make-server-ef294769/stripe/guest-checkout-session", async (c) => {
  console.log("Guest checkout: Received request");
  try {
    const { inputs, results, origin } = await c.req.json();
    console.log("Guest checkout: Parsed request body", { origin });

    if (!inputs || !results || !origin) {
      console.error("Guest checkout: Missing required fields");
      return c.json({ error: "inputs, results, and origin are required" }, 400);
    }

    // Origin allowlist
    const allowedOrigins = [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://makeproxy-c.figma.site",
      "https://yieldpulse.vercel.app",
      "https://www.yieldpulse.ae",
      "https://yieldpulse.ae",
    ];

    // Check if origin is allowed (exact match or makeproxy-c.figma.site subdomain or figmaiframepreview.figma.site)
    const isOriginAllowed = allowedOrigins.includes(origin) || 
      (origin.startsWith("https://") && origin.endsWith(".makeproxy-c.figma.site")) ||
      (origin.startsWith("https://") && origin.endsWith(".figmaiframepreview.figma.site")) ||
      (origin.startsWith("https://") && origin.includes(".figma.site"));

    if (!isOriginAllowed) {
      console.error("Guest checkout: Origin not allowed:", origin);
      return c.json({ error: "Origin not allowed" }, 403);
    }

    const platformSettings = await getPlatformSettings();
    if (!platformSettings.stripeEnabled) {
      return c.json({ error: "Stripe payments are currently disabled" }, 503);
    }
    const currency = platformSettings.currency || "AED";
    const currencyCode = currency.toLowerCase();
    const unitAmount = toStripeUnitAmount(platformSettings.premiumReportPrice, currency);

    // Generate a unique purchase ID for guest checkout
    const guestPurchaseId = crypto.randomUUID();
    
    // Create snapshot from inputs and results
    const snapshot = {
      inputs: {
        property_name: inputs.propertyName ?? inputs.property_name ?? null,
        portal_source: inputs.portalSource,
        listing_url: inputs.listingUrl,
        purchase_price: inputs.purchasePrice,
        expected_monthly_rent: inputs.expectedMonthlyRent,
        down_payment_percent: inputs.downPaymentPercent,
        mortgage_interest_rate: inputs.mortgageInterestRate,
        loan_term_years: inputs.mortgageTermYears,
        service_charge_per_year: inputs.serviceChargeAnnual,
        maintenance_per_year: inputs.annualMaintenancePercent,
        property_management_fee: inputs.propertyManagementFeePercent,
        vacancy_rate: inputs.vacancyRatePercent || 0,
        rent_growth_rate: inputs.rentGrowthPercent || 0,
        capital_growth_rate: inputs.capitalGrowthPercent || 0,
        holding_period_years: inputs.holdingPeriodYears || 5,
        area_sqft: inputs.areaSqft,
        dld_fee_percent: inputs.dldFeePercent || 4,
        agent_fee_percent: inputs.agentFeePercent || 2,
      },
      results: results,
      metadata: {
        report_version: "v1",
        generated_at: new Date().toISOString(),
        guest_purchase: true,
        purchase_id: guestPurchaseId,
      },
    };

    // Store guest purchase data in KV store (temporary storage until user signs up)
    const guestPurchaseData = {
      id: guestPurchaseId,
      amount_aed: platformSettings.premiumReportPrice,
      currency: currencyCode,
      status: "pending",
      report_version: "v1",
      snapshot: snapshot,
      created_at: new Date().toISOString(),
      guest_purchase: true,
    };

    await kv.set(`guest_purchase:${guestPurchaseId}`, guestPurchaseData);
    console.log("Guest checkout: Stored guest purchase in KV", guestPurchaseId);

    // Create Stripe checkout session
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: currencyCode,
            product_data: {
              name: "YieldPulse Premium Report",
              description: "Unlock full ROI analysis with detailed projections and PDF export",
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      allow_promotion_codes: true,
      mode: "payment",
      customer_email: undefined, // Will be collected at checkout
      success_url: `${origin}/payment-success?purchaseId=${guestPurchaseId}&guest=true`,
      cancel_url: `${origin}/results?payment=cancelled`,
      metadata: {
        platform: "yieldpulse",
        purchase_id: guestPurchaseId,
        guest_purchase: "true",
        environment: Deno.env.get("ENVIRONMENT") || "production",
      },
    });

    // Update KV store with Stripe session ID
    guestPurchaseData.stripe_checkout_session_id = session.id;
    await kv.set(`guest_purchase:${guestPurchaseId}`, guestPurchaseData);

    console.log("Guest checkout session created:", session.id);
    return c.json({ 
      url: session.url,
      purchaseId: guestPurchaseId,
    });
  } catch (error) {
    console.error("Guest checkout error:", error);
    return c.json({ error: "Failed to create guest checkout session" }, 500);
  }
});

// ================================================================
// GUEST PURCHASE CLAIM (attach guest purchase to authenticated user)
// ================================================================
app.post("/make-server-ef294769/guest/claim", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const anonSupabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      {
        global: { headers: { Authorization: `Bearer ${accessToken}` } },
        auth: { autoRefreshToken: false, persistSession: false },
      }
    );

    const { data: { user }, error: authError } =
      await anonSupabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey =
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ??
      Deno.env.get("SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      return c.json({ error: "Missing service role key on server" }, 500);
    }

    const { purchaseId } = await c.req.json();
    if (!purchaseId) {
      return c.json({ error: "purchaseId is required" }, 400);
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // If already claimed, return existing record
    const { data: existingPurchase } = await adminClient
      .from("report_purchases")
      .select("id, user_id, analysis_id, status")
      .eq("id", purchaseId)
      .maybeSingle();

    if (existingPurchase) {
      if (existingPurchase.user_id !== user.id) {
        return c.json({ error: "Purchase already claimed by another user" }, 403);
      }
      return c.json({
        claimed: true,
        purchaseId: existingPurchase.id,
        analysisId: existingPurchase.analysis_id,
        status: existingPurchase.status,
      });
    }

    const guestKey = `guest_purchase:${purchaseId}`;
    const guestPurchase = await kv.get(guestKey);

    if (!guestPurchase) {
      return c.json({ error: "Guest purchase not found" }, 404);
    }

    if (guestPurchase.status !== "paid") {
      // Try to verify payment directly with Stripe if webhook is delayed/missed
      if (guestPurchase.stripe_checkout_session_id) {
        try {
          const stripe = getStripe();
          const session = await stripe.checkout.sessions.retrieve(
            guestPurchase.stripe_checkout_session_id
          );

          const paymentStatus = session.payment_status;
          const sessionStatus = session.status;

          if (paymentStatus === "paid" || sessionStatus === "complete") {
            guestPurchase.status = "paid";
            guestPurchase.purchased_at = new Date().toISOString();
            guestPurchase.stripe_payment_intent_id = session.payment_intent as string;
            await kv.set(guestKey, guestPurchase);
          }
        } catch (stripeError) {
          console.error("Guest claim: Stripe verify failed", stripeError);
        }
      }

      if (guestPurchase.status !== "paid") {
        return c.json({ error: "Purchase not completed yet" }, 400);
      }
    }

    const snapshot = guestPurchase.snapshot || {};
    const inputs = snapshot.inputs || {};
    const results = snapshot.results || {};
    const guestSignature = buildAnalysisSignature(inputs, results);

    const propertyName = inputs.property_name ?? inputs.propertyName ?? null;
    const portalSource = inputs.portal_source ?? inputs.portalSource ?? "Other";
    const listingUrl = inputs.listing_url ?? inputs.listingUrl ?? null;
    const areaSqft = inputs.area_sqft ?? inputs.areaSqft;
    const purchasePrice = inputs.purchase_price ?? inputs.purchasePrice;
    const downPaymentPercent = inputs.down_payment_percent ?? inputs.downPaymentPercent;
    const mortgageInterestRate = inputs.mortgage_interest_rate ?? inputs.mortgageInterestRate;
    const mortgageTermYears =
      inputs.mortgage_term_years ??
      inputs.loan_term_years ??
      inputs.mortgageTermYears;
    const expectedMonthlyRent = inputs.expected_monthly_rent ?? inputs.expectedMonthlyRent;

    if (
      areaSqft == null ||
      purchasePrice == null ||
      downPaymentPercent == null ||
      mortgageInterestRate == null ||
      mortgageTermYears == null ||
      expectedMonthlyRent == null
    ) {
      return c.json({ error: "Guest snapshot missing required fields" }, 400);
    }

    const analysisData = {
      user_id: user.id,
      property_name: propertyName,
      portal_source: portalSource,
      listing_url: listingUrl,
      area_sqft: areaSqft,
      purchase_price: purchasePrice,
      down_payment_percent: downPaymentPercent,
      mortgage_interest_rate: mortgageInterestRate,
      mortgage_term_years: mortgageTermYears,
      expected_monthly_rent: expectedMonthlyRent,
      service_charge_annual: inputs.service_charge_per_year ?? inputs.serviceChargeAnnual ?? 0,
      annual_maintenance_percent: inputs.maintenance_per_year ?? inputs.annualMaintenancePercent ?? 1,
      property_management_fee_percent: inputs.property_management_fee ?? inputs.propertyManagementFeePercent ?? 5,
      dld_fee_percent: inputs.dld_fee_percent ?? inputs.dldFeePercent ?? 4,
      agent_fee_percent: inputs.agent_fee_percent ?? inputs.agentFeePercent ?? 2,
      capital_growth_percent: inputs.capital_growth_rate ?? inputs.capitalGrowthPercent ?? 3,
      rent_growth_percent: inputs.rent_growth_rate ?? inputs.rentGrowthPercent ?? 2,
      vacancy_rate_percent: inputs.vacancy_rate ?? inputs.vacancyRatePercent ?? 5,
      holding_period_years: inputs.holding_period_years ?? inputs.holdingPeriodYears ?? 5,
      gross_yield: results.grossRentalYield ?? results.gross_yield,
      net_yield: results.netRentalYield ?? results.net_yield,
      monthly_cash_flow: results.monthlyCashFlow ?? results.monthly_cash_flow,
      annual_cash_flow: results.annualCashFlow ?? results.annual_cash_flow,
      cash_on_cash_return: results.cashOnCashReturn ?? results.cash_on_cash_return,
      calculation_results: results,
      analysis_signature: guestSignature,
      is_paid: true,
    };

    let finalAnalysisId: string | null = null;

    if (guestSignature) {
      const { data: existingAnalysis } = await adminClient
        .from("analyses")
        .select("id")
        .eq("user_id", user.id)
        .eq("analysis_signature", guestSignature)
        .maybeSingle();
      if (existingAnalysis) {
        finalAnalysisId = existingAnalysis.id;
      }
    }

    let analysis: any = null;

    if (!finalAnalysisId) {
      const { data, error: analysisError } = await adminClient
        .from("analyses")
        .insert(analysisData)
        .select()
        .single();

      if (analysisError || !data) {
        console.error("Guest claim: failed to create analysis", analysisError);
        return c.json({ error: "Failed to create analysis" }, 500);
      }

      analysis = data;
      finalAnalysisId = data.id;
    } else {
      const { data: existing, error: fetchError } = await adminClient
        .from("analyses")
        .select("*")
        .eq("id", finalAnalysisId)
        .single();
      if (fetchError || !existing) {
        console.error("Guest claim: failed to load existing analysis", fetchError);
        return c.json({ error: "Failed to load claimed analysis" }, 500);
      }
      analysis = existing;
    }

    const purchaseInsert = {
      id: purchaseId,
      user_id: user.id,
      analysis_id: analysis.id,
      stripe_checkout_session_id: guestPurchase.stripe_checkout_session_id,
      stripe_payment_intent_id: guestPurchase.stripe_payment_intent_id,
      amount_aed: guestPurchase.amount_aed ?? 49,
      currency: guestPurchase.currency ?? "aed",
      status: "paid",
      purchased_at: guestPurchase.purchased_at ?? new Date().toISOString(),
      report_version: guestPurchase.report_version ?? "v1",
      snapshot: snapshot,
    };

    const { error: purchaseError } = await adminClient
      .from("report_purchases")
      .insert(purchaseInsert);

    if (purchaseError) {
      console.error("Guest claim: failed to create purchase", purchaseError);
      return c.json({ error: "Failed to create purchase record" }, 500);
    }

    await kv.del(guestKey);

    return c.json({
      claimed: true,
      purchaseId: purchaseId,
      analysisId: analysis.id,
    });
  } catch (error: any) {
    console.error("Guest claim error:", error);
    return c.json(
      { error: `Failed to claim guest purchase${error?.message ? `: ${error.message}` : ""}` },
      500
    );
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

// ================================================================
// ADMIN API ROUTES
// ================================================================

// Middleware to verify admin access
async function verifyAdminAccess(c: any): Promise<{ user: any; supabase: any } | Response> {
  const accessToken = c.req.header("Authorization")?.split(" ")[1];
  if (!accessToken) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Verify user authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
  
  if (authError || !user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  // Check if user is admin
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (profileError || !profile || !profile.is_admin) {
    return c.json({ error: "Forbidden - Admin access required" }, 403);
  }

  return { user, supabase };
}

// ================================================================
// ADMIN - USER MANAGEMENT
// ================================================================

// Get all users with pagination and filtering
app.get("/make-server-ef294769/admin/users", async (c) => {
  try {
    const auth = await verifyAdminAccess(c);
    if (auth instanceof Response) return auth;
    const { supabase } = auth;

    const page = parseInt(c.req.query("page") || "1");
    const limit = parseInt(c.req.query("limit") || "20");
    const search = c.req.query("search") || "";
    const adminFilter = c.req.query("admin_filter");
    
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('profiles')
      .select('*', { count: 'exact' });

    // Apply search filter
    if (search) {
      query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`);
    }

    // Apply admin filter
    if (adminFilter === 'true') {
      query = query.eq('is_admin', true);
    } else if (adminFilter === 'false') {
      query = query.eq('is_admin', false);
    }

    const { data: users, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    // Get purchase counts for each user
    const userIds = users?.map(u => u.id) || [];
    const { data: purchaseCounts } = await supabase
      .from('report_purchases')
      .select('user_id')
      .eq('status', 'paid')
      .in('user_id', userIds);

    // Count purchases per user
    const purchaseCountMap = (purchaseCounts || []).reduce((acc: any, p: any) => {
      acc[p.user_id] = (acc[p.user_id] || 0) + 1;
      return acc;
    }, {});

    // Enhance user data
    const enhancedUsers = users?.map(user => ({
      ...user,
      purchase_count: purchaseCountMap[user.id] || 0
    }));

    return c.json({
      users: enhancedUsers,
      total: count,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    });
  } catch (error) {
    console.error("Admin users list error:", error);
    return c.json({ error: "Failed to fetch users" }, 500);
  }
});

// Get single user details
app.get("/make-server-ef294769/admin/users/:userId", async (c) => {
  try {
    const auth = await verifyAdminAccess(c);
    if (auth instanceof Response) return auth;
    const { supabase } = auth;

    const userId = c.req.param("userId");

    const { data: user, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;

    // Get user's analyses
    const { data: analyses, error: analysesError } = await supabase
      .from('analyses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (analysesError) throw analysesError;

    // Get user's purchases
    const { data: purchases, error: purchasesError } = await supabase
      .from('report_purchases')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (purchasesError) throw purchasesError;

    return c.json({
      user,
      analyses,
      purchases,
      stats: {
        total_analyses: analyses?.length || 0,
        total_purchases: purchases?.length || 0,
        paid_purchases: purchases?.filter(p => p.status === 'paid').length || 0,
        total_spent: purchases
          ?.filter(p => p.status === 'paid')
          .reduce((sum, p) => sum + p.amount_aed, 0) || 0
      }
    });
  } catch (error) {
    console.error("Admin user details error:", error);
    return c.json({ error: "Failed to fetch user details" }, 500);
  }
});

// Update user (toggle admin, etc.)
app.put("/make-server-ef294769/admin/users/:userId", async (c) => {
  try {
    const auth = await verifyAdminAccess(c);
    if (auth instanceof Response) return auth;
    const { supabase } = auth;

    const userId = c.req.param("userId");
    const updates = await c.req.json();

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    return c.json(data);
  } catch (error) {
    console.error("Admin update user error:", error);
    return c.json({ error: "Failed to update user" }, 500);
  }
});

// Delete user
app.delete("/make-server-ef294769/admin/users/:userId", async (c) => {
  try {
    const auth = await verifyAdminAccess(c);
    if (auth instanceof Response) return auth;
    const { supabase } = auth;

    const userId = c.req.param("userId");

    // Delete user from auth (cascade will handle related data)
    const { error } = await supabase.auth.admin.deleteUser(userId);

    if (error) throw error;

    return c.json({ success: true });
  } catch (error) {
    console.error("Admin delete user error:", error);
    return c.json({ error: "Failed to delete user" }, 500);
  }
});

// ================================================================
// ADMIN - PURCHASE MANAGEMENT
// ================================================================

// Get all purchases with pagination and filtering
app.get("/make-server-ef294769/admin/purchases", async (c) => {
  try {
    const auth = await verifyAdminAccess(c);
    if (auth instanceof Response) return auth;
    const { supabase } = auth;

    const page = parseInt(c.req.query("page") || "1");
    const limit = parseInt(c.req.query("limit") || "20");
    const status = c.req.query("status");
    const rawSearch = c.req.query("search");
    const search =
      !rawSearch || rawSearch === "undefined" || rawSearch === "null"
        ? ""
        : rawSearch;
    
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('report_purchases')
      .select(
        `
        *,
        analyses!report_purchases_analysis_id_fkey(property_name, portal_source, purchase_price, expected_monthly_rent, gross_yield)
      `,
        { count: 'exact' },
      );

    // Apply status filter
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    // Apply search filter (by user email or purchase ID)
    if (search) {
      query = query.or(`id.ilike.%${search}%,user_id.ilike.%${search}%`);
    }

    const { data: purchases, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    // hydrate profiles separately
    const userIds = Array.from(new Set((purchases || []).map((p: any) => p.user_id).filter(Boolean)));
    let profileMap = new Map<string, { email?: string; full_name?: string }>();
    if (userIds.length > 0) {
      const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("id, email, full_name")
        .in("id", userIds);
      if (profileError) {
        console.error("Admin purchases profile lookup error:", profileError);
      } else {
        profileMap = new Map(
          (profiles || []).map((p: any) => [p.id, { email: p.email, full_name: p.full_name }]),
        );
      }
    }

    const hydrated = (purchases || []).map((p: any) => ({
      ...p,
      user_email: profileMap.get(p.user_id)?.email || null,
      user_full_name: profileMap.get(p.user_id)?.full_name || null,
      property_name: p.property_name || p.analyses?.property_name || null,
      portal_source: p.portal_source || p.analyses?.portal_source || null,
    }));

    return c.json({
      purchases: hydrated,
      total: count,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    });
  } catch (error) {
    console.error("Admin purchases list error:", error);
    return c.json({ error: "Failed to fetch purchases" }, 500);
  }
});

// Get single purchase details
app.get("/make-server-ef294769/admin/purchases/:purchaseId", async (c) => {
  try {
    const auth = await verifyAdminAccess(c);
    if (auth instanceof Response) return auth;
    const { supabase } = auth;

    const purchaseId = c.req.param("purchaseId");

    const { data: purchase, error } = await supabase
      .from('report_purchases')
      .select(`*`)
      .eq('id', purchaseId)
      .single();

    if (error || !purchase) throw error || new Error("Purchase not found");

    let profile = null;
    if (purchase.user_id) {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', purchase.user_id)
        .single();
      if (!profileError) profile = profileData;
    }

    let analysis = null;
    if (purchase.analysis_id) {
      const { data: analysisData, error: analysisError } = await supabase
        .from('analyses')
        .select('*')
        .eq('id', purchase.analysis_id)
        .single();
      if (!analysisError) analysis = analysisData;
    }

    return c.json({
      ...purchase,
      profile,
      analysis,
    });
  } catch (error) {
    console.error("Admin purchase details error:", error);
    return c.json({ error: "Failed to fetch purchase details" }, 500);
  }
});

// Manual unlock (mark as paid without Stripe)
app.post("/make-server-ef294769/admin/purchases/:purchaseId/unlock", async (c) => {
  try {
    const auth = await verifyAdminAccess(c);
    if (auth instanceof Response) return auth;
    const { supabase, user } = auth;

    const purchaseId = c.req.param("purchaseId");
    const { reason } = await c.req.json();

    const { data, error } = await supabase
      .from('report_purchases')
      .update({
        status: 'paid',
        purchased_at: new Date().toISOString(),
        stripe_payment_intent_id: `manual_unlock_by_${user.id}`,
      })
      .eq('id', purchaseId)
      .select()
      .single();

    if (error) throw error;

    // Log the manual unlock
    await kv.set(`admin_action:unlock:${purchaseId}:${Date.now()}`, {
      admin_id: user.id,
      purchase_id: purchaseId,
      action: 'manual_unlock',
      reason,
      timestamp: new Date().toISOString()
    });

    return c.json(data);
  } catch (error) {
    console.error("Admin manual unlock error:", error);
    return c.json({ error: "Failed to unlock purchase" }, 500);
  }
});

// Process refund
app.post("/make-server-ef294769/admin/purchases/:purchaseId/refund", async (c) => {
  try {
    const auth = await verifyAdminAccess(c);
    if (auth instanceof Response) return auth;
    const { supabase, user } = auth;

    const purchaseId = c.req.param("purchaseId");
    const { reason, refund_stripe } = await c.req.json();

    // Get purchase details
    const { data: purchase, error: fetchError } = await supabase
      .from('report_purchases')
      .select('*')
      .eq('id', purchaseId)
      .single();

    if (fetchError || !purchase) {
      return c.json({ error: "Purchase not found" }, 404);
    }

    // Process Stripe refund if requested and payment intent exists
    if (refund_stripe && purchase.stripe_payment_intent_id && !purchase.stripe_payment_intent_id.startsWith('manual_')) {
      const stripe = getStripe();
      try {
        await stripe.refunds.create({
          payment_intent: purchase.stripe_payment_intent_id,
          reason: 'requested_by_customer'
        });
      } catch (stripeError) {
        console.error("Stripe refund error:", stripeError);
        return c.json({ error: "Failed to process Stripe refund" }, 500);
      }
    }

    // Update purchase status
    const { data, error } = await supabase
      .from('report_purchases')
      .update({ status: 'refunded' })
      .eq('id', purchaseId)
      .select()
      .single();

    if (error) throw error;

    // Log the refund
    await kv.set(`admin_action:refund:${purchaseId}:${Date.now()}`, {
      admin_id: user.id,
      purchase_id: purchaseId,
      action: 'refund',
      reason,
      refund_stripe,
      timestamp: new Date().toISOString()
    });

    return c.json(data);
  } catch (error) {
    console.error("Admin refund error:", error);
    return c.json({ error: "Failed to process refund" }, 500);
  }
});

// ================================================================
// ADMIN - WEBHOOK MONITORING
// ================================================================

// Get webhook logs (direct from Stripe Events API)
app.get("/make-server-ef294769/admin/webhooks", async (c) => {
  try {
    const auth = await verifyAdminAccess(c);
    if (auth instanceof Response) return auth;

    const limit = Math.min(parseInt(c.req.query("limit") || "50", 10), 100);
    const startingAfter = c.req.query("starting_after") || undefined;
    const endingBefore = c.req.query("ending_before") || undefined;
    const type = c.req.query("type") || undefined;

    const stripe = getStripe();
    const events = await stripe.events.list({
      limit,
      ...(startingAfter ? { starting_after: startingAfter } : {}),
      ...(endingBefore ? { ending_before: endingBefore } : {}),
      ...(type ? { type } : {}),
    });

    const logs = (events.data || []).map((evt: any) => {
      const obj = evt.data?.object || {};
      const status =
        evt.type?.includes("failed") || evt.type?.includes("error") ? "failed" : "success";
      const errorMessage =
        obj?.last_payment_error?.message ||
        obj?.failure_message ||
        (status === "failed" ? "Stripe event indicates failure" : null);
      const sessionId = obj?.object === "checkout.session" ? obj.id : undefined;
      const createdAt = evt.created ? new Date(evt.created * 1000).toISOString() : new Date().toISOString();

      return {
        id: evt.id,
        event_id: evt.id,
        event_type: evt.type,
        status,
        source: "stripe",
        payload: obj,
        response: null,
        error_message: errorMessage,
        attempts: 1,
        next_retry: null,
        created_at: createdAt,
        processed_at: createdAt,
        session_id: sessionId,
      };
    });

    return c.json({
      logs,
      has_more: events.has_more || false,
      next_cursor: events.data?.length ? events.data[events.data.length - 1].id : null,
    });
  } catch (error) {
    console.error("Admin webhooks error:", error);
    return c.json({ error: "Failed to fetch webhook logs" }, 500);
  }
});

// Retry webhook processing
app.post("/make-server-ef294769/admin/webhooks/:sessionId/retry", async (c) => {
  try {
    const auth = await verifyAdminAccess(c);
    if (auth instanceof Response) return auth;
    const { supabase } = auth;

    const sessionId = c.req.param("sessionId");

    // Get purchase by session ID
    const { data: purchase, error } = await supabase
      .from('report_purchases')
      .select('*')
      .eq('stripe_checkout_session_id', sessionId)
      .single();

    if (error || !purchase) {
      return c.json({ error: "Purchase not found" }, 404);
    }

    // Verify with Stripe
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid' && purchase.status !== 'paid') {
      // Update to paid
      const { data: updated, error: updateError } = await supabase
        .from('report_purchases')
        .update({
          status: 'paid',
          stripe_payment_intent_id: session.payment_intent as string,
          purchased_at: new Date().toISOString(),
        })
        .eq('id', purchase.id)
        .select()
        .single();

      if (updateError) throw updateError;

      return c.json({ success: true, updated: true, purchase: updated });
    }

    return c.json({ success: true, updated: false, status: session.payment_status });
  } catch (error) {
    console.error("Admin webhook retry error:", error);
    return c.json({ error: "Failed to retry webhook" }, 500);
  }
});

// ================================================================
// ADMIN - SUPPORT TICKETS
// ================================================================

const mapSubjectToCategory = (subject: string | null | undefined) => {
  const normalized = (subject || "").toLowerCase();
  if (normalized.includes("technical")) return "technical";
  if (normalized.includes("premium") || normalized.includes("billing")) return "billing";
  if (normalized.includes("feature")) return "feature-request";
  return "general";
};

const mapDbStatusToUi = (status: string | null | undefined) => {
  switch (status) {
    case "in_progress":
    case "waiting_on_customer":
      return "in-progress";
    case "resolved":
      return "resolved";
    case "closed":
      return "closed";
    default:
      return "open";
  }
};

const mapUiStatusToDb = (status: string | null | undefined) => {
  switch (status) {
    case "in-progress":
      return "in_progress";
    case "resolved":
      return "resolved";
    case "closed":
      return "closed";
    case "open":
    default:
      return "open";
  }
};

// Get all support tickets
app.get("/make-server-ef294769/admin/support/tickets", async (c) => {
  try {
    const auth = await verifyAdminAccess(c);
    if (auth instanceof Response) return auth;

    const status = c.req.query("status") || "all";
    const page = parseInt(c.req.query("page") || "1");
    const limit = parseInt(c.req.query("limit") || "20");
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = auth.supabase
      .from("support_tickets")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (status !== "all") {
      const dbStatus = mapUiStatusToDb(status);
      if (dbStatus === "in_progress") {
        query = query.in("status", ["in_progress", "waiting_on_customer"]);
      } else {
        query = query.eq("status", dbStatus);
      }
    }

    const { data: dbTickets, error: dbError, count } = await query;
    if (dbError) {
      console.error("Admin tickets list error:", dbError);
      return c.json({ error: "Failed to fetch tickets" }, 500);
    }

    const paginatedTickets = dbTickets || [];

    // Hydrate profile data + message counts
    const userIds = Array.from(
      new Set((paginatedTickets || []).map((t: any) => t.user_id).filter(Boolean))
    );
    let profileMap = new Map<string, { full_name?: string; email?: string }>();
    if (userIds.length > 0) {
      const { data: profiles, error: profileError } = await auth.supabase
        .from("profiles")
        .select("id, full_name, email")
        .in("id", userIds);
      if (!profileError) {
        profileMap = new Map(
          (profiles || []).map((p: any) => [p.id, { full_name: p.full_name, email: p.email }])
        );
      }
    }

    const ticketsWithMeta = await Promise.all(
      (paginatedTickets || []).map(async (t: any) => {
        const messages = await kv.getByPrefix(`support_message:${t.id}:`);
        const responseCount = Math.max((messages?.length || 0) - 1, 0);
        const profile = profileMap.get(t.user_id);
        return {
          ...t,
          status: mapDbStatusToUi(t.status),
          category: t.category || mapSubjectToCategory(t.subject),
          ticket_number: `SUP-${t.id.slice(0, 6).toUpperCase()}`,
          user_name: profile?.full_name || t.user_name || null,
          user_email: profile?.email || t.user_email || null,
          responses: responseCount,
        };
      })
    );

    return c.json({
      tickets: ticketsWithMeta,
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    });
  } catch (error) {
    console.error("Admin tickets list error:", error);
    return c.json({ error: "Failed to fetch tickets" }, 500);
  }
});

// Get single ticket
app.get("/make-server-ef294769/admin/support/tickets/:ticketId", async (c) => {
  try {
    const auth = await verifyAdminAccess(c);
    if (auth instanceof Response) return auth;

    const ticketId = c.req.param("ticketId");
    const { data: ticket, error: ticketError } = await auth.supabase
      .from("support_tickets")
      .select("*")
      .eq("id", ticketId)
      .maybeSingle();

    if (ticketError || !ticket) {
      return c.json({ error: "Ticket not found" }, 404);
    }

    // Get ticket messages
    const messages = await kv.getByPrefix(`support_message:${ticketId}:`);
    const sortedMessages = messages.sort((a: any, b: any) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
    if (sortedMessages.length === 0 && ticket.message) {
      sortedMessages.push({
        id: `contact-${ticketId}`,
        ticket_id: ticketId,
        user_id: null,
        message: ticket.message,
        is_admin: false,
        is_internal: false,
        created_at: ticket.created_at || new Date().toISOString(),
      });
    }

    let profile = null;
    if (ticket.user_id) {
      const { data: profileData, error: profileError } = await auth.supabase
        .from("profiles")
        .select("id, full_name, email")
        .eq("id", ticket.user_id)
        .maybeSingle();
      if (!profileError) profile = profileData;
    }

    return c.json({
      ticket: {
        ...ticket,
        ticket_number: `SUP-${ticket.id.slice(0, 6).toUpperCase()}`,
        user_name: profile?.full_name || ticket.user_name || null,
        user_email: profile?.email || ticket.user_email || ticket.email || null,
        status: mapDbStatusToUi(ticket.status),
        category: ticket.category || mapSubjectToCategory(ticket.subject),
      },
      messages: sortedMessages
    });
  } catch (error) {
    console.error("Admin ticket details error:", error);
    return c.json({ error: "Failed to fetch ticket" }, 500);
  }
});

// Update ticket status
app.put("/make-server-ef294769/admin/support/tickets/:ticketId", async (c) => {
  try {
    const auth = await verifyAdminAccess(c);
    if (auth instanceof Response) return auth;
    const { user } = auth;

    const ticketId = c.req.param("ticketId");
    const { status, assigned_to } = await c.req.json();

    const dbStatus = status ? mapUiStatusToDb(status) : undefined;
    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
      updated_by: user.id,
    };
    if (dbStatus) updatePayload.status = dbStatus;
    if (assigned_to !== undefined) updatePayload.assigned_to = assigned_to;

    const { data: updatedTicket, error: updateError } = await auth.supabase
      .from("support_tickets")
      .update(updatePayload)
      .eq("id", ticketId)
      .select("*")
      .maybeSingle();

    if (updateError || !updatedTicket) {
      return c.json({ error: "Ticket not found" }, 404);
    }

    return c.json({
      ...updatedTicket,
      status: mapDbStatusToUi(updatedTicket.status),
    });
  } catch (error) {
    console.error("Admin update ticket error:", error);
    return c.json({ error: "Failed to update ticket" }, 500);
  }
});

// Reply to ticket
app.post("/make-server-ef294769/admin/support/tickets/:ticketId/reply", async (c) => {
  try {
    const auth = await verifyAdminAccess(c);
    if (auth instanceof Response) return auth;
    const { user } = auth;

    const ticketId = c.req.param("ticketId");
    const { message, internal } = await c.req.json();

    const { data: ticket, error: ticketError } = await auth.supabase
      .from("support_tickets")
      .select("*")
      .eq("id", ticketId)
      .maybeSingle();

    if (ticketError || !ticket) {
      return c.json({ error: "Ticket not found" }, 404);
    }

    const messageId = crypto.randomUUID();
    const newMessage = {
      id: messageId,
      ticket_id: ticketId,
      user_id: user.id,
      message,
      is_admin: true,
      is_internal: internal || false,
      created_at: new Date().toISOString()
    };

    await kv.set(`support_message:${ticketId}:${messageId}`, newMessage);

    // Update ticket's updated_at for visibility in admin UI
    await auth.supabase
      .from("support_tickets")
      .update({ updated_at: new Date().toISOString(), updated_by: user.id })
      .eq("id", ticketId);

    return c.json(newMessage);
  } catch (error) {
    console.error("Admin ticket reply error:", error);
    return c.json({ error: "Failed to send reply" }, 500);
  }
});

// ================================================================
// ADMIN - AUDIT LOG
// ================================================================

// Get audit log
app.get("/make-server-ef294769/admin/audit-log", async (c) => {
  try {
    const auth = await verifyAdminAccess(c);
    if (auth instanceof Response) return auth;

    const page = parseInt(c.req.query("page") || "1");
    const limit = parseInt(c.req.query("limit") || "50");
    const action = c.req.query("action");

    // Get all admin actions from KV
    const allActions = await kv.getByPrefix('admin_action:');
    
    // Filter by action type if specified
    let filteredActions = allActions;
    if (action && action !== 'all') {
      filteredActions = allActions.filter((a: any) => a.action === action);
    }

    // Sort by timestamp descending
    const sortedActions = filteredActions.sort((a: any, b: any) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // Paginate
    const from = (page - 1) * limit;
    const to = from + limit;
    const paginatedActions = sortedActions.slice(from, to);

    return c.json({
      actions: paginatedActions,
      total: sortedActions.length,
      page,
      limit,
      totalPages: Math.ceil(sortedActions.length / limit)
    });
  } catch (error) {
    console.error("Admin audit log error:", error);
    return c.json({ error: "Failed to fetch audit log" }, 500);
  }
});

// ================================================================
// ADMIN - STATISTICS
// ================================================================

// Get admin dashboard statistics (v2 - force rebuild)
app.get("/make-server-ef294769/admin/stats", async (c:any) => {
  try {
    const auth = await verifyAdminAccess(c);
    if (auth instanceof Response) return auth;
    const { supabase } = auth;

    const rangeParam = c.req.query("range") || "30";
    const rangeDays = ["7", "30", "90"].includes(rangeParam) ? parseInt(rangeParam, 10) : 30;

    const endDate = new Date();
    endDate.setUTCHours(0, 0, 0, 0);
    const startDate = new Date(endDate);
    startDate.setUTCDate(endDate.getUTCDate() - (rangeDays - 1));
    const startIso = startDate.toISOString();

    const dateKey = (date: Date) => date.toISOString().slice(0, 10);
    const labelFromKey = (key: string) => {
      const parsed = new Date(`${key}T00:00:00Z`);
      return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    };

    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    const { count: totalAnalyses } = await supabase
      .from('analyses')
      .select('*', { count: 'exact', head: true });

    const { data: allPurchases } = await supabase
      .from('report_purchases')
      .select('amount_aed, status, created_at, user_id');

    const paidPurchases = allPurchases?.filter(p => p.status === 'paid') || [];
    const totalRevenue = paidPurchases.reduce((sum, p) => sum + Number(p.amount_aed || 0), 0);

    const paidUserIds = new Set(paidPurchases.map(p => p.user_id).filter(Boolean));
    const conversionRate = totalUsers ? (paidUserIds.size / totalUsers) * 100 : 0;

    const { count: pendingPurchases } = await supabase
      .from('report_purchases')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    // Get open tickets count
    const allTickets = await kv.getByPrefix('support_ticket:');
    const openTickets = allTickets.filter((t: any) => t.status === 'open' || t.status === 'in_progress');

    // Recent activity (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const recentPurchases = allPurchases?.filter(p => p.created_at >= sevenDaysAgo).length || 0;

    // Revenue by day (paid purchases only in range)
    const { data: paidPurchasesRange } = await supabase
      .from('report_purchases')
      .select('amount_aed, created_at')
      .eq('status', 'paid')
      .gte('created_at', startIso);

    const revenueMap = new Map<string, { revenue: number; purchases: number }>();
    for (let i = 0; i < rangeDays; i += 1) {
      const day = new Date(startDate);
      day.setUTCDate(startDate.getUTCDate() + i);
      revenueMap.set(dateKey(day), { revenue: 0, purchases: 0 });
    }

    (paidPurchasesRange || []).forEach((purchase) => {
      const dayKey = dateKey(new Date(purchase.created_at));
      const bucket = revenueMap.get(dayKey);
      if (!bucket) return;
      bucket.revenue += Number(purchase.amount_aed || 0);
      bucket.purchases += 1;
    });

    const revenueByDay = Array.from(revenueMap.entries()).map(([key, values]) => ({
      date: labelFromKey(key),
      revenue: values.revenue,
      purchases: values.purchases,
    }));

    // User growth by day
    const { data: usersRange } = await supabase
      .from('profiles')
      .select('created_at')
      .gte('created_at', startIso);

    const { count: usersBeforeRange } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .lt('created_at', startIso);

    const userMap = new Map<string, number>();
    for (let i = 0; i < rangeDays; i += 1) {
      const day = new Date(startDate);
      day.setUTCDate(startDate.getUTCDate() + i);
      userMap.set(dateKey(day), 0);
    }

    (usersRange || []).forEach((user) => {
      const dayKey = dateKey(new Date(user.created_at));
      if (!userMap.has(dayKey)) return;
      userMap.set(dayKey, (userMap.get(dayKey) || 0) + 1);
    });

    let runningTotal = usersBeforeRange || 0;
    const userGrowthByDay = Array.from(userMap.entries()).map(([key, newUsers]) => {
      runningTotal += newUsers;
      return {
        date: labelFromKey(key),
        users: runningTotal,
        newUsers,
      };
    });

    return c.json({
      totalUsers: totalUsers || 0,
      totalAnalyses: totalAnalyses || 0,
      totalPurchases: allPurchases?.length || 0,
      paidPurchases: paidPurchases.length,
      totalRevenue,
      pendingPurchases: pendingPurchases || 0,
      openTickets: openTickets.length,
      conversionRate: parseFloat(conversionRate.toFixed(2)),
      recentPurchases,
      rangeDays,
      revenueByDay,
      userGrowthByDay,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return c.json({ error: "Failed to fetch statistics" }, 500);
  }
});

// ================================================================
// ADMIN - ANALYTICS
// ================================================================

app.get("/make-server-ef294769/admin/analytics", async (c: any) => {
  try {
    const auth = await verifyAdminAccess(c);
    if (auth instanceof Response) return auth;
    const { supabase } = auth;

    const rangeParam = c.req.query("range") || "90";
    const rangeDays = ["30", "90", "365"].includes(rangeParam) ? parseInt(rangeParam, 10) : 90;

    const endDate = new Date();
    endDate.setUTCHours(0, 0, 0, 0);
    const startDate = new Date(endDate);
    startDate.setUTCDate(endDate.getUTCDate() - (rangeDays - 1));
    const startIso = startDate.toISOString();

    const monthKey = (date: Date) =>
      `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
    const monthLabel = (key: string) => {
      const [year, month] = key.split("-");
      const date = new Date(Date.UTC(parseInt(year, 10), parseInt(month, 10) - 1, 1));
      return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    };

    // Purchases (paid only)
    const { data: paidPurchases } = await supabase
      .from("report_purchases")
      .select("amount_aed, created_at, analysis_id, user_id")
      .eq("status", "paid")
      .gte("created_at", startIso);

    // Analyses
    const { data: analyses } = await supabase
      .from("analyses")
      .select("id, property_name, portal_source, cash_on_cash_return");

    // Profiles (users)
    const { data: usersRange } = await supabase
      .from("profiles")
      .select("created_at")
      .gte("created_at", startIso);

    const { count: totalUsers } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });

    const { count: totalAnalyses } = await supabase
      .from("analyses")
      .select("*", { count: "exact", head: true });

    // Revenue by month
    const revenueByMonthMap = new Map<string, { revenue: number; count: number; users: number }>();
    (paidPurchases || []).forEach((purchase) => {
      const key = monthKey(new Date(purchase.created_at));
      const bucket = revenueByMonthMap.get(key) || { revenue: 0, count: 0, users: 0 };
      bucket.revenue += Number(purchase.amount_aed || 0);
      bucket.count += 1;
      revenueByMonthMap.set(key, bucket);
    });

    const revenueByMonth = Array.from(revenueByMonthMap.entries())
      .map(([key, values]) => ({
        month: monthLabel(key),
        revenue: values.revenue,
        count: values.count,
        users: values.users,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    // Users by month (new users)
    const usersByMonthMap = new Map<string, number>();
    (usersRange || []).forEach((user) => {
      const key = monthKey(new Date(user.created_at));
      usersByMonthMap.set(key, (usersByMonthMap.get(key) || 0) + 1);
    });

    const usersByMonth = Array.from(usersByMonthMap.entries())
      .map(([key, count]) => ({
        month: monthLabel(key),
        users: count,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    // Top properties (by analysis count)
    const propertyMap = new Map<string, { views: number; reports: number; roiSum: number; roiCount: number }>();
    const paidByAnalysis = new Map<string, number>();
    (paidPurchases || []).forEach((purchase) => {
      if (!purchase.analysis_id) return;
      paidByAnalysis.set(
        purchase.analysis_id,
        (paidByAnalysis.get(purchase.analysis_id) || 0) + 1,
      );
    });

    (analyses || []).forEach((analysis) => {
      const name = analysis.property_name || analysis.portal_source || "Unnamed Property";
      const current = propertyMap.get(name) || { views: 0, reports: 0, roiSum: 0, roiCount: 0 };
      current.views += 1;
      current.reports += paidByAnalysis.get(analysis.id) || 0;
      if (analysis.cash_on_cash_return !== null && analysis.cash_on_cash_return !== undefined) {
        current.roiSum += Number(analysis.cash_on_cash_return);
        current.roiCount += 1;
      }
      propertyMap.set(name, current);
    });

    const topProperties = Array.from(propertyMap.entries())
      .map(([name, values]) => ({
        name,
        views: values.views,
        reports: values.reports,
        avgROI: values.roiCount ? parseFloat((values.roiSum / values.roiCount).toFixed(2)) : 0,
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 8);

    const paidUserIds = new Set((paidPurchases || []).map((p) => p.user_id).filter(Boolean));
    const paidUsers = paidUserIds.size;
    const totalUsersValue = totalUsers || 0;
    const totalAnalysesValue = totalAnalyses || 0;

    const conversionFunnel = [
      { stage: "Registered Users", users: totalUsersValue },
      { stage: "Saved Analyses", users: totalAnalysesValue },
      { stage: "Paid Reports", users: paidUsers },
    ].map((stage, index) => ({
      ...stage,
      percentage: totalUsersValue ? parseFloat(((stage.users / totalUsersValue) * 100).toFixed(1)) : 0,
      color: index === 0 ? "#1e2875" : index === 1 ? "#14b8a6" : "#10b981",
    }));

    const avgReportValue =
      paidPurchases && paidPurchases.length > 0
        ? parseFloat(
            (
              paidPurchases.reduce((sum, p) => sum + Number(p.amount_aed || 0), 0) /
              paidPurchases.length
            ).toFixed(2),
          )
        : 0;

    const roiRows =
      analyses?.filter((a) => a.cash_on_cash_return !== null && a.cash_on_cash_return !== undefined) || [];
    const averageROI =
      roiRows.length > 0
        ? parseFloat(
            (
              roiRows.reduce((sum, a) => sum + Number(a.cash_on_cash_return || 0), 0) /
              roiRows.length
            ).toFixed(2),
          )
        : 0;

    return c.json({
      revenueByMonth,
      usersByMonth,
      topProperties,
      conversionFunnel,
      averageROI,
      avgReportValue,
    });
  } catch (error) {
    console.error("Admin analytics error:", error);
    return c.json({ error: "Failed to fetch analytics" }, 500);
  }
});

// ================================================================
// ADMIN - REPORTS
// ================================================================

app.get("/make-server-ef294769/admin/reports", async (c: any) => {
  try {
    const auth = await verifyAdminAccess(c);
    if (auth instanceof Response) return auth;
    const { supabase } = auth;

    const page = parseInt(c.req.query("page") || "1");
    const limit = parseInt(c.req.query("limit") || "20");
    const status = c.req.query("status");
    const rawSearch = c.req.query("search");
    const search =
      !rawSearch || rawSearch === "undefined" || rawSearch === "null"
        ? ""
        : rawSearch;
    const sort = c.req.query("sort") || "date";

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from("analyses")
      .select(
        `
        id,
        user_id,
        property_name,
        portal_source,
        listing_url,
        purchase_price,
        gross_yield,
        net_yield,
        cash_on_cash_return,
        created_at,
        is_paid
      `,
        { count: "exact" },
      );

    if (status === "paid") {
      query = query.eq("is_paid", true);
    } else if (status === "free") {
      query = query.eq("is_paid", false);
    }

    if (search) {
      query = query.or(
        `property_name.ilike.%${search}%,portal_source.ilike.%${search}%,profiles.email.ilike.%${search}%`,
      );
    }

    if (sort === "yield") {
      query = query.order("net_yield", { ascending: false, nullsFirst: false });
    } else if (sort === "price") {
      query = query.order("purchase_price", { ascending: false, nullsFirst: false });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    const { data, error, count } = await query.range(from, to);

    if (error) throw error;

    const userIds = Array.from(new Set((data || []).map((row: any) => row.user_id).filter(Boolean)));
    let profileMap = new Map<string, { email?: string; full_name?: string }>();
    if (userIds.length > 0) {
      const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("id, email, full_name")
        .in("id", userIds);

      if (profileError) {
        console.error("Admin reports profile lookup error:", profileError);
      } else {
        profileMap = new Map(
          (profiles || []).map((profile: any) => [
            profile.id,
            { email: profile.email, full_name: profile.full_name },
          ]),
        );
      }
    }

    const reports = (data || []).map((row: any) => ({
      id: row.id,
      user_id: row.user_id,
      user_email: profileMap.get(row.user_id)?.email || "",
      property_name: row.property_name || row.portal_source || "Unnamed Property",
      portal_source: row.portal_source,
      listing_url: row.listing_url,
      purchase_price: Number(row.purchase_price || 0),
      gross_yield: Number(row.gross_yield || 0),
      net_yield: Number(row.net_yield || 0),
      cash_on_cash_return: Number(row.cash_on_cash_return || 0),
      is_paid: !!row.is_paid,
      created_at: row.created_at,
    }));

    return c.json({
      reports,
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    });
  } catch (error) {
    console.error("Admin reports error:", error);
    return c.json({ error: "Failed to fetch reports" }, 500);
  }
});

// ================================================================
// USER - SUPPORT TICKET CREATION
// ================================================================

// Create support ticket (user-facing)
app.post("/make-server-ef294769/support/tickets", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    
    // Support tickets can be created by authenticated or guest users
    let userId = null;
    let userEmail = null;

    if (accessToken) {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_ANON_KEY")!,
        {
          global: {
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        }
      );

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        userId = user.id;
        userEmail = user.email;
      }
    }

    const { subject, message, email, priority, category } = await c.req.json();

    if (!subject || !message) {
      return c.json({ error: "Subject and message are required" }, 400);
    }
    if (typeof subject === "string" && (subject.length < 3 || subject.length > 200)) {
      return c.json({ error: "Subject must be between 3 and 200 characters" }, 400);
    }
    if (typeof message === "string" && (message.length < 10 || message.length > 5000)) {
      return c.json({ error: "Message must be between 10 and 5000 characters" }, 400);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey =
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceRoleKey) {
      return c.json({ error: "Missing service role key on server" }, 500);
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const ticketId = crypto.randomUUID();
    const resolvedEmail = email || userEmail;
    if (!resolvedEmail) {
      return c.json({ error: "Email is required" }, 400);
    }
    const ticket = {
      id: ticketId,
      user_id: userId,
      user_email: resolvedEmail,
      subject,
      priority: priority || 'medium',
      status: 'open',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { error: insertError } = await adminClient
      .from("support_tickets")
      .insert(ticket);

    if (insertError) {
      console.error("Create ticket DB error:", insertError);
      return c.json({
        error: "Failed to create support ticket",
        details: insertError.message,
        code: insertError.code,
        hint: insertError.hint,
      }, 500);
    }

    // Create initial message
    const messageId = crypto.randomUUID();
    const initialMessage = {
      id: messageId,
      ticket_id: ticketId,
      user_id: userId,
      message,
      is_admin: false,
      is_internal: false,
      created_at: new Date().toISOString()
    };

    await kv.set(`support_message:${ticketId}:${messageId}`, initialMessage);

    return c.json(ticket);
  } catch (error) {
    console.error("Create ticket error:", error);
    return c.json({
      error: "Failed to create support ticket",
      details: error?.message || String(error),
    }, 500);
  }
});

// ================================================================
// ADMIN - PLATFORM SETTINGS
// ================================================================

const PLATFORM_SETTINGS_KEY = "platform_settings";
const DEFAULT_PLATFORM_SETTINGS = {
  premiumReportPrice: 49,
  currency: "AED",
  maintenanceMode: false,
  allowSignups: true,
  requireEmailVerification: true,
  adminEmailNotifications: true,
  userEmailNotifications: true,
  adminEmail: "admin@yieldpulse.com",
  maxFreeAnalysesPerDay: 100,
  maxPremiumReportsPerUser: 1000,
  stripeEnabled: true,
  analyticsEnabled: true,
};

const sanitizeSettings = (raw: any, base = DEFAULT_PLATFORM_SETTINGS) => {
  const merged = { ...base, ...(raw || {}) };
  return {
    premiumReportPrice: Number(merged.premiumReportPrice || base.premiumReportPrice),
    currency: String(merged.currency || base.currency).toUpperCase(),
    maintenanceMode: !!merged.maintenanceMode,
    allowSignups: !!merged.allowSignups,
    requireEmailVerification: !!merged.requireEmailVerification,
    adminEmailNotifications: !!merged.adminEmailNotifications,
    userEmailNotifications: !!merged.userEmailNotifications,
    adminEmail: String(merged.adminEmail || base.adminEmail),
    maxFreeAnalysesPerDay: Number(merged.maxFreeAnalysesPerDay || base.maxFreeAnalysesPerDay),
    maxPremiumReportsPerUser: Number(merged.maxPremiumReportsPerUser || base.maxPremiumReportsPerUser),
    stripeEnabled: !!merged.stripeEnabled,
    analyticsEnabled: !!merged.analyticsEnabled,
  };
};

app.get("/make-server-ef294769/admin/settings", async (c) => {
  try {
    const auth = await verifyAdminAccess(c);
    if (auth instanceof Response) return auth;

    const stored = await kv.get(PLATFORM_SETTINGS_KEY);
    const settings = sanitizeSettings(stored);
    return c.json({ settings });
  } catch (error) {
    console.error("Admin settings get error:", error);
    return c.json({ error: "Failed to fetch settings" }, 500);
  }
});

app.put("/make-server-ef294769/admin/settings", async (c) => {
  try {
    const auth = await verifyAdminAccess(c);
    if (auth instanceof Response) return auth;
    const { user } = auth;

    const body = await c.req.json();
    const current = await kv.get(PLATFORM_SETTINGS_KEY);
    const settings = sanitizeSettings(body, current || DEFAULT_PLATFORM_SETTINGS);

    await kv.set(PLATFORM_SETTINGS_KEY, settings);
    await logAdminAction(user.id, "update_settings", { settings });

    return c.json({ settings });
  } catch (error) {
    console.error("Admin settings update error:", error);
    return c.json({ error: "Failed to update settings" }, 500);
  }
});

// Public settings for pricing display
app.get("/make-server-ef294769/settings/public", async (c) => {
  try {
    const settings = await getPlatformSettings();
    return c.json({
      premiumReportPrice: settings.premiumReportPrice,
      currency: settings.currency,
      stripeEnabled: settings.stripeEnabled,
    });
  } catch (error) {
    console.error("Public settings error:", error);
    return c.json({ error: "Failed to fetch settings" }, 500);
  }
});

// Get user's own tickets
app.get("/make-server-ef294769/support/tickets", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    if (!accessToken) {
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

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data: userTickets, error: ticketsError } = await supabase
      .from("support_tickets")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (ticketsError) {
      console.error("Get user tickets error:", ticketsError);
      return c.json({ error: "Failed to fetch tickets" }, 500);
    }

    return c.json({ tickets: userTickets || [] });
  } catch (error) {
    console.error("Get user tickets error:", error);
    return c.json({ error: "Failed to fetch tickets" }, 500);
  }
});

// ================================================================
// CONTACT FORM
// ================================================================

// Get all contact submissions (admin only)
app.get("/make-server-ef294769/admin/contact/submissions", async (c) => {
  try {
    const auth = await verifyAdminAccess(c);
    if (auth instanceof Response) return auth;

    const allSubmissions = await kv.getByPrefix('contact_submission:');
    
    // Sort by submitted_at descending
    const sortedSubmissions = allSubmissions.sort((a: any, b: any) => 
      new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime()
    );

    return c.json({ submissions: sortedSubmissions });
  } catch (error) {
    console.error("Get contact submissions error:", error);
    return c.json({ error: "Failed to fetch contact submissions" }, 500);
  }
});

app.post("/make-server-ef294769/contact", async (c) => {
  try {
    const { fullName, email, subject, message } = await c.req.json();

    if (!fullName || !email || !subject || !message) {
      return c.json({ error: "All fields are required" }, 400);
    }
    if (typeof subject === "string" && (subject.length < 3 || subject.length > 200)) {
      return c.json({ error: "Subject must be between 3 and 200 characters" }, 400);
    }
    if (typeof message === "string" && (message.length < 10 || message.length > 5000)) {
      return c.json({ error: "Message must be between 10 and 5000 characters" }, 400);
    }

    // Generate a unique ID for the contact submission
    const submissionId = crypto.randomUUID();
    const timestamp = new Date().toISOString();

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey =
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceRoleKey) {
      return c.json({ error: "Missing service role key on server" }, 500);
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Store the contact form submission in KV store
    const contactData = {
      id: submissionId,
      full_name: fullName,
      email,
      subject,
      message,
      submitted_at: timestamp,
      status: 'new',
    };

    await kv.set(`contact_submission:${submissionId}`, contactData);

    const { error: ticketError } = await adminClient.from("support_tickets").insert({
      id: submissionId,
      user_id: null,
      user_email: email,
      subject,
      message,
      status: "open",
      priority: "medium",
      created_at: timestamp,
      updated_at: timestamp,
    });

    if (ticketError) {
      console.error("Contact -> support_tickets insert failed:", ticketError);
      return c.json({
        error: "Failed to create support ticket",
        details: ticketError.message,
        code: ticketError.code,
        hint: ticketError.hint,
      }, 500);
    }

    const messageId = crypto.randomUUID();
    const initialMessage = {
      id: messageId,
      ticket_id: submissionId,
      user_id: null,
      message,
      is_admin: false,
      is_internal: false,
      created_at: timestamp,
    };
    await kv.set(`support_message:${submissionId}:${messageId}`, initialMessage);

    console.log(`Contact form submission received: ${submissionId} from ${email}`);

    return c.json({ 
      success: true, 
      message: "Contact form submitted successfully",
      submissionId 
    });
  } catch (error) {
    console.error("Contact form submission error:", error);
    return c.json({
      error: "Failed to submit contact form",
      details: error?.message || String(error),
    }, 500);
  }
});

// ================================================================
// ADMIN - DOCUMENTS MANAGEMENT
// ================================================================

const DOCUMENTS_BUCKET = 'make-ef294769-documents';

// Initialize Supabase Storage bucket
async function ensureDocumentsBucket() {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );
    
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === DOCUMENTS_BUCKET);
    
    if (!bucketExists) {
      await supabase.storage.createBucket(DOCUMENTS_BUCKET, {
        public: false,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'image/png',
          'image/jpeg',
          'image/svg+xml'
        ]
      });
      console.log(`Created documents bucket: ${DOCUMENTS_BUCKET}`);
    }
  } catch (error) {
    console.error('Error ensuring documents bucket:', error);
  }
}

// Ensure bucket exists on startup
ensureDocumentsBucket();

// List all documents
app.get('/make-server-ef294769/admin/documents', async (c) => {
  try {
    const auth = await verifyAdminAccess(c);
    if (auth instanceof Response) return auth;

    const documents = await kv.getByPrefix('document:');
    
    return c.json(documents.sort((a, b) => 
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    ));
  } catch (error) {
    console.error('Error listing documents:', error);
    return c.json({ error: 'Failed to list documents' }, 500);
  }
});

// Upload document
app.post('/make-server-ef294769/admin/documents', async (c) => {
  try {
    const auth = await verifyAdminAccess(c);
    if (auth instanceof Response) return auth;
    const { supabase, userId } = auth;

    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;

    if (!file || !name || !category) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Validate file size (10MB max)
    if (file.size > 10485760) {
      return c.json({ error: 'File size exceeds 10MB limit' }, 400);
    }

    const documentId = crypto.randomUUID();
    const fileExt = file.name.split('.').pop();
    const storagePath = `${documentId}.${fileExt}`;

    // Upload file to Supabase Storage
    const fileBuffer = await file.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from(DOCUMENTS_BUCKET)
      .upload(storagePath, fileBuffer, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) {
      console.error('Error uploading file to storage:', uploadError);
      return c.json({ error: 'Failed to upload file' }, 500);
    }

    // Store document metadata
    const document = {
      id: documentId,
      name,
      description: description || '',
      category,
      fileName: file.name,
      fileSize: file.size,
      storagePath,
      uploadedAt: new Date().toISOString(),
      uploadedBy: userId
    };

    await kv.set(`document:${documentId}`, document);

    // Log audit
    await logAdminAction(userId, 'DOCUMENT_UPLOAD', { documentId, name });

    return c.json(document);
  } catch (error) {
    console.error('Error uploading document:', error);
    return c.json({ error: 'Failed to upload document' }, 500);
  }
});

// Get download URL for document
app.get('/make-server-ef294769/admin/documents/:documentId/download', async (c) => {
  try {
    const auth = await verifyAdminAccess(c);
    if (auth instanceof Response) return auth;
    const { supabase } = auth;

    const documentId = c.req.param('documentId');
    const document = await kv.get(`document:${documentId}`);

    if (!document) {
      return c.json({ error: 'Document not found' }, 404);
    }

    // Generate signed URL (valid for 1 hour)
    const { data, error } = await supabase.storage
      .from(DOCUMENTS_BUCKET)
      .createSignedUrl(document.storagePath, 3600);

    if (error || !data) {
      console.error('Error creating signed URL:', error);
      return c.json({ error: 'Failed to generate download URL' }, 500);
    }

    return c.json({ url: data.signedUrl });
  } catch (error) {
    console.error('Error getting download URL:', error);
    return c.json({ error: 'Failed to get download URL' }, 500);
  }
});

// Delete document
app.delete('/make-server-ef294769/admin/documents/:documentId', async (c) => {
  try {
    const auth = await verifyAdminAccess(c);
    if (auth instanceof Response) return auth;
    const { supabase, userId } = auth;

    const documentId = c.req.param('documentId');
    const document = await kv.get(`document:${documentId}`);

    if (!document) {
      return c.json({ error: 'Document not found' }, 404);
    }

    // Delete file from storage
    const { error: deleteError } = await supabase.storage
      .from(DOCUMENTS_BUCKET)
      .remove([document.storagePath]);

    if (deleteError) {
      console.error('Error deleting file from storage:', deleteError);
      // Continue even if storage deletion fails
    }

    // Delete metadata
    await kv.del(`document:${documentId}`);

    // Log audit
    await logAdminAction(userId, 'DOCUMENT_DELETE', { documentId, name: document.name });

    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting document:', error);
    return c.json({ error: 'Failed to delete document' }, 500);
  }
});

// ================================================================
// DISCOUNT CODE MANAGEMENT (Stripe)
// Notes:
// - Stripe promotion codes do NOT have a delete endpoint; "delete" = archive (active=false).
// - Promo codes are unique across ACTIVE promotion codes (so archived codes should NOT block recreating the same code).
// ================================================================

const normalizeDiscountCode = (code: string) => code.toUpperCase().trim();

async function listAllPromotionCodes(stripe: any, params: any) {
  const out: any[] = [];
  let startingAfter: string | undefined;

  while (true) {
    const page = await stripe.promotionCodes.list({
      limit: 100,
      ...params,
      ...(startingAfter ? { starting_after: startingAfter } : {}),
    });

    out.push(...(page.data || []));
    if (!page.has_more) break;

    const last = page.data?.[page.data.length - 1];
    startingAfter = last?.id;
    if (!startingAfter) break;
  }

  return out;
}

async function listPromosByCode(stripe: any, code: string, expandCoupon = false) {
  return await listAllPromotionCodes(stripe, {
    code,
    ...(expandCoupon ? { expand: ["data.coupon"] } : {}),
  });
}

function promoToDiscountDTO(promo: any) {
  const coupon: any = promo.coupon;
  const couponObj = typeof coupon === "string" ? null : coupon;

  const type = couponObj?.percent_off ? "percentage" : "fixed";
  const value =
    couponObj?.percent_off ??
    (couponObj?.amount_off ? couponObj.amount_off / 100 : 0);

  // Prefer promo.expires_at (promo-level) then coupon.redeem_by (coupon-level)
  const promoExpiresAt = promo.expires_at
    ? new Date(promo.expires_at * 1000).toISOString()
    : null;

  const couponRedeemBy = couponObj?.redeem_by
    ? new Date(couponObj.redeem_by * 1000).toISOString()
    : null;

  return {
    code: promo.code,
    type,
    value,
    maxUses: promo.max_redemptions ?? couponObj?.max_redemptions ?? null,
    currentUses: promo.times_redeemed ?? 0,
    expiresAt: promoExpiresAt ?? couponRedeemBy,
    active: promo.active,
    description: promo.metadata?.description || couponObj?.metadata?.description || "",
    createdAt: promo.created
      ? new Date(promo.created * 1000).toISOString()
      : new Date().toISOString(),
    totalRevenue: 0,
    totalSavings: 0,
    stripe_coupon_id: typeof coupon === "string" ? coupon : couponObj?.id,
    stripe_promo_code_id: promo.id,
  };
}

function pickCurrentPromo(promos: any[]) {
  if (!promos.length) return null;

  const active = promos.filter((p) => p.active);
  if (active.length > 0) {
    active.sort((a, b) => (b.created ?? 0) - (a.created ?? 0));
    return { promo: active[0], activeCount: active.length };
  }

  promos.sort((a, b) => (b.created ?? 0) - (a.created ?? 0));
  return { promo: promos[0], activeCount: 0 };
}

// ---------------------------------------------------------------
// List all discount codes (admin only) - Stripe source of truth
// ---------------------------------------------------------------
app.get("/make-server-ef294769/admin/discounts", async (c) => {
  try {
    const auth = await verifyAdminAccess(c);
    if (auth instanceof Response) return auth;

    const stripe = getStripe();

    const promos = await listAllPromotionCodes(stripe, {
      expand: ["data.coupon"],
      active: true,
    });

    const codes = (promos || []).map(promoToDiscountDTO);

    return c.json({ codes, recentUsage: [] });
  } catch (error) {
    console.error("Error listing discount codes:", error);
    return c.json({ error: "Failed to list discount codes" }, 500);
  }
});

// ---------------------------------------------------------------
// Create discount code (admin only)
// ---------------------------------------------------------------
app.post("/make-server-ef294769/admin/discounts", async (c) => {
  let normalizedCode = "";

  try {
    const auth = await verifyAdminAccess(c);
    if (auth instanceof Response) return auth;
    const { user } = auth;

    const body = await c.req.json();

    const code = body.code;
    const type = body.type;
    const valueRaw = body.value;
    const maxUsesRaw = body.maxUses;
    const expiresAt = body.expiresAt;
    const description = body.description;
    const active = body.active;

    if (!code || !type || valueRaw === undefined) {
      return c.json({ error: "Code, type, and value are required" }, 400);
    }

    normalizedCode = normalizeDiscountCode(code);

    if (!["percentage", "fixed"].includes(type)) {
      return c.json({ error: 'Type must be "percentage" or "fixed"' }, 400);
    }

    const value = Number(valueRaw);
    if (!Number.isFinite(value) || value <= 0) {
      return c.json({ error: "Value must be greater than 0" }, 400);
    }
    if (type === "percentage" && value > 100) {
      return c.json({ error: "Percentage cannot exceed 100%" }, 400);
    }

    const maxUsesParsed =
      maxUsesRaw === null || maxUsesRaw === undefined || maxUsesRaw === ""
        ? null
        : Number(maxUsesRaw);

    if (maxUsesParsed !== null && (!Number.isInteger(maxUsesParsed) || maxUsesParsed <= 0)) {
      return c.json({ error: "maxUses must be a positive integer" }, 400);
    }

    const stripe = getStripe();

    // IMPORTANT FIX:
    // Only treat it as "already exists" if there is an ACTIVE promo with this code.
    const existingActive = await stripe.promotionCodes.list({
      code: normalizedCode,
      active: true,
      limit: 1,
    });

    if (existingActive.data.length > 0) {
      return c.json({ error: "Discount code already exists" }, 409);
    }

    // Create Stripe coupon
    const couponParams: any = {
      name: normalizedCode,
      duration: "forever",
    };

    if (expiresAt) {
      couponParams.redeem_by = Math.floor(new Date(expiresAt).getTime() / 1000);
    }

    if (type === "percentage") {
      couponParams.percent_off = value;
    } else {
      couponParams.amount_off = Math.round(value * 100); // to fils
      couponParams.currency = "aed";
    }

    let stripeCoupon: any;
    let promo: any;

    try {
      stripeCoupon = await stripe.coupons.create(couponParams);

      // Keep your existing working shape (coupon: id). If you ever upgrade Stripe API versions,
      // you might need to switch to the newer "promotion" param format.
      promo = await stripe.promotionCodes.create({
        coupon: stripeCoupon.id,
        code: normalizedCode,
        active: active !== false,
        max_redemptions: maxUsesParsed ?? undefined,
        // Optional: also set promo-level expiry (cannot be after coupon redeem_by).
        ...(expiresAt
          ? { expires_at: Math.floor(new Date(expiresAt).getTime() / 1000) }
          : {}),
        metadata: description ? { description } : undefined,
      });
    } catch (err) {
      // If promo creation failed after coupon was created, try to clean up coupon.
      try {
        if (stripeCoupon?.id) await stripe.coupons.del(stripeCoupon.id);
      } catch (cleanupErr) {
        console.warn("Cleanup coupon after promo create failure:", cleanupErr);
      }
      console.error("Stripe create discount error:", err);
      return c.json({ error: stripeErrorMessage(err) }, 400);
    }

    const discountCode = {
      code: normalizedCode,
      type,
      value,
      maxUses: maxUsesParsed,
      expiresAt: expiresAt || null,
      description: description || "",
      active: active !== false,
      createdAt: new Date().toISOString(),
      createdBy: user.id,
      stripe_coupon_id: stripeCoupon.id,
      stripe_promo_code_id: promo.id,
    };

    await logAdminAction(user.id, "DISCOUNT_CREATE", { code: normalizedCode, type, value });

    return c.json(discountCode);
  } catch (error) {
    console.error("Error creating discount code:", error);

    // Fallback: if Stripe actually created it, return it instead of failing
    try {
      if (normalizedCode) {
        const stripe = getStripe();
        const promoList = await stripe.promotionCodes.list({
          code: normalizedCode,
          limit: 1,
          expand: ["data.coupon"],
        });
        const promo = promoList.data[0];
        if (promo && promo.coupon) {
          return c.json({ ...promoToDiscountDTO(promo), warning: stripeErrorMessage(error) });
        }
      }
    } catch (fallbackErr) {
      console.warn("Create discount fallback failed:", fallbackErr);
    }

    return c.json({ error: stripeErrorMessage(error) }, 400);
  }
});

// ---------------------------------------------------------------
// Update discount code (admin only)
// ---------------------------------------------------------------
app.put("/make-server-ef294769/admin/discounts/:code", async (c) => {
  const stripe = getStripe();

  try {
    const auth = await verifyAdminAccess(c);
    if (auth instanceof Response) return auth;
    const { user } = auth;

    const code = normalizeDiscountCode(c.req.param("code"));
    const updates = await c.req.json();

    // Parse/validate numeric updates
    if (updates.value !== undefined) {
      const parsed = Number(updates.value);
      if (!Number.isFinite(parsed) || parsed <= 0) {
        return c.json({ error: "Value must be a positive number" }, 400);
      }
      updates.value = parsed;
    }

    if (updates.maxUses !== undefined) {
      if (updates.maxUses === null || updates.maxUses === "" || updates.maxUses === 0) {
        updates.maxUses = null;
      } else {
        const parsed = Number(updates.maxUses);
        if (!Number.isInteger(parsed) || parsed <= 0) {
          return c.json({ error: "maxUses must be a positive integer" }, 400);
        }
        updates.maxUses = parsed;
      }
    }

    if (updates.type && !["percentage", "fixed"].includes(updates.type)) {
      return c.json({ error: 'Type must be "percentage" or "fixed"' }, 400);
    }

    if (updates.value !== undefined && updates.value <= 0) {
      return c.json({ error: "Value must be greater than 0" }, 400);
    }

    if (updates.type === "percentage" && updates.value > 100) {
      return c.json({ error: "Percentage cannot exceed 100%" }, 400);
    }

    const promos = await listPromosByCode(stripe, code, true);
    const picked = pickCurrentPromo(promos);

    if (!picked?.promo) {
      return c.json({ error: "Discount code not found" }, 404);
    }

    if (picked.activeCount > 1) {
      // Ambiguous state — better to fail loudly than update the wrong object.
      return c.json(
        { error: "Multiple active promotion codes exist for this code. Resolve in Stripe first." },
        409
      );
    }

    const promo = picked.promo;
    const coupon: any = promo.coupon;

    const currentType = coupon?.percent_off ? "percentage" : "fixed";
    const currentValue = coupon?.percent_off ?? (coupon?.amount_off ? coupon.amount_off / 100 : 0);

    const typeChanged = updates.type && updates.type !== currentType;
    const valueChanged = updates.value !== undefined && updates.value !== currentValue;

    const activeChanged = updates.active !== undefined && updates.active !== promo.active;
    const maxUsesChanged = updates.maxUses !== undefined && updates.maxUses !== promo.max_redemptions;

    let stripeCouponId = coupon?.id ?? (typeof promo.coupon === "string" ? promo.coupon : null);
    let stripePromoId = promo.id;

    // If value/type changes, recreate coupon & promo code (Stripe coupon details are not editable)
    if (typeChanged || valueChanged) {
      // Deactivate any active promos with this code (guarantees you can recreate the same code)
      const activePromos = promos.filter((p) => p.active);
      for (const p of activePromos) {
        try {
          await stripe.promotionCodes.update(p.id, { active: false });
        } catch (err) {
          console.warn("Stripe promo deactivate failed during update:", err);
        }
      }

      const effType = updates.type || currentType;
      const effValue = updates.value !== undefined ? updates.value : currentValue;

      const couponParams: any = {
        name: code,
        duration: "forever",
      };

      if (effType === "percentage") {
        couponParams.percent_off = effValue;
      } else {
        couponParams.amount_off = Math.round(effValue * 100);
        couponParams.currency = "aed";
      }

      let newCoupon: any;
      let newPromo: any;

      try {
        newCoupon = await stripe.coupons.create(couponParams);
        newPromo = await stripe.promotionCodes.create({
          coupon: newCoupon.id,
          code,
          active: updates.active !== undefined ? updates.active : promo.active,
          max_redemptions: updates.maxUses ?? promo.max_redemptions ?? undefined,
          metadata: updates.description ? { description: updates.description } : promo.metadata,
        });
      } catch (err) {
        // Cleanup orphan coupon
        try {
          if (newCoupon?.id) await stripe.coupons.del(newCoupon.id);
        } catch (cleanupErr) {
          console.warn("Cleanup coupon after update recreate failure:", cleanupErr);
        }
        console.error("Stripe update discount (recreate) error:", err);
        return c.json({ error: stripeErrorMessage(err) }, 400);
      }

      stripeCouponId = newCoupon.id;
      stripePromoId = newPromo.id;
    } else {
      // Only update promo fields that Stripe allows (active, metadata, max_redemptions, etc.)
      const updateParams: any = {};
      if (activeChanged) updateParams.active = updates.active;
      if (maxUsesChanged) updateParams.max_redemptions = updates.maxUses ?? null;
      if (updates.description !== undefined) {
        updateParams.metadata = { ...(promo.metadata || {}), description: updates.description };
      }

      if (Object.keys(updateParams).length > 0) {
        try {
          await stripe.promotionCodes.update(stripePromoId, updateParams);
        } catch (err) {
          console.warn("Stripe promo update failed:", err);
        }
      }
    }

    const updated = {
      code,
      stripe_coupon_id: stripeCouponId,
      stripe_promo_code_id: stripePromoId,
      updatedAt: new Date().toISOString(),
      updatedBy: user.id,
      ...updates,
      active: updates.active !== undefined ? updates.active : promo.active,
      type: updates.type || currentType,
      value: updates.value !== undefined ? updates.value : currentValue,
    };

    await logAdminAction(user.id, "DISCOUNT_UPDATE", { code, updates });

    return c.json(updated);
  } catch (error) {
    console.error("Error updating discount code:", error);

    // Fallback: return current Stripe state if possible
    try {
      const code = normalizeDiscountCode(c.req.param("code"));
      const promoList = await stripe.promotionCodes.list({
        code,
        limit: 1,
        expand: ["data.coupon"],
      });
      const promo = promoList.data[0];
      if (promo?.coupon) {
        return c.json({ ...promoToDiscountDTO(promo), warning: stripeErrorMessage(error) });
      }
    } catch (fallbackErr) {
      console.warn("Update discount fallback failed:", fallbackErr);
    }

    return c.json({ error: stripeErrorMessage(error) }, 400);
  }
});

// ---------------------------------------------------------------
// Delete discount code (admin only) — archive all promos by code
// ---------------------------------------------------------------
app.delete("/make-server-ef294769/admin/discounts/:code", async (c) => {
  try {
    const auth = await verifyAdminAccess(c);
    if (auth instanceof Response) return auth;
    const { user } = auth;

    const code = normalizeDiscountCode(c.req.param("code"));
    const stripe = getStripe();

    const promos = await listPromosByCode(stripe, code, false);
    if (!promos.length) {
      return c.json({ error: "Discount code not found" }, 404);
    }

    // Archive (deactivate) ALL promos with this code
    for (const p of promos) {
      if (!p.active) continue;
      try {
        await stripe.promotionCodes.update(p.id, { active: false });
      } catch (err) {
        console.warn("Stripe promo deactivate failed:", err);
      }
    }

    // Optional: delete coupon(s) ONLY if you are sure you don't share coupons across codes.
    // Default is OFF to avoid accidentally breaking other promo codes that share a coupon.
    // If you want to enable, set `const deleteCoupons = true;`
    const deleteCoupons = false;

    if (deleteCoupons) {
      const couponIds = new Set<string>();
      for (const p of promos) {
        const coupon = (p as any).coupon;
        if (typeof coupon === "string" && coupon) couponIds.add(coupon);
        else if (coupon?.id) couponIds.add(coupon.id);
      }

      for (const couponId of couponIds) {
        try {
          // Safety check: skip deleting coupon if other promo codes exist for it with different codes
          const byCoupon = await stripe.promotionCodes.list({ coupon: couponId, limit: 100 });
          const otherCodesExist = (byCoupon.data || []).some(
            (pc: any) => normalizeDiscountCode(pc.code || "") !== code
          );
          if (otherCodesExist) continue;

          await stripe.coupons.del(couponId);
        } catch (err) {
          console.warn("Stripe coupon delete failed:", err);
        }
      }
    }

    await logAdminAction(user.id, "DISCOUNT_DELETE", { code });

    // IMPORTANT: after this, CREATE will work again for the same code because it only blocks ACTIVE promos
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting discount code:", error);
    return c.json({ error: stripeErrorMessage(error) }, 400);
  }
});

// ---------------------------------------------------------------
// Validate discount code (public endpoint - no auth required)
// ---------------------------------------------------------------
app.post("/make-server-ef294769/discounts/validate", async (c) => {
  try {
    const { code } = await c.req.json();
    if (!code) return c.json({ error: "Code is required" }, 400);

    const normalizedCode = normalizeDiscountCode(code);
    const stripe = getStripe();

    const promos = await stripe.promotionCodes.list({
      code: normalizedCode,
      active: true,
      limit: 1,
      expand: ["data.coupon"],
    });

    const promo = promos.data[0];
    if (!promo || !promo.coupon) {
      return c.json({ error: "Invalid discount code" }, 404);
    }

    const coupon: any = promo.coupon;

    // Expiration: prefer promo.expires_at then coupon.redeem_by
    const promoExpiresMs = promo.expires_at ? promo.expires_at * 1000 : null;
    const couponRedeemByMs = coupon?.redeem_by ? coupon.redeem_by * 1000 : null;
    const expiresMs = promoExpiresMs ?? couponRedeemByMs;

    if (expiresMs && expiresMs < Date.now()) {
      return c.json({ error: "This discount code has expired" }, 400);
    }

    // Max uses
    const maxRedemptions = promo.max_redemptions ?? coupon?.max_redemptions;
    if (maxRedemptions && (promo.times_redeemed ?? 0) >= maxRedemptions) {
      return c.json({ error: "This discount code has reached its usage limit" }, 400);
    }

    return c.json({
      valid: true,
      code: normalizedCode,
      type: coupon?.percent_off ? "percentage" : "fixed",
      value: coupon?.percent_off ?? (coupon?.amount_off ? coupon.amount_off / 100 : 0),
      description: promo.metadata?.description || coupon?.metadata?.description || "",
      maxUses: maxRedemptions ?? null,
      currentUses: promo.times_redeemed ?? 0,
      expiresAt: expiresMs ? new Date(expiresMs).toISOString() : null,
      active: promo.active,
    });
  } catch (error) {
    console.error("Error validating discount code:", error);
    return c.json({ error: "Failed to validate discount code" }, 500);
  }
});


// ================================================================
// REPORT SHARING
// ================================================================

// Generate a unique share token
function generateShareToken(): string {
  return `share_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

function mapAnalysisSnapshot(analysis: any) {
  const toNumber = (value: any) => (value === null || value === undefined ? 0 : Number(value));
  return {
    inputs: {
      propertyName: analysis.property_name || undefined,
      portalSource: analysis.portal_source || undefined,
      listingUrl: analysis.listing_url || undefined,
      areaSqft: toNumber(analysis.area_sqft),
      purchasePrice: toNumber(analysis.purchase_price),
      downPaymentPercent: toNumber(analysis.down_payment_percent),
      mortgageInterestRate: toNumber(analysis.mortgage_interest_rate),
      mortgageTermYears: toNumber(analysis.mortgage_term_years),
      expectedMonthlyRent: toNumber(analysis.expected_monthly_rent),
      serviceChargeAnnual: toNumber(analysis.service_charge_annual),
      annualMaintenancePercent: toNumber(analysis.annual_maintenance_percent),
      propertyManagementFeePercent: toNumber(analysis.property_management_fee_percent),
      dldFeePercent: toNumber(analysis.dld_fee_percent),
      agentFeePercent: toNumber(analysis.agent_fee_percent),
      capitalGrowthPercent: toNumber(analysis.capital_growth_percent),
      rentGrowthPercent: toNumber(analysis.rent_growth_percent),
      vacancyRatePercent: toNumber(analysis.vacancy_rate_percent),
      holdingPeriodYears: toNumber(analysis.holding_period_years) || 5,
      vacancyRate: toNumber(analysis.vacancy_rate_percent),
      interestRate: toNumber(analysis.mortgage_interest_rate),
      loanTerm: toNumber(analysis.mortgage_term_years),
    },
    results: analysis.calculation_results || null,
  };
}

// Create a shareable link for a report (requires authentication)
app.post("/make-server-ef294769/reports/share", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    
    if (!accessToken) {
      console.error("Share report: Missing Authorization header");
      return c.json({ error: "Unauthorized" }, 401);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      console.error("Share report: Invalid access token", authError);
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { analysisId, inputs, results, propertyName } = await c.req.json();

    if (!analysisId && (!inputs || !results)) {
      return c.json({ error: "Either analysisId or inputs/results required" }, 400);
    }

    let snapshotInputs = inputs || null;
    let snapshotResults = results || null;
    let resolvedName = propertyName || null;

    if (analysisId && (!snapshotInputs || !snapshotResults)) {
      const { data: analysisRecord, error: analysisError } = await supabase
        .from("analyses")
        .select(
          "property_name, portal_source, listing_url, area_sqft, purchase_price, down_payment_percent, mortgage_interest_rate, mortgage_term_years, expected_monthly_rent, service_charge_annual, annual_maintenance_percent, property_management_fee_percent, dld_fee_percent, agent_fee_percent, capital_growth_percent, rent_growth_percent, vacancy_rate_percent, holding_period_years, calculation_results"
        )
        .eq("id", analysisId)
        .maybeSingle();

      if (analysisError || !analysisRecord) {
        console.error("Share report: failed to load analysis snapshot", analysisError);
        return c.json({ error: "Failed to load saved analysis for sharing" }, 500);
      }

      const mapped = mapAnalysisSnapshot(analysisRecord);
      snapshotInputs = snapshotInputs || mapped.inputs;
      snapshotResults = snapshotResults || mapped.results;
      resolvedName = resolvedName || mapped.inputs?.propertyName || analysisRecord.property_name || 'Investment Property';
    }

    if (!snapshotInputs || !snapshotResults) {
      return c.json({ error: "Complete analysis snapshot is required to share" }, 400);
    }

    // Generate unique share token
    const shareToken = generateShareToken();

    // Prepare share data
    const shareData = {
      token: shareToken,
      type: 'single',
      analysisId: analysisId || null,
      sharedBy: user.id,
      sharedByEmail: user.email,
      propertyName: resolvedName,
      inputs: snapshotInputs,
      results: snapshotResults,
      createdAt: new Date().toISOString(),
      viewCount: 0,
      saveCount: 0,
    };

    // Store in KV with the share token as key
    await kv.set(`share:${shareToken}`, shareData);

    // Also store in user's share history
    await kv.set(`user_share:${user.id}:${shareToken}`, {
      token: shareToken,
      propertyName: shareData.propertyName,
      createdAt: shareData.createdAt,
    });

    console.log("Share link created:", shareToken);

    return c.json({
      shareToken,
      shareUrl: `${c.req.header("origin") || "https://yieldpulse.com"}/shared/${shareToken}`,
    });
  } catch (error) {
    console.error("Error creating share link:", error);
    return c.json({ error: "Failed to create share link" }, 500);
  }
});

// Create a shareable comparison link
app.post("/make-server-ef294769/reports/share/comparison", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    if (!accessToken) {
      console.error("Comparison share: Missing Authorization header");
      return c.json({ error: "Unauthorized" }, 401);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user) {
      console.error("Comparison share: Invalid token", authError);
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { analysisIds, propertyName } = await c.req.json();
    if (!Array.isArray(analysisIds) || analysisIds.length < 2) {
      return c.json({ error: "Comparison requires at least two property IDs" }, 400);
    }

    const uniqueIds = Array.from(new Set(analysisIds));
    if (uniqueIds.length < 2) {
      return c.json({ error: "Please select at least two distinct properties" }, 400);
    }

    const { data: records, error: queryError } = await supabase
      .from("analyses")
      .select(
        "id, property_name, portal_source, listing_url, area_sqft, purchase_price, down_payment_percent, mortgage_interest_rate, mortgage_term_years, expected_monthly_rent, service_charge_annual, annual_maintenance_percent, property_management_fee_percent, dld_fee_percent, agent_fee_percent, capital_growth_percent, rent_growth_percent, vacancy_rate_percent, holding_period_years, calculation_results"
      )
      .in("id", uniqueIds);

    if (queryError || !records) {
      console.error("Comparison share: failed to load analyses", queryError);
      return c.json({ error: "Failed to load selected properties" }, 500);
    }

    const recordMap = new Map<string, any>();
    for (const record of records) {
      recordMap.set(record.id, record);
    }

    const missingIds = uniqueIds.filter((id) => !recordMap.has(id));
    if (missingIds.length > 0) {
      return c.json({ error: "Some selected properties could not be found" }, 404);
    }

    const comparisonItems = uniqueIds.map((id) => {
      const record = recordMap.get(id);
      const { inputs, results } = mapAnalysisSnapshot(record);
      return {
        propertyName: record.property_name || undefined,
        inputs,
        results,
      };
    });

    const shareToken = generateShareToken();
    const shareData = {
      token: shareToken,
      type: "comparison",
      sharedBy: user.id,
      sharedByEmail: user.email,
      propertyName:
        propertyName ||
        `Comparison (${comparisonItems.length} properties)`,
      comparisonItems,
      createdAt: new Date().toISOString(),
      viewCount: 0,
    };

    await kv.set(`share:${shareToken}`, shareData);
    await kv.set(`user_share:${user.id}:${shareToken}`, {
      token: shareToken,
      propertyName: shareData.propertyName,
      createdAt: shareData.createdAt,
      type: "comparison",
    });

    console.log("Comparison share link created:", shareToken);

    return c.json({
      shareToken,
      shareUrl: `${c.req.header("origin") || "https://yieldpulse.com"}/shared/comparison/${shareToken}`,
    });
  } catch (error) {
    console.error("Comparison share error:", error);
    return c.json({ error: "Failed to create comparison share link" }, 500);
  }
});

// Get a shared report (NO authentication required - public endpoint)
app.get("/make-server-ef294769/reports/shared/:token", async (c) => {
  try {
    const token = c.req.param("token");

    if (!token) {
      return c.json({ error: "Share token required" }, 400);
    }

    const shareData = await kv.get(`share:${token}`);

    if (!shareData) {
      return c.json({ error: "Shared report not found or expired" }, 404);
    }

    // Increment view count
    const updatedShareData = {
      ...shareData,
      viewCount: (shareData.viewCount || 0) + 1,
    };
    await kv.set(`share:${token}`, updatedShareData);

    // Return the shared data (without sensitive info)
    return c.json({
      propertyName: shareData.propertyName,
      inputs: shareData.inputs,
      results: shareData.results,
      sharedByEmail: shareData.sharedByEmail,
      createdAt: shareData.createdAt,
      viewCount: updatedShareData.viewCount,
      type: shareData.type || 'single',
    });
  } catch (error) {
    console.error("Error fetching shared report:", error);
    return c.json({ error: "Failed to fetch shared report" }, 500);
  }
});

app.get("/make-server-ef294769/reports/shared/comparison/:token", async (c) => {
  try {
    const token = c.req.param("token");

    if (!token) {
      return c.json({ error: "Share token required" }, 400);
    }

    const shareData = await kv.get(`share:${token}`);

    if (!shareData || shareData.type !== "comparison") {
      return c.json({ error: "Comparison report not found or expired" }, 404);
    }

    const updatedShareData = {
      ...shareData,
      viewCount: (shareData.viewCount || 0) + 1,
    };
    await kv.set(`share:${token}`, updatedShareData);

    return c.json({
      propertyName: shareData.propertyName,
      comparisonItems: shareData.comparisonItems,
      sharedByEmail: shareData.sharedByEmail,
      createdAt: shareData.createdAt,
      viewCount: updatedShareData.viewCount,
      type: "comparison",
    });
  } catch (error) {
    console.error("Error fetching comparison share:", error);
    return c.json({ error: "Failed to fetch comparison report" }, 500);
  }
});

// Save a shared report to user's dashboard (requires authentication)
app.post("/make-server-ef294769/reports/shared/:token/save", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    
    if (!accessToken) {
      console.error("Save shared report: Missing Authorization header");
      return c.json({ error: "Unauthorized - Please sign in to save" }, 401);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      console.error("Save shared report: Invalid access token", authError);
      return c.json({ error: "Unauthorized - Please sign in to save" }, 401);
    }

    const token = c.req.param("token");
    const shareData = await kv.get(`share:${token}`);

    if (!shareData) {
      return c.json({ error: "Shared report not found or expired" }, 404);
    }

    if (!shareData.inputs || !shareData.results) {
      return c.json({ error: "Invalid share data" }, 400);
    }

    // Create a new analysis for this user
    const { data: analysis, error: insertError } = await supabase
      .from('analyses')
      .insert({
        user_id: user.id,
        property_name: shareData.propertyName || 'Shared Property',
        purchase_price: shareData.inputs.purchasePrice,
        expected_monthly_rent: shareData.inputs.monthlyRent,
        down_payment_percent: shareData.inputs.downPayment,
        interest_rate: shareData.inputs.interestRate,
        loan_term_years: shareData.inputs.loanTerm,
        property_size_sqft: shareData.inputs.propertySizeSqft || null,
        closing_costs: shareData.inputs.closingCosts || 0,
        renovation_costs: shareData.inputs.renovationCosts || 0,
        monthly_maintenance: shareData.inputs.monthlyMaintenance || 0,
        monthly_hoa: shareData.inputs.monthlyHOA || 0,
        annual_property_tax: shareData.inputs.annualPropertyTax || 0,
        annual_insurance: shareData.inputs.annualInsurance || 0,
        property_management_percent: shareData.inputs.propertyManagementPercent || 0,
        vacancy_rate_percent: shareData.inputs.vacancyRate || 0,
        annual_appreciation_percent: shareData.inputs.annualAppreciation || 0,
        annual_rent_increase_percent: shareData.inputs.annualRentIncrease || 0,
        calculation_results: shareData.results,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error saving shared report:", insertError);
      return c.json({ error: "Failed to save report" }, 500);
    }

    // Increment save count on share
    const updatedShareData = {
      ...shareData,
      saveCount: (shareData.saveCount || 0) + 1,
    };
    await kv.set(`share:${token}`, updatedShareData);

    console.log("Shared report saved to user dashboard:", analysis.id);

    return c.json({
      success: true,
      analysisId: analysis.id,
      message: "Report saved to your dashboard",
    });
  } catch (error) {
    console.error("Error saving shared report:", error);
    return c.json({ error: "Failed to save shared report" }, 500);
  }
});

// Get user's share history (requires authentication)
app.get("/make-server-ef294769/reports/my-shares", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Get all shares by this user
    const shares = await kv.getByPrefix(`user_share:${user.id}:`);
    
    // Get full share data for each
    const sharesWithStats = await Promise.all(
      shares.map(async (share: any) => {
        const fullData = await kv.get(`share:${share.token}`);
        return {
          token: share.token,
          propertyName: share.propertyName,
          createdAt: share.createdAt,
          viewCount: fullData?.viewCount || 0,
          saveCount: fullData?.saveCount || 0,
        };
      })
    );

    return c.json({ shares: sharesWithStats });
  } catch (error) {
    console.error("Error fetching share history:", error);
    return c.json({ error: "Failed to fetch share history" }, 500);
  }
});

// Start the server
Deno.serve(app.fetch);

