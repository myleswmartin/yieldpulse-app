import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  TrendingUp, 
  DollarSign, 
  Home, 
  PieChart, 
  Calculator,
  FileText,
  AlertCircle,
  CheckCircle,
  Lightbulb,
  ArrowRight,
  Target,
  LineChart,
  Percent,
  Building2,
  Receipt,
  Banknote,
  Calendar,
  FileCheck,
  HelpCircle,
  BarChart3,
  Zap
} from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { FeedbackWidget } from '../components/FeedbackWidget';
import { InteractiveROICalculator } from '../components/InteractiveROICalculator';
import { useEffect } from 'react';
import { usePublicPricing } from '../utils/usePublicPricing';

export default function PremiumReportGuidePage() {
  const { priceLabel } = usePublicPricing();
  // Track page view for analytics
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'page_view', {
        page_title: 'Premium Report Guide',
        page_location: window.location.href,
        page_path: '/premium-report-guide'
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 via-white to-neutral-50">
      <Header />

      {/* Breadcrumbs */}
      <div className="bg-white border-b border-border">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-4">
          <Breadcrumbs items={[
            { label: 'Resources', path: '/premium-report-guide' },
            { label: 'Premium Report Guide' }
          ]} />
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-white to-secondary/5 border-b border-border">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center space-x-2 bg-secondary/10 px-4 py-2 rounded-full mb-6">
            <BookOpen className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-secondary">Complete Learning Guide</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            How to Read Your
            <br />
            <span className="text-primary">Premium Report</span>
          </h1>
          
          <p className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Zero property experience? No problem. This comprehensive guide takes you from complete beginner to confident investor in minutes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/sample-premium-report"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary-hover transition-colors shadow-sm"
            >
              <FileCheck className="w-5 h-5" />
              <span>View Sample Report</span>
            </Link>
            <Link 
              to="/calculator"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-white text-primary border-2 border-border rounded-lg font-medium hover:border-primary/30 hover:bg-neutral-50 transition-all"
            >
              <Calculator className="w-5 h-5" />
              <span>Try the Calculator</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="bg-white border-b border-border sticky top-20 z-40 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-4">
          <nav className="flex items-center justify-center gap-6 flex-wrap text-sm">
            <a href="#basics" className="text-neutral-600 hover:text-primary transition-colors font-medium">Property 101</a>
            <a href="#sections" className="text-neutral-600 hover:text-primary transition-colors font-medium">Report Walkthrough</a>
            <a href="#metrics" className="text-neutral-600 hover:text-primary transition-colors font-medium">Key Metrics</a>
            <a href="#decisions" className="text-neutral-600 hover:text-primary transition-colors font-medium">Making Decisions</a>
            <a href="#mistakes" className="text-neutral-600 hover:text-primary transition-colors font-medium">Avoid Mistakes</a>
            <a href="#glossary" className="text-neutral-600 hover:text-primary transition-colors font-medium">Glossary</a>
          </nav>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
        
        {/* Introduction Section */}
        <section className="mb-20">
          <div className="bg-gradient-to-br from-secondary/5 to-primary/5 rounded-2xl p-8 border border-border mb-12">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-secondary/10 rounded-lg">
                <Lightbulb className="w-6 h-6 text-secondary" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-foreground mb-3">Welcome to Property Investment</h2>
                <p className="text-neutral-600 leading-relaxed mb-4">
                  Never invested in property before? That's perfectly fine. This guide is designed for absolute beginners. 
                  By the end, you'll understand exactly how to interpret your Premium Report and make informed investment decisions.
                </p>
                <p className="text-neutral-600 leading-relaxed">
                  <strong className="text-foreground">What you'll learn:</strong> Property investment fundamentals, how to read financial metrics, 
                  what makes a good investment, and how to avoid common beginner mistakes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Property Investment 101 */}
        <section id="basics" className="mb-20 scroll-mt-32">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Home className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-foreground">Property Investment 101</h2>
          </div>

          <div className="prose prose-lg max-w-none">
            <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-secondary" />
              <span>What is Property Investment?</span>
            </h3>
            <p className="text-neutral-600 leading-relaxed mb-6">
              Property investment means buying real estate to generate income or profit. In the UAE, investors typically make money in two ways:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white border border-border rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <Banknote className="w-5 h-5 text-secondary" />
                  <h4 className="font-semibold text-foreground">1. Rental Income</h4>
                </div>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  You buy a property and rent it out to tenants. The monthly rent provides regular income. 
                  In Dubai, landlords typically collect rent annually or in 1-4 cheques.
                </p>
              </div>

              <div className="bg-white border border-border rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <TrendingUp className="w-5 h-5 text-secondary" />
                  <h4 className="font-semibold text-foreground">2. Capital Appreciation</h4>
                </div>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  The property value increases over time. When you sell, you make a profit from the price difference. 
                  UAE property has historically appreciated 3-8% annually in prime areas.
                </p>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center space-x-2 mt-12">
              <Calculator className="w-5 h-5 text-secondary" />
              <span>Core Concepts You Must Know</span>
            </h3>

            {/* Interactive ROI Calculator */}
            <InteractiveROICalculator />

            <div className="space-y-6">
              {/* ROI */}
              <div className="bg-gradient-to-br from-primary/5 to-transparent border-l-4 border-primary rounded-lg p-6">
                <h4 className="font-semibold text-foreground mb-2 flex items-center space-x-2">
                  <Percent className="w-5 h-5 text-primary" />
                  <span>Return on Investment (ROI)</span>
                </h4>
                <p className="text-neutral-600 text-sm leading-relaxed mb-3">
                  <strong>What it is:</strong> The total profit you make as a percentage of your initial investment.
                </p>
                <p className="text-neutral-600 text-sm leading-relaxed mb-3">
                  <strong>Why it matters:</strong> It tells you if the property is worth your money. A 5-year ROI of 40% means for every AED 100,000 you invest, you'll make AED 40,000 profit over 5 years.
                </p>
                <div className="bg-white rounded-lg p-4 mt-3">
                  <p className="text-sm font-mono text-neutral-700">
                    <strong>Example:</strong> You invest AED 500,000. After 5 years, you've earned AED 200,000 in total profit (rent + appreciation). 
                    Your ROI = (200,000 ÷ 500,000) × 100 = <strong className="text-primary">40%</strong>
                  </p>
                </div>
              </div>

              {/* Rental Yield */}
              <div className="bg-gradient-to-br from-secondary/5 to-transparent border-l-4 border-secondary rounded-lg p-6">
                <h4 className="font-semibold text-foreground mb-2 flex items-center space-x-2">
                  <Receipt className="w-5 h-5 text-secondary" />
                  <span>Rental Yield</span>
                </h4>
                <p className="text-neutral-600 text-sm leading-relaxed mb-3">
                  <strong>What it is:</strong> Annual rental income as a percentage of property value.
                </p>
                <p className="text-neutral-600 text-sm leading-relaxed mb-3">
                  <strong>Why it matters:</strong> Shows how much passive income the property generates. UAE average is 4-7%. Higher is better for cash flow.
                </p>
                <div className="bg-white rounded-lg p-4 mt-3">
                  <p className="text-sm font-mono text-neutral-700">
                    <strong>Example:</strong> Property value: AED 1,000,000. Annual rent: AED 60,000. 
                    Rental Yield = (60,000 ÷ 1,000,000) × 100 = <strong className="text-secondary">6%</strong>
                  </p>
                </div>
              </div>

              {/* Cash Flow */}
              <div className="bg-gradient-to-br from-primary/5 to-transparent border-l-4 border-primary rounded-lg p-6">
                <h4 className="font-semibold text-foreground mb-2 flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  <span>Cash Flow</span>
                </h4>
                <p className="text-neutral-600 text-sm leading-relaxed mb-3">
                  <strong>What it is:</strong> Money left over after paying all expenses (mortgage, maintenance, fees).
                </p>
                <p className="text-neutral-600 text-sm leading-relaxed mb-3">
                  <strong>Why it matters:</strong> Positive cash flow = property pays for itself. Negative = you need to cover the difference monthly.
                </p>
                <div className="bg-white rounded-lg p-4 mt-3">
                  <p className="text-sm font-mono text-neutral-700">
                    <strong>Example:</strong> Monthly rent: AED 5,000. Monthly expenses: AED 3,500. 
                    Monthly Cash Flow = 5,000 - 3,500 = <strong className="text-primary">+AED 1,500</strong> (Good!)
                  </p>
                </div>
              </div>

              {/* Break-Even Point */}
              <div className="bg-gradient-to-br from-secondary/5 to-transparent border-l-4 border-secondary rounded-lg p-6">
                <h4 className="font-semibold text-foreground mb-2 flex items-center space-x-2">
                  <Target className="w-5 h-5 text-secondary" />
                  <span>Break-Even Point</span>
                </h4>
                <p className="text-neutral-600 text-sm leading-relaxed mb-3">
                  <strong>What it is:</strong> How long until your total profit equals your initial investment.
                </p>
                <p className="text-neutral-600 text-sm leading-relaxed mb-3">
                  <strong>Why it matters:</strong> Shorter is better. Typical UAE properties break even in 10-20 years. Under 15 years is excellent.
                </p>
                <div className="bg-white rounded-lg p-4 mt-3">
                  <p className="text-sm font-mono text-neutral-700">
                    <strong>Example:</strong> Initial investment: AED 300,000. Annual profit: AED 25,000. 
                    Break-Even = 300,000 ÷ 25,000 = <strong className="text-secondary">12 years</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Understanding Your Premium Report */}
        <section id="sections" className="mb-20 scroll-mt-32">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 bg-secondary/10 rounded-lg">
              <FileText className="w-6 h-6 text-secondary" />
            </div>
            <h2 className="text-3xl font-bold text-foreground">Understanding Your Premium Report</h2>
          </div>

          <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
            Your Premium Report contains an Executive Summary plus 7 comprehensive sections. Here's what each section tells you and why it matters:
          </p>

          <div className="space-y-8">
            {/* Executive Summary */}
            <div className="bg-white border border-border rounded-xl p-8">
              <div className="flex items-start space-x-4 mb-6">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Executive Summary</h3>
                  <p className="text-sm text-neutral-600">Ultra-lean 3×3 KPI grid with 9 critical metrics for instant decision-making</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border-l-4 border-secondary/30 pl-4">
                  <h4 className="font-semibold text-foreground mb-2">What You'll See:</h4>
                  <ul className="space-y-2 text-sm text-neutral-600">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                      <span><strong>3×3 KPI Grid:</strong> Gross Yield, Net Yield, Cap Rate in row 1; Annual Cash Flow, Monthly Cash Flow, CoC Return in row 2; Cost per sqft, Rent per sqft, Break-Even Point in row 3</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                      <span><strong>Color-Coded Performance:</strong> Green for excellent metrics, amber for average, red for concerning indicators</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                      <span><strong>Interpretation Box:</strong> Plain-English explanation of what these numbers mean for your specific investment</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-4">
                  <p className="text-sm text-foreground">
                    <strong>💡 Quick Decision Rule:</strong> If Net Yield {'>'} 4%, CoC Return is positive, and Cash Flow is green, 
                    you're looking at a solid investment opportunity by UAE standards.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 1: Five-Year Investment Outcome */}
            <div className="bg-white border border-border rounded-xl p-8">
              <div className="flex items-start space-x-4 mb-6">
                <div className="p-3 bg-secondary/10 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Section 1: Five-Year Investment Outcome</h3>
                  <p className="text-sm text-neutral-600">Complete 5-year projection with ROI, total profit, and wealth growth</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-neutral-600 leading-relaxed">
                  This section answers the critical question: "How much money will I make in 5 years?" It shows your total profit 
                  combining rental income and property appreciation, plus your overall ROI percentage.
                </p>

                <div className="border-l-4 border-primary/30 pl-4">
                  <h4 className="font-semibold text-foreground mb-2">What You'll See:</h4>
                  <ul className="space-y-2 text-sm text-neutral-600">
                    <li className="flex items-start space-x-2">
                      <Target className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span><strong>5-Year ROI:</strong> Total return percentage after 5 years (combines cash flow + property appreciation)</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <DollarSign className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                      <span><strong>Total Profit Breakdown:</strong> Cumulative rental profit + equity gained + appreciation - all costs</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <LineChart className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span><strong>Wealth Growth Summary:</strong> Your initial investment vs. your total wealth after 5 years</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-secondary/5 to-primary/5 rounded-lg p-4">
                  <p className="text-sm text-foreground">
                    <strong>💡 Investment Benchmark:</strong> A 5-year ROI of 30-45% is considered strong in the UAE property market. 
                    Anything above 50% is exceptional and worth serious consideration.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2: Year-by-Year Financial Trajectory */}
            <div className="bg-white border border-border rounded-xl p-8">
              <div className="flex items-start space-x-4 mb-6">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Section 2: Year-by-Year Financial Trajectory</h3>
                  <p className="text-sm text-neutral-600">Detailed annual breakdown showing exactly what happens each year</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-neutral-600 leading-relaxed">
                  This section shows the complete financial story for each of the 5 years - annual rent, operating expenses, 
                  mortgage payments, cash flow, equity buildup, and property value growth. See exactly how your investment performs year-over-year.
                </p>

                <div className="border-l-4 border-secondary/30 pl-4">
                  <h4 className="font-semibold text-foreground mb-2">What You'll See:</h4>
                  <ul className="space-y-2 text-sm text-neutral-600">
                    <li className="flex items-start space-x-2">
                      <Calendar className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span><strong>Annual Performance Table:</strong> Year-by-year data for rental income, expenses, mortgage payments, and net cash flow</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <LineChart className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                      <span><strong>Equity Growth Chart:</strong> Visual chart showing property value vs. loan balance - watch your equity grow over time</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <TrendingUp className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span><strong>Cumulative Profit Tracking:</strong> Running total of profit accumulation from year 1 through year 5</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-4">
                  <p className="text-sm text-foreground">
                    <strong>💡 Investment Insight:</strong> Watch for positive cash flow in year 1. If you're cash flow negative in early years, 
                    ensure you have reserves to cover shortfalls until rental income increases or mortgage payments decrease.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 3: Sensitivity Analysis */}
            <div className="bg-white border border-border rounded-xl p-8">
              <div className="flex items-start space-x-4 mb-6">
                <div className="p-3 bg-secondary/10 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Section 3: Sensitivity Analysis</h3>
                  <p className="text-sm text-neutral-600">"What-if" scenarios to stress-test your investment assumptions</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-neutral-600 leading-relaxed">
                  This section shows how your returns change if key assumptions don't match reality. 
                  All three analyses are always visible so you can see best-case and worst-case scenarios immediately.
                </p>

                <div className="border-l-4 border-primary/30 pl-4">
                  <h4 className="font-semibold text-foreground mb-2">Three Critical Analyses (Always Visible):</h4>
                  <ul className="space-y-3 text-sm text-neutral-600">
                    <li className="flex items-start space-x-2">
                      <Percent className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Rent Sensitivity:</strong> Impact if actual rent is -20%, -10%, 0%, +10%, or +20% from expected. 
                        See how cash flow and CoC return change with rent fluctuations.
                      </div>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Home className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Vacancy Rate Sensitivity:</strong> Impact of 0%, 5%, 10%, 15%, 20% vacancy. 
                        Shows how empty months affect annual cash flow and profitability.
                      </div>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Percent className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Interest Rate Sensitivity:</strong> Impact if mortgage rates change by ±1% or ±2%. 
                        Critical for understanding rate risk exposure if you have a mortgage.
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-amber-900 font-semibold mb-1">Pro Investor Tip:</p>
                      <p className="text-sm text-amber-800">
                        Always check the -10% rent and 10% vacancy scenarios. If you can't afford these downside cases, 
                        the property might be too risky for your financial situation. Never invest assuming best-case scenarios.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Year One Financial Deep Dive */}
            <div className="bg-white border border-border rounded-xl p-8">
              <div className="flex items-start space-x-4 mb-6">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Calculator className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Section 4: Year One Financial Deep Dive</h3>
                  <p className="text-sm text-neutral-600">Month-by-month breakdown of your first year's finances</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-neutral-600 leading-relaxed">
                  Year 1 is the most critical year of your investment journey. This section shows exactly what happens each month - 
                  when rent payments arrive, when mortgage is due, when service charges are paid, and your monthly cash flow position.
                </p>

                <div className="border-l-4 border-secondary/30 pl-4">
                  <h4 className="font-semibold text-foreground mb-2">What You'll See:</h4>
                  <ul className="space-y-2 text-sm text-neutral-600">
                    <li className="flex items-start space-x-2">
                      <Calendar className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span><strong>Monthly Cash Flow Table:</strong> All 12 months showing rental income, mortgage payments, operating costs, and net position</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <DollarSign className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                      <span><strong>Expense Breakdown:</strong> Detailed view of where your money goes - service charges, maintenance, insurance, property management</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <LineChart className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span><strong>Cumulative Cash Position:</strong> Running balance showing if you're building reserves or drawing down cash each month</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-secondary/5 to-primary/5 rounded-lg p-4">
                  <p className="text-sm text-foreground">
                    <strong>💡 First-Year Tip:</strong> In Dubai, most landlords collect rent annually or in 1-4 cheques. Plan your cash flow around 
                    these large lump-sum payments. If cash flow is tight, negotiate for more cheques to spread income throughout the year.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 5: Upfront Capital Requirement */}
            <div className="bg-white border border-border rounded-xl p-8">
              <div className="flex items-start space-x-4 mb-6">
                <div className="p-3 bg-secondary/10 rounded-lg">
                  <Receipt className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Section 5: Upfront Capital Requirement</h3>
                  <p className="text-sm text-neutral-600">Every single dirham you need to close the deal</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-neutral-600 leading-relaxed">
                  This is your complete shopping list of upfront costs. Many first-time investors underestimate closing costs - 
                  this section ensures you know exactly how much cash you need to have ready on day one.
                </p>

                <div className="border-l-4 border-primary/30 pl-4">
                  <h4 className="font-semibold text-foreground mb-2">Complete Cost Breakdown:</h4>
                  <ul className="space-y-2 text-sm text-neutral-600">
                    <li className="flex items-start space-x-2">
                      <Home className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span><strong>Down Payment:</strong> Minimum 20-25% of property value (15% if first-time buyer under AED 5M)</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <FileText className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                      <span><strong>Dubai Land Department (DLD) Fee:</strong> 4% of property value for transfer fee</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Receipt className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span><strong>Real Estate Agency Fee:</strong> Typically 2% + VAT (split between buyer and seller, or paid by buyer)</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Building2 className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                      <span><strong>Mortgage Arrangement Fee:</strong> Typically 1% of loan amount if financing</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <FileCheck className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span><strong>Additional Costs:</strong> Valuation fee (AED 2,500-3,500), trustee fee, mortgage registration, property insurance</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-amber-900 font-semibold mb-1">Critical Warning:</p>
                      <p className="text-sm text-amber-800">
                        Total upfront costs typically range 27-33% of property value in Dubai. For a AED 1M property, expect to need 
                        AED 270,000-330,000 in cash. Never proceed without this full amount secured.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 6: Mortgage Breakdown */}
            <div className="bg-white border border-border rounded-xl p-8">
              <div className="flex items-start space-x-4 mb-6">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Banknote className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Section 6: Mortgage Breakdown</h3>
                  <p className="text-sm text-neutral-600">Complete mortgage details and amortization schedule</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-neutral-600 leading-relaxed">
                  If you're financing the property, this section shows exactly how your mortgage works - monthly payments, 
                  how much goes to interest vs. principal, and how quickly you build equity over time.
                </p>

                <div className="border-l-4 border-secondary/30 pl-4">
                  <h4 className="font-semibold text-foreground mb-2">What You'll See:</h4>
                  <ul className="space-y-2 text-sm text-neutral-600">
                    <li className="flex items-start space-x-2">
                      <Calculator className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span><strong>Loan Summary:</strong> Loan amount, interest rate, term length, monthly payment amount</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <PieChart className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                      <span><strong>Principal vs. Interest Split:</strong> See how much of each payment builds equity vs. pays interest</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <LineChart className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span><strong>Amortization Chart:</strong> Visual representation of loan balance decreasing and equity increasing over the full term</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <DollarSign className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                      <span><strong>Total Interest Paid:</strong> Lifetime interest cost - understand the true cost of financing</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-4">
                  <p className="text-sm text-foreground">
                    <strong>💡 Mortgage Strategy:</strong> In the early years, most of your payment goes to interest. After year 10-12, 
                    the balance shifts and you start building equity faster. Consider refinancing if rates drop 1% or more.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 7: Input and Assumption Verification */}
            <div className="bg-white border-2 border-primary/30 rounded-xl p-8">
              <div className="flex items-start space-x-4 mb-6">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <FileCheck className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Section 7: Input and Assumption Verification</h3>
                  <p className="text-sm text-neutral-600">Always visible for maximum transparency - verify every single input and assumption</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-foreground font-semibold mb-1">Transparency Commitment:</p>
                      <p className="text-sm text-neutral-700">
                        Unlike typical investment reports that hide assumptions in fine print, YieldPulse makes Section 7 always visible and non-collapsible. 
                        You can verify every single number that went into your report's calculations.
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-neutral-600 leading-relaxed">
                  This section lists all inputs you provided (property price, rent, down payment, interest rate) and all assumptions 
                  the calculator used (appreciation rate, vacancy rate, maintenance costs, etc.). Verify these match your expectations.
                </p>

                <div className="border-l-4 border-secondary/30 pl-4">
                  <h4 className="font-semibold text-foreground mb-2">What You'll See:</h4>
                  <ul className="space-y-2 text-sm text-neutral-600">
                    <li className="flex items-start space-x-2">
                      <Home className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span><strong>Property Inputs:</strong> Property value, expected rent, property size, down payment percentage, mortgage terms</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Percent className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                      <span><strong>Growth Assumptions:</strong> Annual appreciation rate, rental growth rate, inflation rate</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Receipt className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span><strong>Cost Assumptions:</strong> Service charges, maintenance (% of property value), property management fees, insurance</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Calculator className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                      <span><strong>Transaction Costs:</strong> DLD fee (4%), agency fee (2% + VAT), mortgage arrangement fee, valuation fee</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span><strong>Vacancy Rate:</strong> Percentage of year property assumed to be vacant (typically 5-10% in Dubai)</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-amber-900 font-semibold mb-1">Action Required:</p>
                      <p className="text-sm text-amber-800">
                        Carefully review every assumption in this section. If any don't match your research or expectations, 
                        recalculate the report with updated inputs. Your investment decision is only as good as your assumptions.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-4">
                  <p className="text-sm text-foreground">
                    <strong>💡 Verification Checklist:</strong> Cross-reference property price with recent sales data, verify rent with 3+ comparable listings, 
                    confirm service charges with developer/management company, and validate mortgage rates with 2-3 banks before proceeding.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Metrics Deep Dive */}
        <section id="metrics" className="mb-20 scroll-mt-32">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-foreground">Key Metrics Explained</h2>
          </div>

          <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
            Let's dive deeper into the specific numbers and what they mean for your investment decision:
          </p>

          <div className="space-y-6">
            {/* Metric 1 */}
            <div className="bg-white border-2 border-primary/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-foreground">Annual Rental Yield</h3>
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full">Critical</span>
              </div>
              <p className="text-sm text-neutral-600 mb-4 leading-relaxed">
                Shows how much passive income your property generates relative to its value. Higher is better for cash flow.
              </p>
              <div className="bg-neutral-50 rounded-lg p-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-200">
                      <th className="text-left py-2 font-semibold text-foreground">Yield Range</th>
                      <th className="text-left py-2 font-semibold text-foreground">Rating</th>
                      <th className="text-left py-2 font-semibold text-foreground">Typical Areas</th>
                    </tr>
                  </thead>
                  <tbody className="text-neutral-600">
                    <tr className="border-b border-neutral-100">
                      <td className="py-2">7%+</td>
                      <td className="py-2 text-green-600 font-semibold">Excellent</td>
                      <td className="py-2">International City, Discovery Gardens</td>
                    </tr>
                    <tr className="border-b border-neutral-100">
                      <td className="py-2">5-7%</td>
                      <td className="py-2 text-secondary font-semibold">Good</td>
                      <td className="py-2">JVC, Dubai Sports City, JLT</td>
                    </tr>
                    <tr className="border-b border-neutral-100">
                      <td className="py-2">4-5%</td>
                      <td className="py-2 text-amber-600 font-semibold">Average</td>
                      <td className="py-2">Dubai Marina, JBR, Downtown</td>
                    </tr>
                    <tr>
                      <td className="py-2">Below 4%</td>
                      <td className="py-2 text-red-600 font-semibold">Poor</td>
                      <td className="py-2">Premium areas (appreciation focus)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="bg-white border-2 border-secondary/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-foreground">Cash-on-Cash Return</h3>
                <span className="px-3 py-1 bg-secondary/10 text-secondary text-sm font-semibold rounded-full">Important</span>
              </div>
              <p className="text-sm text-neutral-600 mb-4 leading-relaxed">
                Annual cash flow as a percentage of your initial cash investment (not total property value). 
                This shows the real return on YOUR money, not borrowed money.
              </p>
              <div className="bg-gradient-to-r from-secondary/5 to-primary/5 rounded-lg p-4">
                <p className="text-sm text-foreground mb-3">
                  <strong>Example Calculation:</strong>
                </p>
                <div className="text-sm font-mono text-neutral-700 space-y-1">
                  <p>Initial Investment (Cash): AED 400,000</p>
                  <p>Annual Net Cash Flow: AED 24,000</p>
                  <p className="pt-2 border-t border-neutral-200 mt-2">
                    Cash-on-Cash = (24,000 ÷ 400,000) × 100 = <strong className="text-secondary">6%</strong>
                  </p>
                </div>
                <p className="text-xs text-neutral-600 mt-3">
                  A 6% cash-on-cash return means you're earning 6% annually on the actual cash you invested.
                </p>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="bg-white border-2 border-primary/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-foreground">Capitalization Rate (Cap Rate)</h3>
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full">Advanced</span>
              </div>
              <p className="text-sm text-neutral-600 mb-4 leading-relaxed">
                Net operating income as a percentage of property value. Used by professional investors to compare properties. 
                Similar to rental yield but accounts for operating expenses.
              </p>
              <div className="bg-neutral-50 rounded-lg p-4">
                <p className="text-sm text-neutral-700 mb-2">
                  <strong>What's a good cap rate in UAE?</strong>
                </p>
                <ul className="space-y-2 text-sm text-neutral-600">
                  <li className="flex items-start space-x-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span><strong>5-7%:</strong> Strong for established areas</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span><strong>3-5%:</strong> Typical for premium locations</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span><strong>Below 3%:</strong> Low yield, appreciation play only</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Metric 4 */}
            <div className="bg-white border-2 border-secondary/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-foreground">Loan-to-Value Ratio (LTV)</h3>
                <span className="px-3 py-1 bg-neutral-200 text-neutral-700 text-sm font-semibold rounded-full">Reference</span>
              </div>
              <p className="text-sm text-neutral-600 mb-4 leading-relaxed">
                The percentage of property value financed by mortgage. UAE banks typically offer 75-80% LTV for expats, 85% for UAE nationals.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-green-900 mb-2">Lower LTV (40-60%)</h4>
                  <ul className="space-y-1 text-xs text-green-800">
                    <li>✓ Lower monthly payments</li>
                    <li>✓ Less interest paid overall</li>
                    <li>✓ Better cash flow</li>
                    <li>✗ More cash needed upfront</li>
                  </ul>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-amber-900 mb-2">Higher LTV (75-80%)</h4>
                  <ul className="space-y-1 text-xs text-amber-800">
                    <li>✓ Less cash needed upfront</li>
                    <li>✓ Leverage for higher ROI</li>
                    <li>✗ Higher monthly payments</li>
                    <li>✗ More interest paid</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Making Investment Decisions */}
        <section id="decisions" className="mb-20 scroll-mt-32">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 bg-secondary/10 rounded-lg">
              <Target className="w-6 h-6 text-secondary" />
            </div>
            <h2 className="text-3xl font-bold text-foreground">How to Make Investment Decisions</h2>
          </div>

          <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
            Now that you understand the metrics, here's a practical framework for deciding if a property is worth buying:
          </p>

          <div className="space-y-6">
            {/* Decision Framework */}
            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-primary/20 rounded-xl p-8">
              <h3 className="text-xl font-bold text-foreground mb-6">The 4-Point Investment Checklist</h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-2">Cash Flow Test</h4>
                    <p className="text-sm text-neutral-600 mb-3">
                      <strong>Question:</strong> Is the monthly cash flow positive or at least break-even?
                    </p>
                    <div className="bg-white rounded-lg p-3 text-sm">
                      <p className="text-green-700">✓ <strong>Pass:</strong> Positive or neutral cash flow</p>
                      <p className="text-amber-700">⚠ <strong>Caution:</strong> Negative but less than -AED 1,000/month</p>
                      <p className="text-red-700">✗ <strong>Fail:</strong> Negative more than -AED 1,000/month (unless strong appreciation expected)</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-secondary text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-2">Rental Yield Test</h4>
                    <p className="text-sm text-neutral-600 mb-3">
                      <strong>Question:</strong> Is the rental yield competitive for the area?
                    </p>
                    <div className="bg-white rounded-lg p-3 text-sm">
                      <p className="text-green-700">✓ <strong>Pass:</strong> 5%+ yield</p>
                      <p className="text-amber-700">⚠ <strong>Caution:</strong> 4-5% yield (okay for prime areas)</p>
                      <p className="text-red-700">✗ <strong>Fail:</strong> Below 4% (unless in ultra-prime area with strong appreciation)</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-2">ROI Test</h4>
                    <p className="text-sm text-neutral-600 mb-3">
                      <strong>Question:</strong> Does the 5-year ROI meet your goals?
                    </p>
                    <div className="bg-white rounded-lg p-3 text-sm">
                      <p className="text-green-700">✓ <strong>Pass:</strong> 30%+ over 5 years</p>
                      <p className="text-amber-700">⚠ <strong>Caution:</strong> 20-30% over 5 years</p>
                      <p className="text-red-700">✗ <strong>Fail:</strong> Below 20% over 5 years (better alternatives likely available)</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-secondary text-white rounded-full flex items-center justify-center font-bold">
                    4
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-2">Location & Risk Test</h4>
                    <p className="text-sm text-neutral-600 mb-3">
                      <strong>Question:</strong> Is the location strong with low vacancy risk?
                    </p>
                    <div className="bg-white rounded-lg p-3 text-sm">
                      <p className="text-green-700">✓ <strong>Pass:</strong> Established area, near metro/schools, high rental demand</p>
                      <p className="text-amber-700">⚠ <strong>Caution:</strong> Developing area, moderate demand</p>
                      <p className="text-red-700">✗ <strong>Fail:</strong> Remote location, oversupply in area, poor infrastructure</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-white rounded-lg p-6 border-2 border-secondary">
                <p className="text-sm font-semibold text-foreground mb-2">Quick Decision Rule:</p>
                <p className="text-sm text-neutral-600">
                  If you pass <strong className="text-secondary">3 out of 4</strong> tests, it's likely a solid investment. 
                  If you pass all 4, it's an excellent opportunity. Failing 2 or more? Keep looking.
                </p>
              </div>
            </div>

            {/* Investment Strategies */}
            <div className="bg-white border border-border rounded-xl p-8">
              <h3 className="text-xl font-bold text-foreground mb-6">Choose Your Investment Strategy</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border-2 border-primary/30 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Banknote className="w-6 h-6 text-primary" />
                    <h4 className="font-semibold text-foreground">Cash Flow Strategy</h4>
                  </div>
                  <p className="text-sm text-neutral-600 mb-4">
                    <strong>Goal:</strong> Generate monthly passive income
                  </p>
                  <ul className="space-y-2 text-sm text-neutral-600">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Target 6%+ rental yield</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Prioritize positive monthly cash flow</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Look at affordable areas (JVC, DSC)</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Lower LTV (60-70%) for better cash flow</span>
                    </li>
                  </ul>
                  <p className="text-xs text-neutral-500 mt-4 italic">
                    Best for: Investors seeking regular income, retirees, those building passive income streams
                  </p>
                </div>

                <div className="border-2 border-secondary/30 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <TrendingUp className="w-6 h-6 text-secondary" />
                    <h4 className="font-semibold text-foreground">Appreciation Strategy</h4>
                  </div>
                  <p className="text-sm text-neutral-600 mb-4">
                    <strong>Goal:</strong> Long-term wealth through property value growth
                  </p>
                  <ul className="space-y-2 text-sm text-neutral-600">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                      <span>Accept 4-5% rental yield</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                      <span>Can tolerate neutral/small negative cash flow</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                      <span>Invest in premium areas (Marina, Downtown)</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                      <span>Hold 10+ years for compounding growth</span>
                    </li>
                  </ul>
                  <p className="text-xs text-neutral-500 mt-4 italic">
                    Best for: Long-term investors, high-income earners, those building generational wealth
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Common Mistakes to Avoid */}
        <section id="mistakes" className="mb-20 scroll-mt-32">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-3xl font-bold text-foreground">Common Beginner Mistakes to Avoid</h2>
          </div>

          <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
            Learn from others' mistakes. Here are the most common pitfalls new investors make in the UAE market:
          </p>

          <div className="space-y-6">
            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-red-900 mb-2">Mistake #1: Ignoring Hidden Costs</h3>
                  <p className="text-sm text-red-800 mb-3">
                    <strong>What happens:</strong> Buyers only budget for down payment, then get shocked by 6-8% additional buying costs.
                  </p>
                  <p className="text-sm text-red-700">
                    <strong>How to avoid:</strong> Always add 7-10% to property value for fees (DLD, agent, mortgage). Use our calculator - it includes everything.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-red-900 mb-2">Mistake #2: Overestimating Rental Income</h3>
                  <p className="text-sm text-red-800 mb-3">
                    <strong>What happens:</strong> Sellers/agents quote inflated rent figures. You buy expecting AED 70,000/year but only get AED 55,000.
                  </p>
                  <p className="text-sm text-red-700">
                    <strong>How to avoid:</strong> Research actual rental listings on Bayut/Property Finder. Check completed rentals, not just asking prices. Be conservative.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-red-900 mb-2">Mistake #3: Forgetting Annual Costs</h3>
                  <p className="text-sm text-red-800 mb-3">
                    <strong>What happens:</strong> Service charges, chiller, maintenance eat into profits. A 7% yield becomes 5% after costs.
                  </p>
                  <p className="text-sm text-red-700">
                    <strong>How to avoid:</strong> Ask seller for annual service charge invoice. Budget 1-2% annually for maintenance. Include all costs in calculations.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-red-900 mb-2">Mistake #4: Chasing Only High Yields</h3>
                  <p className="text-sm text-red-800 mb-3">
                    <strong>What happens:</strong> Buy in remote area for 8% yield, but property sits vacant or has high tenant turnover.
                  </p>
                  <p className="text-sm text-red-700">
                    <strong>How to avoid:</strong> Balance yield with location quality. A 5.5% yield in JLT is better than 7.5% in a remote area with vacancy risk.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-red-900 mb-2">Mistake #5: Not Planning for Vacancy</h3>
                  <p className="text-sm text-red-800 mb-3">
                    <strong>What happens:</strong> Assume 100% occupancy. Tenant leaves, property sits empty for 2 months, cash flow collapses.
                  </p>
                  <p className="text-sm text-red-700">
                    <strong>How to avoid:</strong> Budget for 1-2 months vacancy per year. Keep emergency fund equal to 6 months expenses. Never assume perfect occupancy.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-red-900 mb-2">Mistake #6: Emotional Buying</h3>
                  <p className="text-sm text-red-800 mb-3">
                    <strong>What happens:</strong> Fall in love with fancy finishes, ignore the numbers. Buy overpriced property with poor returns.
                  </p>
                  <p className="text-sm text-red-700">
                    <strong>How to avoid:</strong> Investment properties are about numbers, not aesthetics. If the ROI and cash flow don't work, walk away. There are always more properties.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-red-900 mb-2">Mistake #7: Overleveraging</h3>
                  <p className="text-sm text-red-800 mb-3">
                    <strong>What happens:</strong> Take maximum 80% LTV loan. High monthly payments, negative cash flow, financial stress if rent drops.
                  </p>
                  <p className="text-sm text-red-700">
                    <strong>How to avoid:</strong> Conservative LTV (60-70%) = better cash flow + safety buffer. Don't stretch yourself thin. Market downturns happen.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Glossary */}
        <section id="glossary" className="mb-20 scroll-mt-32">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 bg-secondary/10 rounded-lg">
              <HelpCircle className="w-6 h-6 text-secondary" />
            </div>
            <h2 className="text-3xl font-bold text-foreground">Investment Glossary</h2>
          </div>

          <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
            Quick reference for all property investment terms used in your Premium Report:
          </p>

          <div className="bg-white border border-border rounded-xl divide-y divide-border">
            <div className="p-6">
              <h3 className="font-semibold text-foreground mb-1">Appreciation</h3>
              <p className="text-sm text-neutral-600">Increase in property value over time. UAE average: 3-6% annually in stable markets.</p>
            </div>

            <div className="p-6">
              <h3 className="font-semibold text-foreground mb-1">Break-Even Point</h3>
              <p className="text-sm text-neutral-600">Time required for cumulative profits to equal initial investment. Shorter is better.</p>
            </div>

            <div className="p-6">
              <h3 className="font-semibold text-foreground mb-1">Cap Rate (Capitalization Rate)</h3>
              <p className="text-sm text-neutral-600">Net operating income ÷ property value. Professional metric for comparing investment properties.</p>
            </div>

            <div className="p-6">
              <h3 className="font-semibold text-foreground mb-1">Cash Flow</h3>
              <p className="text-sm text-neutral-600">Net income after all expenses. Positive = profit. Negative = you pay monthly.</p>
            </div>

            <div className="p-6">
              <h3 className="font-semibold text-foreground mb-1">Cash-on-Cash Return</h3>
              <p className="text-sm text-neutral-600">Annual cash flow as % of cash invested (not total property value). Shows leverage effect.</p>
            </div>

            <div className="p-6">
              <h3 className="font-semibold text-foreground mb-1">DLD Fee (Dubai Land Department)</h3>
              <p className="text-sm text-neutral-600">4% government transfer fee paid when buying property in Dubai. One-time cost.</p>
            </div>

            <div className="p-6">
              <h3 className="font-semibold text-foreground mb-1">Down Payment</h3>
              <p className="text-sm text-neutral-600">Initial cash payment when buying. UAE: 20-25% for expats, 15-20% for nationals.</p>
            </div>

            <div className="p-6">
              <h3 className="font-semibold text-foreground mb-1">Equity</h3>
              <p className="text-sm text-neutral-600">Your ownership stake in property. Grows as you pay mortgage and property appreciates.</p>
            </div>

            <div className="p-6">
              <h3 className="font-semibold text-foreground mb-1">Gross Rental Yield</h3>
              <p className="text-sm text-neutral-600">Annual rent ÷ property value. Does NOT account for costs. Always use net yield for decisions.</p>
            </div>

            <div className="p-6">
              <h3 className="font-semibold text-foreground mb-1">LTV (Loan-to-Value)</h3>
              <p className="text-sm text-neutral-600">Mortgage amount as % of property value. UAE max: 75-80% for expats, 85% for nationals.</p>
            </div>

            <div className="p-6">
              <h3 className="font-semibold text-foreground mb-1">Maintenance Reserve</h3>
              <p className="text-sm text-neutral-600">Emergency fund for repairs. Recommended: 1-2% of property value annually.</p>
            </div>

            <div className="p-6">
              <h3 className="font-semibold text-foreground mb-1">Net Rental Yield</h3>
              <p className="text-sm text-neutral-600">(Annual rent - costs) ÷ property value. The REAL yield after all expenses.</p>
            </div>

            <div className="p-6">
              <h3 className="font-semibold text-foreground mb-1">NOI (Net Operating Income)</h3>
              <p className="text-sm text-neutral-600">Rental income minus operating expenses. Used to calculate cap rate.</p>
            </div>

            <div className="p-6">
              <h3 className="font-semibold text-foreground mb-1">Occupancy Rate</h3>
              <p className="text-sm text-neutral-600">% of time property is rented. 95%+ is excellent in UAE. Budget for 90% to be safe.</p>
            </div>

            <div className="p-6">
              <h3 className="font-semibold text-foreground mb-1">ROI (Return on Investment)</h3>
              <p className="text-sm text-neutral-600">Total profit (rent + appreciation) ÷ initial investment. The ultimate success metric.</p>
            </div>

            <div className="p-6">
              <h3 className="font-semibold text-foreground mb-1">Service Charge</h3>
              <p className="text-sm text-neutral-600">Annual building maintenance fee. Paid by owner. UAE: AED 5-25 per sqft/year depending on building.</p>
            </div>

            <div className="p-6">
              <h3 className="font-semibold text-foreground mb-1">Vacancy Rate</h3>
              <p className="text-sm text-neutral-600">% of time property sits empty. Dubai average: 5-10%. Budget conservatively.</p>
            </div>
          </div>
        </section>

        {/* Feedback Widget */}
        <section className="mb-12">
          <FeedbackWidget 
            pageId="premium-report-guide" 
            title="Was this guide helpful?"
          />
        </section>

        {/* Next Steps CTA */}
        <section className="bg-gradient-to-br from-primary/10 via-secondary/5 to-primary/10 rounded-2xl p-12 text-center border-2 border-primary/20">
          <div className="max-w-2xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-secondary/10 px-4 py-2 rounded-full mb-6">
              <Zap className="w-4 h-4 text-secondary" />
              <span className="text-sm font-medium text-secondary">Ready to Start?</span>
            </div>

            <h2 className="text-3xl font-bold text-foreground mb-4">
              You're Now Ready to Analyze Properties Like a Pro
            </h2>
            
            <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
              You've learned the fundamentals. Now put this knowledge to work with YieldPulse's powerful calculator 
              and get your first professional-grade Premium Report for just {priceLabel}.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/calculator"
                className="group inline-flex items-center space-x-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary-hover transition-all shadow-lg hover:shadow-xl"
              >
                <Calculator className="w-5 h-5" />
                <span>Start Your First Analysis</span>
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

            <div className="mt-8 pt-8 border-t border-border/50">
              <p className="text-sm text-neutral-600">
                <strong>Still have questions?</strong>{' '}
                <Link to="/contact" className="text-primary hover:text-primary-hover font-medium underline">
                  Contact our support team
                </Link>
                {' '}or{' '}
                <Link to="/glossary" className="text-primary hover:text-primary-hover font-medium underline">
                  explore our investment glossary
                </Link>
              </p>
            </div>
          </div>
        </section>

      </div>

      <Footer />
    </div>
  );
}
