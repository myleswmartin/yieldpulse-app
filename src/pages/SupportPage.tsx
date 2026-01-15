import { useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Link } from 'react-router-dom';
import { 
  HelpCircle, 
  BookOpen, 
  FileText, 
  Award, 
  ChevronDown, 
  ChevronUp,
  Mail 
} from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
}

export default function SupportPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqs: FAQ[] = [
    {
      question: "What does the free analysis include?",
      answer: "The free analysis shows headline metrics such as gross yield, net yield, cash flow, and initial investment. It does not include projections, exit values, sensitivity analysis, or downloadable reports."
    },
    {
      question: "What do I get when I unlock a Premium Report?",
      answer: "You receive a full investor grade report that expands on your analysis with detailed projections, risk analysis, and a downloadable PDF that reflects exactly what you see on screen."
    },
    {
      question: "Is the sample Premium Report real data?",
      answer: "No. The sample Premium Report uses example data for demonstration purposes only. It exists to show the structure, depth, and format of the report you receive after purchase."
    },
    {
      question: "Can I download my Premium Report as a PDF?",
      answer: "Yes. All Premium Reports include the ability to download a professional PDF version of the report for your records."
    },
    {
      question: "Can I edit or rerun a report after purchase?",
      answer: "Each Premium Report reflects the inputs used at the time of purchase. If you want to analyse a different scenario, you should run a new analysis."
    },
    {
      question: "Are the calculations accurate?",
      answer: "YieldPulse uses standard real estate investment formulas. All calculations are shown transparently within the Premium Report so users can independently verify results."
    },
    {
      question: "Does YieldPulse provide financial advice?",
      answer: "No. YieldPulse provides data driven analysis tools for informational purposes only. It does not provide financial, legal, or investment advice."
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          {/* Page Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-neutral-900 mb-4">
              Support & Help
            </h1>
            <p className="text-lg text-neutral-600 leading-relaxed">
              This page provides answers to common questions about using YieldPulse, understanding your reports, and accessing Premium features.
            </p>
            <p className="text-lg text-neutral-600 leading-relaxed mt-2">
              If you cannot find what you are looking for, you can contact our support team directly.
            </p>
          </div>

          {/* Quick Help Sections */}
          <div className="space-y-6 mb-12">
            {/* Getting Started */}
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8">
              <div className="flex items-start gap-3">
                <BookOpen className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-neutral-900 mb-3">
                    Getting Started
                  </h2>
                  <p className="text-neutral-600 leading-relaxed mb-3">
                    YieldPulse allows you to analyse residential property investments in the UAE using clear, transparent calculations.
                  </p>
                  <p className="text-neutral-600 leading-relaxed">
                    You start by entering your property details into the calculator. Once submitted, you will see a free results snapshot showing headline metrics such as yield and cash flow. You can then choose to unlock a Premium Report for a full investor grade analysis.
                  </p>
                </div>
              </div>
            </div>

            {/* Free vs Premium Reports */}
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8">
              <div className="flex items-start gap-3">
                <FileText className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-neutral-900 mb-3">
                    Free vs Premium Reports
                  </h2>
                  <p className="text-neutral-600 leading-relaxed mb-3">
                    The free results page provides a limited snapshot of your investment. It is designed to help you quickly assess whether a property is worth deeper analysis.
                  </p>
                  <p className="text-neutral-600 leading-relaxed mb-3">
                    The Premium Report provides a complete, professionally structured investment analysis, including multi year projections, exit scenarios, sensitivity testing, and a downloadable PDF.
                  </p>
                  <p className="text-neutral-600 leading-relaxed">
                    Free and Premium reports are intentionally separate. The Premium Report does not repeat the free results page.
                  </p>
                </div>
              </div>
            </div>

            {/* Premium Reports */}
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8">
              <div className="flex items-start gap-3">
                <Award className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-neutral-900 mb-3">
                    Premium Reports
                  </h2>
                  <p className="text-neutral-600 leading-relaxed mb-3">
                    When you unlock a Premium Report, the report is generated using your exact inputs and current assumptions.
                  </p>
                  <p className="text-neutral-600 font-medium mb-2">
                    Premium Reports include:
                  </p>
                  <ul className="space-y-2 text-neutral-600 mb-3">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>A five year financial projection</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Equity and loan balance tracking</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Cash flow analysis over time</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Exit scenario and total return calculation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Sensitivity analysis for rent, vacancy, and interest rates</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Full calculation transparency</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Downloadable investor grade PDF</span>
                    </li>
                  </ul>
                  <p className="text-neutral-600 leading-relaxed">
                    Each Premium Report is generated individually and linked to your account.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Frequently Asked Questions */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <HelpCircle className="w-7 h-7 text-primary" />
              <h2 className="text-2xl font-bold text-neutral-900">
                Frequently Asked Questions
              </h2>
            </div>
            
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors cursor-pointer"
                  >
                    <span className="font-semibold text-neutral-900 pr-4">
                      {faq.question}
                    </span>
                    {openFAQ === index ? (
                      <ChevronUp className="w-5 h-5 text-neutral-600 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-neutral-600 flex-shrink-0" />
                    )}
                  </button>
                  
                  {openFAQ === index && (
                    <div className="px-6 pb-4 pt-0">
                      <p className="text-neutral-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Still Need Help Section */}
          <div className="bg-primary/5 rounded-lg border border-primary/20 p-8 mb-12">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-neutral-900 mb-3">
                Still Need Help?
              </h2>
              <p className="text-neutral-600 leading-relaxed mb-6 max-w-2xl mx-auto">
                If your question is specific to your property, report, or account, our support team is happy to help.
              </p>
              <p className="text-neutral-600 leading-relaxed mb-6 max-w-2xl mx-auto">
                Please use the Contact page to send us your enquiry and include as much detail as possible so we can assist you efficiently.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                <Mail className="w-5 h-5" />
                Contact Support
              </Link>
            </div>
          </div>

          {/* Important Notice */}
          <div className="text-center">
            <p className="text-xs text-neutral-500">
              YieldPulse provides analytical tools only. Users remain responsible for their own investment decisions and should seek professional advice where appropriate.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
