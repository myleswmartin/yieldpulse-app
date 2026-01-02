// YieldPulse ROI Calculation Engine

export interface PropertyInputs {
  // Property Details
  propertyName?: string;
  listingUrl?: string;
  portalSource?: string;
  propertyType?: string;
  location?: string;
  areaSqft: number;

  // Financial Details
  purchasePrice: number;
  downPaymentPercent: number;
  mortgageInterestRate: number;
  mortgageTermYears: number;
  expectedMonthlyRent: number;
  serviceChargeAnnual: number;
  annualMaintenancePercent: number;
  propertyManagementFeePercent: number;
  dldFeePercent: number;
  agentFeePercent: number;

  // Projection Parameters
  capitalGrowthPercent: number;
  rentGrowthPercent: number;
  vacancyRatePercent: number;
  holdingPeriodYears: number;
}

export interface CalculationResults {
  // Basic Calculations
  loanAmount: number;
  monthlyMortgagePayment: number;
  annualMortgagePayment: number;
  downPaymentAmount: number;

  // Upfront Costs
  dldFee: number;
  agentFee: number;
  otherClosingCosts: number;
  totalUpfrontCosts: number;
  totalInitialInvestment: number;

  // Annual Income
  grossAnnualRentalIncome: number;
  effectiveAnnualRentalIncome: number;

  // Annual Expenses
  annualServiceCharge: number;
  annualMaintenanceCosts: number;
  annualPropertyManagementFee: number;
  totalAnnualOperatingExpenses: number;

  // Net Operating Income
  netOperatingIncome: number;

  // Cash Flow
  annualCashFlow: number;
  monthlyCashFlow: number;

  // Key Metrics
  grossRentalYield: number;
  netRentalYield: number;
  cashOnCashReturn: number;
  capRate: number;

  // 5-Year Projection
  projection: YearProjection[];

  // Sensitivity Analysis
  sensitivityAnalysis: SensitivityAnalysis;
}

export interface YearProjection {
  year: number;
  propertyValue: number;
  annualRent: number;
  effectiveRentalIncome: number;
  operatingExpenses: number;
  noi: number;
  remainingLoanBalance: number;
  equity: number;
  cashFlow: number;
  cumulativeCashFlow: number;
  saleProceeds: number;
  totalReturn: number;
  roiPercent: number;
}

export interface SensitivityAnalysis {
  vacancyRateScenarios: ScenarioResult[];
  interestRateScenarios: ScenarioResult[];
  rentScenarios: ScenarioResult[];
}

export interface ScenarioResult {
  label: string;
  value: number;
  annualCashFlow: number;
  cashOnCashReturn: number;
  additionalMetric?: number;
}

// ================================================================
// MAIN CALCULATION FUNCTION
// ================================================================

export function calculateROI(inputs: PropertyInputs): CalculationResults {
  // A. Basic Calculations
  const loanAmount = inputs.purchasePrice * (1 - inputs.downPaymentPercent / 100);
  
  const monthlyInterestRate = inputs.mortgageInterestRate / 12 / 100;
  const numberOfPayments = inputs.mortgageTermYears * 12;
  
  let monthlyMortgagePayment = 0;
  if (loanAmount > 0 && monthlyInterestRate > 0) {
    monthlyMortgagePayment =
      (loanAmount *
        (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments))) /
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
  }
  
  const annualMortgagePayment = monthlyMortgagePayment * 12;
  const downPaymentAmount = inputs.purchasePrice * (inputs.downPaymentPercent / 100);

  // B. Upfront Costs
  const dldFee = inputs.purchasePrice * (inputs.dldFeePercent / 100);
  const agentFee = inputs.purchasePrice * (inputs.agentFeePercent / 100);
  const otherClosingCosts = 5000; // AED
  const totalUpfrontCosts = downPaymentAmount + dldFee + agentFee + otherClosingCosts;
  const totalInitialInvestment = totalUpfrontCosts;

  // C. Annual Income
  const grossAnnualRentalIncome = inputs.expectedMonthlyRent * 12;
  const effectiveAnnualRentalIncome =
    grossAnnualRentalIncome * (1 - inputs.vacancyRatePercent / 100);

  // D. Annual Operating Expenses
  const annualServiceCharge = inputs.serviceChargeAnnual;
  const annualMaintenanceCosts =
    inputs.purchasePrice * (inputs.annualMaintenancePercent / 100);
  const annualPropertyManagementFee =
    grossAnnualRentalIncome * (inputs.propertyManagementFeePercent / 100);
  const totalAnnualOperatingExpenses =
    annualServiceCharge + annualMaintenanceCosts + annualPropertyManagementFee;

  // E. Net Operating Income
  const netOperatingIncome = effectiveAnnualRentalIncome - totalAnnualOperatingExpenses;

  // F. Annual Cash Flow
  const annualCashFlow = netOperatingIncome - annualMortgagePayment;
  const monthlyCashFlow = annualCashFlow / 12;

  // G. Key Return Metrics
  const grossRentalYield = (grossAnnualRentalIncome / inputs.purchasePrice) * 100;
  const netRentalYield = (netOperatingIncome / inputs.purchasePrice) * 100;
  const cashOnCashReturn = (annualCashFlow / totalInitialInvestment) * 100;
  const capRate = (netOperatingIncome / inputs.purchasePrice) * 100;

  // H. 5-Year Projection
  const projection = calculateProjection(inputs, {
    loanAmount,
    monthlyInterestRate,
    numberOfPayments,
    monthlyMortgagePayment,
    annualMortgagePayment,
    totalInitialInvestment,
    grossAnnualRentalIncome,
  });

  // I. Sensitivity Analysis
  const sensitivityAnalysis = calculateSensitivityAnalysis(inputs, {
    monthlyInterestRate,
    numberOfPayments,
    loanAmount,
    totalInitialInvestment,
  });

  return {
    loanAmount,
    monthlyMortgagePayment,
    annualMortgagePayment,
    downPaymentAmount,
    dldFee,
    agentFee,
    otherClosingCosts,
    totalUpfrontCosts,
    totalInitialInvestment,
    grossAnnualRentalIncome,
    effectiveAnnualRentalIncome,
    annualServiceCharge,
    annualMaintenanceCosts,
    annualPropertyManagementFee,
    totalAnnualOperatingExpenses,
    netOperatingIncome,
    annualCashFlow,
    monthlyCashFlow,
    grossRentalYield,
    netRentalYield,
    cashOnCashReturn,
    capRate,
    projection,
    sensitivityAnalysis,
  };
}

