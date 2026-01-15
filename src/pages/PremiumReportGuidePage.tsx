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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumbs items={[
            { label: 'Resources', path: '/premium-report-guide' },
            { label: 'Premium Report Guide' }
          ]} />
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-white to-secondary/5 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        
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
            Your Premium Report is divided into clear sections. Here's what each section tells you and why it matters:
          </p>

          <div className="space-y-8">
            {/* Section 1: Investment Summary */}
            <div className="bg-white border border-border rounded-xl p-8">
              <div className="flex items-start space-x-4 mb-6">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <PieChart className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">1. Investment Summary</h3>
                  <p className="text-sm text-neutral-600">The "at-a-glance" overview of your entire investment</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border-l-4 border-secondary/30 pl-4">
                  <h4 className="font-semibold text-foreground mb-2">What You'll See:</h4>
                  <ul className="space-y-2 text-sm text-neutral-600">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                      <span><strong>Total Investment Required:</strong> Upfront cash needed (down payment + buying costs)</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                      <span><strong>Property Value:</strong> Purchase price of the property</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                      <span><strong>Expected Rental Yield:</strong> Annual rental income percentage</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                      <span><strong>5-Year ROI:</strong> Total return after 5 years</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-4">
                  <p className="text-sm text-foreground">
                    <strong>💡 Quick Decision Rule:</strong> If the 5-year ROI is above 30% and rental yield is above 5%, 
                    you're looking at a strong investment opportunity by UAE standards.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2: Financial Breakdown */}
            <div className="bg-white border border-border rounded-xl p-8">
              <div className="flex items-start space-x-4 mb-6">
                <div className="p-3 bg-secondary/10 rounded-lg">
                  <Calculator className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">2. Financial Breakdown</h3>
                  <p className="text-sm text-neutral-600">Every dirham accounted for - where your money goes</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border-l-4 border-primary/30 pl-4">
                  <h4 className="font-semibold text-foreground mb-2">Initial Costs:</h4>
                  <ul className="space-y-2 text-sm text-neutral-600">
                    <li className="flex items-start space-x-2">
                      <span className="font-mono text-primary">→</span>
                      <span><strong>Down Payment:</strong> Usually 20-25% of property value (UAE standard for mortgages)</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="font-mono text-primary">→</span>
                      <span><strong>Dubai Land Department (DLD) Fee:</strong> 4% of property value (one-time government fee)</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="font-mono text-primary">→</span>
                      <span><strong>Agent Commission:</strong> Typically 2% of property value</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="font-mono text-primary">→</span>
                      <span><strong>Mortgage Registration:</strong> 0.25% of loan amount (if financing)</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="font-mono text-primary">→</span>
                      <span><strong>Valuation & Admin Fees:</strong> AED 2,500-5,000 (bank fees)</span>
                    </li>
                  </ul>
                </div>

                <div className="border-l-4 border-secondary/30 pl-4 mt-6">
                  <h4 className="font-semibold text-foreground mb-2">Ongoing Costs (Annual):</h4>
                  <ul className="space-y-2 text-sm text-neutral-600">
                    <li className="flex items-start space-x-2">
                      <span className="font-mono text-secondary">→</span>
                      <span><strong>Service Charges:</strong> Building maintenance (AED 5-25 per sqft/year)</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="font-mono text-secondary">→</span>
                      <span><strong>DEWA (Utilities):</strong> If vacant or included in rent agreement</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="font-mono text-secondary">→</span>
                      <span><strong>Chiller/Cooling:</strong> Common in Dubai apartments (varies by usage)</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="font-mono text-secondary">→</span>
                      <span><strong>Property Management:</strong> 5-8% of annual rent (if using agent)</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="font-mono text-secondary">→</span>
                      <span><strong>Maintenance Reserve:</strong> 1-2% of property value annually (recommended)</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-amber-900 font-semibold mb-1">Common Beginner Mistake:</p>
                      <p className="text-sm text-amber-800">
                        Many first-time investors only budget for the down payment and forget buying costs. 
                        Always add 7-10% extra for fees and costs. Our calculator includes everything automatically.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Cash Flow Analysis */}
            <div className="bg-white border border-border rounded-xl p-8">
              <div className="flex items-start space-x-4 mb-6">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <LineChart className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">3. Cash Flow Analysis</h3>
                  <p className="text-sm text-neutral-600">Monthly and annual money in vs. money out</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <h4 className="font-semibold text-green-900">Positive Cash Flow</h4>
                    </div>
                    <p className="text-sm text-green-800 mb-2">
                      Rental income exceeds all expenses. The property generates extra income monthly.
                    </p>
                    <p className="text-xs font-mono text-green-700">
                      ✓ Rent: AED 5,000/mo<br />
                      ✓ Expenses: AED 3,000/mo<br />
                      = <strong>+AED 2,000 profit/mo</strong>
                    </p>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <h4 className="font-semibold text-red-900">Negative Cash Flow</h4>
                    </div>
                    <p className="text-sm text-red-800 mb-2">
                      Expenses exceed rental income. You need to cover the difference from your pocket.
                    </p>
                    <p className="text-xs font-mono text-red-700">
                      ✗ Rent: AED 4,000/mo<br />
                      ✗ Expenses: AED 5,500/mo<br />
                      = <strong>-AED 1,500 loss/mo</strong>
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-4">
                  <p className="text-sm text-foreground">
                    <strong>💡 Pro Tip:</strong> Negative cash flow isn't always bad if property appreciation is strong. 
                    But positive cash flow is safer for beginners. Aim for at least break-even monthly.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 4: ROI Projections */}
            <div className="bg-white border border-border rounded-xl p-8">
              <div className="flex items-start space-x-4 mb-6">
                <div className="p-3 bg-secondary/10 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">4. ROI Projections (5, 10, 20 Years)</h3>
                  <p className="text-sm text-neutral-600">Your investment growth over time</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-neutral-600 leading-relaxed">
                  This section shows how your wealth grows over different time horizons. It combines rental income profits 
                  AND property value appreciation to give you the complete picture.
                </p>

                <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                  <h4 className="font-semibold text-foreground mb-3">What the Numbers Mean:</h4>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <Calendar className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">5-Year ROI</p>
                        <p className="text-xs text-neutral-600">Short-term outlook. Good for investors who may need liquidity sooner.</p>
                        <p className="text-xs text-neutral-500 mt-1">Benchmark: 25-40% is strong in UAE</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Calendar className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">10-Year ROI</p>
                        <p className="text-xs text-neutral-600">Medium-term. Standard investment horizon for rental properties.</p>
                        <p className="text-xs text-neutral-500 mt-1">Benchmark: 60-100% is strong in UAE</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Calendar className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">20-Year ROI</p>
                        <p className="text-xs text-neutral-600">Long-term wealth building. Property often paid off by year 20-25.</p>
                        <p className="text-xs text-neutral-500 mt-1">Benchmark: 150-300%+ is strong in UAE</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-secondary/5 to-primary/5 rounded-lg p-4">
                  <p className="text-sm text-foreground">
                    <strong>💡 Investment Strategy:</strong> Most successful UAE property investors hold for 7-15 years minimum. 
                    This allows time for both rental profits to accumulate AND property appreciation to compound.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 5: Comparison Insights */}
            <div className="bg-white border border-border rounded-xl p-8">
              <div className="flex items-start space-x-4 mb-6">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">5. Market Comparison</h3>
                  <p className="text-sm text-neutral-600">How your property stacks up against UAE benchmarks</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-neutral-600 leading-relaxed">
                  Your report compares your property's performance against UAE market averages. This helps you understand 
                  if you're getting a good deal or overpaying.
                </p>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <p className="text-xs font-semibold text-green-700 uppercase mb-1">Above Average</p>
                    <p className="text-2xl font-bold text-green-600 mb-1">👍</p>
                    <p className="text-xs text-green-800">Your property performs better than typical UAE properties</p>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
                    <p className="text-xs font-semibold text-amber-700 uppercase mb-1">Average</p>
                    <p className="text-2xl font-bold text-amber-600 mb-1">👌</p>
                    <p className="text-xs text-amber-800">Your property is in line with market standards</p>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                    <p className="text-xs font-semibold text-red-700 uppercase mb-1">Below Average</p>
                    <p className="text-2xl font-bold text-red-600 mb-1">⚠️</p>
                    <p className="text-xs text-red-800">Consider negotiating price or looking at other options</p>
                  </div>
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
