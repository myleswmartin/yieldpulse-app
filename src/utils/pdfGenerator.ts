import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency, formatPercent } from './calculations';

export interface ReportSnapshot {
  inputs: {
    portal_source?: string;
    listing_url?: string;
    purchase_price: number;
    expected_monthly_rent: number;
    down_payment_percent: number;
    mortgage_interest_rate: number;
    loan_term_years: number;
    service_charge_per_year: number;
    maintenance_per_year: number;
    property_management_fee: number;
    vacancy_rate?: number;
    rent_growth_rate: number;
    capital_growth_rate: number;
    holding_period_years: number;
    area_sqft?: number;
  };
  results: {
    // Core metrics
    grossYield?: number;
    gross_yield?: number;
    grossRentalYield?: number;
    netYield?: number;
    net_yield?: number;
    netRentalYield?: number;
    cashOnCashReturn?: number;
    cash_on_cash_return?: number;
    capRate?: number;
    monthlyCashFlow?: number;
    monthly_cash_flow?: number;
    annualCashFlow?: number;
    annual_cash_flow?: number;
    monthlyMortgagePayment?: number;
    monthly_mortgage_payment?: number;
    totalOperatingCosts?: number;
    monthlyIncome?: number;
    annualIncome?: number;
    costPerSqft?: number;
    rentPerSqft?: number;
    
    // Initial investment components
    downPaymentAmount?: number;
    down_payment_amount?: number;
    dldFee?: number;
    dld_fee?: number;
    agentFee?: number;
    agent_fee?: number;
    otherClosingCosts?: number;
    other_closing_costs?: number;
    totalInitialInvestment?: number;
    total_initial_investment?: number;
    
    // Loan details
    loanAmount?: number;
    loan_amount?: number;
    annualMortgagePayment?: number;
    annual_mortgage_payment?: number;
    
    // Operating expense breakdown
    annualServiceCharge?: number;
    annualMaintenanceCosts?: number;
    annualPropertyManagementFee?: number;
    totalAnnualOperatingExpenses?: number;
    grossAnnualRentalIncome?: number;
    effectiveAnnualRentalIncome?: number;
    netOperatingIncome?: number;
    vacancyAmount?: number;
    
    // Amortization
    firstYearAmortization?: {
      principal: number;
      interest: number;
    };
    totalInterestOverTerm?: number;
    
    // Exit scenario
    sellingFee?: number;
    selling_fee?: number;
    
    // 5-year projection
    projection?: Array<{
      year: number;
      propertyValue: number;
      remainingLoanBalance: number;
      equity: number;
      annualRent: number;
      operatingExpenses: number;
      noi: number;
      cashFlow: number;
      cumulativeCashFlow: number;
      saleProceeds: number;
      totalReturn: number;
      roiPercent: number;
    }>;
    
    // Sensitivity analysis
    sensitivityAnalysis?: {
      rentScenarios: Array<{
        label: string;
        value: number;
        annualCashFlow: number;
        cashOnCashReturn: number;
        additionalMetric?: number;
      }>;
      vacancyRateScenarios: Array<{
        label: string;
        value: number;
        annualCashFlow: number;
        cashOnCashReturn: number;
      }>;
      interestRateScenarios: Array<{
        label: string;
        value: number;
        annualCashFlow: number;
        cashOnCashReturn: number;
      }>;
    };
  };
}

// ==================== CANONICAL SNAPSHOT NORMALIZATION ====================
interface CanonicalSnapshot {
  inputs: {
    portal_source: string;
    listing_url: string;
    purchase_price: number;
    expected_monthly_rent: number;
    down_payment_percent: number;
    mortgage_interest_rate: number;
    loan_term_years: number;
    service_charge_per_year: number;
    maintenance_per_year: number;
    property_management_fee: number;
    vacancy_rate: number;
    rent_growth_rate: number;
    capital_growth_rate: number;
    holding_period_years: number;
    area_sqft: number | null;
  };
  results: {
    grossYield: number;
    netYield: number;
    cashOnCashReturn: number;
    capRate: number | null;
    monthlyCashFlow: number;
    annualCashFlow: number;
    monthlyMortgagePayment: number;
    totalOperatingCosts: number;
    monthlyIncome: number;
    annualIncome: number;
    costPerSqft: number | null;
    rentPerSqft: number | null;
    downPaymentAmount: number;
    dldFee: number;
    agentFee: number;
    otherClosingCosts: number;
    totalInitialInvestment: number;
    loanAmount: number;
    annualMortgagePayment: number;
    annualServiceCharge: number;
    annualMaintenanceCosts: number;
    annualPropertyManagementFee: number;
    totalAnnualOperatingExpenses: number;
    grossAnnualRentalIncome: number;
    effectiveAnnualRentalIncome: number;
    netOperatingIncome: number;
    vacancyAmount: number;
    firstYearAmortization: {
      principal: number;
      interest: number;
    };
    totalInterestOverTerm: number;
    sellingFee: number;
    projection: Array<{
      year: number;
      propertyValue: number;
      remainingLoanBalance: number;
      equity: number;
      annualRent: number;
      operatingExpenses: number;
      noi: number;
      cashFlow: number;
      cumulativeCashFlow: number;
      saleProceeds: number;
      totalReturn: number;
      roiPercent: number;
    }>;
    sensitivityAnalysis: {
      rentScenarios: Array<{
        label: string;
        value: number;
        annualCashFlow: number;
        cashOnCashReturn: number;
        additionalMetric?: number;
      }>;
      vacancyRateScenarios: Array<{
        label: string;
        value: number;
        annualCashFlow: number;
        cashOnCashReturn: number;
      }>;
      interestRateScenarios: Array<{
        label: string;
        value: number;
        annualCashFlow: number;
        cashOnCashReturn: number;
      }>;
    } | null;
  };
}

