# YieldPulse Premium Report Figma Designs - Complete Documentation

## 📦 Package Overview

This package contains 11 professionally designed pages for the **YieldPulse Premium Property Investment Report PDF**. These are Figma-to-React exports that serve as pixel-perfect reference for rebuilding `/src/utils/pdfGenerator.ts`.

---

## 🎨 Design System

### Brand Colors
- **Navy Primary**: `#1e2875` - Used for headers, titles, primary UI elements
- **Teal Accent**: `#14b8a6` - Used for positive values, highlights, CTAs
- **Background**: `#ffffff` (white) with subtle gradients
- **Text Colors**: 
  - Primary: `#1a1a1a` (near black)
  - Secondary: `#666666` (gray)
  - Tertiary: `#999999` (light gray)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights Used**: 
  - Regular (400) - Body text
  - Medium (500) - Subheadings
  - SemiBold (600) - Section titles
  - Bold (700) - Page titles, emphasis

### Layout Specifications
- **Page Size**: A4 Portrait (210mm × 297mm / 595pt × 842pt)
- **Margins**: 
  - Top: 40pt
  - Bottom: 40pt
  - Left: 50pt
  - Right: 50pt
- **Safe Area**: All content within margins to ensure printability

---

## 📄 Page-by-Page Breakdown

### Page 1: Cover Page
**File**: `PremiumReportCover.tsx`  
**SVG**: `svg-premium-cover.ts`

#### Components:
- **Background**: Gradient overlay with noise texture for premium feel
- **Hero Image**: User-uploaded property reference image (fetched from Supabase Storage)
- **YieldPulse Logo**: Top left corner
- **Report Title**: "Premium Investment Analysis Report"
- **Property Name**: Large, bold typography
- **Property Location**: Subtitle below name
- **Generation Date**: Bottom of page

#### Dynamic Data Points:
```typescript
{
  propertyName: string;           // e.g., "Marina Heights Tower"
  location: string;                // e.g., "Dubai Marina, Dubai"
  propertyImageUrl: string;        // Supabase storage URL
  generatedDate: string;           // Format: "15 January 2025"
}
```

#### Implementation Notes:
- Property image should fill the hero area proportionally
- Gradient overlay ensures text readability
- Noise texture adds premium aesthetic

---

### Page 2: Property Details & Executive Summary
**File**: `PremiumReportPropertyDetails.tsx`  
**SVG**: `svg-premium-property-details.ts`

#### Components:
- **Property Specifications Grid**: Bedrooms, Bathrooms, Size, Type
- **Financial Highlights**: Purchase Price, Monthly Rent
- **Executive Summary Card**: Key metrics in a prominent box
  - Gross Rental Yield
  - Net Rental Yield
  - Cash on Cash Return
  - Total Initial Investment
  - Monthly Cash Flow
  - 5-Year Total Cash Flow
  - Breakeven Occupancy

#### Dynamic Data Points:
```typescript
{
  // Property specs
  bedrooms: number;
  bathrooms: number;
  propertySize: number;          // sqft
  propertyType: string;          // "Apartment", "Villa", "Townhouse"
  
  // Financial
  purchasePrice: number;         // AED
  monthlyRent: number;           // AED
  
  // Calculated metrics
  grossYield: number;            // %
  netYield: number;              // %
  cashOnCashReturn: number;      // %
  totalInitialInvestment: number; // AED
  monthlyCashFlow: number;       // AED (can be negative)
  fiveYearTotalCashFlow: number; // AED
  breakevenOccupancy: number;    // %
}
```

#### Layout:
- Two-column layout: Specs on left, Summary on right
- Executive summary card uses teal accent border
- All currency values formatted as "AED X,XXX,XXX"
- Percentages show 2 decimal places

---

### Page 3: Income & Expense Waterfall Chart
**File**: `PremiumReportWaterfallChart.tsx`  
**SVG**: `svg-premium-waterfall.ts`

