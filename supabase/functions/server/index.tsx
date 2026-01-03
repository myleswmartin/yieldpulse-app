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
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

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

app.post("/make-server-ef294769/payments/create", async (c) => {
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

    const { analysisId } = await c.req.json();

    if (!analysisId) {
      return c.json({ error: "Analysis ID is required" }, 400);
    }

    // Check if payment already exists
    const { data: existingPayment } = await supabase
      .from("payments")
      .select("*")
      .eq("analysis_id", analysisId)
      .single();

    if (existingPayment) {
      return c.json({ error: "Payment already exists for this analysis" }, 400);
    }

    // Create payment record (simulated payment - automatically completed)
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .insert({
        user_id: user.id,
        analysis_id: analysisId,
        amount_aed: 49.0,
        payment_status: "completed",
        payment_method: "simulated",
        transaction_id: `sim_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      })
      .select()
      .single();

    if (paymentError) {
      console.error("Error creating payment:", paymentError);
      return c.json({ error: paymentError.message }, 400);
    }

    // Update analysis to mark as paid
    const { error: updateError } = await supabase
      .from("analyses")
      .update({ is_paid: true })
      .eq("id", analysisId);

    if (updateError) {
      console.error("Error updating analysis paid status:", updateError);
    }

    return c.json(payment);
  } catch (error) {
    console.error("Error in create payment:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// ================================================================
// ADMIN ROUTES
// ================================================================

// Start the server
Deno.serve(app.fetch);