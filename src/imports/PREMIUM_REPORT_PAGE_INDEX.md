# Premium Report Design Index - Quick Page Finder

## 🎯 Visual Page Map

Use this guide to quickly locate which file contains which page design.

---

## Page 1: Cover Page 📄
**File**: `1.tsx`  
**SVG**: `svg-lqpnukfy5i.ts`  
**Nickname**: PremiumReportCover

### What's on this page:
- YieldPulse logo and branding
- Property hero image (user-uploaded)
- "Premium Investment Analysis Report" title
- Property name (large, bold)
- Property location
- Generation date

### Key Dynamic Data:
- `propertyName` 
- `location`
- `propertyImageUrl` (from Supabase Storage)
- `generatedDate`

---

## Page 2: Property Details & Executive Summary 📊
**File**: `2.tsx`  
**SVG**: `svg-2a365f420m.ts`  
**Nickname**: PremiumReportPropertyDetails

### What's on this page:
- Property specifications (bedrooms, bathrooms, size, type)
- Purchase price and monthly rent
- Executive Summary card with 7 key metrics

### Key Metrics Displayed:
1. Gross Rental Yield (%)
2. Net Rental Yield (%)
3. Cash on Cash Return (%)
4. Total Initial Investment (AED)
5. Monthly Cash Flow (AED)
6. 5-Year Total Cash Flow (AED)
7. Breakeven Occupancy (%)

---

## Page 3: Income & Expense Waterfall 💰
**File**: `3.tsx`  
**SVG**: `svg-rq5nbv8igf.ts`  
**Nickname**: PremiumReportWaterfallChart

### What's on this page:
Visual waterfall chart showing cash flow breakdown:
1. Annual Rental Income (starting point)
2. ➖ Mortgage Payments
3. ➖ Service Charges
4. ➖ Maintenance Reserve
5. ➖ Property Management
6. ➖ Vacancy Reserve
7. = Net Annual Cash Flow (ending point)

### Chart Type:
Waterfall with positive (teal) and negative (red) bars, connected by dashed lines.

---

## Page 4: Upfront Capital Requirement 💵
**File**: `4.tsx`  
**SVG**: `svg-nv7uhfjv37.ts`  
**Nickname**: PremiumReportCapitalRequirement

### What's on this page:
Complete breakdown of initial investment needed:
- Down Payment (% of purchase price)
- DLD Transfer Fee (4%)
- Agent Commission (2%)
- Valuation & Admin Fees
- Initial Furnishing (if applicable)
- Working Capital Reserve
- **Total Upfront Capital** (sum)

### Optional Visual:
Donut chart showing proportion of each cost component.

---

## Page 5: Five Year Investment Outcome 📈
**File**: `5.tsx`  
**SVG**: `svg-07pr5sck10.ts`  
**Nickname**: PremiumReportFiveYearOutcome

### What's on this page:
Year-by-year projection table (5 rows) with columns:
- Year (1-5)
- Annual Cash Flow
- Cumulative Cash Flow
- Equity Buildup
- Total Return
- ROI (%)

Plus: Key assumptions used in projections

### Chart Type:
Dual-axis line chart showing cumulative cash flow and ROI growth over time.

---

## Page 6: Rent Sensitivity Analysis 📉
**File**: `6.tsx`  
**SVG**: `svg-i1ongb566v.ts`  
**Nickname**: PremiumReportRentSensitivity

### What's on this page:
Impact of rent variations on key metrics:

**Scenarios**: -20%, -10%, Base, +10%, +20%

**Metrics Analyzed**:
1. Annual Rental Income (AED)
2. Net Yield (%)
3. Monthly Cash Flow (AED)
4. Cash on Cash Return (%)

### Chart Type:
Multi-line chart with base case highlighted.

---

## Page 7: Vacancy Rate Sensitivity 🏠
**File**: `7.tsx`  
**SVG**: `svg-0caz9fcofg.ts`  
**Nickname**: PremiumReportVacancySensitivity

### What's on this page:
Impact of vacancy rate on returns:

