import { Lock, BarChart3, TrendingUp, Table2, Target, FileCheck } from 'lucide-react';
import { usePublicPricing } from '../utils/usePublicPricing';

interface LockedPremiumSectionProps {
  onUnlock: () => void;
  isLoading?: boolean;
}

export function LockedPremiumSection({ onUnlock, isLoading = false }: LockedPremiumSectionProps) {
  const { priceLabel } = usePublicPricing();
  return (
    <div className="relative bg-white rounded-2xl shadow-sm border-2 border-primary/30 overflow-hidden">
      {/* Blur overlay */}
      <div className="absolute inset-0 backdrop-blur-sm bg-white/60 z-10 flex items-center justify-center">
        <div className="text-center max-w-md p-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-3">
            Premium Content Locked
          </h3>
          <p className="text-neutral-600 mb-6 leading-relaxed">
            Unlock the complete investor-grade analysis with detailed projections, stress tests, and transparent calculations
          </p>
          <button
            onClick={onUnlock}
            disabled={isLoading}
            className="inline-flex items-center space-x-2 px-8 py-3.5 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary-hover transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <Lock className="w-5 h-5" />
            <span>{isLoading ? 'Processing...' : `Unlock for ${priceLabel}`}</span>
          </button>
        </div>
      </div>

      {/* Preview content (blurred) */}
      <div className="p-8 space-y-8 select-none pointer-events-none">
        {/* Section A: Premium Executive Recap */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Premium Executive Recap
              </h2>
              <p className="text-neutral-600">Complete investment summary with grade analysis</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border border-border rounded-lg p-4 bg-neutral-50">
              <div className="h-4 bg-neutral-200 rounded w-24 mb-2"></div>
              <div className="h-8 bg-neutral-300 rounded w-32"></div>
            </div>
            <div className="border border-border rounded-lg p-4 bg-neutral-50">
              <div className="h-4 bg-neutral-200 rounded w-24 mb-2"></div>
              <div className="h-8 bg-neutral-300 rounded w-32"></div>
            </div>
            <div className="border border-border rounded-lg p-4 bg-neutral-50">
              <div className="h-4 bg-neutral-200 rounded w-24 mb-2"></div>
              <div className="h-8 bg-neutral-300 rounded w-32"></div>
            </div>
          </div>
        </div>

        {/* Section B: Cash Flow Anatomy */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">
              Cash Flow Anatomy Waterfall
            </h2>
          </div>
          <div className="border border-border rounded-lg p-6 bg-neutral-50 h-80 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 bg-neutral-300 rounded-lg mx-auto mb-3"></div>
              <div className="h-4 bg-neutral-200 rounded w-48 mx-auto"></div>
            </div>
          </div>
        </div>

        {/* Section C: Monthly Operating Expenses */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Monthly Operating Expenses Breakdown
          </h2>
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-neutral-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Expense Category</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">Monthly Amount</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">Annual Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-border">
                  <td className="px-4 py-3"><div className="h-4 bg-neutral-200 rounded w-32"></div></td>
                  <td className="px-4 py-3"><div className="h-4 bg-neutral-200 rounded w-20 ml-auto"></div></td>
                  <td className="px-4 py-3"><div className="h-4 bg-neutral-200 rounded w-20 ml-auto"></div></td>
                </tr>
                <tr className="border-t border-border">
                  <td className="px-4 py-3"><div className="h-4 bg-neutral-200 rounded w-32"></div></td>
                  <td className="px-4 py-3"><div className="h-4 bg-neutral-200 rounded w-20 ml-auto"></div></td>
                  <td className="px-4 py-3"><div className="h-4 bg-neutral-200 rounded w-20 ml-auto"></div></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section D: Mortgage & Amortization */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Mortgage Payment & First Year Amortization
          </h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="border border-border rounded-lg p-6 bg-neutral-50 h-64"></div>
            <div className="border border-border rounded-lg p-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <div className="h-4 bg-neutral-200 rounded w-24"></div>
                  <div className="h-4 bg-neutral-200 rounded w-20"></div>
                </div>
                <div className="flex justify-between">
                  <div className="h-4 bg-neutral-200 rounded w-24"></div>
                  <div className="h-4 bg-neutral-200 rounded w-20"></div>
                </div>
                <div className="flex justify-between">
                  <div className="h-4 bg-neutral-200 rounded w-24"></div>
                  <div className="h-4 bg-neutral-200 rounded w-20"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section E: Five-Year Financial Projection */}
        <div id="five-year-projection">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">
              Five-Year Financial Projection
            </h2>
          </div>
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-neutral-100">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold">Metric</th>
                  <th className="px-3 py-2 text-right text-xs font-semibold">Year 1</th>
                  <th className="px-3 py-2 text-right text-xs font-semibold">Year 2</th>
                  <th className="px-3 py-2 text-right text-xs font-semibold">Year 3</th>
                  <th className="px-3 py-2 text-right text-xs font-semibold">Year 4</th>
                  <th className="px-3 py-2 text-right text-xs font-semibold">Year 5</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-border">
                  <td className="px-3 py-2"><div className="h-3 bg-neutral-200 rounded w-24"></div></td>
                  <td className="px-3 py-2"><div className="h-3 bg-neutral-200 rounded w-16 ml-auto"></div></td>
                  <td className="px-3 py-2"><div className="h-3 bg-neutral-200 rounded w-16 ml-auto"></div></td>
                  <td className="px-3 py-2"><div className="h-3 bg-neutral-200 rounded w-16 ml-auto"></div></td>
                  <td className="px-3 py-2"><div className="h-3 bg-neutral-200 rounded w-16 ml-auto"></div></td>
                  <td className="px-3 py-2"><div className="h-3 bg-neutral-200 rounded w-16 ml-auto"></div></td>
                </tr>
                <tr className="border-t border-border">
                  <td className="px-3 py-2"><div className="h-3 bg-neutral-200 rounded w-24"></div></td>
                  <td className="px-3 py-2"><div className="h-3 bg-neutral-200 rounded w-16 ml-auto"></div></td>
                  <td className="px-3 py-2"><div className="h-3 bg-neutral-200 rounded w-16 ml-auto"></div></td>
                  <td className="px-3 py-2"><div className="h-3 bg-neutral-200 rounded w-16 ml-auto"></div></td>
                  <td className="px-3 py-2"><div className="h-3 bg-neutral-200 rounded w-16 ml-auto"></div></td>
                  <td className="px-3 py-2"><div className="h-3 bg-neutral-200 rounded w-16 ml-auto"></div></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section F: Exit Scenario Analysis */}
        <div id="exit-scenario">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">
              Exit Scenario & Year 5 Total Return
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="border border-border rounded-lg p-4">
              <div className="space-y-3">
                <div className="h-4 bg-neutral-200 rounded w-full"></div>
                <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
                <div className="h-4 bg-neutral-200 rounded w-full"></div>
              </div>
            </div>
            <div className="border border-border rounded-lg p-4">
              <div className="space-y-3">
                <div className="h-4 bg-neutral-200 rounded w-full"></div>
                <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
                <div className="h-4 bg-neutral-200 rounded w-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Section G: Comprehensive Sensitivity Analysis */}
        <div id="sensitivity-tables">
          <div className="flex items-center gap-2 mb-4">
            <Table2 className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">
              Comprehensive Sensitivity Analysis
            </h2>
          </div>
          <div className="space-y-4">
            <div className="border border-border rounded-lg p-4">
              <div className="h-5 bg-neutral-200 rounded w-48 mb-3"></div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="h-4 bg-neutral-200 rounded"></div>
                <div className="h-4 bg-neutral-200 rounded"></div>
                <div className="h-4 bg-neutral-200 rounded"></div>
                <div className="h-4 bg-neutral-200 rounded"></div>
              </div>
            </div>
            <div className="border border-border rounded-lg p-4">
              <div className="h-5 bg-neutral-200 rounded w-48 mb-3"></div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="h-4 bg-neutral-200 rounded"></div>
                <div className="h-4 bg-neutral-200 rounded"></div>
                <div className="h-4 bg-neutral-200 rounded"></div>
                <div className="h-4 bg-neutral-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Section H: Complete Input Assumptions */}
        <div id="assumptions-audit">
          <div className="flex items-center gap-2 mb-4">
            <FileCheck className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">
              Complete Input Assumptions & Calculation Methodology
            </h2>
          </div>
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-neutral-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Input Parameter</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">Your Value</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="px-4 py-3"><div className="h-4 bg-neutral-200 rounded w-40"></div></td>
                    <td className="px-4 py-3"><div className="h-4 bg-neutral-200 rounded w-24 ml-auto"></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
