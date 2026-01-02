# YieldPulse - Product Specification v1.0

## Executive Summary
YieldPulse is a UAE residential property investment ROI calculator that helps investors analyze potential returns on Dubai and UAE real estate investments. The platform provides comprehensive analysis with headline metrics visible to all users, with detailed PDF reports available behind a paywall.

---

## Core Features

### 1. ROI Calculator
**Purpose**: Calculate comprehensive investment returns for UAE residential properties
**Currency**: AED (Arab Emirates Dirham)
**Measurement**: Square feet (sqft)

#### Input Fields (Manual Entry)
- **Property Details**
  - Property Name (optional, text)
  - Listing URL (reference only - no scraping, text)
  - Portal Source (dropdown: Bayut, Property Finder, Dubizzle, Other)
  - Property Type (dropdown: Apartment, Villa, Townhouse, Penthouse)
  - Location (text)
  - Area Size (sqft, number, required)

- **Financial Details**
  - Purchase Price (AED, required)
  - Down Payment % (default: 20%, range: 15-100%)
  - Mortgage Interest Rate % (default: 5.5%, annual)
  - Mortgage Term Years (default: 25, range: 5-30)
  - Expected Monthly Rent (AED, required)
  - Service Charge (AED/year, default: 0)
  - Annual Maintenance % (default: 1% of purchase price)
  - Property Management Fee % (default: 5% of annual rent)
  - Dubai Land Department Fee (default: 4% of purchase price, one-time)
  - Real Estate Agent Fee % (default: 2% of purchase price, one-time)

- **Projection Parameters**
  - Annual Capital Growth % (default: 3%, range: -10 to 20%)
  - Annual Rent Growth % (default: 2%, range: -10 to 20%)
  - Expected Vacancy Rate % (default: 5%, range: 0-30%)
  - Investment Holding Period (years, default: 5, range: 1-30)

#### Validation Rules
- All AED amounts must be positive numbers
- Purchase price: minimum 100,000 AED
- Expected monthly rent: minimum 1,000 AED
- Area size: minimum 100 sqft, maximum 50,000 sqft
- Percentages must be within specified ranges
- Down payment cannot be less than 15% (UAE regulatory minimum)

---

## Calculation Formulas

### A. Basic Calculations

**Loan Amount**
```
Loan Amount = Purchase Price × (1 - Down Payment %)
```

**Monthly Mortgage Payment** (Using standard mortgage formula)
```
Monthly Interest Rate = Annual Interest Rate / 12 / 100
Number of Payments = Mortgage Term Years × 12

Monthly Payment = Loan Amount × [Monthly Interest Rate × (1 + Monthly Interest Rate)^Number of Payments] / [(1 + Monthly Interest Rate)^Number of Payments - 1]

If Loan Amount = 0 (100% cash): Monthly Payment = 0
```

**Annual Mortgage Payment**
```
Annual Mortgage Payment = Monthly Payment × 12
```

**Down Payment Amount**
```
Down Payment Amount = Purchase Price × (Down Payment % / 100)
```

### B. Upfront Costs (Year 0)

**Total Upfront Costs**
```
Total Upfront Costs = Down Payment Amount + DLD Fee + Agent Fee + Other Closing Costs

Where:
DLD Fee = Purchase Price × (DLD Fee % / 100)
Agent Fee = Purchase Price × (Agent Fee % / 100)
Other Closing Costs = 5,000 AED (estimated for registration, NOC, etc.)
```

**Total Initial Investment**
```
Total Initial Investment = Total Upfront Costs
```

### C. Annual Income

**Gross Annual Rental Income**
```
Gross Annual Rental Income = Expected Monthly Rent × 12
```

**Effective Annual Rental Income** (accounting for vacancy)
```
Effective Annual Rental Income = Gross Annual Rental Income × (1 - Vacancy Rate % / 100)
```

### D. Annual Operating Expenses

**Annual Service Charge**
```
Annual Service Charge = Service Charge (as inputted)
```

**Annual Maintenance Costs**
```
Annual Maintenance Costs = Purchase Price × (Annual Maintenance % / 100)
```

**Annual Property Management Fee**
```
Annual Property Management Fee = Gross Annual Rental Income × (Property Management Fee % / 100)
```

