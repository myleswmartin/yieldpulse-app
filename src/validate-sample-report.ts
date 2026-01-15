/**
 * Validation Script for Sample Premium Report
 * 
 * This script runs the sample scenario and displays all key metrics
 * to verify financial correctness before sign-off.
 */

import { calculateROI, PropertyInputs, formatCurrency, formatPercent, formatAED } from './utils/calculations';

console.log('🔍 YieldPulse Sample Premium Report Validation');
console.log('='.repeat(70));
console.log('');

// Sample inputs (same as SamplePremiumReportPage)
const inputs: PropertyInputs = {
  propertyName: 'Sample Property - 1BR Apartment',
  propertyType: '1 Bedroom Apartment',
  location: 'Dubai Marina',
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

console.log('📊 INPUT PARAMETERS');
console.log('-'.repeat(70));
console.log(`Purchase Price:        ${formatCurrency(inputs.purchasePrice)}`);
console.log(`Down Payment:          ${inputs.downPaymentPercent}%`);
console.log(`Monthly Rent:          ${formatCurrency(inputs.expectedMonthlyRent)}`);
console.log(`Interest Rate:         ${inputs.mortgageInterestRate}%`);
console.log(`Mortgage Term:         ${inputs.mortgageTermYears} years`);
console.log(`Service Charge:        ${formatCurrency(inputs.serviceChargeAnnual)}/year`);
console.log(`Maintenance:           ${inputs.annualMaintenancePercent}% of value`);
console.log(`Property Mgmt Fee:     ${inputs.propertyManagementFeePercent}% of rent`);
console.log(`Vacancy Rate:          ${inputs.vacancyRatePercent}%`);
console.log(`Capital Growth:        ${inputs.capitalGrowthPercent}%/year`);
console.log(`Rent Growth:           ${inputs.rentGrowthPercent}%/year`);
console.log('');

const results = calculateROI(inputs);

console.log('💰 FINANCING');
console.log('-'.repeat(70));
console.log(`Loan Amount:           ${formatCurrency(results.loanAmount)}`);
console.log(`Down Payment:          ${formatCurrency(results.downPaymentAmount)}`);
console.log(`Monthly Payment:       ${formatCurrency(results.monthlyMortgagePayment)}`);
console.log(`Annual Payment:        ${formatCurrency(results.annualMortgagePayment)}`);
console.log('');

console.log('🏗️  UPFRONT COSTS');
console.log('-'.repeat(70));
console.log(`DLD Fee (4%):          ${formatCurrency(results.dldFee)}`);
console.log(`Agent Fee (2%):        ${formatCurrency(results.agentFee)}`);
console.log(`Other Costs:           ${formatCurrency(results.otherClosingCosts)}`);
console.log(`Total Upfront:         ${formatCurrency(results.totalUpfrontCosts)}`);
console.log(`Initial Investment:    ${formatCurrency(results.totalInitialInvestment)}`);
console.log('');

console.log('💵 ANNUAL INCOME & EXPENSES');
console.log('-'.repeat(70));
console.log(`Gross Rental Income:   ${formatCurrency(results.grossAnnualRentalIncome)}`);
console.log(`Less: Vacancy (${inputs.vacancyRatePercent}%):      ${formatCurrency(results.grossAnnualRentalIncome * inputs.vacancyRatePercent / 100)}`);
console.log(`Effective Income:      ${formatCurrency(results.effectiveAnnualRentalIncome)}`);
console.log('');
console.log(`Service Charge:        ${formatCurrency(results.annualServiceCharge)}`);
console.log(`Maintenance:           ${formatCurrency(results.annualMaintenanceCosts)}`);
console.log(`Property Mgmt:         ${formatCurrency(results.annualPropertyManagementFee)}`);
console.log(`Total Op Expenses:     ${formatCurrency(results.totalAnnualOperatingExpenses)}`);
console.log('');
console.log(`Net Operating Income:  ${formatCurrency(results.netOperatingIncome)}`);
console.log(`Less: Mortgage:        ${formatCurrency(results.annualMortgagePayment)}`);
console.log(`Annual Cash Flow:      ${formatCurrency(results.annualCashFlow)}`);
console.log(`Monthly Cash Flow:     ${formatCurrency(results.monthlyCashFlow)}`);
console.log('');

console.log('📈 KEY METRICS');
console.log('-'.repeat(70));
console.log(`Gross Rental Yield:    ${formatPercent(results.grossRentalYield)}`);
console.log(`Net Rental Yield:      ${formatPercent(results.netRentalYield)}`);
console.log(`Cash-on-Cash Return:   ${formatPercent(results.cashOnCashReturn)}`);
console.log(`Cap Rate:              ${formatPercent(results.capRate)}`);
console.log('');

console.log('⚖️  BREAK-EVEN ANALYSIS');
console.log('-'.repeat(70));
console.log(`Break-even Occupancy:  ${formatPercent(results.breakEvenOccupancyRate)}`);
console.log(`Break-even Rent:       ${formatCurrency(results.breakEvenMonthlyRent)}/month`);
console.log('');

console.log('🎯 5-YEAR OUTCOME');
console.log('-'.repeat(70));
const year5 = results.projection[4];
console.log(`Property Value (Y5):   ${formatCurrency(year5.propertyValue)}`);
console.log(`Loan Balance (Y5):     ${formatCurrency(year5.remainingLoanBalance)}`);
console.log(`Equity (Y5):           ${formatCurrency(year5.equity)}`);
console.log(`Cumulative Cash Flow:  ${formatCurrency(year5.cumulativeCashFlow)}`);
console.log('');
console.log(`Sale Proceeds:         ${formatCurrency(year5.saleProceeds)}`);
console.log(`Less: Initial Inv:     ${formatCurrency(results.totalInitialInvestment)}`);
console.log(`Total Wealth Created:  ${formatCurrency(year5.totalReturn)}`);
console.log(`Return on Investment:  ${formatPercent(year5.roiPercent)}`);
const annualized = year5.roiPercent / 5;
console.log(`Annualized Return:     ${formatPercent(annualized)}/year`);
console.log('');

console.log('🧮 RECONCILIATION CHECKS');
console.log('-'.repeat(70));
const monthlyAnnualized = results.monthlyCashFlow * 12;
const monthlyError = Math.abs(monthlyAnnualized - results.annualCashFlow);
console.log(`✓ Monthly × 12 = Annual CF:`);
console.log(`  ${formatCurrency(monthlyAnnualized)} ≈ ${formatCurrency(results.annualCashFlow)}`);
console.log(`  Error: ${formatCurrency(monthlyError)} (${monthlyError < 1 ? 'PASS' : 'FAIL'})`);
console.log('');

const calculatedReturn = year5.saleProceeds + year5.cumulativeCashFlow - results.totalInitialInvestment;
const returnError = Math.abs(calculatedReturn - year5.totalReturn);
console.log(`✓ Exit Math Reconciliation:`);
console.log(`  ${formatCurrency(year5.saleProceeds)} + ${formatCurrency(year5.cumulativeCashFlow)} - ${formatCurrency(results.totalInitialInvestment)} = ${formatCurrency(calculatedReturn)}`);
console.log(`  Reported: ${formatCurrency(year5.totalReturn)}`);
console.log(`  Error: ${formatCurrency(returnError)} (${returnError < 1 ? 'PASS' : 'FAIL'})`);
console.log('');

const calculatedROI = (year5.totalReturn / results.totalInitialInvestment) * 100;
const roiError = Math.abs(calculatedROI - year5.roiPercent);
console.log(`✓ ROI Percentage:`);
console.log(`  (${formatCurrency(year5.totalReturn)} / ${formatCurrency(results.totalInitialInvestment)}) × 100 = ${formatPercent(calculatedROI)}`);
console.log(`  Reported: ${formatPercent(year5.roiPercent)}`);
console.log(`  Error: ${roiError.toFixed(4)}% (${roiError < 0.01 ? 'PASS' : 'FAIL'})`);
console.log('');

console.log('✅ VALIDATION SUMMARY');
console.log('='.repeat(70));
console.log('Gross Yield:           ' + (results.grossRentalYield > 7 && results.grossRentalYield < 9 ? '✓ PASS' : '✗ FAIL') + ` (${formatPercent(results.grossRentalYield)})`);
console.log('Net Yield:             ' + (results.netRentalYield > 4 && results.netRentalYield < 7 ? '✓ PASS' : '✗ FAIL') + ` (${formatPercent(results.netRentalYield)})`);
console.log('Monthly Cash Flow:     ' + (results.monthlyCashFlow > 0 ? '✓ PASS' : '⚠ CAUTION') + ` (${formatCurrency(results.monthlyCashFlow)})`);
console.log('Break-even Occupancy:  ' + (results.breakEvenOccupancyRate > 60 && results.breakEvenOccupancyRate < 90 ? '✓ PASS' : '✗ FAIL') + ` (${formatPercent(results.breakEvenOccupancyRate)})`);
console.log('5-Year ROI:            ' + (year5.roiPercent > 10 && year5.roiPercent < 30 ? '✓ PASS' : '✗ FAIL') + ` (${formatPercent(year5.roiPercent)})`);
console.log('Internal Consistency:  ' + (monthlyError < 1 && returnError < 1 && roiError < 0.01 ? '✓ PASS' : '✗ FAIL'));
console.log('');
console.log('🎉 Validation complete. Review results above for sign-off.');
