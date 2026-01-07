import { Lock, TrendingUp, Eye, BarChart3 } from 'lucide-react';

interface LockedPremiumSectionProps {
  onUnlockClick: () => void;
  creatingCheckout: boolean;
  personalizedMessage: string;
}

export function LockedPremiumSection({ onUnlockClick, creatingCheckout, personalizedMessage }: LockedPremiumSectionProps) {
  return (
    <div className="relative bg-white rounded-2xl shadow-sm border-2 border-primary/30 overflow-hidden">
      {/* Premium Header */}
      <div className="bg-gradient-to-r from-primary to-primary-hover px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Lock className="w-5 h-5 text-primary-foreground" />
              <h2 className="text-2xl font-bold text-primary-foreground">Premium Report Analysis</h2>
            </div>
            <p className="text-primary-foreground/90">Complete insights, projections, and decision tools</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-primary-foreground mb-1">AED 49</div>
            <div className="text-sm text-primary-foreground/80">one time unlock</div>
          </div>
        </div>
      </div>

      {/* Blurred Content Preview */}
      <div className="p-8 space-y-8">
        
        {/* Section 1: Visual Analysis */}
        <div>
          <h3 className="text-xl font-bold text-foreground mb-4 flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            <span>A. Visual Analysis</span>
          </h3>
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-neutral-100 rounded-xl p-6 h-64 flex items-center justify-center border border-border">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Lock className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm font-medium text-neutral-600">Cash Flow Waterfall Chart</p>
                <p className="text-xs text-neutral-500 mt-1">Interactive breakdown of income and expenses</p>
              </div>
            </div>
            <div className="bg-neutral-100 rounded-xl p-6 h-64 flex items-center justify-center border border-border">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Lock className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm font-medium text-neutral-600">Yield Comparison Chart</p>
                <p className="text-xs text-neutral-500 mt-1">Gross vs net vs cash on cash returns</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Financial Details */}
        <div>
          <h3 className="text-xl font-bold text-foreground mb-4 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span>B. Financial Details</span>
          </h3>
          <div className="bg-neutral-50 border border-border rounded-xl p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-foreground mb-3 text-sm">Income Statement</h4>
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex justify-between py-2 border-b border-border">
                      <div className="h-4 bg-neutral-200 rounded w-32"></div>
                      <div className="h-4 bg-neutral-200 rounded w-20"></div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-3 text-sm">Cost Breakdown</h4>
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex justify-between py-2 border-b border-border">
                      <div className="h-4 bg-neutral-200 rounded w-32"></div>
                      <div className="h-4 bg-neutral-200 rounded w-20"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Five-Year Projection - Teaser */}
        <div>
          <h3 className="text-xl font-bold text-foreground mb-4">C. Five-Year Financial Projection</h3>
          <div className="bg-neutral-50 border border-border rounded-xl p-6 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-neutral-200">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Metric</th>
                    <th className="text-right py-3 px-4 font-semibold text-foreground">Year 1</th>
                    <th className="text-right py-3 px-4 font-semibold text-foreground">Year 2</th>
                    <th className="text-right py-3 px-4 font-semibold text-foreground">Year 3</th>
                    <th className="text-right py-3 px-4 font-semibold text-foreground">Year 4</th>
                    <th className="text-right py-3 px-4 font-semibold text-foreground">Year 5</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Skeleton rows */}
                  {['Property Value', 'Rental Income', 'Cash Flow', 'Cumulative CF', 'Equity Built'].map((label, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}>
                      <td className="py-3 px-4 text-sm text-neutral-700 font-medium">{label}</td>
                      {[1, 2, 3, 4, 5].map((year) => (
                        <td key={year} className="py-3 px-4 text-right">
                          <div className="h-4 bg-neutral-200 rounded w-16 ml-auto"></div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Section 4: Exit Scenario */}
        <div>
          <h3 className="text-xl font-bold text-foreground mb-4">D. Exit Scenario Analysis</h3>
          <div className="bg-neutral-50 border border-border rounded-xl p-6">
            <p className="text-sm text-neutral-600 mb-4">Year 5 exit scenario with complete return breakdown</p>
            <div className="grid md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex justify-between py-2 border-b border-border">
                  <div className="h-4 bg-neutral-200 rounded w-32"></div>
                  <div className="h-4 bg-neutral-200 rounded w-24"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 5: Sensitivity Analysis */}
        <div>
          <h3 className="text-xl font-bold text-foreground mb-4">E. Complete Sensitivity Analysis</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {['Rent Scenarios', 'Price Scenarios', 'Rate Scenarios'].map((label) => (
              <div key={label} className="bg-neutral-50 border border-border rounded-xl p-5">
                <h4 className="font-semibold text-foreground mb-3 text-sm">{label}</h4>
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex justify-between py-1">
                      <div className="h-3 bg-neutral-200 rounded w-20"></div>
                      <div className="h-3 bg-neutral-200 rounded w-16"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional sections headings */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-foreground">F. Cash Flow Methodology</h3>
          <h3 className="text-xl font-bold text-foreground">G. Operating Expense Detail</h3>
          <h3 className="text-xl font-bold text-foreground">H. Assumptions Audit Trail</h3>
          <h3 className="text-xl font-bold text-foreground">I. Calculation Methodology</h3>
          <h3 className="text-xl font-bold text-foreground">J. Investment Grade Methodology</h3>
        </div>
      </div>

      {/* Locked Overlay */}
      <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center">
        <div className="text-center max-w-lg px-6">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Lock className="w-10 h-10 text-primary-foreground" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-3">
            Unlock Complete Analysis
          </h3>
          
          {/* Personalized Message */}
          {personalizedMessage && (
            <p className="text-sm text-primary bg-primary/10 border border-primary/20 rounded-lg p-3 mb-5 leading-relaxed">
              {personalizedMessage}
            </p>
          )}
          
          <p className="text-neutral-700 mb-6 leading-relaxed">
            Get instant access to interactive charts, detailed financial tables, 5 year projections, and complete cost breakdowns to make a confident investment decision.
          </p>
          
          <div className="bg-muted/50 rounded-lg p-4 mb-6 border border-border">
            <p className="text-sm font-medium text-foreground mb-2">One time payment. Lifetime access to this report.</p>
            <p className="text-xs text-neutral-600">View anytime from your dashboard. No recurring fees.</p>
          </div>
          
          {/* Primary CTA */}
          <h4 className="text-lg font-bold text-foreground mb-2">Unlock the Premium Report</h4>
          <p className="text-2xl font-bold text-primary mb-1">AED 49</p>
          <p className="text-sm text-neutral-600 mb-4">one time payment</p>
          
          <ul className="text-left space-y-2 mb-5 max-w-sm mx-auto">
            <li className="flex items-start space-x-2 text-sm text-neutral-700">
              <span className="text-success mt-0.5">✓</span>
              <span>Make confident decisions with 5-year financial projections</span>
            </li>
            <li className="flex items-start space-x-2 text-sm text-neutral-700">
              <span className="text-success mt-0.5">✓</span>
              <span>Understand your true exit value and total returns</span>
            </li>
            <li className="flex items-start space-x-2 text-sm text-neutral-700">
              <span className="text-success mt-0.5">✓</span>
              <span>Validate assumptions with stress-tested scenarios</span>
            </li>
          </ul>
          
          <button 
            disabled={creatingCheckout}
            className="inline-flex items-center space-x-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold shadow-lg transition-all hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed mb-3"
            onClick={onUnlockClick}
          >
            <Lock className="w-5 h-5" />
            <span>{creatingCheckout ? 'Processing...' : 'Unlock now'}</span>
          </button>
          
          <p className="text-sm text-neutral-600">
            Pay now, complete sign up after. Full access immediately.
          </p>
        </div>
      </div>
    </div>
  );
}
