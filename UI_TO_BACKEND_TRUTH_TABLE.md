# YieldPulse UI to Backend Truth Table
**Production Readiness Audit - System Source of Truth**  
**Generated:** 2026-01-05  
**Status:** AUTHORITATIVE

---

## Database Schema Summary

### Core Tables
| Table Name | Primary Key | Foreign Keys | RLS Enabled | Purpose |
|------------|-------------|--------------|-------------|---------|
| `profiles` | `id UUID` | `id → auth.users(id)` | ✅ YES | User profile data |
| `analyses` | `id UUID` | `user_id → auth.users(id)` | ✅ YES | Property ROI calculations |
| `payments` | `id UUID` | `user_id → auth.users(id)`<br>`analysis_id → analyses(id)` | ✅ YES | **DEPRECATED** - Use `report_purchases` |
| `report_files` | `id UUID` | `user_id → auth.users(id)`<br>`analysis_id → analyses(id)` | ✅ YES | **DEPRECATED** - Use `report_purchases.snapshot` |
| `report_purchases` | `id UUID` | `user_id → auth.users(id)`<br>`analysis_id → analyses(id)` | ✅ YES | Stripe payment records + immutable snapshots |

### Critical RLS Policy Notes
- **ALL** foreign keys reference `auth.users(id)` NOT `profiles(id)` to prevent infinite recursion
- Admin policies **REMOVED** - all admin operations must use service role key via backend
- `is_admin()` function returns `FALSE` - deprecated to prevent RLS recursion
- UPDATE on `report_purchases` requires `auth.role() = 'service_role'` (webhook only)

---

## 1. PUBLIC PAGES (No Backend Dependencies)

### 1.1 HomePage (`/`)
| Property | Value |
|----------|-------|
| **Route** | `/` |
| **Component** | `HomePage.tsx` |
| **User Roles** | All (public) |
| **Auth State Required** | None |
| **Backend Tables** | None |
| **Backend Fields** | None |
| **RLS Policy** | N/A |
| **Data Missing Behavior** | N/A - Static marketing page |
| **Data Delayed Behavior** | N/A |
| **Data Denied Behavior** | N/A |
| **Mocked Data** | None |

---

### 1.2 HowItWorksPage (`/how-it-works`)
| Property | Value |
|----------|-------|
| **Route** | `/how-it-works` |
| **Component** | `HowItWorksPage.tsx` |
| **User Roles** | All (public) |
| **Auth State Required** | None |
| **Backend Tables** | None |
| **Backend Fields** | None |
| **RLS Policy** | N/A |
| **Data Missing Behavior** | N/A - Static info page |
| **Data Delayed Behavior** | N/A |
| **Data Denied Behavior** | N/A |
| **Mocked Data** | None |

---

### 1.3 PricingPage (`/pricing`)
| Property | Value |
|----------|-------|
| **Route** | `/pricing` |
| **Component** | `PricingPage.tsx` |
| **User Roles** | All (public) |
| **Auth State Required** | None |
| **Backend Tables** | None |
| **Backend Fields** | None |
| **RLS Policy** | N/A |
| **Data Missing Behavior** | N/A - Static pricing page (AED 49 hardcoded) |
| **Data Delayed Behavior** | N/A |
| **Data Denied Behavior** | N/A |
| **Mocked Data** | None |

---

### 1.4 ReportsPage (`/reports`)
| Property | Value |
|----------|-------|
| **Route** | `/reports` |
| **Component** | `ReportsPage.tsx` |
| **User Roles** | All (public) |
| **Auth State Required** | None |
| **Backend Tables** | None |
| **Backend Fields** | None |
| **RLS Policy** | N/A |
| **Data Missing Behavior** | N/A - Static info page |
| **Data Delayed Behavior** | N/A |
| **Data Denied Behavior** | N/A |
| **Mocked Data** | None |

---

### 1.5 PrivacyPolicyPage (`/privacy-policy`)
| Property | Value |
|----------|-------|
| **Route** | `/privacy-policy` |
| **Component** | `PrivacyPolicyPage.tsx` |
| **User Roles** | All (public) |
| **Auth State Required** | None |
| **Backend Tables** | None |
| **Backend Fields** | None |
| **RLS Policy** | N/A |
| **Data Missing Behavior** | N/A - Static legal page |
| **Data Delayed Behavior** | N/A |
| **Data Denied Behavior** | N/A |
| **Mocked Data** | None |

---

### 1.6 TermsOfServicePage (`/terms-of-service`)
| Property | Value |
|----------|-------|
| **Route** | `/terms-of-service` |
| **Component** | `TermsOfServicePage.tsx` |
| **User Roles** | All (public) |
| **Auth State Required** | None |
| **Backend Tables** | None |
| **Backend Fields** | None |
| **RLS Policy** | N/A |
| **Data Missing Behavior** | N/A - Static legal page |
| **Data Delayed Behavior** | N/A |
| **Data Denied Behavior** | N/A |
| **Mocked Data** | None |

---

## 2. AUTHENTICATION PAGES