**Scenarios**: 0%, 5%, 10%, 15%, 20%

**Metrics Analyzed**:
1. Effective Rental Income (AED)
2. Net Yield (%)
3. Monthly Cash Flow (AED)
4. Cash on Cash Return (%)

### Chart Type:
Multi-line chart showing declining returns as vacancy increases.

---

## Page 8: Interest Rate Sensitivity 📊
**File**: `8.tsx`  
**SVG**: `svg-lp3abpco2q.ts`  
**Nickname**: PremiumReportInterestSensitivity

### What's on this page:
Impact of interest rate changes on financing:

**Scenarios**: 3%, 4%, 5%, 6%, 7%

**Metrics Analyzed**:
1. Monthly Mortgage Payment (AED)
2. Net Yield (%)
3. Monthly Cash Flow (AED)
4. Cash on Cash Return (%)

### Chart Type:
Multi-line chart showing impact of rate changes on payments and returns.

---

## Page 9: Input and Assumption Verification ✅
**File**: `9.tsx`  
**SVG**: `svg-97vdql6d5b.ts`  
**Nickname**: PremiumReportInputVerification

### What's on this page:
Complete record of all user inputs:

**Property Details Section**:
- Purchase Price, Monthly Rent
- Bedrooms, Bathrooms, Size, Type

**Financing Details Section**:
- Down Payment (%), Loan Amount
- Interest Rate (%), Loan Term (years)

**Additional Context Section**:
- Property Reference Image (thumbnail)
- Purchase Date (if provided)
- Additional Notes (if provided)

---

## Page 10: System Constants & Assumptions ⚙️
**File**: `10.tsx`  
**SVG**: `svg-zson8zmudx.ts`  
**Nickname**: PremiumReportSystemConstants

### What's on this page:
Fixed assumptions used in all calculations:
- DLD Transfer Fee: 4%
- Agent Commission: 2%
- Service Charge: [varies]
- Annual Maintenance: 1% of property value
- Property Management: 5% of rent
- Vacancy Reserve: 5%

Plus:
- Investment risk disclaimers
- Professional advice recommendation
- Report metadata (version, date, copyright)

---

## Page 11: Mortgage Breakdown 🏦
**File**: `11.tsx`  
**SVG**: `svg-497l8u1z6s.ts`  
**Nickname**: PremiumReportMortgageBreakdown

### What's on this page:

**Loan Summary Box**:
- Total Loan Amount (AED)
- Loan Term (years)
- Interest Rate (%)
- Monthly Payment (AED)
- Total Interest Paid Over Life (AED)

**First Year Schedule Table** (12 rows):
| Month | Payment | Principal | Interest | Remaining Balance |
|-------|---------|-----------|----------|-------------------|
| 1-12  | ...     | ...       | ...      | ...              |

**Visual**: Pie/donut chart showing principal vs interest proportion.

---

## 🔍 Quick Search

Need to find something specific? Use these keywords:

| What you need | Go to file |
|--------------|-----------|
| Cover design, branding | `1.tsx` |
| Property specs, summary metrics | `2.tsx` |
| Income/expense breakdown | `3.tsx` |
| Upfront costs, down payment | `4.tsx` |
| 5-year projections | `5.tsx` |
| Rent variations impact | `6.tsx` |
| Vacancy impact | `7.tsx` |
| Interest rate impact | `8.tsx` |
| User inputs verification | `9.tsx` |
| System assumptions, disclaimers | `10.tsx` |
| Mortgage amortization | `11.tsx` |

---

## 📋 Implementation Checklist by Page

Copy this to track your progress:

```
PREMIUM REPORT IMPLEMENTATION TRACKER
=====================================

[ ] Page 1: Cover Page (1.tsx)
    [ ] YieldPulse logo positioned
    [ ] Property image loaded from Supabase
    [ ] Property name and location displayed
    [ ] Generation date formatted correctly
    [ ] Background gradient/noise texture applied

[ ] Page 2: Property Details (2.tsx)
    [ ] Property specs grid (bed/bath/size/type)
    [ ] Purchase price and rent displayed
    [ ] Executive summary card styled
    [ ] All 7 metrics calculated and shown
    [ ] Number formatting correct (AED, %)

[ ] Page 3: Waterfall Chart (3.tsx)
    [ ] Chart axes and labels
    [ ] Gross income bar (teal)
    [ ] All expense bars (red)
    [ ] Net cash flow bar (teal or red)
    [ ] Connecting dashed lines
    [ ] Value labels on each bar

[ ] Page 4: Capital Requirement (4.tsx)
    [ ] All cost line items listed
    [ ] Calculations correct (4% DLD, 2% agent)
    [ ] Total prominently displayed
    [ ] Optional donut chart added

[ ] Page 5: Five Year Outcome (5.tsx)
    [ ] 5-row table with all columns
    [ ] Year-by-year projections accurate
    [ ] Assumptions box with growth rates
    [ ] Dual-axis chart showing trends
    [ ] ROI percentage line clearly visible

[ ] Page 6: Rent Sensitivity (6.tsx)
    [ ] 5 scenarios (-20% to +20%)
    [ ] Table with 4 metrics per scenario
    [ ] Multi-line chart with legend
    [ ] Base case highlighted/emphasized

[ ] Page 7: Vacancy Sensitivity (7.tsx)
    [ ] 5 scenarios (0% to 20%)
    [ ] Effective income calculated correctly
    [ ] Chart shows declining trend
    [ ] Base case highlighted

[ ] Page 8: Interest Sensitivity (8.tsx)
    [ ] 5 scenarios (3% to 7%)
    [ ] Monthly payment recalculated per scenario
    [ ] Impact on cash flow clear
    [ ] Base case highlighted

[ ] Page 9: Input Verification (9.tsx)
    [ ] All property details listed
    [ ] All financing details listed
    [ ] Property image thumbnail (if available)
    [ ] Purchase date shown (if provided)
    [ ] Notes displayed (if provided)

[ ] Page 10: System Constants (10.tsx)
    [ ] All 6 constants listed with values
    [ ] Service charge shows actual amount
    [ ] Disclaimers in readable font
    [ ] Report metadata (version, date)
    [ ] Copyright notice

[ ] Page 11: Mortgage Breakdown (11.tsx)
    [ ] Loan summary box with 5 key figures
    [ ] 12-month amortization table
    [ ] Principal, interest, balance columns
    [ ] Pie chart showing principal/interest split
    [ ] All calculations verified

FINAL CHECKS
============
[ ] All pages generated without errors
[ ] Page numbers correct (1-11)
[ ] Headers/footers consistent
[ ] Brand colors used (#1e2875, #14b8a6)
[ ] Inter font applied throughout
[ ] Number formatting consistent
[ ] Currency shows "AED X,XXX,XXX"
[ ] Percentages show "X.XX%"
[ ] Charts scale properly
[ ] Property image loads on cover
[ ] PDF file size < 5MB
[ ] PDF is printable without cropping
[ ] Tested with multiple properties
[ ] Tested with negative cash flow
[ ] Tested with missing optional fields
```

---

## 🎓 Study Guide

### For First-Time Implementers:

1. **Start with Page 1** (`1.tsx`) - It's the simplest
2. **Move to Page 2** (`2.tsx`) - Practice layout and tables
3. **Tackle Page 3** (`3.tsx`) - Learn chart generation
4. **Continue sequentially** through pages 4-11
5. **Test after each page** - Don't wait until all 11 are done

### For Experienced Developers:

1. **Skim all 11 files** to understand scope
2. **Build a page template** with header/footer
3. **Implement pages in parallel** (team approach)
4. **Create reusable chart functions**
5. **Test with edge cases early**

---

## 🚀 Ready to Implement!

You now have a complete visual map of all 11 premium report pages. Open the files in order and start building!

**Next Step**: Open `1.tsx` and begin with the cover page.

---

*Last updated: January 30, 2026*  
*Premium Report Page Index v1.0*