function normalizeSnapshot(raw: ReportSnapshot): CanonicalSnapshot {
  const r = raw.results;
  const i = raw.inputs;
  
  // Calculate derived values FIRST so we can use them as fallbacks
  const grossAnnualRentalIncome = r.grossAnnualRentalIncome ?? (i.expected_monthly_rent * 12);
  const vacancyRate = i.vacancy_rate ?? 5;
  const vacancyAmount = r.vacancyAmount ?? (grossAnnualRentalIncome * (vacancyRate / 100));
  const effectiveAnnualRentalIncome = r.effectiveAnnualRentalIncome ?? (grossAnnualRentalIncome - vacancyAmount);
  
  const annualServiceCharge = r.annualServiceCharge ?? i.service_charge_per_year;
  const annualMaintenanceCosts = r.annualMaintenanceCosts ?? (i.purchase_price * (i.maintenance_per_year / 100));
  const annualPropertyManagementFee = r.annualPropertyManagementFee ?? (effectiveAnnualRentalIncome * (i.property_management_fee / 100));
  const totalAnnualOperatingExpenses = r.totalAnnualOperatingExpenses ?? (annualServiceCharge + annualMaintenanceCosts + annualPropertyManagementFee);
  const netOperatingIncome = r.netOperatingIncome ?? (effectiveAnnualRentalIncome - totalAnnualOperatingExpenses);
  
  const loanAmount = r.loanAmount ?? r.loan_amount ?? (i.purchase_price * (1 - i.down_payment_percent / 100));
  const monthlyMortgagePayment = r.monthlyMortgagePayment ?? r.monthly_mortgage_payment ?? 0;
  const annualMortgagePayment = r.annualMortgagePayment ?? r.annual_mortgage_payment ?? (monthlyMortgagePayment * 12);
  
  const monthlyCashFlow = r.monthlyCashFlow ?? r.monthly_cash_flow ?? 0;
  const annualCashFlow = r.annualCashFlow ?? r.annual_cash_flow ?? (monthlyCashFlow * 12);
  
  const downPaymentAmount = r.downPaymentAmount ?? r.down_payment_amount ?? (i.purchase_price * (i.down_payment_percent / 100));
  const dldFee = r.dldFee ?? r.dld_fee ?? (i.purchase_price * 0.04);
  const agentFee = r.agentFee ?? r.agent_fee ?? (i.purchase_price * 0.02);
  const otherClosingCosts = r.otherClosingCosts ?? r.other_closing_costs ?? (i.purchase_price * 0.005);
  const totalInitialInvestment = r.totalInitialInvestment ?? r.total_initial_investment ?? (downPaymentAmount + dldFee + agentFee + otherClosingCosts);
  
  // Handle both camelCase and snake_case with CALCULATED FALLBACK if all variants missing
  // Gross Yield = (Annual Rent / Purchase Price) × 100
  const calculatedGrossYield = (grossAnnualRentalIncome / i.purchase_price) * 100;
  const grossYield = r.grossYield ?? r.gross_yield ?? r.grossRentalYield ?? calculatedGrossYield;
  
  // Net Yield = ((Annual Rent - Operating Expenses - Vacancy) / Purchase Price) × 100
  const calculatedNetYield = ((grossAnnualRentalIncome - totalAnnualOperatingExpenses - vacancyAmount) / i.purchase_price) * 100;
  const netYield = r.netYield ?? r.net_yield ?? r.netRentalYield ?? calculatedNetYield;
  
  // Cash on Cash = (Annual Cash Flow / Total Initial Investment) × 100
  const calculatedCashOnCash = totalInitialInvestment > 0 ? (annualCashFlow / totalInitialInvestment) * 100 : 0;
  const cashOnCashReturn = r.cashOnCashReturn ?? r.cash_on_cash_return ?? calculatedCashOnCash;
  
  // Calculate first year amortization if missing
  let firstYearAmortization = r.firstYearAmortization;
  if (!firstYearAmortization || !firstYearAmortization.principal || !firstYearAmortization.interest) {
    const firstYearInterest = loanAmount * (i.mortgage_interest_rate / 100);
    const firstYearPrincipal = annualMortgagePayment - firstYearInterest;
    firstYearAmortization = {
      principal: firstYearPrincipal,
      interest: firstYearInterest
    };
  }
  
  const totalInterestOverTerm = r.totalInterestOverTerm ?? ((monthlyMortgagePayment * i.loan_term_years * 12) - loanAmount);
  
  // Selling fee calculation - derive if missing or zero
  const sellingFee = r.sellingFee ?? r.selling_fee ?? 0;
  const derivedSellingFee = sellingFee > 0 ? sellingFee : (r.projection && r.projection[i.holding_period_years - 1] ? r.projection[i.holding_period_years - 1].propertyValue * 0.02 : i.purchase_price * Math.pow(1 + i.capital_growth_rate / 100, i.holding_period_years) * 0.02);
  
  return {
    inputs: {
      portal_source: i.portal_source ?? 'Property',
      listing_url: i.listing_url ?? '',
      purchase_price: i.purchase_price,
      expected_monthly_rent: i.expected_monthly_rent,
      down_payment_percent: i.down_payment_percent,
      mortgage_interest_rate: i.mortgage_interest_rate,
      loan_term_years: i.loan_term_years,
      service_charge_per_year: i.service_charge_per_year,
      maintenance_per_year: i.maintenance_per_year,
      property_management_fee: i.property_management_fee,
      vacancy_rate: vacancyRate,
      rent_growth_rate: i.rent_growth_rate,
      capital_growth_rate: i.capital_growth_rate,
      holding_period_years: i.holding_period_years,
      area_sqft: i.area_sqft ?? null,
    },
    results: {
      grossYield,
      netYield,
      cashOnCashReturn,
      capRate: r.capRate ?? null,
      monthlyCashFlow,
      annualCashFlow,
      monthlyMortgagePayment,
      totalOperatingCosts: totalAnnualOperatingExpenses,
      monthlyIncome: i.expected_monthly_rent,
      annualIncome: grossAnnualRentalIncome,
      costPerSqft: r.costPerSqft ?? (i.area_sqft ? i.purchase_price / i.area_sqft : null),
      rentPerSqft: r.rentPerSqft ?? (i.area_sqft ? grossAnnualRentalIncome / i.area_sqft : null),
      downPaymentAmount,
      dldFee,
      agentFee,
      otherClosingCosts,
      totalInitialInvestment,
      loanAmount,
      annualMortgagePayment,
      annualServiceCharge,
      annualMaintenanceCosts,
      annualPropertyManagementFee,
      totalAnnualOperatingExpenses,
      grossAnnualRentalIncome,
      effectiveAnnualRentalIncome,
      netOperatingIncome,
      vacancyAmount,
      firstYearAmortization,
      totalInterestOverTerm,
      sellingFee: derivedSellingFee,
      projection: r.projection ?? [],
      sensitivityAnalysis: r.sensitivityAnalysis ?? null,
    },
  };
}

// ==================== DESIGN SYSTEM & BRAND TOKENS ====================

// Color Palette
const COLORS = {
  // Primary brand colors
  navy: [30, 40, 117] as [number, number, number],
  teal: [20, 184, 166] as [number, number, number],
  
  // Semantic colors
  success: [16, 185, 129] as [number, number, number],
  destructive: [220, 38, 38] as [number, number, number],
  warning: [245, 158, 11] as [number, number, number],
  
  // Neutrals
  text: [51, 65, 85] as [number, number, number],
  textLight: [100, 116, 139] as [number, number, number],
  textMuted: [148, 163, 184] as [number, number, number],
  border: [226, 232, 240] as [number, number, number],
  bgLight: [248, 250, 252] as [number, number, number],
  bgMuted: [241, 245, 249] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
};

// Typography Scale
const TYPE = {
  // Font sizes in pt
  cover: 36,
  coverSub: 20,
  title: 16,
  sectionTitle: 14,
  subsection: 10,
  body: 9,
  bodySmall: 8,
  caption: 7,
  
  // Line heights (multiplier)
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.8,
  },
};

// Spacing Scale (in mm)
const SPACE = {
  xs: 2,
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
  xxl: 16,
  xxxl: 24,
};

// Layout Constants
const LAYOUT = {
  pageWidth: 210, // A4 width in mm
  pageHeight: 297, // A4 height in mm
  marginX: 20, // Left and right margins
  marginTop: 25, // Top margin for content pages
  footerSafeZone: 25, // Minimum clearance from bottom
  headerHeight: 15, // Reserved space for header
  sectionHeaderHeight: 14, // Height including underline and spacing
  contentWidth: 170, // pageWidth - (2 * marginX)
};

// Chart Configuration
const CHART = {
  barWidth: 14,
  barSpacing: 5,
  chartHeight: 70,
  labelFontSize: 7,
  valueFontSize: 6,
};

// Card and Panel Styles
const PANEL = {
  borderRadius: 2,
  borderWidth: 0.4,
  padding: SPACE.md,
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Format negative values with parentheses instead of minus sign
 */
function formatNumber(value: number, currency: boolean = false): string {
  if (currency) {
    if (value < 0) {
      return `(${formatCurrency(Math.abs(value))})`;
    }
    return formatCurrency(value);
  }
  if (value < 0) {
    return `(${Math.abs(value).toFixed(2)})`;
  }
  return value.toFixed(2);
}

/**
 * Ensures sufficient space on current page, accounting for footer safe zone.
 * If insufficient space, creates new page and returns top margin position.
 */
function ensureSpace(doc: jsPDF, requiredSpace: number, currentY: number): number {
  const maxContentY = LAYOUT.pageHeight - LAYOUT.footerSafeZone;
  
  if (currentY + requiredSpace > maxContentY) {
    doc.addPage();
    return LAYOUT.marginTop;
  }
  return currentY;
}

/**
 * Renders a major section header with guaranteed space for header and minimum content.
 * This prevents orphaned headings by ensuring at least minContentHeight follows the header.
 */
function renderSectionHeader(doc: jsPDF, title: string, yPos: number, minContentHeight: number = 35): number {
  // Ensure space for header + minimum content block
  const totalRequired = LAYOUT.sectionHeaderHeight + minContentHeight;
  const safeY = ensureSpace(doc, totalRequired, yPos);
  
  // Render the header
  doc.setFontSize(TYPE.title);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.navy);
  doc.text(title, LAYOUT.marginX, safeY);
  
  // Teal underline
  doc.setDrawColor(...COLORS.teal);
  doc.setLineWidth(1);
  const titleWidth = doc.getTextWidth(title);
  doc.line(LAYOUT.marginX, safeY + 2, LAYOUT.marginX + titleWidth + 15, safeY + 2);
  
  return safeY + LAYOUT.sectionHeaderHeight;
}

