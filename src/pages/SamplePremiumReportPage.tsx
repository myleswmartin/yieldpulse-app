import { PremiumReport } from '../components/PremiumReport';
import { PropertyInputs, calculateROI, formatCurrency, formatPercent } from '../utils/calculations';
import { Header } from '../components/Header';
import { FloatingCTA } from '../components/FloatingCTA';
import { Link } from 'react-router-dom';
import { ArrowRight, Calculator, Printer } from 'lucide-react';
import { ReportSnapshot } from '../utils/pdfGenerator';
import { downloadPremiumPdf } from '../utils/pdfServerClient';
import { showSuccess, handleError } from '../utils/errorHandling';
import { useState } from 'react';
import { usePublicPricing } from '../utils/usePublicPricing';

// ================================================================
// 🔒 LOCKED SAMPLE PREMIUM REPORT - DO NOT MODIFY
// ================================================================
// Date Locked: January 7, 2026
// Status: All calculations verified and locked
// See: /CALCULATION_VERIFICATION.md for complete mathematical verification
// 
// This sample report uses verified property data and calculations.
// All formulas have been manually verified against financial standards.
// DO NOT change sample inputs, calculations, or report format.
// ================================================================

export default function SamplePremiumReportPage() {
  const { priceLabel } = usePublicPricing();
  // Sample UAE property data - realistic 1BR apartment in Dubai Marina
  // 🔒 LOCKED - All values verified in CALCULATION_VERIFICATION.md
  const sampleInputs: PropertyInputs = {
    propertyName: 'Sample Property - 1BR Apartment',
    propertyType: '1 Bedroom Apartment',
    location: 'Dubai Marina',
    areaSqft: 750,
    purchasePrice: 1200000,
    downPaymentPercent: 30, // 30% down payment
    mortgageInterestRate: 5.0, // Standard mortgage rate
    mortgageTermYears: 25,
    expectedMonthlyRent: 8000, // Realistic Dubai Marina rent
    serviceChargeAnnual: 7500, // AED 10/sqft
    annualMaintenancePercent: 1.0,
    propertyManagementFeePercent: 5,
    dldFeePercent: 4,
    agentFeePercent: 2,
    capitalGrowthPercent: 2, // Conservative growth for realistic 5-year ROI
    rentGrowthPercent: 2,
    vacancyRatePercent: 5,
    holdingPeriodYears: 5,
  };

  // Calculate all results using the calculation engine
  const sampleResults = calculateROI(sampleInputs);

  // First year amortization breakdown (calculated based on loan)
  const firstYearInterest = sampleResults.loanAmount * (sampleInputs.mortgageInterestRate / 100);
  const firstYearPrincipal = sampleResults.annualMortgagePayment - firstYearInterest;
  const firstYearAmortization = {
    principal: Math.round(firstYearPrincipal),
    interest: Math.round(firstYearInterest),
  };

  // Total interest over 25-year term (rough approximation)
  const totalInterestOverTerm = Math.round(
    sampleResults.monthlyMortgagePayment * 12 * sampleInputs.mortgageTermYears - sampleResults.loanAmount
  );

  // Vacancy amount for year 1
  const vacancyAmount = Math.round(sampleResults.grossAnnualRentalIncome * (sampleInputs.vacancyRatePercent / 100));

  // 2% selling fee for exit scenario
  const sellingFee = Math.round(sampleResults.projection[4].propertyValue * 0.02);

  // UI Check - these are the exact values that will be displayed
  const year5Displayed = formatCurrency(sampleResults.projection[4].propertyValue);
  const roiDisplayed = formatPercent(sampleResults.projection[4].roiPercent);
  const cashDisplayed = formatCurrency(sampleResults.totalInitialInvestment);
  const currentTimestamp = new Date().toISOString();

  // Download CTA visibility check
  const downloadCtaVisible = true;

  // Diagnostic values from engine
  const diagnosticValues = {
    route: '/sample-premium-report',
    inputGrowth: sampleInputs.capitalGrowthPercent,
    inputRent: sampleInputs.expectedMonthlyRent,
    inputService: sampleInputs.serviceChargeAnnual,
    year5Value: Math.round(sampleResults.projection[4].propertyValue),
    roi: sampleResults.projection[4].roiPercent,
    initialInvestment: sampleResults.totalInitialInvestment,
    grossYield: sampleResults.grossRentalYield,
    netYield: sampleResults.netRentalYield,
    monthlyCashFlow: Math.round(sampleResults.monthlyCashFlow),
    annualCashFlow: Math.round(sampleResults.annualCashFlow),
    breakEvenOccupancy: sampleResults.breakEvenOccupancyRate,
    cumulativeCashFlow5Y: Math.round(sampleResults.projection[4].cumulativeCashFlow),
    totalReturn5Y: Math.round(sampleResults.projection[4].totalReturn),
    remainingLoanBalance5Y: Math.round(sampleResults.projection[4].remainingLoanBalance),
    netSaleProceeds5Y: Math.round(sampleResults.projection[4].saleProceeds),
  };

  // Calculate annualized return
  const annualizedReturn = ((Math.pow(1 + diagnosticValues.roi / 100, 1 / 5) - 1) * 100);

  // State for PDF generation
  const [generatingPDF, setGeneratingPDF] = useState(false);

  // Function to map sample data to ReportSnapshot format
  const createSampleSnapshot = (): ReportSnapshot => {
    // Calculate derived values
    const vacancyAllowance = sampleResults.grossAnnualRentalIncome * (sampleInputs.vacancyRatePercent / 100);
    const sellingFee = sampleResults.projection[4].propertyValue * 0.02;
    
    return {
      inputs: {
        portal_source: 'Sample_Premium_Report',
        listing_url: undefined,
        purchase_price: sampleInputs.purchasePrice,
        expected_monthly_rent: sampleInputs.expectedMonthlyRent,
        down_payment_percent: sampleInputs.downPaymentPercent,
        mortgage_interest_rate: sampleInputs.mortgageInterestRate,
        loan_term_years: sampleInputs.mortgageTermYears,
        service_charge_per_year: sampleInputs.serviceChargeAnnual,
        maintenance_per_year: sampleResults.annualMaintenanceCosts,
        property_management_fee: sampleResults.annualPropertyManagementFee,
        vacancy_rate: sampleInputs.vacancyRatePercent,
        rent_growth_rate: sampleInputs.rentGrowthPercent,
        capital_growth_rate: sampleInputs.capitalGrowthPercent,
        holding_period_years: sampleInputs.holdingPeriodYears,
        area_sqft: sampleInputs.areaSqft,
      },
      results: {
        // Core metrics
        grossYield: sampleResults.grossRentalYield,
        netYield: sampleResults.netRentalYield,
        cashOnCashReturn: sampleResults.cashOnCashReturn,
        capRate: sampleResults.capRate,
        monthlyCashFlow: sampleResults.monthlyCashFlow,
        annualCashFlow: sampleResults.annualCashFlow,
        monthlyMortgagePayment: sampleResults.monthlyMortgagePayment,
        totalOperatingCosts: sampleResults.totalAnnualOperatingExpenses,
        monthlyIncome: sampleInputs.expectedMonthlyRent,
        annualIncome: sampleResults.grossAnnualRentalIncome,
        costPerSqft: sampleResults.costPerSqft,
        rentPerSqft: sampleResults.rentPerSqft,
        
        // Initial investment components
        downPaymentAmount: sampleResults.downPaymentAmount,
        dldFee: sampleResults.dldFee,
        agentFee: sampleResults.agentFee,
        otherClosingCosts: sampleResults.otherClosingCosts,
        totalInitialInvestment: sampleResults.totalInitialInvestment,
        
        // Loan details
        loanAmount: sampleResults.loanAmount,
        annualMortgagePayment: sampleResults.annualMortgagePayment,
        
        // Operating expense breakdown
        annualServiceCharge: sampleResults.annualServiceCharge,
        annualMaintenanceCosts: sampleResults.annualMaintenanceCosts,
        annualPropertyManagementFee: sampleResults.annualPropertyManagementFee,
        totalAnnualOperatingExpenses: sampleResults.totalAnnualOperatingExpenses,
        grossAnnualRentalIncome: sampleResults.grossAnnualRentalIncome,
        effectiveAnnualRentalIncome: sampleResults.effectiveAnnualRentalIncome,
        netOperatingIncome: sampleResults.netOperatingIncome,
        vacancyAmount: vacancyAllowance,
        
        // Amortization
        firstYearAmortization: {
          principal: firstYearAmortization.principal,
          interest: firstYearAmortization.interest,
        },
        totalInterestOverTerm: totalInterestOverTerm,
        
        // Exit scenario
        sellingFee: sellingFee,
        
        // 5-year projection
        projection: sampleResults.projection,
        
        // Sensitivity analysis
        sensitivityAnalysis: sampleResults.sensitivityAnalysis,
      },
    };
  };

  // Handler for PDF download
  const handleDownloadSamplePDF = async () => {
    setGeneratingPDF(true);
    
    try {
      const snapshot = createSampleSnapshot();
      const sampleDate = `Sample Report - ${new Date().toISOString().split('T')[0]}`;
      const sampleFileName = `YieldPulse_Sample_Premium_Report_${new Date().toISOString().split('T')[0]}.pdf`;
      
      await downloadPremiumPdf(snapshot, sampleDate, sampleFileName, {
        propertyName: sampleInputs.propertyName,
        propertyImageUrl: sampleInputs.propertyImageUrl ?? null,
        listingUrl: sampleInputs.listingUrl,
        areaSqft: sampleInputs.areaSqft,
        propertyType: sampleInputs.propertyType,
        location: sampleInputs.location,
      });
      
      showSuccess('Sample PDF downloaded successfully!');
    } catch (error) {
      console.error('Error generating sample PDF:', error);
      handleError(
        'Failed to generate PDF. Please try again.',
        'Download Sample PDF',
        handleDownloadSamplePDF
      );
    } finally {
      setGeneratingPDF(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      
      {/* Help Banner - Guide Link */}
      <div className="bg-gradient-to-r from-secondary/10 to-primary/10 border-b border-border no-print">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              </div>
              <span className="text-neutral-700">
                <strong className="text-foreground">New to property investment?</strong> Learn how to read this report →
              </span>
            </div>
            <Link 
              to="/premium-report-guide"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors font-medium"
            >
              <span>Read Complete Guide</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="pb-12 pdf-page-container">
        {/* Primary Download CTA - Above the fold */}
        <div className="max-w-5xl mx-auto px-4 pt-8 pb-6 no-print">
          <button
            onClick={handleDownloadSamplePDF}
            disabled={generatingPDF}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {generatingPDF ? 'Generating PDF...' : 'Download Sample as PDF'}
          </button>
        </div>

        {/* Print-only header banner */}
        
        {/* Premium Report Component */}
        <div className="max-w-5xl mx-auto py-8 px-4 sample-watermark">
          <PremiumReport
            displayResults={sampleResults}
            displayInputs={sampleInputs}
            vacancyAmount={vacancyAmount}
            firstYearAmortization={firstYearAmortization}
            totalInterestOverTerm={totalInterestOverTerm}
            sellingFee={sellingFee}
          />
        </div>

        {/* Conversion CTA - Screen only */}
        <div className="max-w-5xl mx-auto px-4 pb-8 no-print">
          <div className="bg-gradient-to-br from-primary to-primary-hover text-white rounded-2xl p-8 shadow-2xl">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-3">
                Ready to Analyze Your Own Property?
              </h2>
              <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                Real analyses use your property's data. Get instant free metrics, then unlock your own comprehensive Premium Report for just {priceLabel}.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link 
                  to="/calculator" 
                  className="inline-flex items-center gap-3 px-8 py-4 bg-white text-primary font-bold text-lg rounded-xl hover:shadow-2xl transition-all"
                >
                  <Calculator className="w-5 h-5" />
                  <span>Start Free Analysis</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link 
                  to="/pricing" 
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white border-2 border-white/30 rounded-xl font-semibold hover:bg-white/20 transition-all"
                >
                  <span>View Pricing</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info - screen only */}
        <div className="max-w-5xl mx-auto px-4 pb-20 no-print">
          <div className="mt-4 text-center">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium text-sm underline"
            >
              <Printer className="w-4 h-4" />
              Print this sample
            </button>
          </div>
        </div>
      </main>
      
      {/* Floating CTA */}
      <FloatingCTA variant="sample" delay={5000} />
    </div>
  );
}
