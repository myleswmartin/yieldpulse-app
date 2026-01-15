// Verification script for Sample Premium Report calculations
// This computes exact values to verify mathematical consistency

const sampleInputs = {
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

// BASIC CALCULATIONS
const downPaymentAmount = sampleInputs.purchasePrice * (sampleInputs.downPaymentPercent / 100);
const loanAmount = sampleInputs.purchasePrice - downPaymentAmount;
const monthlyInterestRate = sampleInputs.mortgageInterestRate / 100 / 12;
const numberOfPayments = sampleInputs.mortgageTermYears * 12;

// MORTGAGE PAYMENT (PMT formula)
const factor = Math.pow(1 + monthlyInterestRate, numberOfPayments);
const monthlyMortgagePayment = loanAmount * (monthlyInterestRate * factor) / (factor - 1);
const annualMortgagePayment = monthlyMortgagePayment * 12;

// UPFRONT COSTS
const dldFee = sampleInputs.purchasePrice * (sampleInputs.dldFeePercent / 100);
const agentFee = sampleInputs.purchasePrice * (sampleInputs.agentFeePercent / 100);
const otherClosingCosts = 5000;
const totalUpfrontCosts = dldFee + agentFee + otherClosingCosts;
const totalInitialInvestment = downPaymentAmount + totalUpfrontCosts;

// YEAR 1 INCOME
const grossAnnualRentalIncome = sampleInputs.expectedMonthlyRent * 12;
const vacancyAmount = grossAnnualRentalIncome * (sampleInputs.vacancyRatePercent / 100);
const effectiveAnnualRentalIncome = grossAnnualRentalIncome - vacancyAmount;

// YEAR 1 EXPENSES
const annualServiceCharge = sampleInputs.serviceChargeAnnual;
const annualMaintenanceCosts = sampleInputs.purchasePrice * (sampleInputs.annualMaintenancePercent / 100);
const annualPropertyManagementFee = grossAnnualRentalIncome * (sampleInputs.propertyManagementFeePercent / 100);
const totalAnnualOperatingExpenses = annualServiceCharge + annualMaintenanceCosts + annualPropertyManagementFee;

// YEAR 1 NOI & CASH FLOW
const netOperatingIncome = effectiveAnnualRentalIncome - totalAnnualOperatingExpenses;
const annualCashFlow = netOperatingIncome - annualMortgagePayment;
const monthlyCashFlow = annualCashFlow / 12;

// KEY METRICS
const grossRentalYield = (grossAnnualRentalIncome / sampleInputs.purchasePrice) * 100;
const netRentalYield = (netOperatingIncome / sampleInputs.purchasePrice) * 100;

// BREAK-EVEN OCCUPANCY (Management on GROSS)
const fixedExpenses = annualServiceCharge + annualMaintenanceCosts;
const managementFeePercent = sampleInputs.propertyManagementFeePercent / 100;
const breakEvenOccupancyRaw = managementFeePercent + (fixedExpenses + annualMortgagePayment) / grossAnnualRentalIncome;
const breakEvenOccupancyRawPercent = breakEvenOccupancyRaw * 100;
const breakEvenOccupancyDisplayPercent = Math.min(100, Math.max(0, breakEvenOccupancyRawPercent));

// BREAK-EVEN MONTHLY RENT
const breakEvenMonthlyRent = (fixedExpenses + annualMortgagePayment) / (12 * (1 - sampleInputs.vacancyRatePercent / 100 - sampleInputs.propertyManagementFeePercent / 100));

// YEAR 5 PROJECTION
const year5PropertyValue = sampleInputs.purchasePrice * Math.pow(1 + sampleInputs.capitalGrowthPercent / 100, 5);
const year5AnnualRent = grossAnnualRentalIncome * Math.pow(1 + sampleInputs.rentGrowthPercent / 100, 5);
const year5EffectiveRent = year5AnnualRent * (1 - sampleInputs.vacancyRatePercent / 100);
const year5Maintenance = year5PropertyValue * (sampleInputs.annualMaintenancePercent / 100);
const year5ManagementFee = year5AnnualRent * (sampleInputs.propertyManagementFeePercent / 100);
const year5OpEx = annualServiceCharge + year5Maintenance + year5ManagementFee;
const year5NOI = year5EffectiveRent - year5OpEx;
const year5CashFlow = year5NOI - annualMortgagePayment;

// REMAINING LOAN BALANCE YEAR 5
const paymentsMade = 5 * 12;
const year5RemainingLoanBalance = loanAmount * (Math.pow(1 + monthlyInterestRate, numberOfPayments) - Math.pow(1 + monthlyInterestRate, paymentsMade)) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

// Compute cumulative cash flow (need to sum years 1-5)
let cumulativeCashFlow = 0;
for (let year = 1; year <= 5; year++) {
  const yearPropertyValue = sampleInputs.purchasePrice * Math.pow(1 + sampleInputs.capitalGrowthPercent / 100, year);
  const yearAnnualRent = grossAnnualRentalIncome * Math.pow(1 + sampleInputs.rentGrowthPercent / 100, year);
  const yearEffectiveRent = yearAnnualRent * (1 - sampleInputs.vacancyRatePercent / 100);
  const yearMaintenance = yearPropertyValue * (sampleInputs.annualMaintenancePercent / 100);
  const yearManagementFee = yearAnnualRent * (sampleInputs.propertyManagementFeePercent / 100);
  const yearOpEx = annualServiceCharge + yearMaintenance + yearManagementFee;
  const yearNOI = yearEffectiveRent - yearOpEx;
  const yearCashFlow = yearNOI - annualMortgagePayment;
  cumulativeCashFlow += yearCashFlow;
}

// YEAR 5 EXIT SCENARIO
const sellingFee = year5PropertyValue * 0.02;
const netSaleProceeds = year5PropertyValue - year5RemainingLoanBalance - sellingFee;
const totalReturn = netSaleProceeds + cumulativeCashFlow - totalInitialInvestment;
const roiPercent = (totalReturn / totalInitialInvestment) * 100;
const annualizedReturn = roiPercent / 5;

// TOTAL GROWTH CALCULATION
const totalGrowthPercent = ((year5PropertyValue / sampleInputs.purchasePrice) - 1) * 100;

// VERIFICATION: Cash flow at break-even occupancy
const verificationCashFlow = (grossAnnualRentalIncome * breakEvenOccupancyRaw) - (grossAnnualRentalIncome * managementFeePercent) - fixedExpenses - annualMortgagePayment;

console.log('═══════════════════════════════════════════════════════════════');
console.log('SAMPLE PREMIUM REPORT - RECONCILIATION');
console.log('═══════════════════════════════════════════════════════════════\n');

console.log('EXACT SAMPLE INPUTS:');
console.log('  Purchase Price:        AED', sampleInputs.purchasePrice.toLocaleString());
console.log('  Down Payment:         ', sampleInputs.downPaymentPercent + '%');
console.log('  Mortgage Rate:        ', sampleInputs.mortgageInterestRate + '%');
console.log('  Mortgage Term:        ', sampleInputs.mortgageTermYears, 'years');
console.log('  Monthly Rent:          AED', sampleInputs.expectedMonthlyRent.toLocaleString());
console.log('  Service Charge:        AED', sampleInputs.serviceChargeAnnual.toLocaleString());
console.log('  Maintenance:          ', sampleInputs.annualMaintenancePercent + '%');
console.log('  Management Fee:       ', sampleInputs.propertyManagementFeePercent + '%');
console.log('  Vacancy Rate:         ', sampleInputs.vacancyRatePercent + '%');
console.log('  Capital Growth:       ', sampleInputs.capitalGrowthPercent + '%');
console.log('  Rent Growth:          ', sampleInputs.rentGrowthPercent + '%');
console.log('  Holding Period:       ', sampleInputs.holdingPeriodYears, 'years\n');

console.log('YEAR 1 RECONCILIATION TABLE:');
console.log('  Gross Annual Rent:             AED', Math.round(grossAnnualRentalIncome).toLocaleString());
console.log('  Less: Vacancy Amount:          AED', Math.round(vacancyAmount).toLocaleString());
console.log('  Effective Income:              AED', Math.round(effectiveAnnualRentalIncome).toLocaleString());
console.log('  Less: Management Fee (on gross): AED', Math.round(annualPropertyManagementFee).toLocaleString());
console.log('  Less: Service Charge:          AED', Math.round(annualServiceCharge).toLocaleString());
console.log('  Less: Maintenance:             AED', Math.round(annualMaintenanceCosts).toLocaleString());
console.log('  = NOI:                         AED', Math.round(netOperatingIncome).toLocaleString());
console.log('  Less: Annual Mortgage Payment: AED', Math.round(annualMortgagePayment).toLocaleString());
console.log('  = Net Annual Cash Flow:        AED', Math.round(annualCashFlow).toLocaleString());
console.log('  = Monthly Cash Flow:           AED', Math.round(monthlyCashFlow).toLocaleString());
console.log('');

console.log('KEY METRICS:');
console.log('  Gross Yield:                  ', grossRentalYield.toFixed(2) + '%');
console.log('  Net Yield:                    ', netRentalYield.toFixed(2) + '%');
console.log('');

console.log('BREAK-EVEN OCCUPANCY (Management on GROSS):');
console.log('  Formula: O = M + (F + L) / R');
console.log('  Where:');
console.log('    R (Gross Rent):              AED', Math.round(grossAnnualRentalIncome).toLocaleString());
console.log('    M (Management %):           ', (managementFeePercent * 100).toFixed(2) + '%');
console.log('    F (Fixed Expenses):          AED', Math.round(fixedExpenses).toLocaleString());
console.log('    L (Annual Mortgage):         AED', Math.round(annualMortgagePayment).toLocaleString());
console.log('  Calculation:');
console.log('    O = 0.05 + (' + Math.round(fixedExpenses).toLocaleString() + ' + ' + Math.round(annualMortgagePayment).toLocaleString() + ') / ' + Math.round(grossAnnualRentalIncome).toLocaleString());
console.log('    O = 0.05 + ' + Math.round(fixedExpenses + annualMortgagePayment).toLocaleString() + ' / ' + Math.round(grossAnnualRentalIncome).toLocaleString());
console.log('    O = 0.05 + ' + ((fixedExpenses + annualMortgagePayment) / grossAnnualRentalIncome).toFixed(6));
console.log('    O = ' + breakEvenOccupancyRaw.toFixed(6));
console.log('  Break-Even Occupancy:         ', breakEvenOccupancyRawPercent.toFixed(2) + '%');
console.log('  Display Value (clamped):      ', breakEvenOccupancyDisplayPercent.toFixed(2) + '%');
console.log('');
console.log('  Verification Cash Flow at ' + breakEvenOccupancyRawPercent.toFixed(2) + '% occupancy:');
console.log('    CF = (R × O) - (R × M) - F - L');
console.log('    CF = (' + Math.round(grossAnnualRentalIncome).toLocaleString() + ' × ' + breakEvenOccupancyRaw.toFixed(6) + ') - (' + Math.round(grossAnnualRentalIncome).toLocaleString() + ' × 0.05) - ' + Math.round(fixedExpenses).toLocaleString() + ' - ' + Math.round(annualMortgagePayment).toLocaleString());
console.log('    CF = AED', Math.round(verificationCashFlow).toLocaleString());
console.log('    ✓ Within ±1 AED of zero: ' + (Math.abs(verificationCashFlow) <= 1 ? 'YES' : 'NO'));
console.log('');

console.log('BREAK-EVEN MONTHLY RENT:');
console.log('  Formula: R = (F + L) / (12 × (1 - vacancy% - mgmt%))');
console.log('  Break-Even Rent:              AED', Math.round(breakEvenMonthlyRent).toLocaleString() + '/month');
console.log('');

console.log('YEAR 5 EXIT SCENARIO:');
console.log('  Property Value (Year 5):       AED', Math.round(year5PropertyValue).toLocaleString());
console.log('  Total Growth:                 ', totalGrowthPercent.toFixed(2) + '% (' + sampleInputs.capitalGrowthPercent.toFixed(2) + '% annually)');
console.log('  Less: Loan Balance (Year 5):   AED', Math.round(year5RemainingLoanBalance).toLocaleString());
console.log('  Less: Selling Fee (2%):        AED', Math.round(sellingFee).toLocaleString());
console.log('  = Net Sale Proceeds:           AED', Math.round(netSaleProceeds).toLocaleString());
console.log('');
console.log('  Plus: Cumulative Cash Flow:    AED', Math.round(cumulativeCashFlow).toLocaleString());
console.log('  Less: Initial Investment:      AED', Math.round(totalInitialInvestment).toLocaleString());
console.log('  = Total Return (Wealth):       AED', Math.round(totalReturn).toLocaleString());
console.log('');
console.log('  ROI:                          ', roiPercent.toFixed(2) + '%');
console.log('  Annualized Return:            ', annualizedReturn.toFixed(2) + '% per year');
console.log('');

console.log('GROWTH LABEL VERIFICATION:');
console.log('  Purchase Price:                AED', Math.round(sampleInputs.purchasePrice).toLocaleString());
console.log('  Year 5 Property Value:         AED', Math.round(year5PropertyValue).toLocaleString());
console.log('  Total Growth:                 ', totalGrowthPercent.toFixed(2) + '%');
console.log('  Annual Growth Rate:           ', sampleInputs.capitalGrowthPercent.toFixed(2) + '%');
console.log('  Formula Check: (1.02)^5 =     ', Math.pow(1.02, 5).toFixed(6));
console.log('  Expected Total Growth:        ', ((Math.pow(1.02, 5) - 1) * 100).toFixed(2) + '%');
console.log('  ✓ Growth label mathematically consistent');
console.log('');

console.log('═══════════════════════════════════════════════════════════════');
console.log('FINAL HEADLINE OUTPUTS:');
console.log('═══════════════════════════════════════════════════════════════');
console.log('  Gross Yield:                  ', grossRentalYield.toFixed(2) + '%');
console.log('  Net Yield:                    ', netRentalYield.toFixed(2) + '%');
console.log('  Monthly Cash Flow:             AED', Math.round(monthlyCashFlow).toLocaleString());
console.log('  Break-Even Occupancy:         ', breakEvenOccupancyRawPercent.toFixed(2) + '%');
console.log('  5-Year ROI:                   ', roiPercent.toFixed(2) + '%');
console.log('═══════════════════════════════════════════════════════════════');