**Total Annual Operating Expenses**
```
Total Annual Operating Expenses = Annual Service Charge + Annual Maintenance Costs + Annual Property Management Fee
```

### E. Net Operating Income (NOI)

```
Net Operating Income = Effective Annual Rental Income - Total Annual Operating Expenses
```

### F. Annual Cash Flow

**Annual Cash Flow** (for leveraged investments)
```
Annual Cash Flow = Net Operating Income - Annual Mortgage Payment
```

**Annual Cash Flow** (for all-cash investments)
```
Annual Cash Flow = Net Operating Income
```

### G. Key Return Metrics

**Gross Rental Yield**
```
Gross Rental Yield % = (Gross Annual Rental Income / Purchase Price) × 100
```

**Net Rental Yield**
```
Net Rental Yield % = (Net Operating Income / Purchase Price) × 100
```

**Cash on Cash Return**
```
Cash on Cash Return % = (Annual Cash Flow / Total Initial Investment) × 100
```

**Cap Rate** (Capitalization Rate)
```
Cap Rate % = (Net Operating Income / Purchase Price) × 100
```

### H. 5-Year Projection

For each year (Year 1 to Year 5 or custom holding period):

**Year N Property Value**
```
Property Value[N] = Purchase Price × (1 + Annual Capital Growth % / 100)^N
```

**Year N Annual Rent**
```
Annual Rent[N] = Gross Annual Rental Income × (1 + Annual Rent Growth % / 100)^N
```

**Year N Effective Rental Income**
```
Effective Rental Income[N] = Annual Rent[N] × (1 - Vacancy Rate % / 100)
```

**Year N Operating Expenses**
```
Operating Expenses[N] = Service Charge + (Property Value[N] × Annual Maintenance % / 100) + (Annual Rent[N] × Property Management Fee % / 100)
```

**Year N NOI**
```
NOI[N] = Effective Rental Income[N] - Operating Expenses[N]
```

**Year N Remaining Loan Balance** (for mortgaged properties)
```
Calculate using standard amortization formula
Payments Made = N × 12
Remaining Balance[N] = Loan Amount × [(1 + Monthly Interest Rate)^Total Payments - (1 + Monthly Interest Rate)^Payments Made] / [(1 + Monthly Interest Rate)^Total Payments - 1]

If all cash: Remaining Balance[N] = 0
```

**Year N Equity**
```
Equity[N] = Property Value[N] - Remaining Loan Balance[N]
```

**Year N Cash Flow**
```
Cash Flow[N] = NOI[N] - Annual Mortgage Payment
```

**Year N Cumulative Cash Flow**
```
Cumulative Cash Flow[N] = Sum of Cash Flow[1] to Cash Flow[N]
```

**Year N Total Return** (if sold at end of year N)
```
Sale Proceeds = Property Value[N] - Remaining Loan Balance[N] - (Property Value[N] × 0.02) [2% selling agent fee]
Total Return[N] = Sale Proceeds + Cumulative Cash Flow[N] - Total Initial Investment
ROI %[N] = (Total Return[N] / Total Initial Investment) × 100
```

### I. Sensitivity Analysis

Perform scenario analysis across three variables:

**1. Vacancy Rate Sensitivity**
Test vacancy rates: 0%, 5%, 10%, 15%, 20%
Calculate impact on Annual Cash Flow and Cash on Cash Return

**2. Interest Rate Sensitivity** (for leveraged investments)
Test interest rates: Current - 2%, Current - 1%, Current, Current + 1%, Current + 2%
Calculate impact on Monthly Payment, Annual Cash Flow, and Cash on Cash Return

**3. Rent Sensitivity**
Test rent variations: -20%, -10%, 0%, +10%, +20% from expected
Calculate impact on Gross Yield, Net Yield, and Cash on Cash Return

**Sensitivity Output Format**
For each scenario, show:
- Scenario parameter value
- Annual Cash Flow (AED)
- Cash on Cash Return (%)
- Break-even point (if applicable)

---

## User Interface Flow

### Page 1: Calculator Input
- Hero section with value proposition
- Form with all input fields organized into sections:
  - Property Information
  - Purchase Details
  - Financing
  - Income & Expenses
  - Projection Assumptions
