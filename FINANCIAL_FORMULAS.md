# YieldPulse Financial Calculations - Formula Reference

## CRITICAL: All Formulas Used in Production

This document defines the exact mathematical formulas used by YieldPulse for all financial calculations.

---

## 1. BASIC MORTGAGE CALCULATIONS

### Loan Amount
```
Loan Amount = Purchase Price × (1 - Down Payment % / 100)
```

### Monthly Mortgage Payment
```
r = Annual Interest Rate / 12 / 100  (monthly rate as decimal)
n = Mortgage Term Years × 12  (total number of payments)

Monthly Payment = (Loan Amount × r × (1 + r)^n) / ((1 + r)^n - 1)
```

### Annual Mortgage Payment
```
Annual Mortgage Payment = Monthly Mortgage Payment × 12
```

---

## 2. UPFRONT COSTS

### DLD Fee
```
DLD Fee = Purchase Price × (DLD Fee % / 100)
```

### Agent Fee
```
Agent Fee = Purchase Price × (Agent Fee % / 100)
```

### Total Initial Investment
```
Total Initial Investment = Down Payment + DLD Fee + Agent Fee + Other Closing Costs
Other Closing Costs = AED 5,000 (fixed)
```

---

## 3. INCOME CALCULATIONS

### Gross Annual Rental Income
```
Gross Annual Rental Income = Expected Monthly Rent × 12
```

### Effective Annual Rental Income
```
Effective Annual Rental Income = Gross Annual Rental Income × (1 - Vacancy Rate % / 100)
```

---

## 4. ANNUAL OPERATING EXPENSES

### Annual Maintenance Costs
```
Annual Maintenance Costs = Purchase Price × (Annual Maintenance % / 100)
```

### Annual Property Management Fee
```
Annual Property Management Fee = Gross Annual Rental Income × (Property Management Fee % / 100)
```

### Total Annual Operating Expenses
```
Total Annual Operating Expenses = Annual Service Charge + Annual Maintenance Costs + Annual Property Management Fee
```

---

## 5. NET OPERATING INCOME (NOI)

```
Net Operating Income (NOI) = Effective Annual Rental Income - Total Annual Operating Expenses
```

---

## 6. CASH FLOW

### Annual Cash Flow
```
Annual Cash Flow = Net Operating Income - Annual Mortgage Payment
```

### Monthly Cash Flow
```
Monthly Cash Flow = Annual Cash Flow / 12
```

---

## 7. KEY RETURN METRICS

### Gross Rental Yield
```
Gross Rental Yield (%) = (Gross Annual Rental Income / Purchase Price) × 100
```

### Net Rental Yield
```
Net Rental Yield (%) = (Net Operating Income / Purchase Price) × 100
```

### Cash-on-Cash Return
```
Cash-on-Cash Return (%) = (Annual Cash Flow / Total Initial Investment) × 100
```

### Cap Rate
```
Cap Rate (%) = (Net Operating Income / Purchase Price) × 100
```
*Note: Cap Rate equals Net Rental Yield in this model*

---

## 8. BREAK-EVEN ANALYSIS

### Break-Even Occupancy Rate
**Definition:** The occupancy rate at which annual cash flow equals zero.

**Formula Derivation:**
```
Annual Cash Flow = (Gross Rent × Occupancy) - Fixed Expenses - (Gross Rent × Mgmt%) - Mortgage

Setting Cash Flow = 0 and solving for Occupancy:
Gross Rent × Occupancy - Gross Rent × Mgmt% = Fixed Expenses + Mortgage
Occupancy = (Fixed Expenses + Mortgage) / Gross Rent + Mgmt%

Where:
Fixed Expenses = Service Charge + Maintenance Costs
```

**Implementation:**
```
Break-Even Occupancy Rate (%) = MIN(100, MAX(0,
  ((Fixed Expenses + Annual Mortgage Payment) / Gross Annual Rental Income + Property Management Fee % / 100) × 100
))
```