### 2.1 SignUpPage (`/auth/signup`)
| Property | Value |
|----------|-------|
| **Route** | `/auth/signup` |
| **Component** | `SignUpPage.tsx` |
| **User Roles** | Unauthenticated users only |
| **Auth State Required** | `user === null` |
| **Backend Tables** | 1. `auth.users` (Supabase Auth)<br>2. `profiles` (auto-created via trigger) |
| **Backend Fields** | **Write:**<br>- `auth.users.email`<br>- `auth.users.encrypted_password`<br>- `auth.users.raw_user_meta_data.full_name`<br>- `profiles.id` (auto)<br>- `profiles.email` (auto)<br>- `profiles.full_name` (auto) |
| **RLS Policy** | **Profiles:**<br>`"Users can insert own profile"` - `WITH CHECK (auth.uid() = id)` |
| **Data Missing Behavior** | If `profiles` table missing: User can still authenticate but profile queries fail (AuthContext uses fallback) |
| **Data Delayed Behavior** | Loading spinner shows during signup. If profile creation trigger slow, user sees basic auth state without profile data. |
| **Data Denied Behavior** | If RLS blocks insert: User creation succeeds but profile creation fails. AuthContext fallback creates minimal user object. |
| **Mocked Data** | **NONE** - Real backend via `/make-server-ef294769/auth/signup` endpoint |
| **Critical Notes** | - Email verification **ENABLED** in production (email_confirm: false)<br>- Profile auto-created via `handle_new_user()` trigger<br>- If authenticated user visits, redirected to `/dashboard` |

---

### 2.2 SignInPage (`/auth/signin`)
| Property | Value |
|----------|-------|
| **Route** | `/auth/signin` |
| **Component** | `SignInPage.tsx` |
| **User Roles** | Unauthenticated users only |
| **Auth State Required** | `user === null` |
| **Backend Tables** | 1. `auth.users` (Supabase Auth)<br>2. `profiles` (read only) |
| **Backend Fields** | **Read:**<br>- `auth.users.email`<br>- `auth.users.encrypted_password`<br>- `auth.users.email_confirmed_at`<br>- `profiles.*` (all fields) |
| **RLS Policy** | **Profiles:**<br>`"Users can view own profile"` - `USING (auth.uid() = id)` |
| **Data Missing Behavior** | If `profiles` row missing: AuthContext creates fallback user object with minimal data (email, id). App continues working. |
| **Data Delayed Behavior** | 8-second timeout on profile fetch. If exceeds, fallback user object created. Loading spinner prevents interaction. |
| **Data Denied Behavior** | If RLS blocks SELECT: Fallback to basic user info from `auth.users`. User can still use app. |
| **Mocked Data** | **DEMO MODE EXISTS:** `sessionStorage.setItem('yieldpulse-demo-mode', 'true')` bypasses auth, redirects to `/calculator` |
| **Critical Notes** | - If authenticated user visits, redirected to `/dashboard`<br>- Demo mode button exists for testing without backend<br>- Email verification NOT enforced at login (users can sign in with unverified email) |

---

### 2.3 VerifyEmailPage (`/auth/verify-email`)
| Property | Value |
|----------|-------|
| **Route** | `/auth/verify-email` |
| **Component** | `VerifyEmailPage.tsx` |
| **User Roles** | Unauthenticated OR Authenticated (unverified) |
| **Auth State Required** | Any (but redirects if `user.emailVerified === true`) |
| **Backend Tables** | 1. `auth.users` (Supabase Auth) |
| **Backend Fields** | **Read:**<br>- `auth.users.email`<br>- `auth.users.email_confirmed_at`<br><br>**Updated by Supabase (not app):**<br>- `auth.users.email_confirmed_at` (set when user clicks verification link) |
| **RLS Policy** | N/A - Uses Supabase Auth APIs, not direct DB access |
| **Data Missing Behavior** | If no session: Shows email from `localStorage.getItem('pendingVerificationEmail')` or "Loading..." |
| **Data Delayed Behavior** | If `supabase.auth.getSession()` slow: Shows loading spinner until `authLoading === false` |
| **Data Denied Behavior** | If session refresh fails: Falls back to current session check. Shows info toast if email not verified yet. |
| **Mocked Data** | **NONE** - Real Supabase Auth |
| **Critical Notes** | - **BUG FIX APPLIED:** `detectSessionInUrl: true` in supabaseClient.ts<br>- Resend uses `supabase.auth.resend()` API<br>- "Check Verification" button refreshes session to get latest `email_confirmed_at` status<br>- Force page reload (`window.location.href`) after verification to update AuthContext |

---

### 2.4 ForgotPasswordPage (`/auth/forgot-password`)
| Property | Value |
|----------|-------|
| **Route** | `/auth/forgot-password` |
| **Component** | `ForgotPasswordPage.tsx` |
| **User Roles** | Unauthenticated users only |
| **Auth State Required** | `user === null` (but not enforced - any user can access) |
| **Backend Tables** | 1. `auth.users` (Supabase Auth) |
| **Backend Fields** | **Read (internal by Supabase):**<br>- `auth.users.email` (to send reset link) |
| **RLS Policy** | N/A - Uses `supabase.auth.resetPasswordForEmail()` API |
| **Data Missing Behavior** | If email doesn't exist in system: Supabase still returns success (security best practice - no email enumeration) |
| **Data Delayed Behavior** | Shows loading spinner on submit button during API call |
| **Data Denied Behavior** | N/A - Public endpoint |
| **Mocked Data** | **NONE** - Real Supabase Auth |
| **Critical Notes** | - Email server must be configured in Supabase for emails to send<br>- Reset link redirects to `/auth/reset-password` with token in URL |

