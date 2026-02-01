# Premium Report Pages - Complete Inventory

## Status: ALL 11 PAGES RECEIVED ✅

All Figma designs for the YieldPulse Premium Investment Report have been received and documented.

---

## Page Index

### ✅ Page 1: Cover Page
**File:** `page-1-cover.tsx` (SAVED)
**Figma Source:** `1-711-52.tsx`
**SVG:** `svg-1nex6bngih.ts`
**Size:** A4 (595px × 842px)

**Components:**
- Navy gradient background (#1f2975)
- YieldPulse logo (teal icon + white text)
- Title: "Premium Investment Report"
- Property preview card with image and 5 key details
- Noise texture overlay with blur effects

---

### ✅ Page 2: Property Details & Executive Summary
**File:** `page-2-property-details.tsx` (SAVED)
**Figma Source:** `2-711-1647.tsx`
**SVG:** `svg-thqyw3meum.ts`

**Components:**
- Header: "Property Details & Financing Terms"
- Two-column property specs (Purchase/Rent + Loan/Growth)
- Section 01: Executive Summary
- 3×3 KPI grid showing:
  - Gross Yield, Net Yield, Cash on Cash Return
  - Monthly/Annual Cash Flow, Cap Rate
  - Initial Investment, Cost/Rent per Sq Ft
- Insight box with analysis

---

### ✅ Page 3: Income & Expense Waterfall
**File:** `page-3-income-expense.tsx` (TO SAVE)
**Figma Source:** `3-711-1728.tsx`  
**SVG:** `svg-9iknwo2fx8.ts`

**Components:**
- Section 02: Executive Summary
- Waterfall chart visualization:
  - Gross Income → Effective Income (vacancy loss)
  - Operating expenses breakdown (service, maintenance, mgmt)
  - Net Operating Income → Cash Flow (mortgage)
- Operating Expense Breakdown table
- Color coding: Teal (income), Red (expenses)

---

### ✅ Page 4: Upfront Capital Requirement
**File:** `page-4-upfront-capital.tsx` (TO SAVE)
**Figma Source:** `4-711-1656.tsx`
**SVG:** `svg-crd72xyabs.ts`

**Components:**
- Section 03: Upfront Capital Requirement
- Detailed table with 4 columns:
  - Component
  - Amount
  - % of Price
  - % of Total Investment
- Line items:
  - Down Payment (Equity)
  - DLD Registration Fee
  - Agent Commission
  - Other Closing Costs
  - **Total Initial Investment**
- Insight box explaining equity vs fees

---

### ✅ Page 5: Mortgage Breakdown
**File:** `page-5-mortgage.tsx` (TO SAVE)
**Figma Source:** `5-711-1665.tsx`
**SVG:** `svg-0t6deb36ol.ts`

**Components:**
- Section 04: Mortgage Breakdown
- Two-column layout:
  - Left: Loan Amount, LTV, Interest Rate, Loan Term
  - Right: Monthly Payment, Annual Payment, First Year Interest/Principal
- First Year Amortization explanation
- Insight: 71.3% interest vs 28.7% principal in Year 1

---

### ✅ Page 6: Five Year Investment Outcome
**File:** `page-6-five-year-outcome.tsx` (TO SAVE)
**Figma Source:** `6-711-1710.tsx`
**SVG:** `svg-jgl3b43roj.ts`

**Components:**
- Section 05: Five Year Investment Outcome
- Assuming 2.00% annual appreciation and rent growth
- Table showing:
  - Final Property Value
  - Remaining Loan Balance
  - Your Equity
  - Cumulative Cash Flow
  - Less: Selling Fee (2%)
  - Net Sale Proceeds
  - **Total Return**
  - **Return on Investment (ROI)**
- Insight on 5-year projection

---

### ✅ Page 7: Rent Sensitivity Analysis
**File:** `page-7-rent-sensitivity.tsx` (TO SAVE)
**Figma Source:** `7-711-1674.tsx`
**SVG:** `svg-pofd6000a7.ts`

**Components:**
- Section 06: Sensitivity Analysis
- Rent Sensitivity table:
  - -20%, -10%, +0%, +10%, +20% rent scenarios
  - Shows: Monthly Rent, Annual Cash Flow, CoC Return
- Insight: Impact of rent changes on cash flow

---

### ✅ Page 8: Vacancy Rate Sensitivity
**File:** `page-8-vacancy-sensitivity.tsx` (TO SAVE)
**Figma Source:** `8-711-1683.tsx`
**SVG:** `svg-mu1tqdoitp.ts`

**Components:**
- Vacancy Rate Sensitivity table:
  - 0.00%, 5.00%, 10.0%, 15.0%, 20.0% vacancy scenarios
  - Shows: Vacancy Rate, Annual Cash Flow, CoC Return
- Insight: Importance of tenant retention

---

### ✅ Page 9: Interest Rate Sensitivity
**File:** `page-9-interest-sensitivity.tsx` (TO SAVE)
**Figma Source:** `9-711-1692.tsx`
**SVG:** `svg-ml5hqy5506.ts`

**Components:**
- Interest Rate Sensitivity table:
  - 3.00%, 4.00%, 5.00%, 6.00%, 7.00% interest rate scenarios
  - Shows: Interest Rate, Annual Cash Flow, CoC Return
- Insight: Each 1% change impacts cash flow by ~AED 6,019

---

### ✅ Page 10: Input and Assumption Verification
**File:** `page-10-input-verification.tsx` (TO SAVE)
**Figma Source:** `10-711-1719.tsx`
**SVG:** `svg-8nnodwb0qd.ts`

**Components:**
- Section 07: Input and Assumption Verification
- "All calculations in this report are based on the following inputs"
- Your Inputs table showing all 13 input fields:
  - Property Source, Purchase Price, Expected Monthly Rent
  - Down Payment, Mortgage Interest Rate, Loan Term
  - Vacancy Rate, Service Charge, Maintenance Budget
  - Property Mgmt Fee, Holding Period
  - Capital Growth, Rent Growth
  - Total Return, ROI

---

### ✅ Page 11: System Constants & Assumptions
**File:** `page-11-system-constants.tsx` (TO SAVE)
**Figma Source:** `11-711-1701.tsx`
**SVG:** `svg-g6xv6zpmzj.ts`

**Components:**
- System Constants & Assumptions table with 3 columns:
  - Assumption
  - Value
  - Basis
- Constants shown:
  - DLD Registration Fee: 4% of purchase price (Dubai Land Department standard rate)
  - Agent Commission: 2% of purchase price (UAE market standard for buyer's agent)
  - Other Closing Costs: 0.5% of purchase price (Estimated valuation, NOC, legal fees)
  - Selling Fee at Exit: 2% of future value (UAE market standard for seller's agent)

---

## Design System (Consistent Across All Pages)

### Colors
```typescript
Navy Primary: #1f2975 (31, 41, 117)
Teal Accent: #12b9a6 (18, 185, 166)
Text Dark: #0a1461 (10, 20, 97)
Text Secondary: #0e172b (14, 23, 43)
Text Muted: rgba(14,23,43,0.5)
Background Light: #f8fafc (248, 250, 252)
Border: #e4e4e4 (228, 228, 228)
Border Light: #eef0f2 (238, 240, 242)
Success/Positive: #15b8a6 (teal bars)
Destructive/Negative: #ef4444 (red bars)
```

### Typography
```
Font Family: Inter (Google Fonts)
Title: 20px Semi Bold, -0.4px tracking
Subtitle: 10px Regular
Section Number: 8px Semi Bold, white on navy badge
Section Title: 12px Bold, white
KPI Value: 16px Semi Bold
KPI Label: 10px Regular, 50% opacity
Table Header: 10px Semi Bold
Table Cell: 8px Regular, -0.16px tracking
Insight Title: 10px Semi Bold (teal #15b8a6)
Insight Body: 8px Regular, -0.16px tracking
Footer: 10px Bold/Regular
```

### Layout
```
Page Size: A4 (595px × 842px)
Header Height: ~145px (navy background)
Content Area: 24px horizontal padding
Bottom Footer: 24px padding bottom
Section Badge: 20px × 20px, rounded 4px
Section Container: Navy #1f2975, rounded 5px
Data Cards: #f8fafc background, #eef0f2 border, rounded 6-8px
Tables: #f8fafc background, rounded 8px
Gaps: 8px, 12px, 16px, 24px
```

### Common Components

**Header (All Pages)**
- Logo: 32px teal circle + "YieldPulse" 22.4px
- Title: "Property Details & Financing Terms"
- Subtitle: "In depth analysis..."
- Horizontal line: white, 20% opacity
- Padding: 24px horizontal, 40px vertical

**Footer (All Pages)**
- Report Date: "27 Jan 2026"
- Prepared by: "YieldPulse Platform"  
- Label: "Confidential Investment Report"
- Font: 10px Bold/Regular

**Section Badge**
- White background, rounded 4px
- Number in navy #0a1461, 8px Semi Bold
- Center aligned

**Insight Box**
- Background: #f8fafc
- Border: #eef0f2, 0.8px
- Rounded: 8px
- Title: "Insight" in teal #15b8a6
- Body: Multi-style with bold highlights

---

## Implementation Priority

### Phase 1: Core Pages (COMPLETED)
- [x] Page 1: Cover
- [x] Page 2: Property Details & Executive Summary

### Phase 2: Financial Analysis (TO DO)
- [ ] Page 3: Income & Expense Waterfall
- [ ] Page 4: Upfront Capital
- [ ] Page 5: Mortgage Breakdown
- [ ] Page 6: Five Year Outcome

### Phase 3: Sensitivity Analysis (TO DO)
- [ ] Page 7: Rent Sensitivity
- [ ] Page 8: Vacancy Sensitivity
- [ ] Page 9: Interest Rate Sensitivity

### Phase 4: Documentation (TO DO)
- [ ] Page 10: Input Verification
- [ ] Page 11: System Constants

---

## Dynamic Data Requirements

All pages use dynamic data from the calculator. Key data points:

```typescript
interface PremiumReportData {
  // Property Info
  propertyName: string;
  reportId: string;
  propertyImageUrl: string;
  propertySource: string;
  
  // Purchase Details
  purchasePrice: number;
  expectedMonthlyRent: number;
  downPaymentPercent: number;
  interestRate: number;
  loanTermYears: number;
  
  // Operating Costs
  serviceChargePerYear: number;
  maintenancePerYear: number;
  propertyManagementFee: number;
  vacancyRate: number;
  
  // Projections
  rentGrowthRate: number;
  capitalGrowthRate: number;
  holdingPeriodYears: number;
  
  // Calculated Metrics
  grossYield: number;
  netYield: number;
  cashOnCashReturn: number;
  monthlyCashFlow: number;
  annualCashFlow: number;
  capRate: number;
  
  // Initial Investment
  downPaymentAmount: number;
  dldFee: number;
  agentFee: number;
  otherClosingCosts: number;
  totalInitialInvestment: number;
  
  // Mortgage
  loanAmount: number;
  ltv: number;
  monthlyMortgagePayment: number;
  annualMortgagePayment: number;
  firstYearInterest: number;
  firstYearPrincipal: number;
  totalInterestOverLife: number;
  
  // Operating Expenses
  annualServiceCharge: number;
  annualMaintenance: number;
  annualPropertyManagement: number;
  totalOperatingExpenses: number;
  
  // Waterfall Data
  grossIncome: number;
  vacancyLoss: number;
  effectiveIncome: number;
  netOperatingIncome: number;
  
  // 5-Year Projection
  finalPropertyValue: number;
  remainingLoanBalance: number;
  yourEquity: number;
  cumulativeCashFlow: number;
  sellingFee: number;
  netSaleProceeds: number;
  totalReturn: number;
  roi: number;
  
  // Sensitivity Arrays
  rentSensitivity: SensitivityScenario[];
  vacancySensitivity: SensitivityScenario[];
  interestSensitivity: SensitivityScenario[];
  
  // Meta
  reportDate: string;
  generatedDate: string;
}

interface SensitivityScenario {
  label: string;
  value: number;
  annualCashFlow: number;
  cocReturn: number;
}
```

---

## Next Steps for Implementation

1. **Save remaining 9 pages** to `/premium-report/` folder
2. **Create shared components**:
   - `Header.tsx` - Reusable navy header
   - `Footer.tsx` - Reusable metadata footer
   - `SectionBadge.tsx` - Numbered badge component
   - `InsightBox.tsx` - Teal insight component
   - `DataCard.tsx` - KPI card component
3. **Build PDF generator** at `/src/utils/premiumPdfGenerator.ts`:
   - Use jsPDF with A4 portrait
   - Implement each page as separate function
   - Handle dynamic data mapping
   - Add waterfall chart drawing logic
   - Export as single PDF file
4. **Test with sample data** from calculator
5. **Verify pixel-perfect match** with Figma designs

---

**Last Updated:** February 1, 2026  
**Status:** 2 of 11 pages saved, 9 remaining  
**Ready for:** Full implementation