- "Calculate ROI" button
- Visual indicators for required fields
- Real-time validation feedback

### Page 2: Results & Paywall
**Free Tier (Visible to All)**
- Headline metrics in cards:
  - Gross Rental Yield %
  - Net Rental Yield %
  - Monthly Cash Flow (AED)
  - Cash on Cash Return %
  - Purchase Price
  - Expected Monthly Rent
- Property summary snapshot
- Call-to-action: "Unlock Full Report"

**Paywall Overlay**
- Blurred preview of full report content
- Pricing: 49 AED for detailed PDF report
- Sign in / Sign up required
- Payment button

**Paid Tier (After Payment)**
- All headline metrics
- Detailed breakdown tables:
  - Upfront costs breakdown
  - Annual income breakdown
  - Annual expenses breakdown
  - Monthly mortgage amortization (first 12 months)
- 5-year projection table and chart
- Sensitivity analysis tables (3 scenarios)
- "Download PDF Report" button
- "Save Analysis" button

### Page 3: Account Dashboard
- List of saved analyses with:
  - Property name/location
  - Date created
  - Key metrics preview
  - Payment status
  - Actions: View, Download PDF, Delete
- Filter by date, payment status
- Search by property name

### Page 4: Admin Dashboard
- Total analyses created (count)
- Total revenue (sum of payments)
- Conversion rate (paid/total %)
- Recent analyses table:
  - User email
  - Property details
  - Date created
  - Payment status
  - Key metrics
  - Download PDF link
- Analytics charts:
  - Analyses created over time
  - Conversion funnel
  - Revenue over time
- Export data to CSV

---

## Database Schema (Supabase)

### Table: `profiles`
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );
```

### Table: `analyses`
```sql
CREATE TABLE analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Property Details
  property_name TEXT,
  listing_url TEXT,
  portal_source TEXT CHECK (portal_source IN ('Bayut', 'Property Finder', 'Dubizzle', 'Other')),
  property_type TEXT CHECK (property_type IN ('Apartment', 'Villa', 'Townhouse', 'Penthouse')),
  location TEXT,
  area_sqft NUMERIC(10,2) NOT NULL CHECK (area_sqft >= 100 AND area_sqft <= 50000),
  
  -- Financial Inputs
  purchase_price NUMERIC(12,2) NOT NULL CHECK (purchase_price >= 100000),
  down_payment_percent NUMERIC(5,2) NOT NULL CHECK (down_payment_percent >= 15 AND down_payment_percent <= 100),
  mortgage_interest_rate NUMERIC(5,2) NOT NULL,
  mortgage_term_years INTEGER NOT NULL CHECK (mortgage_term_years >= 5 AND mortgage_term_years <= 30),
  expected_monthly_rent NUMERIC(10,2) NOT NULL CHECK (expected_monthly_rent >= 1000),
  service_charge_annual NUMERIC(10,2) DEFAULT 0,
  annual_maintenance_percent NUMERIC(5,2) DEFAULT 1,
  property_management_fee_percent NUMERIC(5,2) DEFAULT 5,
  dld_fee_percent NUMERIC(5,2) DEFAULT 4,
  agent_fee_percent NUMERIC(5,2) DEFAULT 2,
  
  -- Projection Parameters
  capital_growth_percent NUMERIC(5,2) DEFAULT 3,
  rent_growth_percent NUMERIC(5,2) DEFAULT 2,
  vacancy_rate_percent NUMERIC(5,2) DEFAULT 5,
  holding_period_years INTEGER DEFAULT 5 CHECK (holding_period_years >= 1 AND holding_period_years <= 30),
  
  -- Calculated Results (stored for quick access)
  gross_yield NUMERIC(5,2),
  net_yield NUMERIC(5,2),
  monthly_cash_flow NUMERIC(10,2),
  annual_cash_flow NUMERIC(10,2),
  cash_on_cash_return NUMERIC(5,2),
  
  -- Complete calculation results (JSONB for flexibility)
  calculation_results JSONB,
  
  -- Metadata
  is_paid BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_analyses_user_id ON analyses(user_id);