/**
 * Renders a subsection header
 */
function renderSubsection(doc: jsPDF, title: string, yPos: number): number {
  const y = ensureSpace(doc, 15, yPos);
  
  doc.setFontSize(TYPE.subsection);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.text);
  doc.text(title, LAYOUT.marginX, y);
  
  return y + 6;
}

/**
 * Renders an interpretation/insight box with light background
 */
function renderInterpretationBox(doc: jsPDF, text: string, yPos: number): number {
  const y = ensureSpace(doc, 20, yPos);
  
  doc.setFontSize(TYPE.bodySmall);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.text);
  
  const wrapped = doc.splitTextToSize(text, LAYOUT.contentWidth - (2 * PANEL.padding));
  const boxHeight = (wrapped.length * TYPE.bodySmall * 0.4) + (2 * PANEL.padding);
  
  // Background
  doc.setFillColor(...COLORS.bgMuted);
  doc.setDrawColor(...COLORS.border);
  doc.setLineWidth(PANEL.borderWidth);
  doc.roundedRect(LAYOUT.marginX, y, LAYOUT.contentWidth, boxHeight, PANEL.borderRadius, PANEL.borderRadius, 'FD');
  
  // Icon or label
  doc.setFontSize(TYPE.caption);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.teal);
  doc.text('INSIGHT', LAYOUT.marginX + PANEL.padding, y + PANEL.padding);
  
  // Text
  doc.setFontSize(TYPE.bodySmall);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.text);
  doc.text(wrapped, LAYOUT.marginX + PANEL.padding, y + PANEL.padding + 4);
  
  return y + boxHeight + SPACE.lg;
}

/**
 * Renders a compact KPI cell for the 3x3 Executive Summary grid
 */
function renderKPICell(
  doc: jsPDF,
  label: string,
  value: string,
  x: number,
  y: number,
  width: number,
  height: number,
  color: [number, number, number]
): void {
  // Cell background and border
  doc.setFillColor(...COLORS.white);
  doc.setDrawColor(...COLORS.border);
  doc.setLineWidth(PANEL.borderWidth);
  doc.roundedRect(x, y, width, height, PANEL.borderRadius, PANEL.borderRadius, 'FD');
  
  // Label (compact, 8pt for 11px equivalent)
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.textLight);
  doc.text(label.toUpperCase(), x + width / 2, y + 5, { align: 'center' });
  
  // Value (prominent but not oversized, 12pt for 18px equivalent)
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...color);
  doc.text(value, x + width / 2, y + height - 4, { align: 'center' });
}

/**
 * Renders a metric card (for Executive Summary) - DEPRECATED, use renderKPICell
 */
function renderMetricCard(
  doc: jsPDF,
  label: string,
  value: string,
  x: number,
  y: number,
  width: number,
  color: [number, number, number]
): void {
  const cardHeight = 22;
  
  // Card background and border
  doc.setFillColor(...COLORS.white);
  doc.setDrawColor(...COLORS.border);
  doc.setLineWidth(PANEL.borderWidth);
  doc.roundedRect(x, y, width, cardHeight, PANEL.borderRadius, PANEL.borderRadius, 'FD');
  
  // Label
  doc.setFontSize(TYPE.caption);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.textLight);
  doc.text(label.toUpperCase(), x + width / 2, y + 6, { align: 'center' });
  
  // Value
  doc.setFontSize(TYPE.sectionTitle);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...color);
  doc.text(value, x + width / 2, y + 15, { align: 'center' });
}

/**
 * Renders a professional data table using autoTable with consistent styling
 */
function renderTable(
  doc: jsPDF,
  startY: number,
  head: string[][],
  body: string[][],
  options: any = {}
): number {
  autoTable(doc, {
    startY,
    head,
    body,
    theme: 'plain',
    headStyles: {
      fillColor: COLORS.bgLight,
      textColor: COLORS.navy,
      fontStyle: 'bold',
      fontSize: TYPE.bodySmall,
      halign: 'left',
      valign: 'middle',
      cellPadding: { top: 3, bottom: 3, left: 4, right: 4 },
    },
    bodyStyles: {
      fontSize: TYPE.bodySmall,
      textColor: COLORS.text,
      cellPadding: { top: 2.5, bottom: 2.5, left: 4, right: 4 },
    },
    alternateRowStyles: {
      fillColor: COLORS.white,
    },
    margin: { left: LAYOUT.marginX, right: LAYOUT.marginX },
    tableLineColor: COLORS.border,
    tableLineWidth: 0.3,
    ...options,
  });
  
  return (doc as any).lastAutoTable.finalY + SPACE.lg;
}

// ==================== SECTION RENDERERS ====================

/**
 * COVER PAGE
 * Premium investor-grade cover with brand identity
 */
function renderCoverPage(doc: jsPDF, snapshot: CanonicalSnapshot, exportDate: string): void {
  const centerX = LAYOUT.pageWidth / 2;
  
  // Top accent line
  doc.setDrawColor(...COLORS.teal);
  doc.setLineWidth(1.5);
  doc.line(LAYOUT.marginX, 40, LAYOUT.pageWidth - LAYOUT.marginX, 40);
  
  // YieldPulse wordmark
  doc.setFontSize(TYPE.cover);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.navy);
  doc.text('YieldPulse', centerX, 65, { align: 'center' });
  
  // Subtitle
  doc.setFontSize(TYPE.coverSub);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.teal);
  doc.text('Premium Investment Report', centerX, 80, { align: 'center' });
  
  // Property identifier
  doc.setFontSize(TYPE.sectionTitle);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.text);
  doc.text(snapshot.inputs.portal_source, centerX, 105, { align: 'center' });
  
  // Key inputs panel
  const panelY = 125;
  const panelHeight = 50;
  doc.setFillColor(...COLORS.bgLight);
  doc.setDrawColor(...COLORS.border);
  doc.setLineWidth(PANEL.borderWidth);
  doc.roundedRect(40, panelY, LAYOUT.pageWidth - 80, panelHeight, PANEL.borderRadius, PANEL.borderRadius, 'FD');
  
  doc.setFontSize(TYPE.bodySmall);
  let lineY = panelY + 10;
  
  const inputs = [
    ['Purchase Price', formatCurrency(snapshot.inputs.purchase_price)],
    ['Expected Rent', `${formatCurrency(snapshot.inputs.expected_monthly_rent)}/month`],
    ['Down Payment', `${formatPercent(snapshot.inputs.down_payment_percent)}`],
    ['Interest Rate', `${formatPercent(snapshot.inputs.mortgage_interest_rate)}`],
    ['Holding Period', `${snapshot.inputs.holding_period_years} years`],
  ];
  
  inputs.forEach(([label, value]) => {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.textLight);
    doc.text(label, 50, lineY);
    
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.text);
    doc.text(value, LAYOUT.pageWidth - 50, lineY, { align: 'right' });
    
    lineY += 8;
  });
  
  // Export date
  doc.setFontSize(TYPE.body);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.textMuted);
  doc.text(`Generated: ${exportDate}`, centerX, 195, { align: 'center' });
  
  // Bottom disclaimer
  doc.setFontSize(TYPE.caption);
  doc.setTextColor(...COLORS.textMuted);
  const disclaimer = 'This report is for informational purposes only. YieldPulse is not a financial advisor. Please consult a licensed professional before making investment decisions.';
  const wrappedDisclaimer = doc.splitTextToSize(disclaimer, LAYOUT.pageWidth - 60);
  doc.text(wrappedDisclaimer, centerX, LAYOUT.pageHeight - 40, { align: 'center' });
  
  // Powered by
  doc.setFontSize(TYPE.bodySmall);
  doc.setTextColor(...COLORS.textMuted);
  doc.text('Powered by YieldPulse & Constructive', centerX, LAYOUT.pageHeight - 20, { align: 'center' });
}

