# Premium Report Design Files - Rename Mapping

## Status: FILES RENAMED ✓

All premium report design files have been organized with descriptive names for easier implementation.

## Complete File Mapping

### Page 1: Cover Page
- **Original**: `1.tsx` → **New**: `PremiumReportCover.tsx`
- **Original**: `svg-lqpnukfy5i.ts` → **New**: `svg-premium-cover.ts`
- **Import Update**: Line 1 changed from `import svgPaths from "./svg-lqpnukfy5i";` to `import svgPaths from "./svg-premium-cover";`

### Page 2: Property Details & Executive Summary
- **Original**: `2.tsx` → **New**: `PremiumReportPropertyDetails.tsx`
- **Original**: `svg-2a365f420m.ts` → **New**: `svg-premium-property-details.ts`
- **Import Update**: Line 1 updated to `import svgPaths from "./svg-premium-property-details";`

### Page 3: Income & Expense Waterfall Chart
- **Original**: `3.tsx` → **New**: `PremiumReportWaterfallChart.tsx`
- **Original**: `svg-rq5nbv8igf.ts` → **New**: `svg-premium-waterfall.ts`
- **Import Update**: Line 1 updated to `import svgPaths from "./svg-premium-waterfall";`

### Page 4: Upfront Capital Requirement
- **Original**: `4.tsx` → **New**: `PremiumReportCapitalRequirement.tsx`
- **Original**: `svg-nv7uhfjv37.ts` → **New**: `svg-premium-capital.ts`
- **Import Update**: Line 1 updated to `import svgPaths from "./svg-premium-capital";`

### Page 5: Five Year Investment Outcome
- **Original**: `5.tsx` → **New**: `PremiumReportFiveYearOutcome.tsx`
- **Original**: `svg-07pr5sck10.ts` → **New**: `svg-premium-five-year.ts`
- **Import Update**: Line 1 updated to `import svgPaths from "./svg-premium-five-year";`

### Page 6: Rent Sensitivity Analysis
- **Original**: `6.tsx` → **New**: `PremiumReportRentSensitivity.tsx`
- **Original**: `svg-i1ongb566v.ts` → **New**: `svg-premium-rent-sensitivity.ts`
- **Import Update**: Line 1 updated to `import svgPaths from "./svg-premium-rent-sensitivity";`

### Page 7: Vacancy Rate Sensitivity
- **Original**: `7.tsx` → **New**: `PremiumReportVacancySensitivity.tsx`
- **Original**: `svg-0caz9fcofg.ts` → **New**: `svg-premium-vacancy-sensitivity.ts`
- **Import Update**: Line 1 updated to `import svgPaths from "./svg-premium-vacancy-sensitivity";`

### Page 8: Interest Rate Sensitivity
- **Original**: `8.tsx` → **New**: `PremiumReportInterestSensitivity.tsx`
- **Original**: `svg-lp3abpco2q.ts` → **New**: `svg-premium-interest-sensitivity.ts`
- **Import Update**: Line 1 updated to `import svgPaths from "./svg-premium-interest-sensitivity";`

### Page 9: Input and Assumption Verification
- **Original**: `9.tsx` → **New**: `PremiumReportInputVerification.tsx`
- **Original**: `svg-97vdql6d5b.ts` → **New**: `svg-premium-input-verification.ts`
- **Import Update**: Line 1 updated to `import svgPaths from "./svg-premium-input-verification";`

### Page 10: System Constants & Assumptions
- **Original**: `10.tsx` → **New**: `PremiumReportSystemConstants.tsx`
- **Original**: `svg-zson8zmudx.ts` → **New**: `svg-premium-system-constants.ts`
- **Import Update**: Line 1 updated to `import svgPaths from "./svg-premium-system-constants";`

### Page 11: Mortgage Breakdown
- **Original**: `11.tsx` → **New**: `PremiumReportMortgageBreakdown.tsx`
- **Original**: `svg-497l8u1z6s.ts` → **New**: `svg-premium-mortgage.ts`
- **Import Update**: Line 1 updated to `import svgPaths from "./svg-premium-mortgage";`

---

## Implementation Reference

When implementing `/src/utils/pdfGenerator.ts`, reference these files in order:

1. **PremiumReportCover.tsx** - Cover page design
2. **PremiumReportPropertyDetails.tsx** - Property specs and executive summary
3. **PremiumReportWaterfallChart.tsx** - Income/expense waterfall visualization
4. **PremiumReportCapitalRequirement.tsx** - Upfront costs breakdown
5. **PremiumReportFiveYearOutcome.tsx** - 5-year projections table
6. **PremiumReportRentSensitivity.tsx** - Rent sensitivity analysis
7. **PremiumReportVacancySensitivity.tsx** - Vacancy sensitivity analysis
8. **PremiumReportInterestSensitivity.tsx** - Interest rate sensitivity
9. **PremiumReportInputVerification.tsx** - Input verification page
10. **PremiumReportSystemConstants.tsx** - Constants and disclaimers
11. **PremiumReportMortgageBreakdown.tsx** - Mortgage amortization schedule

---

## Quick Import Example

```typescript
// When studying designs for PDF implementation
import PremiumCover from '@/imports/PremiumReportCover';
import PremiumDetails from '@/imports/PremiumReportPropertyDetails';
// ... etc
```

**Note**: These are reference files only - do not import them directly into the PDF generator. Study the layouts and recreate them using jsPDF.

---

## Files NOT Renamed (Comparison Reports)

The following files belong to the comparison report feature and remain unchanged:

- `A41.tsx` → Comparison Cover
- `A42.tsx` → Comparison Summary
- `A43.tsx` → Comparison Charts
- `A44.tsx` → Comparison Cash Flow
- `A46.tsx` → Comparison Risk Profiles
- `A4I5.tsx` → Comparison Decision Helper
- Their associated SVG files

See `START_HERE_COMPARISON_DESIGNS.txt` for comparison report documentation.

---

## Summary

- ✅ 11 Premium Report TSX files renamed
- ✅ 11 Premium Report SVG files renamed
- ✅ All import statements updated
- ✅ Comprehensive documentation created
- ✅ Ready for `/src/utils/pdfGenerator.ts` implementation

---

*Last updated: January 30, 2026*