#### Components:
- **Waterfall Chart**: Visual flow from gross income to net cash flow
- **Flow Steps** (in order):
  1. Annual Rental Income (starting point - green/teal)
  2. Mortgage Payments (negative - red bar)
  3. Service Charges (negative - red bar)
  4. Maintenance Reserve (negative - red bar)
  5. Property Management (negative - red bar)
  6. Vacancy Reserve (negative - red bar)
  7. Net Annual Cash Flow (ending point - green/teal or red if negative)

#### Dynamic Data Points:
```typescript
{
  annualRentalIncome: number;      // AED
  annualMortgagePayments: number;  // AED
  annualServiceCharges: number;    // AED
  annualMaintenance: number;       // AED
  annualPropertyManagement: number; // AED
  annualVacancyReserve: number;    // AED
  netAnnualCashFlow: number;       // AED (can be negative)
}
```

#### Chart Specifications:
- X-axis: Categories (income/expenses)
- Y-axis: AED values with proper scaling
- Bars: Width consistent, spacing proportional
- Colors: Positive (teal), Negative (red/coral)
- Connectors: Dashed lines between bars showing flow
- Labels: Value above each bar, category below

---

### Page 4: Upfront Capital Requirement
**File**: `PremiumReportCapitalRequirement.tsx`  
**SVG**: `svg-premium-capital.ts`

#### Components:
- **Capital Breakdown Table**: Line items with amounts
- **Visual Progress/Pie Chart**: Optional donut chart showing proportion
- **Total Box**: Prominent total at bottom

#### Line Items:
1. Down Payment (e.g., 20% of purchase price)
2. DLD Transfer Fee (4% of purchase price)
3. Agent Commission (2% of purchase price)
4. Valuation & Admin Fees
5. Initial Furnishing (if applicable)
6. Working Capital Reserve
7. **Total Upfront Capital** (sum of above)

#### Dynamic Data Points:
```typescript
{
  downPayment: number;           // AED
  dldFee: number;                // AED (4%)
  agentFee: number;              // AED (2%)
  valuationFees: number;         // AED
  furnishingCost: number;        // AED
  workingCapital: number;        // AED
  totalUpfrontCapital: number;   // AED
}
```

---

### Page 5: Five Year Investment Outcome
**File**: `PremiumReportFiveYearOutcome.tsx`  
**SVG**: `svg-premium-five-year.ts`

#### Components:
- **5-Year Projection Table**: Year-by-year breakdown
- **Cumulative Chart**: Line/area chart showing growth over time
- **Key Assumptions Box**: List of assumptions used in projections

#### Table Columns:
- Year (1-5)
- Annual Cash Flow (AED)
- Cumulative Cash Flow (AED)
- Equity Buildup (AED)
- Total Return (AED)
- Return on Investment (%)

#### Dynamic Data Points:
```typescript
{
  yearlyProjections: Array<{
    year: number;              // 1-5
    cashFlow: number;          // AED
    cumulativeCashFlow: number; // AED
    equityBuildup: number;     // AED
    totalReturn: number;       // AED
    roi: number;               // %
  }>;
  
  assumptions: {
    rentGrowth: number;        // % per year
    propertyAppreciation: number; // % per year
    vacancyRate: number;       // %
    maintenanceInflation: number; // %
  };
}
```

#### Chart Type:
- Dual-axis line chart
- Primary axis: Cash flow values
- Secondary axis: ROI percentage
- Legend clearly differentiates metrics

---

### Page 6: Rent Sensitivity Analysis
**File**: `PremiumReportRentSensitivity.tsx`  
**SVG**: `svg-premium-rent-sensitivity.ts`

#### Components:
- **Sensitivity Table**: Rent variations (-20% to +20%)
- **Multi-line Chart**: Impact on key metrics
- **Base Case Highlight**: Current scenario emphasized

#### Scenarios:
- -20% rent
- -10% rent
- Base case (0%)
- +10% rent
- +20% rent

#### Metrics Analyzed:
1. Annual Rental Income (AED)
2. Net Yield (%)
3. Monthly Cash Flow (AED)
4. Cash on Cash Return (%)

