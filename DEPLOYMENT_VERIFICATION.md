# YieldPulse Deployment Verification Checklist

Use this checklist to verify the deployment is working correctly after syncing to GitHub and deploying to Vercel.

---

## Pre-Deployment Checks

### ✅ Files Synced to GitHub
- [ ] All files from Figma Make synced to GitHub repository
- [ ] `package.json` has all dependencies
- [ ] `vercel.json` exists with SPA rewrites
- [ ] All page files in `/src/pages/` committed
- [ ] All component files in `/src/components/` committed
- [ ] Server files in `/supabase/functions/server/` committed

### ✅ Database Setup
- [ ] Supabase project created
- [ ] Database schema executed (`DATABASE_SCHEMA.sql`)
- [ ] `profiles` table exists
- [ ] `analyses` table exists
- [ ] `payments` table exists (for future)
- [ ] RLS policies enabled and active

### ✅ Supabase Edge Function
- [ ] Edge function deployed: `supabase functions deploy make-server-ef294769`
- [ ] Environment variables set in Supabase:
  - [ ] SUPABASE_URL
  - [ ] SUPABASE_ANON_KEY
  - [ ] SUPABASE_SERVICE_ROLE_KEY

### ✅ Vercel Configuration
- [ ] GitHub repository connected to Vercel
- [ ] Build settings:
  - Framework: Vite
  - Build Command: `pnpm build`
  - Output Directory: `dist`
- [ ] Environment variables set:
  - [ ] VITE_SUPABASE_URL
  - [ ] VITE_SUPABASE_ANON_KEY

---

## Post-Deployment Testing

### 1️⃣ Homepage Tests

**Navigate to:** `https://your-domain.vercel.app/`

- [ ] Page loads without errors
- [ ] Header shows: Logo, "Calculator", "Sign In", "Get Started"
- [ ] Hero section displays correctly
- [ ] Features grid shows 3 cards
- [ ] "How It Works" section visible
- [ ] CTA buttons work
- [ ] Footer displays

**Browser Console:**
- [ ] No error messages
- [ ] No 404s for resources

**Actions:**
- [ ] Click "Get Started" → Navigates to `/calculator`
- [ ] Click "Sign In" → Navigates to `/auth/signin`
- [ ] Click Logo → Stays on homepage

---

### 2️⃣ Calculator Tests (Guest User)

**Navigate to:** `https://your-domain.vercel.app/calculator`

- [ ] Page loads without errors
- [ ] Form displays with all input fields
- [ ] Default values populated
- [ ] Portal dropdown works
- [ ] All numeric inputs accept numbers

**Fill Form and Calculate:**
- [ ] Use default values or enter custom data
- [ ] Click "Calculate ROI"
- [ ] Quick results preview appears on same page
- [ ] 4 metric cards display:
  - Gross Yield
  - Net Yield
  - Monthly Cash Flow
  - Cash on Cash Return
- [ ] Blue info box appears: "Sign in to save..."
- [ ] Auto-navigates to `/results` page

**Browser Console:**
- [ ] Check for: "Error saving analysis" (OK if not signed in)
- [ ] No other errors

---

### 3️⃣ Results Page Tests

**Currently at:** `/results` (from calculator)

- [ ] Page loads with calculation results
- [ ] Header shows: Logo, "Back to Calculator"
- [ ] 4 key metric cards display with correct values
- [ ] Financial overview section shows 3 metrics
- [ ] Operating expenses section shows 3 items
- [ ] Premium section (locked) displays:
  - 4 feature cards
  - "AED 49" pricing
  - "Coming Soon" button (disabled)
- [ ] Sign-in prompt appears at bottom (for guests)

**Actions:**
- [ ] Click "Back to Calculator" → Returns to `/calculator`
- [ ] Click "Calculate Another Property" → Goes to `/calculator`
- [ ] Click "Sign In to Save" → Goes to `/auth/signin`

