import { Calendar, Target, Table2, BarChart3, FileCheck, Lock } from 'lucide-react';

interface PreviewItem {
  id: string;
  title: string;
  benefit: string;
  Icon: typeof Calendar;
}

interface PremiumPreviewStripProps {
  onPreviewClick: (itemId: string) => void;
}

export function PremiumPreviewStrip({ onPreviewClick }: PremiumPreviewStripProps) {
  const previewItems: PreviewItem[] = [
    {
      id: 'five-year-projection',
      title: 'Five-Year Financial Projection',
      benefit: 'See exactly how rent, cash flow, and equity evolve year by year',
      Icon: Calendar
    },
    {
      id: 'exit-scenario',
      title: 'Exit Scenario & Total Return',
      benefit: 'Calculate your exact profit if you sell in year 5 at market rates',
      Icon: Target
    },
    {
      id: 'sensitivity-tables',
      title: 'Full Sensitivity Tables',
      benefit: 'Stress test 9 scenarios to understand your downside protection',
      Icon: Table2
    },
    {
      id: 'cash-flow-waterfall',
      title: 'Cash Flow Anatomy Waterfall',
      benefit: 'Visualize where every dirham goes, from rent to your pocket',
      Icon: BarChart3
    },
    {
      id: 'assumptions-audit',
      title: 'Assumptions Audit Trail',
      benefit: 'Transparent formulas showing how every number is calculated',
      Icon: FileCheck
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-border p-8 mb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          What you unlock in the Premium Report
        </h2>
        <p className="text-neutral-600">
          Investor-grade analysis with projections, stress tests, and transparent calculations
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
        {previewItems.map((item) => (
          <div 
            key={item.id}
            className="border border-border rounded-xl p-4 hover:border-primary/30 hover:shadow-sm transition-all"
          >
            <div className="flex flex-col h-full">
              <div className="relative mb-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <item.Icon className="w-6 h-6 text-primary" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-warning rounded-full flex items-center justify-center">
                  <Lock className="w-3 h-3 text-white" />
                </div>
              </div>
              
              <h4 className="font-semibold text-foreground text-sm mb-2 leading-tight">
                {item.title}
              </h4>
              
              <p className="text-xs text-neutral-600 leading-relaxed mb-3 flex-1">
                {item.benefit}
              </p>
              
              <button
                onClick={() => onPreviewClick(item.id)}
                className="text-xs font-medium text-primary hover:text-primary-hover transition-colors underline text-left cursor-pointer"
              >
                Preview →
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-muted/50 border border-border rounded-lg">
        <p className="text-xs text-neutral-600 leading-relaxed">
          <strong className="text-foreground">Why Premium?</strong> The free analysis gives you headline metrics. 
          The Premium Report shows the full picture: multi-year projections, exit scenarios, downside stress tests, 
          and complete calculation transparency so you can make confident investment decisions.
        </p>
      </div>
    </div>
  );
}
