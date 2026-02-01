import { ReportSnapshot } from './pdfGenerator';

type PremiumReportData = {
  propertyId: string;
  propertyName: string;
  propertyImage: string;
  propertyType?: string;
  location?: string;
  listingUrl?: string;
  areaSqft?: number;
  purchasePrice: number;
  currency: string;
  downPaymentPercent: number;
  downPaymentAmount: number;
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  holdingPeriod: number;
  expectedRent: number;
  expectedAnnualRent: number;
  rentGrowthRate: number;
  costs: {
    purchaseCosts: {
      dutyFee: number;
      registrationFee: number;
      agentFee: number;
      total: number;
    };
    ongoingCosts: {
      maintenance: number;
      insurance: number;
      serviceFee: number;
      total: number;
    };
  };
  capitalRequired: {
    downPayment: number;
    purchaseCosts: number;
    total: number;
  };
  mortgage: {
    monthlyPayment: number;
    totalPayments: number;
    totalInterest: number;
    principalAmount: number;
    amortizationSchedule: Array<{ year: number; principal: number; interest: number; balance: number }>;
  };
  outcomes: {
    cashFlow: Record<
      string,
      {
        rentalIncome: number;
        mortgagePayment: number;
        ongoingCosts: number;
        netCashFlow: number;
        cumulativeCashFlow: number;
      }
    >;
    returns: {
      totalCashInvested: number;
      propertyValueAtExit: number;
      mortgageBalanceAtExit: number;
      equityAtExit: number;
      cumulativeCashFlow: number;
      netProfit: number;
      totalReturn: number;
      annualizedReturn: number;
      cashOnCashReturn: number;
    };
  };
  sensitivity: {
    rentChanges: Array<{ change: number; irr: number; cashOnCash: number; netProfit: number }>;
    priceChanges: Array<{ change: number; irr: number; totalReturn: number; equityAtExit: number }>;
    interestRateChanges: Array<{ rate: number; monthlyPayment: number; totalInterest: number; netProfit: number }>;
  };
  riskMetrics: {
    loanToValue: number;
    debtServiceCoverageRatio: number;
    grossYield: number;
    netYield: number;
    capitalizationRate: number;
    vacancyBuffer: number;
  };
  metadata: {
    generatedDate: string;
    reportVersion: string;
    analyst: string;
    disclaimer: string;
  };
  // Extra fields used directly by templates
  capitalGrowth: number;
  rentGrowth: number;
  grossYield: number;
  netYield: number;
  cashOnCashReturn: number;
  monthlyCashFlow: number;
  annualCashFlow: number;
  capRate: number;
  initialInvestment: number;
  costPerSqFt: number;
  rentPerSqFt: number;
  reportDate: string;
  grossIncome: number;
  vacancyLoss: number;
  vacancyPercent: number;
  effectiveIncome: number;
  serviceCost: number;
  servicePercent: number;
  maintenanceCost: number;
  maintenancePercent: number;
  managementCost: number;
  managementPercent: number;
  totalExpenses: number;
  totalExpensesPercent: number;
  netOperatingIncome: number;
  mortgagePayment: number;
  mortgagePercent: number;
  propertyValueYear1: number;
  propertyValueYear5: number;
  equityYear1: number;
  equityYear5: number;
  cumulativeCashFlow: number;
  totalReturn: number;
  annualizedReturn: number;
};

const toNumber = (value: any, fallback = 0): number => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

const pickNumber = (...values: Array<any>): number => {
  for (const val of values) {
    const num = Number(val);
    if (Number.isFinite(num)) return num;
  }
  return 0;
};