**Direct Access Test:**
- [ ] Navigate directly to `/results` (no state)
- [ ] Should show: "No results to display"
- [ ] Link to calculator works

---

### 4️⃣ Sign Up Tests

**Navigate to:** `/auth/signup`

- [ ] Page loads without errors
- [ ] Sign up form displays with 4 fields:
  - Full Name
  - Email
  - Password
  - Confirm Password
- [ ] Benefits list shows 4 items
- [ ] "Already have an account? Sign In" link visible

**Create Test Account:**
- [ ] Enter full name: "Test User"
- [ ] Enter email: `test+{timestamp}@example.com` (unique)
- [ ] Enter password: "password123"
- [ ] Confirm password: "password123"
- [ ] Click "Create Account"
- [ ] Loading state shows: "Creating Account..."
- [ ] Success: Redirects to `/dashboard`

**Error Cases to Test:**
- [ ] Password < 6 chars → Shows error
- [ ] Passwords don't match → Shows error
- [ ] Empty fields → Browser validation blocks submit
- [ ] Duplicate email → Shows error from server

**Browser Console:**
- [ ] No errors on success
- [ ] Check network tab: POST to `/auth/signup` succeeds

---

### 5️⃣ Dashboard Tests (Authenticated)

**Currently at:** `/dashboard` (after signup)

- [ ] Page loads without errors
- [ ] Header shows:
  - Logo
  - "New Analysis" button
  - "Sign Out" button
- [ ] Welcome message: "Welcome back, Test User"
- [ ] Stats cards show:
  - Total Analyses: 0
  - Premium Reports: 0
  - Free Reports: 0
- [ ] Empty state displays:
  - Calculator icon
  - "No Analyses Yet" message
  - "Create First Analysis" button

**Actions:**
- [ ] Click "New Analysis" → Goes to `/calculator`
- [ ] Click "Create First Analysis" → Goes to `/calculator`

---

### 6️⃣ Calculator Tests (Authenticated User)

**Navigate to:** `/calculator` (while signed in)

- [ ] Page loads
- [ ] NO blue info box about signing in (user is authenticated)
- [ ] Fill in property details (or use defaults)
- [ ] Click "Calculate ROI"
- [ ] Results preview appears
- [ ] Auto-navigates to `/results`

**Check Database Save:**
- [ ] Open Supabase Dashboard
- [ ] Go to Table Editor → `analyses`
- [ ] Should see 1 new row with:
  - user_id matching your test user
  - purchase_price, area_sqft, etc.
  - calculation_results (JSONB)
  - is_paid = false
  - created_at timestamp

**Browser Console:**
- [ ] No "Failed to save" error
- [ ] Network tab shows: POST to `/analyses` returns 200

---

### 7️⃣ Dashboard with Data

**Navigate to:** `/dashboard`

- [ ] Page loads
- [ ] Stats updated:
  - Total Analyses: 1
  - Premium Reports: 0
  - Free Reports: 1
- [ ] Table displays with 1 row showing:
  - Portal (Bayut/etc)
  - Property size
  - Purchase price (formatted as AED)
  - Gross yield (percentage)
  - Monthly cash flow (green if positive, red if negative)
  - Created date
  - Status badge: "Free"
  - Action buttons: View (eye icon), Delete (trash icon)

**Actions:**
- [ ] Hover over row → Background changes
- [ ] Click "View" icon → Navigates to `/results` with saved data
- [ ] Verify results page shows correct metrics from saved analysis
- [ ] Go back to `/dashboard`
- [ ] Click "Delete" icon
- [ ] Confirm deletion dialog appears
- [ ] Click OK
- [ ] Row disappears
- [ ] Stats update: Total Analyses: 0
- [ ] Empty state appears again

**Check Database:**
- [ ] Refresh `analyses` table in Supabase
- [ ] Row should be deleted

---

