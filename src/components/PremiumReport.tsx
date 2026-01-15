import { ChevronDown, ChevronUp } from 'lucide-react';
import { CalculationResults, formatCurrency, formatPercent, PropertyInputs } from '../utils/calculations';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from 'recharts';
import { useState } from 'react';
import { ExecutiveSummary } from './ExecutiveSummary';
import { ReportCoverPage } from './ReportCoverPage';

interface PremiumReportProps {
  displayResults: CalculationResults;
  displayInputs: Partial<PropertyInputs>;
  vacancyAmount: number;
  firstYearAmortization: { principal: number; interest: number };
  totalInterestOverTerm: number;
  sellingFee: number;
  analysisId?: string | null;
  notes?: string | null;
}

export function PremiumReport({
  displayResults,
  displayInputs,
  vacancyAmount,
  firstYearAmortization,
  totalInterestOverTerm,
  sellingFee,
  analysisId,
  notes,
}: PremiumReportProps) {
  const [showMethodology, setShowMethodology] = useState(false);
  const [showAssumptions, setShowAssumptions] = useState(false);
  const [showVacancyRisk, setShowVacancyRisk] = useState(false);
  const [showInterestRateRisk, setShowInterestRateRisk] = useState(false);

  // Determine if this is sample mode
  const isSampleMode = displayInputs.propertyName?.includes('Sample Property');

  // Format current date for header
  const currentDate = new Date().toLocaleDateString('en-GB', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  });

  // Chart data
  const waterfallData = [
    { name: 'Gross Income', value: displayResults.grossAnnualRentalIncome, fill: '#14b8a6' },
    { name: 'Vacancy', value: -vacancyAmount, fill: '#ef4444' },
    { name: 'Effective Income', value: displayResults.effectiveAnnualRentalIncome, fill: '#14b8a6' },
    { name: 'Service Charge', value: -displayResults.annualServiceCharge, fill: '#ef4444' },
    { name: 'Maintenance', value: -displayResults.annualMaintenanceCosts, fill: '#ef4444' },
    { name: 'Property Mgmt', value: -displayResults.annualPropertyManagementFee, fill: '#ef4444' },
    { name: 'NOI', value: displayResults.netOperatingIncome, fill: '#14b8a6' },
    { name: 'Mortgage', value: -displayResults.annualMortgagePayment, fill: '#ef4444' },
    { name: 'Net Cash Flow', value: displayResults.annualCashFlow, fill: displayResults.annualCashFlow >= 0 ? '#10b981' : '#dc2626' }
  ];

  return (
    <>
      <div className="space-y-8 pdf-page-container">
      
      {/* Cover Page */}
      <ReportCoverPage displayInputs={displayInputs as PropertyInputs} isSampleMode={isSampleMode} />
      
      {/* Professional Disclaimer - All Reports */}
      <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 mb-6 page-break-avoid">
        <h3 className="text-sm font-bold text-foreground mb-2">Important Information</h3>
        <p className="text-xs text-neutral-700 leading-snug">
          <strong>Please Note:</strong> This report provides data-driven projections for informational purposes only and does not constitute financial, investment, legal, or tax advice. Past performance and projections are not guarantees of future results. Property investment involves risk, and actual outcomes may vary significantly based on market conditions, property-specific factors, and individual circumstances. We strongly recommend consulting with qualified financial advisors, legal professionals, and tax consultants before making any investment decisions.
        </p>
      </div>
      
      {/* SECTION 0: Executive Summary - Key Metrics at a Glance */}
      <ExecutiveSummary displayResults={displayResults} isSampleMode={isSampleMode} />
      
      {/* SECTION 1: 5-Year Investment Outcome (Previously Section 6 - Exit Scenario) */}
      {displayResults.projection && displayResults.projection.length >= 5 && (
        <section className="page-break-before pdf-section page-break-avoid">
          <h2 className="text-2xl font-bold text-foreground mb-4 pdf-h2">1. Five-Year Investment Outcome</h2>
          
          {/* Callout */}
          <div className="mb-4 p-3 bg-primary/10 border-2 border-primary/30 rounded-xl">
            <p className="text-sm font-semibold text-foreground leading-snug">
              {isSampleMode ? 'This example illustrates:' : 'If you sell in Year 5:'} {isSampleMode ? 'a' : 'this'} scenario {isSampleMode ? 'showing' : 'projects'} total wealth created of {formatCurrency(displayResults.projection[4].totalReturn)}, which is a {formatPercent(displayResults.projection[4].roiPercent)} return on {isSampleMode ? 'the' : 'your'} initial investment.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-border overflow-hidden mb-6">
            {isSampleMode && (
              <div className="px-4 py-2 bg-neutral-50 border-b border-border">
                <p className="text-xs text-neutral-600 italic">Values shown use example inputs</p>
              </div>
            )}
            <table className="w-full">
              <thead>
                <tr className="bg-neutral-50">
                  <th className="text-left py-3 px-4 font-semibold text-foreground text-sm">Line Item</th>
                  <th className="text-right py-3 px-4 font-semibold text-foreground text-sm">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground text-sm">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="bg-white">
                  <td className="py-3 px-4 text-sm text-neutral-700">Property Value (Year 5)</td>
                  <td className="py-3 px-4 text-sm text-right font-medium text-foreground">{formatCurrency(displayResults.projection[4].propertyValue)}</td>
                  <td className="py-3 px-4 text-sm text-neutral-600">
                    {formatPercent(((displayResults.projection[4].propertyValue / displayInputs.purchasePrice - 1) * 100))} total growth 
                    ({formatPercent(displayInputs.capitalGrowthPercent || 0)} annually)
                  </td>
                </tr>
                <tr className="bg-neutral-50">
                  <td className="py-3 px-4 text-sm text-neutral-700">Less: Remaining Loan Balance</td>
                  <td className="py-3 px-4 text-sm text-right font-medium text-destructive">-{formatCurrency(displayResults.projection[4].remainingLoanBalance)}</td>
                  <td className="py-3 px-4 text-sm text-neutral-600">Outstanding mortgage principal</td>
                </tr>
                <tr className="bg-white">
                  <td className="py-3 px-4 text-sm text-neutral-700 italic">Less: Selling Agent Fee (2%)*</td>
                  <td className="py-3 px-4 text-sm text-right font-medium text-destructive">-{formatCurrency(sellingFee)}</td>
                  <td className="py-3 px-4 text-sm text-neutral-600">UAE market standard estimate</td>
                </tr>
                <tr className="bg-neutral-100">
                  <td className="py-3 px-4 text-sm font-semibold text-foreground">Net Sale Proceeds</td>
                  <td className="py-3 px-4 text-sm text-right font-bold text-success">{formatCurrency(displayResults.projection[4].saleProceeds)}</td>
                  <td className="py-3 px-4 text-sm text-neutral-700">Cash from sale after payoffs</td>
                </tr>
                <tr className="bg-white">
                  <td colSpan={3} className="py-2"></td>
                </tr>
                <tr className="bg-neutral-50">
                  <td className="py-3 px-4 text-sm text-neutral-700">Plus: Cumulative Cash Flow (5 years)</td>
                  <td className={`py-3 px-4 text-sm text-right font-medium ${displayResults.projection[4].cumulativeCashFlow >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {displayResults.projection[4].cumulativeCashFlow >= 0 ? '+' : ''}{formatCurrency(displayResults.projection[4].cumulativeCashFlow)}
                  </td>
                  <td className="py-3 px-4 text-sm text-neutral-600">Total rental income minus expenses</td>
                </tr>
                <tr className="bg-white">
                  <td className="py-3 px-4 text-sm text-neutral-700">Less: Initial Investment</td>
                  <td className="py-3 px-4 text-sm text-right font-medium text-destructive">-{formatCurrency(displayResults.totalInitialInvestment)}</td>
                  <td className="py-3 px-4 text-sm text-neutral-600">Your original capital outlay</td>
                </tr>
                <tr className="bg-teal/10">
                  <td className="py-3 px-4 text-sm font-bold text-foreground">Total Wealth Created</td>
                  <td className={`py-3 px-4 text-sm text-right font-bold text-lg ${displayResults.projection[4].totalReturn >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {formatCurrency(displayResults.projection[4].totalReturn)}
                  </td>
                  <td className="py-3 px-4 text-sm text-neutral-700">Net gain/loss from investment</td>
                </tr>
                <tr className="bg-white">
                  <td colSpan={3} className="py-2"></td>
                </tr>
                <tr className="bg-primary/5">
                  <td className="py-3 px-4 text-sm font-bold text-foreground">Return on Investment</td>
                  <td className="py-3 px-4 text-sm text-right font-bold text-primary text-lg">{formatPercent(displayResults.projection[4].roiPercent)}</td>
                  <td className="py-3 px-4 text-sm text-neutral-700">Total return as % of initial investment</td>
                </tr>
              </tbody>
            </table>
            <div className="px-4 py-2 bg-neutral-50 border-t border-border">
              <p className="text-xs text-neutral-500 italic">
                * 2% selling agent fee is a standard UAE market assumption. Actual fees negotiable.
              </p>
            </div>
          </div>

          <div className="text-sm text-neutral-700 leading-relaxed space-y-3 p-4 bg-neutral-50 rounded-lg">
            <p>
              <strong>Sale Scenario:</strong> {isSampleMode ? 'In this example, if the property sells' : 'If you sell this property'} in Year 5, {isSampleMode ? 'the' : 'your'} projected outcome is: 
              {isSampleMode ? 'The example' : 'Your'} property, valued at {formatCurrency(displayResults.projection[4].propertyValue)}, minus {isSampleMode ? 'the' : 'your'} remaining loan balance 
              of {formatCurrency(displayResults.projection[4].remainingLoanBalance)} and selling costs of {formatCurrency(sellingFee)}, 
              yields net sale proceeds of {formatCurrency(displayResults.projection[4].saleProceeds)}.
            </p>
            <p>
              <strong>Total Return:</strong> Adding {isSampleMode ? 'a' : 'your'} {displayResults.projection[4].cumulativeCashFlow >= 0 ? 'positive' : 'negative'} cumulative 
              cash flow of {formatCurrency(displayResults.projection[4].cumulativeCashFlow)} over 5 years, and subtracting {isSampleMode ? 'the' : 'your'} initial investment 
              of {formatCurrency(displayResults.totalInitialInvestment)}, {isSampleMode ? 'this example shows' : 'your'} total wealth created {isSampleMode ? 'of' : 'is'} {formatCurrency(displayResults.projection[4].totalReturn)}.
            </p>
            <p>
              This represents a {formatPercent(displayResults.projection[4].roiPercent)} return on {isSampleMode ? 'the' : 'your'} initial capital over {displayInputs.holdingPeriodYears || 5} years, 
              or approximately {formatPercent(displayResults.projection[4].roiPercent / (displayInputs.holdingPeriodYears || 5))} per year on a simple average basis (total return divided by {displayInputs.holdingPeriodYears || 5} years).
            </p>
            <p className="text-xs text-neutral-600 italic">
              Key Assumptions: This analysis assumes {formatPercent(displayInputs.capitalGrowthPercent || 0)} annual property appreciation, {formatPercent(displayInputs.rentGrowthPercent || 0)} annual 
              rent growth, and a 2% selling agent fee. Actual returns will vary based on market conditions, actual rent achieved, and exit timing.
            </p>
          </div>
        </section>
      )}

      {/* SECTION 2: Year-by-Year Financial Trajectory (Previously Section 5 - Five Year Projection) */}
      {displayResults.projection && displayResults.projection.length >= 5 && (
        <section className="page-break-before pdf-section page-break-avoid print-landscape">
          <h2 className="text-2xl font-bold text-foreground mb-4 pdf-h2">2. Year-by-Year Financial Trajectory</h2>
          
          {/* Callout */}
          <div className="mb-6 p-4 bg-primary/10 border-2 border-primary/30 rounded-xl">
            <p className="text-base font-semibold text-foreground leading-relaxed">
              {isSampleMode ? 'This example illustrates' : 'Your'} equity {isSampleMode ? 'growth' : 'is projected to grow'} from {formatCurrency(displayResults.projection[0].equity)} in Year 1 to {formatCurrency(displayResults.projection[4].equity)} in Year 5, alongside cumulative cash flow of {formatCurrency(displayResults.projection[4].cumulativeCashFlow)}.
            </p>
            <p className="text-sm text-foreground leading-relaxed mt-3">
              <strong>Note on timing:</strong> Executive Summary metrics reflect today's inputs without growth applied. The Year by Year table shows end of year projections, so Year 1 already includes {formatPercent(displayInputs.rentGrowthPercent || 0)} rent growth and {formatPercent(displayInputs.capitalGrowthPercent || 0)} property value growth.
            </p>
          </div>

          <div className="five-year-table-wrapper">
            <div className="bg-white rounded-xl border border-border overflow-x-auto mb-6 pdf-component">
              {isSampleMode && (
                <div className="px-4 py-2 bg-neutral-50 border-b border-border">
                  <p className="text-xs text-neutral-600 italic">Values shown use example inputs</p>
                </div>
              )}
              <table className="w-full text-xs five-year-table">
              <thead>
                <tr className="bg-neutral-50">
                  <th className="text-left py-3 px-3 font-semibold text-foreground pdf-table-header">Year</th>
                  <th className="text-right py-3 px-3 font-semibold text-foreground pdf-table-header print-abbrev">Prop Value</th>
                  <th className="text-right py-3 px-3 font-semibold text-foreground pdf-table-header">Equity</th>
                  <th className="text-right py-3 px-3 font-semibold text-foreground pdf-table-header print-abbrev">Loan Bal</th>
                  <th className="text-right py-3 px-3 font-semibold text-foreground pdf-table-header print-abbrev">Annual Rent</th>
                  <th className="text-right py-3 px-3 font-semibold text-foreground pdf-table-header print-abbrev">Op Expenses</th>
                  <th className="text-right py-3 px-3 font-semibold text-foreground pdf-table-header">NOI</th>
                  <th className="text-right py-3 px-3 font-semibold text-foreground pdf-table-header print-abbrev">Cash Flow</th>
                  <th className="text-right py-3 px-3 font-semibold text-foreground pdf-table-header print-abbrev">Cumul CF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {displayResults.projection.slice(0, 5).map((year, index) => (
                  <tr key={year.year} className={index % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}>
                    <td className="py-3 px-3 font-medium text-foreground pdf-table-body">{year.year}</td>
                    <td className="py-3 px-3 text-right text-neutral-700 pdf-table-body tabular-nums">{formatCurrency(year.propertyValue)}</td>
                    <td className="py-3 px-3 text-right text-success font-medium pdf-table-body tabular-nums">{formatCurrency(year.equity)}</td>
                    <td className="py-3 px-3 text-right text-neutral-600 pdf-table-body tabular-nums">{formatCurrency(year.remainingLoanBalance)}</td>
                    <td className="py-3 px-3 text-right text-neutral-700 pdf-table-body tabular-nums">{formatCurrency(year.annualRent)}</td>
                    <td className="py-3 px-3 text-right text-neutral-600 pdf-table-body tabular-nums">{formatCurrency(year.operatingExpenses)}</td>
                    <td className="py-3 px-3 text-right text-teal font-medium pdf-table-body tabular-nums">{formatCurrency(year.noi)}</td>
                    <td className={`py-3 px-3 text-right font-medium pdf-table-body tabular-nums ${year.cashFlow >= 0 ? 'text-success' : 'text-destructive'}`}>{formatCurrency(year.cashFlow)}</td>
                    <td className={`py-3 px-3 text-right font-semibold pdf-table-bold tabular-nums ${year.cumulativeCashFlow >= 0 ? 'text-success' : 'text-destructive'}`}>{formatCurrency(year.cumulativeCashFlow)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-sm text-neutral-700 leading-relaxed space-y-3 p-4 bg-neutral-50 rounded-lg">
            <p>
              This projection models {isSampleMode ? 'an example' : 'your'} investment over {displayInputs.holdingPeriodYears || 5} years assuming {formatPercent(displayInputs.capitalGrowthPercent || 0)} annual 
              property value growth and {formatPercent(displayInputs.rentGrowthPercent || 0)} annual rent increases. These are projections, not guarantees.
            </p>
            <p>
              <strong>Property Value:</strong> End of Year 1 property value is {formatCurrency(displayResults.projection[0].propertyValue)}, reflecting {formatPercent(displayInputs.capitalGrowthPercent || 0)} annual growth from the {formatCurrency(displayInputs.purchasePrice || 0)} purchase price. By end of Year 5, the property is valued at {formatCurrency(displayResults.projection[4].propertyValue)}, representing {formatCurrency(displayResults.projection[4].propertyValue - (displayInputs.purchasePrice || 0))} of appreciation and {(((displayResults.projection[4].propertyValue / (displayInputs.purchasePrice || 0) - 1) * 100).toFixed(2))}% total growth versus the purchase price.
            </p>
            <p>
              <strong>Equity Buildup:</strong> {isSampleMode ? 'In this example, equity' : 'Your equity'} increases from {formatCurrency(displayResults.projection[0].equity)} to {formatCurrency(displayResults.projection[4].equity)}, 
              driven by both property appreciation and progressive mortgage principal repayment, as shown in the loan balance column of the Year by Year table.
            </p>
            <p>
              <strong>Cash Flow Trajectory:</strong> {isSampleMode ? 'The example shows' : 'Your'} annual cash flow {displayResults.projection[4].cashFlow > displayResults.projection[0].cashFlow ? 'improves from' : 'changes from'} {formatCurrency(displayResults.projection[0].cashFlow)} in 
              Year 1 (based on escalated rent of {formatCurrency((displayInputs.expectedMonthlyRent || 0) * (1 + (displayInputs.rentGrowthPercent || 0) / 100))} per month, or {formatCurrency(displayResults.projection[0].annualRent)} annually) to {formatCurrency(displayResults.projection[4].cashFlow)} in Year 5 as rent growth {displayResults.projection[4].cashFlow > displayResults.projection[0].cashFlow ? 'outpaces' : 'tracks'} fixed mortgage payments.
            </p>
            <p>
              <strong>Cumulative Position:</strong> By Year 5, {isSampleMode ? 'this scenario shows' : 'you have'} {formatCurrency(Math.abs(displayResults.projection[4].cumulativeCashFlow))} {displayResults.projection[4].cumulativeCashFlow >= 0 ? 'received in' : 'contributed to'} cumulative cash flow.
            </p>
          </div>
          </div>
        </section>
      )}

      {/* SECTION 3: Investment Risks (Previously Section 7 - Sensitivity Analysis) */}
      {displayResults.sensitivityAnalysis && (
        <section className="page-break-before pdf-section page-break-avoid">
          <h2 className="text-2xl font-bold text-foreground mb-4 pdf-h2">3. Investment Risks</h2>
          
          {/* Rent Sensitivity - Default Expanded */}
          <div className="mb-8 pdf-subsection page-break-avoid">
            <h3 className="text-lg font-semibold text-foreground mb-4 pdf-h3">Rent Sensitivity</h3>
            <div className="bg-white rounded-xl border border-border overflow-hidden mb-4">
              <table className="w-full">
                <thead>
                  <tr className="bg-neutral-50">
                    <th className="text-left py-3 px-4 font-semibold text-foreground text-sm">Rent Scenario</th>
                    <th className="text-right py-3 px-4 font-semibold text-foreground text-sm">Monthly Rent</th>
                    <th className="text-right py-3 px-4 font-semibold text-foreground text-sm">Annual Income</th>
                    <th className="text-right py-3 px-4 font-semibold text-foreground text-sm">Gross Yield</th>
                    <th className="text-right py-3 px-4 font-semibold text-foreground text-sm">Annual CF</th>
                    <th className="text-right py-3 px-4 font-semibold text-foreground text-sm">CoC Return</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {displayResults.sensitivityAnalysis.rentScenarios.map((scenario, index) => {
                    const isBase = scenario.value === (displayInputs.expectedMonthlyRent || 0);
                    const annualIncome = scenario.value * 12;
                    return (
                      <tr key={index} className={isBase ? 'bg-blue-50 font-semibold' : index % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}>
                        <td className={`py-3 px-4 text-sm ${isBase ? 'text-primary font-semibold' : 'text-neutral-700'}`}>
                          {scenario.label} {isBase && `(${isSampleMode ? 'Example Assumption' : 'Your Assumption'})`}
                        </td>
                        <td className="py-3 px-4 text-sm text-right text-neutral-700">{formatCurrency(scenario.value)}</td>
                        <td className="py-3 px-4 text-sm text-right text-neutral-700">{formatCurrency(annualIncome)}</td>
                        <td className="py-3 px-4 text-sm text-right text-neutral-700">{formatPercent(scenario.additionalMetric || 0)}</td>
                        <td className={`py-3 px-4 text-sm text-right font-medium ${scenario.annualCashFlow >= 0 ? 'text-success' : 'text-destructive'}`}>
                          {formatCurrency(scenario.annualCashFlow)}
                        </td>
                        <td className={`py-3 px-4 text-sm text-right ${scenario.cashOnCashReturn >= 0 ? 'text-success' : 'text-destructive'}`}>
                          {formatPercent(scenario.cashOnCashReturn)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="text-sm text-neutral-700 leading-relaxed p-4 bg-neutral-50 rounded-lg">
              <p>
                {isSampleMode ? 'The example' : 'Your'} expected rent of {formatCurrency(displayInputs.expectedMonthlyRent || 0)} per month assumes market positioning and tenant demand. 
                If actual rent is 10% lower, cash flow drops to {formatCurrency(displayResults.sensitivityAnalysis.rentScenarios[1].annualCashFlow)}. 
                Conversely, if {isSampleMode ? 'rent achieves' : 'you secure'} 10% above expected rent, cash flow improves to {formatCurrency(displayResults.sensitivityAnalysis.rentScenarios[3].annualCashFlow)}, 
                an {formatCurrency(Math.abs(displayResults.sensitivityAnalysis.rentScenarios[3].annualCashFlow - displayResults.annualCashFlow))} annual improvement.
              </p>
            </div>
          </div>

          {/* Vacancy Rate Sensitivity - Collapsed by default on screen */}
          <div className="mb-8 pdf-subsection page-break-avoid">
            <div 
              className="flex items-center justify-between mb-4 cursor-pointer no-print"
              onClick={() => setShowVacancyRisk(!showVacancyRisk)}
            >
              <h3 className={`text-lg font-semibold text-foreground pdf-h3 ${showVacancyRisk ? 'hidden' : ''}`}>Vacancy Rate Sensitivity</h3>
              {showVacancyRisk ? (
                <span className="text-sm text-primary font-medium">Hide vacancy risk scenarios</span>
              ) : (
                <span className="text-sm text-primary font-medium">Show vacancy risk scenarios</span>
              )}
            </div>
            
            <h3 className={`text-lg font-semibold text-foreground mb-4 pdf-h3 ${showVacancyRisk ? '' : 'hidden'} print-force-show`}>Vacancy Rate Sensitivity</h3>
            
            <div className={`${showVacancyRisk ? '' : 'hidden'} screen-only-collapsible print-force-show`}>
              <div className="bg-white rounded-xl border border-border overflow-hidden mb-4">
                <table className="w-full">
                  <thead>
                    <tr className="bg-neutral-50">
                      <th className="text-left py-3 px-4 font-semibold text-foreground text-sm">Vacancy Rate</th>
                      <th className="text-right py-3 px-4 font-semibold text-foreground text-sm">Effective Income</th>
                      <th className="text-right py-3 px-4 font-semibold text-foreground text-sm">Annual CF</th>
                      <th className="text-right py-3 px-4 font-semibold text-foreground text-sm">CoC Return</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground text-sm">Outcome</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {displayResults.sensitivityAnalysis.vacancyRateScenarios.map((scenario, index) => {
                      const isBase = scenario.value === (displayInputs.vacancyRatePercent || 5);
                      const effectiveIncome = (displayInputs.expectedMonthlyRent || 0) * 12 * (1 - scenario.value / 100);
                      return (
                        <tr key={index} className={isBase ? 'bg-blue-50 font-semibold' : index % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}>
                          <td className={`py-3 px-4 text-sm ${isBase ? 'text-primary font-semibold' : 'text-neutral-700'}`}>
                            {formatPercent(scenario.value)} {isBase && `(${isSampleMode ? 'Example Assumption' : 'Your Assumption'})`}
                          </td>
                          <td className="py-3 px-4 text-sm text-right text-neutral-700">{formatCurrency(effectiveIncome)}</td>
                          <td className={`py-3 px-4 text-sm text-right font-medium ${scenario.annualCashFlow >= 0 ? 'text-success' : 'text-destructive'}`}>
                            {formatCurrency(scenario.annualCashFlow)}
                          </td>
                          <td className={`py-3 px-4 text-sm text-right ${scenario.cashOnCashReturn >= 0 ? 'text-success' : 'text-destructive'}`}>
                            {formatPercent(scenario.cashOnCashReturn)}
                          </td>
                          <td className="py-3 px-4 text-sm text-neutral-600">
                            {scenario.annualCashFlow >= 0 ? 'Positive Cash Flow' : 'Negative Cash Flow'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="text-sm text-neutral-700 leading-relaxed p-4 bg-neutral-50 rounded-lg">
                <p>
                  {isSampleMode ? 'This example' : 'Your analysis'} assumes {formatPercent(displayInputs.vacancyRatePercent || 0)} vacancy. 
                  At 0% vacancy (property always occupied), {isSampleMode ? 'the' : 'your'} cash flow would be {formatCurrency(displayResults.sensitivityAnalysis.vacancyRateScenarios[0].annualCashFlow)}. 
                  At 20% vacancy (worst case), cash flow deteriorates to {formatCurrency(displayResults.sensitivityAnalysis.vacancyRateScenarios[4].annualCashFlow)}. 
                  Each additional 5% vacancy reduces annual cash flow significantly.
                </p>
              </div>
            </div>
          </div>

          {/* Interest Rate Sensitivity - Collapsed by default on screen */}
          <div className="mb-8 pdf-subsection page-break-avoid">
            <div 
              className="flex items-center justify-between mb-4 cursor-pointer no-print"
              onClick={() => setShowInterestRateRisk(!showInterestRateRisk)}
            >
              <h3 className={`text-lg font-semibold text-foreground pdf-h3 ${showInterestRateRisk ? 'hidden' : ''}`}>Interest Rate Sensitivity</h3>
              {showInterestRateRisk ? (
                <span className="text-sm text-primary font-medium">Hide interest rate risk scenarios</span>
              ) : (
                <span className="text-sm text-primary font-medium">Show interest rate risk scenarios</span>
              )}
            </div>
            
            <h3 className={`text-lg font-semibold text-foreground mb-4 pdf-h3 ${showInterestRateRisk ? '' : 'hidden'} print-force-show`}>Interest Rate Sensitivity</h3>
            
            <div className={`${showInterestRateRisk ? '' : 'hidden'} screen-only-collapsible print-force-show`}>
              <div className="bg-white rounded-xl border border-border overflow-hidden mb-4">
                <table className="w-full">
                  <thead>
                    <tr className="bg-neutral-50">
                      <th className="text-left py-3 px-4 font-semibold text-foreground text-sm">Interest Rate</th>
                      <th className="text-right py-3 px-4 font-semibold text-foreground text-sm">Annual Payment</th>
                      <th className="text-right py-3 px-4 font-semibold text-foreground text-sm">Annual CF</th>
                      <th className="text-right py-3 px-4 font-semibold text-foreground text-sm">CoC Return</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {displayResults.sensitivityAnalysis.interestRateScenarios.map((scenario, index) => {
                      const isBase = scenario.value === (displayInputs.mortgageInterestRate || 0);
                      const annualPayment = displayResults.annualMortgagePayment + (displayResults.annualCashFlow - scenario.annualCashFlow);
                      return (
                        <tr key={index} className={isBase ? 'bg-blue-50 font-semibold' : index % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}>
                          <td className={`py-3 px-4 text-sm ${isBase ? 'text-primary font-semibold' : 'text-neutral-700'}`}>
                            {formatPercent(scenario.value)} {isBase && `(${isSampleMode ? 'Example Rate' : 'Your Rate'})`}
                          </td>
                          <td className="py-3 px-4 text-sm text-right text-neutral-700">{formatCurrency(annualPayment)}</td>
                          <td className={`py-3 px-4 text-sm text-right font-medium ${scenario.annualCashFlow >= 0 ? 'text-success' : 'text-destructive'}`}>
                            {formatCurrency(scenario.annualCashFlow)}
                          </td>
                          <td className={`py-3 px-4 text-sm text-right ${scenario.cashOnCashReturn >= 0 ? 'text-success' : 'text-destructive'}`}>
                            {formatPercent(scenario.cashOnCashReturn)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="text-sm text-neutral-700 leading-relaxed p-4 bg-neutral-50 rounded-lg">
                <p>
                  {isSampleMode ? 'The example' : 'Your'} mortgage rate of {formatPercent(displayInputs.mortgageInterestRate || 0)} generates annual payments of {formatCurrency(displayResults.annualMortgagePayment)}. 
                  If rates increase 1%, {isSampleMode ? 'the' : 'your'} annual cash flow reduces by approximately {formatCurrency(Math.abs(displayResults.sensitivityAnalysis.interestRateScenarios[3].annualCashFlow - displayResults.sensitivityAnalysis.interestRateScenarios[2].annualCashFlow))}. 
                  Conversely, securing a rate 1% lower would improve cash flow significantly.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 4: Year One Financial Deep Dive (Previously Section 2 - Cash Flow Anatomy) */}
      <section className="page-break-before pdf-section page-break-avoid">
        <h2 className="text-2xl font-bold text-foreground mb-4 pdf-h2">4. Year One Financial Deep Dive</h2>
        
        {/* Waterfall Chart */}
        <div className="bg-neutral-50 rounded-xl p-4 border border-border mb-4 pdf-chart-container page-break-avoid">
          <h4 className="font-semibold text-foreground mb-4 pdf-h4">Annual Income & Expense Flow</h4>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={waterfallData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 10 }} angle={-15} textAnchor="end" height={80} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {waterfallData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Operating Expense Breakdown Table */}
        <div className="bg-white rounded-xl border border-border overflow-hidden mb-6 pdf-component">
          <table className="w-full keep-together">
            <thead>
              <tr className="bg-neutral-50">
                <th className="text-left py-3 px-4 font-semibold text-foreground text-sm pdf-table-header">Expense Category</th>
                <th className="text-right py-3 px-4 font-semibold text-foreground text-sm pdf-table-header">Annual Cost</th>
                <th className="text-right py-3 px-4 font-semibold text-foreground text-sm pdf-table-header">Monthly Cost</th>
                <th className="text-right py-3 px-4 font-semibold text-foreground text-sm pdf-table-header">% of Income</th>
                <th className="text-right py-3 px-4 font-semibold text-foreground text-sm pdf-table-header">% of Expenses</th>
                {displayInputs.areaSqft && <th className="text-right py-3 px-4 font-semibold text-foreground text-sm pdf-table-header">Per Sq Ft</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr className="bg-white">
                <td className="py-3 px-4 text-sm text-neutral-700">Service Charge</td>
                <td className="py-3 px-4 text-sm text-right font-medium text-foreground">{formatCurrency(displayResults.annualServiceCharge)}</td>
                <td className="py-3 px-4 text-sm text-right text-neutral-600">{formatCurrency(displayResults.annualServiceCharge / 12)}</td>
                <td className="py-3 px-4 text-sm text-right text-neutral-600">{formatPercent((displayResults.annualServiceCharge / displayResults.effectiveAnnualRentalIncome) * 100)}</td>
                <td className="py-3 px-4 text-sm text-right text-neutral-600">{formatPercent((displayResults.annualServiceCharge / displayResults.totalAnnualOperatingExpenses) * 100)}</td>
                {displayInputs.areaSqft && <td className="py-3 px-4 text-sm text-right text-neutral-600">{formatCurrency(displayResults.annualServiceCharge / displayInputs.areaSqft)}</td>}
              </tr>
              <tr className="bg-neutral-50">
                <td className="py-3 px-4 text-sm text-neutral-700">Maintenance</td>
                <td className="py-3 px-4 text-sm text-right font-medium text-foreground">{formatCurrency(displayResults.annualMaintenanceCosts)}</td>
                <td className="py-3 px-4 text-sm text-right text-neutral-600">{formatCurrency(displayResults.annualMaintenanceCosts / 12)}</td>
                <td className="py-3 px-4 text-sm text-right text-neutral-600">{formatPercent((displayResults.annualMaintenanceCosts / displayResults.effectiveAnnualRentalIncome) * 100)}</td>
                <td className="py-3 px-4 text-sm text-right text-neutral-600">{formatPercent((displayResults.annualMaintenanceCosts / displayResults.totalAnnualOperatingExpenses) * 100)}</td>
                {displayInputs.areaSqft && <td className="py-3 px-4 text-sm text-right text-neutral-600">{formatCurrency(displayResults.annualMaintenanceCosts / displayInputs.areaSqft)}</td>}
              </tr>
              <tr className="bg-white">
                <td className="py-3 px-4 text-sm text-neutral-700">Property Management</td>
                <td className="py-3 px-4 text-sm text-right font-medium text-foreground">{formatCurrency(displayResults.annualPropertyManagementFee)}</td>
                <td className="py-3 px-4 text-sm text-right text-neutral-600">{formatCurrency(displayResults.annualPropertyManagementFee / 12)}</td>
                <td className="py-3 px-4 text-sm text-right text-neutral-600">{formatPercent((displayResults.annualPropertyManagementFee / displayResults.effectiveAnnualRentalIncome) * 100)}</td>
                <td className="py-3 px-4 text-sm text-right text-neutral-600">{formatPercent((displayResults.annualPropertyManagementFee / displayResults.totalAnnualOperatingExpenses) * 100)}</td>
                {displayInputs.areaSqft && <td className="py-3 px-4 text-sm text-right text-neutral-600">-</td>}
              </tr>
              <tr className="bg-neutral-100">
                <td className="py-3 px-4 text-sm font-semibold text-foreground">Total Operating Expenses</td>
                <td className="py-3 px-4 text-sm text-right font-bold text-foreground">{formatCurrency(displayResults.totalAnnualOperatingExpenses)}</td>
                <td className="py-3 px-4 text-sm text-right font-semibold text-neutral-700">{formatCurrency(displayResults.totalAnnualOperatingExpenses / 12)}</td>
                <td className="py-3 px-4 text-sm text-right font-semibold text-neutral-700">{formatPercent((displayResults.totalAnnualOperatingExpenses / displayResults.effectiveAnnualRentalIncome) * 100)}</td>
                <td className="py-3 px-4 text-sm text-right font-semibold text-neutral-700">100%</td>
                {displayInputs.areaSqft && <td className="py-3 px-4 text-sm text-right font-semibold text-neutral-700">{formatCurrency(displayResults.totalAnnualOperatingExpenses / displayInputs.areaSqft)}</td>}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="text-sm text-neutral-700 leading-relaxed space-y-3 p-4 bg-neutral-50 rounded-lg pdf-interpretation page-break-avoid">
          <p className="pdf-body">
            {isSampleMode ? 'This example shows an' : 'Your'} annual rental journey {isSampleMode ? 'beginning' : 'begins'} with {formatCurrency(displayResults.grossAnnualRentalIncome)} gross income. 
            After accounting for {formatPercent(displayInputs.vacancyRatePercent || 0)} vacancy ({formatCurrency(vacancyAmount)}), 
            {isSampleMode ? 'the' : 'your'} effective income is {formatCurrency(displayResults.effectiveAnnualRentalIncome)}.
          </p>
          <p>
            Operating expenses total {formatCurrency(displayResults.totalAnnualOperatingExpenses)}, representing {formatPercent((displayResults.totalAnnualOperatingExpenses / displayResults.effectiveAnnualRentalIncome) * 100)} of effective income. 
            Service charges are {isSampleMode ? 'the' : 'your'} largest operating cost at {formatCurrency(displayResults.annualServiceCharge)}.
          </p>
          <p>
            After operating expenses, {isSampleMode ? 'the' : 'your'} net operating income is {formatCurrency(displayResults.netOperatingIncome)}. 
            {isSampleMode ? 'The' : 'Your'} mortgage payment of {formatCurrency(displayResults.annualMortgagePayment)} consumes {formatPercent((displayResults.annualMortgagePayment / displayResults.effectiveAnnualRentalIncome) * 100)} of effective rental income, 
            leaving {displayResults.annualCashFlow >= 0 ? 'positive' : 'negative'} annual cash flow of {formatCurrency(displayResults.annualCashFlow)}.
          </p>
        </div>
      </section>

      {/* SECTION 5: Upfront Capital Requirement (Previously Section 3 - Initial Investment) */}
      <section className="page-break-before pdf-section page-break-avoid">
        <h2 className="text-2xl font-bold text-foreground mb-4 pdf-h2">5. Upfront Capital Requirement</h2>
        
        <div className="bg-white rounded-xl border border-border overflow-hidden mb-6">
          <table className="w-full">
            <thead>
              <tr className="bg-neutral-50">
                <th className="text-left py-3 px-4 font-semibold text-foreground text-sm">Cost Component</th>
                <th className="text-right py-3 px-4 font-semibold text-foreground text-sm">Amount</th>
                <th className="text-right py-3 px-4 font-semibold text-foreground text-sm">% of Purchase Price</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground text-sm">Cost Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr className="bg-green-50">
                <td className="py-3 px-4 text-sm text-neutral-700">Down Payment</td>
                <td className="py-3 px-4 text-sm text-right font-medium text-foreground">{formatCurrency(displayResults.downPaymentAmount)}</td>
                <td className="py-3 px-4 text-sm text-right text-neutral-600">{formatPercent(displayInputs.downPaymentPercent || 0)}</td>
                <td className="py-3 px-4 text-sm text-neutral-700">Recoverable (becomes equity)</td>
              </tr>
              <tr className="bg-white">
                <td className="py-3 px-4 text-sm text-neutral-700">DLD Registration Fee</td>
                <td className="py-3 px-4 text-sm text-right font-medium text-foreground">{formatCurrency(displayResults.dldFee)}</td>
                <td className="py-3 px-4 text-sm text-right text-neutral-600">{formatPercent(displayInputs.dldFeePercent || 0)}</td>
                <td className="py-3 px-4 text-sm text-neutral-700">Transaction Fee</td>
              </tr>
              <tr className="bg-neutral-50">
                <td className="py-3 px-4 text-sm text-neutral-700">Agent Commission</td>
                <td className="py-3 px-4 text-sm text-right font-medium text-foreground">{formatCurrency(displayResults.agentFee)}</td>
                <td className="py-3 px-4 text-sm text-right text-neutral-600">{formatPercent(displayInputs.agentFeePercent || 0)}</td>
                <td className="py-3 px-4 text-sm text-neutral-700">Transaction Fee</td>
              </tr>
              <tr className="bg-white">
                <td className="py-3 px-4 text-sm text-neutral-700 italic">Other Closing Costs*</td>
                <td className="py-3 px-4 text-sm text-right font-medium text-foreground">{formatCurrency(displayResults.otherClosingCosts)}</td>
                <td className="py-3 px-4 text-sm text-right text-neutral-600">{formatPercent((displayResults.otherClosingCosts / (displayInputs.purchasePrice || 1)) * 100)}</td>
                <td className="py-3 px-4 text-sm text-neutral-700">Transaction Fee</td>
              </tr>
              <tr className="bg-neutral-100">
                <td className="py-3 px-4 text-sm font-semibold text-foreground">Total Initial Investment</td>
                <td className="py-3 px-4 text-sm text-right font-bold text-foreground">{formatCurrency(displayResults.totalInitialInvestment)}</td>
                <td className="py-3 px-4 text-sm text-right font-semibold text-neutral-700">{formatPercent((displayResults.totalInitialInvestment / (displayInputs.purchasePrice || 1)) * 100)}</td>
                <td className="py-3 px-4 text-sm text-neutral-700">-</td>
              </tr>
            </tbody>
          </table>
          <div className="px-4 py-2 bg-neutral-50 border-t border-border">
            <p className="text-xs text-neutral-500 italic">
              * Other Closing Costs of {formatCurrency(displayResults.otherClosingCosts)} includes estimated fees for valuation, mortgage processing, NOC certificates, and administrative charges. Actual costs may vary by lender and property.
            </p>
          </div>
        </div>

        <div className="text-sm text-neutral-700 leading-relaxed space-y-3 p-4 bg-neutral-50 rounded-lg">
          <p>
            To acquire this {isSampleMode ? 'example' : ''} property, {isSampleMode ? 'the buyer would need' : 'you need'} {formatCurrency(displayResults.totalInitialInvestment)} in upfront capital, 
            representing {formatPercent((displayResults.totalInitialInvestment / (displayInputs.purchasePrice || 1)) * 100)} of 
            the {formatCurrency(displayInputs.purchasePrice || 0)} purchase price.
          </p>
          <p>
            {isSampleMode ? 'The' : 'Your'} down payment of {formatCurrency(displayResults.downPaymentAmount)} ({formatPercent(displayInputs.downPaymentPercent || 0)}) becomes immediate equity in the property. 
            Transaction fees total {formatCurrency(displayResults.totalInitialInvestment - displayResults.downPaymentAmount)}, comprised of 
            DLD registration ({formatCurrency(displayResults.dldFee)}), agent commission ({formatCurrency(displayResults.agentFee)}), 
            and closing costs ({formatCurrency(displayResults.otherClosingCosts)}).
          </p>
          <p>
            These transaction fees represent {formatPercent(((displayResults.totalInitialInvestment - displayResults.downPaymentAmount) / displayResults.totalInitialInvestment) * 100)} of {isSampleMode ? 'the' : 'your'} initial investment and are non-recoverable costs of acquisition.
          </p>
        </div>
      </section>

      {/* SECTION 6: Mortgage Breakdown (Previously Section 4 - Loan Structure) */}
      <section className="pdf-section page-break-avoid">
        <h2 className="text-2xl font-bold text-foreground mb-4 pdf-h2">6. Mortgage Breakdown</h2>
        
        <div className="bg-white rounded-xl border border-border p-4 mb-4 pdf-panel page-break-avoid">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-neutral-600">Loan Amount:</span>
                <span className="text-sm font-semibold text-foreground">{formatCurrency(displayResults.loanAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-neutral-600">Loan-to-Value:</span>
                <span className="text-sm font-semibold text-foreground">{formatPercent((displayResults.loanAmount / (displayInputs.purchasePrice || 1)) * 100)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-neutral-600">Interest Rate:</span>
                <span className="text-sm font-semibold text-foreground">{formatPercent(displayInputs.mortgageInterestRate || 0)} per annum</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-neutral-600">Loan Term:</span>
                <span className="text-sm font-semibold text-foreground">{displayInputs.mortgageTermYears} years ({(displayInputs.mortgageTermYears || 0) * 12} payments)</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-neutral-600">Monthly Payment:</span>
                <span className="text-sm font-bold text-foreground">{formatCurrency(displayResults.monthlyMortgagePayment)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-neutral-600">Annual Payment:</span>
                <span className="text-sm font-semibold text-foreground">{formatCurrency(displayResults.annualMortgagePayment)}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <h4 className="text-sm font-semibold text-foreground mb-3 pdf-h4">First Year Breakdown:</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex justify-between">
                <span className="text-sm text-neutral-600">Principal:</span>
                <span className="text-sm font-semibold text-success">{formatCurrency(firstYearAmortization.principal)} ({formatPercent((firstYearAmortization.principal / displayResults.annualMortgagePayment) * 100)})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-neutral-600">Interest:</span>
                <span className="text-sm font-semibold text-neutral-700">{formatCurrency(firstYearAmortization.interest)} ({formatPercent((firstYearAmortization.interest / displayResults.annualMortgagePayment) * 100)})</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex justify-between">
              <span className="text-sm text-neutral-600">Total Interest (Full Term):</span>
              <span className="text-sm font-bold text-destructive">{formatCurrency(totalInterestOverTerm)}</span>
            </div>
          </div>
        </div>

        <div className="text-sm text-neutral-700 leading-relaxed space-y-3 p-4 bg-neutral-50 rounded-lg">
          <p>
            {isSampleMode ? 'The example' : 'Your'} loan of {formatCurrency(displayResults.loanAmount)} represents {formatPercent((displayResults.loanAmount / (displayInputs.purchasePrice || 1)) * 100)} of 
            the purchase price (loan-to-value ratio). At {formatPercent(displayInputs.mortgageInterestRate || 0)} interest over {displayInputs.mortgageTermYears} years, 
            {isSampleMode ? 'the' : 'your'} monthly payment is {formatCurrency(displayResults.monthlyMortgagePayment)}.
          </p>
          <p>
            In Year 1, {formatCurrency(firstYearAmortization.interest)} ({formatPercent((firstYearAmortization.interest / displayResults.annualMortgagePayment) * 100)}) of 
            {isSampleMode ? 'the' : 'your'} {formatCurrency(displayResults.annualMortgagePayment)} annual payment goes to interest, with only {formatCurrency(firstYearAmortization.principal)} ({formatPercent((firstYearAmortization.principal / displayResults.annualMortgagePayment) * 100)}) reducing 
            the loan balance. This is typical of early mortgage amortization.
          </p>
          <p>
            Over the full {displayInputs.mortgageTermYears}-year term, {isSampleMode ? 'this scenario shows' : 'you will pay'} {formatCurrency(totalInterestOverTerm)} in total interest, 
            meaning the property's true cost is {formatCurrency((displayInputs.purchasePrice || 0) + totalInterestOverTerm)} including financing.
          </p>
        </div>
      </section>

      {/* SECTION 7: Input and Assumption Verification (Previously Section 8 - Assumptions Audit Trail) - COLLAPSED BY DEFAULT */}
      <section className="page-break-before pdf-section page-break-avoid">
        <div 
          className="flex items-center justify-between mb-4 cursor-pointer no-print"
          onClick={() => setShowAssumptions(!showAssumptions)}
        >
          <h2 className={`text-2xl font-bold text-foreground pdf-h2 ${showAssumptions ? 'hidden' : ''}`}>7. Input and Assumption Verification</h2>
          {showAssumptions ? (
            <span className="text-sm text-primary font-medium">Hide inputs and assumptions</span>
          ) : (
            <span className="text-sm text-primary font-medium">Show inputs and assumptions (Advanced)</span>
          )}
        </div>
        
        <h2 className={`text-2xl font-bold text-foreground mb-4 pdf-h2 ${showAssumptions ? '' : 'hidden'} print-force-show`}>7. Input and Assumption Verification</h2>
        
        <div className={`${showAssumptions ? '' : 'hidden'} screen-only-collapsible print-force-show`}>
          {/* Report Details - Property Name, Report ID and Notes */}
          {(displayInputs.propertyName || analysisId || notes) && (
            <div className="mb-6 pdf-subsection page-break-avoid">
              <h3 className="text-lg font-semibold text-foreground mb-4 pdf-h3">Report Details</h3>
              <div className="bg-white rounded-xl border border-border overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-neutral-50">
                      <th className="text-left py-3 px-4 font-semibold text-foreground text-sm">Field</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground text-sm" colSpan={2}>Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {displayInputs.propertyName && (
                      <tr className="bg-white">
                        <td className="py-3 px-4 text-sm text-neutral-700">Property Name</td>
                        <td className="py-3 px-4 text-sm font-semibold text-foreground" colSpan={2}>{displayInputs.propertyName}</td>
                      </tr>
                    )}
                    {analysisId && (
                      <tr className={displayInputs.propertyName ? 'bg-neutral-50' : 'bg-white'}>
                        <td className="py-3 px-4 text-sm text-neutral-700">Report ID</td>
                        <td className="py-3 px-4 text-sm font-mono font-medium text-foreground" colSpan={2}>{analysisId}</td>
                      </tr>
                    )}
                    {notes && (
                      <tr className={(displayInputs.propertyName && analysisId) ? 'bg-white' : (displayInputs.propertyName || analysisId) ? 'bg-neutral-50' : 'bg-white'}>
                        <td className="py-3 px-4 text-sm text-neutral-700 align-top">User Notes</td>
                        <td className="py-3 px-4 text-sm text-neutral-700 whitespace-pre-wrap" colSpan={2}>{notes}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* User Inputs */}
          <div className="mb-6 pdf-subsection page-break-avoid">
            <h3 className="text-lg font-semibold text-foreground mb-4 pdf-h3">Property & Financial Inputs (User-Provided)</h3>
            <div className="bg-white rounded-xl border border-border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-neutral-50">
                    <th className="text-left py-3 px-4 font-semibold text-foreground text-sm">Input</th>
                    <th className="text-right py-3 px-4 font-semibold text-foreground text-sm">Value</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground text-sm">Used In Calculation Of</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr className="bg-white">
                    <td className="py-3 px-4 text-sm text-neutral-700">Purchase Price</td>
                    <td className="py-3 px-4 text-sm text-right font-medium text-foreground">{formatCurrency(displayInputs.purchasePrice || 0)}</td>
                    <td className="py-3 px-4 text-sm text-neutral-600">All yield metrics, loan amount, fees</td>
                  </tr>
                  {displayInputs.areaSqft && (
                    <tr className="bg-neutral-50">
                      <td className="py-3 px-4 text-sm text-neutral-700">Property Area</td>
                      <td className="py-3 px-4 text-sm text-right font-medium text-foreground">{displayInputs.areaSqft} sq ft</td>
                      <td className="py-3 px-4 text-sm text-neutral-600">Per-sq-ft analysis</td>
                    </tr>
                  )}
                  <tr className={displayInputs.areaSqft ? 'bg-white' : 'bg-neutral-50'}>
                    <td className="py-3 px-4 text-sm text-neutral-700">Down Payment</td>
                    <td className="py-3 px-4 text-sm text-right font-medium text-foreground">{formatPercent(displayInputs.downPaymentPercent || 0)}</td>
                    <td className="py-3 px-4 text-sm text-neutral-600">Loan amount, initial investment</td>
                  </tr>
                  <tr className={displayInputs.areaSqft ? 'bg-neutral-50' : 'bg-white'}>
                    <td className="py-3 px-4 text-sm text-neutral-700">Mortgage Rate</td>
                    <td className="py-3 px-4 text-sm text-right font-medium text-foreground">{formatPercent(displayInputs.mortgageInterestRate || 0)} p.a.</td>
                    <td className="py-3 px-4 text-sm text-neutral-600">Monthly payment, interest costs</td>
                  </tr>
                  <tr className={displayInputs.areaSqft ? 'bg-white' : 'bg-neutral-50'}>
                    <td className="py-3 px-4 text-sm text-neutral-700">Mortgage Term</td>
                    <td className="py-3 px-4 text-sm text-right font-medium text-foreground">{displayInputs.mortgageTermYears} years</td>
                    <td className="py-3 px-4 text-sm text-neutral-600">Monthly payment, amortization</td>
                  </tr>
                  <tr className={displayInputs.areaSqft ? 'bg-neutral-50' : 'bg-white'}>
                    <td className="py-3 px-4 text-sm text-neutral-700">Expected Monthly Rent</td>
                    <td className="py-3 px-4 text-sm text-right font-medium text-foreground">{formatCurrency(displayInputs.expectedMonthlyRent || 0)}</td>
                    <td className="py-3 px-4 text-sm text-neutral-600">All income and yield calculations</td>
                  </tr>
                  <tr className={displayInputs.areaSqft ? 'bg-white' : 'bg-neutral-50'}>
                    <td className="py-3 px-4 text-sm text-neutral-700">Annual Service Charge</td>
                    <td className="py-3 px-4 text-sm text-right font-medium text-foreground">{formatCurrency(displayInputs.serviceChargeAnnual || 0)}</td>
                    <td className="py-3 px-4 text-sm text-neutral-600">Operating expenses, NOI</td>
                  </tr>
                  <tr className={displayInputs.areaSqft ? 'bg-neutral-50' : 'bg-white'}>
                    <td className="py-3 px-4 text-sm text-neutral-700">Maintenance Rate</td>
                    <td className="py-3 px-4 text-sm text-right font-medium text-foreground">{formatPercent(displayInputs.annualMaintenancePercent || 0)} of property value</td>
                    <td className="py-3 px-4 text-sm text-neutral-600">Operating expenses, NOI</td>
                  </tr>
                  <tr className={displayInputs.areaSqft ? 'bg-white' : 'bg-neutral-50'}>
                    <td className="py-3 px-4 text-sm text-neutral-700">Management Fee</td>
                    <td className="py-3 px-4 text-sm text-right font-medium text-foreground">{formatPercent(displayInputs.propertyManagementFeePercent || 0)} of rent</td>
                    <td className="py-3 px-4 text-sm text-neutral-600">Operating expenses, NOI</td>
                  </tr>
                  <tr className={displayInputs.areaSqft ? 'bg-neutral-50' : 'bg-white'}>
                    <td className="py-3 px-4 text-sm text-neutral-700">DLD Fee</td>
                    <td className="py-3 px-4 text-sm text-right font-medium text-foreground">{formatPercent(displayInputs.dldFeePercent || 0)}</td>
                    <td className="py-3 px-4 text-sm text-neutral-600">Initial investment</td>
                  </tr>
                  <tr className={displayInputs.areaSqft ? 'bg-white' : 'bg-neutral-50'}>
                    <td className="py-3 px-4 text-sm text-neutral-700">Agent Fee</td>
                    <td className="py-3 px-4 text-sm text-right font-medium text-foreground">{formatPercent(displayInputs.agentFeePercent || 0)}</td>
                    <td className="py-3 px-4 text-sm text-neutral-600">Initial investment</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Projection Parameters */}
          <div className="mb-6 pdf-subsection page-break-avoid">
            <h3 className="text-lg font-semibold text-foreground mb-4 pdf-h3">Projection Parameters</h3>
            <div className="bg-white rounded-xl border border-border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-neutral-50">
                    <th className="text-left py-3 px-4 font-semibold text-foreground text-sm">Parameter</th>
                    <th className="text-right py-3 px-4 font-semibold text-foreground text-sm">Value</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground text-sm">Impact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr className="bg-white">
                    <td className="py-3 px-4 text-sm text-neutral-700">Capital Growth Rate</td>
                    <td className="py-3 px-4 text-sm text-right font-medium text-foreground">{formatPercent(displayInputs.capitalGrowthPercent || 0)} p.a.</td>
                    <td className="py-3 px-4 text-sm text-neutral-600">Property value appreciation in projection</td>
                  </tr>
                  <tr className="bg-neutral-50">
                    <td className="py-3 px-4 text-sm text-neutral-700">Rent Growth Rate</td>
                    <td className="py-3 px-4 text-sm text-right font-medium text-foreground">{formatPercent(displayInputs.rentGrowthPercent || 0)} p.a.</td>
                    <td className="py-3 px-4 text-sm text-neutral-600">Future rental income escalation</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="py-3 px-4 text-sm text-neutral-700">Vacancy Rate</td>
                    <td className="py-3 px-4 text-sm text-right font-medium text-foreground">{formatPercent(displayInputs.vacancyRatePercent || 0)}</td>
                    <td className="py-3 px-4 text-sm text-neutral-600">Effective income reduction</td>
                  </tr>
                  <tr className="bg-neutral-50">
                    <td className="py-3 px-4 text-sm text-neutral-700">Holding Period</td>
                    <td className="py-3 px-4 text-sm text-right font-medium text-foreground">{displayInputs.holdingPeriodYears || 5} years</td>
                    <td className="py-3 px-4 text-sm text-neutral-600">Projection timeframe</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* System Constants */}
          <div className="mb-6 pdf-subsection page-break-avoid">
            <h3 className="text-lg font-semibold text-foreground mb-4 pdf-h3">System Constants (Hardcoded Assumptions)</h3>
            <div className="bg-white rounded-xl border border-border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-neutral-50">
                    <th className="text-left py-3 px-4 font-semibold text-foreground text-sm">Constant</th>
                    <th className="text-right py-3 px-4 font-semibold text-foreground text-sm">Value</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground text-sm">Used In</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground text-sm">Rationale</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr className="bg-amber-50">
                    <td className="py-3 px-4 text-sm font-medium text-foreground">Other Closing Costs</td>
                    <td className="py-3 px-4 text-sm text-right font-medium text-foreground">AED 5,000</td>
                    <td className="py-3 px-4 text-sm text-neutral-700">Initial investment</td>
                    <td className="py-3 px-4 text-sm text-neutral-600">Standard estimate for valuation, NOC, admin fees</td>
                  </tr>
                  <tr className="bg-amber-50">
                    <td className="py-3 px-4 text-sm font-medium text-foreground">Selling Agent Fee</td>
                    <td className="py-3 px-4 text-sm text-right font-medium text-foreground">2% of sale price</td>
                    <td className="py-3 px-4 text-sm text-neutral-700">Exit proceeds</td>
                    <td className="py-3 px-4 text-sm text-neutral-600">Typical UAE seller's agent commission</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="py-3 px-4 text-sm text-neutral-700">Management Fee Basis</td>
                    <td className="py-3 px-4 text-sm text-right font-medium text-foreground">Gross rental income</td>
                    <td className="py-3 px-4 text-sm text-neutral-700">Operating expenses</td>
                    <td className="py-3 px-4 text-sm text-neutral-600">Industry standard (not adjusted for vacancy)</td>
                  </tr>
                  <tr className="bg-neutral-50">
                    <td className="py-3 px-4 text-sm text-neutral-700">Vacancy Application</td>
                    <td className="py-3 px-4 text-sm text-right font-medium text-foreground">Income only</td>
                    <td className="py-3 px-4 text-sm text-neutral-700">Effective income</td>
                    <td className="py-3 px-4 text-sm text-neutral-600">Standard practice (expenses not vacancy-adjusted)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="text-sm text-neutral-700 leading-relaxed space-y-3 p-4 bg-neutral-50 rounded-lg">
            <p className="font-semibold">Key Methodology Notes:</p>
            <ol className="list-decimal list-inside space-y-2 ml-2">
              <li>
                Vacancy allowance of {formatPercent(displayInputs.vacancyRatePercent || 0)} reduces gross rental income to effective income, 
                but does NOT reduce property management fees (which are calculated on gross rent following industry practice).
              </li>
              <li>
                Maintenance costs are calculated as {formatPercent(displayInputs.annualMaintenancePercent || 0)} of property value and increase annually in line with projected property appreciation, as shown in the Year by Year table.
              </li>
              <li>
                {isSampleMode ? 'The example' : 'Your'} initial investment includes AED 5,000 in "Other Closing Costs" (an estimate for valuation, mortgage processing, NOC, and administrative fees). 
                Actual costs may vary by lender and property.
              </li>
              <li>
                The exit scenario assumes a 2% selling agent fee, representing typical UAE seller's agent commission. This is negotiable in practice.
              </li>
              <li>
                Projected returns assume {formatPercent(displayInputs.capitalGrowthPercent || 0)} annual property appreciation 
                and {formatPercent(displayInputs.rentGrowthPercent || 0)} annual rent growth. These are assumptions, not forecasts. 
                Actual market performance will vary.
              </li>
            </ol>
            <p className="text-xs italic text-neutral-600 mt-4">
              All calculations can be independently verified using the formulas and inputs disclosed in this section.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 8: Calculation Formulas (Previously Section 9 - Calculation Methodology) - COLLAPSED BY DEFAULT */}
      <section className="pdf-section page-break-avoid">
        <div 
          className="flex items-center justify-between mb-4 cursor-pointer no-print"
          onClick={() => setShowMethodology(!showMethodology)}
        >
          <h2 className={`text-2xl font-bold text-foreground pdf-h2 ${showMethodology ? 'hidden' : ''}`}>8. Calculation Formulas</h2>
          {showMethodology ? (
            <span className="text-sm text-primary font-medium">Hide calculation formulas</span>
          ) : (
            <span className="text-sm text-primary font-medium">Show calculation formulas (For technical users)</span>
          )}
        </div>
        
        <h2 className={`text-2xl font-bold text-foreground mb-4 pdf-h2 ${showMethodology ? '' : 'hidden'} print-force-show`}>8. Calculation Formulas</h2>
        
        <div className={`${showMethodology ? '' : 'hidden'} screen-only-collapsible print-force-show`}>
          <div className="space-y-6 bg-white rounded-xl border border-border p-6 pdf-component">
            {/* Yield Calculations */}
            <div>
              <h3 className="font-semibold text-foreground mb-3 pdf-h3">Yield Calculations</h3>
              <div className="space-y-4 text-sm font-mono bg-neutral-50 p-4 rounded">
                <div>
                  <p className="font-sans font-semibold mb-1">Gross Rental Yield</p>
                  <p>Formula: (Annual Rental Income ÷ Purchase Price) × 100</p>
                  <p className="text-primary">{isSampleMode ? 'Example Calculation' : 'Your Calculation'}: ({formatCurrency(displayResults.grossAnnualRentalIncome)} ÷ {formatCurrency(displayInputs.purchasePrice || 0)}) × 100 = {formatPercent(displayResults.grossRentalYield)}</p>
                </div>
                <div>
                  <p className="font-sans font-semibold mb-1">Net Rental Yield</p>
                  <p>Formula: (Net Operating Income ÷ Purchase Price) × 100</p>
                  <p className="text-primary">{isSampleMode ? 'Example Calculation' : 'Your Calculation'}: ({formatCurrency(displayResults.netOperatingIncome)} ÷ {formatCurrency(displayInputs.purchasePrice || 0)}) × 100 = {formatPercent(displayResults.netRentalYield)}</p>
                </div>
              </div>
            </div>

            {/* Cash Flow Calculations */}
            <div>
              <h3 className="font-semibold text-foreground mb-3">Cash Flow Calculations</h3>
              <div className="space-y-4 text-sm font-mono bg-neutral-50 p-4 rounded">
                <div>
                  <p className="font-sans font-semibold mb-1">Net Operating Income (NOI) - Today Snapshot</p>
                  <p>Formula: Effective Rental Income - Total Operating Expenses</p>
                  <p>Step 1: Gross Income = {formatCurrency(displayInputs.expectedMonthlyRent || 0)} × 12 = {formatCurrency(displayResults.grossAnnualRentalIncome)}</p>
                  <p>Step 2: Vacancy Allowance = {formatCurrency(displayResults.grossAnnualRentalIncome)} × {formatPercent(displayInputs.vacancyRatePercent || 0)} = {formatCurrency(vacancyAmount)}</p>
                  <p>Step 3: Effective Income = {formatCurrency(displayResults.grossAnnualRentalIncome)} - {formatCurrency(vacancyAmount)} = {formatCurrency(displayResults.effectiveAnnualRentalIncome)}</p>
                  <p>Step 4: Operating Expenses = {formatCurrency(displayResults.annualServiceCharge)} + {formatCurrency(displayResults.annualMaintenanceCosts)} + {formatCurrency(displayResults.annualPropertyManagementFee)} = {formatCurrency(displayResults.totalAnnualOperatingExpenses)}</p>
                  <p className="text-primary">Step 5: NOI = {formatCurrency(displayResults.effectiveAnnualRentalIncome)} - {formatCurrency(displayResults.totalAnnualOperatingExpenses)} = {formatCurrency(displayResults.netOperatingIncome)}</p>
                </div>
                <div>
                  <p className="font-sans font-semibold mb-1">Annual Cash Flow - Today Snapshot</p>
                  <p>Formula: NOI - Annual Mortgage Payment</p>
                  <p className="text-primary">{isSampleMode ? 'Example Calculation' : 'Your Calculation'}: {formatCurrency(displayResults.netOperatingIncome)} - {formatCurrency(displayResults.annualMortgagePayment)} = {formatCurrency(displayResults.annualCashFlow)}</p>
                </div>
                {displayResults.projection && displayResults.projection.length >= 1 && (
                  <div className="border-t-2 border-primary pt-4 mt-4">
                    <p className="font-sans font-semibold mb-1">Projection Year 1 (End of Year) - Reconciliation with Year by Year Table</p>
                    <p>Monthly Rent: {formatCurrency(displayInputs.expectedMonthlyRent || 0)} × (1 + {formatPercent(displayInputs.rentGrowthPercent || 0)}) = {formatCurrency((displayInputs.expectedMonthlyRent || 0) * (1 + (displayInputs.rentGrowthPercent || 0) / 100))}</p>
                    <p>Annual Rent: {formatCurrency(displayResults.projection[0].annualRent)}</p>
                    <p>Vacancy ({formatPercent(displayInputs.vacancyRatePercent || 0)}): {formatCurrency(displayResults.projection[0].annualRent * (displayInputs.vacancyRatePercent || 0) / 100)}</p>
                    <p>Effective Income: {formatCurrency(displayResults.projection[0].effectiveRentalIncome)}</p>
                    <p>Operating Expenses: {formatCurrency(displayResults.projection[0].operatingExpenses)}</p>
                    <p className="text-neutral-600 text-xs">(Service: {formatCurrency(displayInputs.serviceChargeAnnual || 0)}, Maintenance: {formatCurrency(displayResults.projection[0].propertyValue * (displayInputs.annualMaintenancePercent || 0) / 100)}, Mgmt: {formatCurrency(displayResults.projection[0].annualRent * (displayInputs.propertyManagementFeePercent || 0) / 100)})</p>
                    <p>NOI: {formatCurrency(displayResults.projection[0].noi)}</p>
                    <p className="text-primary">Annual Cash Flow (Year 1 Table): {formatCurrency(displayResults.projection[0].noi)} - {formatCurrency(displayResults.annualMortgagePayment)} = {formatCurrency(displayResults.projection[0].cashFlow)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Return Metrics */}
            <div>
              <h3 className="font-semibold text-foreground mb-3">Return Metrics</h3>
              <div className="space-y-4 text-sm font-mono bg-neutral-50 p-4 rounded">
                <div>
                  <p className="font-sans font-semibold mb-1">Cash-on-Cash Return</p>
                  <p>Formula: (Annual Cash Flow ÷ Total Initial Investment) × 100</p>
                  <p className="text-primary">{isSampleMode ? 'Example Calculation' : 'Your Calculation'}: ({formatCurrency(displayResults.annualCashFlow)} ÷ {formatCurrency(displayResults.totalInitialInvestment)}) × 100 = {formatPercent(displayResults.cashOnCashReturn)}</p>
                </div>
                {displayResults.projection && displayResults.projection.length >= 5 && (
                  <div>
                    <p className="font-sans font-semibold mb-1">5-Year Total Return</p>
                    <p>Formula: (Sale Proceeds + Cumulative Cash Flow - Initial Investment) ÷ Initial Investment × 100</p>
                    <p className="text-primary">{isSampleMode ? 'Example Calculation' : 'Your Calculation'}: ({formatCurrency(displayResults.projection[4].saleProceeds)} + {formatCurrency(displayResults.projection[4].cumulativeCashFlow)} - {formatCurrency(displayResults.totalInitialInvestment)}) ÷ {formatCurrency(displayResults.totalInitialInvestment)} × 100 = {formatPercent(displayResults.projection[4].roiPercent)}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="text-sm text-neutral-700 leading-relaxed p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="font-semibold mb-2">Verification</p>
              <p>
                All metrics in this report are calculated using standard real estate investment formulas. This section shows the exact calculations applied to {isSampleMode ? 'the example' : 'your'} inputs, 
                enabling independent verification. If you identify any discrepancy between stated formulas and displayed results, please contact support.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
    </>
  );
}
