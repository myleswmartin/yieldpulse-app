# Break-Even Occupancy Calculation Fix

## Problem Statement
The break-even occupancy calculation was using an incorrect formula that did not match the actual cash flow model used elsewhere in the application.

## Correct Model

### Income and Expense Definitions (as used elsewhere):
- Vacancy reduces gross rental income
- Property management fee is applied to **collected rent**, not gross potential rent
- Fixed operating costs (service charge + maintenance) do not scale with occupancy
- Mortgage cost is fixed

### Algebraic Derivation

**Annual Cash Flow Formula:**
```
CF = (R × O × (1 − M)) − F − L
```

Where:
- R = Gross Annual Rental Income
- O = Occupancy rate (0-1)
- M = Management fee percent (0-1)
- F = Fixed operating costs (service charge + maintenance)
- L = Annual mortgage payment

**Break-even occurs when CF = 0:**
```
(R × O × (1 − M)) − F − L = 0
R × O × (1 - M) = F + L
O = (F + L) / (R × (1 − M))
```

## Implementation

### File: `/src/utils/calculations.ts`

**Old Formula (INCORRECT):**
```typescript
const breakEvenOccupancyRate = Math.min(100, Math.max(0,
  ((fixedExpenses + annualMortgagePayment) / grossAnnualRentalIncome + inputs.propertyManagementFeePercent / 100) * 100
));
```

This formula was: `O = (F + L) / R + M` which is mathematically incorrect.

**New Formula (CORRECT):**
```typescript
const fixedExpenses = annualServiceCharge + annualMaintenanceCosts;
const managementFeeMultiplier = 1 - (inputs.propertyManagementFeePercent / 100);
const breakEvenOccupancyRate = Math.min(100, Math.max(0,
  ((fixedExpenses + annualMortgagePayment) / (grossAnnualRentalIncome * managementFeeMultiplier)) * 100
));
```

This implements: `O = (F + L) / (R × (1 - M))`

## Numeric Verification (Sample Report Data)

### Input Values:
- R (Gross Annual Rental Income) = 7,000 × 12 = 84,000 AED
- M (Management fee percent) = 5% = 0.05
- F (Fixed expenses) = 8,500 + 18,000 = 26,500 AED
- L (Annual mortgage payment) = 66,876 AED (calculated by mortgage function)

### Calculation:
```
Numerator (F + L) = 26,500 + 66,876 = 93,376 AED
Denominator (R × (1 - M)) = 84,000 × (1 - 0.05) = 84,000 × 0.95 = 79,800 AED
O = 93,376 / 79,800 = 1.17017...
O (as percent) = 117.02%
```

**Clamped result:** 100.0% (capped at maximum)

### Interpretation:
The break-even occupancy of 100% means this property cannot achieve positive cash flow through occupancy improvements alone at the current rent level. This makes sense given:
- High maintenance costs (1.5% of 1.2M = 18,000 AED/year)
- Moderate rent (7,000 AED/month)
- 75% loan-to-value with 5.5% interest rate

The property would need either:
1. Higher monthly rent (see breakEvenMonthlyRent for the required amount), OR
2. Lower operating costs, OR
3. Lower mortgage payments (larger down payment or lower interest rate)

## Updated Files

1. **`/src/utils/calculations.ts`**
   - Updated break-even occupancy formula with correct algebraic derivation
   - Added comprehensive comments explaining the formula

2. **`/src/utils/calculations.test.ts`**
   - Updated test to use the correct cash flow formula: `CF = (R × O × (1 - M)) - F - L`
   - Added tests to verify:
     - Cash flow ≈ 0 at break-even occupancy
     - Cash flow < 0 below break-even occupancy
     - Cash flow > 0 above break-even occupancy

3. **`/src/pages/SampleReportPage.tsx`**
   - Switched from hardcoded results to calculated results using `calculateROI()`
   - This ensures the Sample Report always shows mathematically correct values
   - Fixed field name mappings to match CalculationResults interface

4. **`/src/verify-breakeven.ts`** (NEW)
   - Created comprehensive verification script
   - Shows step-by-step calculation
   - Proves formula correctness with numeric examples

## Test Evidence

The updated test in `/src/utils/calculations.test.ts` verifies correctness:

```typescript
test('Break-even occupancy: cash flow = 0 at break-even rate', () => {
  // ... setup ...
  const results = calculateROI(inputs);
  
  // Calculate cash flow at break-even occupancy using correct formula:
  // CF = (R × O × (1 - M)) - F - L
  const R = results.grossAnnualRentalIncome;
  const O = results.breakEvenOccupancyRate / 100;
  const M = inputs.propertyManagementFeePercent / 100;
  const F = results.annualServiceCharge + results.annualMaintenanceCosts;
  const L = results.annualMortgagePayment;
  
  const cashFlowAtBreakEven = (R * O * (1 - M)) - F - L;
  
  // Cash flow should be approximately zero at break-even
  expect(Math.abs(cashFlowAtBreakEven)).toBeLessThan(100); // Within AED 100
  
  // Test that below break-even → negative cash flow
  const belowBreakEven = (R * (O - 0.05) * (1 - M)) - F - L;
  expect(belowBreakEven).toBeLessThan(0);
  
  // Test that above break-even → positive cash flow
  const aboveBreakEven = (R * (O + 0.05) * (1 - M)) - F - L;
  expect(aboveBreakEven).toBeGreaterThan(0);
});
```

## Summary

✅ **Formula Corrected:** Break-even occupancy now uses the algebraically correct formula  
✅ **Tested:** Automated tests verify cash flow = 0 at break-even  
✅ **Consistent:** Formula matches the cash flow model used throughout the application  
✅ **Documented:** Comprehensive comments explain the derivation  
✅ **Sample Report Updated:** Now uses calculated values instead of hardcoded data  

The break-even occupancy calculation is now mathematically sound and internally consistent with all other financial calculations in YieldPulse.