### 8️⃣ Sign Out and Sign In

**On Dashboard:**
- [ ] Click "Sign Out"
- [ ] Redirects to homepage
- [ ] Header shows "Sign In" button (not "My Reports")

**Navigate to Dashboard While Signed Out:**
- [ ] Go to `/dashboard` directly
- [ ] Should redirect to `/auth/signin`
- [ ] URL shows: `/auth/signin`

**Sign In:**
- [ ] Enter email from test account
- [ ] Enter password
- [ ] Click "Sign In"
- [ ] Success: Redirects to `/dashboard`
- [ ] Session persists

**Refresh Test:**
- [ ] Press F5 to refresh page
- [ ] Should stay on `/dashboard`
- [ ] Should NOT redirect to sign in
- [ ] User data loads correctly

---

### 9️⃣ Session Persistence

**Test Browser Refresh:**
- [ ] While signed in, on any page
- [ ] Press F5 or Cmd+R
- [ ] Page reloads
- [ ] User stays signed in
- [ ] No redirect to sign-in page

**Test New Tab:**
- [ ] Open new tab
- [ ] Navigate to your domain
- [ ] Should show "My Reports" in header (still signed in)
- [ ] Click "My Reports" → Goes to dashboard without sign in

**Test Close and Reopen:**
- [ ] Close browser completely
- [ ] Reopen browser
- [ ] Navigate to your domain
- [ ] Should still be signed in (session persists)

---

### 🔟 Multiple Analyses Test

**Create 3 Analyses:**
1. [ ] Calculate Property 1 (e.g., 1M AED villa)
2. [ ] Go to dashboard → Should show 1 analysis
3. [ ] Click "New Analysis"
4. [ ] Calculate Property 2 (e.g., 1.5M AED apartment)
5. [ ] Go to dashboard → Should show 2 analyses
6. [ ] Click "New Analysis"
7. [ ] Calculate Property 3 (e.g., 800K AED studio)
8. [ ] Go to dashboard → Should show 3 analyses

**Verify Dashboard:**
- [ ] Stats show: Total Analyses: 3
- [ ] Table shows all 3 rows
- [ ] Rows sorted by date (newest first)
- [ ] Each row has unique data
- [ ] Can view any analysis
- [ ] Can delete any analysis

---

## Browser Compatibility Tests

### Desktop Browsers
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile Browsers
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

### Responsive Design
- [ ] Desktop (1920px) - Full layout
- [ ] Laptop (1440px) - Full layout
- [ ] Tablet (768px) - 2 column grid
- [ ] Mobile (375px) - Single column
- [ ] Tables scroll horizontally on mobile
- [ ] Forms remain usable on mobile

---

## Performance Tests

### Page Load Times
- [ ] Homepage: < 3 seconds
- [ ] Calculator: < 3 seconds
- [ ] Dashboard: < 3 seconds (with data)
- [ ] Results: < 1 second

### Calculation Speed
- [ ] ROI calculation: < 500ms (instant)
- [ ] Results display: < 100ms
- [ ] No lag or freezing

### Database Operations
- [ ] Save analysis: < 2 seconds
- [ ] Fetch analyses: < 2 seconds
- [ ] Delete analysis: < 1 second

---

## Security Tests

### Authentication
- [ ] Cannot access `/dashboard` without login
- [ ] Redirect to sign-in works
- [ ] After sign-in, returns to intended page
- [ ] Sign out clears session completely
- [ ] Expired session redirects to sign-in

### Authorization
- [ ] User A cannot see User B's analyses
- [ ] User A cannot delete User B's analyses
- [ ] RLS policies enforced

