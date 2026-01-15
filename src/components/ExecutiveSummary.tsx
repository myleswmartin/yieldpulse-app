import { CalculationResults, formatCurrency, formatPercent } from '../utils/calculations';
import { StatCard } from './StatCard';
import { TrendingUp, DollarSign, Info, ChevronDown, ChevronUp, Home } from 'lucide-react';
import { useState } from 'react';

interface ExecutiveSummaryProps {
  displayResults: CalculationResults;
  isSampleMode: boolean;
}

export function ExecutiveSummary({ displayResults, isSampleMode }: ExecutiveSummaryProps) {
  const [showMetrics, setShowMetrics] = useState(false);
  const [showSensitivity, setShowSensitivity] = useState(false);
  
  // Determine investment grade
  const getInvestmentGrade = () => {
    const netYield = displayResults.netRentalYield * 100;
    const cashFlow = displayResults.monthlyCashFlow;
    
    if (netYield >= 6 && cashFlow >= 0) {
      return { grade: 'Strong', color: 'text-success', bg: 'bg-success/10', border: 'border-success/30' };
    } else if (netYield >= 4 && cashFlow >= -1000) {
      return { grade: 'Moderate', color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/30' };
    } else {
      return { grade: 'Cautious', color: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/30' };
    }
  };

  const investmentGrade = getInvestmentGrade();

  return (
    <section className="pdf-section page-break-avoid">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2 pdf-h2">
          Executive Summary
        </h2>
        <p className="text-neutral-600">Key investment metrics at a glance</p>
      </div>
      
      {/* KPI Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Gross Yield"
          value={formatPercent(displayResults.grossRentalYield)}
          icon={TrendingUp}
          description="Annual rental income divided by purchase price"
          variant="navy"
        />
        <StatCard
          label="Net Yield"
          value={formatPercent(displayResults.netRentalYield)}
          icon={TrendingUp}
          description="After operating expenses"
          variant="teal"
        />
        <StatCard
          label="Cash on Cash Return"
          value={formatPercent(displayResults.cashOnCashReturn)}
          icon={TrendingUp}
          description="Return on invested capital"
          variant="warning"
        />
        <StatCard
          label="Cap Rate"
          value={formatPercent(displayResults.capRate)}
          icon={TrendingUp}
          description="Net operating income divided by purchase price"
          variant="success"
        />
        <StatCard
          label="Monthly Cash Flow"
          value={formatCurrency(displayResults.monthlyCashFlow)}
          icon={DollarSign}
          description="Net income after all expenses"
          variant="success"
          trend={displayResults.monthlyCashFlow >= 0 ? 'positive' : 'negative'}
        />
        <StatCard
          label="Annual Cash Flow"
          value={formatCurrency(displayResults.annualCashFlow)}
          icon={DollarSign}
          description="Yearly net income"
          variant={displayResults.annualCashFlow >= 0 ? 'success' : 'warning'}
          trend={displayResults.annualCashFlow >= 0 ? 'positive' : 'negative'}
        />
        <StatCard
          label="Initial Investment"
          value={formatCurrency(displayResults.totalInitialInvestment)}
          icon={DollarSign}
          description="Down payment plus closing costs"
          variant="navy"
        />
        <StatCard
          label="Cost per sq ft"
          value={formatCurrency(displayResults.costPerSqft)}
          icon={Home}
          description="Purchase price per square foot (BUA)"
          variant="teal"
        />
        <StatCard
          label="Rent per sq ft (Annual)"
          value={formatCurrency(displayResults.rentPerSqft)}
          icon={Home}
          description="Annual rental income per square foot"
          variant="warning"
        />
      </div>

      {/* What This Means Section */}
      <div className={`${investmentGrade.bg} border ${investmentGrade.border} rounded-xl p-4 page-break-avoid`}>
        <div className="flex items-start space-x-3 mb-4">
          <Info className={`w-5 h-5 ${investmentGrade.color} flex-shrink-0 mt-0.5`} />
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-2 pdf-h3">What This Means</h3>
            <div className="space-y-3 text-sm text-neutral-700 leading-relaxed">
              <p>
                <strong className={investmentGrade.color}>Investment Grade: {investmentGrade.grade}</strong>
              </p>
              
              {displayResults.monthlyCashFlow >= 0 ? (
                <p>
                  <strong>Positive Cash Flow:</strong> This {isSampleMode ? 'example' : ''} property generates {formatCurrency(displayResults.monthlyCashFlow)} per month after all expenses including mortgage, operating costs, and vacancy allowance. This means the property pays for itself and provides additional monthly income.
                </p>
              ) : (
                <p>
                  <strong>Negative Cash Flow:</strong> This {isSampleMode ? 'example' : ''} property requires {formatCurrency(Math.abs(displayResults.monthlyCashFlow))} per month to cover the gap between rental income and total expenses. {isSampleMode ? 'The buyer would' : 'You will'} need to subsidize the property from other income, but may still benefit from capital appreciation and mortgage paydown.
                </p>
              )}

              <p>
                <strong>Yield Analysis:</strong> {isSampleMode ? 'The example shows a' : 'Your'} gross yield of {formatPercent(displayResults.grossRentalYield)} {isSampleMode ? 'which' : ''} represents the annual rent as a percentage of purchase price. After accounting for operating expenses, {isSampleMode ? 'the' : 'your'} net yield is {formatPercent(displayResults.netRentalYield)}. For context, typical UAE residential yields range from 4% to 8% gross.
              </p>

              <p>
                <strong>Return on Investment:</strong> {isSampleMode ? 'The example shows a' : 'Your'} cash on cash return of {formatPercent(displayResults.cashOnCashReturn)} {isSampleMode ? 'which' : ''} measures the annual cash flow relative to {isSampleMode ? 'the' : 'your'} initial investment of {formatCurrency(displayResults.totalInitialInvestment)}. This shows how efficiently {isSampleMode ? 'the' : 'your'} down payment is working {isSampleMode ? '' : 'for you'}.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Understanding the Metrics - Collapsible */}
      <div className="mt-6 page-break-avoid">
        <button
          onClick={() => setShowMetrics(!showMetrics)}
          className="w-full flex items-center justify-between p-4 bg-neutral-50 hover:bg-neutral-100 border border-border rounded-xl transition-colors no-print cursor-pointer"
        >
          <h4 className="font-semibold text-foreground">Understanding the Metrics</h4>
          {showMetrics ? (
            <ChevronUp className="w-5 h-5 text-neutral-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-neutral-600" />
          )}
        </button>
        
        {/* Print-only header */}
        <h4 className="font-semibold text-foreground mb-4 mt-6 hidden print-force-show">Understanding the Metrics</h4>
        
        <div className={`${showMetrics ? 'block' : 'hidden'} mt-4 print-force-show`}>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-border rounded-xl p-4">
              <h5 className="font-semibold text-foreground mb-2 text-sm">Gross Yield</h5>
              <p className="text-xs text-neutral-700 leading-relaxed">
                Annual rental income divided by purchase price. This is the headline return before any expenses. Use this to quickly compare properties, but always look at net yield for real returns.
              </p>
              <p className="text-xs text-neutral-500 mt-2">
                Formula: (Annual Rent ÷ Purchase Price) × 100
              </p>
            </div>

            <div className="border border-border rounded-xl p-4">
              <h5 className="font-semibold text-foreground mb-2 text-sm">Net Yield</h5>
              <p className="text-xs text-neutral-700 leading-relaxed">
                Annual rental income minus operating expenses (service charges, maintenance, management fees), divided by purchase price. This is your true rental return before mortgage costs.
              </p>
              <p className="text-xs text-neutral-500 mt-2">
                Formula: (Net Operating Income ÷ Purchase Price) × 100
              </p>
            </div>

            <div className="border border-border rounded-xl p-4">
              <h5 className="font-semibold text-foreground mb-2 text-sm">Cash Flow</h5>
              <p className="text-xs text-neutral-700 leading-relaxed">
                Net income after all expenses including mortgage payments, operating costs, and vacancy allowance. Positive cash flow means the property pays for itself. Negative means you subsidize it monthly.
              </p>
              <p className="text-xs text-neutral-500 mt-2">
                Formula: Rental Income - All Expenses - Mortgage
              </p>
            </div>

            <div className="border border-border rounded-xl p-4">
              <h5 className="font-semibold text-foreground mb-2 text-sm">Cash on Cash Return</h5>
              <p className="text-xs text-neutral-700 leading-relaxed">
                Annual cash flow divided by your initial cash investment (down payment plus closing costs). This measures how hard your actual money is working. Higher is better for leveraged returns.
              </p>
              <p className="text-xs text-neutral-500 mt-2">
                Formula: (Annual Cash Flow ÷ Initial Investment) × 100
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sensitivity Analysis - Collapsible */}
      {displayResults.sensitivityAnalysis && (
        <div className="mt-6 page-break-avoid">
          <button
            onClick={() => setShowSensitivity(!showSensitivity)}
            className="w-full flex items-center justify-between p-4 bg-neutral-50 hover:bg-neutral-100 border border-border rounded-xl transition-colors no-print cursor-pointer"
          >
            <h4 className="font-semibold text-foreground">Sensitivity Analysis</h4>
            {showSensitivity ? (
              <ChevronUp className="w-5 h-5 text-neutral-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-neutral-600" />
            )}
          </button>
          
          {/* Print-only header */}
          <h4 className="font-semibold text-foreground mb-4 mt-6 hidden print-force-show">Sensitivity Analysis</h4>
          
          <div className={`${showSensitivity ? 'block' : 'hidden'} mt-4 print-force-show`}>
            <div className="bg-white rounded-xl border border-border overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-neutral-50">
                    <th className="text-left py-2 px-3 font-semibold text-foreground">Rent Scenario</th>
                    <th className="text-right py-2 px-3 font-semibold text-foreground">Monthly Rent</th>
                    <th className="text-right py-2 px-3 font-semibold text-foreground">Annual CF</th>
                    <th className="text-right py-2 px-3 font-semibold text-foreground">CoC Return</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {displayResults.sensitivityAnalysis.rentScenarios.map((scenario, index) => {
                    const isBase = index === 2; // Base case is typically the middle scenario
                    return (
                      <tr key={index} className={isBase ? 'bg-blue-50 font-semibold' : index % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}>
                        <td className={`py-2 px-3 text-xs ${isBase ? 'text-primary font-semibold' : 'text-neutral-700'}`}>
                          {scenario.label} {isBase && `(${isSampleMode ? 'Example' : 'Your'} Assumption)`}
                        </td>
                        <td className="py-2 px-3 text-xs text-right text-neutral-700">{formatCurrency(scenario.value)}</td>
                        <td className={`py-2 px-3 text-xs text-right font-medium ${scenario.annualCashFlow >= 0 ? 'text-success' : 'text-destructive'}`}>
                          {formatCurrency(scenario.annualCashFlow)}
                        </td>
                        <td className={`py-2 px-3 text-xs text-right ${scenario.cashOnCashReturn >= 0 ? 'text-success' : 'text-destructive'}`}>
                          {formatPercent(scenario.cashOnCashReturn)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="mt-3 text-xs text-neutral-700 leading-relaxed p-3 bg-neutral-50 rounded-lg">
              <p>
                <strong>Rent Sensitivity:</strong> The table above shows how changes in monthly rent affect your annual cash flow and cash-on-cash return. This helps you understand the impact of rent volatility on your investment returns.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}