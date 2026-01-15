import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { AlertTriangle } from 'lucide-react';

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          {/* Page Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              <h1 className="text-4xl font-bold text-neutral-900">
                Disclaimer
              </h1>
            </div>
            <p className="text-sm text-neutral-600">
              Effective Date: 09 January 2026
            </p>
            <p className="text-sm text-neutral-600 mt-1">
              Last Updated: 09 January 2026
            </p>
          </div>

          {/* Critical Warning */}
          <section className="mb-10">
            <div className="bg-red-50 border-2 border-red-300 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-red-900 mb-4 flex items-center gap-3">
                <AlertTriangle className="w-7 h-7" />
                CRITICAL DISCLAIMER - READ CAREFULLY
              </h2>
              <div className="space-y-4 text-red-900 font-medium leading-relaxed text-lg">
                <p>
                  YieldPulse is a computational analysis tool ONLY. It is NOT a source of financial advice, investment recommendations, or professional guidance of any kind.
                </p>
                <p>
                  ALL information, calculations, projections, and outputs provided through this platform are for INFORMATIONAL and EDUCATIONAL purposes only. Nothing on YieldPulse constitutes professional advice or a recommendation to buy, sell, hold, or invest in any property or financial instrument.
                </p>
                <p>
                  By using YieldPulse, you acknowledge and accept FULL RESPONSIBILITY for all investment decisions and their outcomes. YieldPulse and its operators bear NO LIABILITY for financial losses, investment outcomes, or consequences of any kind.
                </p>
              </div>
            </div>
          </section>

          {/* Section 1 - Nature of Service */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              1. Nature of Service
            </h2>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <p className="font-medium text-neutral-700">
                1.1 Analytical Tool, Not Professional Advice
              </p>
              <p>
                YieldPulse is a software platform that performs mathematical calculations based on user-provided inputs using standard real estate investment formulas. The platform:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Calculates metrics such as gross yield, net yield, cash-on-cash return, and cash flow projections</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Generates 5-year financial projections based on disclosed assumptions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Performs sensitivity analysis for vacancy, rental changes, and interest rate variations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Models exit strategies and potential sale scenarios</span>
                </li>
              </ul>
              <p className="mt-4">
                These outputs are computational results only. They do NOT constitute advice, recommendations, predictions, or professional opinions.
              </p>

              <p className="font-medium text-neutral-700 mt-6">
                1.2 Not Licensed Professional Services
              </p>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <p className="font-medium text-yellow-900 mb-3">
                  YieldPulse is NOT and does NOT claim to be:
                </p>
                <ul className="space-y-2 ml-6 text-yellow-800">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 mt-1.5">•</span>
                    <span>A licensed financial advisor, investment advisor, or wealth management service</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 mt-1.5">•</span>
                    <span>A registered broker-dealer, securities firm, or investment company</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 mt-1.5">•</span>
                    <span>A real estate brokerage, agency, or property consultancy</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 mt-1.5">•</span>
                    <span>A legal firm, law practice, or provider of legal counsel</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 mt-1.5">•</span>
                    <span>An accounting firm, tax advisor, or certified public accountant</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 mt-1.5">•</span>
                    <span>A mortgage broker, lender, or financing institution</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 mt-1.5">•</span>
                    <span>A property valuation, appraisal, or inspection service</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 2 - No Financial or Investment Advice */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              2. No Financial or Investment Advice
            </h2>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <p className="font-medium text-neutral-700">
                2.1 Platform Outputs Are Not Recommendations
              </p>
              <p>
                YieldPulse does NOT provide, suggest, or imply:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span><strong>Investment Recommendations:</strong> Whether you should buy, sell, hold, or avoid any property or investment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span><strong>Property Endorsements:</strong> That any property, location, developer, or project is suitable or advisable</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span><strong>Financial Strategy:</strong> How to structure your finances, portfolio, or investment approach</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span><strong>Market Predictions:</strong> Future property values, rental rates, or market conditions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span><strong>Risk Assessment:</strong> Whether an investment is appropriate for your risk tolerance or financial situation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span><strong>Suitability Analysis:</strong> Whether an investment aligns with your goals, circumstances, or needs</span>
                </li>
              </ul>

              <p className="font-medium text-neutral-700 mt-6">
                2.2 No Professional Relationship
              </p>
              <p>
                Use of YieldPulse does NOT create:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>An advisor-client relationship</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>A fiduciary duty or obligation to act in your best interest</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>A professional services engagement or consultancy agreement</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Any obligation to monitor your investments or provide ongoing guidance</span>
                </li>
              </ul>

              <p className="font-medium text-neutral-700 mt-6">
                2.3 Requirement for Professional Advice
              </p>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="font-medium text-blue-900 mb-2">
                  MANDATORY PROFESSIONAL CONSULTATION
                </p>
                <p className="text-blue-800">
                  Before making ANY investment decision, you MUST consult with qualified, licensed professionals, including:
                </p>
                <ul className="space-y-2 ml-6 mt-3 text-blue-800">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1.5">•</span>
                    <span><strong>Financial Advisors:</strong> For personalized investment strategy and portfolio guidance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1.5">•</span>
                    <span><strong>Legal Counsel:</strong> For contract review, regulatory compliance, and legal implications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1.5">•</span>
                    <span><strong>Tax Advisors:</strong> For tax consequences, deductions, and compliance requirements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1.5">•</span>
                    <span><strong>Real Estate Professionals:</strong> For market analysis, property evaluation, and transaction guidance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1.5">•</span>
                    <span><strong>Mortgage Specialists:</strong> For financing options, terms, and qualification</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3 - Limitations and Assumptions */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              3. Limitations and Assumptions
            </h2>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <p className="font-medium text-neutral-700">
                3.1 Reliance on User-Provided Data
              </p>
              <p>
                All calculations depend entirely on the accuracy and completeness of information YOU provide. YieldPulse:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Does NOT verify property prices, rental rates, or any data you enter</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Does NOT validate developer claims, marketing materials, or property details</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Does NOT confirm market conditions, comparable sales, or rental demand</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Does NOT assess property condition, legal status, or title clarity</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Assumes all inputs are accurate, current, and relevant (which may not be the case)</span>
                </li>
              </ul>
              <p className="mt-4 font-medium text-neutral-700">
                If you enter inaccurate data, outputs will be meaningless. Garbage in, garbage out.
              </p>

              <p className="font-medium text-neutral-700 mt-6">
                3.2 Simplified Assumptions and Methodologies
              </p>
              <p>
                YieldPulse uses standardized formulas and assumptions that:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>May not account for all real-world complexities and variables</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Assume linear growth rates that rarely occur in actual markets</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Do not account for market cycles, economic shocks, or regulatory changes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Ignore factors like tenant quality, property management issues, or unexpected expenses</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Cannot predict black swan events, market crashes, or unprecedented conditions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Represent mathematical models, not real-world certainties</span>
                </li>
              </ul>

              <p className="font-medium text-neutral-700 mt-6">
                3.3 Geographic and Regulatory Limitations
              </p>
              <p>
                YieldPulse calculations:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Are primarily designed for UAE property market dynamics but can be used elsewhere</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Do NOT automatically account for jurisdiction-specific laws, taxes, or regulations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>May not reflect unique regional factors (rent controls, transfer fees, permit requirements)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Cannot adapt to changing laws or regulatory environments</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 4 - No Guarantees or Warranties */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              4. No Guarantees or Warranties
            </h2>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <p className="font-medium text-neutral-700">
                4.1 Hypothetical Projections Only
              </p>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <p className="font-medium text-red-900 mb-3">
                  ALL PROJECTIONS ARE HYPOTHETICAL AND BASED ON ASSUMPTIONS THAT MAY NOT OCCUR
                </p>
                <ul className="space-y-2 ml-6 text-red-800">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1.5">•</span>
                    <span>Future property values are UNKNOWN and UNPREDICTABLE</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1.5">•</span>
                    <span>Rental income may NEVER materialize or may be LOWER than projected</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1.5">•</span>
                    <span>Vacancies may be LONGER and more FREQUENT than modeled</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1.5">•</span>
                    <span>Expenses may be HIGHER and growth may be SLOWER or NEGATIVE</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1.5">•</span>
                    <span>Markets can and DO decline, sometimes significantly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1.5">•</span>
                    <span>Properties can LOSE VALUE and may become UNSELLABLE</span>
                  </li>
                </ul>
              </div>

              <p className="font-medium text-neutral-700 mt-6">
                4.2 Past Performance and Historical Data
              </p>
              <p>
                Any references to past performance, historical trends, or market data:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Are NOT indicative of future results</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Do NOT guarantee similar outcomes will occur</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>May not be representative of current or future market conditions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Cannot account for unprecedented events or structural market changes</span>
                </li>
              </ul>

              <p className="font-medium text-neutral-700 mt-6">
                4.3 No Warranty of Accuracy
              </p>
              <p>
                YieldPulse makes NO warranties regarding:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Accuracy, reliability, or completeness of calculations or outputs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Suitability of methodologies for your specific situation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Absence of errors, bugs, or computational mistakes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Correctness of formulas or algorithms used</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Fitness for any particular purpose or use case</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 5 - Investment Risks */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              5. Investment Risks
            </h2>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <p className="font-medium text-neutral-700">
                5.1 Real Estate Investment Carries Substantial Risk
              </p>
              <p>
                Property investment involves significant financial risk, including but not limited to:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span><strong>Market Risk:</strong> Property values can decline, sometimes dramatically and for extended periods</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span><strong>Liquidity Risk:</strong> Properties can be difficult or impossible to sell quickly; you may be unable to exit when needed</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span><strong>Vacancy Risk:</strong> Properties may remain vacant for extended periods, generating no income while expenses continue</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span><strong>Tenant Risk:</strong> Tenants may default, damage property, or require legal eviction processes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span><strong>Maintenance Risk:</strong> Unexpected repairs and major capital expenditures can exceed projections</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span><strong>Financing Risk:</strong> Interest rates can increase, refinancing may be unavailable, and loan terms can change</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span><strong>Regulatory Risk:</strong> Laws, taxes, rent controls, and zoning can change unfavorably</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span><strong>Economic Risk:</strong> Recessions, unemployment, and economic downturns affect property markets</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span><strong>Developer Risk:</strong> Projects may be delayed, cancelled, or not delivered as promised</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span><strong>Legal Risk:</strong> Title issues, disputes, encumbrances, and litigation can arise</span>
                </li>
              </ul>

              <p className="font-medium text-neutral-700 mt-6">
                5.2 Possibility of Total Loss
              </p>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <p className="text-red-900 font-medium">
                  You may lose SOME or ALL of your invested capital. Real estate investments can result in:
                </p>
                <ul className="space-y-2 ml-6 mt-3 text-red-800">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1.5">•</span>
                    <span>Negative cash flow requiring ongoing capital contributions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1.5">•</span>
                    <span>Property values below purchase price (being "underwater")</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1.5">•</span>
                    <span>Foreclosure and loss of the entire investment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1.5">•</span>
                    <span>Bankruptcy and personal financial ruin</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 6 - User Responsibility */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              6. User Responsibility and Due Diligence
            </h2>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <p className="font-medium text-neutral-700">
                6.1 You Are Solely Responsible
              </p>
              <p>
                By using YieldPulse, you acknowledge and accept that:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>YOU are solely responsible for all investment decisions and their consequences</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>YOU must conduct comprehensive independent due diligence</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>YOU must verify all data, assumptions, and calculations independently</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>YOU must seek professional advice from qualified licensed advisors</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>YOU accept all risks associated with property investment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>YOU cannot hold YieldPulse liable for investment outcomes</span>
                </li>
              </ul>

              <p className="font-medium text-neutral-700 mt-6">
                6.2 Required Due Diligence
              </p>
              <p>
                Before making any investment decision, you MUST:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Conduct physical property inspections and assessments</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Verify all property details, ownership, and legal status</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Research market conditions, comparable sales, and rental demand</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Review all contracts, agreements, and legal documents with counsel</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Obtain professional appraisals and valuations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Investigate developer track records and project viability</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Understand all fees, taxes, and ongoing costs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Assess your own financial capacity and risk tolerance</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 7 - No Liability */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              7. No Liability
            </h2>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <div className="bg-red-50 p-6 rounded-lg border-2 border-red-300">
                <p className="font-bold text-red-900 mb-4 text-lg">
                  TO THE FULLEST EXTENT PERMITTED BY LAW:
                </p>
                <ul className="space-y-3 text-red-800">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1.5">•</span>
                    <span>YieldPulse and its owners, operators, employees, affiliates, and service providers SHALL NOT BE LIABLE for any losses, damages, costs, or expenses arising from your use of the Platform or reliance on its outputs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1.5">•</span>
                    <span>This includes but is not limited to: financial losses, investment losses, lost profits, opportunity costs, consequential damages, indirect damages, or any other economic harm</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1.5">•</span>
                    <span>We bear NO responsibility for investment outcomes, property performance, market movements, or financial results of any kind</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1.5">•</span>
                    <span>We are NOT liable for errors, omissions, inaccuracies, or computational mistakes in Platform outputs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1.5">•</span>
                    <span>Your sole remedy for dissatisfaction is to stop using the Platform</span>
                  </li>
                </ul>
                <p className="mt-4 text-red-900 font-medium">
                  BY USING YIELDPULSE, YOU EXPRESSLY WAIVE ANY CLAIMS AGAINST US FOR INVESTMENT LOSSES OR FINANCIAL DAMAGES.
                </p>
              </div>
            </div>
          </section>

          {/* Section 8 - Changes to Platform */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              8. Changes to Platform and Calculations
            </h2>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <p>
                YieldPulse reserves the right to:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Modify calculation methodologies, formulas, or assumptions at any time</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Change, suspend, or discontinue features or functionality</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Update or correct errors without prior notice</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Alter pricing or terms of service</span>
                </li>
              </ul>
              <p className="mt-4">
                Historical reports and calculations may differ from current methodologies. We are not responsible for maintaining consistency across versions.
              </p>
            </div>
          </section>

          {/* Section 9 - Third-Party Information */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              9. Third-Party Information and Links
            </h2>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <p>
                Any third-party information, data, websites, or resources referenced through YieldPulse:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Are provided for convenience only and do NOT constitute endorsements</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Are NOT verified, validated, or guaranteed by YieldPulse</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>May be inaccurate, outdated, or unreliable</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Are used at your own risk</span>
                </li>
              </ul>
              <p className="mt-4">
                We are not responsible for the content, accuracy, or reliability of third-party sources.
              </p>
            </div>
          </section>

          {/* Section 10 - Updates to Disclaimer */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              10. Updates to This Disclaimer
            </h2>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <p>
                This Disclaimer may be updated at any time. The "Effective Date" and "Last Updated" dates at the top of this page reflect the current version. Continued use of YieldPulse after updates constitutes acceptance of the revised Disclaimer.
              </p>
              <p>
                It is your responsibility to review this Disclaimer periodically.
              </p>
            </div>
          </section>

          {/* Final Acknowledgment */}
          <section className="mb-10">
            <div className="bg-neutral-900 text-white p-8 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">
                FINAL ACKNOWLEDGMENT
              </h2>
              <div className="space-y-4 leading-relaxed">
                <p className="font-medium">
                  BY USING YIELDPULSE, YOU EXPRESSLY ACKNOWLEDGE AND AGREE THAT:
                </p>
                <ul className="space-y-3 ml-6">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    <span>You have read, understood, and accept this Disclaimer in its entirety</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    <span>YieldPulse provides analytical tools ONLY and does NOT provide professional advice</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    <span>All investment decisions are YOUR sole responsibility</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    <span>You accept ALL risks associated with property investment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    <span>You will seek professional advice before making investment decisions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    <span>YieldPulse bears NO liability for your financial outcomes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    <span>You may lose SOME or ALL of your invested capital</span>
                  </li>
                </ul>
                <p className="mt-6 font-bold text-lg">
                  IF YOU DO NOT ACCEPT THIS DISCLAIMER, YOU MUST IMMEDIATELY CEASE USING YIELDPULSE.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
