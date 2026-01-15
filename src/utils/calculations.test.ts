/**
 * YieldPulse Financial Calculations Test Suite
 * 
 * CRITICAL: These tests verify the mathematical correctness of all financial calculations.
 * Any test failure is a RELEASE BLOCKER.
 * 
 * Test Coverage:
 * 1. Basic mortgage calculations
 * 2. Cash flow calculations
 * 3. Return metrics (yields, ROI)
 * 4. Break-even analysis
 * 5. 5-year projections
 * 6. Internal consistency checks
 * 7. Edge cases
 */

import { calculateROI, PropertyInputs, formatCurrency, formatPercent } from './calculations';

// Helper function to check if two numbers are approximately equal (within 0.01%)
function approxEqual(actual: number, expected: number, tolerance: number = 0.01): boolean {
  if (expected === 0) {
    return Math.abs(actual) < tolerance;
  }
  const percentDiff = Math.abs((actual - expected) / expected) * 100;
  return percentDiff < tolerance;
}

describe('YieldPulse Financial Calculations', () => {
  
  // Test 1: Sample scenario validation (realistic Dubai Marina apartment)
  test('Sample scenario: realistic positive outcome', () => {
    const inputs: PropertyInputs = {
      areaSqft: 750,
      purchasePrice: 1200000,
      downPaymentPercent: 35,
      mortgageInterestRate: 5.25,
      mortgageTermYears: 25,
      expectedMonthlyRent: 8500,
      serviceChargeAnnual: 13500,
      annualMaintenancePercent: 1.0,
      propertyManagementFeePercent: 5,
      dldFeePercent: 4,
      agentFeePercent: 2,
      capitalGrowthPercent: 3,
      rentGrowthPercent: 2,
      vacancyRatePercent: 5,
      holdingPeriodYears: 5,
    };

    const results = calculateROI(inputs);

    // Basic calculations
    expect(results.loanAmount).toBe(780000); // 65% LTV
    expect(results.downPaymentAmount).toBe(420000); // 35%
    expect(results.grossAnnualRentalIncome).toBe(102000); // 8500 * 12

    // Verify gross yield is realistic (7-9% range)
    expect(results.grossRentalYield).toBeGreaterThan(7);
    expect(results.grossRentalYield).toBeLessThan(9);
    console.log(`Gross yield: ${formatPercent(results.grossRentalYield)}`);

    // Verify net yield is realistic (4.5-6% range)
    expect(results.netRentalYield).toBeGreaterThan(4);
    expect(results.netRentalYield).toBeLessThan(7);
    console.log(`Net yield: ${formatPercent(results.netRentalYield)}`);

    // Verify monthly cash flow is positive or near-neutral
    expect(results.monthlyCashFlow).toBeGreaterThan(-500);
    console.log(`Monthly cash flow: ${formatCurrency(results.monthlyCashFlow)}`);

    // Verify 5-year ROI is positive and realistic (10-25% total)
    const year5ROI = results.projection[4].roiPercent;
    expect(year5ROI).toBeGreaterThan(5);
    expect(year5ROI).toBeLessThan(35);
    console.log(`5-year ROI: ${formatPercent(year5ROI)}`);

    // Verify break-even occupancy is realistic (65-85%)
    expect(results.breakEvenOccupancyRate).toBeGreaterThan(60);
    expect(results.breakEvenOccupancyRate).toBeLessThan(90);
    console.log(`Break-even occupancy: ${formatPercent(results.breakEvenOccupancyRate)}`);
  });

  // Test 2: Internal consistency - Monthly vs Annual cash flow
  test('Internal consistency: monthly cash flow × 12 ≈ annual cash flow', () => {
    const inputs: PropertyInputs = {
      areaSqft: 750,
      purchasePrice: 1200000,
      downPaymentPercent: 30,
      mortgageInterestRate: 5.5,
      mortgageTermYears: 25,
      expectedMonthlyRent: 8000,
      serviceChargeAnnual: 12000,
      annualMaintenancePercent: 1.0,
      propertyManagementFeePercent: 5,
      dldFeePercent: 4,
      agentFeePercent: 2,
      capitalGrowthPercent: 3,
      rentGrowthPercent: 2,
      vacancyRatePercent: 5,
      holdingPeriodYears: 5,
    };

    const results = calculateROI(inputs);
    const monthlyAnnualized = results.monthlyCashFlow * 12;
    
    expect(approxEqual(monthlyAnnualized, results.annualCashFlow, 0.1)).toBe(true);
    console.log(`Monthly × 12: ${formatCurrency(monthlyAnnualized)}, Annual: ${formatCurrency(results.annualCashFlow)}`);
  });

  // Test 3: Exit scenario reconciliation
  test('Exit scenario: sale proceeds + cumulative CF - initial = total return', () => {
    const inputs: PropertyInputs = {
      areaSqft: 800,
      purchasePrice: 1500000,
      downPaymentPercent: 30,
      mortgageInterestRate: 5.0,
      mortgageTermYears: 25,
      expectedMonthlyRent: 9000,
      serviceChargeAnnual: 15000,
      annualMaintenancePercent: 1.0,
      propertyManagementFeePercent: 5,
      dldFeePercent: 4,
      agentFeePercent: 2,
      capitalGrowthPercent: 3,
      rentGrowthPercent: 2,
      vacancyRatePercent: 5,
      holdingPeriodYears: 5,
    };

    const results = calculateROI(inputs);
    const year5 = results.projection[4];
    
    // Calculate expected total return
    const expectedTotalReturn = year5.saleProceeds + year5.cumulativeCashFlow - results.totalInitialInvestment;
    
    expect(approxEqual(year5.totalReturn, expectedTotalReturn, 0.01)).toBe(true);
    console.log(`Total return: ${formatCurrency(year5.totalReturn)}, Expected: ${formatCurrency(expectedTotalReturn)}`);
    
    // Verify ROI percentage matches
    const expectedROI = (year5.totalReturn / results.totalInitialInvestment) * 100;
    expect(approxEqual(year5.roiPercent, expectedROI, 0.01)).toBe(true);
    console.log(`ROI%: ${formatPercent(year5.roiPercent)}, Expected: ${formatPercent(expectedROI)}`);
  });

  // Test 4: Break-even occupancy validation (case: raw < 100%)
  test('Break-even occupancy: cash flow = 0 at break-even rate (achievable case)', () => {
    const inputs: PropertyInputs = {
      areaSqft: 750,
      purchasePrice: 1200000,
      downPaymentPercent: 30,
      mortgageInterestRate: 5.0,
      mortgageTermYears: 25,
      expectedMonthlyRent: 8000,
      serviceChargeAnnual: 7500,
      annualMaintenancePercent: 1.0,
      propertyManagementFeePercent: 5,
      dldFeePercent: 4,
      agentFeePercent: 2,
      capitalGrowthPercent: 3,
      rentGrowthPercent: 2,
      vacancyRatePercent: 5,
      holdingPeriodYears: 5,
    };

    const results = calculateROI(inputs);
    
    // Verify raw break-even is within 0-100%
    expect(results.breakEvenOccupancyRawPercent).toBeGreaterThan(0);
    expect(results.breakEvenOccupancyRawPercent).toBeLessThanOrEqual(100);
    console.log(`Break-even occupancy (raw): ${formatPercent(results.breakEvenOccupancyRawPercent)}`);
    
    // Calculate cash flow at break-even occupancy using correct formula:
    // CF = (R × O × (1 - M)) - F - L
    const R = results.grossAnnualRentalIncome;
    const O = results.breakEvenOccupancyRawPercent / 100;
    const M = inputs.propertyManagementFeePercent / 100;
    const F = results.annualServiceCharge + results.annualMaintenanceCosts;
    const L = results.annualMortgagePayment;
    
    const cashFlowAtBreakEven = (R * O * (1 - M)) - F - L;
    
    // Cash flow should be approximately zero at break-even
    expect(Math.abs(cashFlowAtBreakEven)).toBeLessThan(100); // Within AED 100
    console.log(`Cash flow at break-even occupancy: ${formatCurrency(cashFlowAtBreakEven)}`);
    
    // Test that below break-even → negative cash flow
    const belowBreakEven = (R * (O - 0.05) * (1 - M)) - F - L;
    expect(belowBreakEven).toBeLessThan(0);
    console.log(`Cash flow at 5% below break-even: ${formatCurrency(belowBreakEven)}`);
    
    // Test that above break-even → positive cash flow
    const aboveBreakEven = (R * (O + 0.05) * (1 - M)) - F - L;
    expect(aboveBreakEven).toBeGreaterThan(0);
    console.log(`Cash flow at 5% above break-even: ${formatCurrency(aboveBreakEven)}`);
  });

  // Test 4b: Break-even occupancy validation (case: raw > 100%)
  test('Break-even occupancy: not achievable when raw > 100%', () => {
    const inputs: PropertyInputs = {
      areaSqft: 750,
      purchasePrice: 1200000,
      downPaymentPercent: 25,
      mortgageInterestRate: 5.5,
      mortgageTermYears: 25,
      expectedMonthlyRent: 7000,
      serviceChargeAnnual: 8500,
      annualMaintenancePercent: 1.5,
      propertyManagementFeePercent: 5,
      dldFeePercent: 4,
      agentFeePercent: 2,
      capitalGrowthPercent: 3,
      rentGrowthPercent: 2,
      vacancyRatePercent: 5,
      holdingPeriodYears: 5,
    };

    const results = calculateROI(inputs);
    
    // Verify raw break-even is above 100%
    expect(results.breakEvenOccupancyRawPercent).toBeGreaterThan(100);
    console.log(`Break-even occupancy (raw): ${formatPercent(results.breakEvenOccupancyRawPercent)} - NOT ACHIEVABLE`);
    
    // Verify display value is clamped to 100
    expect(results.breakEvenOccupancyRate).toBe(100);
    
    // Calculate cash flow at 100% occupancy using correct formula:
    // CF = (R × O × (1 - M)) - F - L
    const R = results.grossAnnualRentalIncome;
    const O_max = 1.0; // 100% occupancy
    const M = inputs.propertyManagementFeePercent / 100;
    const F = results.annualServiceCharge + results.annualMaintenanceCosts;
    const L = results.annualMortgagePayment;
    
    const cashFlowAt100 = (R * O_max * (1 - M)) - F - L;
    
    // Cash flow at 100% occupancy must be negative
    expect(cashFlowAt100).toBeLessThan(0);
    console.log(`Cash flow at 100% occupancy: ${formatCurrency(cashFlowAt100)} (NEGATIVE as expected)`);
    
    // This property cannot break even at any occupancy level
    console.log(`Property requires ${formatPercent(results.breakEvenOccupancyRawPercent)} occupancy, which is impossible`);
  });

  // Test 5: Break-even rent validation
  test('Break-even rent: cash flow = 0 at break-even rent', () => {
    const inputs: PropertyInputs = {
      areaSqft: 750,
      purchasePrice: 1200000,
      downPaymentPercent: 30,
      mortgageInterestRate: 5.5,
      mortgageTermYears: 25,
      expectedMonthlyRent: 8000,
      serviceChargeAnnual: 12000,
      annualMaintenancePercent: 1.0,
      propertyManagementFeePercent: 5,
      dldFeePercent: 4,
      agentFeePercent: 2,
      capitalGrowthPercent: 3,
      rentGrowthPercent: 2,
      vacancyRatePercent: 5,
      holdingPeriodYears: 5,
    };

    const results = calculateROI(inputs);
    
    // Calculate cash flow at break-even rent
    const breakEvenAnnualRent = results.breakEvenMonthlyRent * 12;
    const effectiveRent = breakEvenAnnualRent * (1 - inputs.vacancyRatePercent / 100);
    const fixedExpenses = results.annualServiceCharge + results.annualMaintenanceCosts;
    const mgmtFee = breakEvenAnnualRent * (inputs.propertyManagementFeePercent / 100);
    const cashFlowAtBreakEven = effectiveRent - fixedExpenses - mgmtFee - results.annualMortgagePayment;
    
    // Cash flow should be approximately zero at break-even
    expect(Math.abs(cashFlowAtBreakEven)).toBeLessThan(100); // Within AED 100
    console.log(`Cash flow at break-even rent: ${formatCurrency(cashFlowAtBreakEven)}`);
    
    // Break-even rent should be positive
    expect(results.breakEvenMonthlyRent).toBeGreaterThan(0);
  });

  // Test 6: Zero interest rate edge case
  test('Edge case: zero interest rate (cash purchase)', () => {
    const inputs: PropertyInputs = {
      areaSqft: 750,
      purchasePrice: 1200000,
      downPaymentPercent: 100, // Cash purchase
      mortgageInterestRate: 0,
      mortgageTermYears: 25,
      expectedMonthlyRent: 8000,
      serviceChargeAnnual: 12000,
      annualMaintenancePercent: 1.0,
      propertyManagementFeePercent: 5,
      dldFeePercent: 4,
      agentFeePercent: 2,
      capitalGrowthPercent: 3,
      rentGrowthPercent: 2,
      vacancyRatePercent: 5,
      holdingPeriodYears: 5,
    };

    const results = calculateROI(inputs);
    
    expect(results.loanAmount).toBe(0);
    expect(results.monthlyMortgagePayment).toBe(0);
    expect(results.annualMortgagePayment).toBe(0);
    
    // Cash flow should equal NOI (no mortgage)
    expect(approxEqual(results.annualCashFlow, results.netOperatingIncome, 0.01)).toBe(true);
    console.log(`Cash purchase - Annual CF: ${formatCurrency(results.annualCashFlow)}`);
  });

  // Test 7: High vacancy scenario
  test('Edge case: high vacancy rate (20%)', () => {
    const inputs: PropertyInputs = {
      areaSqft: 750,
      purchasePrice: 1200000,
      downPaymentPercent: 30,
      mortgageInterestRate: 5.5,
      mortgageTermYears: 25,
      expectedMonthlyRent: 8000,
      serviceChargeAnnual: 12000,
      annualMaintenancePercent: 1.0,
      propertyManagementFeePercent: 5,
      dldFeePercent: 4,
      agentFeePercent: 2,
      capitalGrowthPercent: 3,
      rentGrowthPercent: 2,
      vacancyRatePercent: 20, // High vacancy
      holdingPeriodYears: 5,
    };

    const results = calculateROI(inputs);
    
    // Effective rental income should be 80% of gross
    const expectedEffective = results.grossAnnualRentalIncome * 0.8;
    expect(approxEqual(results.effectiveAnnualRentalIncome, expectedEffective, 0.01)).toBe(true);
    
    console.log(`High vacancy - Annual CF: ${formatCurrency(results.annualCashFlow)}`);
  });

  // Test 8: Percentage scaling correctness
  test('Percentage scaling: yields are in percentage form (not decimal)', () => {
    const inputs: PropertyInputs = {
      areaSqft: 750,
      purchasePrice: 1200000,
      downPaymentPercent: 30,
      mortgageInterestRate: 5.5,
      mortgageTermYears: 25,
      expectedMonthlyRent: 8000,
      serviceChargeAnnual: 12000,
      annualMaintenancePercent: 1.0,
      propertyManagementFeePercent: 5,
      dldFeePercent: 4,
      agentFeePercent: 2,
      capitalGrowthPercent: 3,
      rentGrowthPercent: 2,
      vacancyRatePercent: 5,
      holdingPeriodYears: 5,
    };

    const results = calculateROI(inputs);
    
    // Gross yield should be in 6-9% range (not 0.06-0.09)
    expect(results.grossRentalYield).toBeGreaterThan(5);
    expect(results.grossRentalYield).toBeLessThan(15);
    
    // Net yield should be in 3-6% range
    expect(results.netRentalYield).toBeGreaterThan(2);
    expect(results.netRentalYield).toBeLessThan(10);
    
    console.log(`Gross yield: ${formatPercent(results.grossRentalYield)}`);
    console.log(`Net yield: ${formatPercent(results.netRentalYield)}`);
  });

  // Test 9: Year 1 projection matches core calculations
  test('Year 1 projection matches core annual calculations', () => {
    const inputs: PropertyInputs = {
      areaSqft: 750,
      purchasePrice: 1200000,
      downPaymentPercent: 30,
      mortgageInterestRate: 5.5,
      mortgageTermYears: 25,
      expectedMonthlyRent: 8000,
      serviceChargeAnnual: 12000,
      annualMaintenancePercent: 1.0,
      propertyManagementFeePercent: 5,
      dldFeePercent: 4,
      agentFeePercent: 2,
      capitalGrowthPercent: 3,
      rentGrowthPercent: 2,
      vacancyRatePercent: 5,
      holdingPeriodYears: 5,
    };

    const results = calculateROI(inputs);
    const year1 = results.projection[0];
    
    // Year 1 cash flow should approximately match annual cash flow
    // (slight differences due to growth calculations)
    const difference = Math.abs(year1.cashFlow - results.annualCashFlow);
    expect(difference).toBeLessThan(1000); // Within AED 1,000
    
    console.log(`Core annual CF: ${formatCurrency(results.annualCashFlow)}, Year 1 CF: ${formatCurrency(year1.cashFlow)}`);
  });

  // Test 10: Formatting functions
  test('Formatting: currency and percentage display', () => {
    // Currency formatting
    expect(formatCurrency(1234567)).toBe('AED 1,234,567');
    expect(formatCurrency(-1234567)).toBe('(AED 1,234,567)');
    expect(formatCurrency(0)).toBe('AED 0');
    
    // Percentage formatting
    expect(formatPercent(6.5)).toBe('6.50%');
    expect(formatPercent(6.567, 2)).toBe('6.57%');
    expect(formatPercent(10.5)).toBe('10.5%');
    expect(formatPercent(-4.63)).toBe('-4.63%');
    
    console.log('Formatting tests passed');
  });
});

// Run all tests and report
console.log('🧪 YieldPulse Financial Calculations Test Suite');
console.log('=' .repeat(60));