/**
 * PROPERTY DETAILS & FINANCING TERMS
 */
function renderPropertySummary(doc: jsPDF, snapshot: CanonicalSnapshot, yPos: number): number {
  let y = renderSectionHeader(doc, 'Property Details & Financing Terms', yPos, 55);
  
  // Two-column panel
  const panelHeight = 50;
  doc.setFillColor(...COLORS.white);
  doc.setDrawColor(...COLORS.border);
  doc.setLineWidth(PANEL.borderWidth);
  doc.roundedRect(LAYOUT.marginX, y, LAYOUT.contentWidth, panelHeight, PANEL.borderRadius, PANEL.borderRadius, 'FD');
  
  doc.setFontSize(TYPE.bodySmall);
  let panelY = y + 7;
  const col1X = LAYOUT.marginX + 8;
  const col1ValueX = LAYOUT.marginX + LAYOUT.contentWidth / 2 - 15;
  const col2X = LAYOUT.marginX + LAYOUT.contentWidth / 2 + 5;
  const col2ValueX = LAYOUT.marginX + LAYOUT.contentWidth - 10;
  
  const leftCol = [
    ['Purchase Price', formatCurrency(snapshot.inputs.purchase_price)],
    ['Expected Rent', `${formatCurrency(snapshot.inputs.expected_monthly_rent)}/mo`],
    ['Down Payment', formatPercent(snapshot.inputs.down_payment_percent)],
    ['Interest Rate', formatPercent(snapshot.inputs.mortgage_interest_rate)],
  ];
  
  const rightCol = [
    ['Loan Term', `${snapshot.inputs.loan_term_years} years`],
    ['Holding Period', `${snapshot.inputs.holding_period_years} years`],
    ['Capital Growth', `${formatPercent(snapshot.inputs.capital_growth_rate)}/yr`],
    ['Rent Growth', `${formatPercent(snapshot.inputs.rent_growth_rate)}/yr`],
  ];
  
  leftCol.forEach(([label, value]) => {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.textLight);
    doc.text(label, col1X, panelY);
    
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.text);
    doc.text(value, col1ValueX, panelY, { align: 'right' });
    
    panelY += 7;
  });
  
  panelY = y + 7;
  rightCol.forEach(([label, value]) => {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.textLight);
    doc.text(label, col2X, panelY);
    
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.text);
    doc.text(value, col2ValueX, panelY, { align: 'right' });
    
    panelY += 7;
  });
  
  return y + panelHeight + SPACE.xl;
}

/**
 * SECTION 1: EXECUTIVE SUMMARY
 * Compact 3×3 KPI grid for investor-focused quick scanning
 */
function renderExecutiveSummary(doc: jsPDF, snapshot: CanonicalSnapshot, yPos: number): number {
  let y = renderSectionHeader(doc, '1. Executive Summary', yPos, 65);
  
  // 3×3 Grid Configuration
  const gridCols = 3;
  const gridRows = 3;
  const cellSpacing = 4; // Tight spacing between cells
  const cellHeight = 18; // Compact cell height
  const cellWidth = (LAYOUT.contentWidth - (2 * cellSpacing)) / gridCols;
  
  // Define all 9 KPIs in mandatory order
  const kpis = [
    // Row 1: Yield Metrics
    { label: 'Gross Yield', value: formatPercent(snapshot.results.grossYield), color: COLORS.teal },
    { label: 'Net Yield', value: formatPercent(snapshot.results.netYield), color: COLORS.teal },
    { label: 'Cash on Cash Return', value: formatPercent(snapshot.results.cashOnCashReturn), color: COLORS.navy },
    
    // Row 2: Cash Flow Metrics
    { label: 'Monthly Cash Flow', value: formatNumber(snapshot.results.monthlyCashFlow, true), color: snapshot.results.monthlyCashFlow >= 0 ? COLORS.success : COLORS.destructive },
    { label: 'Annual Cash Flow', value: formatNumber(snapshot.results.annualCashFlow, true), color: snapshot.results.annualCashFlow >= 0 ? COLORS.success : COLORS.destructive },
    { label: 'CAP Rate', value: snapshot.results.capRate !== null ? formatPercent(snapshot.results.capRate) : 'N/A', color: COLORS.navy },
    
    // Row 3: Cost Metrics
    { label: 'Initial Investment', value: formatCurrency(snapshot.results.totalInitialInvestment), color: COLORS.text },
    { label: 'Cost per Sq Ft', value: snapshot.results.costPerSqft !== null ? formatCurrency(snapshot.results.costPerSqft) : 'N/A', color: COLORS.text },
    { label: 'Rent per Sq Ft (Annual)', value: snapshot.results.rentPerSqft !== null ? formatCurrency(snapshot.results.rentPerSqft) : 'N/A', color: COLORS.text },
  ];
  
  // Render 3×3 grid
  kpis.forEach((kpi, index) => {
    const row = Math.floor(index / gridCols);
    const col = index % gridCols;
    
    const x = LAYOUT.marginX + col * (cellWidth + cellSpacing);
    const cellY = y + row * (cellHeight + cellSpacing);
    
    renderKPICell(doc, kpi.label, kpi.value, x, cellY, cellWidth, cellHeight, kpi.color);
  });
  
  // Move past the grid (3 rows of cells + spacing)
  y += (gridRows * (cellHeight + cellSpacing)) + SPACE.md;
  
  // Interpretation box with reduced top margin
  const interpretation = `This property generates ${formatPercent(snapshot.results.grossYield)} gross rental yield and ${formatPercent(snapshot.results.netYield)} net yield after operating expenses and vacancy. Your ${formatCurrency(snapshot.results.totalInitialInvestment)} initial investment produces ${formatNumber(snapshot.results.annualCashFlow, true)} annual cash flow (${formatNumber(snapshot.results.monthlyCashFlow, true)}/month), representing ${formatPercent(snapshot.results.cashOnCashReturn)} cash-on-cash return.`;
  y = renderInterpretationBox(doc, interpretation, y);
  
  return y;
}

/**
 * SECTION 2: UNDERSTANDING THE METRICS
 * Expanded explanations of each metric with formulas and applied values
 */