// ================================================================
// PROJECTION CALCULATIONS
// ================================================================

function calculateProjection(
  inputs: PropertyInputs,
  baseCalcs: {
    loanAmount: number;
    monthlyInterestRate: number;
    numberOfPayments: number;
    monthlyMortgagePayment: number;
    annualMortgagePayment: number;
    totalInitialInvestment: number;
    grossAnnualRentalIncome: number;
  }
): YearProjection[] {
  const projection: YearProjection[] = [];
  let cumulativeCashFlow = 0;

  for (let year = 1; year <= inputs.holdingPeriodYears; year++) {
    // Property Value
    const propertyValue =
      inputs.purchasePrice * Math.pow(1 + inputs.capitalGrowthPercent / 100, year);

    // Annual Rent
    const annualRent =
      baseCalcs.grossAnnualRentalIncome * Math.pow(1 + inputs.rentGrowthPercent / 100, year);

    // Effective Rental Income
    const effectiveRentalIncome = annualRent * (1 - inputs.vacancyRatePercent / 100);

    // Operating Expenses
    const operatingExpenses =
      inputs.serviceChargeAnnual +
      propertyValue * (inputs.annualMaintenancePercent / 100) +
      annualRent * (inputs.propertyManagementFeePercent / 100);

    // NOI
    const noi = effectiveRentalIncome - operatingExpenses;

    // Remaining Loan Balance
    const paymentsMade = year * 12;
    let remainingLoanBalance = 0;
    if (baseCalcs.loanAmount > 0 && baseCalcs.monthlyInterestRate > 0) {
      remainingLoanBalance =
        baseCalcs.loanAmount *
        (Math.pow(1 + baseCalcs.monthlyInterestRate, baseCalcs.numberOfPayments) -
          Math.pow(1 + baseCalcs.monthlyInterestRate, paymentsMade)) /
        (Math.pow(1 + baseCalcs.monthlyInterestRate, baseCalcs.numberOfPayments) - 1);
    }

    // Equity
    const equity = propertyValue - remainingLoanBalance;

    // Cash Flow
    const cashFlow = noi - baseCalcs.annualMortgagePayment;
    cumulativeCashFlow += cashFlow;

    // Sale Proceeds
    const sellingAgentFee = propertyValue * 0.02; // 2% selling fee
    const saleProceeds = propertyValue - remainingLoanBalance - sellingAgentFee;

    // Total Return
    const totalReturn = saleProceeds + cumulativeCashFlow - baseCalcs.totalInitialInvestment;
    const roiPercent = (totalReturn / baseCalcs.totalInitialInvestment) * 100;

    projection.push({
      year,
      propertyValue,
      annualRent,
      effectiveRentalIncome,
      operatingExpenses,
      noi,
      remainingLoanBalance,
      equity,
      cashFlow,
      cumulativeCashFlow,
      saleProceeds,
      totalReturn,
      roiPercent,
    });
  }

  return projection;
}

// ================================================================
// SENSITIVITY ANALYSIS
// ================================================================