#### Dynamic Data Points:
```typescript
{
  scenarios: Array<{
    rentChange: number;          // % change (-20 to +20)
    annualIncome: number;        // AED
    netYield: number;            // %
    monthlyCashFlow: number;     // AED
    cashOnCashReturn: number;    // %
  }>;
  baseCase: {
    index: number;               // Which scenario is base (usually middle)
  };
}
```

---

### Page 7: Vacancy Rate Sensitivity
**File**: `PremiumReportVacancySensitivity.tsx`  
**SVG**: `svg-premium-vacancy-sensitivity.ts`

#### Components:
- **Sensitivity Table**: Vacancy rate variations (0% to 20%)
- **Multi-line Chart**: Impact visualization
- **Base Case Highlight**: Current vacancy assumption

#### Scenarios:
- 0% vacancy
- 5% vacancy
- 10% vacancy
- 15% vacancy
- 20% vacancy

#### Metrics Analyzed:
1. Effective Rental Income (AED)
2. Net Yield (%)
3. Monthly Cash Flow (AED)
4. Cash on Cash Return (%)

#### Dynamic Data Points:
```typescript
{
  scenarios: Array<{
    vacancyRate: number;         // % (0 to 20)
    effectiveIncome: number;     // AED
    netYield: number;            // %
    monthlyCashFlow: number;     // AED
    cashOnCashReturn: number;    // %
  }>;
  baseCase: {
    index: number;
  };
}
```

---

### Page 8: Interest Rate Sensitivity
**File**: `PremiumReportInterestSensitivity.tsx`  
**SVG**: `svg-premium-interest-sensitivity.ts`

#### Components:
- **Sensitivity Table**: Interest rate variations (3% to 7%)
- **Multi-line Chart**: Impact on payments and returns
- **Base Case Highlight**: Current interest rate

#### Scenarios:
- 3% interest
- 4% interest
- 5% interest
- 6% interest
- 7% interest

#### Metrics Analyzed:
1. Monthly Mortgage Payment (AED)
2. Net Yield (%)
3. Monthly Cash Flow (AED)
4. Cash on Cash Return (%)

#### Dynamic Data Points:
```typescript
{
  scenarios: Array<{
    interestRate: number;        // % (3 to 7)
    monthlyPayment: number;      // AED
    netYield: number;            // %
    monthlyCashFlow: number;     // AED
    cashOnCashReturn: number;    // %
  }>;
  baseCase: {
    index: number;
  };
}
```

---

### Page 9: Input and Assumption Verification
**File**: `PremiumReportInputVerification.tsx`  
**SVG**: `svg-premium-input-verification.ts`

#### Components:
- **Property Details Section**: All property inputs
- **Financing Details Section**: Mortgage parameters
- **Additional Context Section**: User-provided context

#### Property Details:
- Purchase Price (AED)
- Monthly Rent (AED)
- Bedrooms
- Bathrooms
- Property Size (sqft)
- Property Type

#### Financing Details:
- Down Payment (%)
- Loan Amount (AED)
- Interest Rate (%)
- Loan Term (years)

#### Additional Context:
- Property Reference Image (thumbnail with "View full image" link)
- Purchase Date (if provided)
- Additional Notes (if provided)

#### Dynamic Data Points:
```typescript
{
  // Property
  purchasePrice: number;
  monthlyRent: number;
  bedrooms: number;
  bathrooms: number;
  propertySize: number;
  propertyType: string;
  
  // Financing
  downPaymentPercent: number;
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  
  // Context
  propertyImageUrl?: string;
  purchaseDate?: string;
  notes?: string;
}
```

---

### Page 10: System Constants & Assumptions
**File**: `PremiumReportSystemConstants.tsx`  
**SVG**: `svg-premium-system-constants.ts`

#### Components:
- **Constants Table**: Fixed values used in calculations
- **Disclaimers Section**: Legal text
- **Report Metadata**: Version, date, copyright

