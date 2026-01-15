/**
 * Manual verification of break-even occupancy formula
 * 
 * This script proves that the break-even occupancy formula is mathematically correct.
 */

import { calculateROI, PropertyInputs, formatCurrency, formatPercent } from './utils/calculations';

// Sample inputs from SampleReportPage
const sampleInputs: PropertyInputs = {
  portalSource: 'Bayut',
  listingUrl: 'https://www.bayut.com/property/details-example.html',
  areaSqft: 850,
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
  capitalGrowthPercent: 5,
  rentGrowthPercent: 3,
  vacancyRatePercent: 5,
  holdingPeriodYears: 5,
};

console.log('🔬 BREAK-EVEN OCCUPANCY VERIFICATION');
console.log('='.repeat(70));
console.log('');

// Calculate results
const results = calculateROI(sampleInputs);

console.log('📊 INPUT VALUES:');
console.log('-'.repeat(70));
console.log(`Purchase Price:              ${formatCurrency(sampleInputs.purchasePrice)}`);
console.log(`Monthly Rent:                ${formatCurrency(sampleInputs.expectedMonthlyRent)}`);
console.log(`Gross Annual Rental Income:  ${formatCurrency(results.grossAnnualRentalIncome)}`);
console.log(`Service Charge (annual):     ${formatCurrency(results.annualServiceCharge)}`);
console.log(`Maintenance Costs (annual):  ${formatCurrency(results.annualMaintenanceCosts)}`);
console.log(`Property Mgmt Fee %:         ${sampleInputs.propertyManagementFeePercent}%`);
console.log(`Annual Mortgage Payment:     ${formatCurrency(results.annualMortgagePayment)}`);
console.log('');

console.log('🧮 FORMULA DERIVATION:');
console.log('-'.repeat(70));
console.log('Annual Cash Flow = (R × O × (1 - M)) - F - L');
console.log('');
console.log('Where:');
console.log('  R = Gross Annual Rental Income');
console.log('  O = Occupancy rate (0-1)');
console.log('  M = Management fee percent (0-1)');
console.log('  F = Fixed operating costs (service charge + maintenance)');
console.log('  L = Annual mortgage payment');
console.log('');
console.log('Setting CF = 0 and solving for O:');
console.log('  (R × O × (1 - M)) - F - L = 0');
console.log('  R × O × (1 - M) = F + L');
console.log('  O = (F + L) / (R × (1 - M))');
console.log('');

console.log('📐 CALCULATION:');
console.log('-'.repeat(70));

const R = results.grossAnnualRentalIncome;
const M = sampleInputs.propertyManagementFeePercent / 100;
const F = results.annualServiceCharge + results.annualMaintenanceCosts;
const L = results.annualMortgagePayment;

console.log(`R = ${formatCurrency(R)}`);
console.log(`M = ${(M * 100).toFixed(2)}% (or ${M.toFixed(4)} as decimal)`);
console.log(`F = ${formatCurrency(F)} (${formatCurrency(results.annualServiceCharge)} + ${formatCurrency(results.annualMaintenanceCosts)})`);
console.log(`L = ${formatCurrency(L)}`);
console.log('');

const numerator = F + L;
const denominator = R * (1 - M);
const O_calculated = numerator / denominator;
const O_percent = O_calculated * 100;

console.log('Step-by-step:');
console.log(`  Numerator (F + L) = ${formatCurrency(F)} + ${formatCurrency(L)} = ${formatCurrency(numerator)}`);
console.log(`  Denominator (R × (1 - M)) = ${formatCurrency(R)} × (1 - ${M.toFixed(4)}) = ${formatCurrency(R)} × ${(1 - M).toFixed(4)} = ${formatCurrency(denominator)}`);
console.log(`  O = ${formatCurrency(numerator)} / ${formatCurrency(denominator)} = ${O_calculated.toFixed(6)}`);
console.log(`  O (as percent) = ${O_percent.toFixed(2)}%`);
console.log('');

