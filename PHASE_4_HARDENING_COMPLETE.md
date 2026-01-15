# Phase 4 Critical Fixes and Authentication Hardening - Complete

## Files Changed

1. `/supabase/functions/server/index.tsx` - Added Stripe routes with proper auth
2. `/src/pages/ResultsPage.tsx` - Updated to use user JWT access token
3. `/src/contexts/AuthContext.tsx` - Fixed sign out reliability
4. `/src/components/Header.tsx` - Fixed sign out navigation
5. `/DATABASE_MIGRATION_STRIPE.sql` - Updated RLS policies (already provided)

## Updated Code Excerpts

### 1. ResultsPage Checkout Call (Uses User Access Token)

```typescript
const handleUnlockPremium = async () => {
  if (!user) {
    alert('Please sign in to unlock the premium report');
    return;
  }

  if (!analysisId) {
    alert('Analysis not saved. Please save your analysis first.');
    return;
  }

  setCreatingCheckout(true);
  
  try {
    // Get user access token
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.access_token) {
      alert('Please sign in again to continue');
      return;
    }

    const currentOrigin = window.location.origin;
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-ef294769/stripe/checkout-session`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`, // USER JWT, NOT ANON KEY
        },
        body: JSON.stringify({
          analysisId,
          origin: currentOrigin,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create checkout session');
    }

    const { url } = await response.json();
    window.location.href = url;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    alert('Failed to initiate payment. Please try again.');
  } finally {
    setCreatingCheckout(false);
  }
};
```

### 2. Edge Function Auth Resolution

```typescript
app.post("/make-server-ef294769/stripe/checkout-session", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];

    if (!accessToken) {
      console.error("Checkout session: Missing Authorization header");
      return c.json({ error: "Unauthorized" }, 401);
    }

    // STEP 1: Authenticate user with anon key client + user JWT
    const anonSupabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!, // ANON KEY
      {
        global: {
          headers: { Authorization: `Bearer ${accessToken}` }, // USER JWT
        },
      }
    );

    const {
      data: { user },
      error: authError,
    } = await anonSupabase.auth.getUser(); // Validates user identity

    if (authError || !user) {
      console.error("Authentication failed:", authError);
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Parse request - server controlled pricing
    const { analysisId, origin } = await c.req.json();

    // Server controlled redirect URLs with allowlist
    const allowedOrigins = [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://yieldpulse.vercel.app",
      "https://yieldpulse-production.vercel.app"
    ];

    const clientOrigin = origin || c.req.header("origin") || c.req.header("referer")?.split("/").slice(0, 3).join("/");
    
    if (!clientOrigin || !allowedOrigins.includes(clientOrigin)) {
      console.error("Invalid origin:", clientOrigin);
      return c.json({ error: "Invalid origin" }, 403);
    }

    const successUrl = `${clientOrigin}/dashboard?payment=success&analysisId=${analysisId}`;
    const cancelUrl = `${clientOrigin}/dashboard?payment=cancelled`;

    // STEP 2: Use service role client for database operations
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")! // SERVICE ROLE for DB writes
    );

    // Fetch analysis owned by user
    const { data: analysis, error: analysisError } = await supabase
      .from("analyses")
      .select("*")
      .eq("id", analysisId)
      .eq("user_id", user.id) // Verified from auth.getUser above
      .single();

    if (analysisError || !analysis) {
      return c.json({ error: "Analysis not found or access denied" }, 404);
    }

    // Idempotency: check for existing paid purchase
    const { data: existingPaidPurchases } = await supabase
      .from("report_purchases")
      .select("*")
      .eq("user_id", user.id)
      .eq("analysis_id", analysisId)
      .eq("status", "paid");

    if (existingPaidPurchases && existingPaidPurchases.length > 0) {
      return c.json({ 
        error: "Premium report already unlocked for this analysis",
        alreadyPurchased: true 
      }, 400);
    }

    // Idempotency: check for recent pending purchase
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
    let isReusedPurchase = false;

    if (recentPendingPurchases && recentPendingPurchases.length > 0) {
      purchase = recentPendingPurchases[0];
      isReusedPurchase = true;
      console.log("Reusing existing pending purchase:", purchase.id);
    } else {
      // Create minimized snapshot
      const snapshot = {
        inputs: { /* minimized inputs */ },
        results: analysis.calculation_results,
        metadata: { analysisId: analysis.id, createdAt: analysis.created_at },
        report_version: "v1",
        calculation_version: "v1",
        snapshot_created_at: new Date().toISOString(),
      };

      const { data: newPurchase, error: purchaseError } = await supabase
        .from("report_purchases")
        .insert({
          user_id: user.id,
          analysis_id: analysisId,
          amount_aed: 49, // Server controlled pricing
          currency: "aed",
          status: "pending",
          report_version: "v1",
          snapshot: snapshot,
        })
        .select()
        .single();

      if (purchaseError) {
        return c.json({ error: "Failed to create purchase record" }, 500);
      }

      purchase = newPurchase;
    }

    // Create Stripe session...
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{ /* ... */ }],
      mode: "payment",
      success_url: successUrl, // Server constructed
      cancel_url: cancelUrl,   // Server constructed
      metadata: {
        purchase_id: purchase.id,
        user_id: user.id,
        analysis_id: analysisId,
      },
    });

    return c.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});
```

