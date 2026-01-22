import { CalculationResults, formatCurrency, formatPercent } from '../utils/calculations';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface ExecutiveSummaryProps {
  displayResults: CalculationResults;
  isSampleMode: boolean;
}

export function ExecutiveSummary({ displayResults, isSampleMode }: ExecutiveSummaryProps) {
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
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-foreground mb-2 pdf-h2">
          Executive Summary
        </h2>
        <p className="text-sm text-neutral-600">Key investment metrics at a glance</p>
      </div>
      
      {/* Compact 3×3 KPI Grid */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {/* Row 1: Yield Metrics */}
        <div className="bg-white border border-border rounded-lg p-3">
          <div className="text-[10px] uppercase tracking-wide text-neutral-500 font-medium mb-1.5">
            Gross Yield
          </div>
          <div className="text-lg font-bold text-teal">
            {formatPercent(displayResults.grossRentalYield)}
          </div>
        </div>

        <div className="bg-white border border-border rounded-lg p-3">
          <div className="text-[10px] uppercase tracking-wide text-neutral-500 font-medium mb-1.5">
            Net Yield
          </div>
          <div className="text-lg font-bold text-teal">
            {formatPercent(displayResults.netRentalYield)}
          </div>
        </div>

        <div className="bg-white border border-border rounded-lg p-3">
          <div className="text-[10px] uppercase tracking-wide text-neutral-500 font-medium mb-1.5">
            Cash on Cash Return
          </div>
          <div className="text-lg font-bold text-navy">
            {formatPercent(displayResults.cashOnCashReturn)}
          </div>
        </div>

        {/* Row 2: Cash Flow Metrics */}
        <div className="bg-white border border-border rounded-lg p-3">
          <div className="text-[10px] uppercase tracking-wide text-neutral-500 font-medium mb-1.5">
            Monthly Cash Flow
          </div>
          <div className={`text-lg font-bold ${displayResults.monthlyCashFlow >= 0 ? 'text-success' : 'text-destructive'}`}>
            {displayResults.monthlyCashFlow < 0 
              ? `(${formatCurrency(Math.abs(displayResults.monthlyCashFlow))})`
              : formatCurrency(displayResults.monthlyCashFlow)
            }
          </div>
        </div>

        <div className="bg-white border border-border rounded-lg p-3">
          <div className="text-[10px] uppercase tracking-wide text-neutral-500 font-medium mb-1.5">
            Annual Cash Flow
          </div>
          <div className={`text-lg font-bold ${displayResults.annualCashFlow >= 0 ? 'text-success' : 'text-destructive'}`}>
            {displayResults.annualCashFlow < 0 
              ? `(${formatCurrency(Math.abs(displayResults.annualCashFlow))})`
              : formatCurrency(displayResults.annualCashFlow)
            }
          </div>
        </div>

        <div className="bg-white border border-border rounded-lg p-3">
          <div className="text-[10px] uppercase tracking-wide text-neutral-500 font-medium mb-1.5">
            CAP Rate
          </div>
          <div className="text-lg font-bold text-navy">
            {formatPercent(displayResults.capRate)}
          </div>
        </div>

        {/* Row 3: Cost Metrics */}
        <div className="bg-white border border-border rounded-lg p-3">
          <div className="text-[10px] uppercase tracking-wide text-neutral-500 font-medium mb-1.5">
            Initial Investment
          </div>
          <div className="text-lg font-bold text-foreground">
            {formatCurrency(displayResults.totalInitialInvestment)}
          </div>
        </div>

        <div className="bg-white border border-border rounded-lg p-3">
          <div className="text-[10px] uppercase tracking-wide text-neutral-500 font-medium mb-1.5">
            Cost per Sq Ft
          </div>
          <div className="text-lg font-bold text-foreground">
            {formatCurrency(displayResults.costPerSqft)}
          </div>
        </div>

        <div className="bg-white border border-border rounded-lg p-3">
          <div className="text-[10px] uppercase tracking-wide text-neutral-500 font-medium mb-1.5">
            Rent per Sq Ft (Annual)
          </div>
          <div className="text-lg font-bold text-foreground">
            {formatCurrency(displayResults.rentPerSqft)}
          </div>
        </div>
      </div>

      {/* What This Means Section */}
      <div className={`${investmentGrade.bg} border ${investmentGrade.border} rounded-xl p-4 page-break-avoid`}>
        <div className="flex items-start space-x-3 mb-3">
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
    </section>
  );
}