function renderUnderstandingMetrics(doc: jsPDF, snapshot: CanonicalSnapshot, yPos: number): number {
  let y = renderSectionHeader(doc, '2. Understanding the Metrics', yPos, 45);
  
  const metrics = [
    {
      title: 'Gross Rental Yield',
      definition: 'Measures annual rental income as a percentage of purchase price before deducting any expenses.',
      formula: 'Formula: (Annual Rent ÷ Purchase Price) × 100',
      applied: `Your calculation: (${formatCurrency(snapshot.results.grossAnnualRentalIncome)} ÷ ${formatCurrency(snapshot.inputs.purchase_price)}) × 100 = ${formatPercent(snapshot.results.grossYield)}`
    },
    {
      title: 'Net Rental Yield',
      definition: 'Measures rental income after deducting operating expenses and vacancy as a percentage of purchase price.',
      formula: 'Formula: ((Annual Rent - Operating Expenses - Vacancy) ÷ Purchase Price) × 100',
      applied: `Your calculation: ((${formatCurrency(snapshot.results.grossAnnualRentalIncome)} - ${formatCurrency(snapshot.results.totalAnnualOperatingExpenses)} - ${formatCurrency(snapshot.results.vacancyAmount)}) ÷ ${formatCurrency(snapshot.inputs.purchase_price)}) × 100 = ${formatPercent(snapshot.results.netYield)}`
    },
    {
      title: 'Cash Flow',
      definition: 'The actual money you receive each period after all expenses and debt service are paid.',
      formula: 'Formula: Net Operating Income - Mortgage Payment',
      applied: `Your calculation: ${formatCurrency(snapshot.results.netOperatingIncome)} - ${formatCurrency(snapshot.results.annualMortgagePayment)} = ${formatCurrency(snapshot.results.annualCashFlow)} annually (${formatNumber(snapshot.results.monthlyCashFlow, true)}/month)`
    },
    {
      title: 'Cash on Cash Return',
      definition: 'Measures your actual annual return as a percentage of the cash you invested upfront.',
      formula: 'Formula: (Annual Cash Flow ÷ Total Initial Investment) × 100',
      applied: `Your calculation: (${formatCurrency(snapshot.results.annualCashFlow)} ÷ ${formatCurrency(snapshot.results.totalInitialInvestment)}) × 100 = ${formatPercent(snapshot.results.cashOnCashReturn)}`
    },
  ];
  
  metrics.forEach(metric => {
    y = ensureSpace(doc, 25, y);
    
    // Title
    doc.setFontSize(TYPE.subsection);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.navy);
    doc.text(metric.title, LAYOUT.marginX, y);
    y += 5;
    
    // Definition
    doc.setFontSize(TYPE.bodySmall);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.text);
    const defWrapped = doc.splitTextToSize(metric.definition, LAYOUT.contentWidth);
    doc.text(defWrapped, LAYOUT.marginX, y);
    y += defWrapped.length * 3.5;
    
    // Formula
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(...COLORS.textLight);
    doc.text(metric.formula, LAYOUT.marginX + 5, y);
    y += 4;
    
    // Applied
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.teal);
    const appliedWrapped = doc.splitTextToSize(metric.applied, LAYOUT.contentWidth - 5);
    doc.text(appliedWrapped, LAYOUT.marginX + 5, y);
    y += appliedWrapped.length * 3.5 + SPACE.md;
  });
  
  return y + SPACE.sm;
}

/**
 * SECTION 2: YEAR ONE FINANCIAL DEEP DIVE
 * Professional waterfall chart showing income to cash flow bridge
 */
function renderYearOneDeepDive(doc: jsPDF, snapshot: CanonicalSnapshot, yPos: number): number {
  let y = renderSectionHeader(doc, '2. Year One Financial Deep Dive', yPos, 100);
  
  // Chart title
  doc.setFontSize(TYPE.subsection);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.text);
  doc.text('Annual Income & Expense Flow', LAYOUT.marginX, y);
  y += SPACE.md;
  
  // Chart data
  const chartData = [
    { label: 'Gross\nIncome', value: snapshot.results.grossAnnualRentalIncome, color: COLORS.teal },
    { label: 'Vacancy\nLoss', value: -snapshot.results.vacancyAmount, color: COLORS.destructive },
    { label: 'Effective\nIncome', value: snapshot.results.effectiveAnnualRentalIncome, color: COLORS.success },
    { label: 'Service\nCharge', value: -snapshot.results.annualServiceCharge, color: COLORS.destructive },
    { label: 'Maint-\nenance', value: -snapshot.results.annualMaintenanceCosts, color: COLORS.destructive },
    { label: 'Mgmt\nFee', value: -snapshot.results.annualPropertyManagementFee, color: COLORS.destructive },
    { label: 'Net Op.\nIncome', value: snapshot.results.netOperatingIncome, color: COLORS.success },
    { label: 'Mortgage\nPayment', value: -snapshot.results.annualMortgagePayment, color: COLORS.destructive },
    { label: 'Cash\nFlow', value: snapshot.results.annualCashFlow, color: snapshot.results.annualCashFlow >= 0 ? COLORS.success : COLORS.destructive },
  ];
  
  // Chart dimensions
  const chartWidth = LAYOUT.contentWidth;
  const chartHeight = CHART.chartHeight;
  const maxValue = Math.max(...chartData.map(d => Math.abs(d.value)));
  const scale = (chartHeight * 0.9) / maxValue;
  const baselineY = y + chartHeight / 2;
  const totalBarWidth = chartData.length * (CHART.barWidth + CHART.barSpacing);
  const chartStartX = LAYOUT.marginX + (chartWidth - totalBarWidth) / 2;
  
  // Draw baseline
  doc.setDrawColor(...COLORS.textMuted);
  doc.setLineWidth(0.5);
  doc.line(LAYOUT.marginX, baselineY, LAYOUT.marginX + chartWidth, baselineY);
  
  // Zero label
  doc.setFontSize(CHART.labelFontSize);
  doc.setTextColor(...COLORS.textMuted);
  doc.text('0', LAYOUT.marginX - 3, baselineY + 1, { align: 'right' });
  
  // Draw bars
  chartData.forEach((item, index) => {
    const barX = chartStartX + index * (CHART.barWidth + CHART.barSpacing);
    const barHeight = Math.abs(item.value) * scale;
    const barY = item.value >= 0 ? baselineY - barHeight : baselineY;
    
    // Only draw bar if height is valid
    if (barHeight > 0 && isFinite(barHeight)) {
      doc.setFillColor(...item.color);
      doc.roundedRect(barX, barY, CHART.barWidth, barHeight, 1, 1, 'F');
    }
    
    // Value label above/below bar
    doc.setFontSize(CHART.valueFontSize);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...item.color);
    const valueText = `${(item.value / 1000).toFixed(0)}k`;
    const valueLabelY = item.value >= 0 ? barY - 2 : barY + barHeight + 3;
    doc.text(valueText, barX + CHART.barWidth / 2, valueLabelY, { align: 'center' });
    
    // Bar label below baseline
    doc.setFontSize(CHART.labelFontSize);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.text);
    const labelLines = item.label.split('\n');
    labelLines.forEach((line, lineIndex) => {
      doc.text(line, barX + CHART.barWidth / 2, baselineY + 5 + (lineIndex * 3), { align: 'center' });
    });
  });
  
  y = baselineY + 18;
  
  // Chart caption
  doc.setFontSize(TYPE.caption);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(...COLORS.textMuted);
  doc.text('Bridge from gross rental income to net cash flow after all expenses and debt service.', LAYOUT.marginX, y);
  y += SPACE.lg;
  
  // Operating expense breakdown table
  y = ensureSpace(doc, 45, y);
  y = renderSubsection(doc, 'Operating Expense Breakdown', y);
  
  y = renderTable(doc, y, 
    [['Category', 'Annual Cost', '% of Effective Income']],
    [
      ['Service Charge', formatCurrency(snapshot.results.annualServiceCharge), formatPercent((snapshot.results.annualServiceCharge / snapshot.results.effectiveAnnualRentalIncome) * 100)],
      ['Maintenance Costs', formatCurrency(snapshot.results.annualMaintenanceCosts), formatPercent((snapshot.results.annualMaintenanceCosts / snapshot.results.effectiveAnnualRentalIncome) * 100)],
      ['Property Management', formatCurrency(snapshot.results.annualPropertyManagementFee), formatPercent((snapshot.results.annualPropertyManagementFee / snapshot.results.effectiveAnnualRentalIncome) * 100)],
      ['Total Operating Expenses', formatCurrency(snapshot.results.totalAnnualOperatingExpenses), formatPercent((snapshot.results.totalAnnualOperatingExpenses / snapshot.results.effectiveAnnualRentalIncome) * 100)],
    ],
    {
      didParseCell: (data: any) => {
        if (data.row.index === 3 && data.section === 'body') {
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.fillColor = COLORS.bgLight;
        }
      }
    }
  );
  
  // Interpretation
  const vacancyLossPercent = (snapshot.results.vacancyAmount / snapshot.results.grossAnnualRentalIncome) * 100;
  const opexPercent = (snapshot.results.totalAnnualOperatingExpenses / snapshot.results.effectiveAnnualRentalIncome) * 100;
  const mortgagePercent = (snapshot.results.annualMortgagePayment / snapshot.results.netOperatingIncome) * 100;
  
  const interpretation = `Vacancy reduces gross income by ${formatPercent(vacancyLossPercent)} (${formatCurrency(snapshot.results.vacancyAmount)}). Operating expenses consume ${formatPercent(opexPercent)} of effective income, leaving ${formatCurrency(snapshot.results.netOperatingIncome)} NOI. Mortgage payments of ${formatCurrency(snapshot.results.annualMortgagePayment)} (${formatPercent(mortgagePercent)} of NOI) result in ${formatNumber(snapshot.results.annualCashFlow, true)} annual cash flow.`;
  y = renderInterpretationBox(doc, interpretation, y);
  
  return y;
}

