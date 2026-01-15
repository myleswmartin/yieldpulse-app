/**
 * VERIFICATION TEST - Sample Premium Report
 * This test validates the exact calculated values for the sample inputs
 */

import { calculateROI, PropertyInputs, formatCurrency, formatPercent } from './src/utils/calculations';

// Exact inputs from SamplePremiumReportPage.tsx
const sampleInputs: PropertyInputs = {
  propertyName: 'Sample Property - 1BR Apartment',
  propertyType: '1 Bedroom Apartment',
  location: 'Dubai Marina',
  areaSqft: 750,
  purchasePrice: 1200000,
  downPaymentPercent: 30,
  mortgageInterestRate: 5.0,
  mortgageTermYears: 25,
  expectedMonthlyRent: 8000,
  serviceChargeAnnual: 10000,
  annualMaintenancePercent: 1.0,
  propertyManagementFeePercent: 5,
  dldFeePercent: 4,
  agentFeePercent: 2,
  capitalGrowthPercent: 2,
  rentGrowthPercent: 2,
  vacancyRatePercent: 5,
  holdingPeriodYears: 5,
};

// Calculate using the engine
const results = calculateROI(sampleInputs);

console.log('\n' + '='.repeat(80));
console.log('SAMPLE PREMIUM REPORT - VERIFICATION TEST');
console.log('='.repeat(80));

console.log('\n📊 PURCHASE BREAKDOWN');
console.log('-'.repeat(80));
console.log(`Purchase Price:              ${formatCurrency(results.purchasePrice)}`);
console.log(`Down Payment (30%):          ${formatCurrency(results.downPaymentAmount)}`);
console.log(`Loan Amount (70%):           ${formatCurrency(results.loanAmount)}`);
console.log(`DLD Fee (4%):                ${formatCurrency(results.dldFee)}`);
console.log(`Agent Fee (2%):              ${formatCurrency(results.agentFee)}`);
console.log(`Total Cash Required:         ${formatCurrency(results.totalInitialInvestment)}`);

console.log('\n💰 ANNUAL CASH FLOW RECONCILIATION');
console.log('-'.repeat(80));
console.log(`Gross Annual Rent:           ${formatCurrency(results.grossAnnualRentalIncome)}`);
const vacancyAmount = results.grossAnnualRentalIncome * (sampleInputs.vacancyRatePercent / 100);
console.log(`Vacancy (5%):                (${formatCurrency(vacancyAmount)})`);
console.log(`Effective Rental Income:     ${formatCurrency(results.effectiveAnnualRentalIncome)}`);
console.log('');
const mgmtFee = results.grossAnnualRentalIncome * (sampleInputs.propertyManagementFeePercent / 100);
console.log(`Management Fee (5% of gross): (${formatCurrency(mgmtFee)})`);
console.log(`Service Charge:              (${formatCurrency(results.annualServiceCharge)})`);
console.log(`Maintenance (1%):            (${formatCurrency(results.annualMaintenanceCosts)})`);
const totalOpex = mgmtFee + results.annualServiceCharge + results.annualMaintenanceCosts;
console.log(`Total Operating Expenses:    (${formatCurrency(totalOpex)})`);
console.log('');
console.log(`Net Operating Income (NOI):  ${formatCurrency(results.netOperatingIncome)}`);
console.log('');
console.log(`Monthly Mortgage:            ${formatCurrency(results.monthlyMortgagePayment)}`);
console.log(`Annual Mortgage:             (${formatCurrency(results.annualMortgagePayment)})`);
console.log('');
console.log(`Annual Cash Flow:            ${formatCurrency(results.annualCashFlow)}`);
console.log(`Monthly Cash Flow:           ${formatCurrency(results.monthlyCashFlow)}`);

