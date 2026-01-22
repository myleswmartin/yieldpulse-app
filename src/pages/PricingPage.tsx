import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { CTASection } from '../components/CTASection';
import { 
  CheckCircle, 
  HelpCircle,
  DollarSign,
  Shield,
  X,
  Calculator,
  FileText,
  Zap,
  TrendingUp,
  BarChart3,
  Building
} from 'lucide-react';
import { usePublicPricing } from '../utils/usePublicPricing';

export default function PricingPage() {
  const { priceLabel } = usePublicPricing();
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 via-white to-neutral-50">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 bg-gradient-to-br from-primary to-primary-hover">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-primary-foreground mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-primary-foreground/90 leading-relaxed max-w-2xl mx-auto">
            Start with free headline metrics. Upgrade to comprehensive analysis when you need it. 
            No subscriptions, no hidden fees.
          </p>
        </div>
      </section>

      {/* Main Pricing Options */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Choose Your Level of Analysis
            </h2>
            <p className="text-lg text-neutral-600">
              Start free, upgrade when you need detailed insights
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
              <div className="absolute top-4 right-4 z-10">
                <span className="px-3 py-1 bg-secondary text-white rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-6 text-white">
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

      {/* Detailed Comparison Table */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Complete Feature Comparison
            </h2>
            <p className="text-lg text-neutral-600">
              See exactly what you get with each option
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Feature
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">
                      Free Analysis
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-foreground bg-primary/5">
                      Premium Report
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    { feature: 'Gross rental yield calculation', free: true, premium: true },
                    { feature: 'Net rental yield calculation', free: true, premium: true },
                    { feature: 'Cash on cash return', free: true, premium: true },
                    { feature: 'Monthly cash flow breakdown', free: true, premium: true },
                    { feature: 'Annual cash flow summary', free: true, premium: true },
                    { feature: 'Initial investment calculation', free: true, premium: true },
                    { feature: 'Save to dashboard', free: true, premium: true },
                    { feature: 'Unlimited analyses', free: true, premium: true },
                    { feature: '5 year financial projections', free: false, premium: true },
                    { feature: 'Year by year breakdown', free: false, premium: true },
                    { feature: 'Equity and loan balance tracking', free: false, premium: true },
                    { feature: 'Vacancy rate sensitivity (0-3+ months)', free: false, premium: true },
                    { feature: 'Rent change scenarios (±5%, ±10%, ±15%)', free: false, premium: true },
                    { feature: 'Interest rate impact analysis', free: false, premium: true },
                    { feature: 'Exit strategy calculations', free: false, premium: true },
                    { feature: 'Property appreciation scenarios', free: false, premium: true },
                    { feature: 'Total return calculation', free: false, premium: true },
                    { feature: 'Detailed expense breakdown', free: false, premium: true },
                    { feature: 'Full formula transparency', free: false, premium: true },
                    { feature: 'Assumption verification', free: false, premium: true },
                    { feature: 'Professional PDF report', free: false, premium: true },
                    { feature: 'Download and share', free: false, premium: true },
                    { feature: 'Compare 2-4 premium reports', free: false, premium: true }
                  ].map((item, i) => (
                    <tr key={i} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4 text-sm text-neutral-700">
                        {item.feature}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {item.free ? (
                          <CheckCircle className="w-5 h-5 text-secondary mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-neutral-300 mx-auto" />
                        )}
                      </td>
                      <td className="px-6 py-4 text-center bg-primary/5">
                        {item.premium ? (
                          <CheckCircle className="w-5 h-5 text-secondary mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-neutral-300 mx-auto" />
                        )}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-muted/50 font-semibold">
                    <td className="px-6 py-4 text-neutral-900">Price</td>
                    <td className="px-6 py-4 text-center text-secondary text-xl">AED 0</td>
                    <td className="px-6 py-4 text-center text-primary text-xl bg-primary/5">{priceLabel}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* When to Use Each */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              When to Use Each Report Type
            </h2>
            <p className="text-lg text-neutral-600">
              Choose the right analysis for your stage in the investment process
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Free Analysis Use Cases */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-secondary to-secondary/90 rounded-xl">
                  <Calculator className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-neutral-900">
                  Use Free Analysis When:
                </h3>
              </div>

              {[
                {
                  title: 'Browsing Properties',
                  desc: 'You are looking at listings online and want to quickly check if the numbers make sense before scheduling viewings.'
                },
                {
                  title: 'Early Research Phase',
                  desc: 'You are just starting to explore UAE property investment and want to understand typical yields and returns.'
                },
                {
                  title: 'Quick Comparisons',
                  desc: 'You have multiple properties shortlisted and need to compare headline ROI metrics to narrow down your options.'
                },
                {
                  title: 'Initial Screening',
                  desc: 'You want to eliminate properties that clearly do not meet your investment criteria before doing detailed analysis.'
                }
              ].map((item, i) => (
                <div key={i} className="bg-muted/30 p-6 rounded-xl border border-border">
                  <h4 className="font-semibold text-neutral-900 mb-2">{item.title}</h4>
                  <p className="text-neutral-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Premium Report Use Cases */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-primary to-primary-hover rounded-xl">
                  <FileText className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-neutral-900">
                  Use Premium Report When:
                </h3>
              </div>

              {[
                {
                  title: 'Ready to Make an Offer',
                  desc: 'You have narrowed down to one property and need comprehensive analysis before committing to purchase.'
                },
                {
                  title: 'Securing Mortgage Approval',
                  desc: 'You need professional documentation to present to banks or lenders showing detailed investment analysis.'
                },
                {
                  title: 'Partnership Discussions',
                  desc: 'You are investing with partners or family and need detailed projections that everyone can review and discuss.'
                },
                {
                  title: 'Long Term Planning',
                  desc: 'You want to understand how the investment performs over 5 years and plan your exit strategy in advance.'
                }
              ].map((item, i) => (
                <div key={i} className="bg-primary/5 p-6 rounded-xl border border-primary/20">
                  <h4 className="font-semibold text-neutral-900 mb-2">{item.title}</h4>
                  <p className="text-neutral-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Pay Per Report */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Why Pay Per Report?
            </h2>
            <p className="text-lg text-neutral-600">
              Fair pricing that aligns with how you actually invest
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-xl border border-border text-center">
              <DollarSign className="w-12 h-12 text-secondary mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">
                No Subscriptions
              </h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                No monthly fees or recurring charges. Pay only when you need a detailed report for a specific property.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-border text-center">
              <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">
                No Hidden Fees
              </h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                {priceLabel} is the complete price. No setup fees, no processing fees, no surprises. What you see is what you pay.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-border text-center">
              <Zap className="w-12 h-12 text-chart-1 mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">
                Unlimited Free Use
              </h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Run as many free analyses as you want. Test different scenarios. Only pay when you need the full report.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who Is This For */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Who Uses YieldPulse?
            </h2>
            <p className="text-lg text-neutral-600">
              Designed for UAE property investors at every level
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: TrendingUp,
                title: 'First Time Investors',
                desc: 'Get clear numbers and professional analysis to make confident first investment decisions in the UAE property market.'
              },
              {
                icon: BarChart3,
                title: 'Portfolio Investors',
                desc: 'Quickly evaluate multiple properties, compare opportunities, and generate detailed reports for each investment.'
              },
              {
                icon: Building,
                title: 'Real Estate Professionals',
                desc: 'Provide data driven analysis to clients and support purchase recommendations with professional documentation.'
              },
              {
                icon: FileText,
                title: 'Financial Advisors',
                desc: 'Generate accurate ROI reports for clients and support investment portfolio planning with transparent calculations.'
              }
            ].map((item, i) => (
              <div key={i} className="bg-muted/30 p-6 rounded-xl border border-border flex items-start space-x-4">
                <div className="p-3 bg-primary/10 rounded-lg flex-shrink-0">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-neutral-600">
              Common questions about pricing and reports
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                q: 'Do I need to pay to use the calculator?',
                a: 'No. The calculator is completely free to use. You can run unlimited analyses and see all headline metrics (gross yield, net yield, cash on cash return, cash flow) without paying anything.'
              },
              {
                q: `What exactly do I get for ${priceLabel}?`,
                a: `For ${priceLabel}, you unlock a comprehensive investor grade report with 5 year projections, sensitivity analysis for vacancy/rent/interest rates, exit strategy calculations, detailed expense breakdowns, full formula transparency, and a professionally formatted PDF ready to download and share.`
              },
              {
                q: `Is ${priceLabel} a one time payment or subscription?`,
                a: `It is a one time payment per property report. You pay ${priceLabel} for each detailed report you want to unlock. There are no recurring charges, monthly fees, or subscription requirements.`
              },
              {
                q: 'Can I save my analyses without paying?',
                a: 'Yes. All your analyses are automatically saved to your dashboard, even if you do not purchase the premium report. You can return anytime to review your free calculations or unlock the full report later.'
              },
              {
                q: 'What if I want to analyze multiple properties?',
                a: `You can analyze as many properties as you want for free. You only pay ${priceLabel} when you want to unlock the detailed premium report for a specific property. Each report is priced separately.`
              },
              {
                q: 'Are there any hidden fees or additional charges?',
                a: `No. ${priceLabel} is the complete price for a premium report. There are no setup fees, processing fees, platform fees, or any other charges. The price you see is the price you pay.`
              },
              {
                q: 'Can I access my reports after purchasing?',
                a: 'Yes. Once you purchase a premium report, you have lifetime access. You can view it online or download the PDF from your dashboard anytime, as many times as you want.'
              },
              {
                q: 'Can I compare multiple properties?',
                a: 'Yes. You can compare 2-4 premium reports side by side using our comparison tool. This helps you make informed decisions when choosing between multiple investment opportunities.'
              },
              {
                q: 'Do you offer refunds?',
                a: 'Because premium reports are generated and delivered instantly as digital products, all sales are final. We recommend using the free analysis features first to ensure the tool meets your needs before purchasing.'
              }
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-border">
                <div className="flex items-start space-x-4">
                  <HelpCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">{item.q}</h3>
                    <p className="text-neutral-600 leading-relaxed text-sm">{item.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />

      <Footer />
    </div>
  );
}
