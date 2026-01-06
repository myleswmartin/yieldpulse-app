# Stripe Environment Variables Setup

## Required Environment Variables

You must add these environment variables to your Supabase Edge Functions before the Stripe integration will work.

---

## 1. Get Stripe Secret Key

1. Go to https://dashboard.stripe.com/test/apikeys
2. Click "Reveal test key" under "Secret key"
3. Copy the key starting with `sk_test_...`

**Add to Supabase**:
```bash
STRIPE_SECRET_KEY=sk_test_51XXXXXXXXXXXX...
```

---

## 2. Create and Configure Webhook

### Step 1: Create Webhook Endpoint in Stripe

1. Go to https://dashboard.stripe.com/test/webhooks
2. Click "+ Add endpoint"
3. Enter endpoint URL:
   ```
   https://woqwrkfmdjuaerzpvshj.supabase.co/functions/v1/stripe-webhook
   ```
4. Select events to listen for:
   - `checkout.session.completed`
5. Click "Add endpoint"

### Step 2: Get Webhook Signing Secret

1. Click on the webhook endpoint you just created
2. Under "Signing secret", click "Reveal"
3. Copy the key starting with `whsec_...`

**Add to Supabase**:
```bash
STRIPE_WEBHOOK_SECRET=whsec_XXXXXXXXXXXXXXXXXXXXXXXXXX
```

---

## 3. Add Environment Variables to Supabase

### Option A: Via Supabase Dashboard (Recommended)

1. Go to https://supabase.com/dashboard/project/woqwrkfmdjuaerzpvshj/settings/functions
2. Scroll to "Environment Variables"
3. Add two new secrets:
   - Name: `STRIPE_SECRET_KEY`, Value: `sk_test_...`
   - Name: `STRIPE_WEBHOOK_SECRET`, Value: `whsec_...`
4. Save changes
5. **Important**: Redeploy your Edge Functions for changes to take effect

### Option B: Via Supabase CLI

```bash
supabase secrets set STRIPE_SECRET_KEY=sk_test_XXXXXXXXX
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_XXXXXXXXX
```

Then redeploy:
```bash
supabase functions deploy make-server-ef294769
supabase functions deploy stripe-webhook --no-verify-jwt
```

---

## 4. Test Payment Flow

### Use Stripe Test Cards

**Successful Payment**:
- Card: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., `12/34`)
- CVC: Any 3 digits (e.g., `123`)
- ZIP: Any 5 digits (e.g., `12345`)

**Failed Payment** (for testing):
- Card: `4000 0000 0000 0002`

**Requires Authentication** (3D Secure):
- Card: `4000 0027 6000 3184`

---

## 5. Verify Webhook is Working

### Test Webhook Locally (Optional)

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Forward webhook events to local server:
   ```bash
   stripe listen --forward-to http://localhost:54321/functions/v1/stripe-webhook
   ```
3. Trigger test event:
   ```bash
   stripe trigger checkout.session.completed
   ```

### Test Webhook in Production

1. Go to https://dashboard.stripe.com/test/webhooks
2. Click on your webhook endpoint
3. Click "Send test webhook"
4. Select event: `checkout.session.completed`
5. Click "Send test webhook"
6. Check "Response" tab - should see `200 OK`

---

## 6. Verify Integration

### End-to-End Test

1. Sign in to YieldPulse
2. Run a property calculation
3. Save the analysis
4. Click "Unlock for AED 49" on ResultsPage
5. Complete payment with test card `4242 4242 4242 4242`
6. Verify redirect to Dashboard with success banner
7. Click "View Report"
8. Verify premium content is unlocked (no overlay)

### Check Database

```sql
-- Check purchase was created
SELECT * FROM report_purchases ORDER BY created_at DESC LIMIT 5;

-- Verify status is 'paid'
SELECT status, purchased_at, stripe_payment_intent_id 
FROM report_purchases 
WHERE status = 'paid';
```

---

## 7. Monitoring and Debugging

### Check Stripe Dashboard

- **Payments**: https://dashboard.stripe.com/test/payments
- **Webhook Events**: https://dashboard.stripe.com/test/webhooks/[your-webhook-id]
- **Logs**: https://dashboard.stripe.com/test/logs

### Check Supabase Logs

1. Go to https://supabase.com/dashboard/project/woqwrkfmdjuaerzpvshj/logs/edge-functions
2. Filter by function: `make-server-ef294769` (checkout + purchase creation)
3. Look for:
   - `Purchase record created: <uuid>`
   - `Stripe checkout session created: <session_id>`
4. Filter by function: `stripe-webhook` (webhook processing)
5. Look for:
   - `Webhook event received: checkout.session.completed`
   - `Purchase marked as paid: <uuid>`

### Common Issues

**Issue**: Webhook returns 500 error  
**Solution**: Check `STRIPE_WEBHOOK_SECRET` is set correctly

**Issue**: Premium doesn't unlock after payment  
**Solution**: Check webhook event was received and processed (Supabase logs)

**Issue**: "Invalid signature" error in webhook  
**Solution**: Verify webhook secret matches Stripe Dashboard secret

**Issue**: Checkout session creation fails  
**Solution**: Verify `STRIPE_SECRET_KEY` is set correctly

---

## 8. Production Checklist (For Live Launch)

- [ ] Switch from Test Mode to Live Mode in Stripe Dashboard
- [ ] Replace `STRIPE_SECRET_KEY` with live key (`sk_live_...`)
- [ ] Create new webhook endpoint for live mode
- [ ] Replace `STRIPE_WEBHOOK_SECRET` with live webhook secret
- [ ] Update webhook URL to production Edge Function URL
- [ ] Test payment flow in production with real card
- [ ] Monitor first few payments closely

---

## Security Notes

- ✅ Never commit `STRIPE_SECRET_KEY` to version control
- ✅ Never expose `STRIPE_SECRET_KEY` to frontend
- ✅ Always verify webhook signatures
- ✅ Use HTTPS for webhook endpoints (already done via Supabase)
- ✅ Log webhook events for audit trail (already implemented)

---

## Support Resources

- **Stripe Docs**: https://stripe.com/docs
- **Stripe Checkout**: https://stripe.com/docs/payments/checkout
- **Stripe Webhooks**: https://stripe.com/docs/webhooks
- **Supabase Edge Functions**: https://supabase.com/docs/guides/functions
- **Supabase Environment Variables**: https://supabase.com/docs/guides/functions/secrets

---

**Status**: Ready for testing once environment variables are configured ✅
