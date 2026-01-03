import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { 
  Building, 
  Calculator, 
  FileText, 
  TrendingUp, 
  DollarSign, 
  BarChart3, 
  CheckCircle,
  ArrowRight,
  Shield,
  Zap,
  Download,
  Eye
} from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 via-white to-neutral-50">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 bg-gradient-to-br from-[#1e2875] to-[#2f3aad]">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            How YieldPulse Works
          </h1>
          <p className="text-xl text-white/90 leading-relaxed max-w-2xl mx-auto">
            Professional UAE property investment analysis in four simple steps. 
            Get instant insights and unlock detailed reports when you need them.
          </p>
        </div>
      </section>

      {/* What is YieldPulse */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              What is YieldPulse?
            </h2>
            <p className="text-lg text-neutral-600 leading-relaxed">
              YieldPulse is a professional ROI calculator designed specifically for UAE property investors. 
              We help you make informed investment decisions by calculating accurate returns, cash flow 
              projections, and detailed financial analysis using UAE specific formulas and fees.
            </p>
          </div>

          {/* What YieldPulse Is and Is Not */}
          <div className="bg-gradient-to-br from-[#1e2875]/5 to-[#2f3aad]/5 rounded-2xl border-2 border-[#1e2875]/20 p-8 mb-12">
            <h3 className="text-xl font-bold text-neutral-900 mb-6 text-center">
              YieldPulse Is and Is Not
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-[#1e2875] mb-4 flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>YieldPulse IS:</span>
                </h4>
                <ul className="space-y-3 text-neutral-700">
                  <li className="flex items-start space-x-2">
                    <span className="text-[#14b8a6] mt-1">•</span>
                    <span>A calculation tool using your exact inputs</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-[#14b8a6] mt-1">•</span>
                    <span>UAE market specific with local fees and regulations</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-[#14b8a6] mt-1">•</span>
                    <span>Transparent about all formulas and assumptions</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-[#14b8a6] mt-1">•</span>
                    <span>Designed for informed decision making</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-[#14b8a6] mt-1">•</span>
                    <span>A starting point for your investment analysis</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-neutral-900 mb-4 flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>YieldPulse IS NOT:</span>
                </h4>
                <ul className="space-y-3 text-neutral-700">
                  <li className="flex items-start space-x-2">
                    <span className="text-neutral-400 mt-1">•</span>
                    <span>Financial, investment, or legal advice</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-neutral-400 mt-1">•</span>
                    <span>A property listing or search platform</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-neutral-400 mt-1">•</span>
                    <span>Automatically populated with market data</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-neutral-400 mt-1">•</span>
                    <span>A guarantee of investment returns</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-neutral-400 mt-1">•</span>
                    <span>A replacement for professional due diligence</span>
                  </li>
                </ul>
              </div>
            </div>
            <p className="text-sm text-neutral-600 mt-6 text-center italic">
              All data inputs are user controlled. You provide all property details, financial assumptions, 
              and cost estimates. We perform calculations based solely on your inputs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-neutral-50 to-white p-6 rounded-xl border border-neutral-200">
              <Shield className="w-10 h-10 text-[#1e2875] mb-4" />
              <h3 className="font-semibold text-neutral-900 mb-2">
                UAE Market Focused
              </h3>
              <p className="text-neutral-600">
                Built with Dubai and UAE property market specifics including DLD fees, 
                service charges, and local regulations.
              </p>
            </div>

            <div className="bg-gradient-to-br from-neutral-50 to-white p-6 rounded-xl border border-neutral-200">
              <Zap className="w-10 h-10 text-[#14b8a6] mb-4" />
              <h3 className="font-semibold text-neutral-900 mb-2">
                Instant Analysis
              </h3>
              <p className="text-neutral-600">
                Get immediate headline metrics for free. See your gross yield, net yield, 
                and cash flow instantly without any payment.
              </p>
            </div>

            <div className="bg-gradient-to-br from-neutral-50 to-white p-6 rounded-xl border border-neutral-200">
              <BarChart3 className="w-10 h-10 text-[#5e74f5] mb-4" />
              <h3 className="font-semibold text-neutral-900 mb-2">
                Professional Reports
              </h3>
              <p className="text-neutral-600">
                Unlock comprehensive PDF reports with 5 year projections, sensitivity analysis, 
                and exit strategies for just AED 49.
              </p>
            </div>

            <div className="bg-gradient-to-br from-neutral-50 to-white p-6 rounded-xl border border-neutral-200">
              <Download className="w-10 h-10 text-[#1e2875] mb-4" />
              <h3 className="font-semibold text-neutral-900 mb-2">
                Save and Access Anytime
              </h3>
              <p className="text-neutral-600">
                All your analyses are saved to your dashboard. Access, review, and download 
                your reports whenever you need them.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How Our Calculations Work */}
      <section className="py-20 bg-gradient-to-b from-white to-neutral-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              How Our Calculations Work
            </h2>
            <p className="text-lg text-neutral-600">
              Transparent formulas, conservative assumptions, UAE specific calculations
            </p>
          </div>

          <div className="space-y-6">
            {/* Gross Yield */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#1e2875] to-[#2f3aad] rounded-lg flex items-center justify-center">
                  <Calculator className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-neutral-900 mb-2">Gross Rental Yield</h3>
                  <p className="text-neutral-700 mb-3">
                    The simplest measure of return: annual rent divided by purchase price.
                  </p>
                  <div className="bg-neutral-50 rounded-lg p-4 font-mono text-sm">
                    Gross Yield = (Annual Rent ÷ Purchase Price) × 100%
                  </div>
                  <p className="text-sm text-neutral-600 mt-3">
                    Example: AED 100,000 annual rent on a AED 1,500,000 property = 6.67% gross yield
                  </p>
                </div>
              </div>
            </div>

            {/* Net Yield */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#14b8a6] to-[#0d9488] rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-neutral-900 mb-2">Net Rental Yield</h3>
                  <p className="text-neutral-700 mb-3">
                    A more accurate measure that accounts for all ownership costs.
                  </p>
                  <div className="bg-neutral-50 rounded-lg p-4 font-mono text-sm">
                    Net Yield = ((Annual Rent - Annual Expenses) ÷ Total Investment) × 100%
                  </div>
                  <p className="text-sm text-neutral-600 mt-3">
                    <strong>Expenses include:</strong> Service charges, maintenance, property management fees, 
                    insurance, and any other recurring costs you specify
                  </p>
                  <p className="text-sm text-neutral-600 mt-2">
                    <strong>Total Investment includes:</strong> Purchase price plus all acquisition fees 
                    (DLD transfer fee, registration, agent fees)
                  </p>
                </div>
              </div>
            </div>

            {/* Cash Flow */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#5e74f5] to-[#4656ea] rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-neutral-900 mb-2">Cash Flow Calculation</h3>
                  <p className="text-neutral-700 mb-3">
                    How much money flows into and out of your pocket each year.
                  </p>
                  <div className="bg-neutral-50 rounded-lg p-4 font-mono text-sm space-y-2">
                    <div>Annual Cash Flow = Annual Rental Income</div>
                    <div className="ml-4">- Annual Expenses</div>
                    <div className="ml-4">- Annual Mortgage Payments (if applicable)</div>
                  </div>
                  <p className="text-sm text-neutral-600 mt-3">
                    Cash flow tells you whether the property generates positive income or requires 
                    you to cover shortfalls each month.
                  </p>
                </div>
              </div>
            </div>

            {/* Conservative Assumptions */}
            <div className="bg-gradient-to-br from-[#1e2875]/5 to-[#2f3aad]/5 rounded-xl border-2 border-[#1e2875]/20 p-6">
              <h3 className="font-bold text-neutral-900 mb-4 flex items-center space-x-2">
                <Shield className="w-6 h-6 text-[#1e2875]" />
                <span>Conservative Assumptions</span>
              </h3>
              <p className="text-neutral-700 mb-4">
                Our calculations use conservative assumptions to avoid overestimating returns:
              </p>
              <ul className="space-y-2 text-neutral-700">
                <li className="flex items-start space-x-2">
                  <span className="text-[#1e2875] mt-1">•</span>
                  <span>We include all standard UAE fees (DLD transfer fee at 4%, registration fees, etc.)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-[#1e2875] mt-1">•</span>
                  <span>Vacancy periods and maintenance costs are factored in when you specify them</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-[#1e2875] mt-1">•</span>
                  <span>Mortgage calculations use exact terms and interest rates you provide</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-[#1e2875] mt-1">•</span>
                  <span>We do not assume property appreciation unless you specify it</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-[#1e2875] mt-1">•</span>
                  <span>Premium reports include sensitivity analysis to stress test your assumptions</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Who is it for */}
      <section className="py-20 bg-gradient-to-b from-white to-neutral-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              Who is YieldPulse For?
            </h2>
            <p className="text-lg text-neutral-600">
              YieldPulse is designed for anyone evaluating property investment opportunities in the UAE
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                title: 'First Time Investors',
                desc: 'New to property investment and need clear, accurate numbers to make confident decisions'
              },
              {
                title: 'Experienced Investors',
                desc: 'Looking to quickly evaluate multiple properties and compare investment opportunities'
              },
              {
                title: 'Property Buyers',
                desc: 'Considering buying a property to rent out and want to understand the real returns'
              },
              {
                title: 'Real Estate Agents',
                desc: 'Need professional analysis to present to clients and support purchase decisions'
              },
              {
                title: 'Financial Advisors',
                desc: 'Require accurate ROI calculations for client property investment portfolios'
              }
            ].map((item, i) => (
              <div key={i} className="flex items-start space-x-4 bg-white p-6 rounded-xl border border-neutral-200">
                <CheckCircle className="w-6 h-6 text-[#14b8a6] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-neutral-900 mb-1">{item.title}</h4>
                  <p className="text-neutral-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Step by Step Process */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              Step by Step Process
            </h2>
            <p className="text-lg text-neutral-600">
              From entering your first property detail to receiving your comprehensive report
            </p>
          </div>

          <div className="space-y-12">
            {/* Step 1 */}
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#1e2875] to-[#2f3aad] rounded-2xl text-white shadow-lg">
                  <Building className="w-8 h-8" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="px-3 py-1 bg-[#1e2875] text-white rounded-full text-sm font-semibold">
                    Step 1
                  </span>
                  <h3 className="text-xl font-bold text-neutral-900">
                    Enter Property Details
                  </h3>
                </div>
                <p className="text-neutral-600 mb-4 leading-relaxed">
                  Start by entering your property information including purchase price, expected rent, 
                  mortgage details if applicable, and ongoing costs like service charges and maintenance fees.
                </p>
                <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                  <p className="text-sm text-neutral-700">
                    <strong>What you need:</strong> Property price, annual rent estimate, down payment amount, 
                    service charges, and any other recurring costs.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#14b8a6] to-[#0d9488] rounded-2xl text-white shadow-lg">
                  <Zap className="w-8 h-8" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="px-3 py-1 bg-[#14b8a6] text-white rounded-full text-sm font-semibold">
                    Step 2
                  </span>
                  <h3 className="text-xl font-bold text-neutral-900">
                    Get Instant Free Analysis
                  </h3>
                </div>
                <p className="text-neutral-600 mb-4 leading-relaxed">
                  Immediately see your key investment metrics including gross yield, net yield, 
                  cash on cash return, and monthly cash flow. No payment required for these headline numbers.
                </p>
                <div className="bg-gradient-to-br from-[#14b8a6]/10 to-[#14b8a6]/5 p-4 rounded-lg border border-[#14b8a6]/20">
                  <p className="text-sm text-neutral-700">
                    <strong>Free metrics include:</strong> Gross rental yield, net rental yield, 
                    cash on cash return, annual and monthly cash flow.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#5e74f5] to-[#4656ea] rounded-2xl text-white shadow-lg">
                  <FileText className="w-8 h-8" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="px-3 py-1 bg-[#5e74f5] text-white rounded-full text-sm font-semibold">
                    Step 3
                  </span>
                  <h3 className="text-xl font-bold text-neutral-900">
                    Unlock Full Report (Optional)
                  </h3>
                </div>
                <p className="text-neutral-600 mb-4 leading-relaxed">
                  Want more detail? Pay AED 49 to unlock your comprehensive PDF report with 5 year projections, 
                  sensitivity analysis, and detailed breakdowns of all calculations and assumptions.
                </p>
                <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 space-y-2">
                  <p className="text-sm text-neutral-700">
                    <strong>Premium report includes:</strong>
                  </p>
                  <ul className="text-sm text-neutral-600 space-y-1 ml-4">
                    <li>• Year by year projections for 5 years</li>
                    <li>• Sensitivity analysis (vacancy, rent changes, interest rates)</li>
                    <li>• Exit strategy scenarios and calculations</li>
                    <li>• Detailed expense and income breakdowns</li>
                    <li>• Professional PDF ready to share</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#1e2875] to-[#2f3aad] rounded-2xl text-white shadow-lg">
                  <Download className="w-8 h-8" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="px-3 py-1 bg-[#1e2875] text-white rounded-full text-sm font-semibold">
                    Step 4
                  </span>
                  <h3 className="text-xl font-bold text-neutral-900">
                    Save and Access Anytime
                  </h3>
                </div>
                <p className="text-neutral-600 mb-4 leading-relaxed">
                  All your analyses are automatically saved to your dashboard. Return anytime to review 
                  your calculations, download reports, or run new analyses for additional properties.
                </p>
                <div className="bg-gradient-to-br from-[#1e2875]/10 to-[#1e2875]/5 p-4 rounded-lg border border-[#1e2875]/20">
                  <p className="text-sm text-neutral-700">
                    <strong>Dashboard features:</strong> View all analyses, download purchased reports, 
                    compare multiple properties, track your investment pipeline.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Users Do After */}
      <section className="py-20 bg-gradient-to-b from-white to-neutral-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              What Happens After You Get Your Report?
            </h2>
            <p className="text-lg text-neutral-600">
              YieldPulse users typically take these next steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-neutral-200">
              <Eye className="w-10 h-10 text-[#14b8a6] mb-4" />
              <h3 className="font-semibold text-neutral-900 mb-2">
                Compare Multiple Properties
              </h3>
              <p className="text-neutral-600">
                Run analyses on several properties to identify which offers the best ROI 
                and fits your investment criteria.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-neutral-200">
              <DollarSign className="w-10 h-10 text-[#1e2875] mb-4" />
              <h3 className="font-semibold text-neutral-900 mb-2">
                Make Purchase Decisions
              </h3>
              <p className="text-neutral-600">
                Use the detailed numbers to negotiate price, structure financing, 
                and finalize property purchases with confidence.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-neutral-200">
              <FileText className="w-10 h-10 text-[#5e74f5] mb-4" />
              <h3 className="font-semibold text-neutral-900 mb-2">
                Share with Stakeholders
              </h3>
              <p className="text-neutral-600">
                Present professional reports to partners, investors, lenders, 
                or financial advisors to support your investment case.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-neutral-200">
              <TrendingUp className="w-10 h-10 text-[#14b8a6] mb-4" />
              <h3 className="font-semibold text-neutral-900 mb-2">
                Plan Investment Strategy
              </h3>
              <p className="text-neutral-600">
                Use cash flow projections and sensitivity analysis to plan financing, 
                reserves, and long term portfolio strategy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#1e2875] to-[#2f3aad] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Analyze Your First Property?
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Start with a free analysis. Get instant headline metrics and see how YieldPulse 
            can help you make smarter investment decisions.
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

      <Footer />
    </div>
  );
}