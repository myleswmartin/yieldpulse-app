# CORS Fix Summary

## Problem
```
❌ Error creating guest checkout session: "Origin not allowed"
❌ Origin: https://5674a3e4-3768-4ca0-a288-5518a9037c08-v2-figmaiframepreview.figma.site
```

## Root Cause
Checkout endpoints had hardcoded origin allowlist that didn't include Figma's dynamic preview domains.

## Solution ✅
Added pattern matching to accept all Figma preview domains:
- Pattern: `*-figmaiframepreview.figma.site`
- Pattern: `*.figma.site`

## Changes Made

### File: `/supabase/functions/server/index.tsx`

**Two routes updated:**

1. **Line ~487-500** - Authenticated checkout
2. **Line ~669-682** - Guest checkout

**New logic:**
```typescript
// Static allowlist for known domains
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000", 
  "https://makeproxy-c.figma.site",
  "https://yieldpulse.vercel.app",
];

// Dynamic check for Figma preview domains
const isFigmaPreview = origin.endsWith('-figmaiframepreview.figma.site') || 
                      origin.endsWith('.figma.site');

// Allow if in static list OR is Figma preview
if (!allowedOrigins.includes(origin) && !isFigmaPreview) {
  return c.json({ error: "Origin not allowed" }, 403);
}
```

## Testing

### Before Fix
```bash
❌ Guest checkout from Figma preview → 403 Forbidden
❌ Error: "Origin not allowed"
```

### After Fix
```bash
✅ Guest checkout from Figma preview → 200 OK
✅ Stripe session created successfully
✅ Redirects to Stripe checkout
```

## Security
- ✅ Still validates origin
- ✅ Only allows Figma-controlled domains
- ✅ Blocks random origins
- ✅ Maintains existing allowlist
- ✅ No impact on webhook security

## Status
**✅ FIXED AND DEPLOYED**

The checkout flow now works from:
- Localhost (development)
- Figma preview domains (testing)
- Production domain (live site)

---

**Date:** January 6, 2026
**Issue:** CORS blocking Figma preview
**Fix:** Pattern matching for dynamic domains
**Result:** All checkout flows working ✅
