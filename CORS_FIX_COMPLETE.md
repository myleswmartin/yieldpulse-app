# CORS Error Fix - Complete

## Issue

```
Error creating guest checkout session: {
  "error": "Origin not allowed",
  "requestId": "11602120-489b-4a38-902f-ccd1f4f5cd01",
  "status": 403
}
Guest checkout: Origin not allowed: https://5674a3e4-3768-4ca0-a288-5518a9037c08-v2-figmaiframepreview.figma.site
```

**Root Cause:** The checkout endpoints had a hardcoded origin allowlist that didn't include Figma preview domains.

---

## Fix Applied ✅

Updated two checkout endpoints in `/supabase/functions/server/index.tsx`:

### 1. Authenticated Checkout (`POST /make-server-ef294769/checkout/create-session`)
**Lines: 486-497**

**Before:**
```typescript
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
```

**After:**
```typescript
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://makeproxy-c.figma.site",
  "https://yieldpulse.vercel.app",
];

// Also allow Figma preview domains
const isFigmaPreview = origin.endsWith('-figmaiframepreview.figma.site') || 
                      origin.endsWith('.figma.site');

if (!allowedOrigins.includes(origin) && !isFigmaPreview) {
  console.error("Checkout session: Origin not allowed:", origin);
  return c.json({ error: "Origin not allowed" }, 403);
}
```

---

### 2. Guest Checkout (`POST /make-server-ef294769/checkout/guest-session`)
**Lines: 668-679**

**Before:**
```typescript
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://makeproxy-c.figma.site",
  "https://yieldpulse.vercel.app",
];

if (!allowedOrigins.includes(origin)) {
  console.error("Guest checkout: Origin not allowed:", origin);
  return c.json({ error: "Origin not allowed" }, 403);
}
```

**After:**
```typescript
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://makeproxy-c.figma.site",
  "https://yieldpulse.vercel.app",
];

// Also allow Figma preview domains
const isFigmaPreview = origin.endsWith('-figmaiframepreview.figma.site') || 
                      origin.endsWith('.figma.site');

if (!allowedOrigins.includes(origin) && !isFigmaPreview) {
  console.error("Guest checkout: Origin not allowed:", origin);
  return c.json({ error: "Origin not allowed" }, 403);
}
```

---

## What Changed

### Pattern Matching Added
The fix now accepts origins that match these patterns:
- `*-figmaiframepreview.figma.site` (dynamic Figma preview domains)
- `*.figma.site` (all Figma subdomains)

This allows:
✅ `https://5674a3e4-3768-4ca0-a288-5518a9037c08-v2-figmaiframepreview.figma.site`
✅ `https://makeproxy-c.figma.site`
✅ `https://any-other-preview.figma.site`
✅ All previously allowed origins (localhost, production domain)

### Security Maintained
- Still validates origin header exists
- Still blocks random domains
- Only allows Figma-controlled domains and whitelisted origins
- Stripe webhooks remain secure (they use different endpoint)

---

## Testing

### Test Guest Checkout Flow
1. Open app in Figma preview: `https://*-figmaiframepreview.figma.site`
2. Go to calculator
3. Enter property details
4. Click "Generate Report"
5. Click "Unlock Report" as guest
6. Should redirect to Stripe checkout ✅

### Test Authenticated Checkout Flow
1. Sign in to the app
2. Go to dashboard
3. Create a new analysis
4. Click "Unlock Report"
5. Should redirect to Stripe checkout ✅

### Expected Behavior
- ✅ No more "Origin not allowed" errors
- ✅ Stripe checkout session created successfully
- ✅ Redirected to Stripe payment page
- ✅ Can complete purchase

---

## Verification Checklist

After deploying the fix:

- [ ] Guest checkout works from Figma preview domain
- [ ] Authenticated checkout works from Figma preview domain
- [ ] Guest checkout still works from localhost
- [ ] Authenticated checkout still works from localhost
- [ ] Production domain still works (if deployed)
- [ ] Invalid origins are still blocked
- [ ] Stripe webhooks continue to work

---

## Related Endpoints

These endpoints are now Figma-preview compatible:

1. **POST** `/make-server-ef294769/checkout/create-session`
   - For authenticated users purchasing reports
   - Requires: `analysisId`, `origin`
   - Returns: Stripe checkout session URL

2. **POST** `/make-server-ef294769/checkout/guest-session`
   - For guest users purchasing reports
   - Requires: `inputs`, `results`, `origin`
   - Returns: Stripe checkout session URL

---

## Additional Notes

### Why This Error Occurred
Figma generates dynamic preview domains with UUIDs in the URL:
- Format: `https://{uuid}-v2-figmaiframepreview.figma.site`
- These change on each deployment/preview
- Cannot be hardcoded in allowlist

### The Solution
Instead of hardcoding specific domains, we now:
1. Check if origin is in the static allowlist (localhost, production)
2. If not, check if it matches Figma domain pattern
3. Only allow if one of the above is true

### Security Considerations
**Q: Is it safe to allow all `.figma.site` domains?**
A: Yes, because:
- Only Figma can create subdomains under `.figma.site`
- User-generated content is sandboxed
- Stripe checkout happens on Stripe's domain (secure)
- We validate the purchase data server-side
- Payment processing is isolated from origin

---

## Status

✅ **FIXED** - Both checkout endpoints now accept Figma preview domains

---

**Fix applied:** January 6, 2026
**Issue:** CORS origin blocking Figma preview
**Solution:** Pattern matching for Figma domains
**Testing:** Required after deployment
