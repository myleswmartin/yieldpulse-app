import { useState, useEffect } from 'react';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FloatingCTAProps {
  variant?: 'sample' | 'calculator' | 'pricing';
  delay?: number; // Delay in ms before showing
}

export function FloatingCTA({ variant = 'sample', delay = 3000 }: FloatingCTAProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if user has already dismissed
    const dismissed = sessionStorage.getItem('floating-cta-dismissed');
    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    // Show after delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    sessionStorage.setItem('floating-cta-dismissed', 'true');
  };

  if (isDismissed || !isVisible) return null;

  const content = {
    sample: {
      text: 'Ready to analyze your property?',
      cta: 'Start Free Analysis',
      link: '/calculator',
      badge: 'FREE'
    },
    calculator: {
      text: 'See a real example first?',
      cta: 'View Sample Report',
      link: '/sample-premium-report',
      badge: 'DEMO'
    },
    pricing: {
      text: 'Try it risk-free',
      cta: 'Start Free Calculator',
      link: '/calculator',
      badge: 'FREE'
    }
  };

  const current = content[variant];

  return (
    <div 
      className="fixed bottom-6 right-6 z-40 animate-in slide-in-from-bottom-4 fade-in duration-500"
      role="dialog"
      aria-label="Floating call to action"
    >
      <div className="bg-gradient-to-br from-primary to-primary-hover text-white rounded-2xl shadow-2xl p-4 pr-6 max-w-sm border border-primary-foreground/10">
        <button
          onClick={handleDismiss}
          className="absolute -top-2 -right-2 w-6 h-6 bg-white text-neutral-600 rounded-full flex items-center justify-center hover:bg-neutral-100 transition-colors shadow-md"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold bg-secondary px-2 py-0.5 rounded-full">
                {current.badge}
              </span>
              <span className="text-xs font-semibold opacity-90">500+ this week</span>
            </div>
            <p className="text-sm font-medium mb-2">{current.text}</p>
            <Link
              to={current.link}
              className="inline-flex items-center gap-2 bg-white text-primary px-4 py-2 rounded-lg text-sm font-semibold hover:bg-neutral-100 transition-all shadow-sm"
            >
              <span>{current.cta}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
