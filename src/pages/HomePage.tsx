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
  Users,
  BookOpen,
  FileText,
  X
} from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { CTASection } from '../components/CTASection';
import { usePublicPricing } from '../utils/usePublicPricing';

export default function HomePage() {
  const { priceLabel } = usePublicPricing();
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-neutral-50 to-white">
      <Header variant="transparent" />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-primary/[0.02] to-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-28 pb-12">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary/8 to-secondary/8 backdrop-blur-sm px-5 py-2.5 rounded-full mb-10 border border-primary/10 shadow-sm">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Professional UAE Property Analysis</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-8 leading-[1.08] tracking-tight">
              UAE Property Investment
              <br />
              <span className="bg-gradient-to-r from-primary via-primary to-primary-hover bg-clip-text text-transparent">
                ROI Calculator
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl sm:text-2xl text-neutral-600 mb-12 leading-relaxed max-w-3xl mx-auto font-light">
              Make data driven property investment decisions in the UAE. Calculate returns, 
              analyze cash flow, and access institutional grade analysis for just {priceLabel}.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link 
                to="/calculator" 
                className="group inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-primary to-primary-hover text-primary-foreground rounded-xl font-semibold hover:shadow-xl hover:shadow-primary/25 transition-all duration-300 hover:scale-[1.02]"
              >
                <span>Start Free Analysis</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/sample-premium-report" 
                className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-primary border-2 border-neutral-200 rounded-xl font-semibold hover:border-primary/20 hover:bg-neutral-50 hover:shadow-lg transition-all duration-300"
              >
                <FileCheck className="w-5 h-5" />
                <span>View Sample Report</span>
              </Link>
            </div>
            
            {/* Social Proof Strip */}
            <div className="mb-16 flex flex-col items-center gap-3">
              <p className="text-sm font-semibold text-neutral-600">
                <span className="text-primary font-bold">500+</span> UAE investors upgraded this week
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-5">
              How It Works
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto font-light">
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
                desc: `Pay ${priceLabel} for complete 5 year projections, sensitivity analysis, and exit strategy calculations`,
                icon: FileCheck
              }
            ].map((step, i) => (
              <div key={i} className="relative group">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-6 group-hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-primary-hover rounded-2xl text-primary-foreground shadow-lg shadow-primary/20">
                      <step.icon className="w-8 h-8" />
                    </div>
                    <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 w-8 h-8 bg-gradient-to-br from-secondary to-teal-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md">
                      {step.num}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-neutral-600 text-base leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Report Guide CTA */}
      <section className="py-20 bg-gradient-to-br from-secondary/5 via-white to-primary/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl border border-primary/10 shadow-2xl shadow-primary/10 overflow-hidden">
              <div className="p-8 sm:p-12">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary via-primary to-primary-hover rounded-3xl flex items-center justify-center shadow-xl shadow-primary/30">
                      <BookOpen className="w-12 h-12 text-primary-foreground" />
                    </div>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                      New to Property Investment?
                    </h3>
                    <p className="text-lg text-neutral-600 mb-6 leading-relaxed">
                      Our comprehensive guide takes you from zero knowledge to confident investor. Learn how to read premium reports, understand all metrics, and make smart investment decisions.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
                      <Link 
                        to="/premium-report-guide"
                        className="group inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-primary to-primary-hover text-primary-foreground rounded-xl font-semibold hover:shadow-xl hover:shadow-primary/25 transition-all duration-300 hover:scale-[1.02]"
                      >
                        <span>Read the Complete Guide</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                      <Link 
                        to="/glossary"
                        className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-primary border-2 border-neutral-200 rounded-xl font-semibold hover:border-primary/20 hover:bg-neutral-50 hover:shadow-lg transition-all duration-300"
                      >
                        <BookOpen className="w-5 h-5" />
                        <span>View Glossary</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-primary/[0.03] to-secondary/[0.03] px-8 sm:px-12 py-5 border-t border-neutral-100">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-5 text-sm text-neutral-600">
                  <span className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span className="font-medium">Property Investment 101</span>
                  </span>
                  <span className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span className="font-medium">All Metrics Explained</span>
                  </span>
                  <span className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span className="font-medium">Common Mistakes to Avoid</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Report Preview Teaser */}
      <section className="py-24 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-5">
              See What You'll Get
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto font-light">
              Real example from a Dubai Marina apartment analysis. Download the full sample report as PDF.
            </p>
          </div>

          {/* Two Column Layout: Key Metrics + Visual Preview */}
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left: Key Metrics from Sample Report */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-primary/10 p-8 shadow-xl shadow-primary/5">
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center">
                    <Building className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-1">1BR Apartment - Dubai Marina</h3>
                    <p className="text-sm text-neutral-600">Purchase Price: AED 1,200,000 | Rent: AED 8,000/month</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-5 bg-gradient-to-br from-emerald-50 via-emerald-50 to-emerald-100/50 rounded-2xl border border-emerald-200/50 shadow-sm">
                    <div className="text-xs text-emerald-700 font-semibold mb-1.5">Year 5 ROI</div>
                    <div className="text-3xl font-bold text-emerald-800">41.2%</div>
                    <div className="text-xs text-emerald-600 mt-1.5 font-medium">8.2% annualized</div>
                  </div>
                  <div className="p-5 bg-gradient-to-br from-blue-50 via-blue-50 to-blue-100/50 rounded-2xl border border-blue-200/50 shadow-sm">
                    <div className="text-xs text-blue-700 font-semibold mb-1.5">Gross Yield</div>
                    <div className="text-3xl font-bold text-blue-800">8.00%</div>
                    <div className="text-xs text-blue-600 mt-1.5 font-medium">Annual return</div>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-neutral-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-600 font-medium">Monthly Cash Flow</span>
                    <span className="font-bold text-emerald-700">+AED 664</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-600 font-medium">Property Value (Year 5)</span>
                    <span className="font-bold text-foreground">AED 1,324,897</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-600 font-medium">Total Wealth Created</span>
                    <span className="font-bold text-primary">AED 180,116</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary via-primary to-primary-hover text-white rounded-2xl p-7 shadow-xl shadow-primary/30">
                <div className="flex items-start gap-3 mb-4">
                  <FileCheck className="w-6 h-6 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-lg mb-3">Your Report Includes:</h4>
                    <ul className="text-sm space-y-2.5 text-white/95">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>15+ detailed sections with charts & graphs</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>5-year projections with year-by-year breakdown</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>Sensitivity analysis & risk scenarios</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>Professional PDF export for investors</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Visual Preview with CTA */}
            <div className="relative">
              {/* Mock Report Screenshot */}
              <div className="bg-white rounded-3xl border-2 border-neutral-200 shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-primary/[0.06] to-secondary/[0.06] px-6 py-5 border-b border-neutral-200">
                  <div className="text-xs font-bold text-primary mb-1.5 tracking-wide">PREMIUM REPORT</div>
                  <div className="font-bold text-lg text-foreground">5-Year Investment Analysis</div>
                </div>
                
                <div className="p-6 space-y-4">
                  {/* Mini Chart Placeholder */}
                  <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-2xl p-5 border border-neutral-200">
                    <div className="text-xs font-bold text-neutral-600 mb-4 tracking-wide">Property Value Projection</div>
                    <div className="flex items-end justify-between h-28 gap-2">
                      <div className="flex-1 bg-gradient-to-t from-primary/30 to-primary/20 rounded-t-lg" style={{height: '45%'}}></div>
                      <div className="flex-1 bg-gradient-to-t from-primary/40 to-primary/30 rounded-t-lg" style={{height: '55%'}}></div>
                      <div className="flex-1 bg-gradient-to-t from-primary/50 to-primary/40 rounded-t-lg" style={{height: '65%'}}></div>
                      <div className="flex-1 bg-gradient-to-t from-primary/70 to-primary/60 rounded-t-lg" style={{height: '80%'}}></div>
                      <div className="flex-1 bg-gradient-to-t from-primary to-primary-hover rounded-t-lg shadow-sm" style={{height: '100%'}}></div>
                    </div>
                    <div className="flex justify-between text-xs text-neutral-500 mt-3 font-medium">
                      <span>Y1</span>
                      <span>Y2</span>
                      <span>Y3</span>
                      <span>Y4</span>
                      <span>Y5</span>
                    </div>
                  </div>

                  {/* Key Metrics Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200">
                      <div className="text-xs text-neutral-600 mb-1.5 font-semibold">Net Yield</div>
                      <div className="text-2xl font-bold text-foreground">5.58%</div>
                    </div>
                    <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200">
                      <div className="text-xs text-neutral-600 mb-1.5 font-semibold">Break-even</div>
                      <div className="text-2xl font-bold text-foreground">86.7%</div>
                    </div>
                  </div>

                  {/* More sections indicator */}
                  <div className="space-y-2.5 pt-2">
                    <div className="h-3 bg-neutral-200 rounded-full w-full"></div>
                    <div className="h-3 bg-neutral-200 rounded-full w-5/6"></div>
                    <div className="h-3 bg-neutral-200 rounded-full w-4/6"></div>
                  </div>
                </div>

                {/* Overlay with CTA */}
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/98 to-transparent flex items-end justify-center pb-8">
                  <div className="text-center px-6 max-w-sm">
                    <Link
                      to="/sample-premium-report"
                      className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-primary to-primary-hover text-white font-bold rounded-xl hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105 mb-3"
                    >
                      <FileCheck className="w-5 h-5" />
                      <span>View Full Sample Report</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <p className="text-xs text-neutral-600 font-medium">
                      See the complete analysis + download PDF
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-br from-secondary to-teal-600 text-white px-5 py-2.5 rounded-full shadow-xl shadow-secondary/30 transform rotate-6">
                <div className="text-xs font-bold tracking-wide">Real Example</div>
              </div>
            </div>
          </div>

          {/* Bottom CTA Strip */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 bg-white border border-primary/10 rounded-full px-7 py-3.5 shadow-lg shadow-primary/5">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-sm text-neutral-700 font-medium">
                Generate your own professional report for just <span className="font-bold text-primary">{priceLabel}</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-5">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-neutral-600 font-light">
              Pay per report. No subscriptions. No hidden fees.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Free Analysis */}
            <div className="bg-gradient-to-br from-white via-neutral-50 to-white rounded-3xl border-2 border-neutral-200 overflow-hidden shadow-xl flex flex-col hover:shadow-2xl transition-shadow duration-300">
              <div className="bg-gradient-to-r from-secondary via-secondary to-secondary/90 p-7 text-white">
                <div className="flex items-center space-x-3 mb-3">
                  <Calculator className="w-9 h-9" />
                  <h3 className="text-2xl font-bold">Free Analysis</h3>
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-5xl font-bold">AED 0</span>
                </div>
                <p className="text-sm text-white/95 mt-2 font-medium">Unlimited analyses, forever free</p>
              </div>

              <div className="p-7 space-y-4 flex-grow">
                <p className="text-neutral-700 leading-relaxed font-medium">
                  Perfect for quick property comparisons and initial screening. Get all essential metrics instantly.
                </p>

                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-neutral-900">Gross Rental Yield</p>
                      <p className="text-sm text-neutral-600">Annual rent ÷ purchase price</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-neutral-900">Net Rental Yield</p>
                      <p className="text-sm text-neutral-600">After expenses and costs</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-neutral-900">Cash on Cash Return</p>
                      <p className="text-sm text-neutral-600">Return on actual cash invested</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-neutral-900">Monthly & Annual Cash Flow</p>
                      <p className="text-sm text-neutral-600">Complete income and expense breakdown</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-neutral-900">Save to Dashboard</p>
                      <p className="text-sm text-neutral-600">Access all analyses anytime</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <X className="w-5 h-5 text-neutral-300 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-neutral-400">5 Year Projections</p>
                      <p className="text-sm text-neutral-400">Premium only</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <X className="w-5 h-5 text-neutral-300 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-neutral-400">Sensitivity Analysis</p>
                      <p className="text-sm text-neutral-400">Premium only</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <X className="w-5 h-5 text-neutral-300 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-neutral-400">PDF Report</p>
                      <p className="text-sm text-neutral-400">Premium only</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-7 pt-0">
                <Link
                  to="/calculator"
                  className="block w-full py-3.5 bg-gradient-to-r from-secondary to-secondary/90 text-white text-center rounded-xl font-bold hover:shadow-xl hover:shadow-secondary/20 transition-all duration-300 hover:scale-[1.02]"
                >
                  Start Free Analysis
                </Link>
              </div>
            </div>

            {/* Premium Report */}
            <div className="relative bg-gradient-to-br from-primary via-primary to-primary-hover rounded-3xl border-2 border-primary overflow-hidden shadow-2xl shadow-primary/20 flex flex-col hover:shadow-3xl transition-shadow duration-300">
              <div className="bg-white/10 backdrop-blur-sm p-7 text-white">
                <div className="flex items-center space-x-3 mb-3">
                  <FileText className="w-9 h-9" />
                  <h3 className="text-2xl font-bold">Premium Report</h3>
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-5xl font-bold">{priceLabel}</span>
                  <span className="text-white/90 font-medium">per report</span>
                </div>
                <p className="text-sm text-white/95 mt-2 font-medium">One time payment • No subscription</p>
              </div>

              <div className="p-7 space-y-4 flex-grow">
                <p className="text-white/95 leading-relaxed font-medium">
                  Comprehensive analysis for serious investment decisions. Institutional grade reporting and detailed projections.
                </p>

                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-white">Everything in Free</p>
                      <p className="text-sm text-white/85">All headline metrics included</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-white">5 Year Financial Projections</p>
                      <p className="text-sm text-white/85">Year by year breakdown with growth assumptions</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-white">Vacancy Sensitivity Analysis</p>
                      <p className="text-sm text-white/85">Impact of 0 to 3+ months vacancy</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-white">Rent Change Scenarios</p>
                      <p className="text-sm text-white/85">What if rent changes ±5%, ±10%, ±15%</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-white">Interest Rate Impact</p>
                      <p className="text-sm text-white/85">Mortgage rate change analysis</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-white">Exit Strategy Calculations</p>
                      <p className="text-sm text-white/85">Property sale scenarios and total returns</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-white">Full Calculation Transparency</p>
                      <p className="text-sm text-white/85">All formulas and assumptions shown</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-white">Professional PDF Download</p>
                      <p className="text-sm text-white/85">Ready to share with partners and lenders</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-white">Lifetime Access</p>
                      <p className="text-sm text-white/85">Download anytime from dashboard</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-7 pt-0">
                <Link
                  to="/calculator"
                  className="block w-full py-3.5 bg-white text-primary text-center rounded-xl font-bold hover:shadow-2xl hover:bg-neutral-50 transition-all duration-300 hover:scale-[1.02]"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Methodology and Trust Section */}
      <section className="py-24 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-5">
              Methodology and Transparency
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto font-light">
              Conservative assumptions and transparent calculations you can verify
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center mb-5">
                <BarChart3 className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                UAE Specific Formulas
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                All calculations use Dubai Land Department fees (4%), standard agent commissions, 
                and mortgage structures specific to UAE property markets.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-2xl flex items-center justify-center mb-5">
                <Shield className="w-7 h-7 text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                Conservative Presentation
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                We present metrics honestly, including negative cash flow scenarios and 
                realistic vacancy assumptions, not optimistic projections.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center mb-5">
                <FileCheck className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
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

      {/* Testimonials / Social Proof Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-5">
              Trusted by UAE Investors
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto font-light">
              See what property investors are saying about YieldPulse
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Ahmed K.',
                role: 'First-time Investor',
                location: 'Dubai Marina',
                text: 'The premium report helped me understand the real costs and returns before committing AED 1.5M. The detailed breakdown of financing options and sensitivity analysis gave me the confidence to move forward. Worth every dirham.',
                rating: 5
              },
              {
                name: 'Sarah M.',
                role: 'Portfolio Investor',
                location: 'JBR & Business Bay',
                text: 'I analyzed 8 properties in one week using YieldPulse. The sensitivity analysis revealed which deals actually made sense and which looked good on paper but had hidden risks. This tool has become essential to my investment process.',
                rating: 5
              },
              {
                name: 'Rashid A.',
                role: 'Real Estate Agent',
                location: 'Dubai',
                text: 'My clients love the professional PDF reports with comprehensive financial projections. It builds trust immediately and helps close deals faster because buyers can see exactly what they\'re getting. Game changer for my business.',
                rating: 5
              }
            ].map((testimonial, i) => (
              <div key={i} className="bg-gradient-to-br from-white via-neutral-50 to-white p-7 rounded-2xl border border-neutral-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-center gap-1 mb-5">
                  {[...Array(testimonial.rating)].map((_, idx) => (
                    <span key={idx} className="text-secondary text-xl">★</span>
                  ))}
                </div>
                <p className="text-neutral-700 mb-5 leading-relaxed text-sm italic">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-white font-bold shadow-md">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-foreground text-sm">{testimonial.name}</div>
                    <div className="text-xs text-neutral-500 font-medium">{testimonial.role} • {testimonial.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats Strip */}
          <div className="mt-20 grid grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-sm text-neutral-600 font-medium">Reports Generated</div>
            </div>
            <div className="text-center border-x border-neutral-200">
              <div className="text-4xl font-bold text-primary mb-2">AED 2B+</div>
              <div className="text-sm text-neutral-600 font-medium">Properties Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">4.9/5</div>
              <div className="text-sm text-neutral-600 font-medium">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary via-primary to-primary-hover text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Ready to Analyze Your Investment?
          </h2>
          <p className="text-xl text-primary-foreground/95 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
            Join property investors across the UAE who use YieldPulse for 
            accurate ROI calculations and institutional grade investment analysis.
          </p>
          <Link 
            to="/calculator" 
            className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-primary rounded-xl font-bold hover:bg-neutral-50 hover:shadow-2xl transition-all duration-300 hover:scale-105 shadow-xl"
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