/**
 * SECTION 3: UPFRONT CAPITAL REQUIREMENT
 */
function renderUpfrontCapital(doc: jsPDF, snapshot: CanonicalSnapshot, yPos: number): number {
  let y = renderSectionHeader(doc, '3. Upfront Capital Requirement', yPos, 50);
  
  doc.setFontSize(TYPE.bodySmall);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.textLight);
  doc.text('Total cash required to complete the purchase:', LAYOUT.marginX, y);
  y += SPACE.lg;
  
  y = renderTable(doc, y,
    [['Component', 'Amount', '% of Price', '% of Total Investment']],
    [
      ['Down Payment (Equity)', formatCurrency(snapshot.results.downPaymentAmount), formatPercent(snapshot.inputs.down_payment_percent), formatPercent((snapshot.results.downPaymentAmount / snapshot.results.totalInitialInvestment) * 100)],
      ['DLD Registration Fee', formatCurrency(snapshot.results.dldFee), '4.00%', formatPercent((snapshot.results.dldFee / snapshot.results.totalInitialInvestment) * 100)],
      ['Agent Commission', formatCurrency(snapshot.results.agentFee), '2.00%', formatPercent((snapshot.results.agentFee / snapshot.results.totalInitialInvestment) * 100)],
      ['Other Closing Costs', formatCurrency(snapshot.results.otherClosingCosts), '0.50%', formatPercent((snapshot.results.otherClosingCosts / snapshot.results.totalInitialInvestment) * 100)],
      ['Total Initial Investment', formatCurrency(snapshot.results.totalInitialInvestment), '', '100.00%'],
    ],
    {
      didParseCell: (data: any) => {
        if (data.row.index === 0 && data.section === 'body') {
          data.cell.styles.fillColor = [220, 252, 231]; // Light green
          data.cell.styles.fontStyle = 'bold';
        }
        if (data.row.index === 4 && data.section === 'body') {
          data.cell.styles.fillColor = COLORS.bgLight;
          data.cell.styles.fontStyle = 'bold';
        }
      }
    }
  );
  
  const feeAmount = snapshot.results.totalInitialInvestment - snapshot.results.downPaymentAmount;
  const feePercent = (feeAmount / snapshot.results.totalInitialInvestment) * 100;
  
  const interpretation = `Your down payment of ${formatCurrency(snapshot.results.downPaymentAmount)} represents ${formatPercent(snapshot.inputs.down_payment_percent)} of purchase price and becomes immediate equity. Transaction fees (DLD, agent, closing costs) total ${formatCurrency(feeAmount)}, representing ${formatPercent(feePercent)} of your total investment. These fees are non-recoverable acquisition costs that increase your effective cost basis.`;
  y = renderInterpretationBox(doc, interpretation, y);
  
  return y;
}

/**
 * SECTION 4: MORTGAGE BREAKDOWN
 */
function renderMortgageBreakdown(doc: jsPDF, snapshot: CanonicalSnapshot, yPos: number): number {
  let y = renderSectionHeader(doc, '4. Mortgage Breakdown', yPos, 75);
  
  // Loan details panel
  const panelHeight = 60;
  doc.setFillColor(...COLORS.white);
  doc.setDrawColor(...COLORS.border);
  doc.setLineWidth(PANEL.borderWidth);
  doc.roundedRect(LAYOUT.marginX, y, LAYOUT.contentWidth, panelHeight, PANEL.borderRadius, PANEL.borderRadius, 'FD');
  
  doc.setFontSize(TYPE.bodySmall);
  let panelY = y + 7;
  const col1X = LAYOUT.marginX + 8;
  const col1ValueX = LAYOUT.marginX + LAYOUT.contentWidth / 2 - 15;
  const col2X = LAYOUT.marginX + LAYOUT.contentWidth / 2 + 5;
  const col2ValueX = LAYOUT.marginX + LAYOUT.contentWidth - 10;
  
  const ltv = (snapshot.results.loanAmount / snapshot.inputs.purchase_price) * 100;
  
  const leftCol = [
    ['Loan Amount', formatCurrency(snapshot.results.loanAmount)],
    ['Loan-to-Value (LTV)', formatPercent(ltv)],
    ['Interest Rate', `${formatPercent(snapshot.inputs.mortgage_interest_rate)} p.a.`],
    ['Loan Term', `${snapshot.inputs.loan_term_years} years`],
  ];
  
  const rightCol = [
    ['Monthly Payment', formatCurrency(snapshot.results.monthlyMortgagePayment)],
    ['Annual Payment', formatCurrency(snapshot.results.annualMortgagePayment)],
    ['First Year Interest', formatCurrency(snapshot.results.firstYearAmortization.interest)],
    ['First Year Principal', formatCurrency(snapshot.results.firstYearAmortization.principal)],
  ];
  
  leftCol.forEach(([label, value]) => {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.textLight);
    doc.text(label, col1X, panelY);
    
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.text);
    doc.text(value, col1ValueX, panelY, { align: 'right' });
    
    panelY += 7.5;
  });
  
  panelY = y + 7;
  rightCol.forEach(([label, value]) => {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.textLight);
    doc.text(label, col2X, panelY);
    
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.text);
    doc.text(value, col2ValueX, panelY, { align: 'right' });
    
    panelY += 7.5;
  });
  
  y += panelHeight + SPACE.lg;
  
  // Amortization insight
  y = renderSubsection(doc, 'First Year Amortization', y);
  
  const principalPercent = (snapshot.results.firstYearAmortization.principal / snapshot.results.annualMortgagePayment) * 100;
  const interestPercent = (snapshot.results.firstYearAmortization.interest / snapshot.results.annualMortgagePayment) * 100;
  
  doc.setFontSize(TYPE.bodySmall);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.text);
  const amortText = `In Year 1, ${formatPercent(interestPercent)} of your mortgage payment goes to interest (${formatCurrency(snapshot.results.firstYearAmortization.interest)}), with only ${formatPercent(principalPercent)} reducing principal (${formatCurrency(snapshot.results.firstYearAmortization.principal)}). Over the full ${snapshot.inputs.loan_term_years}-year term, you will pay ${formatCurrency(snapshot.results.totalInterestOverTerm)} in total interest.`;
  const amortWrapped = doc.splitTextToSize(amortText, LAYOUT.contentWidth);
  doc.text(amortWrapped, LAYOUT.marginX, y);
  y += amortWrapped.length * 3.5 + SPACE.lg;
  
  const interpretation = `Your loan of ${formatCurrency(snapshot.results.loanAmount)} (${formatPercent(ltv)} LTV) requires ${formatCurrency(snapshot.results.monthlyMortgagePayment)} monthly payments. Early years are interest-heavy: ${formatCurrency(snapshot.results.firstYearAmortization.interest)} interest versus ${formatCurrency(snapshot.results.firstYearAmortization.principal)} principal in Year 1. True property cost including interest is ${formatCurrency(snapshot.inputs.purchase_price + snapshot.results.totalInterestOverTerm)}.`;
  y = renderInterpretationBox(doc, interpretation, y);
  
  return y;
}

/**
 * SECTION 5: FIVE YEAR INVESTMENT OUTCOME
 */
