# YieldPulse Routes Reference

## Public Routes (No Auth Required)

### `/` - Home Page
- **File:** `/src/pages/HomePage.tsx`
- **Purpose:** Landing page with hero, features, how it works
- **Auth Behavior:** Shows "Sign In" button if not authenticated, "My Reports" if authenticated
- **CTAs:** 
  - "Get Started" → `/calculator`
  - "Start Calculating Free" → `/calculator`
  - "Sign In" → `/auth/signin` (if not authenticated)
  - "My Reports" → `/dashboard` (if authenticated)

### `/calculator` - ROI Calculator
- **File:** `/src/pages/CalculatorPage.tsx`
- **Purpose:** Property investment ROI calculation form
- **Auth Behavior:** 
  - Works without authentication
  - Shows sign-in prompt after calculation for guest users
  - Auto-saves for authenticated users
- **Features:**
  - 12+ input fields
  - Real-time calculation
  - Quick results preview
  - Auto-navigation to `/results`
- **CTAs:**
  - "Calculate ROI" → Calculates and navigates to `/results`
  - "View Detailed Analysis" → `/results`

### `/results` - Analysis Results
- **File:** `/src/pages/ResultsPage.tsx`
- **Purpose:** Display calculated ROI metrics
- **Auth Behavior:**
  - Works without authentication
  - Shows sign-in prompt for guest users
  - Can view saved analyses if coming from dashboard
- **Features:**
  - 4 key metrics cards (free)
  - Financial overview (free)
  - Operating expenses (free)
  - Premium section (locked)
- **CTAs:**
  - "Back to Calculator" → `/calculator`
  - "Calculate Another Property" → `/calculator`
  - "Sign In to Save" → `/auth/signin` (if not authenticated)

### `/auth/signin` - Sign In Page
- **File:** `/src/pages/SignInPage.tsx`
- **Purpose:** User login
- **Redirect:** After login, redirects to intended page or `/dashboard`
- **Form Fields:**
  - Email
  - Password
- **CTAs:**
  - "Sign In" → Authenticates and redirects
  - "Sign Up" → `/auth/signup`
  - "Back to Home" → `/`

### `/auth/signup` - Sign Up Page
- **File:** `/src/pages/SignUpPage.tsx`
- **Purpose:** User registration
- **Redirect:** After signup, redirects to `/dashboard`
- **Form Fields:**
  - Full Name
  - Email
  - Password
  - Confirm Password
- **Validation:**
  - Password minimum 6 characters
  - Passwords must match
  - Email format validation
- **CTAs:**
  - "Create Account" → Creates account and redirects to `/dashboard`
  - "Sign In" → `/auth/signin`
  - "Back to Home" → `/`

## Protected Routes (Auth Required)

### `/dashboard` - My Reports Dashboard
- **File:** `/src/pages/DashboardPage.tsx`
- **Protection:** `<ProtectedRoute>` wrapper
- **Auth Required:** YES - redirects to `/auth/signin` if not authenticated
- **Purpose:** View and manage saved analyses
- **Features:**
  - Stats overview (total, premium, free counts)
  - Analyses table with all saved reports
  - View analysis details
  - Delete analyses
  - Empty state with CTA
- **CTAs:**
  - "New Analysis" → `/calculator`
  - "Sign Out" → Sign out and redirect to `/`
  - "View" (on analysis) → `/results` with saved data
  - "Delete" (on analysis) → Deletes analysis
  - "Create First Analysis" → `/calculator` (empty state)

---

## Route Protection Logic

### ProtectedRoute Component
**File:** `/src/components/ProtectedRoute.tsx`

**Behavior:**
1. Check if user is authenticated
2. If loading, show spinner
3. If not authenticated, redirect to `/auth/signin` with return path
4. If authenticated, render children

**Usage:**
```tsx
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  } 
/>
```

---

## Navigation Patterns

### For Guest Users
```
Home → Calculator → Results → Sign Up → Dashboard
  ↓                    ↓
  └→ Sign In ─────────┘
```

### For Authenticated Users
```
Home → Dashboard → View Analysis → Results
  ↓         ↓
  └→ Calculator → Results → Dashboard
```

### Sign In Redirects
- If user tries to access `/dashboard` without auth → `/auth/signin?redirect=/dashboard`
- After sign in → Returns to intended page
- Default redirect → `/dashboard`

---

## URL Parameters and State

### `/results` - Location State
```typescript
location.state = {
  results: CalculationResults,    // From new calculation
  inputs: PropertyInputs,          // From new calculation
  analysis: SavedAnalysis,         // From dashboard view
  fromDashboard: boolean          // Flag for saved analysis
}
```

### `/auth/signin` - Location State
```typescript
location.state = {
  from: {
    pathname: string  // Return path after login
  }
}
```

---

## Header Navigation by Page

### HomePage Header
- Not authenticated: "Calculator", "Sign In", "Get Started"
- Authenticated: "Calculator", "My Reports"

### CalculatorPage Header
- Logo (links to `/`)
- "Back to Home" link

### ResultsPage Header
- Logo (links to `/`)
- "Back to Calculator" link

### DashboardPage Header
- Logo (links to `/`)
- "New Analysis" button
- "Sign Out" button

### AuthPages Header
- Logo (links to `/`)
- "Back to Home" link

---

## Deep Linking Support

All routes support direct URL access thanks to `vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**Examples:**
- `https://yourdomain.com/calculator` ✅ Works
- `https://yourdomain.com/dashboard` ✅ Works (redirects to sign-in if not authenticated)
- `https://yourdomain.com/results` ✅ Works (shows "no results" if no data)
- `https://yourdomain.com/auth/signin` ✅ Works

---

## Error Handling

### `/results` - No Data
Shows message: "No results to display" with link to `/calculator`

### `/dashboard` - Not Authenticated
Redirects to `/auth/signin` via ProtectedRoute

### `/dashboard` - No Analyses
Shows empty state with "Create First Analysis" CTA

### Any Route - 404
Currently falls through to React Router (would show blank)
**Recommendation:** Add catch-all 404 page in future

---

## Quick Reference Table

| Route | Auth | Component | Purpose |
|-------|------|-----------|---------|
| `/` | No | HomePage | Landing page |
| `/calculator` | No | CalculatorPage | ROI calculator form |
| `/results` | No | ResultsPage | Calculation results |
| `/auth/signin` | No | SignInPage | User login |
| `/auth/signup` | No | SignUpPage | User registration |
| `/dashboard` | **Yes** | DashboardPage | Saved analyses |

---

## Browser Back/Forward Support

All routes support browser navigation:
- Back button works correctly
- Forward button works correctly
- State is maintained where appropriate
- Protected routes re-check auth on navigation

---

**Total Routes:** 6
**Protected Routes:** 1
**Public Routes:** 5
**Auth Routes:** 2