### 3. Webhook Verification with Raw Body

```typescript
app.post("/make-server-ef294769/stripe/webhook", async (c) => {
  try {
    const signature = c.req.header("stripe-signature");
    
    if (!signature) {
      return c.json({ error: "Missing signature" }, 400);
    }

    // Get raw body bytes for signature verification
    const rawBody = await c.req.arrayBuffer();
    const bodyBuffer = new Uint8Array(rawBody);
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

    // Verify webhook signature using raw bytes
    let event;
    try {
      event = stripe.webhooks.constructEvent(bodyBuffer, signature, webhookSecret);
    } catch (err) {
      console.error("Stripe webhook signature verification failed:", err);
      return c.json({ error: "Invalid signature" }, 400);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const purchaseId = session.metadata?.purchase_id;

      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );

      // Idempotency check
      const { data: existingPurchase } = await supabase
        .from("report_purchases")
        .select("*")
        .eq("id", purchaseId)
        .single();

      if (existingPurchase?.status === "paid") {
        console.log("Purchase already marked as paid (idempotent):", purchaseId);
        return c.json({ received: true, alreadyProcessed: true });
      }

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
        return c.json({ error: "Failed to update purchase" }, 500);
      }

      console.log("Purchase marked as paid:", purchase.id);
    }

    return c.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return c.json({ error: "Webhook processing failed" }, 500);
  }
});
```

### 4. Purchase Status Endpoint (Same Auth Pattern)

```typescript
app.get("/make-server-ef294769/purchases/status", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];

    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Authenticate user with anon key client
    const anonSupabase = createClient(
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
    } = await anonSupabase.auth.getUser();

    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const analysisId = c.req.query("analysisId");

    // Use service role client for database query
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: purchases, error } = await supabase
      .from("report_purchases")
      .select("*")
      .eq("user_id", user.id)
      .eq("analysis_id", analysisId)
      .eq("status", "paid")
      .order("purchased_at", { ascending: false })
      .limit(1);

    if (error) {
      return c.json({ error: "Failed to check purchase status" }, 500);
    }

    if (purchases && purchases.length > 0) {
      return c.json({ status: "paid", purchase: purchases[0] });
    }

    return c.json({ status: "none" });
  } catch (error) {
    return c.json({ error: "Internal server error" }, 500);
  }
});
```

### 5. Updated SQL RLS Policies

```sql
-- Row Level Security Policies (HARDENED)
ALTER TABLE report_purchases ENABLE ROW LEVEL SECURITY;

-- Users can ONLY view their own purchases (SELECT only)
CREATE POLICY "Users can view own purchases"
  ON report_purchases
  FOR SELECT
  USING (auth.uid() = user_id);

-- NO authenticated INSERT - only service role can insert via Edge Function
CREATE POLICY "Service role can insert purchases"
  ON report_purchases
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- Only service role can update purchases (webhook only)
CREATE POLICY "Service role can update purchases"
  ON report_purchases
  FOR UPDATE
  USING (auth.role() = 'service_role');

-- NO DELETE allowed for anyone except service role
CREATE POLICY "Service role can delete purchases"
  ON report_purchases
  FOR DELETE
  USING (auth.role() = 'service_role');
```

## Key Security Improvements

### 1. Authentication Flow
✅ Frontend sends user JWT access token (not anon key)
✅ Backend validates user with anon client + JWT
✅ Service role used only for database operations after auth

### 2. Server Controlled Security
✅ Pricing hardcoded server side (AED 49)
✅ Redirect URLs constructed from allowlist
✅ Origin validation before checkout

### 3. Idempotency
✅ Reuse recent pending purchases (30 min window)
✅ Webhook updates are idempotent (no duplicate paid status)
✅ Check for existing paid purchases before creating new

### 4. Minimized Snapshots
✅ Store only: inputs, results, metadata
✅ No full analysis row duplication
✅ Includes version tracking

### 5. Webhook Security
✅ Raw body bytes used for signature verification
✅ Uint8Array passed to Stripe SDK
✅ Idempotent webhook processing

### 6. RLS Hardening
✅ No authenticated INSERT on report_purchases
✅ No authenticated DELETE on report_purchases
✅ Service role only for writes
✅ Users can only SELECT their own purchases

### 7. Sign Out Reliability
✅ User state cleared immediately
✅ Navigation deterministic
✅ No blocking catch/finally logic
✅ Consistent UI state across refresh

## Testing Checklist

- [x] Build passes
- [x] Sign in works with JWT authentication
- [x] Sign out clears state and navigates to home
- [x] Dashboard loads user analyses
- [x] Checkout session creation uses user JWT
- [x] Checkout session validates origin allowlist
- [x] Checkout session creates minimized snapshot
- [x] Checkout session enforces server pricing
- [x] Webhook verifies signature with raw bytes
- [x] Webhook updates are idempotent
- [x] Purchase status endpoint uses user JWT
- [x] RLS policies prevent unauthorized access
- [x] Idempotency prevents duplicate purchases

## Production Readiness

✅ No anon key in Authorization headers to protected endpoints
✅ User identity verified via JWT before all operations
✅ Service role isolated to database writes only
✅ Webhook verified entitlement system
✅ Immutable purchase snapshots with version tracking
✅ Server controlled pricing and redirect URLs
✅ Comprehensive error logging
✅ Audit trail via purchase records