**Test:**
1. [ ] Create User A, add analyses
2. [ ] Sign out
3. [ ] Create User B
4. [ ] Go to dashboard
5. [ ] Should see 0 analyses (not User A's data)

### Data Validation
- [ ] SQL injection attempts fail
- [ ] XSS attempts sanitized
- [ ] Invalid tokens rejected (test with expired token)

---

## Error Handling Tests

### Network Errors
**Simulate offline:**
1. [ ] Go offline (disconnect internet)
2. [ ] Try to calculate and save
3. [ ] Check console: "Failed to save" logged
4. [ ] Calculation still works (client-side)
5. [ ] Results still display

### Server Errors
**Test 401 Unauthorized:**
1. [ ] Manually clear Supabase session in DevTools
2. [ ] Try to fetch dashboard
3. [ ] Should redirect to sign-in

### Invalid Data
- [ ] Enter negative purchase price → Browser validation
- [ ] Enter 0 property size → Calculates but may show odd results
- [ ] Enter extremely large numbers → Calculates successfully

---

## Accessibility Tests

### Keyboard Navigation
- [ ] Can tab through all forms
- [ ] Can submit forms with Enter key
- [ ] Focus indicators visible
- [ ] Tab order is logical

### Screen Reader
- [ ] All inputs have labels
- [ ] Buttons have descriptive text
- [ ] Links have meaningful text (not "click here")
- [ ] Images have alt text (if any)

### Color Contrast
- [ ] Text readable on backgrounds
- [ ] Meets WCAG AA standards
- [ ] Links distinguishable

---

## Final Smoke Test (5 Minutes)

**Quick end-to-end test:**

1. [ ] Homepage loads
2. [ ] Sign up new account
3. [ ] Calculate 1 property
4. [ ] View results
5. [ ] Go to dashboard
6. [ ] See saved analysis
7. [ ] View analysis from dashboard
8. [ ] Create 2nd analysis
9. [ ] Dashboard shows 2 analyses
10. [ ] Delete 1 analysis
11. [ ] Dashboard shows 1 analysis
12. [ ] Sign out
13. [ ] Sign in
14. [ ] Dashboard still shows 1 analysis
15. [ ] Refresh page
16. [ ] Still signed in, data persists

**If all pass: ✅ DEPLOYMENT SUCCESSFUL**

---

## Common Issues and Fixes

### Issue: "No results to display" on results page
**Fix:** This is expected if navigating directly without calculating first

### Issue: Database save fails
**Check:**
- [ ] VITE_SUPABASE_URL set in Vercel
- [ ] VITE_SUPABASE_ANON_KEY set in Vercel
- [ ] Network tab shows 401 → Auth issue
- [ ] Network tab shows 400 → Data format issue

### Issue: Can't sign in
**Check:**
- [ ] User exists in Supabase (auth.users table)
- [ ] Profile created in profiles table
- [ ] Password is correct
- [ ] Email confirmed (should auto-confirm)

### Issue: RLS blocks access
**Check:**
- [ ] RLS policies exist
- [ ] user_id matches auth.uid()
- [ ] Policies allow SELECT/INSERT/DELETE

### Issue: Dashboard shows loading forever
**Check:**
- [ ] Network tab for failed requests
- [ ] Console for errors
- [ ] API endpoint returns data
- [ ] Access token valid

### Issue: Vercel build fails
**Check:**
- [ ] All dependencies in package.json
- [ ] No TypeScript errors
- [ ] No missing imports
- [ ] Build command correct: `pnpm build`

---

## Success Criteria

✅ **MVP is fully deployed and working if:**

- [ ] All authentication flows work
- [ ] Calculator produces correct results
- [ ] Analyses save to database
- [ ] Dashboard displays saved analyses
- [ ] Users can only see their own data
- [ ] Session persists across refreshes
- [ ] No critical errors in console
- [ ] Mobile responsive
- [ ] Performance acceptable (< 3s page loads)

---

**Deployment Status:** 
- [ ] In Progress
- [ ] Needs Fixes
- [ ] ✅ **COMPLETE AND VERIFIED**

**Tested By:** _________________
**Date:** _________________
**Notes:** _________________