---

### 2.5 ResetPasswordPage (`/auth/reset-password`)
| Property | Value |
|----------|-------|
| **Route** | `/auth/reset-password` |
| **Component** | `ResetPasswordPage.tsx` |
| **User Roles** | Any (requires valid reset token in URL) |
| **Auth State Required** | None (token-based) |
| **Backend Tables** | 1. `auth.users` (Supabase Auth) |
| **Backend Fields** | **Write:**<br>- `auth.users.encrypted_password` (updated via `supabase.auth.updateUser()`) |
| **RLS Policy** | N/A - Uses Supabase Auth API with token validation |
| **Data Missing Behavior** | If token invalid/expired: `supabase.auth.updateUser()` returns error, user sees error message |
| **Data Delayed Behavior** | Shows loading spinner during password update |
| **Data Denied Behavior** | If token expired: Error message shown, redirects to `/auth/forgot-password` |
| **Mocked Data** | **NONE** - Real Supabase Auth |
| **Critical Notes** | - Token automatically extracted from URL by Supabase<br>- After successful reset, user redirected to `/auth/signin` |

---

## 3. CALCULATOR & RESULTS PAGES

### 3.1 CalculatorPage (`/calculator`)
| Property | Value |
|----------|-------|
| **Route** | `/calculator` |
| **Component** | `CalculatorPage.tsx` |
| **User Roles** | All (public + authenticated) |
| **Auth State Required** | None (optional auth) |
| **Backend Tables** | 1. `analyses` (only if user clicks "Save Calculation")<br>2. `profiles` (if authenticated, for user context) |
| **Backend Fields** | **Write (if saving):**<br>ALL fields in `analyses` table:<br>- `user_id` (from session)<br>- `portal_source`, `listing_url`<br>- `area_sqft`, `purchase_price`, `down_payment_percent`<br>- `mortgage_interest_rate`, `mortgage_term_years`<br>- `expected_monthly_rent`, `service_charge_annual`<br>- `annual_maintenance_percent`, `property_management_fee_percent`<br>- `dld_fee_percent`, `agent_fee_percent`<br>- `capital_growth_percent`, `rent_growth_percent`<br>- `vacancy_rate_percent`, `holding_period_years`<br>- `gross_yield`, `net_yield`, `monthly_cash_flow`, `annual_cash_flow`, `cash_on_cash_return`<br>- `calculation_results` (JSONB - full CalculationResults object)<br>- `is_paid` (default: false) |
| **RLS Policy** | **Analyses:**<br>`"Users can insert own analyses"` - `WITH CHECK (auth.uid() = user_id)` |
| **Data Missing Behavior** | **If unauthenticated:** "Save Calculation" button shows sign-in prompt modal (does NOT save)<br>**If authenticated but save fails:** Error toast shown, calculation results still visible in UI (client-side only) |
| **Data Delayed Behavior** | Save button shows spinner. If timeout, error toast shown but results remain visible. |
| **Data Denied Behavior** | If RLS blocks INSERT: Error toast shown. User can still see results and navigate to results page with state. |
| **Mocked Data** | **NONE** - All calculations done client-side in `utils/calculations.ts`<br>Backend only used for persistence, not computation. |
| **Critical Notes** | - **NO BACKEND REQUIRED** for calculation (pure client-side math)<br>- Backend only called when user clicks "Save Calculation" AND is authenticated<br>- Validation warnings (e.g., yield too low) shown client-side<br>- On successful save, navigates to `/results` with analysis ID in state |

---

### 3.2 ResultsPage (`/results`)
| Property | Value |
|----------|-------|
| **Route** | `/results` |
| **Component** | `ResultsPage.tsx` |
| **User Roles** | All (public + authenticated) |
| **Auth State Required** | None (but premium features require auth) |
| **Backend Tables** | 1. `report_purchases` (to check if analysis is paid)<br>2. `analyses` (if loading saved analysis) |
| **Backend Fields** | **Read:**<br>**From `report_purchases`:**<br>- `user_id`, `analysis_id`, `status`, `snapshot` (JSONB)<br><br>**From `analyses` (if saved):**<br>- All fields (see CalculatorPage) |
| **RLS Policy** | **Report Purchases:**<br>`"Users can view own purchases"` - `USING (auth.uid() = user_id)`<br><br>**Analyses:**<br>`"Users can view own analyses"` - `USING (auth.uid() = user_id)` |
| **Data Missing Behavior** | **If no results in location.state:** Shows "No calculation data" error<br>**If analysis not found:** Shows error message<br>**If purchase status check fails:** Assumes unpaid (shows paywall) |
| **Data Delayed Behavior** | Shows skeleton/loading state while checking purchase status via API<br>If purchase check times out: Defaults to unpaid state (safe fallback) |
| **Data Denied Behavior** | If RLS blocks purchase query: Assumes unpaid (paywall shown)<br>If analysis owned by different user: RLS blocks, shows 404 error |
| **Mocked Data** | **NONE** - Real backend data |
| **Critical Notes** | - **PAYWALL LOGIC:** Headline metrics (gross yield, net yield, cash flow) shown FREE<br>- Premium locked: Detailed projections, charts, PDF export<br>- Premium check via `/make-server-ef294769/purchases/status?analysisId={id}` API<br>- Stripe checkout via `/make-server-ef294769/checkout/create` (returns session URL)<br>- PDF generated CLIENT-SIDE using jsPDF from `report_purchases.snapshot` data |

