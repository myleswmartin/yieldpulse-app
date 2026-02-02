import { Link } from 'react-router-dom';
import { HelpCircle, ChevronDown, Search, Calculator, FileCheck, Mail, ArrowRight } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { FeedbackWidget } from '../components/FeedbackWidget';
import { useState, useEffect } from 'react';
import { usePublicPricing } from '../utils/usePublicPricing';

export default function FAQsPage() {
  const { priceLabel } = usePublicPricing();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchTerm, setSearchTerm] = useState('');

  // Track page view for analytics
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'page_view', {
        page_title: 'FAQs',
        page_location: window.location.href,
        page_path: '/faqs'
      });
    }
  }, []);

  const faqCategories = [
    {
      category: 'Getting Started',
      icon: '🚀',
      faqs: [
        {
          question: 'What is YieldPulse and how does it work?',
          answer: `YieldPulse is a professional UAE property investment calculator that helps you analyze potential real estate investments. Enter your property details (price, rent, down payment), and we instantly generate a comprehensive financial analysis. Our free report shows basic metrics, while our Premium Report (${priceLabel}) includes detailed ROI projections, cash flow analysis, comparison insights, and professional formatting you can share with financial advisors or partners.`
        },
        {
          question: 'Do I need to create an account to use the calculator?',
          answer: 'No! You can use our calculator and generate free reports without creating an account. However, creating a free account lets you save calculations, access your report history, compare multiple properties, and manage premium reports in one dashboard. Sign up takes less than 30 seconds.'
        },
        {
          question: 'Is YieldPulse only for Dubai properties or all UAE?',
          answer: 'YieldPulse works for properties anywhere in the UAE - Dubai, Abu Dhabi, Sharjah, Ajman, RAK, and beyond. Our calculations are based on UAE-specific costs (DLD fees, typical mortgage terms, service charges) but work for any emirate. Just adjust inputs to match your specific location.'
        },
        {
          question: 'I have zero property investment experience. Can I still use this?',
          answer: 'Absolutely! YieldPulse is designed for beginners. We explain every metric in plain English, include UAE-specific benchmarks so you know what\'s "good" or "bad," and provide a comprehensive Premium Report Guide that teaches you property investment from scratch. Start with our guide, then use the calculator to analyze your first property.'
        },
      ]
    },
    {
      category: 'Calculator & Reports',
      icon: '📊',
      faqs: [
        {
          question: 'What\'s the difference between Free and Premium Reports?',
          answer: `Free Reports show core metrics: ROI, rental yield, basic cash flow, and break-even point. Premium Reports (${priceLabel}) include: 5/10/20-year ROI projections, detailed year-by-year cash flow, comprehensive cost breakdowns, market comparison insights, visual charts, professional PDF formatting, and lifetime access. Think of free as "quick check" and premium as "investment-ready analysis."`
        },
        {
          question: 'How accurate are the calculations?',
          answer: 'Our calculations use industry-standard formulas and UAE-specific default values (4% DLD fee, typical service charges, current mortgage rates). Accuracy depends on the inputs YOU provide. Use realistic rental estimates (check Bayut/Property Finder), actual service charges from seller, and current mortgage rates from your bank. Garbage in = garbage out. Realistic inputs = highly accurate projections.'
        },
        {
          question: 'Can I edit a calculation after generating a report?',
          answer: 'Yes! If you have an account, go to your Dashboard, find the saved calculation, and click "Edit" or "Recalculate." Update any inputs and regenerate the report. Your previous premium reports remain accessible. You can also duplicate calculations to compare "what-if" scenarios (e.g., different down payments).'
        },
        {
          question: 'What assumptions does the calculator make?',
          answer: 'Default assumptions: 3% annual property appreciation (conservative UAE average), 2% annual rent increase, 1% annual cost inflation, 95% occupancy rate, and standard UAE buying costs (4% DLD + 2% agent + 0.25% mortgage registration). You can override most of these in "Advanced Settings" for more precise projections based on your research.'
        },
        {
          question: 'Can I compare multiple properties?',
          answer: 'Yes! Our Property Comparison Tool (available to registered users) lets you compare up to 3 properties side-by-side. See ROI, yield, cash flow, and break-even point in one view. Perfect for deciding between options. Access it from your Dashboard under "Compare Properties."'
        },
      ]
    },
    {
      category: 'Premium Reports',
      icon: '⭐',
      faqs: [
        {
          question: `Why does a Premium Report cost ${priceLabel}?`,
          answer: `${priceLabel} is intentionally affordable - less than a single coffee meeting with an agent. You get: institutional-grade financial analysis, multi-decade projections, professional PDF report, unlimited access, and support. Compare this to hiring a financial analyst (AED 500-2,000 per property) or making a poor AED 500,000+ investment decision. It's the cheapest insurance policy for your investment.`
        },
        {
          question: 'How do I purchase a Premium Report?',
          answer: 'After generating a free report, click "Upgrade to Premium Report" and complete secure payment via Stripe (accepts all major credit/debit cards). Report generates instantly after payment. You\'ll receive an email confirmation with download link, and it\'s saved in your Dashboard forever.'
        },
        {
          question: 'Do Premium Reports expire?',
          answer: 'No! Once purchased, premium reports are yours forever. Access them anytime from your Dashboard. Market conditions change, so you might want to regenerate calculations later with updated inputs, but your original report remains accessible as a historical record.'
        },
        {
          question: 'Can I get a refund on a Premium Report?',
          answer: 'Due to the instant digital delivery nature of premium reports, we cannot offer refunds after report generation. However, we want you to be confident in your purchase - that\'s why we offer free reports to preview the analysis and a detailed sample premium report so you know exactly what you\'re getting. If you have technical issues accessing your report, contact support and we\'ll resolve it immediately.'
        },
        {
          question: 'Can I share or print my Premium Report?',
          answer: 'Absolutely! Premium Reports are downloadable PDFs designed for sharing. Print them for review, share with your spouse/partner, send to financial advisors, or present to co-investors. The report is professional-grade and ready for business use. However, reselling or redistributing our reports is prohibited per our Terms of Service.'
        },
      ]
    },
    {
      category: 'Calculations & Metrics',
      icon: '🔢',
      faqs: [
        {
          question: 'What does ROI actually mean and what\'s a "good" ROI in UAE?',
          answer: 'ROI (Return on Investment) is your total profit as a percentage of money invested. Formula: ((Total Gains - Initial Investment) ÷ Initial Investment) × 100. UAE benchmarks: 5-Year ROI of 25-40% is strong, 10-Year ROI of 60-100% is good, 20-Year ROI of 150-300%+ is excellent. Below 20% over 5 years suggests you should keep looking for better opportunities.'
        },
        {
          question: 'What\'s the difference between Gross and Net Rental Yield?',
          answer: 'Gross Yield = (Annual Rent ÷ Property Value) × 100. Simple but misleading as it ignores costs. Net Yield = ((Annual Rent - All Costs) ÷ Property Value) × 100. ALWAYS use Net Yield for decisions. A property showing 7% gross might only be 4.5% net after service charges, maintenance, and fees. Our calculator shows both so you understand the real return.'
        },
        {
          question: 'How is break-even point calculated?',
          answer: 'Break-even is when cumulative profit equals your initial investment. We track annual net profit (rent - costs) and property appreciation year by year. When the sum equals or exceeds your down payment + buying costs, you\'ve broken even. UAE average: 10-20 years. Under 15 years is excellent. Under 10 years is rare but exceptional.'
        },
        {
          question: 'What\'s included in "Total Investment Required"?',
          answer: 'Everything you need upfront: Down Payment + DLD Fee (4%) + Agent Commission (2%) + Mortgage Registration (0.25% of loan) + Bank Valuation/Admin Fees (typically AED 2,500-5,000) + any renovation/furnishing costs you specify. This is your true out-of-pocket cash requirement. Many beginners forget these extras and fall short at closing.'
        },
        {
          question: 'How do you calculate monthly mortgage payments?',
          answer: 'We use standard amortization formula: M = P[r(1+r)^n]/[(1+r)^n-1] where M=monthly payment, P=principal, r=monthly interest rate, n=number of payments. Most UAE mortgages are 15-25 years at 3.5-5% interest. You can override defaults with your bank\'s actual quoted rate for precise calculations.'
        },
      ]
    },
    {
      category: 'UAE Property Specifics',
      icon: '🇦🇪',
      faqs: [
        {
          question: 'What are typical rental yields in different UAE areas?',
          answer: 'Dubai Marina/JBR/Downtown: 4-5% (premium, appreciation focus). JLT/Business Bay: 5-6% (balanced). JVC/Dubai Sports City: 6-7% (good yield). Discovery Gardens/International City: 7-8%+ (high yield, affordable). Abu Dhabi: 5-7%. Sharjah: 7-9%. Higher yield usually means lower appreciation potential - choose based on your investment strategy.'
        },
        {
          question: 'What buying costs should I expect in UAE property purchase?',
          answer: 'Mandatory: DLD Transfer Fee (4% of property value), Agent Commission (2%, typically), Mortgage Registration (0.25% of loan amount if financing). Additional: Valuation Fee (AED 2,500-3,500), Admin Fees (AED 2,000-5,000), Trustees Fee (varies). Total: Budget 6-8% of property value for buying costs if getting mortgage, 6% if cash purchase.'
        },
        {
          question: 'What are service charges and how much should I budget?',
          answer: 'Service charges cover building maintenance, security, common areas, amenities (gym, pool). Paid annually by owner. Dubai range: AED 5-10/sqft for basic buildings, AED 15-25/sqft for luxury with extensive amenities. Check exact amount with seller - it\'s on their annual invoice. This is NOT optional - factor it into your calculations.'
        },
        {
          question: 'Can expats get mortgages in UAE? What are the terms?',
          answer: 'Yes! Most UAE banks offer mortgages to expats with valid residency visas. Typical terms: 20-25% down payment (75-80% LTV max), 15-25 year terms, 3.5-5% interest rates (fixed 1-5 years then variable), salary assignment required, minimum salary typically AED 15,000-20,000/month. Non-residents can get mortgages but need larger down payments (35-50%).'
        },
        {
          question: 'Do I need to pay tax on rental income in UAE?',
          answer: 'No! UAE has no personal income tax, no capital gains tax, and no property tax (except 5% VAT on commercial property sales, not residential). Rental income is tax-free. This is one reason UAE property investment is attractive. However, if you\'re a tax resident of another country, consult a tax advisor about your home country\'s obligations.'
        },
        {
          question: 'What is Ejari and do I need it?',
          answer: 'Ejari is Dubai\'s mandatory rental contract registration system. Required by law for all tenant agreements. Costs ~AED 220 to register. Provides legal protection for landlords and tenants, proves tenancy for DEWA connection, and is required for most legal processes. As a landlord, budget this annual cost (though sometimes tenants pay). Not registering can result in fines.'
        },
      ]
    },
    {
      category: 'Account & Technical',
      icon: '⚙️',
      faqs: [
        {
          question: 'How do I reset my password?',
          answer: 'Click "Sign In" → "Forgot Password" → Enter your email. You\'ll receive a password reset link within minutes. Check spam folder if you don\'t see it. Link expires after 24 hours for security. If you continue having issues, contact support@yieldpulse.com.'
        },
        {
          question: 'Why can\'t I access my saved calculations?',
          answer: 'Most common reasons: (1) Not signed into the account you used to create calculations, (2) Used browser incognito/private mode, (3) Calculations created without account (guest mode). Solution: Ensure you\'re signed into correct email account. Create account first, then use calculator to save calculations automatically.'
        },
        {
          question: 'Is my payment information secure?',
          answer: 'Absolutely. We use Stripe, the same payment processor trusted by Amazon, Google, and Shopify. We never see or store your card details - Stripe handles everything with bank-level encryption. All transactions are PCI-DSS compliant. Your payment data is safer with Stripe than storing your card with most retailers.'
        },
        {
          question: 'Can I delete my account and data?',
          answer: 'Yes. Go to Profile Settings → Account → Delete Account. This permanently removes your personal information, saved calculations, and purchased reports from our system (we retain transaction records for accounting/legal compliance only). Cannot be undone. If you want to preserve premium reports, download PDFs before deleting account.'
        },
      ]
    },
    {
      category: 'Support & Contact',
      icon: '💬',
      faqs: [
        {
          question: 'How do I contact support?',
          answer: 'Email us at support@yieldpulse.com or use the Contact form on our website. We respond within 24 hours on business days (Saturday-Wednesday in UAE). For urgent technical issues preventing report access after payment, email "URGENT" in subject line and we\'ll prioritize your ticket.'
        },
        {
          question: 'Do you offer phone support?',
          answer: `Currently, we provide support exclusively via email and our Contact form. This allows us to keep costs low and maintain our affordable ${priceLabel} pricing. Email support lets us provide detailed, documented responses and share screenshots/examples. Most inquiries are resolved in 1-2 email exchanges.`
        },
        {
          question: 'Can you provide property investment advice?',
          answer: 'YieldPulse provides calculation tools and educational resources, but we don\'t offer personalized investment advice or recommendations on specific properties. We\'re a technology platform, not licensed financial advisors. Use our tools to make informed decisions, but consult qualified financial advisors, mortgage brokers, and real estate professionals for advice specific to your situation.'
        },
        {
          question: 'Do you have an API for real estate platforms?',
          answer: 'Not currently, but we\'re exploring API access for property portals, real estate agencies, and financial platforms. If you represent a business interested in integrating YieldPulse calculations, email partnerships@yieldpulse.com with details about your use case and we\'ll discuss options.'
        },
      ]
    },
  ];

  const filteredCategories = faqCategories.map(cat => ({
    ...cat,
    faqs: cat.faqs.filter(faq =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(cat => cat.faqs.length > 0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  let globalIndex = 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 via-white to-neutral-50">
      <Header />

      {/* Breadcrumbs */}
      <div className="bg-white border-b border-border">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-4">
          <Breadcrumbs items={[
            { label: 'Resources', path: '/premium-report-guide' },
            { label: 'FAQs' }
          ]} />
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-white to-secondary/5 border-b border-border">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center space-x-2 bg-secondary/10 px-4 py-2 rounded-full mb-6">
            <HelpCircle className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-secondary">Frequently Asked Questions</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Got Questions?
            <br />
            <span className="text-primary">We've Got Answers</span>
          </h1>
          
          <p className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about using YieldPulse, understanding your reports, and UAE property investment.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search FAQs (e.g., 'premium report', 'ROI', 'mortgage')..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>
          </div>

          <p className="text-sm text-neutral-600">
            Can't find what you're looking for?{' '}
            <Link to="/contact" className="text-primary hover:text-primary-hover font-medium underline">
              Contact our support team
            </Link>
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
        
        {filteredCategories.length > 0 ? (
          <div className="space-y-12">
            {filteredCategories.map((category) => (
              <div key={category.category}>
                <div className="flex items-center space-x-3 mb-6">
                  <span className="text-3xl">{category.icon}</span>
                  <h2 className="text-2xl font-bold text-foreground">{category.category}</h2>
                </div>

                <div className="space-y-4">
                  {category.faqs.map((faq) => {
                    const currentIndex = globalIndex++;
                    const isOpen = openIndex === currentIndex;

                    return (
                      <div
                        key={currentIndex}
                        className="bg-white border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <button
                          type="button"
                          onClick={() => toggleFAQ(currentIndex)}
                          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors"
                        >
                          <span className="font-semibold text-foreground pr-4">{faq.question}</span>
                          <ChevronDown
                            className={`w-5 h-5 text-primary flex-shrink-0 transition-transform ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>

                        {isOpen && (
                          <div className="px-6 pb-4">
                            <div className="pt-2 border-t border-border">
                              <p className="text-sm text-neutral-600 leading-relaxed">{faq.answer}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No FAQs found</h3>
            <p className="text-neutral-600 mb-6">Try a different search term or browse all categories below.</p>
            <button
              onClick={() => setSearchTerm('')}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors font-medium"
            >
              Show All FAQs
            </button>
          </div>
        )}

        {/* Feedback Widget */}
        <section className="mt-20 mb-12">
          <FeedbackWidget 
            pageId="faqs" 
            title="Did you find the answer you were looking for?"
          />
        </section>

        {/* Still Have Questions CTA */}
        <section className="mt-20 bg-gradient-to-br from-secondary/10 via-primary/5 to-secondary/10 rounded-2xl p-12 text-center border-2 border-primary/20">
          <div className="max-w-2xl mx-auto">
            <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
            
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Still Have Questions?
            </h2>
            
            <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
              Our support team is here to help. Get answers within 24 hours on business days.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/contact"
                className="inline-flex items-center space-x-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary-hover transition-all shadow-lg hover:shadow-xl"
              >
                <Mail className="w-5 h-5" />
                <span>Contact Support</span>
              </Link>
              
              <Link 
                to="/calculator"
                className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-primary border-2 border-border rounded-xl font-medium hover:border-primary/30 hover:bg-neutral-50 transition-all"
              >
                <Calculator className="w-5 h-5" />
                <span>Try Calculator</span>
              </Link>
            </div>

            <div className="mt-8 pt-8 border-t border-border/50">
              <p className="text-sm text-neutral-600">
                <strong>Looking for learning resources?</strong>{' '}
                Check out our{' '}
                <Link to="/premium-report-guide" className="text-primary hover:text-primary-hover font-medium underline">
                  Premium Report Guide
                </Link>
                {' '}and{' '}
                <Link to="/glossary" className="text-primary hover:text-primary-hover font-medium underline">
                  Investment Glossary
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
