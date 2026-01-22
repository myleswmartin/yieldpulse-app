import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { CTASection } from '../components/CTASection';
import { usePublicPricing } from '../utils/usePublicPricing';
import {
  Calculator,
  FileText,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Building,
  BarChart3,
  X
} from 'lucide-react';

export default function ReportsPage() {
  const { priceLabel } = usePublicPricing();
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 via-white to-neutral-50">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 bg-gradient-to-br from-[#1e2875] to-[#2f3aad]">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Free vs Premium Reports
          </h1>
          <p className="text-xl text-white/90 leading-relaxed max-w-2xl mx-auto">
            Choose the level of detail you need. Start with free headline metrics, 
            upgrade to comprehensive analysis when you are ready to make a decision.
          </p>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Quick Comparison Table */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-neutral-900 mb-8 text-center">
              Side by Side Comparison
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-xl overflow-hidden shadow-lg">
                <thead>
                  <tr className="bg-gradient-to-r from-[#1e2875] to-[#2f3aad] text-white">
                    <th className="p-4 text-left font-semibold">Feature</th>
                    <th className="p-4 text-center font-semibold">Free Analysis</th>
                    <th className="p-4 text-center font-semibold">Premium Report</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {[
                    { feature: 'Gross Rental Yield', free: true, premium: true },
                    { feature: 'Net Rental Yield', free: true, premium: true },
                    { feature: 'Cash on Cash Return', free: true, premium: true },
                    { feature: 'Annual Cash Flow', free: true, premium: true },
                    { feature: 'Monthly Breakdown', free: true, premium: true },
                    { feature: 'Save to Dashboard', free: true, premium: true },
                    { feature: '5 Year Projections', free: false, premium: true },
                    { feature: 'Year by Year Details', free: false, premium: true },
                    { feature: 'Vacancy Sensitivity', free: false, premium: true },
                    { feature: 'Rent Change Scenarios', free: false, premium: true },
                    { feature: 'Interest Rate Analysis', free: false, premium: true },
                    { feature: 'Exit Strategy Calculations', free: false, premium: true },
                    { feature: 'Downloadable PDF', free: false, premium: true },
                    { feature: 'Professional Formatting', free: false, premium: true },
                    { feature: 'Share with Stakeholders', free: false, premium: true },
                  ].map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-neutral-50' : 'bg-white'}>
                      <td className="p-4 font-medium text-neutral-900">{row.feature}</td>
                      <td className="p-4 text-center">
                        {row.free ? (
                          <CheckCircle className="w-6 h-6 text-[#14b8a6] mx-auto" />
                        ) : (
                          <X className="w-6 h-6 text-neutral-300 mx-auto" />
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {row.premium ? (
                          <CheckCircle className="w-6 h-6 text-[#14b8a6] mx-auto" />
                        ) : (
                          <X className="w-6 h-6 text-neutral-300 mx-auto" />
                        )}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gradient-to-r from-neutral-50 to-white font-semibold">
                    <td className="p-4 text-neutral-900">Price</td>
                    <td className="p-4 text-center text-[#14b8a6] text-xl">AED 0</td>
                    <td className="p-4 text-center text-[#1e2875] text-xl">{priceLabel}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Free Analysis Column */}
            <div className="bg-gradient-to-br from-neutral-50 to-white rounded-2xl border-2 border-neutral-200 overflow-hidden shadow-lg">
              <div className="bg-gradient-to-r from-[#14b8a6] to-[#0d9488] p-6 text-white">
                <div className="flex items-center space-x-3 mb-2">
                  <Calculator className="w-8 h-8" />
                  <h2 className="text-2xl font-bold">Free Analysis</h2>
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl font-bold">AED 0</span>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#14b8a6] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-neutral-900">Gross Rental Yield</p>
                    <p className="text-sm text-neutral-600">Annual rent ÷ purchase price</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#14b8a6] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-neutral-900">Net Rental Yield</p>
                    <p className="text-sm text-neutral-600">After expenses and costs</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#14b8a6] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-neutral-900">Cash on Cash Return</p>
                    <p className="text-sm text-neutral-600">Return on actual cash invested</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#14b8a6] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-neutral-900">Annual Cash Flow</p>
                    <p className="text-sm text-neutral-600">Total yearly income minus expenses</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#14b8a6] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-neutral-900">Monthly Cash Flow</p>
                    <p className="text-sm text-neutral-600">Monthly income and expense breakdown</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#14b8a6] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-neutral-900">Save to Dashboard</p>
                    <p className="text-sm text-neutral-600">Access your analyses anytime</p>
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

              <div className="p-6 pt-0">
                <Link
                  to="/calculator"
                  className="block w-full py-3 bg-gradient-to-r from-[#14b8a6] to-[#0d9488] text-white text-center rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
                >
                  Start Free Analysis
                </Link>
              </div>
            </div>

            {/* Premium Report Column */}
            <div className="relative bg-gradient-to-br from-[#1e2875] to-[#2f3aad] rounded-2xl border-2 border-[#1e2875] overflow-hidden shadow-xl">
              <div className="absolute top-4 right-4 z-10">
                <span className="px-3 py-1 bg-[#14b8a6] text-white rounded-full text-sm font-semibold">
                  Recommended
                </span>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-6 text-white">
                <div className="flex items-center space-x-3 mb-2">
                  <FileText className="w-8 h-8" />
                  <h2 className="text-2xl font-bold">Premium Report</h2>
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl font-bold">{priceLabel}</span>
                  <span className="text-white/80">per report</span>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#14b8a6] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">Everything in Free</p>
                    <p className="text-sm text-white/80">All headline metrics included</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#14b8a6] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">5 Year Projections</p>
                    <p className="text-sm text-white/80">Year by year financial breakdown</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#14b8a6] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">Vacancy Analysis</p>
                    <p className="text-sm text-white/80">Impact of different vacancy rates</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#14b8a6] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">Rent Change Scenarios</p>
                    <p className="text-sm text-white/80">What if rent increases or decreases</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#14b8a6] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">Interest Rate Analysis</p>
                    <p className="text-sm text-white/80">Mortgage rate change impact</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#14b8a6] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">Exit Strategy Calculations</p>
                    <p className="text-sm text-white/80">Property sale scenarios and returns</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#14b8a6] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">Detailed Breakdowns</p>
                    <p className="text-sm text-white/80">All calculations fully explained</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#14b8a6] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">Professional PDF</p>
                    <p className="text-sm text-white/80">Ready to download and share</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#14b8a6] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">Lifetime Access</p>
                    <p className="text-sm text-white/80">Download anytime from dashboard</p>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link
                  to="/calculator"
                  className="block w-full py-3 bg-white text-[#1e2875] text-center rounded-xl font-semibold hover:shadow-2xl transition-all duration-200"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Explanations */}
      <section className="py-20 bg-gradient-to-b from-white to-neutral-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              Understanding Each Report Type
            </h2>
            <p className="text-lg text-neutral-600">
              Detailed look at what you get with each option
            </p>
          </div>

          <div className="space-y-12">
            {/* Free Analysis Detail */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-lg">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-gradient-to-br from-[#14b8a6] to-[#0d9488] rounded-xl">
                  <Calculator className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-neutral-900">Free Analysis in Detail</h3>
                  <p className="text-neutral-600">Perfect for quick property comparisons</p>
                </div>
              </div>

              <p className="text-neutral-700 mb-6 leading-relaxed">
                The free analysis gives you all the essential metrics you need to quickly evaluate 
                whether a property investment makes sense. You can run unlimited calculations, compare 
                multiple properties, and save all your analyses to your dashboard.
              </p>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-neutral-900 mb-2">What you can do:</h4>
                  <ul className="space-y-2 text-neutral-700">
                    <li className="flex items-start space-x-2">
                      <span className="text-[#14b8a6] mt-1">•</span>
                      <span>Enter property details and financial assumptions</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-[#14b8a6] mt-1">•</span>
                      <span>See instant calculations for yield and cash flow</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-[#14b8a6] mt-1">•</span>
                      <span>Compare ROI across multiple properties</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-[#14b8a6] mt-1">•</span>
                      <span>Identify strong vs weak investment opportunities</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-[#14b8a6] mt-1">•</span>
                      <span>Save all analyses to review later</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-neutral-900 mb-2">Best for:</h4>
                  <p className="text-neutral-700">
                    Initial screening of properties, quick comparisons, and getting a general sense 
                    of potential returns before diving deeper.
                  </p>
                </div>
              </div>
            </div>

            {/* Premium Report Detail */}
            <div className="bg-gradient-to-br from-[#1e2875]/5 to-[#2f3aad]/5 rounded-2xl border-2 border-[#1e2875]/20 p-8 shadow-lg">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-gradient-to-br from-[#1e2875] to-[#2f3aad] rounded-xl">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-neutral-900">Premium Report in Detail</h3>
                  <p className="text-neutral-600">Complete analysis for serious investment decisions</p>
                </div>
              </div>

              <p className="text-neutral-700 mb-6 leading-relaxed">
                The premium report provides institutional grade analysis that goes far beyond headline 
                metrics. Get multi year projections, stress test scenarios, and professionally formatted 
                documentation you can share with partners, lenders, or advisors.
              </p>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-neutral-900 mb-3">5 Year Financial Projections:</h4>
                  <p className="text-neutral-700 mb-2">
                    See exactly how your investment performs year by year with detailed breakdowns of:
                  </p>
                  <ul className="space-y-2 text-neutral-700 ml-4">
                    <li className="flex items-start space-x-2">
                      <span className="text-[#1e2875] mt-1">•</span>
                      <span>Annual rental income with growth assumptions</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-[#1e2875] mt-1">•</span>
                      <span>Operating expenses and their evolution</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-[#1e2875] mt-1">•</span>
                      <span>Mortgage principal and interest payments</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-[#1e2875] mt-1">•</span>
                      <span>Net cash flow each year</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-[#1e2875] mt-1">•</span>
                      <span>Cumulative returns over time</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-neutral-900 mb-3">Sensitivity Analysis:</h4>
                  <p className="text-neutral-700 mb-2">
                    Understand how changes in key variables affect your returns:
                  </p>
                  <ul className="space-y-2 text-neutral-700 ml-4">
                    <li className="flex items-start space-x-2">
                      <span className="text-[#1e2875] mt-1">•</span>
                      <span><strong>Vacancy rates:</strong> What if the property sits empty for 1, 2, or 3 months?</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-[#1e2875] mt-1">•</span>
                      <span><strong>Rent changes:</strong> Impact of rent increasing or decreasing by 5%, 10%, 15%</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-[#1e2875] mt-1">•</span>
                      <span><strong>Interest rates:</strong> How rate changes affect your mortgage payments and returns</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-neutral-900 mb-3">Exit Strategy Calculations:</h4>
                  <p className="text-neutral-700 mb-2">
                    Plan your exit with detailed scenarios showing:
                  </p>
                  <ul className="space-y-2 text-neutral-700 ml-4">
                    <li className="flex items-start space-x-2">
                      <span className="text-[#1e2875] mt-1">•</span>
                      <span>Total return if you sell after 1, 3, or 5 years</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-[#1e2875] mt-1">•</span>
                      <span>Impact of property appreciation or depreciation</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-[#1e2875] mt-1">•</span>
                      <span>Net proceeds after sales costs and mortgage payoff</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-[#1e2875] mt-1">•</span>
                      <span>Total ROI including rental income and capital gains</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-neutral-900 mb-2">Best for:</h4>
                  <p className="text-neutral-700">
                    Making final purchase decisions, presenting to stakeholders, securing financing, 
                    or when you need comprehensive documentation for your investment records.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Example Scenarios */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              When to Use Each Report Type
            </h2>
            <p className="text-lg text-neutral-600">
              Real world scenarios to help you decide
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Free Scenarios */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-neutral-900 flex items-center space-x-2">
                <Calculator className="w-6 h-6 text-[#14b8a6]" />
                <span>Use Free Analysis When:</span>
              </h3>

              {[
                {
                  scenario: 'Browsing Properties',
                  desc: 'You are looking at listings and want to quickly check if the asking price and rental estimates make sense.'
                },
                {
                  scenario: 'Early Research',
                  desc: 'You are just starting to explore property investment and want to understand typical UAE returns.'
                },
                {
                  scenario: 'Quick Comparisons',
                  desc: 'You have 3 to 5 properties shortlisted and need to compare headline ROI numbers side by side.'
                },
                {
                  scenario: 'Ballpark Figures',
                  desc: 'You want to know if a property is even worth considering before doing deeper analysis.'
                }
              ].map((item, i) => (
                <div key={i} className="bg-gradient-to-br from-neutral-50 to-white p-6 rounded-xl border border-neutral-200">
                  <h4 className="font-semibold text-neutral-900 mb-2">{item.scenario}</h4>
                  <p className="text-neutral-600">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Premium Scenarios */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-neutral-900 flex items-center space-x-2">
                <FileText className="w-6 h-6 text-[#1e2875]" />
                <span>Use Premium Report When:</span>
              </h3>

              {[
                {
                  scenario: 'Ready to Buy',
                  desc: 'You have narrowed down to one property and need comprehensive analysis before making an offer.'
                },
                {
                  scenario: 'Securing Financing',
                  desc: 'You need professional documentation to present to banks or lenders for mortgage approval.'
                },
                {
                  scenario: 'Partnership Decisions',
                  desc: 'You are investing with partners or family and need detailed projections everyone can review.'
                },
                {
                  scenario: 'Long Term Planning',
                  desc: 'You want to understand how the investment performs over 5 years and plan your portfolio strategy.'
                }
              ].map((item, i) => (
                <div key={i} className="bg-gradient-to-br from-[#1e2875]/5 to-[#2f3aad]/5 p-6 rounded-xl border border-[#1e2875]/20">
                  <h4 className="font-semibold text-neutral-900 mb-2">{item.scenario}</h4>
                  <p className="text-neutral-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#1e2875] to-[#2f3aad] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Start with Free, Upgrade When Ready
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Try the calculator with no risk. Get instant headline metrics for free, 
            then unlock detailed reports only when you need them.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/calculator" 
              className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-[#1e2875] rounded-xl font-semibold hover:shadow-2xl transition-all duration-200"
            >
              <span>Try Free Calculator</span>
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

      {/* Footer */}
      <Footer />
    </div>
  );
}