function renderFiveYearOutcome(doc: jsPDF, snapshot: CanonicalSnapshot, yPos: number): number {
  let y = renderSectionHeader(doc, '5. Five Year Investment Outcome', yPos, 60);
  
  if (snapshot.results.projection.length === 0) {
    doc.setFontSize(TYPE.bodySmall);
    doc.setTextColor(...COLORS.textMuted);
    doc.text('Projection data not available for this analysis.', LAYOUT.marginX, y);
    return y + SPACE.xl;
  }
  
  const finalYear = snapshot.results.projection[snapshot.inputs.holding_period_years - 1];
  
  doc.setFontSize(TYPE.bodySmall);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.textLight);
  doc.text(`Assuming ${formatPercent(snapshot.inputs.capital_growth_rate)} annual appreciation and ${formatPercent(snapshot.inputs.rent_growth_rate)} rent growth:`, LAYOUT.marginX, y);
  y += SPACE.lg;
  
  y = renderTable(doc, y,
    [['Component', 'Amount']],
    [
      ['Final Property Value', formatCurrency(finalYear.propertyValue)],
      ['Remaining Loan Balance', formatNumber(finalYear.remainingLoanBalance, true)],
      ['Your Equity', formatCurrency(finalYear.equity)],
      ['Cumulative Cash Flow', formatNumber(finalYear.cumulativeCashFlow, true)],
      ['Less: Selling Fee (2%)', formatNumber(-snapshot.results.sellingFee, true)],
      ['Net Sale Proceeds', formatCurrency(finalYear.saleProceeds)],
      ['Total Return', formatCurrency(finalYear.totalReturn)],
      ['Return on Investment (ROI)', formatPercent(finalYear.roiPercent)],
    ],
    {
      didParseCell: (data: any) => {
        if (data.row.index === 6 || data.row.index === 7) {
          data.cell.styles.fillColor = COLORS.bgLight;
          data.cell.styles.fontStyle = 'bold';
        }
      }
    }
  );
  
  const appreciationGain = finalYear.propertyValue - snapshot.inputs.purchase_price;
  const cashFlowContribution = finalYear.cumulativeCashFlow;
  const totalReturn = finalYear.totalReturn;
  const appreciationPercent = (appreciationGain / totalReturn) * 100;
  const cashFlowContrib = (cashFlowContribution / totalReturn) * 100;
  
  const interpretation = `After ${snapshot.inputs.holding_period_years} years, property appreciation generates ${formatCurrency(appreciationGain)} gain (${formatPercent(appreciationPercent)} of total return), while cumulative rental cash flow contributes ${formatCurrency(cashFlowContribution)} (${formatPercent(cashFlowContrib)}). After deducting ${formatCurrency(snapshot.results.sellingFee)} selling fee and ${formatCurrency(finalYear.remainingLoanBalance)} loan payoff, your ${formatCurrency(snapshot.results.totalInitialInvestment)} investment becomes ${formatCurrency(finalYear.totalReturn)}, representing ${formatPercent(finalYear.roiPercent)} total ROI.`;
  y = renderInterpretationBox(doc, interpretation, y);
  
  return y;
}

/**
 * SECTION 6: SENSITIVITY ANALYSIS
 */
function renderSensitivityAnalysis(doc: jsPDF, snapshot: CanonicalSnapshot, yPos: number): number {
  let y = renderSectionHeader(doc, '6. Sensitivity Analysis', yPos, 55);
  
  if (!snapshot.results.sensitivityAnalysis) {
    doc.setFontSize(TYPE.bodySmall);
    doc.setTextColor(...COLORS.textMuted);
    doc.text('Sensitivity analysis not available for this report.', LAYOUT.marginX, y);
    return y + SPACE.xl;
  }
  
  const sa = snapshot.results.sensitivityAnalysis;
  
  doc.setFontSize(TYPE.bodySmall);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.textLight);
  doc.text('Understanding how changes in key assumptions impact your returns:', LAYOUT.marginX, y);
  y += SPACE.xl;
  
  // Rent sensitivity
  y = renderSubsection(doc, 'Rent Sensitivity', y);
  
  y = renderTable(doc, y,
    [['Scenario', 'Monthly Rent', 'Annual Cash Flow', 'CoC Return']],
    sa.rentScenarios.map(s => [
      s.label,
      formatCurrency(s.value),
      formatNumber(s.annualCashFlow, true),
      formatPercent(s.cashOnCashReturn),
    ])
  );
  
  const rentInterpretation = `A 10% rent decrease reduces cash flow to ${formatNumber(sa.rentScenarios[1].annualCashFlow, true)} (${formatPercent(sa.rentScenarios[1].cashOnCashReturn)} CoC). Conversely, 10% higher rent increases cash flow to ${formatNumber(sa.rentScenarios[3].annualCashFlow, true)} (${formatPercent(sa.rentScenarios[3].cashOnCashReturn)} CoC), demonstrating ${formatCurrency(Math.abs(sa.rentScenarios[3].annualCashFlow - snapshot.results.annualCashFlow))} annual upside.`;
  y = renderInterpretationBox(doc, rentInterpretation, y);
  
  // Vacancy sensitivity
  y = ensureSpace(doc, 55, y);
  y = renderSubsection(doc, 'Vacancy Rate Sensitivity', y);
  
  y = renderTable(doc, y,
    [['Vacancy Rate', 'Annual Cash Flow', 'CoC Return']],
    sa.vacancyRateScenarios.map(s => [
      formatPercent(s.value),
      formatNumber(s.annualCashFlow, true),
      formatPercent(s.cashOnCashReturn),
    ])
  );
  
  const vacancyInterpretation = `Your analysis assumes ${formatPercent(snapshot.inputs.vacancy_rate)} vacancy. Zero vacancy improves cash flow to ${formatNumber(sa.vacancyRateScenarios[0].annualCashFlow, true)}. At 20% vacancy (worst case), cash flow falls to ${formatNumber(sa.vacancyRateScenarios[4].annualCashFlow, true)}, highlighting the importance of tenant retention.`;
  y = renderInterpretationBox(doc, vacancyInterpretation, y);
  
  // Interest rate sensitivity
  y = ensureSpace(doc, 55, y);
  y = renderSubsection(doc, 'Interest Rate Sensitivity', y);
  
  y = renderTable(doc, y,
    [['Interest Rate', 'Annual Cash Flow', 'CoC Return']],
    sa.interestRateScenarios.map(s => [
      formatPercent(s.value),
      formatNumber(s.annualCashFlow, true),
      formatPercent(s.cashOnCashReturn),
    ])
  );
  
  const rateImpact = Math.abs(sa.interestRateScenarios[3].annualCashFlow - sa.interestRateScenarios[2].annualCashFlow);
  const rateInterpretation = `Each 1% change in interest rate impacts annual cash flow by approximately ${formatCurrency(rateImpact)}. At ${formatPercent(sa.interestRateScenarios[1].value)}, cash flow is ${formatNumber(sa.interestRateScenarios[1].annualCashFlow, true)}. At ${formatPercent(sa.interestRateScenarios[3].value)}, it falls to ${formatNumber(sa.interestRateScenarios[3].annualCashFlow, true)}, demonstrating financing cost sensitivity.`;
  y = renderInterpretationBox(doc, rateInterpretation, y);
  
  return y;
}

/**
 * SECTION 7: INPUT AND ASSUMPTION VERIFICATION
 */