#### System Constants:
- DLD Transfer Fee: 4%
- Agent Commission: 2%
- Service Charge: [varies by property, show actual]
- Annual Maintenance: 1% of property value
- Property Management: 5% of rental income
- Vacancy Reserve: 5%

#### Disclaimers:
- Investment risk disclaimer
- Calculation accuracy disclaimer
- Professional advice recommendation
- Data currency disclaimer

#### Report Metadata:
- Report Version: 1.0
- Generated Date: [timestamp]
- © 2025 YieldPulse. All rights reserved.

#### Dynamic Data Points:
```typescript
{
  constants: {
    dldFeePercent: 4;
    agentFeePercent: 2;
    serviceCharge: number;          // AED per year
    maintenancePercent: 1;
    managementPercent: 5;
    vacancyReservePercent: 5;
  };
  metadata: {
    version: string;                // "1.0"
    generatedDate: string;          // "15 January 2025 14:30 GMT+4"
  };
}
```

---

### Page 11: Mortgage Breakdown
**File**: `PremiumReportMortgageBreakdown.tsx`  
**SVG**: `svg-premium-mortgage.ts`

#### Components:
- **Loan Summary Box**: Key mortgage details
- **Payment Breakdown Chart**: Principal vs Interest pie/donut chart
- **First Year Schedule**: Monthly amortization table (12 months)

#### Loan Summary:
- Total Loan Amount (AED)
- Loan Term (years)
- Interest Rate (%)
- Monthly Payment (AED)
- Total Interest Paid Over Life (AED)

#### First Year Schedule Columns:
- Month (1-12)
- Payment (AED)
- Principal (AED)
- Interest (AED)
- Remaining Balance (AED)

#### Dynamic Data Points:
```typescript
{
  loanSummary: {
    loanAmount: number;            // AED
    loanTerm: number;              // years
    interestRate: number;          // %
    monthlyPayment: number;        // AED
    totalInterest: number;         // AED
  };
  firstYearSchedule: Array<{
    month: number;                 // 1-12
    payment: number;               // AED
    principal: number;             // AED
    interest: number;              // AED
    remainingBalance: number;      // AED
  }>;
}
```

---

## 🔧 Implementation Guide

### Step 1: Understand Current Structure
Review `/src/utils/pdfGenerator.ts` to understand:
- Data input structure (report object)
- Current jsPDF setup
- Font loading
- Image handling

### Step 2: Plan Page Generation
For each page:
1. Study the Figma design file
2. Identify all dynamic data points
3. Map data from report object to design placeholders
4. Plan chart generation strategy (jsPDF drawing or recharts snapshot)

### Step 3: Setup jsPDF Configuration
```typescript
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const pdf = new jsPDF({
  orientation: 'portrait',
  unit: 'pt',
  format: 'a4', // 595 x 842 pt
});

// Set fonts
pdf.setFont('Inter', 'normal');

// Define colors
const colors = {
  navy: '#1e2875',
  teal: '#14b8a6',
  black: '#1a1a1a',
  gray: '#666666',
  lightGray: '#999999',
};
```

### Step 4: Implement Each Page
Start with Page 1 (Cover) and work sequentially through Page 11 (Mortgage).

#### Example: Cover Page Implementation
```typescript
function generateCoverPage(pdf: jsPDF, report: Report) {
  // Add background gradient (if possible, or solid color)
  pdf.setFillColor(30, 40, 117); // Navy
  pdf.rect(0, 0, 595, 842, 'F');
  
  // Add property image
  if (report.propertyImageUrl) {
    // Fetch and embed image
    pdf.addImage(report.propertyImageUrl, 'JPEG', 50, 100, 495, 350);
  }
  
  // Add YieldPulse logo
  pdf.addImage(yieldPulseLogo, 'PNG', 50, 40, 120, 30);
  
  // Add report title
  pdf.setFontSize(24);
  pdf.setTextColor(255, 255, 255); // White
  pdf.text('Premium Investment Analysis Report', 297, 500, { align: 'center' });
  
  // Add property name
  pdf.setFontSize(32);
  pdf.setFont('Inter', 'bold');
  pdf.text(report.propertyName, 297, 550, { align: 'center' });
  
  // Add location
  pdf.setFontSize(16);
  pdf.setFont('Inter', 'normal');
  pdf.text(report.location, 297, 580, { align: 'center' });
  
  // Add generation date
  pdf.setFontSize(12);
  pdf.text(`Generated on ${report.generatedDate}`, 297, 800, { align: 'center' });
}
```

