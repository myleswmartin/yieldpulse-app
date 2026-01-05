# ✅ VISUAL TEST CHECKLIST - Quick Manual QA Guide

**Purpose:** Quick visual validation of critical user journeys  
**Time Required:** 15 minutes  
**Environment:** Staging or Production

---

## 🎯 TEST 1: AUTHENTICATED SAVE FLOW (5 min)

### Setup
- [ ] Sign in as test user
- [ ] Navigate to `/calculator`

### Steps & Expected UI

**Step 1: Fill Calculator**
- [ ] All form fields accept input
- [ ] No validation errors shown
- [ ] "Calculate ROI" button enabled

**Step 2: Click "Calculate ROI"**
- [ ] Button shows "Calculating..." 
- [ ] After ~1 second: "Saving..." indicator
- [ ] Toast appears: ✅ "Analysis saved successfully"
- [ ] Automatic navigation to `/results`

**Step 3: Results Page Loads**
```
✅ VERIFY THESE VISUAL ELEMENTS:
┌─────────────────────────────────────────────┐
│ Property Investment Report                  │
│ Jan 5, 2026                                │
│                                             │
│ [Download PDF (greyed)] [Compare (greyed)]  │
└─────────────────────────────────────────────┘

❌ NO "Save Report" banner should appear

┌─────────────────────────────────────────────┐
│ Executive Summary (Free Preview badge)      │
│ • Gross Yield: X.XX%                       │
│ • Net Yield: X.XX%                         │
│ • Cash Flow: AED X,XXX                     │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Premium Report Analysis                     │
│ [Charts and tables blurred]                 │
│                                             │
│ 🔒 Unlock Complete Analysis                │
│ [Unlock for AED 49] ← BLUE, ENABLED        │
└─────────────────────────────────────────────┘
```

**Step 4: Click "Unlock for AED 49"**
- [ ] Button shows "Processing..."
- [ ] Redirect to Stripe Checkout page
- [ ] Page shows "AED 49.00" payment

**Step 5: Complete Test Payment**
- [ ] Use test card: `4242 4242 4242 4242`
- [ ] Redirect back to YieldPulse
- [ ] Toast: ✅ "Premium report unlocked!"

**Step 6: Results Page After Payment**
```
✅ VERIFY PREMIUM CONTENT VISIBLE:
┌─────────────────────────────────────────────┐
│ Premium Report Analysis                     │
│ [Cash Flow Waterfall Chart - VISIBLE]      │
│ [Yield Comparison Chart - VISIBLE]         │
│ [Financial Tables - VISIBLE]               │
│                                             │
│ ❌ NO LOCK OVERLAY                          │
│ [Download PDF] ← BLUE, ENABLED              │
└─────────────────────────────────────────────┘
```

**✅ PASS CRITERIA:**
- Save happens automatically on calculate
- No "Save Report" banner (already saved)
- Premium unlock button enabled from start
- Payment flow completes
- Premium content unlocks after payment

---

## 🎯 TEST 2: SAVE BANNER TRIGGER (3 min)

### Setup
- [ ] Sign in as test user
- [ ] Open DevTools Console
- [ ] Navigate to `/calculator`

### Steps & Expected UI

**Step 1: Run Calculator**
- [ ] Fill form and calculate
- [ ] Wait for save to complete
- [ ] Navigate to `/results`

**Step 2: Simulate Lost analysisId**
- [ ] In DevTools Console, run:
  ```javascript
  // Find React Fiber
  const root = document.querySelector('#root')._reactRootContainer._internalRoot.current;
  // Note: This is a test simulation - in real scenarios this happens via back button
  ```
- [ ] Alternative: Manually refresh page (loses navigation state)

**Step 3: Navigate Back to Results via Dashboard**
- [ ] Click "Dashboard" in header
- [ ] Should see saved analysis in table
- [ ] Click "View" on the analysis

**Step 4: Verify Banner Does NOT Appear**
```
❌ "Save Report" banner should NOT appear
   (analysisId loaded from database via dashboard)

✅ Premium unlock button should be ENABLED
   (analysisId exists in navigation state)
```

**Alternative Test - Direct URL Navigation:**

**Step 1: Copy Results URL**
- [ ] Copy URL from browser: `https://xxx.supabase.co/results`

**Step 2: Open in New Tab**
- [ ] Paste URL and press Enter
- [ ] Results: "No results to display" (expected)

**✅ PASS CRITERIA:**
- Banner does not appear when analysisId exists
- Dashboard → View always passes analysisId
- Direct URL navigation shows "No results" (correct fallback)

---

## 🎯 TEST 3: UNAUTHENTICATED USER (2 min)

### Setup
- [ ] Sign out (if signed in)
- [ ] Navigate to `/calculator`

### Steps & Expected UI

**Step 1: Fill and Calculate**
- [ ] Fill form
- [ ] Click "Calculate ROI"
- [ ] **IMMEDIATE** navigation to `/results` (no save delay)

**Step 2: Results Page**
```
✅ VERIFY THESE ELEMENTS:
┌─────────────────────────────────────────────┐
│ Executive Summary (Free Preview)            │
│ [Metrics displayed]                         │
└─────────────────────────────────────────────┘

❌ NO "Save Report to Continue" banner at top

┌─────────────────────────────────────────────┐
│ Premium Report Analysis                     │
│ [Lock overlay]                              │
│                                             │
│ 🔒 Unlock Complete Analysis                │
│ [Unlock for AED 49] ← BLUE, ENABLED         │
│                                             │
│ Click button...                             │
└─────────────────────────────────────────────┘

Alert: "Please sign in to unlock the premium report"

┌─────────────────────────────────────────────┐
│ ✅ Save Your Analysis                       │
│ Sign in to save this analysis and access... │
│ [Sign In to Save] ← BLUE BUTTON             │
└─────────────────────────────────────────────┘
```