function calculateSensitivityAnalysis(
  inputs: PropertyInputs,
  baseCalcs: {
    monthlyInterestRate: number;
    numberOfPayments: number;
    loanAmount: number;
    totalInitialInvestment: number;
  }
): SensitivityAnalysis {
  // 1. Vacancy Rate Sensitivity
  const vacancyRates = [0, 5, 10, 15, 20];
  const vacancyRateScenarios: ScenarioResult[] = vacancyRates.map((rate) => {
    const effectiveIncome =
      inputs.expectedMonthlyRent * 12 * (1 - rate / 100);
    const totalExpenses =
      inputs.serviceChargeAnnual +
      inputs.purchasePrice * (inputs.annualMaintenancePercent / 100) +
      inputs.expectedMonthlyRent * 12 * (inputs.propertyManagementFeePercent / 100);
    const noi = effectiveIncome - totalExpenses;
    
    const monthlyPayment = baseCalcs.loanAmount > 0
      ? (baseCalcs.loanAmount *
          (baseCalcs.monthlyInterestRate *
            Math.pow(1 + baseCalcs.monthlyInterestRate, baseCalcs.numberOfPayments))) /
        (Math.pow(1 + baseCalcs.monthlyInterestRate, baseCalcs.numberOfPayments) - 1)
      : 0;
    
    const annualCashFlow = noi - monthlyPayment * 12;
    const cashOnCashReturn = (annualCashFlow / baseCalcs.totalInitialInvestment) * 100;

    return {
      label: `${rate}% Vacancy`,
      value: rate,
      annualCashFlow,
      cashOnCashReturn,
    };
  });

  // 2. Interest Rate Sensitivity
  const interestRateDeltas = [-2, -1, 0, 1, 2];
  const interestRateScenarios: ScenarioResult[] = interestRateDeltas.map((delta) => {
    const rate = Math.max(0, inputs.mortgageInterestRate + delta);
    const monthlyRate = rate / 12 / 100;
    
    let monthlyPayment = 0;
    if (baseCalcs.loanAmount > 0 && monthlyRate > 0) {
      monthlyPayment =
        (baseCalcs.loanAmount *
          (monthlyRate * Math.pow(1 + monthlyRate, baseCalcs.numberOfPayments))) /
        (Math.pow(1 + monthlyRate, baseCalcs.numberOfPayments) - 1);
    }

    const effectiveIncome =
      inputs.expectedMonthlyRent * 12 * (1 - inputs.vacancyRatePercent / 100);
    const totalExpenses =
      inputs.serviceChargeAnnual +
      inputs.purchasePrice * (inputs.annualMaintenancePercent / 100) +
      inputs.expectedMonthlyRent * 12 * (inputs.propertyManagementFeePercent / 100);
    const noi = effectiveIncome - totalExpenses;
    const annualCashFlow = noi - monthlyPayment * 12;
    const cashOnCashReturn = (annualCashFlow / baseCalcs.totalInitialInvestment) * 100;

    return {
      label: `${rate.toFixed(2)}% Interest`,
      value: rate,
      annualCashFlow,
      cashOnCashReturn,
    };
  });

  // 3. Rent Sensitivity
  const rentDeltas = [-20, -10, 0, 10, 20];
  const rentScenarios: ScenarioResult[] = rentDeltas.map((delta) => {
    const adjustedRent = inputs.expectedMonthlyRent * (1 + delta / 100);
    const grossIncome = adjustedRent * 12;
    const effectiveIncome = grossIncome * (1 - inputs.vacancyRatePercent / 100);
    const totalExpenses =
      inputs.serviceChargeAnnual +
      inputs.purchasePrice * (inputs.annualMaintenancePercent / 100) +
      grossIncome * (inputs.propertyManagementFeePercent / 100);
    const noi = effectiveIncome - totalExpenses;
    
    const monthlyPayment = baseCalcs.loanAmount > 0
      ? (baseCalcs.loanAmount *
          (baseCalcs.monthlyInterestRate *
            Math.pow(1 + baseCalcs.monthlyInterestRate, baseCalcs.numberOfPayments))) /
        (Math.pow(1 + baseCalcs.monthlyInterestRate, baseCalcs.numberOfPayments) - 1)
      : 0;
    
    const annualCashFlow = noi - monthlyPayment * 12;
    const cashOnCashReturn = (annualCashFlow / baseCalcs.totalInitialInvestment) * 100;
    const grossYield = (grossIncome / inputs.purchasePrice) * 100;

    return {
      label: `${delta >= 0 ? '+' : ''}${delta}% Rent`,
      value: adjustedRent,
      annualCashFlow,
      cashOnCashReturn,
      additionalMetric: grossYield,
    };
  });

  return {
    vacancyRateScenarios,
    interestRateScenarios,
    rentScenarios,
  };
}

// ================================================================
// UTILITY FUNCTIONS
// ================================================================

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatNumber(value: number, decimals: number = 0): string {
  return new Intl.NumberFormat('en-AE', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}
