import { Link } from 'react-router-dom';
import { BookOpen, Search, TrendingUp, Home, Calculator, ArrowRight } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { FeedbackWidget } from '../components/FeedbackWidget';
import { useState, useEffect } from 'react';

export default function GlossaryPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Track page view for analytics
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'page_view', {
        page_title: 'Investment Glossary',
        page_location: window.location.href,
        page_path: '/glossary'
      });
    }
  }, []);

  const glossaryTerms = [
    {
      letter: 'A',
      terms: [
        { term: 'Appreciation', definition: 'The increase in property value over time. In UAE markets, typical appreciation ranges from 3-8% annually in stable, prime locations. Capital appreciation is one of the two main ways investors profit from real estate.', category: 'General' },
        { term: 'Annual Rental Yield', definition: 'Total annual rental income expressed as a percentage of the property value. Formula: (Annual Rent ÷ Property Value) × 100. UAE averages range from 4-7% depending on location and property type.', category: 'Metrics' },
        { term: 'Amortization', definition: 'The process of paying off a mortgage through regular payments over time. Each payment includes both principal (loan amount) and interest. Early payments are mostly interest; later payments are mostly principal.', category: 'Financing' },
      ]
    },
    {
      letter: 'B',
      terms: [
        { term: 'Break-Even Point', definition: 'The time it takes for cumulative profits (rental income + appreciation) to equal your initial investment. Shorter break-even periods indicate faster return on capital. UAE average: 10-20 years.', category: 'Metrics' },
        { term: 'Buyout (Early Mortgage)', definition: 'Paying off your mortgage before the term ends. UAE banks may charge early settlement fees (typically 1-3% of outstanding balance). Check your mortgage contract for specific terms.', category: 'Financing' },
      ]
    },
    {
      letter: 'C',
      terms: [
        { term: 'Cash Flow', definition: 'The net amount of money moving in and out of your investment. Positive cash flow means rental income exceeds all expenses (mortgage, fees, maintenance). Negative cash flow requires you to cover the difference.', category: 'Metrics' },
        { term: 'Cash-on-Cash Return', definition: 'Annual net cash flow as a percentage of your actual cash invested (not total property value). Formula: (Annual Cash Flow ÷ Total Cash Invested) × 100. Shows the true return on YOUR money.', category: 'Metrics' },
        { term: 'Capitalization Rate (Cap Rate)', definition: 'Net operating income as a percentage of property value. Formula: (NOI ÷ Property Value) × 100. Professional investors use this to compare properties. UAE cap rates typically range 3-7%.', category: 'Metrics' },
        { term: 'Chiller Charges', definition: 'Cooling/air conditioning fees common in Dubai properties. Charged per consumption unit or as flat fee. Can significantly impact operating costs. Check if included in service charge or billed separately.', category: 'Costs' },
        { term: 'Closing Costs', definition: 'All fees paid when completing a property purchase. In UAE: DLD fee (4%), agent commission (2%), mortgage registration (0.25%), valuation fees, and admin charges. Total typically 6-8% of property value.', category: 'Costs' },
        { term: 'Cost per Square Foot', definition: 'Purchase price divided by property area (BUA - Built Up Area). Formula: Purchase Price ÷ Area in sqft. Key metric for comparing value across properties of different sizes. Dubai average: AED 1,000-3,000/sqft depending on location and type.', category: 'Metrics' },
      ]
    },
    {
      letter: 'D',
      terms: [
        { term: 'DEWA', definition: 'Dubai Electricity and Water Authority. Provides utilities in Dubai. Landlords typically pay DEWA if property is vacant. Often included in rent for furnished properties, separate for unfurnished.', category: 'General' },
        { term: 'DLD Fee', definition: 'Dubai Land Department transfer fee. 4% of property purchase price paid to government when buying. One-time mandatory cost. Calculated on full property value regardless of mortgage.', category: 'Costs' },
        { term: 'Down Payment', definition: 'Initial cash payment when purchasing property. UAE requirements: 20-25% for expat buyers, 15-20% for UAE nationals. Investment properties may require higher down payments (30-40%).', category: 'Financing' },
        { term: 'Depreciation', definition: 'Decrease in property value over time. While land typically appreciates, buildings can depreciate due to wear and tear. Important for tax planning in some jurisdictions (not applicable in UAE due to no property tax).', category: 'General' },
      ]
    },
    {
      letter: 'E',
      terms: [
        { term: 'Equity', definition: 'Your ownership stake in the property. Calculated as current property value minus outstanding mortgage. Equity grows through mortgage payments (reducing loan) and appreciation (increasing value).', category: 'General' },
        { term: 'Escrow Account', definition: 'Third-party account holding buyer deposits during transaction. In UAE, off-plan purchases use developer escrow accounts regulated by RERA to protect buyer funds.', category: 'Legal' },
        { term: 'Ejari', definition: 'Official rental contract registration system in Dubai. Required by law for all tenancy agreements. Provides legal protection for both landlords and tenants. Costs approximately AED 220 to register.', category: 'Legal' },
      ]
    },
    {
      letter: 'F',
      terms: [
        { term: 'Freehold', definition: 'Full ownership of property and land with no time limit. Foreign nationals can own freehold property in designated areas of UAE. Can be sold, rented, or inherited without restrictions.', category: 'Legal' },
        { term: 'Fixed Interest Rate', definition: 'Mortgage interest rate locked for specified period (typically 1-5 years in UAE). Provides payment certainty but may be higher than variable rates. Rate adjusts at end of fixed period.', category: 'Financing' },
      ]
    },
    {
      letter: 'G',
      terms: [
        { term: 'Gross Rental Yield', definition: 'Annual rental income as percentage of property value WITHOUT deducting expenses. Formula: (Annual Rent ÷ Property Value) × 100. Always use NET yield for investment decisions as it accounts for costs.', category: 'Metrics' },
        { term: 'Grace Period', definition: 'Time allowed by lender before late payment penalties apply. UAE mortgages typically offer 3-5 days grace period after payment due date.', category: 'Financing' },
      ]
    },
    {
      letter: 'H',
      terms: [
        { term: 'Holding Costs', definition: 'Ongoing expenses while owning property: service charges, utilities, insurance, maintenance, property management fees. Must be factored into cash flow calculations.', category: 'Costs' },
        { term: 'Home Insurance', definition: 'Coverage for property damage and liability. UAE mortgages often require building insurance (structure) at minimum. Contents insurance is optional but recommended for landlords with furnished properties.', category: 'General' },
      ]
    },
    {
      letter: 'I',
      terms: [
        { term: 'Interest Rate', definition: 'Cost of borrowing money, expressed as annual percentage. UAE mortgage rates typically range 3-5% (as of 2024). Variable rates fluctuate with EIBOR; fixed rates remain constant for set period.', category: 'Financing' },
        { term: 'Initial Investment', definition: 'Total upfront cash required: down payment + closing costs + initial repairs/furnishing. This is the denominator in ROI calculations, not just the down payment.', category: 'General' },
        { term: 'Internal Rate of Return (IRR)', definition: 'Advanced metric showing annualized rate of return accounting for time value of money. Useful for comparing real estate with other investment types. Above 8-10% is generally strong for UAE property.', category: 'Metrics' },
      ]
    },
    {
      letter: 'L',
      terms: [
        { term: 'Leasehold', definition: 'Property ownership for fixed period (typically 99 years in UAE). After term expires, ownership reverts to freeholder. Less common than freehold in UAE investor market.', category: 'Legal' },
        { term: 'Leverage', definition: 'Using borrowed money (mortgage) to increase potential returns. Example: 75% LTV means you control AED 1M property with AED 250K cash. Amplifies both gains AND losses.', category: 'Financing' },
        { term: 'LTV (Loan-to-Value Ratio)', definition: 'Mortgage amount as percentage of property value. Formula: (Loan Amount ÷ Property Value) × 100. UAE maximums: 75-80% for expats, 85% for nationals. Lower LTV = lower risk, better cash flow.', category: 'Financing' },
        { term: 'Liquidity', definition: 'How quickly an asset can be converted to cash. Real estate is relatively illiquid - selling typically takes 1-6 months in UAE. Important consideration for emergency planning.', category: 'General' },
      ]
    },
    {
      letter: 'M',
      terms: [
        { term: 'Mortgage', definition: 'Loan secured by property. Borrower makes regular payments (principal + interest) over term (typically 15-25 years in UAE). Property serves as collateral - lender can foreclose if payments stop.', category: 'Financing' },
        { term: 'Mortgage Registration Fee', definition: '0.25% of mortgage loan amount paid to Dubai Land Department to register the mortgage. One-time cost during property purchase. Example: AED 1,875 on AED 750,000 loan.', category: 'Costs' },
        { term: 'Maintenance Reserve', definition: 'Emergency fund for unexpected repairs (AC replacement, plumbing, repainting). Recommended: 1-2% of property value annually. Essential for protecting cash flow from surprise expenses.', category: 'Costs' },
        { term: 'Market Value', definition: 'Price property would likely sell for in current market conditions. Can differ from purchase price due to market fluctuations. Used by banks for mortgage approval and LTV calculations.', category: 'General' },
      ]
    },
    {
      letter: 'N',
      terms: [
        { term: 'Net Operating Income (NOI)', definition: 'Total rental income minus all operating expenses (excluding mortgage). Formula: Gross Rent - (Service Charges + Maintenance + Fees). Used to calculate cap rate.', category: 'Metrics' },
        { term: 'Net Rental Yield', definition: 'Rental yield after deducting all costs. Formula: ((Annual Rent - Annual Costs) ÷ Property Value) × 100. More accurate than gross yield for investment decisions. UAE average: 3-6%.', category: 'Metrics' },
        { term: 'Negative Cash Flow', definition: 'When property expenses exceed rental income. Requires owner to cover monthly difference from personal funds. Acceptable if strong appreciation expected, but risky for beginners.', category: 'Metrics' },
      ]
    },
    {
      letter: 'O',
      terms: [
        { term: 'Occupancy Rate', definition: 'Percentage of time property is rented and generating income. Formula: (Rented Days ÷ 365) × 100. Target 95%+ but budget for 90% to account for tenant turnover and vacancy.', category: 'Metrics' },
        { term: 'Off-Plan', definition: 'Property purchased before or during construction. Often offers payment plans and potential capital gains before completion. Higher risk than ready properties - check developer reputation and RERA registration.', category: 'General' },
        { term: 'Operating Expenses', definition: 'Recurring costs to maintain and manage property: service charges, insurance, maintenance, property management fees, utilities (when vacant). Excludes mortgage payments and capital improvements.', category: 'Costs' },
      ]
    },
    {
      letter: 'P',
      terms: [
        { term: 'Principal', definition: 'The original loan amount borrowed, excluding interest. Each mortgage payment reduces principal (amortization). After 25 years of payments, principal reaches zero and property is fully owned.', category: 'Financing' },
        { term: 'Property Management Fee', definition: 'Cost for professional management of rental property. UAE typical: 5-8% of annual rent. Services include tenant sourcing, rent collection, maintenance coordination. Worth it for busy or overseas investors.', category: 'Costs' },
        { term: 'Positive Cash Flow', definition: 'When rental income exceeds all expenses (mortgage + costs). Property generates surplus income monthly. Ideal for investors seeking passive income. Makes investment self-sustaining.', category: 'Metrics' },
      ]
    },
    {
      letter: 'R',
      terms: [
        { term: 'RERA', definition: 'Real Estate Regulatory Agency - government body regulating Dubai property market. Oversees developers, agents, and contracts. Provides rental index (price guidelines) and dispute resolution.', category: 'Legal' },
        { term: 'Rental Yield', definition: 'Annual rental income as percentage of property value. Key metric for comparing investment properties. Higher yield = better income relative to property cost. See \"Annual Rental Yield\" for formula.', category: 'Metrics' },
        { term: 'Rent per Square Foot', definition: 'Annual rental income divided by property area (BUA). Formula: Annual Rent ÷ Area in sqft. Helps compare rental efficiency across different property sizes. Higher values indicate stronger rental performance per unit of space.', category: 'Metrics' },
        { term: 'ROI (Return on Investment)', definition: 'Total profit as percentage of initial investment. Formula: ((Total Gains - Initial Investment) ÷ Initial Investment) × 100. Includes both rental income and appreciation. Ultimate measure of investment success.', category: 'Metrics' },
        { term: 'Refinancing', definition: 'Replacing existing mortgage with new one, often for better terms (lower rate, different duration). UAE banks allow refinancing after 1-2 years. Costs typically 1-2% of new loan amount.', category: 'Financing' },
      ]
    },
    {
      letter: 'S',
      terms: [
        { term: 'Service Charge', definition: 'Annual fee for building maintenance, security, common areas, amenities. Paid by owner in UAE. Ranges AED 5-25 per sqft/year depending on building quality and facilities. Always verify before purchase.', category: 'Costs' },
        { term: 'Strata Title', definition: 'Ownership of individual unit in multi-unit building plus share of common property. Most UAE apartments are strata titled. Includes rights to common areas and obligations for service charges.', category: 'Legal' },
        { term: 'Settlement', definition: 'Final property purchase completion: funds transferred, title deed issued, keys handed over. In Dubai, happens at DLD Trustee Office or approved service centers (Ejari offices).', category: 'Legal' },
      ]
    },
    {
      letter: 'T',
      terms: [
        { term: 'Tenancy Contract', definition: 'Legal agreement between landlord and tenant. Must include rent amount, payment schedule, duration, maintenance responsibilities. Required to be registered via Ejari in Dubai.', category: 'Legal' },
        { term: 'Title Deed', definition: 'Official document proving property ownership. Issued by Dubai Land Department. Shows owner name, property details, location. Required for selling or mortgaging property.', category: 'Legal' },
        { term: 'Total Return', definition: 'Combined profit from rental income AND capital appreciation over investment period. More complete measure than rental yield alone. What investors actually care about long-term.', category: 'Metrics' },
        { term: 'Transfer Fee', definition: 'See "DLD Fee" - 4% charge when property ownership transfers from seller to buyer.', category: 'Costs' },
      ]
    },
    {
      letter: 'V',
      terms: [
        { term: 'Vacancy Rate', definition: 'Percentage of time property sits empty between tenants. Formula: (Vacant Days ÷ 365) × 100. Dubai average: 5-10%. Always budget for some vacancy - zero vacancy assumptions are unrealistic.', category: 'Metrics' },
        { term: 'Valuation Fee', definition: 'Bank charge for professional property appraisal during mortgage approval. UAE: typically AED 2,500-3,500. Ensures property value matches loan amount. Valid for 3-6 months.', category: 'Costs' },
        { term: 'Variable Interest Rate', definition: 'Mortgage rate that fluctuates based on market index (EIBOR in UAE). Lower initial rates but payment uncertainty. Can increase or decrease during loan term based on market conditions.', category: 'Financing' },
      ]
    },
    {
      letter: 'Y',
      terms: [
        { term: 'Yield-on-Cost', definition: 'Net operating income divided by total acquisition cost (purchase price + all buying costs). More accurate than standard yield as it includes ALL money spent to acquire property.', category: 'Metrics' },
      ]
    },
  ];

  const filteredTerms = glossaryTerms.map(section => ({
    ...section,
    terms: section.terms.filter(item =>
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(section => section.terms.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 via-white to-neutral-50">
      <Header />

      {/* Breadcrumbs */}
      <div className="bg-white border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumbs items={[
            { label: 'Resources', path: '/premium-report-guide' },
            { label: 'Investment Glossary' }
          ]} />
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-secondary/5 via-white to-primary/5 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Quick Reference</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            UAE Property Investment
            <br />
            <span className="text-primary">Glossary</span>
          </h1>
          
          <p className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Your comprehensive reference for every property investment term. From appreciation to yield - everything explained in plain English.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search terms (e.g., 'yield', 'mortgage', 'ROI')..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 flex-wrap text-sm text-neutral-600">
            <span className="font-semibold">Quick Links:</span>
            <Link to="/premium-report-guide" className="text-primary hover:text-primary-hover font-medium underline">Report Guide</Link>
            <Link to="/calculator" className="text-primary hover:text-primary-hover font-medium underline">Calculator</Link>
            <Link to="/sample-premium-report" className="text-primary hover:text-primary-hover font-medium underline">Sample Report</Link>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        
        {/* Category Legend */}
        <div className="bg-white border border-border rounded-xl p-6 mb-12">
          <h2 className="text-lg font-bold text-foreground mb-4">Term Categories</h2>
          <div className="flex flex-wrap gap-3">
            <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">Metrics</span>
            <span className="px-3 py-1 bg-secondary/10 text-secondary text-sm font-medium rounded-full">Financing</span>
            <span className="px-3 py-1 bg-amber-100 text-amber-700 text-sm font-medium rounded-full">Costs</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">Legal</span>
            <span className="px-3 py-1 bg-neutral-100 text-neutral-700 text-sm font-medium rounded-full">General</span>
          </div>
        </div>

        {/* Glossary Terms */}
        {filteredTerms.length > 0 ? (
          <div className="space-y-12">
            {filteredTerms.map((section) => (
              <div key={section.letter}>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-hover rounded-xl flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary-foreground">{section.letter}</span>
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent"></div>
                </div>

                <div className="space-y-6">
                  {section.terms.map((item, idx) => (
                    <div key={idx} className="bg-white border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-bold text-foreground">{item.term}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full flex-shrink-0 ml-4 ${
                          item.category === 'Metrics' ? 'bg-primary/10 text-primary' :
                          item.category === 'Financing' ? 'bg-secondary/10 text-secondary' :
                          item.category === 'Costs' ? 'bg-amber-100 text-amber-700' :
                          item.category === 'Legal' ? 'bg-blue-100 text-blue-700' :
                          'bg-neutral-100 text-neutral-700'
                        }`}>
                          {item.category}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-600 leading-relaxed">{item.definition}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 sm:py-16">
            <Search className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No terms found</h3>
            <p className="text-neutral-600 mb-6">Try a different search term or browse all terms below.</p>
            <button
              onClick={() => setSearchTerm('')}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors font-medium cursor-pointer"
            >
              Show All Terms
            </button>
          </div>
        )}

        {/* Feedback Widget */}
        <section className="mt-20 mb-12">
          <FeedbackWidget 
            pageId="investment-glossary" 
            title="Was this glossary helpful?"
          />
        </section>

        {/* CTA Section */}
        <section className="mt-20 bg-gradient-to-br from-primary/10 via-secondary/5 to-primary/10 rounded-2xl p-12 text-center border-2 border-primary/20">
          <div className="max-w-2xl mx-auto">
            <Home className="w-12 h-12 text-primary mx-auto mb-4" />
            
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to Put Your Knowledge to Work?
            </h2>
            
            <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
              Now that you understand the terminology, start analyzing UAE properties with YieldPulse's professional calculator.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/calculator"
                className="group inline-flex items-center space-x-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary-hover transition-all shadow-lg hover:shadow-xl"
              >
                <Calculator className="w-5 h-5" />
                <span>Start Calculating ROI</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link 
                to="/premium-report-guide"
                className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-primary border-2 border-border rounded-xl font-medium hover:border-primary/30 hover:bg-neutral-50 transition-all"
              >
                <TrendingUp className="w-5 h-5" />
                <span>Read Report Guide</span>
              </Link>
            </div>
          </div>
        </section>

      </div>

      <Footer />
    </div>
  );
}