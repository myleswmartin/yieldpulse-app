import { Lock } from 'lucide-react';

interface PremiumCTAProps {
  onUnlockClick: () => void;
  onSeeIncludedClick: () => void;
  creatingCheckout: boolean;
  personalizedMessage?: string;
  variant?: 'inline' | 'banner';
}

export function PremiumCTA({ 
  onUnlockClick, 
  onSeeIncludedClick, 
  creatingCheckout, 
  personalizedMessage,
  variant = 'banner'
}: PremiumCTAProps) {
  
  if (variant === 'inline') {
    return (
      <div className="bg-white border-2 border-primary/30 rounded-xl p-6 text-center">
        {personalizedMessage && (
          <p className="text-sm text-primary bg-primary/10 border border-primary/20 rounded-lg p-3 mb-4 leading-relaxed">
            {personalizedMessage}
          </p>
        )}
        
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
          onClick={onSeeIncludedClick}
          className="mt-3 text-sm text-neutral-600 hover:text-primary transition-colors"
        >
          See what is included
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-primary/10 via-secondary/5 to-primary/10 border-2 border-primary/30 rounded-xl p-6 mb-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex-1">
          {personalizedMessage && (
            <p className="text-sm text-primary bg-white/80 border border-primary/20 rounded-lg p-3 mb-3 leading-relaxed">
              {personalizedMessage}
            </p>
          )}
          
          <h3 className="text-xl font-bold text-foreground mb-2">Unlock the Premium Report</h3>
          <p className="text-sm text-neutral-700 mb-3">
            Get the full analysis with 5-year projections, exit scenarios, sensitivity tables, and complete breakdowns
          </p>
          
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <p className="text-2xl font-bold text-primary">AED 49</p>
              <p className="text-xs text-neutral-600">one time payment</p>
            </div>
            
            <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-neutral-700">
              <li className="flex items-center space-x-1">
                <span className="text-success">✓</span>
                <span>5-year projections</span>
              </li>
              <li className="flex items-center space-x-1">
                <span className="text-success">✓</span>
                <span>Exit value analysis</span>
              </li>
              <li className="flex items-center space-x-1">
                <span className="text-success">✓</span>
                <span>Stress tests</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <button 
            onClick={onUnlockClick}
            disabled={creatingCheckout}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold shadow-lg transition-all hover:bg-primary-hover hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            <Lock className="w-5 h-5" />
            <span>{creatingCheckout ? 'Processing...' : 'Unlock now'}</span>
          </button>
          
          <button 
            onClick={onSeeIncludedClick}
            className="text-sm text-neutral-600 hover:text-primary transition-colors"
          >
            See what is included
          </button>
        </div>
      </div>
    </div>
  );
}
