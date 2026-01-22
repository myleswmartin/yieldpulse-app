import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { FileText } from 'lucide-react';
import { usePublicPricing } from '../utils/usePublicPricing';

export default function TermsOfServicePage() {
  const { priceLabel } = usePublicPricing();
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
          {/* Page Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-8 h-8 text-primary" />
              <h1 className="text-4xl font-bold text-neutral-900">
                Terms of Service
              </h1>
            </div>
            <p className="text-sm text-neutral-600">
              Effective Date: 09 January 2026
            </p>
            <p className="text-sm text-neutral-600 mt-1">
              Last Updated: 09 January 2026
            </p>
          </div>

          {/* Section 1 - Introduction and Acceptance */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              1. Introduction and Acceptance
            </h2>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <p>
                These Terms of Service ("Terms", "Agreement") constitute a legally binding contract between you ("User", "you", "your") and YieldPulse ("we", "us", "our", "Platform", "Service") governing your access to and use of the YieldPulse platform, website, applications, and all associated services.
              </p>
              <p>
                By accessing, browsing, registering for, or using YieldPulse in any capacity, you expressly acknowledge that you have read, understood, and agree to be bound by these Terms in their entirety, including our Privacy Policy and Disclaimer, which are incorporated herein by reference.
              </p>
              <p className="font-medium text-neutral-700">
                IF YOU DO NOT AGREE TO THESE TERMS, YOU MUST IMMEDIATELY CEASE ALL USE OF THE PLATFORM AND MAY NOT CREATE AN ACCOUNT OR ACCESS ANY SERVICES.
              </p>
              <p>
                These Terms apply to all users, including but not limited to free users, premium report purchasers, registered users, and visitors.
              </p>
            </div>
          </section>

          {/* Section 2 - Definitions */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              2. Definitions
            </h2>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <p>For purposes of these Terms:</p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <div>
                    <strong>"Platform"</strong> refers to the YieldPulse website, web application, tools, calculators, and all associated services
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <div>
                    <strong>"User", "you"</strong> refers to any individual or entity accessing or using the Platform
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <div>
                    <strong>"Free Analysis"</strong> refers to the complimentary property investment analysis tools available without payment
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <div>
                    <strong>"Premium Report"</strong> refers to enhanced analytical reports available for purchase at {priceLabel} per report
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <div>
                    <strong>"Content"</strong> refers to all text, data, calculations, graphics, reports, software, and materials provided through the Platform
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <div>
                    <strong>"User Data"</strong> refers to information, inputs, and property data you provide to the Platform
                  </div>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 3 - Nature of Service */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              3. Nature of Service and Platform Scope
            </h2>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <p className="font-medium text-neutral-700">
                3.1 Analytical Tool Only
              </p>
              <p>
                YieldPulse is a property investment analysis platform that provides computational tools, financial modeling, and scenario analysis based exclusively on user-provided inputs and explicitly disclosed assumptions.
              </p>
              
              <p className="font-medium text-neutral-700 mt-6">
                3.2 What We Provide
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Mathematical calculations using standard real estate investment methodologies (gross yield, net yield, cash-on-cash return, cash flow projections)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>5-year financial projections with customizable growth assumptions (Premium Reports only)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Sensitivity analysis for vacancy periods, rental changes, and interest rate variations (Premium Reports only)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Exit strategy calculations and total return scenarios (Premium Reports only)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Transparent disclosure of all formulas, assumptions, and calculation methodologies</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Property comparison tools to evaluate multiple investment opportunities</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>PDF report generation for documentation and sharing purposes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Secure storage of saved analyses in your user dashboard</span>
                </li>
              </ul>

              <p className="font-medium text-neutral-700 mt-6">
                3.3 What We Do NOT Provide
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span><strong>Financial Advice:</strong> We do not provide personalized investment recommendations, financial planning, or advisory services</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span><strong>Investment Recommendations:</strong> We do not recommend, endorse, or suggest any specific properties, developers, locations, or investment opportunities</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span><strong>Legal or Tax Advice:</strong> We do not provide legal counsel, tax guidance, regulatory compliance advice, or professional services</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span><strong>Market Predictions:</strong> We do not forecast future market conditions, property values, or rental rates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span><strong>Property Verification:</strong> We do not verify property data, validate developer claims, or confirm accuracy of information you provide</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span><strong>Due Diligence Services:</strong> We do not conduct property inspections, title searches, or background checks</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span><strong>Guarantees or Warranties:</strong> We make no guarantees regarding investment outcomes, returns, or financial results</span>
                </li>
              </ul>

              <p className="font-medium text-red-600 mt-6 bg-red-50 p-4 rounded-lg border border-red-200">
                CRITICAL: YieldPulse outputs are computational results only. They are NOT recommendations, predictions, or professional advice. All investment decisions are solely your responsibility.
              </p>
            </div>
          </section>

          {/* Section 4 - User Eligibility and Account Registration */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              4. User Eligibility and Account Registration
            </h2>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <p className="font-medium text-neutral-700">
                4.1 Eligibility Requirements
              </p>
              <p>
                To use YieldPulse, you must:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Be at least 18 years of age</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Have the legal capacity to enter into binding contracts under applicable law</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Not be prohibited from using the Platform under UAE law or any other applicable jurisdiction</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Comply with all applicable laws and regulations in your jurisdiction</span>
                </li>
              </ul>

              <p className="font-medium text-neutral-700 mt-6">
                4.2 Account Creation and Security
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>You must provide accurate, current, and complete information during registration</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>You must maintain and promptly update your account information to keep it accurate</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>You are responsible for maintaining the confidentiality of your password and account credentials</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>You are solely responsible for all activities that occur under your account</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>You must immediately notify us of any unauthorized access or security breaches</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Accounts are for individual use only and may not be shared, transferred, or sold</span>
                </li>
              </ul>

              <p className="font-medium text-neutral-700 mt-6">
                4.3 Account Termination
              </p>
              <p>
                We reserve the right to suspend or terminate your account at our sole discretion if you violate these Terms, engage in fraudulent activity, abuse the Platform, or for any other reason we deem necessary to protect the Platform or other users.
              </p>
            </div>
          </section>

          {/* Section 5 - User Responsibilities and Prohibited Conduct */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              5. User Responsibilities and Prohibited Conduct
            </h2>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <p className="font-medium text-neutral-700">
                5.1 User Responsibilities
              </p>
              <p>
                You are solely responsible for:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span><strong>Accuracy of Inputs:</strong> All property data, financial figures, and assumptions you enter into the Platform</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span><strong>Interpretation of Outputs:</strong> How you interpret, understand, and use the analytical results and reports generated</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span><strong>Independent Verification:</strong> Verifying all data, conducting due diligence, and validating assumptions independently</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span><strong>Professional Advice:</strong> Seeking qualified financial, legal, tax, and real estate professional advice before making investment decisions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span><strong>Investment Decisions:</strong> All investment decisions, outcomes, and financial consequences resulting from your use of the Platform</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span><strong>Regulatory Compliance:</strong> Compliance with all applicable laws, regulations, and licensing requirements in your jurisdiction</span>
                </li>
              </ul>

              <p className="font-medium text-neutral-700 mt-6">
                5.2 Prohibited Conduct
              </p>
              <p>
                You agree NOT to:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Use the Platform for any unlawful, fraudulent, or unauthorized purpose</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Violate any applicable laws, regulations, or third-party rights</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Reverse engineer, decompile, disassemble, or attempt to derive source code from the Platform</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Copy, reproduce, distribute, modify, or create derivative works of Platform content without authorization</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Scrape, crawl, or use automated tools to extract data from the Platform</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Interfere with or disrupt Platform functionality, servers, or networks</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Attempt to gain unauthorized access to any systems, accounts, or data</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Upload viruses, malware, or any malicious code</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Impersonate any person or entity or misrepresent your affiliation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Resell, sublicense, or commercially exploit Platform access without permission</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Use the Platform to provide services to third parties without authorization</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Misrepresent Platform outputs as professional advice or guaranteed predictions</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 6 - Payments, Pricing, and Refund Policy */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              6. Payments, Pricing, and Refund Policy
            </h2>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <p className="font-medium text-neutral-700">
                6.1 Pricing Structure
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span><strong>Free Analysis:</strong> Available at no cost with unlimited use</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span><strong>Premium Reports:</strong> {priceLabel} per report, one-time payment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Pricing is subject to change with prior notice to users</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>All prices are in UAE Dirhams (AED) and include applicable taxes</span>
                </li>
              </ul>

              <p className="font-medium text-neutral-700 mt-6">
                6.2 Payment Processing
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Payments are processed securely through Stripe, a third-party payment processor</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>You must provide valid payment information to purchase Premium Reports</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Payment is required in full before report generation and delivery</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>You authorize us to charge your payment method for all purchases</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Receipt and confirmation will be sent to your registered email address</span>
                </li>
              </ul>

              <p className="font-medium text-neutral-700 mt-6">
                6.3 Refund Policy
              </p>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <p className="font-medium text-red-900">
                  ALL PREMIUM REPORT PURCHASES ARE FINAL AND NON-REFUNDABLE.
                </p>
                <ul className="space-y-2 ml-6 mt-3 text-red-800">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1.5">•</span>
                    <span>Once a Premium Report is generated and delivered, no refunds will be issued under any circumstances</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1.5">•</span>
                    <span>Refunds will not be provided for user input errors, dissatisfaction with results, or changed circumstances</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1.5">•</span>
                    <span>Users are responsible for verifying inputs before purchase</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1.5">•</span>
                    <span>Free Analysis tools are available for preview before purchasing Premium Reports</span>
                  </li>
                </ul>
              </div>

              <p className="font-medium text-neutral-700 mt-6">
                6.4 Report Access and Lifetime Availability
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Purchased Premium Reports remain accessible in your dashboard indefinitely</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>PDF downloads are available at any time from your account</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Access continues even if you do not purchase additional reports</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>No recurring fees or subscription charges apply</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 7 - Intellectual Property Rights */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              7. Intellectual Property Rights
            </h2>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <p className="font-medium text-neutral-700">
                7.1 Platform Ownership
              </p>
              <p>
                All content, features, functionality, software, code, design, graphics, trademarks, logos, and materials on the Platform are owned by YieldPulse or its licensors and are protected by international copyright, trademark, patent, and other intellectual property laws.
              </p>

              <p className="font-medium text-neutral-700 mt-6">
                7.2 License Grant to Users
              </p>
              <p>
                Subject to your compliance with these Terms, we grant you a limited, non-exclusive, non-transferable, revocable license to:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Access and use the Platform for lawful personal or business analytical purposes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Download and retain PDF reports you have purchased for your records</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Share purchased reports with authorized parties (financial advisors, lenders, partners) in connection with your legitimate business activities</span>
                </li>
              </ul>

              <p className="font-medium text-neutral-700 mt-6">
                7.3 Restrictions
              </p>
              <p>
                You may NOT:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Modify, copy, reproduce, or create derivative works from Platform content</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Remove copyright notices, watermarks, or proprietary markings</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Use Platform content for commercial purposes without authorization</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Publicly distribute, publish, or broadcast Platform materials</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Use YieldPulse trademarks or branding without written permission</span>
                </li>
              </ul>

              <p className="font-medium text-neutral-700 mt-6">
                7.4 User Data Ownership
              </p>
              <p>
                You retain ownership of all property data and inputs you provide to the Platform. By using the Platform, you grant us a limited license to use your data solely to provide services, generate reports, and improve the Platform as described in our Privacy Policy.
              </p>
            </div>
          </section>

          {/* Section 8 - Disclaimers and Limitations */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              8. Disclaimers and Limitations
            </h2>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <p className="font-medium text-neutral-700">
                8.1 No Professional Advice
              </p>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <p className="font-medium text-yellow-900">
                  YIELDPULSE IS NOT A LICENSED FINANCIAL ADVISOR, INVESTMENT ADVISOR, BROKER, LEGAL FIRM, OR TAX CONSULTANT.
                </p>
                <p className="mt-3 text-yellow-800">
                  Nothing on this Platform constitutes financial, investment, legal, tax, accounting, or professional advice. All outputs are computational results for informational purposes only. You must consult qualified professionals before making investment decisions.
                </p>
              </div>

              <p className="font-medium text-neutral-700 mt-6">
                8.2 No Guarantees or Warranties
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>We make NO guarantees regarding investment outcomes, returns, rental income, property values, or financial results</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>All projections are hypothetical and based on assumptions that may not reflect actual conditions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Past performance and projections are NOT indicative of future results</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Actual results may vary significantly from Platform outputs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Market conditions, regulations, and economic factors can change without notice</span>
                </li>
              </ul>

              <p className="font-medium text-neutral-700 mt-6">
                8.3 Platform Provided "AS IS"
              </p>
              <p>
                THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Warranties of merchantability, fitness for a particular purpose, or non-infringement</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Warranties regarding accuracy, reliability, completeness, or timeliness of content</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Warranties that the Platform will be uninterrupted, secure, or error-free</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Warranties that defects will be corrected or that results will be accurate</span>
                </li>
              </ul>

              <p className="font-medium text-neutral-700 mt-6">
                8.4 Assumptions and Limitations
              </p>
              <p>
                All calculations are based on:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>User-provided inputs that we do not verify or validate</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Standardized formulas and assumptions that may not suit every situation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Simplifications that may not account for all real-world factors</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Market conditions at the time of calculation that can change rapidly</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 9 - Limitation of Liability */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              9. Limitation of Liability
            </h2>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                <p className="font-medium text-red-900 mb-4">
                  TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW:
                </p>
                <ul className="space-y-3 text-red-800">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1.5">•</span>
                    <span>YIELDPULSE, ITS OWNERS, OPERATORS, EMPLOYEES, AFFILIATES, LICENSORS, AND SERVICE PROVIDERS SHALL NOT BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE PLATFORM</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1.5">•</span>
                    <span>THIS INCLUDES BUT IS NOT LIMITED TO: FINANCIAL LOSSES, INVESTMENT LOSSES, LOST PROFITS, LOSS OF DATA, BUSINESS INTERRUPTION, OR ANY OTHER COMMERCIAL DAMAGES OR LOSSES</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1.5">•</span>
                    <span>WE ARE NOT LIABLE FOR DAMAGES RESULTING FROM: USE OR INABILITY TO USE THE PLATFORM, RELIANCE ON CONTENT OR OUTPUTS, ERRORS OR OMISSIONS IN CALCULATIONS, UNAUTHORIZED ACCESS, THIRD-PARTY CONDUCT, OR ANY OTHER MATTER RELATING TO THE PLATFORM</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1.5">•</span>
                    <span>IN NO EVENT SHALL OUR TOTAL LIABILITY EXCEED THE AMOUNT YOU PAID TO US IN THE 12 MONTHS PRECEDING THE CLAIM, OR {priceLabel} (THE COST OF ONE PREMIUM REPORT), WHICHEVER IS GREATER</span>
                  </li>
                </ul>
                <p className="mt-4 text-red-800">
                  THESE LIMITATIONS APPLY EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES AND REGARDLESS OF THE LEGAL THEORY (CONTRACT, TORT, NEGLIGENCE, STRICT LIABILITY, OR OTHERWISE).
                </p>
              </div>

              <p className="mt-6">
                Some jurisdictions do not allow exclusion of certain warranties or limitation of liability for consequential damages. In such jurisdictions, our liability is limited to the maximum extent permitted by law.
              </p>
            </div>
          </section>

          {/* Section 10 - Indemnification */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              10. Indemnification
            </h2>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <p>
                You agree to indemnify, defend, and hold harmless YieldPulse, its owners, operators, employees, affiliates, licensors, and service providers from and against any and all claims, liabilities, damages, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising from:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Your use or misuse of the Platform</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Your violation of these Terms</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Your violation of any law or third-party rights</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Investment decisions made based on Platform outputs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Any claim that you relied on Platform content as professional advice</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Unauthorized access to your account due to your negligence</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Your user data or content you provide</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 11 - Platform Availability and Modifications */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              11. Platform Availability and Modifications
            </h2>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <p className="font-medium text-neutral-700">
                11.1 Service Availability
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>We strive to maintain Platform availability but do not guarantee uninterrupted access</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>The Platform may be temporarily unavailable for maintenance, updates, or technical issues</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>We are not liable for any losses resulting from Platform downtime or unavailability</span>
                </li>
              </ul>

              <p className="font-medium text-neutral-700 mt-6">
                11.2 Right to Modify
              </p>
              <p>
                We reserve the right to modify, suspend, or discontinue any aspect of the Platform at any time without prior notice, including:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Features, functionality, or calculation methodologies</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Pricing or payment terms (with reasonable notice)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Content, design, or user interface</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Availability in certain jurisdictions or to certain users</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 12 - Governing Law and Dispute Resolution */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              12. Governing Law and Dispute Resolution
            </h2>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <p className="font-medium text-neutral-700">
                12.1 Governing Law
              </p>
              <p>
                These Terms and any disputes arising from or relating to the Platform shall be governed by and construed in accordance with the laws of the United Arab Emirates, without regard to conflict of law principles.
              </p>

              <p className="font-medium text-neutral-700 mt-6">
                12.2 Jurisdiction and Venue
              </p>
              <p>
                You irrevocably consent to the exclusive jurisdiction of the courts of the United Arab Emirates for any legal action or proceeding arising from these Terms or your use of the Platform.
              </p>

              <p className="font-medium text-neutral-700 mt-6">
                12.3 Dispute Resolution
              </p>
              <p>
                Before initiating formal legal proceedings, you agree to first attempt to resolve disputes through good faith negotiation by contacting us via the Contact page. If disputes cannot be resolved within 30 days, either party may pursue legal remedies.
              </p>
            </div>
          </section>

          {/* Section 13 - Severability and Waiver */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              13. Severability and Waiver
            </h2>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <p className="font-medium text-neutral-700">
                13.1 Severability
              </p>
              <p>
                If any provision of these Terms is found to be invalid, illegal, or unenforceable, the remaining provisions shall continue in full force and effect. The invalid provision shall be modified to the minimum extent necessary to make it valid and enforceable.
              </p>

              <p className="font-medium text-neutral-700 mt-6">
                13.2 Waiver
              </p>
              <p>
                Our failure to enforce any right or provision of these Terms shall not constitute a waiver of that right or provision. No waiver shall be effective unless made in writing and signed by our authorized representative.
              </p>
            </div>
          </section>

          {/* Section 14 - Entire Agreement */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              14. Entire Agreement
            </h2>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <p>
                These Terms, together with our Privacy Policy and Disclaimer, constitute the entire agreement between you and YieldPulse regarding use of the Platform and supersede all prior or contemporaneous communications, proposals, or agreements.
              </p>
            </div>
          </section>

          {/* Section 15 - Assignment */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              15. Assignment
            </h2>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <p>
                You may not assign, transfer, or delegate these Terms or your rights and obligations without our prior written consent. We may assign these Terms to any successor entity in connection with a merger, acquisition, or sale of assets without restriction.
              </p>
            </div>
          </section>

          {/* Section 16 - Updates to Terms */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              16. Updates to These Terms
            </h2>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <p>
                We reserve the right to modify these Terms at any time. When we make material changes, we will:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Update the "Effective Date" and "Last Updated" at the top of this document</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Notify you via email or prominent Platform notice</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>Provide reasonable time to review changes before they take effect</span>
                </li>
              </ul>
              <p className="mt-4">
                Your continued use of the Platform after the effective date of revised Terms constitutes your acceptance of the changes. If you do not agree to the revised Terms, you must stop using the Platform and may request account deletion.
              </p>
            </div>
          </section>

          {/* Section 17 - Contact Information */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              17. Contact Information
            </h2>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <p>
                For questions about these Terms, please contact us via the Contact page on our website.
              </p>
            </div>
          </section>

          {/* Acknowledgment */}
          <section className="mb-10">
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
              <p className="text-neutral-700 leading-relaxed font-medium">
                BY USING YIELDPULSE, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE BOUND BY THESE TERMS OF SERVICE. YOU FURTHER ACKNOWLEDGE THAT YIELDPULSE PROVIDES ANALYTICAL TOOLS ONLY AND DOES NOT PROVIDE PROFESSIONAL ADVICE. ALL INVESTMENT DECISIONS ARE YOUR SOLE RESPONSIBILITY.
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