console.log('\n📈 KEY METRICS');
console.log('-'.repeat(80));
console.log(`Gross Rental Yield:          ${formatPercent(results.grossRentalYield)}`);
console.log(`Net Rental Yield:            ${formatPercent(results.netRentalYield)}`);
console.log(`Cap Rate:                    ${formatPercent(results.capRate)}`);
console.log(`Cash-on-Cash Return:         ${formatPercent(results.cashOnCashReturn)}`);

console.log('\n⚖️  BREAK-EVEN ANALYSIS');
console.log('-'.repeat(80));
console.log(`Break-even Occupancy (Raw):  ${formatPercent(results.breakEvenOccupancyRawPercent)}`);
console.log(`Break-even Occupancy (Display): ${formatPercent(results.breakEvenOccupancyRate)}`);
console.log(`Break-even Monthly Rent:     ${formatCurrency(results.breakEvenMonthlyRent)}`);

// Verify break-even calculation
const R = results.grossAnnualRentalIncome;
const M = sampleInputs.propertyManagementFeePercent / 100;
const F = results.annualServiceCharge + results.annualMaintenanceCosts;
const L = results.annualMortgagePayment;
const O = results.breakEvenOccupancyRawPercent / 100;

console.log('\nBreak-even Verification:');
const cashFlowAtBreakEven = (R * O * (1 - M)) - F - L;
console.log(`  CF at break-even occupancy: ${formatCurrency(cashFlowAtBreakEven)} (should be ≈ 0)`);

console.log('\n🚀 5-YEAR PROJECTION');
console.log('-'.repeat(80));
console.log('Year | Property Value | Monthly Rent | Annual CF | Total Return | ROI %');
console.log('-'.repeat(80));
results.projection.forEach((year, idx) => {
  const monthlyRent = (year.rentalIncome / 12).toFixed(0);
  console.log(
    `  ${idx + 1}  | ${formatCurrency(year.propertyValue).padEnd(15)} | ` +
    `${formatCurrency(Number(monthlyRent)).padEnd(13)} | ` +
    `${formatCurrency(year.cashFlow).padEnd(10)} | ` +
    `${formatCurrency(year.totalReturn).padEnd(13)} | ` +
    `${formatPercent(year.roiPercent)}`
  );
});

console.log('\n🎯 FINAL VERIFICATION AGAINST TARGETS');
console.log('-'.repeat(80));

const checks = [
  { metric: 'Gross Yield', target: '6.5 - 8.5%', actual: formatPercent(results.grossRentalYield), pass: results.grossRentalYield >= 6.5 && results.grossRentalYield <= 8.5 },
  { metric: 'Net Yield', target: '4.5 - 6.0%', actual: formatPercent(results.netRentalYield), pass: results.netRentalYield >= 4.5 && results.netRentalYield <= 6.0 },
  { metric: 'Monthly Cash Flow', target: 'AED 300 - 900', actual: formatCurrency(results.monthlyCashFlow), pass: results.monthlyCashFlow >= 300 && results.monthlyCashFlow <= 900 },
  { metric: 'Break-even Occupancy', target: '75 - 90%', actual: formatPercent(results.breakEvenOccupancyRawPercent), pass: results.breakEvenOccupancyRawPercent >= 75 && results.breakEvenOccupancyRawPercent <= 90 },
  { metric: '5-Year ROI', target: '12 - 25%', actual: formatPercent(results.projection[4].roiPercent), pass: results.projection[4].roiPercent >= 12 && results.projection[4].roiPercent <= 25 },
];

checks.forEach(check => {
  const status = check.pass ? '✅ PASS' : '❌ FAIL';
  console.log(`${check.metric.padEnd(25)} | ${check.target.padEnd(20)} | ${check.actual.padEnd(15)} | ${status}`);
});

const allPass = checks.every(c => c.pass);
console.log('\n' + '='.repeat(80));
console.log(allPass ? '✅ ALL TARGETS MET - PRODUCTION READY' : '❌ SOME TARGETS NOT MET - NEEDS ADJUSTMENT');
console.log('='.repeat(80) + '\n');