**Realistic Range:** 60% - 90% for normal leveraged UAE properties

---

### Break-Even Monthly Rent
**Definition:** The monthly rent required to achieve zero annual cash flow at the assumed vacancy rate.

**Formula Derivation:**
```
Annual Cash Flow = (R × 12 × (1 - Vacancy%)) - Fixed Expenses - (R × 12 × Mgmt%) - Mortgage

Setting Cash Flow = 0 and solving for R:
R × 12 × (1 - Vacancy% - Mgmt%) = Fixed Expenses + Mortgage
R = (Fixed Expenses + Mortgage) / (12 × (1 - Vacancy% - Mgmt%))
```

**Implementation:**
```
Break-Even Monthly Rent = (Fixed Expenses + Annual Mortgage Payment) / (12 × (1 - Vacancy Rate % / 100 - Property Management Fee % / 100))
```

---

## 9. 5-YEAR PROJECTION CALCULATIONS

For each year `y` from 1 to 5:

### Property Value
```
Property Value(y) = Purchase Price × (1 + Capital Growth % / 100)^y
```

### Annual Rent
```
Annual Rent(y) = Gross Annual Rental Income(y=0) × (1 + Rent Growth % / 100)^y
```

### Effective Rental Income
```
Effective Rental Income(y) = Annual Rent(y) × (1 - Vacancy Rate % / 100)
```

### Operating Expenses
```
Operating Expenses(y) = Service Charge Annual
                      + Property Value(y) × (Annual Maintenance % / 100)
                      + Annual Rent(y) × (Property Management Fee % / 100)
```

### Net Operating Income (NOI)
```
NOI(y) = Effective Rental Income(y) - Operating Expenses(y)
```

### Remaining Loan Balance
```
p = payments made = y × 12
r = monthly interest rate
n = total number of payments

Remaining Balance(y) = Loan Amount × ((1 + r)^n - (1 + r)^p) / ((1 + r)^n - 1)
```

### Equity
```
Equity(y) = Property Value(y) - Remaining Loan Balance(y)
```

### Annual Cash Flow
```
Cash Flow(y) = NOI(y) - Annual Mortgage Payment
```

### Cumulative Cash Flow
```
Cumulative Cash Flow(y) = Σ Cash Flow(i) for i = 1 to y
```

### Sale Proceeds (Year 5 only)
```
Selling Agent Fee = Property Value(5) × 0.02  (2% selling fee)
Sale Proceeds = Property Value(5) - Remaining Loan Balance(5) - Selling Agent Fee
```

### Total Return (Year 5 only)
```
Total Return = Sale Proceeds + Cumulative Cash Flow(5) - Total Initial Investment
```

### ROI Percentage
```
ROI %(y) = (Total Return / Total Initial Investment) × 100
```

---

## 10. SENSITIVITY ANALYSIS

### Vacancy Rate Scenarios
For each vacancy rate `v` in [0%, 5%, 10%, 15%, 20%]:

```
Effective Income = Gross Annual Rental Income × (1 - v / 100)
Operating Expenses = Fixed Expenses + Property Management Fee
Annual Cash Flow = Effective Income - Operating Expenses - Annual Mortgage Payment
Cash-on-Cash Return = (Annual Cash Flow / Total Initial Investment) × 100
```

### Interest Rate Scenarios
For each rate delta `d` in [-2%, -1%, 0%, +1%, +2%]:

```
Adjusted Rate = Current Interest Rate + d
Monthly Rate = Adjusted Rate / 12 / 100
Recalculate Monthly Payment with adjusted rate
Annual Cash Flow = NOI - (Monthly Payment × 12)
Cash-on-Cash Return = (Annual Cash Flow / Total Initial Investment) × 100
```

### Rent Scenarios
For each rent delta `d` in [-20%, -10%, 0%, +10%, +20%]:

```
Adjusted Rent = Current Monthly Rent × (1 + d / 100)
Gross Income = Adjusted Rent × 12
Effective Income = Gross Income × (1 - Vacancy Rate % / 100)
Operating Expenses = Fixed Expenses + Gross Income × (Property Management Fee % / 100)
NOI = Effective Income - Operating Expenses
Annual Cash Flow = NOI - Annual Mortgage Payment
Cash-on-Cash Return = (Annual Cash Flow / Total Initial Investment) × 100
Gross Yield = (Gross Income / Purchase Price) × 100
```

---

## 11. INTERNAL CONSISTENCY CHECKS

### Monthly vs Annual Cash Flow
```
ASSERT: |Monthly Cash Flow × 12 - Annual Cash Flow| < AED 1
```

### Exit Scenario Reconciliation
```
Calculated Total Return = Sale Proceeds + Cumulative Cash Flow(5) - Total Initial Investment
ASSERT: |Calculated Total Return - Reported Total Return| < AED 1
```

### ROI Percentage Validation
```
Calculated ROI% = (Total Return / Total Initial Investment) × 100
ASSERT: |Calculated ROI% - Reported ROI%| < 0.01%
```

### Year 1 Projection Matches Core Calculations
```
ASSERT: |Year 1 Cash Flow - Annual Cash Flow| < AED 1,000
(Small difference acceptable due to rent growth calculation)
```

---

## 12. FORMATTING RULES

### Currency (AED)
- Format: `AED 1,234,567` (no decimals unless value < 1,000)
- Negative values: `(AED 1,234,567)` wrapped in parentheses
- Zero: `AED 0`
- Right-aligned in tables

### Percentages
- Precision: 2 decimal places if < 10%, else 1 decimal place
- Format: `6.50%` or `10.5%`
- Always include % symbol
- Right-aligned in tables
- Negative values: `-4.63%`

---

## 13. REALISTIC RANGES (Sample Scenario Targets)

### Inputs
- Purchase Price: AED 1,200,000
- Monthly Rent: AED 8,000 - 9,000
- Service Charge: AED 12,000 - 16,000/year
- Vacancy: ~5%
- Management: ~5%
- Maintenance: 1.0 - 1.5%
- LTV: 60 - 70% (down payment: 30 - 40%)
- Interest Rate: 5.0 - 5.75%
- Capital Growth: ~3%
- Rent Growth: ~2%

### Expected Outputs
- Gross Yield: 7 - 9%
- Net Yield: 4.5 - 6%
- Monthly Cash Flow: Near-neutral to positive (AED -200 to +800)
- Break-even Occupancy: 65 - 85%
- 5-Year Total ROI: 10 - 25%
- Annualized Return: 2 - 5%

---

## 14. EDGE CASES AND GUARDRAILS

### Zero Interest Rate (Cash Purchase)
```
IF Interest Rate = 0 THEN
  Monthly Mortgage Payment = 0
  Annual Mortgage Payment = 0
  Loan Amount = 0
  Cash Flow = NOI
```

### Break-Even Clamping
```
Break-Even Occupancy = MIN(100, MAX(0, calculated value))
```

### Invalid Number Handling
```
IF value is NaN or Infinite THEN
  Display "Data not available" or default value
  Continue rendering (don't crash)
```

---

## 15. TEST COVERAGE REQUIREMENTS

Minimum 10 deterministic tests covering:

1. ✓ Sample scenario with realistic positive outcome
2. ✓ Monthly × 12 ≈ Annual cash flow
3. ✓ Exit math reconciliation
4. ✓ Break-even occupancy validation
5. ✓ Break-even rent validation
6. ✓ Zero interest rate edge case
7. ✓ High vacancy scenario
8. ✓ Percentage scaling correctness
9. ✓ Year 1 projection matches core calculations
10. ✓ Formatting functions

All tests must PASS before production release.

---

**Document Version:** 1.0  
**Last Updated:** 2026-01-07  
**Maintained By:** Lead Engineer