CREATE INDEX idx_analyses_created_at ON analyses(created_at DESC);
CREATE INDEX idx_analyses_is_paid ON analyses(is_paid);

-- RLS Policies
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

-- Users can view their own analyses
CREATE POLICY "Users can view own analyses"
  ON analyses FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own analyses
CREATE POLICY "Users can insert own analyses"
  ON analyses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own analyses
CREATE POLICY "Users can update own analyses"
  ON analyses FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own analyses
CREATE POLICY "Users can delete own analyses"
  ON analyses FOR DELETE
  USING (auth.uid() = user_id);

-- Admins can view all analyses
CREATE POLICY "Admins can view all analyses"
  ON analyses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Admins can update all analyses
CREATE POLICY "Admins can update all analyses"
  ON analyses FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );
```

### Table: `payments`
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  analysis_id UUID REFERENCES analyses(id) ON DELETE CASCADE,
  
  amount_aed NUMERIC(10,2) NOT NULL DEFAULT 49.00,
  payment_status TEXT DEFAULT 'completed' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_method TEXT DEFAULT 'simulated',
  transaction_id TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(analysis_id)
);

-- Index
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_analysis_id ON payments(analysis_id);
CREATE INDEX idx_payments_created_at ON payments(created_at DESC);

-- RLS Policies
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Users can view their own payments
CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own payments
CREATE POLICY "Users can insert own payments"
  ON payments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins can view all payments
CREATE POLICY "Admins can view all payments"
  ON payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );
```

### Table: `report_files`
```sql
CREATE TABLE report_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID REFERENCES analyses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size_bytes INTEGER,
  storage_bucket TEXT DEFAULT 'make-ef294769-reports',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(analysis_id)
);

-- Index
CREATE INDEX idx_report_files_user_id ON report_files(user_id);
CREATE INDEX idx_report_files_analysis_id ON report_files(analysis_id);

-- RLS Policies
ALTER TABLE report_files ENABLE ROW LEVEL SECURITY;

-- Users can view their own report files
CREATE POLICY "Users can view own report files"
  ON report_files FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own report files
CREATE POLICY "Users can insert own report files"
  ON report_files FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins can view all report files
CREATE POLICY "Admins can view all report files"
  ON report_files FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );
```

---

## Authentication Flow

### Sign Up
1. User enters email, password, and full name
2. POST to `/make-server-ef294769/auth/signup`
3. Server creates user via Supabase Admin API
4. Server creates profile record with is_admin = FALSE
5. Auto-confirm email (no email server configured)
6. Return access token
7. Store token in frontend localStorage
8. Redirect to calculator or dashboard

### Sign In
1. User enters email and password
2. Call Supabase Auth `signInWithPassword`
3. Store access token
4. Redirect to dashboard or return to analysis

### Sign Out
1. Call Supabase Auth `signOut`
2. Clear localStorage
3. Redirect to home

### Protected Routes
- Calculator: Public (guest can use, but must sign up to save/pay)
- Results: Public (free tier), Auth required for payment
- Dashboard: Auth required
- Admin: Auth required + is_admin = TRUE

---

## Payment Flow (Simulated)

Since this is a prototype:
1. User clicks "Unlock Full Report" (49 AED)
2. If not authenticated: redirect to sign in/sign up
3. If authenticated: show payment confirmation modal
4. User confirms payment (simulated - no real payment gateway)
5. POST to `/make-server-ef294769/payments/create`
6. Server creates payment record with status 'completed'
7. Server updates analysis.is_paid = TRUE
8. Generate PDF report
9. Store PDF in Supabase Storage
10. Create report_files record
11. Return signed URL for download
12. Show success message with download button

---

## PDF Report Structure

**YieldPulse Investment Analysis Report**

**Header Section**
- YieldPulse logo
- Report date
- Property name/location

**Executive Summary**
- Property details table
- Purchase summary
- Financing summary
- Headline metrics (4 key KPIs)

**Section 1: Investment Overview**
- Property information
- Financial assumptions
- Upfront costs breakdown table

**Section 2: Return Metrics**
- Gross rental yield
- Net rental yield
- Cash on cash return
- Cap rate
- Annual cash flow

**Section 3: Income & Expenses**
- Annual income breakdown table
- Annual operating expenses table
- Net operating income

