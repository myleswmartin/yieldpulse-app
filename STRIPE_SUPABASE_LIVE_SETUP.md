# Stripe + Supabase Live Mode Setup Guide (YieldPulse)

Date: January 05, 2026

This document explains how to configure Stripe **Live Mode** and Supabase Edge
Functions for production. It includes environment variable guidance, webhook
setup, and how to apply the database schema from
`supabase/migration/production.sql`.

---

## 1) Live Mode Checklist (Quick)

- [ ] Stripe Live API keys created
- [ ] Stripe Live webhook secret created
- [ ] Supabase Edge Functions secrets set
- [ ] Supabase Edge Functions deployed
- [ ] Database migration applied (`production.sql`)
- [ ] Live webhook endpoint configured in Stripe Dashboard
- [ ] End?to?end live payment test completed

---

## 2) Required Environment Variables

### A) Supabase Edge Functions (Server?side)

Set these in Supabase Secrets (NOT in frontend `.env`):

```
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
SERVICE_ROLE_KEY=... (optional alias)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
ENVIRONMENT=production
```

Notes:

- `SUPABASE_URL` and `SUPABASE_ANON_KEY` are required for function runtime.
- `SUPABASE_SERVICE_ROLE_KEY` is required for webhook database updates.
- `STRIPE_SECRET_KEY` must be your **Live** secret key (`sk_live_...`).
- `STRIPE_WEBHOOK_SECRET` must match the webhook endpoint created in Stripe Live
  mode.

### B) Frontend (Vercel / Local)

Only public keys should be in the frontend:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

Never expose service role or Stripe secret in the client.

---

## 3) Supabase Secrets Setup (Live)

From project root:

```
# Link project
supabase link --project-ref woqwrkfmdjuaerzpvshj

# Set secrets from local file
supabase secrets set --env-file supabase/.env
```

Make sure `supabase/.env` contains the **LIVE** keys before running this.

---

## 4) Deploy Edge Functions (Live)

```
# Deploy main server function
supabase functions deploy make-server-ef294769 --no-verify-jwt

# Deploy webhook function (public, no JWT)
supabase functions deploy stripe-webhook --no-verify-jwt
```

The `--no-verify-jwt` flag is needed so Stripe can call the webhook without a
JWT.

---

## 5) Stripe Webhook Setup (Live Mode)

1. Open Stripe Dashboard (Live Mode).
2. Go to **Developers ? Webhooks**.
3. Click **Add endpoint**.
4. Endpoint URL:

```
https://woqwrkfmdjuaerzpvshj.supabase.co/functions/v1/stripe-webhook
```

5. Select at least:
   - `checkout.session.completed`

6. Save and copy the **Signing secret**.
7. Update Supabase secret:

```
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 6) Database Migration (Production)

Use the provided schema file:

**File:** `supabase/migration/production.sql`

Apply via Supabase SQL Editor:

1. Open Supabase Dashboard ? SQL Editor
2. Paste full contents of `production.sql`
3. Run the script

This creates:

- `report_purchases` table
- RLS policies
- `profiles`, `analyses`, `report_files`, etc.

Important:

- `report_purchases` updates are restricted to **service_role**.
- Users can only read their own purchases.

---

## 7) Live Mode End?to?End Verification

### A) Trigger a Live Payment

1. Log in as a real user in production.
2. Create a report and click **Upgrade**.
3. Stripe Checkout should open with AED 49.

### B) Verify Webhook

In Stripe Dashboard ? Events:

- Confirm `checkout.session.completed` was received

In Supabase DB:

- `report_purchases.status` should change from `pending` ? `paid`
- `purchased_at` should be set

### C) Verify UI

- Dashboard shows **Premium** for that analysis
- ?View Report? is available

---

## 8) Troubleshooting

### Webhook returns 401

- Ensure `--no-verify-jwt` was used on deploy
- Ensure webhook secret matches live endpoint

### CORS errors

- Confirm `OPTIONS` returns 204
- Confirm frontend calls: `.../functions/v1/make-server-ef294769/...`

### No paid updates

- Check webhook logs in Supabase
- Verify metadata contains `purchase_id`

---

## 9) Security Notes (Live)

- Never expose `SUPABASE_SERVICE_ROLE_KEY` or Stripe secret in client
- Only Edge Functions should update paid status
- Keep webhook idempotent (already implemented)

---
