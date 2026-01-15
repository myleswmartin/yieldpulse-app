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
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 via-white to-neutral-50">
      <Header variant="transparent" />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-secondary/3 pointer-events-none" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-8">
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
              analyze cash flow, and access institutional grade analysis for just {priceLabel}.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link 
                to="/calculator" 
                className="group inline-flex items-center space-x-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary-hover transition-all shadow-md hover:shadow-lg"
              >
                <span>Start Free Analysis</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/sample-premium-report" 
                className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-primary border-2 border-border rounded-xl font-medium hover:border-primary/30 hover:bg-neutral-50 transition-all"
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
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                desc: `Pay ${priceLabel} for complete 5 year projections, sensitivity analysis, and exit strategy calculations`,
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

      {/* Premium Report Guide CTA */}
      <section className="py-10 sm:py-16 bg-gradient-to-br from-secondary/5 via-white to-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl border-2 border-primary/20 shadow-xl overflow-hidden">
              <div className="p-8 sm:p-12">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-hover rounded-2xl flex items-center justify-center shadow-lg">
                      <BookOpen className="w-10 h-10 text-primary-foreground" />
                    </div>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
                      New to Property Investment?
                    </h3>
                    <p className="text-lg text-neutral-600 mb-6 leading-relaxed">
                      Our comprehensive guide takes you from zero knowledge to confident investor. Learn how to read premium reports, understand all metrics, and make smart investment decisions.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
                      <Link 
                        to="/premium-report-guide"
                        className="group inline-flex items-center space-x-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary-hover transition-all shadow-md hover:shadow-lg"
                      >
                        <span>Read the Complete Guide</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                      <Link 
                        to="/glossary"
                        className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-primary border-2 border-border rounded-xl font-medium hover:border-primary/30 hover:bg-neutral-50 transition-all"
                      >
                        <BookOpen className="w-5 h-5" />
                        <span>View Glossary</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-primary/5 to-secondary/5 px-8 sm:px-12 py-4 border-t border-border">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-neutral-600">
                  <span className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span>Property Investment 101</span>
                  </span>
                  <span className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span>All Metrics Explained</span>
                  </span>
                  <span className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span>Common Mistakes to Avoid</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Report Preview Teaser */}
      <section className="py-24 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              See What You'll Get
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Real example from a Dubai Marina apartment analysis. Download the full sample report as PDF.
            </p>
          </div>

          {/* Two Column Layout: Key Metrics + Visual Preview */}
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left: Key Metrics from Sample Report */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border-2 border-primary/20 p-8 shadow-sm">
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Building className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">1BR Apartment - Dubai Marina</h3>
                    <p className="text-sm text-neutral-600">Purchase Price: AED 1,200,000 | Rent: AED 8,000/month</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl border border-emerald-200">
                    <div className="text-xs text-emerald-700 font-medium mb-1">Year 5 ROI</div>
                    <div className="text-2xl font-bold text-emerald-800">41.2%</div>
                    <div className="text-xs text-emerald-600 mt-1">8.2% annualized</div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200">
                    <div className="text-xs text-blue-700 font-medium mb-1">Gross Yield</div>
                    <div className="text-2xl font-bold text-blue-800">8.00%</div>
                    <div className="text-xs text-blue-600 mt-1">Annual return</div>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-neutral-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-600">Monthly Cash Flow</span>
                    <span className="font-semibold text-emerald-700">+AED 664</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-600">Property Value (Year 5)</span>
                    <span className="font-semibold text-foreground">AED 1,324,897</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-600">Total Wealth Created</span>
                    <span className="font-semibold text-primary">AED 180,116</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary to-secondary text-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-start gap-3 mb-4">
                  <FileCheck className="w-6 h-6 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">Your Report Includes:</h4>
                    <ul className="text-sm space-y-2 text-white/90">
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
              <div className="bg-white rounded-2xl border-2 border-border shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-primary/5 to-secondary/5 px-6 py-4 border-b border-border">
                  <div className="text-xs font-medium text-primary mb-1">PREMIUM REPORT</div>
                  <div className="font-semibold text-foreground">5-Year Investment Analysis</div>
                </div>
                
                <div className="p-6 space-y-4">
                  {/* Mini Chart Placeholder */}
                  <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-xl p-4 border border-neutral-200">
                    <div className="text-xs font-medium text-neutral-600 mb-3">Property Value Projection</div>
                    <div className="flex items-end justify-between h-24 gap-2">
                      <div className="flex-1 bg-primary/20 rounded-t" style={{height: '45%'}}></div>
                      <div className="flex-1 bg-primary/30 rounded-t" style={{height: '55%'}}></div>
                      <div className="flex-1 bg-primary/40 rounded-t" style={{height: '65%'}}></div>
                      <div className="flex-1 bg-primary/60 rounded-t" style={{height: '80%'}}></div>
                      <div className="flex-1 bg-primary rounded-t" style={{height: '100%'}}></div>
                    </div>
                    <div className="flex justify-between text-xs text-neutral-500 mt-2">
                      <span>Y1</span>
                      <span>Y2</span>
                      <span>Y3</span>
                      <span>Y4</span>
                      <span>Y5</span>
                    </div>
                  </div>

                  {/* Key Metrics Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-200">
                      <div className="text-xs text-neutral-600 mb-1">Net Yield</div>
                      <div className="text-lg font-bold text-foreground">5.58%</div>
                    </div>
                    <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-200">
                      <div className="text-xs text-neutral-600 mb-1">Break-even</div>
                      <div className="text-lg font-bold text-foreground">86.7%</div>
                    </div>
                  </div>

                  {/* More sections indicator */}
                  <div className="space-y-2">
                    <div className="h-3 bg-neutral-200 rounded w-full"></div>
                    <div className="h-3 bg-neutral-200 rounded w-5/6"></div>
                    <div className="h-3 bg-neutral-200 rounded w-4/6"></div>
                  </div>
                </div>

                {/* Overlay with CTA */}
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/95 to-transparent flex items-end justify-center pb-8">
                  <div className="text-center px-6 max-w-sm">
                    <Link
                      to="/sample-premium-report"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover transition-all shadow-lg hover:shadow-xl transform hover:scale-105 mb-3"
                    >
                      <FileCheck className="w-5 h-5" />
                      <span>View Full Sample Report</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <p className="text-xs text-neutral-600">
                      See the complete analysis + download PDF
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -top-4 -right-4 bg-secondary text-white px-4 py-2 rounded-full shadow-lg transform rotate-6">
                <div className="text-xs font-semibold">Real Example</div>
              </div>
            </div>
          </div>

          {/* Bottom CTA Strip */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 bg-white border border-primary/20 rounded-full px-6 py-3 shadow-sm">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-sm text-neutral-700">
                Generate your own professional report for just <span className="font-bold text-primary">{priceLabel}</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-neutral-600">
              Pay per report. No subscriptions. No hidden fees.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Free Analysis */}
            <div className="bg-gradient-to-br from-neutral-50 to-white rounded-2xl border-2 border-neutral-200 overflow-hidden shadow-lg flex flex-col">
              <div className="bg-gradient-to-r from-secondary to-secondary/90 p-6 text-white">
                <div className="flex items-center space-x-3 mb-2">
                  <Calculator className="w-8 h-8" />
                  <h3 className="text-2xl font-bold">Free Analysis</h3>
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl font-bold">AED 0</span>
                </div>
                <p className="text-sm text-white/90 mt-2">Unlimited analyses, forever free</p>
              </div>

              <div className="p-6 space-y-4 flex-grow">
                <p className="text-neutral-700 leading-relaxed">
                  Perfect for quick property comparisons and initial screening. Get all essential metrics instantly.
                </p>

                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-neutral-900">Gross Rental Yield</p>
                      <p className="text-sm text-neutral-600">Annual rent ÷ purchase price</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-neutral-900">Net Rental Yield</p>
                      <p className="text-sm text-neutral-600">After expenses and costs</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-neutral-900">Cash on Cash Return</p>
                      <p className="text-sm text-neutral-600">Return on actual cash invested</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-neutral-900">Monthly & Annual Cash Flow</p>
                      <p className="text-sm text-neutral-600">Complete income and expense breakdown</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-neutral-900">Save to Dashboard</p>
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

              <div className="p-6 pt-0">
                <Link
                  to="/calculator"
                  className="block w-full py-3 bg-gradient-to-r from-secondary to-secondary/90 text-white text-center rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
                >
                  Start Free Analysis
                </Link>
              </div>
            </div>

            {/* Premium Report */}
            <div className="relative bg-gradient-to-br from-primary to-primary-hover rounded-2xl border-2 border-primary overflow-hidden shadow-xl flex flex-col">
              <div className="bg-white/10 backdrop-blur-sm p-6 text-white">'
                <div className="flex items-center space-x-3 mb-2">
                  <FileText className="w-8 h-8" />
                  <h3 className="text-2xl font-bold">Premium Report</h3>
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl font-bold">{priceLabel}</span>
                  <span className="text-white/80">per report</span>
                </div>
                <p className="text-sm text-white/90 mt-2">One time payment • No subscription</p>
              </div>

              <div className="p-6 space-y-4 flex-grow">
                <p className="text-white/90 leading-relaxed">
                  Comprehensive analysis for serious investment decisions. Institutional grade reporting and detailed projections.
                </p>

                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white">Everything in Free</p>
                      <p className="text-sm text-white/80">All headline metrics included</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white">5 Year Financial Projections</p>
                      <p className="text-sm text-white/80">Year by year breakdown with growth assumptions</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white">Vacancy Sensitivity Analysis</p>
                      <p className="text-sm text-white/80">Impact of 0 to 3+ months vacancy</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white">Rent Change Scenarios</p>
                      <p className="text-sm text-white/80">What if rent changes ±5%, ±10%, ±15%</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white">Interest Rate Impact</p>
                      <p className="text-sm text-white/80">Mortgage rate change analysis</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white">Exit Strategy Calculations</p>
                      <p className="text-sm text-white/80">Property sale scenarios and total returns</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white">Full Calculation Transparency</p>
                      <p className="text-sm text-white/80">All formulas and assumptions shown</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white">Professional PDF Download</p>
                      <p className="text-sm text-white/80">Ready to share with partners and lenders</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white">Lifetime Access</p>
                      <p className="text-sm text-white/80">Download anytime from dashboard</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link
                  to="/calculator"
                  className="block w-full py-3 bg-white text-primary text-center rounded-xl font-semibold hover:shadow-2xl transition-all duration-200"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Methodology and Trust Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

      {/* Testimonials / Social Proof Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Trusted by UAE Investors
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
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
              <div key={i} className="bg-gradient-to-br from-neutral-50 to-white p-6 rounded-xl border border-border shadow-sm">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, idx) => (
                    <span key={idx} className="text-secondary text-lg">★</span>
                  ))}
                </div>
                <p className="text-neutral-700 mb-4 leading-relaxed text-sm italic line-clamp-3">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-white font-semibold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground text-sm">{testimonial.name}</div>
                    <div className="text-xs text-neutral-500">{testimonial.role} • {testimonial.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats Strip */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">500+</div>
              <div className="text-sm text-neutral-600">Reports Generated</div>
            </div>
            <div className="text-center border-x border-border">
              <div className="text-3xl font-bold text-primary mb-1">AED 2B+</div>
              <div className="text-sm text-neutral-600">Properties Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">4.9/5</div>
              <div className="text-sm text-neutral-600">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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