**Section 4: 5-Year Projection**
- Year-by-year projection table:
  - Property value
  - Equity
  - Annual rent
  - NOI
  - Cash flow
  - Cumulative cash flow
  - ROI if sold
- Projection chart (line graph)

**Section 5: Mortgage Schedule**
- First 12 months amortization table
- Total interest paid over life of loan
- Loan payoff summary

**Section 6: Sensitivity Analysis**
- Vacancy rate scenarios table
- Interest rate scenarios table
- Rent scenarios table
- Key insights

**Footer**
- Disclaimer: "This report is for informational purposes only and does not constitute financial advice. Consult a qualified financial advisor before making investment decisions."
- Generated by YieldPulse

---

## Admin Dashboard Metrics

**Key Metrics Cards**
1. Total Analyses: COUNT(analyses)
2. Paid Reports: COUNT(analyses WHERE is_paid = TRUE)
3. Total Revenue: SUM(payments.amount_aed)
4. Conversion Rate: (Paid / Total) × 100%

**Analyses Table**
- Columns: Date, User Email, Property, Location, Purchase Price, Rent, Yield, Paid Status, Actions
- Filters: Date range, Paid/Unpaid, Portal source
- Search: Property name, location, user email
- Actions: View Details, Download PDF, Delete

**Charts**
1. Analyses created over time (line chart, last 30 days)
2. Revenue over time (bar chart, last 30 days)
3. Conversion funnel (funnel chart: Total → Signed In → Paid)

**Export**
- Export all analyses to CSV
- Export payments to CSV

---

## Technical Implementation Notes

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- Form validation with real-time feedback
- Chart library: Recharts for projection visualizations
- PDF generation: jsPDF or similar library
- State management for multi-step flow

### Backend (Supabase Edge Functions)
- Hono web server at `/supabase/functions/server/index.tsx`
- Routes:
  - POST `/make-server-ef294769/auth/signup`
  - POST `/make-server-ef294769/analyses/create`
  - GET `/make-server-ef294769/analyses/:id`
  - PUT `/make-server-ef294769/analyses/:id`
  - DELETE `/make-server-ef294769/analyses/:id`
  - GET `/make-server-ef294769/analyses/user/:userId`
  - POST `/make-server-ef294769/payments/create`
  - POST `/make-server-ef294769/reports/generate`
  - GET `/make-server-ef294769/admin/analytics`
  - GET `/make-server-ef294769/admin/analyses`

### Storage
- Bucket: `make-ef294769-reports` (private)
- File naming: `{analysisId}_report_{timestamp}.pdf`
- Signed URLs with 1-hour expiry

### Security
- All user inputs sanitized and validated
- Row Level Security on all tables
- Admin access controlled via is_admin flag
- CORS configured for frontend origin
- Rate limiting on calculation endpoints (future enhancement)

---

## Business Rules

1. **Free Tier**: All users can calculate and see headline metrics
2. **Paid Tier**: 49 AED per detailed report unlock (one-time per analysis)
3. **Guest Users**: Can calculate but cannot save or download (must sign up)
4. **Registered Users**: Can save unlimited analyses, pay per report
5. **Admin Users**: Full access to all data and analytics
6. **Report Persistence**: Reports remain accessible after payment indefinitely
7. **Analysis Editing**: Users can edit saved analyses, but must pay again for updated report

---

## Success Criteria

- Calculator produces accurate results per formulas
- RLS policies enforce data isolation
- Payment flow completes successfully
- PDF generation works for all analyses
- Admin can view all user data and metrics
- Responsive design works on mobile and desktop
- Forms validate correctly with helpful error messages

---

## Future Enhancements (Post-V1)

- Real payment gateway integration (Stripe, Telr, PayTabs)
- Email notifications for report delivery
- Comparison tool (compare multiple properties side-by-side)
- Market data integration for location-based benchmarks
- Mortgage calculator with UAE bank rates
- Sharing feature (share analysis via link)
- White-label reports with custom branding
- Export analyses to Excel
- API access for developers
- Mobile app (React Native)

---

**Document Version**: 1.0  
**Last Updated**: 2026-01-02  
**Status**: Ready for Implementation
