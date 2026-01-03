import { Header } from '../components/Header';
import { AlertTriangle } from 'lucide-react';

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 via-white to-neutral-50">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 bg-gradient-to-br from-[#1e2875] to-[#2f3aad]">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4 mb-4">
            <AlertTriangle className="w-10 h-10 text-white" />
            <h1 className="text-4xl font-bold text-white">Disclaimer</h1>
          </div>
          <p className="text-lg text-white/90">
            Important information about using YieldPulse
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-neutral max-w-none">
            
            {/* Warning Banner */}
            <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6 mb-8">
              <div className="flex items-start space-x-4">
                <AlertTriangle className="w-8 h-8 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-amber-900 mb-2">
                    Not Financial Advice
                  </h3>
                  <p className="text-amber-800 leading-relaxed">
                    YieldPulse is an informational tool only. The calculations, projections, and reports 
                    provided do not constitute financial, investment, legal, or tax advice. Always consult 
                    with qualified professionals before making investment decisions.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200 p-8 space-y-8">
              
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">General Information Only</h2>
                <p className="text-neutral-700 leading-relaxed mb-3">
                  YieldPulse provides calculations and analysis tools to help you evaluate UAE property investments. 
                  All information, calculations, and reports are for informational and educational purposes only.
                </p>
                <p className="text-neutral-700 leading-relaxed mb-3">
                  The Service:
                </p>
                <ul className="list-disc list-inside space-y-2 text-neutral-700 ml-4">
                  <li>Does not recommend specific properties or investments</li>
                  <li>Does not guarantee any particular investment outcome</li>
                  <li>Does not replace professional financial advice</li>
                  <li>Should not be your only source of information</li>
                  <li>Cannot account for all factors affecting property investments</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">No Guarantee of Accuracy</h2>
                <p className="text-neutral-700 leading-relaxed mb-3">
                  While we strive to provide accurate calculations using UAE specific formulas and current market 
                  standards, we make no guarantees about:
                </p>
                <ul className="list-disc list-inside space-y-2 text-neutral-700 ml-4">
                  <li><strong>Calculation accuracy:</strong> Results depend entirely on the data you input. 
                  Incorrect inputs produce incorrect outputs.</li>
                  <li><strong>Market conditions:</strong> Real estate markets change. Our calculations cannot 
                  predict future market movements.</li>
                  <li><strong>Fee accuracy:</strong> Government fees, service charges, and other costs may change. 
                  Verify current fees with relevant authorities.</li>
                  <li><strong>Legal compliance:</strong> Laws and regulations change. Consult legal professionals 
                  for current requirements.</li>
                  <li><strong>Tax implications:</strong> Tax laws vary and change. Consult tax professionals for 
                  your specific situation.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">Investment Risk</h2>
                <p className="text-neutral-700 leading-relaxed mb-3">
                  All property investments carry risk. You acknowledge that:
                </p>
                <ul className="list-disc list-inside space-y-2 text-neutral-700 ml-4">
                  <li>Property values can decrease as well as increase</li>
                  <li>Rental income is not guaranteed and may fluctuate</li>
                  <li>Properties may experience vacancy periods</li>
                  <li>Unexpected expenses and maintenance costs can occur</li>
                  <li>Market conditions can change unexpectedly</li>
                  <li>Financing costs and availability may change</li>
                  <li>You could lose some or all of your investment</li>
                </ul>
                <p className="text-neutral-700 leading-relaxed mt-3 font-semibold">
                  Past performance does not guarantee future results.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">Your Responsibility</h2>
                <p className="text-neutral-700 leading-relaxed mb-3">
                  You are solely responsible for:
                </p>
                <ul className="list-disc list-inside space-y-2 text-neutral-700 ml-4">
                  <li><strong>Verifying information:</strong> Check all assumptions, fees, and calculations 
                  independently before making decisions.</li>
                  <li><strong>Due diligence:</strong> Conduct thorough research on any property, market, 
                  or investment opportunity.</li>
                  <li><strong>Professional advice:</strong> Consult qualified financial advisors, lawyers, 
                  accountants, and real estate professionals.</li>
                  <li><strong>Risk assessment:</strong> Understand and assess your personal risk tolerance 
                  and financial situation.</li>
                  <li><strong>Investment decisions:</strong> Any decision to purchase, sell, or invest in 
                  property is entirely your own.</li>
                  <li><strong>Legal compliance:</strong> Ensuring compliance with all applicable laws and 
                  regulations.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">Projections and Assumptions</h2>
                <p className="text-neutral-700 leading-relaxed mb-3">
                  Our reports include projections and scenarios based on assumptions you provide. Please note:
                </p>
                <ul className="list-disc list-inside space-y-2 text-neutral-700 ml-4">
                  <li>Projections are estimates, not predictions or guarantees</li>
                  <li>Actual results will almost certainly differ from projections</li>
                  <li>Small changes in assumptions can significantly impact results</li>
                  <li>Long term projections are inherently less reliable</li>
                  <li>Sensitivity analysis shows possible scenarios, not all scenarios</li>
                  <li>Unexpected events can dramatically affect outcomes</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">UAE Market Specifics</h2>
                <p className="text-neutral-700 leading-relaxed mb-3">
                  While YieldPulse is designed for the UAE property market, you should be aware:
                </p>
                <ul className="list-disc list-inside space-y-2 text-neutral-700 ml-4">
                  <li>Regulations differ between Dubai, Abu Dhabi, and other Emirates</li>
                  <li>Freehold and leasehold rules vary by location</li>
                  <li>Government fees and policies can change</li>
                  <li>Mortgage regulations and availability differ for UAE nationals vs expats</li>
                  <li>Visa and residency rules may affect investment decisions</li>
                  <li>Local market conditions vary significantly by area and property type</li>
                </ul>
                <p className="text-neutral-700 leading-relaxed mt-3">
                  Always verify current rules and requirements with relevant authorities and legal advisors.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">No Professional Relationship</h2>
                <p className="text-neutral-700 leading-relaxed">
                  Using YieldPulse does not create any professional relationship between you and us. We are not:
                </p>
                <ul className="list-disc list-inside space-y-2 text-neutral-700 ml-4 mt-3">
                  <li>Your financial advisor</li>
                  <li>Your real estate agent</li>
                  <li>Your legal counsel</li>
                  <li>Your tax advisor</li>
                  <li>Your mortgage broker</li>
                </ul>
                <p className="text-neutral-700 leading-relaxed mt-3">
                  We have no fiduciary duty to you and provide no personalized advice.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">Third Party Information</h2>
                <p className="text-neutral-700 leading-relaxed">
                  If we reference or link to third party websites, data, or information, we do not endorse 
                  or guarantee the accuracy of that information. You use third party information at your own risk.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">Technical Limitations</h2>
                <p className="text-neutral-700 leading-relaxed mb-3">
                  The Service has limitations:
                </p>
                <ul className="list-disc list-inside space-y-2 text-neutral-700 ml-4">
                  <li>Calculations may contain bugs or errors</li>
                  <li>The Service may experience downtime or technical issues</li>
                  <li>Data may be lost due to technical problems</li>
                  <li>We cannot guarantee uninterrupted access</li>
                  <li>Browser compatibility and device limitations may affect functionality</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">Currency and Exchange Rates</h2>
                <p className="text-neutral-700 leading-relaxed">
                  All calculations are in UAE Dirhams (AED). If you use other currencies, you are responsible 
                  for conversions and understanding exchange rate risks. Currency exchange rates fluctuate and 
                  can impact investment returns.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">Updates and Changes</h2>
                <p className="text-neutral-700 leading-relaxed">
                  We may update our calculations, formulas, and features at any time. Previously generated 
                  reports reflect the methodology and assumptions at the time they were created and may not 
                  reflect current methods or market conditions.
                </p>
              </div>

              <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">Summary</h2>
                <p className="text-neutral-700 leading-relaxed mb-3 font-semibold">
                  By using YieldPulse, you acknowledge and agree that:
                </p>
                <ul className="list-disc list-inside space-y-2 text-neutral-700 ml-4">
                  <li>You understand this is an informational tool, not financial advice</li>
                  <li>You will verify all information independently</li>
                  <li>You will consult qualified professionals before investing</li>
                  <li>You accept full responsibility for your investment decisions</li>
                  <li>You understand the risks of property investment</li>
                  <li>You will not hold YieldPulse liable for investment outcomes</li>
                </ul>
                <p className="text-neutral-700 leading-relaxed mt-4 font-semibold">
                  If you do not agree with these terms, do not use the Service.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">Questions</h2>
                <p className="text-neutral-700 leading-relaxed">
                  If you have questions about this Disclaimer, contact us at:
                </p>
                <p className="text-neutral-700 leading-relaxed mt-3">
                  Email: support@yieldpulse.com<br />
                  Subject: Disclaimer Inquiry
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