**Step 3: Click "Unlock for AED 49"**
- [ ] Alert appears: "Please sign in to unlock the premium report"
- [ ] No redirect to Stripe
- [ ] No error in console

**✅ PASS CRITERIA:**
- No save attempt for unauthenticated users
- Alert shown on premium unlock attempt
- "Sign In to Save" banner at bottom of page

---

## 🎯 TEST 4: DASHBOARD OPERATIONS (3 min)

### Setup
- [ ] Sign in as test user with 2+ saved analyses
- [ ] Navigate to `/dashboard`

### Steps & Expected UI

**Step 1: Dashboard Loads**
```
✅ VERIFY TABLE DISPLAYS:
┌──────────────────────────────────────────────────────────┐
│ Your Property Analyses                                   │
│                                                          │
│ Portal  | Price      | Yield  | Cash Flow | Status      │
│---------|------------|--------|-----------|------------- │
│ Bayut   | 1,000,000  | 6.0%   | +2,500    | Free        │
│ PF      | 850,000    | 5.5%   | -500      | Premium     │
│                                                          │
│ [View] [Delete]  per row                                │
└──────────────────────────────────────────────────────────┘
```

**Step 2: Click "View" on First Analysis**
- [ ] Navigate to `/results`
- [ ] Executive Summary shows correct data
- [ ] Premium section shows lock if status = "Free"
- [ ] Premium section unlocked if status = "Premium"

**Step 3: Back to Dashboard**
- [ ] Click "Dashboard" in header
- [ ] Table reloads (brief loading state)
- [ ] Same analyses displayed

**Step 4: Click "Delete" on an Analysis**
- [ ] Confirmation dialog: "Are you sure you want to delete this analysis?"
- [ ] [Cancel] button shown
- [ ] [Delete] button shown

**Step 5: Click "Cancel"**
- [ ] Dialog closes
- [ ] Analysis still in table

**Step 6: Click "Delete" Again, Then Confirm**
- [ ] Row shows "Deleting..." state
- [ ] Row disappears from table
- [ ] Toast: ✅ "Analysis deleted successfully"

**✅ PASS CRITERIA:**
- Dashboard shows all saved analyses
- View navigates with full data
- Delete removes row and shows toast
- Cancel doesn't delete

---

## 🎯 TEST 5: ERROR HANDLING (2 min)

### Setup
- [ ] Sign in as test user
- [ ] Open DevTools Network tab

### Steps & Expected UI

**Test 5A: Save Failure**

**Step 1: Block API Request**
- [ ] In Network tab, right-click filter
- [ ] Add pattern: `*/analyses`
- [ ] Block requests

**Step 2: Run Calculator**
- [ ] Fill form
- [ ] Click "Calculate ROI"
- [ ] **NO NAVIGATION** to results

**Step 3: Verify Error Toast**
```
✅ VERIFY ERROR TOAST APPEARS:
┌─────────────────────────────────────────────┐
│ ❌ Save Analysis                            │
│                                             │
│ Failed to save analysis. Please try again  │
│ before viewing results.                     │
│                                             │
│ Request ID: req_abc123xyz                   │
│                                             │
│ [Try Again]                                 │
└─────────────────────────────────────────────┘
```

**Step 4: Click "Try Again"**
- [ ] Unblock network requests
- [ ] Toast appears again with retry
- [ ] Click "Try Again"
- [ ] Save succeeds, navigation occurs

**Test 5B: Delete Failure**

**Step 1: Navigate to Dashboard**
- [ ] Block `*/analyses/*` DELETE requests

**Step 2: Delete an Analysis**
- [ ] Click "Delete" → Confirm
- [ ] Error toast appears with requestId
- [ ] "Retry" button shown

**Step 3: Click "Retry"**
- [ ] Unblock requests
- [ ] Click "Retry"
- [ ] Delete succeeds

**✅ PASS CRITERIA:**
- Save failures block navigation
- Error toasts show requestId
- Retry buttons work
- Console logs include `[{requestId}]`

---

## 📋 FINAL CHECKLIST

### Before Marking Complete

- [ ] All 5 test scenarios passed
- [ ] No console errors during tests
- [ ] All toasts displayed correctly
- [ ] All navigation worked as expected
- [ ] RequestIds shown in error toasts
- [ ] Database queries returned correct data

### Issues Found

**List any issues here:**
1. _________________________________________________
2. _________________________________________________
3. _________________________________________________

### Sign-Off

- **Tested By:** ___________________________
- **Date:** ___________________________
- **Environment:** [ ] Staging  [ ] Production
- **Status:** [ ] ✅ PASS  [ ] ❌ FAIL  [ ] ⚠️ ISSUES FOUND

---

**Next Steps After PASS:**
1. Document any minor issues as post-launch tasks
2. Proceed with production deployment
3. Monitor error logs for 24 hours
4. Schedule follow-up review in 1 week

**If FAIL:**
1. Document all failures in detail
2. Create bug tickets with reproduction steps
3. Fix issues and re-test
4. Do not deploy until all critical issues resolved
