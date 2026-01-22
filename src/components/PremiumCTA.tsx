import { Lock, Sparkles } from 'lucide-react';

interface PremiumCTAProps {
  onUnlock: () => void;
  onSeeIncluded?: () => void;
  isLoading?: boolean;
  personalizedMessage?: string;
  variant?: 'default' | 'compact';
}

export function PremiumCTA({ 
  onUnlock, 
  onSeeIncluded, 
  isLoading = false, 
  personalizedMessage,
  variant = 'default'
}: PremiumCTAProps) {
  const bullets = [
    'Know your exact year 5 position and exit returns',
    'Validate every assumption with transparent calculations',
    'Understand your downside risk through stress testing'
  ];

  if (variant === 'compact') {
    return (
      <div className="bg-gradient-to-br from-primary/5 via-white to-secondary/5 border-2 border-primary/30 rounded-xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold text-foreground">Unlock the Premium Report</h3>
            </div>
            <p className="text-sm text-neutral-600 mb-1">
              Complete analysis • AED 49 one time
            </p>
            <p className="text-xs text-secondary font-semibold">
              ⚡ Join 500+ UAE investors who upgraded
            </p>
          </div>
          <button
            onClick={onUnlock}
            disabled={isLoading}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary-hover transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            <Lock className="w-4 h-4" />
            <span>{isLoading ? 'Processing...' : 'Unlock now'}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-primary/5 via-white to-secondary/5 border-2 border-primary/30 rounded-xl p-8 shadow-lg mb-12">
      {personalizedMessage && (
        <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
          <p className="text-sm text-primary font-medium leading-relaxed">
            {personalizedMessage}
          </p>
        </div>
      )}
      
      {/* Social Proof Badge */}
      <div className="mb-4 inline-flex items-center gap-2 bg-secondary/10 px-4 py-2 rounded-full border border-secondary/20">
        <div className="flex -space-x-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white"></div>
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-green-600 border-2 border-white"></div>
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-white"></div>
        </div>
        <span className="text-xs font-semibold text-secondary">500+ investors unlocked this week</span>
      </div>
      
      <div className="flex items-start gap-6">
        <div className="p-4 bg-gradient-to-br from-primary to-primary-hover rounded-2xl flex-shrink-0 shadow-md">
          <Sparkles className="w-7 h-7 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-2xl font-bold text-foreground">
              Unlock the Premium Report
            </h3>
            <span className="px-4 py-1.5 bg-primary text-white rounded-full text-sm font-bold">
              AED 49
            </span>
            <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-bold animate-pulse">
              LIMITED TIME
            </span>
          </div>
          <p className="text-neutral-600 mb-6 leading-relaxed">
            One time unlock • Complete investor-grade analysis • Instant PDF download
          </p>
          
          <ul className="space-y-3 mb-6">
            {bullets.map((bullet, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-success"></div>
                </div>
                <span className="text-sm text-neutral-700 leading-relaxed">{bullet}</span>
              </li>
            ))}
          </ul>
          
          {/* Value Stack */}
          <div className="mb-6 p-4 bg-neutral-50 border border-neutral-200 rounded-lg">
            <div className="text-xs font-semibold text-neutral-500 mb-2">YOU GET:</div>
            <div className="grid grid-cols-2 gap-2 text-xs text-neutral-700">
              <div>✓ 15+ detailed sections</div>
              <div>✓ 5-year projections</div>
              <div>✓ Risk analysis</div>
              <div>✓ PDF export</div>
              <div>✓ Lifetime access</div>
              <div>✓ Full audit trail</div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={onUnlock}
              disabled={isLoading}
              className="inline-flex items-center space-x-2 px-8 py-3.5 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary-hover transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-base"
            >
              <Lock className="w-5 h-5" />
              <span>{isLoading ? 'Processing...' : 'Unlock now for AED 49'}</span>
            </button>
            {onSeeIncluded && (
              <button
                onClick={onSeeIncluded}
                className="text-sm font-medium text-primary hover:text-primary-hover transition-colors underline"
              >
                See what's included
              </button>
            )}
          </div>
          
          {/* Trust Badge */}
          <div className="mt-4 text-xs text-neutral-500 flex items-center gap-4">
            <span>🔒 Secure payment via Stripe</span>
            <span>⚡ Instant delivery</span>
            <span>💯 Used by 500+ investors</span>
          </div>
        </div>
      </div>
    </div>
  );
}