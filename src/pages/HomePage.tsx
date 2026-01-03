import { Link } from 'react-router-dom';
import { 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  Building, 
  CheckCircle, 
  ArrowRight, 
  BarChart3, 
  Shield, 
  Zap,
  Lock,
  FileCheck,
  Users
} from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 via-white to-neutral-50">
      <Header variant="transparent" />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-secondary/3 pointer-events-none" />
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-primary/5 px-4 py-2 rounded-full mb-10">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Professional UAE Property Analysis</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-8 leading-[1.1] tracking-tight">
              UAE Property Investment
              <br />
              <span className="text-primary">
                ROI Calculator
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl sm:text-2xl text-neutral-600 mb-12 leading-relaxed max-w-3xl mx-auto font-light">
              Make data driven property investment decisions in the UAE. Calculate returns, 
              analyze cash flow, and access institutional grade analysis starting at AED 49.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link 
                to="/calculator" 
                className="group inline-flex items-center space-x-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary-hover transition-all shadow-md hover:shadow-lg"
              >
                <span>Start Free Analysis</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/pricing" 
                className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-primary border-2 border-border rounded-xl font-medium hover:border-primary/30 hover:bg-neutral-50 transition-all"
              >
                <span>View Pricing</span>
              </Link>
            </div>

            {/* Credibility Strip */}
            <div className="pt-8 border-t border-border">
              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-neutral-600">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-secondary" />
                  <span className="font-medium">UAE specific formulas and fees</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-secondary" />
                  <span className="font-medium">Transparent calculations</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-secondary" />
                  <span className="font-medium">Instant results, no signup</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Three simple steps to institutional grade property analysis
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { 
                num: '1', 
                title: 'Enter Property Details', 
                desc: 'Add purchase price, rent, financing terms, and operating assumptions in under 2 minutes',
                icon: Building
              },
              { 
                num: '2', 
                title: 'View Free Preview', 
                desc: 'Instantly see headline metrics including yield, cash flow, and cash on cash return',
                icon: Zap
              },
              { 
                num: '3', 
                title: 'Unlock Premium Report', 
                desc: 'Pay AED 49 for complete 5 year projections, sensitivity analysis, and exit strategy calculations',
                icon: FileCheck
              }
            ].map((step, i) => (
              <div key={i} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-xl text-primary-foreground shadow-sm">
                      <step.icon className="w-7 h-7" />
                    </div>
                    <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 w-7 h-7 bg-secondary rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-sm">
                      {step.num}
                    </div>
                  </div>
                  <h3 className="font-semibold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-neutral-600 text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Report Preview Teaser */}
      <section className="py-24 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Institutional Grade Analysis
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Unlock detailed projections and sensitivity analysis used by professional investors
            </p>
          </div>

          <div className="bg-white rounded-2xl border-2 border-border overflow-hidden shadow-sm">
            {/* Preview Header */}
            <div className="px-8 py-6 border-b border-border bg-muted/30">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Premium Investment Report</h3>
                  <p className="text-sm text-neutral-600">Complete 5 year analysis with sensitivity testing</p>
                </div>
                <div className="flex items-center space-x-2 px-4 py-2 bg-secondary/10 rounded-lg">
                  <Lock className="w-4 h-4 text-secondary" />
                  <span className="text-sm font-medium text-secondary">AED 49</span>
                </div>
              </div>
            </div>

            {/* Blurred Preview Content */}
            <div className="relative">
              <div className="px-8 py-12 space-y-6 filter blur-sm select-none pointer-events-none">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 bg-muted/50 rounded-xl">
                    <div className="h-4 bg-neutral-300 rounded mb-2 w-24" />
                    <div className="h-8 bg-neutral-300 rounded w-32" />
                  </div>
                  <div className="p-6 bg-muted/50 rounded-xl">
                    <div className="h-4 bg-neutral-300 rounded mb-2 w-24" />
                    <div className="h-8 bg-neutral-300 rounded w-32" />
                  </div>
                  <div className="p-6 bg-muted/50 rounded-xl">
                    <div className="h-4 bg-neutral-300 rounded mb-2 w-24" />
                    <div className="h-8 bg-neutral-300 rounded w-32" />
                  </div>
                </div>
                <div className="h-48 bg-muted/50 rounded-xl" />
                <div className="grid grid-cols-2 gap-6">
                  <div className="h-40 bg-muted/50 rounded-xl" />
                  <div className="h-40 bg-muted/50 rounded-xl" />
                </div>
              </div>

              {/* Overlay CTA */}
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                <div className="text-center max-w-md px-6">
                  <Lock className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h4 className="font-semibold text-foreground mb-2">
                    Complete Analysis Available
                  </h4>
                  <p className="text-sm text-neutral-600 mb-6">
                    Get detailed projections, sensitivity analysis, and professional reporting for AED 49
                  </p>
                  <Link
                    to="/calculator"
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary-hover transition-colors shadow-sm"
                  >
                    <span>Start Free Analysis</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-neutral-600">
              Pay per report. No subscriptions. No hidden fees.
            </p>
          </div>

          <div className="bg-white rounded-2xl border-2 border-border p-12 shadow-sm">
            <div className="text-center mb-10">
              <div className="inline-flex items-baseline space-x-2">
                <span className="text-5xl font-bold text-foreground">AED 49</span>
                <span className="text-xl text-neutral-600">per report</span>
              </div>
              <p className="text-sm text-neutral-500 mt-2">One time payment per property analysis</p>
            </div>

            <div className="mb-10">
              <h3 className="font-semibold text-foreground mb-4 text-center">What You Get</h3>
              <ul className="space-y-3 max-w-md mx-auto">
                {[
                  'Free headline metrics (yield, cash flow, ROI)',
                  '5 year detailed financial projections',
                  'Sensitivity analysis (vacancy, rates, rent)',
                  'Exit strategy and capital gain calculations',
                  'Professional breakdown of all formulas',
                  'Lifetime access to your saved report'
                ].map((feature, i) => (
                  <li key={i} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-neutral-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              to="/calculator"
              className="block w-full py-4 bg-primary text-primary-foreground text-center rounded-xl font-medium hover:bg-primary-hover transition-colors shadow-sm"
            >
              Start Your Free Analysis
            </Link>
          </div>
        </div>
      </section>

      {/* Methodology and Trust Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Methodology and Transparency
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Conservative assumptions and transparent calculations you can verify
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-3">
                UAE Specific Formulas
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                All calculations use Dubai Land Department fees (4%), standard agent commissions, 
                and mortgage structures specific to UAE property markets.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-border">
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-semibold text-foreground mb-3">
                Conservative Presentation
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                We present metrics honestly, including negative cash flow scenarios and 
                realistic vacancy assumptions, not optimistic projections.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <FileCheck className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-3">
                Full Audit Trail
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Every calculation is documented and accessible in your premium report. 
                See exactly how each metric is derived from your inputs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Analyze Your Investment?
          </h2>
          <p className="text-lg text-primary-foreground/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join property investors across the UAE who use YieldPulse for 
            accurate ROI calculations and institutional grade investment analysis.
          </p>
          <Link 
            to="/calculator" 
            className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-primary rounded-xl font-medium hover:bg-neutral-50 transition-colors shadow-md"
          >
            <span>Start Your Free Analysis</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