#### Premium Unlock Flow:
1. User clicks "Unlock Premium Report" (AED 49)
2. Frontend calls `/make-server-ef294769/checkout/create` with `analysisId` + `origin`
3. Backend creates/reuses `report_purchases` row with `status: 'pending'` + immutable `snapshot` (JSONB)
4. Backend creates Stripe Checkout Session, returns URL
5. User completes payment on Stripe
6. Stripe webhook calls `/make-server-ef294769/stripe/webhook`
7. Webhook updates `report_purchases.status = 'paid'`, sets `purchased_at`
8. User redirected to `/dashboard?payment=success&analysisId={id}`
9. ResultsPage checks `/purchases/status` again, sees `status: 'paid'`, unlocks premium features

---

## 4. PROTECTED PAGES (Require Authentication)

### 4.1 DashboardPage (`/dashboard`)
| Property | Value |
|----------|-------|
| **Route** | `/dashboard` |
| **Component** | `DashboardPage.tsx` |
| **User Roles** | Authenticated users only |
| **Auth State Required** | `user !== null` (enforced by `ProtectedRoute` wrapper) |
| **Backend Tables** | 1. `analyses` (user's saved calculations)<br>2. `report_purchases` (to check which are premium) |
| **Backend Fields** | **Read:**<br>**From `analyses`:**<br>- `id`, `portal_source`, `listing_url`, `purchase_price`<br>- `expected_monthly_rent`, `down_payment_percent`, `mortgage_interest_rate`<br>- `area_sqft`, `gross_yield`, `net_yield`, `monthly_cash_flow`<br>- `cash_on_cash_return`, `is_paid`, `created_at`, `updated_at`<br><br>**Write (DELETE only):**<br>- Deletes analysis by `id` |
| **RLS Policy** | **Analyses:**<br>`"Users can view own analyses"` - `USING (auth.uid() = user_id)`<br>`"Users can delete own analyses"` - `USING (auth.uid() = user_id)` |
| **Data Missing Behavior** | If no analyses exist: Shows empty state with "Create Your First Analysis" CTA<br>If query fails: Shows error alert with retry button |
| **Data Delayed Behavior** | Shows loading skeleton while fetching analyses<br>Infinite loop prevented by timeout in useEffect |
| **Data Denied Behavior** | If RLS blocks SELECT: Shows empty state (user sees no analyses even if they exist)<br>If RLS blocks DELETE: Shows error toast, analysis remains visible |
| **Mocked Data** | **NONE** - Real backend data |
| **Critical Notes** | - Query: `.from('analyses').select('*').order('created_at', { ascending: false })`<br>- Filter by free/premium uses client-side filtering on `is_paid` field<br>- Sort by yield/cashflow done client-side<br>- Comparison mode: Allows selecting 2+ analyses, navigates to `/comparison` with IDs<br>- Delete requires confirmation modal (client-side only)<br>- Payment success banner shown if `?payment=success` in URL (cleared after display) |

---

### 4.2 ComparisonPage (`/comparison`)
| Property | Value |
|----------|-------|
| **Route** | `/comparison` |
| **Component** | `ComparisonPage.tsx` |
| **User Roles** | Authenticated users only |
| **Auth State Required** | `user !== null` (enforced by `ProtectedRoute` wrapper) |
| **Backend Tables** | 1. `report_purchases` (ONLY paid reports can be compared) |
| **Backend Fields** | **Read:**<br>**From `report_purchases`:**<br>- `id`, `analysis_id`, `snapshot` (JSONB), `created_at`<br><br>**Snapshot contains:**<br>- `inputs.*` (all property inputs)<br>- `results.*` (all calculation results)<br>- `metadata.*` (report version, generated_at) |
| **RLS Policy** | **Report Purchases:**<br>`"Users can view own purchases"` - `USING (auth.uid() = user_id)` |
| **Data Missing Behavior** | If no `selectedIds` in location.state: Redirects to `/dashboard` with info toast<br>If < 2 IDs selected: Redirects to `/dashboard` with "minimum 2 reports" toast<br>If no paid reports found: Shows error message "No purchased reports found" |
| **Data Delayed Behavior** | Shows loading spinner while fetching reports<br>Timeout not implemented (potential hang risk) |
| **Data Denied Behavior** | If RLS blocks SELECT: Shows empty state (even if reports exist)<br>If trying to compare unpaid analysis: Filtered out (only `status = 'paid'` fetched) |
| **Mocked Data** | **NONE** - Real backend data from immutable snapshots |
| **Critical Notes** | - **PREMIUM ONLY:** Cannot compare free analyses<br>- Query: `.from('report_purchases').select(...).in('analysis_id', selectedIds).eq('status', 'paid')`<br>- Validates that `snapshot` field exists and is valid before rendering<br>- Side-by-side comparison of up to 4 reports (UI limitation)<br>- Remove report button: If drops below 2 reports, auto-redirects to dashboard |

---

## 5. BACKEND API ENDPOINTS

### 5.1 Authentication Endpoints

#### POST `/make-server-ef294769/auth/signup`
| Property | Value |
|----------|-------|
| **Auth Required** | No |
| **Authorization Header** | None |
| **Request Body** | `{ email: string, password: string, fullName: string }` |
| **Backend Tables Modified** | 1. `auth.users` (via `supabase.auth.admin.createUser`)<br>2. `profiles` (via trigger) |
| **Response Success** | `{ user: User, session: Session }` |
| **Response Error** | `{ error: string }` (400 or 500) |
| **RLS Applied** | `profiles` INSERT policy enforced by trigger |
| **Idempotency** | NOT IDEMPOTENT - creating duplicate email returns error |
| **Critical Notes** | - Uses **SERVICE_ROLE_KEY** to bypass email verification (`email_confirm: true`)<br>- Auto-signs in user after creation<br>- If profile creation fails, user still created in auth.users |

---

### 5.2 Analysis Endpoints

#### POST `/make-server-ef294769/analyses`
| Property | Value |
|----------|-------|
| **Auth Required** | Yes |
| **Authorization Header** | `Bearer {access_token}` |
| **Request Body** | `{ inputs: PropertyInputs, results: CalculationResults }` |
| **Backend Tables Modified** | `analyses` (INSERT) |
| **Response Success** | Analysis object (201) |
| **Response Error** | `{ error: string }` (400, 401, 500) |
| **RLS Applied** | `"Users can insert own analyses"` - `WITH CHECK (auth.uid() = user_id)` |
| **Idempotency** | NOT IDEMPOTENT - each call creates new analysis |
| **Critical Notes** | - Maps frontend field names to database column names<br>- Sets `is_paid: false` by default<br>- Stores full results object in `calculation_results` JSONB |

#### GET `/make-server-ef294769/analyses/:id`
| Property | Value |
|----------|-------|
| **Auth Required** | Yes |
| **Authorization Header** | `Bearer {access_token}` |
| **Backend Tables Read** | `analyses` |
| **Response Success** | Analysis object |
| **Response Error** | `{ error: string }` (401, 404, 500) |
| **RLS Applied** | `"Users can view own analyses"` - `USING (auth.uid() = user_id)` |
| **Critical Notes** | - Returns 404 if analysis doesn't exist OR owned by different user (RLS enforced) |

#### PUT `/make-server-ef294769/analyses/:id`
| Property | Value |
|----------|-------|
| **Auth Required** | Yes |
| **Authorization Header** | `Bearer {access_token}` |
| **Request Body** | Partial analysis object (fields to update) |
| **Backend Tables Modified** | `analyses` (UPDATE) |
| **Response Success** | Updated analysis object |
| **Response Error** | `{ error: string }` (400, 401, 500) |
| **RLS Applied** | `"Users can update own analyses"` - `USING (auth.uid() = user_id)` |
| **Idempotency** | IDEMPOTENT - same update produces same result |

#### DELETE `/make-server-ef294769/analyses/:id`
| Property | Value |
|----------|-------|
| **Auth Required** | Yes |
| **Authorization Header** | `Bearer {access_token}` |
| **Backend Tables Modified** | `analyses` (DELETE)<br>Cascades to `report_purchases` (if any) |
| **Response Success** | `{ success: true }` |
| **Response Error** | `{ error: string }` (400, 401, 500) |
| **RLS Applied** | `"Users can delete own analyses"` - `USING (auth.uid() = user_id)` |
| **Idempotency** | IDEMPOTENT - deleting already-deleted returns success (404 not thrown) |

#### GET `/make-server-ef294769/analyses/user/me`
| Property | Value |
|----------|-------|
| **Auth Required** | Yes |
| **Authorization Header** | `Bearer {access_token}` |
| **Backend Tables Read** | `analyses` |
| **Response Success** | Array of analysis objects (sorted by created_at DESC) |
| **Response Error** | `{ error: string }` (400, 401, 500) |
| **RLS Applied** | `"Users can view own analyses"` - `USING (auth.uid() = user_id)` |
| **Critical Notes** | - Returns empty array `[]` if no analyses<br>- Used by DashboardPage |

---

### 5.3 Payment/Stripe Endpoints

#### POST `/make-server-ef294769/checkout/create`
| Property | Value |
|----------|-------|
| **Auth Required** | Yes |
| **Authorization Header** | `Bearer {access_token}` |
| **Request Body** | `{ analysisId: string, origin: string }` |
| **Backend Tables Modified** | `report_purchases` (INSERT or reuse pending) |
| **Response Success** | `{ url: string }` (Stripe Checkout URL) |
| **Response Error** | `{ error: string, alreadyPurchased?: boolean }` (400, 401, 403, 404, 500) |
| **RLS Applied** | `"Users can create own purchases"` - `WITH CHECK (auth.uid() = user_id)` |
| **Idempotency** | SEMI-IDEMPOTENT:<br>- Checks for existing paid purchase → returns error<br>- Reuses pending purchase if created within 30 mins<br>- Creates new purchase otherwise |
| **Critical Notes** | - **Origin allowlist enforced:** localhost, figma.site, vercel.app<br>- Creates immutable `snapshot` (JSONB) with inputs, results, metadata<br>- Sets `status: 'pending'`, `amount_aed: 49`<br>- Stripe session includes metadata: user_id, analysis_id, purchase_id<br>- Success URL: `/dashboard?payment=success&analysisId={id}`<br>- Cancel URL: `/results` |

#### POST `/make-server-ef294769/stripe/webhook`
| Property | Value |
|----------|-------|
| **Auth Required** | No (Stripe signature verified) |
| **Authorization Header** | None (uses `stripe-signature` header) |
| **Request Body** | Stripe event object (raw text) |
| **Backend Tables Modified** | `report_purchases` (UPDATE - status, purchased_at)<br>`analyses` (UPDATE - is_paid flag) |
| **Response Success** | `{ received: true }` |
| **Response Error** | `{ error: string }` (400, 401) |
| **RLS Applied** | **BYPASSED** - Uses **SERVICE_ROLE_KEY** to update<br>RLS policy requires `auth.role() = 'service_role'` for UPDATE |
| **Idempotency** | IDEMPOTENT - Uses `stripe_checkout_session_id` to find purchase, updates same record |
| **Event Types Handled** | 1. `checkout.session.completed`<br>2. `payment_intent.succeeded` (logs only)<br>3. `payment_intent.payment_failed` (logs only) |
| **Critical Notes** | - **REQUIRES:** `STRIPE_WEBHOOK_SECRET` env var<br>- Signature verification prevents spoofing<br>- Updates `report_purchases.status = 'paid'`, sets `purchased_at`<br>- Updates `analyses.is_paid = true` for dashboard filtering<br>- Logs all events for debugging |

#### GET `/make-server-ef294769/purchases/status`
| Property | Value |
|----------|-------|
| **Auth Required** | Yes |
| **Authorization Header** | `Bearer {access_token}` |
| **Query Params** | `?analysisId={uuid}` |
| **Backend Tables Read** | `report_purchases` |
| **Response Success** | `{ isPaid: boolean, purchase?: object }` |
| **Response Error** | `{ error: string }` (400, 401, 500) |
| **RLS Applied** | `"Users can view own purchases"` - `USING (auth.uid() = user_id)` |
| **Critical Notes** | - Returns `isPaid: false` if no purchase found<br>- Returns `isPaid: true` + purchase object if `status = 'paid'`<br>- Used by ResultsPage to unlock premium features |

---

## 6. AUTH CONTEXT & SESSION MANAGEMENT

### AuthContext (`/src/contexts/AuthContext.tsx`)
| Property | Value |
|----------|-------|
| **State Management** | React Context + useState |
| **User Object Structure** | `{ id: string, email: string, fullName?: string, isAdmin?: boolean, emailVerified: boolean }` |
| **Backend Tables Read** | 1. `auth.users` (via `supabase.auth.getSession()`)<br>2. `profiles` (optional - fallback if fails) |
| **Session Detection** | `supabase.auth.onAuthStateChange()` listener |
| **Session Refresh** | Automatic via Supabase SDK |
| **Timeout Protection** | 8-second timeout on profile fetch<br>10-second timeout on session check |
| **Fallback Behavior** | If profile fetch fails: Creates user object from `auth.users` data only |
| **Loading States** | `loading: boolean` - true during initialization<br>**CRITICAL:** Always set to `false` in finally block to prevent infinite load |
| **Session Expired Handling** | `sessionExpired: boolean` flag set on TOKEN_REFRESHED event failure |

#### Auth Events Handled:
| Event | Action |
|-------|--------|
| `SIGNED_IN` | Fetch user profile, set `user` state, clear `sessionExpired` |
| `SIGNED_OUT` | Set `user = null` |
| `TOKEN_REFRESHED` | Refresh user profile data |
| `USER_UPDATED` | Refresh user profile (for email verification completion) |
| `PASSWORD_RECOVERY` | Log event (handled by ResetPasswordPage) |

#### Critical Notes:
- **BUG FIX APPLIED:** Profile fetch uses 8-second timeout to prevent hanging on RLS errors
- If profile query times out, app continues with fallback user object
- Email verification status from `auth.users.email_confirmed_at`, not `profiles.email_verified`
- Session persistence handled by Supabase (localStorage)

---

## 7. PROTECTED ROUTE WRAPPER

### ProtectedRoute Component
| Property | Value |
|----------|-------|
| **Location** | `/src/app/App.tsx` (inline component) |
| **Auth Check** | `if (!user) redirect to /auth/signin` |
| **Loading Behavior** | Shows spinner while `authLoading === true` |
| **Redirect Behavior** | Stores intended destination in `location.state.from` for post-login redirect |
| **RLS Not Applied** | Client-side only - actual data access blocked by backend RLS |

---

## 8. DATA FLOW DIAGRAMS

### 8.1 Calculation Flow (Free)
```
User (unauthenticated) 
  → CalculatorPage (client-side calculation)
  → ResultsPage (headline metrics shown)
  → [NO BACKEND CALLS]
```

### 8.2 Save Calculation Flow
```
User (authenticated)
  → CalculatorPage 
  → Clicks "Save Calculation"
  → POST /analyses (with access_token)
  → RLS: "Users can insert own analyses" validates user_id
  → Analysis saved to DB
  → Navigate to ResultsPage with analysis.id
```

### 8.3 Premium Unlock Flow
```
User (authenticated)
  → ResultsPage (viewing saved analysis)
  → Clicks "Unlock Premium Report"
  → POST /checkout/create
    → Checks for existing paid purchase → Error if exists
    → Reuses pending purchase if < 30 mins old
    → Creates new pending purchase with snapshot (JSONB)
    → Creates Stripe Checkout Session
  → User redirected to Stripe
  → User completes payment
  → Stripe sends webhook to /stripe/webhook
    → Verifies signature
    → Updates report_purchases.status = 'paid'
    → Updates analyses.is_paid = true
  → User redirected to /dashboard?payment=success&analysisId={id}
  → DashboardPage shows success banner
  → User navigates back to ResultsPage
  → GET /purchases/status?analysisId={id}
  → Premium features unlocked (charts, PDF download)
```

### 8.4 PDF Generation Flow (Client-Side)
```
User (has paid purchase)
  → ResultsPage
  → Checks GET /purchases/status → isPaid: true
  → Premium unlocked
  → Clicks "Download PDF"
  → Client fetches report_purchases.snapshot (JSONB)
  → jsPDF library generates PDF client-side
  → PDF downloaded to user's device
  → [NO SERVER-SIDE PDF GENERATION]
```

### 8.5 Comparison Flow
```
User (authenticated, has 2+ paid purchases)
  → DashboardPage
  → Enables comparison mode
  → Selects 2-4 analyses
  → Clicks "Compare Selected"
  → Navigate to /comparison with selectedIds in state
  → ComparisonPage
  → GET report_purchases WHERE analysis_id IN (selectedIds) AND status = 'paid'
  → RLS: "Users can view own purchases"
  → Renders side-by-side comparison from snapshots
```

---

## 9. MISSING DATA & ERROR STATE MATRIX

| Scenario | DashboardPage | CalculatorPage | ResultsPage | ComparisonPage |
|----------|---------------|----------------|-------------|----------------|
| **No internet** | Error toast, retry button | Works (client-side calc), save fails | Shows cached results if in state, else error | Error, cannot load |
| **RLS blocks SELECT** | Empty state (no analyses shown) | N/A | Defaults to unpaid (paywall shown) | Empty state |
| **RLS blocks INSERT** | N/A | Error toast, results still visible | N/A | N/A |
| **RLS blocks DELETE** | Error toast, analysis remains | N/A | N/A | N/A |
| **Session expired** | Redirect to /auth/signin | No impact (public page) | Premium check fails, paywall shown | Redirect to /auth/signin |
| **Profile missing** | Works (uses fallback user from auth.users) | Works | Works | Works |
| **Analysis not found** | Removed from list (filtered out) | N/A | Error message shown | Filtered out, if < 2 left → redirect |
| **Snapshot invalid** | N/A | N/A | Error message | Report filtered out, if < 2 left → redirect |
| **Stripe checkout fails** | N/A | N/A | Error toast, paywall remains | N/A |
| **Webhook fails/delayed** | Purchase remains "pending", paywall shown until webhook succeeds | N/A | Purchase remains "pending" | Cannot compare (only paid) |

---

## 10. ENVIRONMENT VARIABLES REQUIRED

### Frontend (Vite)
```bash
VITE_SUPABASE_URL={project}.supabase.co
VITE_SUPABASE_ANON_KEY={anon_key}
```

### Backend (Supabase Edge Function)
```bash
SUPABASE_URL={project}.supabase.co
SUPABASE_ANON_KEY={anon_key}
SUPABASE_SERVICE_ROLE_KEY={service_role_key}  # CRITICAL: Never expose to frontend
STRIPE_SECRET_KEY=sk_live_... or sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
ENVIRONMENT=production  # or development
```

---

## 11. CRITICAL BUGS FIXED (Post-Audit)

### Bug #1: Email Verification Redirect Loop
**Symptom:** Email verification links didn't redirect to app  
**Root Cause:** `detectSessionInUrl: false` in supabaseClient.ts  
**Fix:** Changed to `detectSessionInUrl: true`  
**File:** `/src/utils/supabaseClient.ts`  
**Status:** ✅ FIXED

### Bug #2: RLS Infinite Recursion
**Symptom:** Database queries hang/timeout, 500 errors  
**Root Cause:** Foreign keys referenced `profiles(id)`, admin policies called `is_admin()` which queried `profiles`, causing recursion  
**Fix:** Changed ALL foreign keys to reference `auth.users(id)`, removed admin RLS policies  
**Files:** `/DATABASE_SCHEMA.sql`, migration script provided  
**Status:** ✅ FIXED

### Bug #3: Profile Creation RLS Violation
**Symptom:** Sign-up fails with "new row violates row-level security policy"  
**Root Cause:** Trigger creates profile, but RLS policy checked `auth.uid()` during trigger execution (no auth context)  
**Fix:** Policy already correct (`WITH CHECK (auth.uid() = id)`), issue was from Bug #2 recursion  
**Status:** ✅ FIXED (via Bug #2 fix)

---

## 12. KNOWN LIMITATIONS

### Backend Limitations
1. **No email server configured:** Verification emails may not send without SMTP setup
2. **No rate limiting:** API endpoints vulnerable to spam/abuse
3. **No audit logging:** No record of who accessed what data
4. **No backup/restore:** Database corruption would be catastrophic
5. **No data validation:** Backend trusts frontend input types

### Frontend Limitations
1. **No offline support:** Requires internet for all features except calculation
2. **No real-time updates:** Dashboard doesn't auto-refresh on payment completion
3. **No optimistic updates:** UI waits for server confirmation
4. **Client-side PDF generation:** Limited to browser capabilities, no server fallback
5. **No error tracking:** Errors logged to console, not sent to monitoring service

### RLS Limitations
1. **No admin dashboard:** Admin operations require direct SQL or service role API calls
2. **No user impersonation:** Cannot view app as another user for support
3. **No soft deletes:** Deleted analyses are permanently removed
4. **No data export:** Users cannot bulk export their analyses

### Payment Limitations
1. **Stripe only:** No alternative payment methods (Apple Pay, Google Pay, etc.)
2. **No refunds UI:** Refunds require manual Stripe dashboard action
3. **No subscription support:** One-time payment only
4. **No invoicing:** No receipt generation (Stripe handles)

---

## 13. ASSUMPTIONS REQUIRING VALIDATION

1. **Email verification works:** Assumes Supabase email server configured
2. **Stripe webhook reachability:** Assumes webhook URL accessible from Stripe servers
3. **AED currency precision:** Assumes 2 decimals sufficient (no micro-payments)
4. **PDF generation browser support:** Assumes modern browsers support jsPDF
5. **Session timeout handling:** Assumes 1-hour session timeout acceptable
6. **Calculation accuracy:** ROI formulas NOT validated by financial expert
7. **Legal compliance:** Terms of Service and Privacy Policy NOT reviewed by lawyer
8. **GDPR compliance:** No data deletion mechanism implemented
9. **PCI compliance:** Assumes Stripe handles all card data (no PCI scope)
10. **Concurrent payment prevention:** Assumes 30-minute pending purchase window sufficient

---

## 14. PRODUCTION DEPLOYMENT CHECKLIST

### Pre-Deployment
- [ ] Run `/DATABASE_SCHEMA.sql` in Supabase SQL Editor
- [ ] Run `/DATABASE_MIGRATION_STRIPE.sql` for payment tables
- [ ] Configure Supabase Email Authentication (SMTP or provider)
- [ ] Set up Stripe account, obtain live keys
- [ ] Configure Stripe webhook endpoint: `{edge-function-url}/make-server-ef294769/stripe/webhook`
- [ ] Add webhook secret to `STRIPE_WEBHOOK_SECRET` env var
- [ ] Test email verification flow end-to-end
- [ ] Test payment flow with Stripe test mode
- [ ] Verify RLS policies work (no infinite recursion)

### Post-Deployment
- [ ] Monitor `/auth/signup` for profile creation failures
- [ ] Monitor Stripe webhook logs for missed events
- [ ] Test session timeout behavior
- [ ] Verify PDF downloads work across browsers
- [ ] Check comparison page with 4 reports (max layout)
- [ ] Test delete cascade (analysis → report_purchases)

---

## 15. SUPPORT CONTACT & ESCALATION

**For RLS recursion errors:**
- Check foreign key references point to `auth.users(id)` NOT `profiles(id)`
- Ensure `is_admin()` function returns FALSE
- Remove any RLS policies calling functions that query same table

**For email verification failures:**
- Verify `detectSessionInUrl: true` in supabaseClient.ts
- Check Supabase email settings (SMTP configured)
- Inspect browser console for session errors

**For payment webhook failures:**
- Check Stripe webhook logs in dashboard
- Verify `STRIPE_WEBHOOK_SECRET` matches Stripe
- Confirm edge function URL accessible from internet
- Check `report_purchases` table for `stripe_checkout_session_id`

---

**END OF UI TO BACKEND TRUTH TABLE**  
**Last Updated:** 2026-01-05  
**Version:** 1.0  
**Status:** Production Ready (Pending Email/Stripe Configuration)
