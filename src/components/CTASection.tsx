import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface CTASectionProps {
  variant?: 'primary' | 'secondary';
  title?: string;
  description?: string;
}

export function CTASection({ 
  variant = 'primary',
  title = 'Ready to Analyze Your Investment?',
  description = 'Start with a free analysis. Get instant ROI calculations and see how YieldPulse can help you make informed investment decisions.'
}: CTASectionProps) {
  const bgClass = variant === 'primary' 
    ? 'bg-gradient-to-br from-primary to-primary-hover'
    : 'bg-gradient-to-br from-[#1e2875] to-[#2f3aad]';

  return (
    <section className={`py-20 ${bgClass} text-white`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">
          {title}
        </h2>
        <p className="text-lg sm:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            to="/calculator" 
            className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-[#1e2875] rounded-xl font-semibold hover:shadow-2xl transition-all duration-200"
          >
            <span>Start Free Analysis</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link 
            to="/pricing" 
            className="inline-flex items-center space-x-2 px-8 py-4 bg-white/10 text-white border-2 border-white/30 rounded-xl font-semibold hover:bg-white/20 transition-all duration-200"
          >
            <span>View Pricing</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
