import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { 
  TrendingUp, 
  Target, 
  Eye, 
  Users, 
  Shield, 
  Building2 
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          {/* Page Header */}
          <div className="mb-16">
            <h1 className="text-4xl font-bold text-neutral-900 mb-2">
              About YieldPulse
            </h1>
          </div>

          {/* Platform Overview */}
          <div className="mb-12">
            <div className="flex items-start gap-4 mb-6">
              <TrendingUp className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <h2 className="text-2xl font-bold text-neutral-900">
                Independent Property Investment Analysis for the UAE
              </h2>
            </div>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <p>
                YieldPulse is a property investment analysis platform designed to help users objectively evaluate residential real estate opportunities in the United Arab Emirates.
              </p>
              <p>
                The platform provides clear, structured financial analysis that enables users to understand yield, cash flow, risk, and long term return potential before making investment decisions.
              </p>
              <p>
                YieldPulse does not sell property, promote developments, or provide financial advice. It exists solely to support informed decision making through transparent analysis.
              </p>
            </div>
          </div>

          {/* What YieldPulse Does */}
          <div className="mb-12 bg-white rounded-lg shadow-sm border border-neutral-200 p-8">
            <div className="flex items-start gap-4 mb-6">
              <Target className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <h2 className="text-2xl font-bold text-neutral-900">
                What the Platform Delivers
              </h2>
            </div>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <p>
                YieldPulse converts property inputs into structured investment analysis using established real estate finance methodologies.
              </p>
              <p className="font-medium text-neutral-700">
                The platform enables users to:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Assess rental yield and cash flow performance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Understand upfront capital requirements</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Model five year financial outcomes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Evaluate exit scenarios and total return</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Test downside and upside risk through sensitivity analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Review every calculation with full transparency</span>
                </li>
              </ul>
              <p>
                All outputs are generated consistently using disclosed assumptions and formulas.
              </p>
            </div>
          </div>

          {/* Analytical Philosophy */}
          <div className="mb-12">
            <div className="flex items-start gap-4 mb-6">
              <Eye className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <h2 className="text-2xl font-bold text-neutral-900">
                Built on Transparency and Discipline
              </h2>
            </div>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <p>
                YieldPulse is built around a simple principle: investors should be able to see exactly how every number is calculated.
              </p>
              <p>
                There are no hidden assumptions, opaque scoring models, or proprietary "black box" outputs. All calculations are derived from clearly stated inputs using standard real estate investment formulas.
              </p>
              <p className="font-medium text-neutral-700">
                This approach allows users to:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Independently verify results</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Challenge assumptions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Adjust scenarios responsibly</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Make decisions with confidence</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Who YieldPulse Is For */}
          <div className="mb-12 bg-white rounded-lg shadow-sm border border-neutral-200 p-8">
            <div className="flex items-start gap-4 mb-6">
              <Users className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <h2 className="text-2xl font-bold text-neutral-900">
                Designed for Serious Decision Makers
              </h2>
            </div>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <p>
                YieldPulse is designed for individuals and professionals who require structured, data driven insight into residential property investments.
              </p>
              <p className="font-medium text-neutral-700">
                This includes:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Individual investors evaluating buy to let opportunities</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Homebuyers assessing affordability and long term cost</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Professionals conducting preliminary feasibility analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Advisors seeking transparent modelling tools</span>
                </li>
              </ul>
              <p>
                The platform is not intended to replace professional advice, but to support better informed discussions and decisions.
              </p>
            </div>
          </div>

          {/* Governance & Transparency */}
          <div className="mb-12">
            <div className="flex items-start gap-4 mb-6">
              <Shield className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <h2 className="text-2xl font-bold text-neutral-900">
                Clear Boundaries and Responsible Use
              </h2>
            </div>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <p className="font-semibold text-neutral-700">
                YieldPulse provides analytical tools only.
              </p>
              <p className="font-medium text-neutral-700">
                The platform does not:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Provide financial, legal, or tax advice</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Recommend specific properties or transactions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Guarantee investment outcomes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Replace professional due diligence</span>
                </li>
              </ul>
              <p>
                Users remain responsible for their own decisions and are encouraged to seek independent professional advice where appropriate.
              </p>
            </div>
          </div>

          {/* Corporate Information */}
          <div className="mb-12 bg-white rounded-lg shadow-sm border border-neutral-200 p-8">
            <div className="flex items-start gap-4 mb-6">
              <Building2 className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <h2 className="text-2xl font-bold text-neutral-900">
                Corporate Details
              </h2>
            </div>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <p>
                YieldPulse is operated by Constructive FZE LLC, a UAE registered company.
              </p>
              <p>
                The platform is developed and maintained in accordance with applicable UAE regulations and free zone requirements.
              </p>
              <p>
                Full legal and regulatory information is available in the Legal section of this website.
              </p>
            </div>
          </div>

          {/* Footer Disclaimer */}
          <div className="text-center pt-8 border-t border-neutral-200">
            <p className="text-xs text-neutral-500 leading-relaxed">
              YieldPulse is an analytical platform only. All information provided is for informational purposes and does not constitute financial, investment, legal, or tax advice.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