function renderInputVerification(doc: jsPDF, snapshot: CanonicalSnapshot, yPos: number): number {
  let y = renderSectionHeader(doc, '7. Input and Assumption Verification', yPos, 50);
  
  doc.setFontSize(TYPE.bodySmall);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.textLight);
  doc.text('All calculations in this report are based on the following inputs and standard assumptions:', LAYOUT.marginX, y);
  y += SPACE.xl;
  
  y = renderSubsection(doc, 'Your Inputs', y);
  
  y = renderTable(doc, y,
    [['Input Field', 'Value']],
    [
      ['Property Source', snapshot.inputs.portal_source],
      ['Purchase Price', formatCurrency(snapshot.inputs.purchase_price)],
      ['Expected Monthly Rent', formatCurrency(snapshot.inputs.expected_monthly_rent)],
      ['Down Payment', formatPercent(snapshot.inputs.down_payment_percent)],
      ['Mortgage Interest Rate', formatPercent(snapshot.inputs.mortgage_interest_rate)],
      ['Loan Term', `${snapshot.inputs.loan_term_years} years`],
      ['Vacancy Rate', formatPercent(snapshot.inputs.vacancy_rate)],
      ['Service Charge (Annual)', formatCurrency(snapshot.inputs.service_charge_per_year)],
      ['Maintenance Budget', `${formatPercent(snapshot.inputs.maintenance_per_year)} of price`],
      ['Property Mgmt Fee', `${formatPercent(snapshot.inputs.property_management_fee)} of rent`],
      ['Holding Period', `${snapshot.inputs.holding_period_years} years`],
      ['Capital Growth', `${formatPercent(snapshot.inputs.capital_growth_rate)}/year`],
      ['Rent Growth', `${formatPercent(snapshot.inputs.rent_growth_rate)}/year`],
    ]
  );
  
  y = renderSubsection(doc, 'System Constants & Assumptions', y);
  
  y = renderTable(doc, y,
    [['Assumption', 'Value', 'Basis']],
    [
      ['DLD Registration Fee', '4% of purchase price', 'Dubai Land Department standard rate'],
      ['Agent Commission', '2% of purchase price', 'UAE market standard for buyer\'s agent'],
      ['Other Closing Costs', '0.5% of purchase price', 'Estimated (valuation, NOC, legal fees)'],
      ['Selling Fee at Exit', '2% of future value', 'UAE market standard for seller\'s agent'],
    ]
  );
  
  return y;
}

/**
 * SECTION 8: CALCULATION FORMULAS
 */
function renderCalculationFormulas(doc: jsPDF, snapshot: CanonicalSnapshot, yPos: number): number {
  let y = renderSectionHeader(doc, '8. Calculation Formulas', yPos, 55);
  
  doc.setFontSize(TYPE.bodySmall);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.textLight);
  doc.text('Core metric calculations with your actual numbers:', LAYOUT.marginX, y);
  y += SPACE.xl;
  
  const formulas = [
    {
      title: 'Gross Rental Yield',
      formula: 'Formula: (Annual Rent ÷ Purchase Price) × 100',
      calculation: `Calculation: (${formatCurrency(snapshot.results.grossAnnualRentalIncome)} ÷ ${formatCurrency(snapshot.inputs.purchase_price)}) × 100 = ${formatPercent(snapshot.results.grossYield)}`
    },
    {
      title: 'Net Rental Yield',
      formula: 'Formula: ((Annual Rent - Operating Expenses - Vacancy) ÷ Purchase Price) × 100',
      calculation: `Calculation: ((${formatCurrency(snapshot.results.grossAnnualRentalIncome)} - ${formatCurrency(snapshot.results.totalAnnualOperatingExpenses)} - ${formatCurrency(snapshot.results.vacancyAmount)}) ÷ ${formatCurrency(snapshot.inputs.purchase_price)}) × 100 = ${formatPercent(snapshot.results.netYield)}`
    },
    {
      title: 'Cash on Cash Return',
      formula: 'Formula: (Annual Cash Flow ÷ Total Initial Investment) × 100',
      calculation: `Calculation: (${formatNumber(snapshot.results.annualCashFlow, true)} ÷ ${formatCurrency(snapshot.results.totalInitialInvestment)}) × 100 = ${formatPercent(snapshot.results.cashOnCashReturn)}`
    },
    {
      title: 'Monthly Cash Flow',
      formula: 'Formula: (Effective Monthly Rent - Operating Expenses - Mortgage Payment)',
      calculation: `Calculation: (${formatCurrency(snapshot.results.effectiveAnnualRentalIncome / 12)} - ${formatCurrency(snapshot.results.totalAnnualOperatingExpenses / 12)} - ${formatCurrency(snapshot.results.monthlyMortgagePayment)}) = ${formatNumber(snapshot.results.monthlyCashFlow, true)}`
    },
  ];
  
  formulas.forEach(item => {
    y = ensureSpace(doc, 20, y);
    
    // Title
    doc.setFontSize(TYPE.subsection);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.navy);
    doc.text(item.title, LAYOUT.marginX, y);
    y += 5;
    
    // Formula
    doc.setFontSize(TYPE.bodySmall);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(...COLORS.textLight);
    doc.text(item.formula, LAYOUT.marginX + 3, y);
    y += 4;
    
    // Calculation
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.teal);
    const calcWrapped = doc.splitTextToSize(item.calculation, LAYOUT.contentWidth - 6);
    doc.text(calcWrapped, LAYOUT.marginX + 3, y);
    y += calcWrapped.length * 3.5 + SPACE.md;
  });
  
  return y;
}

// ==================== MAIN PDF GENERATION FUNCTION ====================

export async function generatePDF(
  rawSnapshot: ReportSnapshot,
  purchaseDate: string,
  fileNameOverride?: string
): Promise<void> {
  // Normalize snapshot to canonical form
  const snapshot = normalizeSnapshot(rawSnapshot);
  
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });
  
  // Generate actual export timestamp (NOW)
  const exportTimestamp = new Date().toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  // Render all sections
  renderCoverPage(doc, snapshot, exportTimestamp);
  
  doc.addPage();
  let y = LAYOUT.marginTop;
  
  y = renderPropertySummary(doc, snapshot, y);
  y = renderExecutiveSummary(doc, snapshot, y);
  y = renderYearOneDeepDive(doc, snapshot, y);
  y = renderUpfrontCapital(doc, snapshot, y);
  y = renderMortgageBreakdown(doc, snapshot, y);
  y = renderFiveYearOutcome(doc, snapshot, y);
  y = renderSensitivityAnalysis(doc, snapshot, y);
  y = renderInputVerification(doc, snapshot, y);
  
  // ==================== STAMP HEADERS AND FOOTERS ====================
  const totalPages = doc.getNumberOfPages();
  
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    const isFirstPage = i === 1;
    
    if (!isFirstPage) {
      // Header
      doc.setFontSize(TYPE.caption);
      doc.setTextColor(...COLORS.textMuted);
      doc.setFont('helvetica', 'normal');
      doc.text('YieldPulse Premium Report', LAYOUT.marginX, 12);
      doc.text(exportTimestamp, LAYOUT.pageWidth / 2, 12, { align: 'center' });
      doc.text(`Page ${i} of ${totalPages}`, LAYOUT.pageWidth - LAYOUT.marginX, 12, { align: 'right' });
      
      doc.setDrawColor(...COLORS.border);
      doc.setLineWidth(0.3);
      doc.line(LAYOUT.marginX, 14, LAYOUT.pageWidth - LAYOUT.marginX, 14);
      
      // Footer
      const footerY = LAYOUT.pageHeight - 12;
      doc.setDrawColor(...COLORS.border);
      doc.setLineWidth(0.3);
      doc.line(LAYOUT.marginX, footerY - 3, LAYOUT.pageWidth - LAYOUT.marginX, footerY - 3);
      
      doc.setFontSize(TYPE.caption);
      doc.setTextColor(...COLORS.textMuted);
      doc.text('YieldPulse is for informational purposes only. Consult a licensed advisor.', LAYOUT.marginX, footerY);
      doc.text('Powered by YieldPulse & Constructive', LAYOUT.pageWidth - LAYOUT.marginX, footerY, { align: 'right' });
    }
  }
  
  // ==================== SAVE PDF ====================
  const propertyName = snapshot.inputs.portal_source || 'Property';
  const fileName = fileNameOverride || `YieldPulse_${propertyName.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  
  doc.save(fileName);
}
