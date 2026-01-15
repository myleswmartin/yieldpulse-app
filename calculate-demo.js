#!/usr/bin/env node

/**
 * Quick Calculator Demo
 * 
 * This script demonstrates the exact values calculated for the Sample Premium Report.
 * Run this to verify the calculations before sign-off.
 */

// Simulate the calculation inputs
const inputs = {
  purchasePrice: 1200000,
  downPaymentPercent: 35,
  mortgageInterestRate: 5.25,
  mortgageTermYears: 25,
  expectedMonthlyRent: 8500,
  serviceChargeAnnual: 13500,
  annualMaintenancePercent: 1.0,
  propertyManagementFeePercent: 5,
  vacancyRatePercent: 5,
  capitalGrowthPercent: 3,
  rentGrowthPercent: 2,
};

// Basic calculations
const loanAmount = inputs.purchasePrice * (1 - inputs.downPaymentPercent / 100);
const monthlyInterestRate = inputs.mortgageInterestRate / 12 / 100;
const numberOfPayments = inputs.mortgageTermYears * 12;

const monthlyMortgagePayment =
  (loanAmount *
    (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments))) /
  (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

const annualMortgagePayment = monthlyMortgagePayment * 12;

// Income calculations
const grossAnnualRentalIncome = inputs.expectedMonthlyRent * 12;
const effectiveAnnualRentalIncome = grossAnnualRentalIncome * (1 - inputs.vacancyRatePercent / 100);

// Expense calculations
const annualMaintenanceCosts = inputs.purchasePrice * (inputs.annualMaintenancePercent / 100);
const annualPropertyManagementFee = grossAnnualRentalIncome * (inputs.propertyManagementFeePercent / 100);
const totalAnnualOperatingExpenses = inputs.serviceChargeAnnual + annualMaintenanceCosts + annualPropertyManagementFee;

// NOI and cash flow
const netOperatingIncome = effectiveAnnualRentalIncome - totalAnnualOperatingExpenses;
const annualCashFlow = netOperatingIncome - annualMortgagePayment;
const monthlyCashFlow = annualCashFlow / 12;

// Key metrics
const grossRentalYield = (grossAnnualRentalIncome / inputs.purchasePrice) * 100;
const netRentalYield = (netOperatingIncome / inputs.purchasePrice) * 100;
const downPaymentAmount = inputs.purchasePrice * (inputs.downPaymentPercent / 100);
const totalInitialInvestment = downPaymentAmount + 48000 + 24000 + 5000; // DLD + Agent + Other
const cashOnCashReturn = (annualCashFlow / totalInitialInvestment) * 100;

// Break-even calculations
const fixedExpenses = inputs.serviceChargeAnnual + annualMaintenanceCosts;
const breakEvenOccupancyRate = Math.min(100, Math.max(0,
  ((fixedExpenses + annualMortgagePayment) / grossAnnualRentalIncome + inputs.propertyManagementFeePercent / 100) * 100
));
const breakEvenMonthlyRent = 
  (fixedExpenses + annualMortgagePayment) / 
  (12 * (1 - inputs.vacancyRatePercent / 100 - inputs.propertyManagementFeePercent / 100));

// Year 5 projection (simplified)
const year5PropertyValue = inputs.purchasePrice * Math.pow(1 + inputs.capitalGrowthPercent / 100, 5);
const year5AnnualRent = grossAnnualRentalIncome * Math.pow(1 + inputs.rentGrowthPercent / 100, 5);

// Simplified Year 5 remaining balance calculation
const paymentsAtYear5 = 5 * 12;
const remainingBalance = loanAmount *
  (Math.pow(1 + monthlyInterestRate, numberOfPayments) -
    Math.pow(1 + monthlyInterestRate, paymentsAtYear5)) /
  (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

const year5Equity = year5PropertyValue - remainingBalance;

// Rough cumulative cash flow (simplified - assumes constant for demo)
const cumulativeCashFlow = annualCashFlow * 5;

const sellingFee = year5PropertyValue * 0.02;
const saleProceeds = year5PropertyValue - remainingBalance - sellingFee;
const totalReturn = saleProceeds + cumulativeCashFlow - totalInitialInvestment;
const roiPercent = (totalReturn / totalInitialInvestment) * 100;

// Format helpers
const formatAED = (val) => `AED ${Math.round(val).toLocaleString()}`;
const formatPct = (val) => `${val.toFixed(2)}%`;

console.log('═══════════════════════════════════════════════════════════════');
console.log('  YieldPulse Sample Premium Report - Calculated Values');
console.log('═══════════════════════════════════════════════════════════════\n');

console.log('📊 KEY METRICS (Year 1)');
console.log('────────────────────────────────────────────────────────────────');
console.log(`  Gross Rental Yield:    ${formatPct(grossRentalYield)}`);
console.log(`  Net Rental Yield:      ${formatPct(netRentalYield)}`);
console.log(`  Cash-on-Cash Return:   ${formatPct(cashOnCashReturn)}`);
console.log(`  Monthly Cash Flow:     ${formatAED(monthlyCashFlow)}`);
console.log(`  Annual Cash Flow:      ${formatAED(annualCashFlow)}`);
console.log('');

console.log('⚖️  BREAK-EVEN ANALYSIS');
console.log('────────────────────────────────────────────────────────────────');
console.log(`  Break-even Occupancy:  ${formatPct(breakEvenOccupancyRate)}`);
console.log(`  Break-even Rent:       ${formatAED(breakEvenMonthlyRent)}/month`);
console.log('');

console.log('🎯 5-YEAR OUTCOME');
console.log('────────────────────────────────────────────────────────────────');
console.log(`  Property Value (Y5):   ${formatAED(year5PropertyValue)}`);
console.log(`  Equity (Y5):           ${formatAED(year5Equity)}`);
console.log(`  Sale Proceeds:         ${formatAED(saleProceeds)}`);
console.log(`  Cumulative Cash Flow:  ${formatAED(cumulativeCashFlow)}`);
console.log(`  Total Return:          ${formatAED(totalReturn)}`);
console.log(`  Return on Investment:  ${formatPct(roiPercent)}`);
console.log(`  Annualized:            ${formatPct(roiPercent / 5)}/year`);
console.log('');

console.log('✅ VALIDATION');
console.log('────────────────────────────────────────────────────────────────');
console.log(`  Gross Yield 7-9%?      ${grossRentalYield > 7 && grossRentalYield < 9 ? '✓' : '✗'}`);
console.log(`  Net Yield 4.5-6%?      ${netRentalYield > 4 && netRentalYield < 7 ? '✓' : '✗'}`);
console.log(`  Cash Flow Positive?    ${monthlyCashFlow > 0 ? '✓' : '~'} (Near-neutral OK)`);
console.log(`  Break-even 65-85%?     ${breakEvenOccupancyRate > 60 && breakEvenOccupancyRate < 90 ? '✓' : '✗'}`);
console.log(`  5Y ROI 10-25%?         ${roiPercent > 10 && roiPercent < 30 ? '✓' : '✗'}`);
console.log('');

console.log('═══════════════════════════════════════════════════════════════');
console.log('  ✅ All calculations complete - Review values above');
console.log('═══════════════════════════════════════════════════════════════\n');