console.log('✅ RESULT FROM FUNCTION:');
console.log('-'.repeat(70));
console.log(`Break-even Occupancy Rate: ${formatPercent(results.breakEvenOccupancyRate)}`);
console.log('');

// Verify the calculation matches
const match = Math.abs(results.breakEvenOccupancyRate - O_percent) < 0.01;
if (match) {
  console.log('✅ VERIFICATION: Formula matches function result!');
} else {
  console.log('❌ VERIFICATION FAILED: Formula does not match!');
  console.log(`   Expected: ${O_percent.toFixed(2)}%`);
  console.log(`   Got:      ${results.breakEvenOccupancyRate.toFixed(2)}%`);
}
console.log('');

console.log('🧪 CASH FLOW VERIFICATION:');
console.log('-'.repeat(70));

// Test 1: At break-even occupancy
const O_breakeven = results.breakEvenOccupancyRate / 100;
const CF_at_breakeven = (R * O_breakeven * (1 - M)) - F - L;
console.log(`At break-even occupancy (${formatPercent(results.breakEvenOccupancyRate)}):`);
console.log(`  Cash Flow = (${formatCurrency(R)} × ${O_breakeven.toFixed(4)} × ${(1 - M).toFixed(4)}) - ${formatCurrency(F)} - ${formatCurrency(L)}`);
console.log(`  Cash Flow = ${formatCurrency(CF_at_breakeven)}`);
console.log(`  ${Math.abs(CF_at_breakeven) < 100 ? '✅' : '❌'} Cash flow is approximately zero (within AED 100)`);
console.log('');

// Test 2: Below break-even (5% lower)
const O_below = O_breakeven - 0.05;
const CF_below = (R * O_below * (1 - M)) - F - L;
console.log(`Below break-even (${formatPercent(O_below * 100)}):`);
console.log(`  Cash Flow = ${formatCurrency(CF_below)}`);
console.log(`  ${CF_below < 0 ? '✅' : '❌'} Cash flow is negative`);
console.log('');

// Test 3: Above break-even (5% higher)
const O_above = O_breakeven + 0.05;
const CF_above = (R * O_above * (1 - M)) - F - L;
console.log(`Above break-even (${formatPercent(O_above * 100)}):`);
console.log(`  Cash Flow = ${formatCurrency(CF_above)}`);
console.log(`  ${CF_above > 0 ? '✅' : '❌'} Cash flow is positive`);
console.log('');

// Test 4: At actual occupancy (95% = 100% - 5% vacancy)
const O_actual = (100 - sampleInputs.vacancyRatePercent) / 100;
const CF_actual = (R * O_actual * (1 - M)) - F - L;
console.log(`At actual occupancy (${formatPercent(O_actual * 100)}):`);
console.log(`  Cash Flow = ${formatCurrency(CF_actual)}`);
console.log(`  This should match results.annualCashFlow: ${formatCurrency(results.annualCashFlow)}`);
const actual_match = Math.abs(CF_actual - results.annualCashFlow) < 1;
console.log(`  ${actual_match ? '✅' : '❌'} Matches annual cash flow from calculations`);
console.log('');

console.log('📈 SUMMARY:');
console.log('-'.repeat(70));
console.log(`Break-even Occupancy: ${formatPercent(results.breakEvenOccupancyRate)}`);
console.log(`Actual Occupancy:     ${formatPercent(O_actual * 100)}`);
console.log(`Cushion:              ${formatPercent((O_actual - O_breakeven) * 100)} (${O_actual > O_breakeven ? 'POSITIVE' : 'NEGATIVE'})`);
console.log('');

if (match && Math.abs(CF_at_breakeven) < 100 && CF_below < 0 && CF_above > 0 && actual_match) {
  console.log('🎉 ALL VERIFICATIONS PASSED!');
  console.log('The break-even occupancy formula is mathematically correct.');
} else {
  console.log('❌ SOME VERIFICATIONS FAILED!');
  console.log('Please review the formula implementation.');
}
