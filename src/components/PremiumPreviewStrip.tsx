import { Eye, TrendingUp, Target, Table, Droplet, FileCheck, Lock } from 'lucide-react';

interface PremiumPreviewStripProps {
  onPreviewClick: (section: string) => void;
  onUnlockClick: () => void;
  creatingCheckout: boolean;
}

export function PremiumPreviewStrip({ onPreviewClick, onUnlockClick, creatingCheckout }: PremiumPreviewStripProps) {
  const premiumFeatures = [
    {
      id: 'five-year-projection',
      icon: TrendingUp,
      title: '5-Year Financial Projection',
      benefit: 'See your cash flow, equity, and property value trajectory year by year',
    },
    {
      id: 'exit-scenario',
      icon: Target,
      title: 'Exit Scenario & Total Return',
      benefit: 'Know your exact profit if you sell in year 5, including all costs and gains',
    },
    {
      id: 'sensitivity-tables',
      icon: Table,
      title: 'Full Sensitivity Tables',
      benefit: 'Stress test your returns across rent, price, and rate scenarios',
    },
    {
      id: 'cashflow-waterfall',
      icon: Droplet,
      title: 'Cash Flow Anatomy Waterfall',
      benefit: 'Visual breakdown showing exactly where your rental income goes',
    },
    {
      id: 'assumptions-audit',
      icon: FileCheck,
      title: 'Assumptions Audit Trail',
      benefit: 'Complete record of every input and calculation for transparency',
    },
  ];

  return (
    <div className="bg-gradient-to-br from-primary/5 via-secondary/3 to-primary/5 border-2 border-primary/20 rounded-2xl p-8 mb-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">What You Unlock in the Premium Report</h2>
        <p className="text-neutral-600">5 high-value components that deliver complete investment clarity</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {premiumFeatures.map((feature) => {
          const Icon = feature.icon;
          return (
            <div key={feature.id} className="bg-white border border-border rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-3 mb-3">
                <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground text-sm mb-1">{feature.title}</h3>
                </div>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed mb-3">{feature.benefit}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 text-xs text-neutral-400">
                  <Lock className="w-3 h-3" />
                  <span>Locked</span>
                </div>
                <button 
                  onClick={() => onPreviewClick(feature.id)}
                  className="flex items-center space-x-1 text-xs text-primary hover:text-primary-hover font-medium"
                >
                  <Eye className="w-3 h-3" />
                  <span>Preview</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Primary CTA */}
      <div className="bg-white border-2 border-primary/30 rounded-xl p-6 text-center">
        <h3 className="text-xl font-bold text-foreground mb-2">Unlock the Premium Report</h3>
        <p className="text-2xl font-bold text-primary mb-1">AED 49</p>
        <p className="text-sm text-neutral-600 mb-4">one time payment • lifetime access</p>
        
        <ul className="text-left space-y-2 mb-5 max-w-md mx-auto">
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
          onClick={onUnlockClick}
          disabled={creatingCheckout}
          className="w-full max-w-md mx-auto flex items-center justify-center space-x-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold shadow-lg transition-all hover:bg-primary-hover hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Lock className="w-5 h-5" />
          <span>{creatingCheckout ? 'Processing...' : 'Unlock now'}</span>
        </button>
        
        <button 
          onClick={() => onPreviewClick('locked-premium')}
          className="mt-3 text-sm text-neutral-600 hover:text-primary transition-colors"
        >
          See what is included
        </button>
      </div>
    </div>
  );
}
