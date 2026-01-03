import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { 
  CheckCircle, 
  ArrowRight, 
  HelpCircle,
  Zap,
  FileText,
  DollarSign,
  Shield,
  X
} from 'lucide-react';

export default function PricingPage() {
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
            Start with free headline metrics. Pay per report only when you need detailed analysis. 
            No subscriptions, no hidden fees.
          </p>
        </div>
      </section>

      {/* Main Pricing Card - Single Plan */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Pay Per Report
            </h2>
            <p className="text-lg text-neutral-600">
              One simple price. Only pay when you need the full analysis.
            </p>
          </div>

          <div className="bg-white rounded-2xl border-2 border-border p-10 shadow-sm">
            <div className="text-center mb-8">
              <div className="inline-flex items-baseline space-x-2">
                <span className="text-5xl font-bold text-foreground">AED 49</span>
                <span className="text-xl text-neutral-600">per report</span>
              </div>
              <p className="text-sm text-neutral-500 mt-2">One time payment per property analysis</p>
            </div>

            <div className="mb-8">
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

      {/* Free vs Premium Comparison */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Free Preview vs Premium Report
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
                      Free Preview
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-foreground bg-primary/5">
                      Premium Report
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    { feature: 'Gross rental yield', free: true, premium: true },
                    { feature: 'Net rental yield', free: true, premium: true },
                    { feature: 'Cash on cash return', free: true, premium: true },
                    { feature: 'Monthly cash flow', free: true, premium: true },
                    { feature: 'Annual cash flow', free: true, premium: true },
                    { feature: 'Save to dashboard', free: true, premium: true },
                    { feature: '5 year projections', free: false, premium: true },
                    { feature: 'Sensitivity analysis', free: false, premium: true },
                    { feature: 'Exit strategy calculations', free: false, premium: true },
                    { feature: 'Detailed expense breakdown', free: false, premium: true },
                    { feature: 'Professional PDF report', free: false, premium: true },
                    { feature: 'Download and share', free: false, premium: true }
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
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Who Is This For */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Who Is This For?
            </h2>
            <p className="text-lg text-neutral-600">
              YieldPulse is designed for UAE property investors at any stage
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: 'First Time Investors',
                desc: 'Get clear numbers to make confident first investment decisions in UAE property market'
              },
              {
                title: 'Portfolio Investors',
                desc: 'Quickly evaluate multiple properties and compare opportunities across your pipeline'
              },
              {
                title: 'Real Estate Agents',
                desc: 'Provide professional analysis to clients and support purchase recommendations'
              },
              {
                title: 'Financial Advisors',
                desc: 'Generate accurate ROI reports for client property investment portfolios'
              }
            ].map((item, i) => (
              <div key={i} className="bg-muted/30 p-6 rounded-xl border border-border">
                <h3 className="font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Pay Per Report */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Why Pay Per Report?
            </h2>
            <p className="text-lg text-neutral-600 leading-relaxed">
              We believe in fair pricing. You should only pay for what you use.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-border text-center">
              <DollarSign className="w-12 h-12 text-secondary mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">
                No Subscriptions
              </h3>
              <p className="text-neutral-600 text-sm">
                No monthly fees. No recurring charges. Pay only when you need a detailed report.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-border text-center">
              <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">
                No Hidden Fees
              </h3>
              <p className="text-neutral-600 text-sm">
                AED 49 is the full price. No setup fees, no processing fees, no surprises.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-border text-center">
              <Zap className="w-12 h-12 text-chart-1 mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">
                Unlimited Free Use
              </h3>
              <p className="text-neutral-600 text-sm">
                Run as many free analyses as you want. Only pay when you need the full report.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-neutral-600">
              Common questions about how YieldPulse pricing works
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                q: 'Do I need to pay to use the calculator?',
                a: 'No. The calculator is completely free to use. You can run unlimited analyses and see all headline metrics (gross yield, net yield, cash on cash return, cash flow) without paying anything.'
              },
              {
                q: 'What do I get for AED 49?',
                a: 'For AED 49 per property analysis, you unlock a comprehensive PDF report with 5 year projections, sensitivity analysis, exit strategies, and detailed breakdowns of all calculations. This report is professionally formatted and ready to share or download.'
              },
              {
                q: 'Is the AED 49 a one time payment or subscription?',
                a: 'It is a one time payment per property report. You pay AED 49 for each detailed report you want to unlock. There are no recurring charges or subscription fees.'
              },
              {
                q: 'Can I save my analyses without paying?',
                a: 'Yes. All your analyses are automatically saved to your dashboard, even if you do not purchase the premium report. You can return anytime to review your calculations or unlock the full report later.'
              },
              {
                q: 'What if I analyze multiple properties?',
                a: 'You can analyze as many properties as you want for free. You only pay AED 49 when you want to unlock the detailed PDF report for a specific property.'
              },
              {
                q: 'Are there any hidden fees or charges?',
                a: 'No. AED 49 is the complete price for a premium report. There are no setup fees, processing fees, or any other charges.'
              },
              {
                q: 'Can I access my reports after purchasing?',
                a: 'Yes. Once you purchase a report, you have lifetime access. You can download or view it from your dashboard anytime.'
              },
              {
                q: 'Do you offer refunds?',
                a: 'Because we provide instant digital delivery of PDF reports, all sales are final. We recommend using the free analysis features first to ensure the tool meets your needs before purchasing.'
              }
            ].map((item, i) => (
              <div key={i} className="bg-muted/30 p-6 rounded-xl border border-border">
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
      <section className="py-20 bg-gradient-to-br from-primary to-primary-hover text-primary-foreground">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Start with a Free Analysis
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            No credit card required. Get instant ROI calculations and see how YieldPulse 
            can help you make informed investment decisions.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/calculator" 
              className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-primary rounded-xl font-medium hover:shadow-2xl transition-all duration-200"
            >
              <span>Try Free Calculator</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              to="/how-it-works" 
              className="inline-flex items-center space-x-2 px-8 py-4 bg-white/10 text-white border-2 border-white/30 rounded-xl font-medium hover:bg-white/20 transition-all duration-200"
            >
              <span>Learn How It Works</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