### Step 5: Chart Generation Strategy
For complex charts (waterfall, sensitivity analysis):
1. **Option A**: Use jsPDF drawing primitives (lines, rectangles, text)
2. **Option B**: Use Recharts to render chart, convert to canvas, export as image
3. **Option C**: Use a dedicated charting library compatible with jsPDF

Recommended: **Option A** for full control and consistency.

### Step 6: Testing Checklist
- [ ] All 11 pages generate without errors
- [ ] Data populates correctly in all fields
- [ ] Charts display accurately with proper scaling
- [ ] Property image loads and displays on cover
- [ ] Fonts render correctly (Inter family)
- [ ] Colors match brand (#1e2875, #14b8a6)
- [ ] Currency formatting is consistent (AED X,XXX,XXX)
- [ ] Percentage formatting is consistent (X.XX%)
- [ ] Page numbers are correct
- [ ] Headers/footers are consistent
- [ ] PDF file size is reasonable (<5MB)
- [ ] PDF is printable without cropping

---

## 🎯 Data Mapping Reference

### Report Object Structure
The complete report object passed to pdfGenerator.ts should include:

```typescript
interface Report {
  // Property info
  propertyName: string;
  location: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  propertySize: number; // sqft
  
  // Financial inputs
  purchasePrice: number;
  monthlyRent: number;
  downPaymentPercent: number;
  interestRate: number;
  loanTerm: number; // years
  serviceCharge: number; // annual
  
  // Calculated values
  grossYield: number;
  netYield: number;
  cashOnCashReturn: number;
  totalInitialInvestment: number;
  monthlyCashFlow: number;
  annualCashFlow: number;
  
  // Upfront costs
  downPayment: number;
  dldFee: number;
  agentFee: number;
  valuationFees: number;
  furnishingCost: number;
  workingCapital: number;
  totalUpfrontCapital: number;
  
  // Annual expenses
  annualMortgagePayments: number;
  annualServiceCharges: number;
  annualMaintenance: number;
  annualPropertyManagement: number;
  annualVacancyReserve: number;
  
  // 5-year projections
  yearlyProjections: Array<YearlyProjection>;
  
  // Sensitivity analysis
  rentSensitivity: Array<SensitivityScenario>;
  vacancySensitivity: Array<SensitivityScenario>;
  interestSensitivity: Array<SensitivityScenario>;
  
  // Mortgage details
  loanAmount: number;
  monthlyPayment: number;
  totalInterest: number;
  firstYearSchedule: Array<MortgagePayment>;
  
  // User context
  propertyImageUrl?: string;
  purchaseDate?: string;
  notes?: string;
  
  // Metadata
  generatedDate: string;
  reportVersion: string;
}
```

---

## 🚀 Quick Start Workflow

1. **Read this README completely**
2. **Study START_HERE_PREMIUM_DESIGNS.txt** for quick overview
3. **Open each PremiumReport*.tsx file** in order (1-11) to see designs
4. **Review current /src/utils/pdfGenerator.ts** to understand data flow
5. **Create a new branch** for the rebuild
6. **Implement page by page**, testing after each
7. **Compare output** with Figma designs for pixel-perfect match
8. **Test with real data** from various property scenarios
9. **Optimize performance** (PDF generation should be <3 seconds)
10. **Deploy and celebrate!** 🎉

---

## 📞 Support & References

### Related Files
- `/src/utils/pdfGenerator.ts` - Current implementation to rebuild
- `/src/types/report.ts` - Report type definitions
- `/src/pages/CalculatorPage.tsx` - Where reports are generated
- `/src/components/PropertyImageUpload.tsx` - Property image handling
- `/src/utils/calculations.ts` - Financial calculation logic

### External Libraries
- **jsPDF**: PDF generation library
- **jsPDF-AutoTable**: Table generation plugin
- **Recharts** (optional): Chart generation for canvas export

### Design Files Location
All 11 pages are in `/src/imports/`:
- PremiumReportCover.tsx
- PremiumReportPropertyDetails.tsx
- PremiumReportWaterfallChart.tsx
- PremiumReportCapitalRequirement.tsx
- PremiumReportFiveYearOutcome.tsx
- PremiumReportRentSensitivity.tsx
- PremiumReportVacancySensitivity.tsx
- PremiumReportInterestSensitivity.tsx
- PremiumReportInputVerification.tsx
- PremiumReportSystemConstants.tsx
- PremiumReportMortgageBreakdown.tsx

### SVG Assets Location
All corresponding SVG files are in `/src/imports/`:
- svg-premium-cover.ts
- svg-premium-property-details.ts
- svg-premium-waterfall.ts
- svg-premium-capital.ts
- svg-premium-five-year.ts
- svg-premium-rent-sensitivity.ts
- svg-premium-vacancy-sensitivity.ts
- svg-premium-interest-sensitivity.ts
- svg-premium-input-verification.ts
- svg-premium-system-constants.ts
- svg-premium-mortgage.ts

---

## ✅ File Rename Mapping

For reference, here's the complete rename mapping:

| Original File | New File Name | Purpose |
|--------------|---------------|---------|
| 1.tsx | PremiumReportCover.tsx | Cover page with branding |
| svg-lqpnukfy5i.ts | svg-premium-cover.ts | Cover page SVG assets |
| 2.tsx | PremiumReportPropertyDetails.tsx | Property specs & summary |
| svg-2a365f420m.ts | svg-premium-property-details.ts | Property details SVG |
| 3.tsx | PremiumReportWaterfallChart.tsx | Income/expense waterfall |
| svg-rq5nbv8igf.ts | svg-premium-waterfall.ts | Waterfall chart SVG |
| 4.tsx | PremiumReportCapitalRequirement.tsx | Upfront costs breakdown |
| svg-nv7uhfjv37.ts | svg-premium-capital.ts | Capital requirement SVG |
| 5.tsx | PremiumReportFiveYearOutcome.tsx | 5-year projections |
| svg-07pr5sck10.ts | svg-premium-five-year.ts | Five year outcome SVG |
| 6.tsx | PremiumReportRentSensitivity.tsx | Rent sensitivity analysis |
| svg-i1ongb566v.ts | svg-premium-rent-sensitivity.ts | Rent sensitivity SVG |
| 7.tsx | PremiumReportVacancySensitivity.tsx | Vacancy sensitivity |
| svg-0caz9fcofg.ts | svg-premium-vacancy-sensitivity.ts | Vacancy sensitivity SVG |
| 8.tsx | PremiumReportInterestSensitivity.tsx | Interest rate sensitivity |
| svg-lp3abpco2q.ts | svg-premium-interest-sensitivity.ts | Interest sensitivity SVG |
| 9.tsx | PremiumReportInputVerification.tsx | User input verification |
| svg-97vdql6d5b.ts | svg-premium-input-verification.ts | Input verification SVG |
| 10.tsx | PremiumReportSystemConstants.tsx | System constants & disclaimers |
| svg-zson8zmudx.ts | svg-premium-system-constants.ts | System constants SVG |
| 11.tsx | PremiumReportMortgageBreakdown.tsx | Mortgage amortization |
| svg-497l8u1z6s.ts | svg-premium-mortgage.ts | Mortgage breakdown SVG |

---

## 🎉 Ready to Build!

You now have everything you need to rebuild the Premium Report PDF generator with pixel-perfect accuracy matching the Figma designs. Good luck, and happy coding! 🚀

---

*Last updated: January 30, 2026*  
*YieldPulse Premium Report Design Package v1.0*