const formatReportDate = (dateInput?: string): string => {
  const date = dateInput ? new Date(dateInput) : new Date();
  if (Number.isNaN(date.getTime())) return new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const calculateMonthlyPayment = (principal: number, annualRate: number, years: number): number => {
  const monthlyRate = annualRate / 100 / 12;
  const totalPayments = years * 12;
  if (principal <= 0 || monthlyRate <= 0 || totalPayments <= 0) return 0;
  const factor = Math.pow(1 + monthlyRate, totalPayments);
  return (principal * monthlyRate * factor) / (factor - 1);
};

const remainingBalance = (principal: number, annualRate: number, years: number, paymentsMade: number): number => {
  const monthlyRate = annualRate / 100 / 12;
  const totalPayments = years * 12;
  if (principal <= 0 || monthlyRate <= 0 || totalPayments <= 0) return principal;
  const factor = Math.pow(1 + monthlyRate, totalPayments);
  const balanceFactor = Math.pow(1 + monthlyRate, paymentsMade);
  return principal * (factor - balanceFactor) / (factor - 1);
};

const buildAmortizationSchedule = (principal: number, annualRate: number, years: number): Array<{ year: number; principal: number; interest: number; balance: number }> => {
  const schedule: Array<{ year: number; principal: number; interest: number; balance: number }> = [];
  const monthlyRate = annualRate / 100 / 12;
  const totalPayments = years * 12;
  const monthlyPayment = calculateMonthlyPayment(principal, annualRate, years);
  if (monthlyPayment <= 0) return schedule;

  let balance = principal;
  for (let year = 1; year <= years; year++) {
    let interestPaid = 0;
    let principalPaid = 0;
    for (let m = 1; m <= 12; m++) {
      const interest = balance * monthlyRate;
      const principalPayment = Math.max(0, monthlyPayment - interest);
      interestPaid += interest;
      principalPaid += principalPayment;
      balance = Math.max(0, balance - principalPayment);
    }
    if ([1, 2, 3, 4, 5, 10, 15, 20, years].includes(year)) {
      schedule.push({
        year,
        principal: Math.round(principalPaid),
        interest: Math.round(interestPaid),
        balance: Math.round(balance),
      });
    }
  }
  return schedule;
};

export type PropertyOverrides = Partial<{
  propertyName: string;
  propertyId: string;
  propertyImageUrl: string | null;
  listingUrl: string;
  areaSqft: number;
  propertyType: string;
  location: string;
}>;

export function mapSnapshotToPremiumReportData(
  snapshot: ReportSnapshot,
  purchaseDate?: string,
  overrides?: PropertyOverrides
): PremiumReportData {
  const inputs: any = snapshot?.inputs || {};
  const results: any = snapshot?.results || {};

  const purchasePrice = pickNumber(inputs.purchase_price, inputs.purchasePrice);
  const expectedRent = pickNumber(inputs.expected_monthly_rent, inputs.expectedMonthlyRent);
  const downPaymentPercent = pickNumber(inputs.down_payment_percent, inputs.downPaymentPercent);
  const interestRate = pickNumber(inputs.mortgage_interest_rate, inputs.mortgageInterestRate);
  const loanTerm = pickNumber(inputs.loan_term_years, inputs.mortgageTermYears, 25);
  const holdingPeriod = pickNumber(inputs.holding_period_years, inputs.holdingPeriodYears, 5);
  const vacancyRate = pickNumber(inputs.vacancy_rate, inputs.vacancyRatePercent);
  const rentGrowthRate = pickNumber(inputs.rent_growth_rate, inputs.rentGrowthPercent);
  const capitalGrowth = pickNumber(inputs.capital_growth_rate, inputs.capitalGrowthPercent);
  const serviceChargeAnnual = pickNumber(inputs.service_charge_per_year, inputs.serviceChargeAnnual);
  const maintenancePercentInput = pickNumber(inputs.maintenance_per_year, inputs.annualMaintenancePercent);
  const propertyManagementFeePercent = pickNumber(inputs.property_management_fee, inputs.propertyManagementFeePercent);
  const areaSqft = pickNumber(overrides?.areaSqft, inputs.area_sqft, inputs.areaSqft);

  const grossIncome = pickNumber(results.grossAnnualRentalIncome, results.annualIncome, expectedRent * 12);
  const vacancyLoss = pickNumber(results.vacancyAmount, grossIncome * (vacancyRate / 100));
  const effectiveIncome = pickNumber(results.effectiveAnnualRentalIncome, grossIncome - vacancyLoss);

  const serviceCost = pickNumber(results.annualServiceCharge, serviceChargeAnnual);
  const maintenanceCost = pickNumber(results.annualMaintenanceCosts, purchasePrice * (maintenancePercentInput / 100));
  const managementCost = pickNumber(results.annualPropertyManagementFee, grossIncome * (propertyManagementFeePercent / 100));
  const totalExpenses = pickNumber(results.totalAnnualOperatingExpenses, serviceCost + maintenanceCost + managementCost);
  const netOperatingIncome = pickNumber(results.netOperatingIncome, effectiveIncome - totalExpenses);

  const loanAmount = pickNumber(results.loanAmount, results.loan_amount, purchasePrice * (1 - downPaymentPercent / 100));
  const monthlyMortgagePayment = pickNumber(
    results.monthlyMortgagePayment,
    results.monthly_mortgage_payment,
    calculateMonthlyPayment(loanAmount, interestRate, loanTerm)
  );
  const annualMortgagePayment = pickNumber(results.annualMortgagePayment, results.annual_mortgage_payment, monthlyMortgagePayment * 12);

  const annualCashFlow = pickNumber(results.annualCashFlow, results.annual_cash_flow, netOperatingIncome - annualMortgagePayment);
  const monthlyCashFlow = pickNumber(results.monthlyCashFlow, results.monthly_cash_flow, annualCashFlow / 12);

  const downPaymentAmount = pickNumber(results.downPaymentAmount, results.down_payment_amount, purchasePrice * (downPaymentPercent / 100));
  const dldFeePercent = pickNumber(inputs.dld_fee_percent, inputs.dldFeePercent, 4);
  const agentFeePercent = pickNumber(inputs.agent_fee_percent, inputs.agentFeePercent, 2);
  const dldFee = pickNumber(results.dldFee, results.dld_fee, purchasePrice * (dldFeePercent / 100));
  const agentFee = pickNumber(results.agentFee, results.agent_fee, purchasePrice * (agentFeePercent / 100));
  const otherClosingCosts = pickNumber(results.otherClosingCosts, results.other_closing_costs, 4000);
  const registrationFee = otherClosingCosts || 4000;
  const totalInitialInvestment = pickNumber(
    results.totalInitialInvestment,
    results.total_initial_investment,
    downPaymentAmount + dldFee + agentFee + registrationFee
  );

  const grossYield = pickNumber(results.grossRentalYield, results.gross_yield, results.grossYield, purchasePrice ? (grossIncome / purchasePrice) * 100 : 0);
  const netYield = pickNumber(results.netRentalYield, results.net_yield, results.netYield, purchasePrice ? (netOperatingIncome / purchasePrice) * 100 : 0);
  const cashOnCashReturn = pickNumber(
    results.cashOnCashReturn,
    results.cash_on_cash_return,
    totalInitialInvestment ? (annualCashFlow / totalInitialInvestment) * 100 : 0
  );
  const capRate = pickNumber(results.capRate, purchasePrice ? (netOperatingIncome / purchasePrice) * 100 : 0);
  const costPerSqFt = pickNumber(results.costPerSqft, areaSqft ? purchasePrice / areaSqft : 0);
  const rentPerSqFt = pickNumber(results.rentPerSqft, areaSqft ? grossIncome / areaSqft : 0);

  const projection = Array.isArray(results.projection) ? results.projection.slice(0, 5) : [];
  const projectionFallback = projection.length === 5 ? projection : (() => {
    const rows: any[] = [];
    let cumulative = 0;
    for (let year = 1; year <= holdingPeriod; year++) {
      const propertyValue = purchasePrice * Math.pow(1 + capitalGrowth / 100, year);
      const annualRent = grossIncome * Math.pow(1 + rentGrowthRate / 100, year);
      const effectiveRent = annualRent * (1 - vacancyRate / 100);
      const opEx = totalExpenses * Math.pow(1 + rentGrowthRate / 100, Math.max(0, year - 1));
      const noi = effectiveRent - opEx;
      const cashFlow = noi - annualMortgagePayment;
      cumulative += cashFlow;
      const balance = remainingBalance(loanAmount, interestRate, loanTerm, year * 12);
      const equity = propertyValue - balance;
      const saleProceeds = propertyValue - balance - propertyValue * 0.02;
      const totalReturn = saleProceeds + cumulative - totalInitialInvestment;
      const roiPercent = totalInitialInvestment ? (totalReturn / totalInitialInvestment) * 100 : 0;
      rows.push({
        year,
        propertyValue,
        remainingLoanBalance: balance,
        equity,
        annualRent,
        operatingExpenses: opEx,
        noi,
        cashFlow,
        cumulativeCashFlow: cumulative,
        saleProceeds,
        totalReturn,
        roiPercent,
      });
    }
    return rows.slice(0, 5);
  })();

  const projectionData = projection.length === 5 ? projection : projectionFallback;
  const year1 = projectionData[0];
  const year5 = projectionData[4] || projectionData[projectionData.length - 1];

  const propertyValueYear1 = year1?.propertyValue ?? purchasePrice;
  const propertyValueYear5 = year5?.propertyValue ?? purchasePrice;
  const equityYear1 = year1?.equity ?? downPaymentAmount;
  const equityYear5 = year5?.equity ?? propertyValueYear5 - year5?.remainingLoanBalance;
  const cumulativeCashFlow = year5?.cumulativeCashFlow ?? annualCashFlow * holdingPeriod;
  const netProfit = year5?.totalReturn ?? (equityYear5 + cumulativeCashFlow - totalInitialInvestment);
  const totalReturnPercent = totalInitialInvestment ? (netProfit / totalInitialInvestment) * 100 : 0;
  const annualizedReturn = holdingPeriod > 0 ? (Math.pow(1 + totalReturnPercent / 100, 1 / holdingPeriod) - 1) * 100 : 0;

  const cashFlowOutcomes: PremiumReportData['outcomes']['cashFlow'] = {};
  projectionData.forEach((year, idx) => {
    cashFlowOutcomes[`year${idx + 1}`] = {
      rentalIncome: year.annualRent,
      mortgagePayment: annualMortgagePayment,
      ongoingCosts: year.operatingExpenses,
      netCashFlow: year.cashFlow,
      cumulativeCashFlow: year.cumulativeCashFlow,
    };
  });

  const rentScenarios = results.sensitivityAnalysis?.rentScenarios || [];
  const interestScenarios = results.sensitivityAnalysis?.interestRateScenarios || [];
  const rentChanges = rentScenarios.length
    ? rentScenarios.map((row: any) => ({
        change: toNumber(row.value),
        irr: toNumber(row.cashOnCashReturn),
        cashOnCash: toNumber(row.cashOnCashReturn),
        netProfit: toNumber(row.annualCashFlow) * holdingPeriod,
      }))
    : [{ change: 0, irr: annualizedReturn, cashOnCash: cashOnCashReturn, netProfit }];

  const priceChanges = [
    { change: -10, irr: annualizedReturn - 2, totalReturn: totalReturnPercent - 10, equityAtExit: equityYear5 * 0.9 },
    { change: 0, irr: annualizedReturn, totalReturn: totalReturnPercent, equityAtExit: equityYear5 },
    { change: 10, irr: annualizedReturn + 2, totalReturn: totalReturnPercent + 10, equityAtExit: equityYear5 * 1.1 },
  ];

  const interestRateChanges = interestScenarios.length
    ? interestScenarios.map((row: any) => ({
        rate: toNumber(row.value),
        monthlyPayment: calculateMonthlyPayment(loanAmount, toNumber(row.value), loanTerm),
        totalInterest: calculateMonthlyPayment(loanAmount, toNumber(row.value), loanTerm) * 12 * loanTerm - loanAmount,
        netProfit: toNumber(row.annualCashFlow) * holdingPeriod,
      }))
    : [
        {
          rate: interestRate,
          monthlyPayment,
          totalInterest: monthlyMortgagePayment * 12 * loanTerm - loanAmount,
          netProfit,
        },
      ];

  const reportDate = formatReportDate(purchaseDate);

  const rawId = overrides?.propertyId || snapshot?.metadata?.analysis_id || snapshot?.metadata?.purchase_id || '';
  const shortId = rawId ? `YP-${rawId.split('-')[0].toUpperCase()}` : 'YP-REPORT';
  const resolvedPropertyName =
    overrides?.propertyName ||
    inputs.property_name ||
    inputs.propertyName ||
    'Property';
  const resolvedImage =
    overrides?.propertyImageUrl ||
    inputs.property_image_url ||
    inputs.propertyImageUrl ||
    inputs.propertyImage ||
    inputs.property_image ||
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80';
  const resolvedPropertyType = overrides?.propertyType || inputs.property_type || inputs.propertyType || '';
  const resolvedLocation = overrides?.location || inputs.location || inputs.property_location || '';
  const resolvedListingUrl = overrides?.listingUrl || inputs.listing_url || inputs.listingUrl || '';

  return {
    propertyId: shortId,
    propertyName: resolvedPropertyName,
    propertyImage: resolvedImage,
    propertyType: resolvedPropertyType,
    location: resolvedLocation,
    listingUrl: resolvedListingUrl,
    areaSqft,
    purchasePrice,
    currency: 'AED',
    downPaymentPercent,
    downPaymentAmount,
    loanAmount,
    interestRate,
    loanTerm,
    holdingPeriod,
    expectedRent,
    expectedAnnualRent: expectedRent * 12,
    rentGrowthRate,
    costs: {
      purchaseCosts: {
        dutyFee: dldFee,
        registrationFee,
        agentFee,
        total: dldFee + registrationFee + agentFee,
      },
      ongoingCosts: {
        maintenance: maintenanceCost,
        insurance: 0,
        serviceFee: serviceCost,
        total: maintenanceCost + serviceCost,
      },
    },
    capitalRequired: {
      downPayment: downPaymentAmount,
      purchaseCosts: dldFee + registrationFee + agentFee,
      total: downPaymentAmount + dldFee + registrationFee + agentFee,
    },
    mortgage: {
      monthlyPayment: Math.round(monthlyMortgagePayment),
      totalPayments: Math.round(monthlyMortgagePayment * 12 * loanTerm),
      totalInterest: Math.round(monthlyMortgagePayment * 12 * loanTerm - loanAmount),
      principalAmount: Math.round(loanAmount),
      amortizationSchedule: buildAmortizationSchedule(loanAmount, interestRate, loanTerm),
    },
    outcomes: {
      cashFlow: cashFlowOutcomes,
      returns: {
        totalCashInvested: Math.round(downPaymentAmount + dldFee + registrationFee + agentFee),
        propertyValueAtExit: Math.round(propertyValueYear5),
        mortgageBalanceAtExit: Math.round(year5?.remainingLoanBalance ?? remainingBalance(loanAmount, interestRate, loanTerm, holdingPeriod * 12)),
        equityAtExit: Math.round(equityYear5),
        cumulativeCashFlow: Math.round(cumulativeCashFlow),
        netProfit: Math.round(netProfit),
        totalReturn: Number(totalReturnPercent.toFixed(2)),
        annualizedReturn: Number(annualizedReturn.toFixed(2)),
        cashOnCashReturn: Number(cashOnCashReturn.toFixed(2)),
      },
    },
    sensitivity: {
      rentChanges,
      priceChanges,
      interestRateChanges,
    },
    riskMetrics: {
      loanToValue: purchasePrice ? (loanAmount / purchasePrice) * 100 : 0,
      debtServiceCoverageRatio: annualMortgagePayment > 0 ? netOperatingIncome / annualMortgagePayment : 0,
      grossYield,
      netYield,
      capitalizationRate: capRate,
      vacancyBuffer: vacancyRate,
    },
    metadata: {
      generatedDate: purchaseDate || new Date().toISOString(),
      reportVersion: '1.0',
      analyst: 'YieldPulse Platform',
      disclaimer: 'This report is for informational purposes only and does not constitute investment advice.',
    },
    // Extra fields used by templates
    capitalGrowth,
    rentGrowth: rentGrowthRate,
    grossYield,
    netYield,
    cashOnCashReturn,
    monthlyCashFlow,
    annualCashFlow,
    capRate,
    initialInvestment: totalInitialInvestment,
    costPerSqFt,
    rentPerSqFt,
    reportDate,
    grossIncome,
    vacancyLoss,
    vacancyPercent: vacancyRate,
    effectiveIncome,
    serviceCost,
    servicePercent: effectiveIncome ? (serviceCost / effectiveIncome) * 100 : 0,
    maintenanceCost,
    maintenancePercent: effectiveIncome ? (maintenanceCost / effectiveIncome) * 100 : 0,
    managementCost,
    managementPercent: effectiveIncome ? (managementCost / effectiveIncome) * 100 : 0,
    totalExpenses,
    totalExpensesPercent: effectiveIncome ? (totalExpenses / effectiveIncome) * 100 : 0,
    netOperatingIncome,
    mortgagePayment: annualMortgagePayment,
    mortgagePercent: effectiveIncome ? (annualMortgagePayment / effectiveIncome) * 100 : 0,
    propertyValueYear1,
    propertyValueYear5,
    equityYear1,
    equityYear5,
    cumulativeCashFlow,
    totalReturn: totalReturnPercent,
    annualizedReturn,
  };
}
