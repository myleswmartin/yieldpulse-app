import { useLocation, Link } from 'react-router-dom';
import { TrendingUp, DollarSign, Lock, ArrowLeft, CheckCircle, FileText, Download, GitCompare, Calendar, Info, AlertCircle, Sparkles } from 'lucide-react';
import { CalculationResults, formatCurrency, formatPercent, PropertyInputs } from '../utils/calculations';
import { useAuth } from '../contexts/AuthContext';
import { Header } from '../components/Header';
import { StatCard } from '../components/StatCard';
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { generatePDF } from '../utils/pdfGenerator';
import { showSuccess, handleError } from '../utils/errorHandling';
import { trackPdfDownload, trackPremiumUnlock } from '../utils/analytics';
import { checkPurchaseStatus, createCheckoutSession, saveAnalysis } from '../utils/apiClient';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Line
} from 'recharts';

// ================================================================
// HELPER FUNCTION: Build PropertyInputs from saved analysis record
// ================================================================
function buildPropertyInputsFromAnalysis(analysis: any): Partial<PropertyInputs> | null {
  if (!analysis) return null;
  
  // Safe number parser: returns undefined if value is null/undefined/unparseable
  const parseNumber = (value: any): number | undefined => {
    if (value === null || value === undefined) return undefined;
    const parsed = Number(value);
    return isNaN(parsed) ? undefined : parsed;
  };

  // Safe string parser: returns undefined if empty or null
  const parseString = (value: any): string | undefined => {
    if (!value) return undefined;
    return String(value);
  };

  try {
    // Map ONLY the 11 confirmed core columns from analyses table
    // No fabricated defaults, no non-null assertions
    return {
      portalSource: parseString(analysis.portal_source),
      listingUrl: parseString(analysis.listing_url),
      areaSqft: parseNumber(analysis.area_sqft),
      purchasePrice: parseNumber(analysis.purchase_price),
      downPaymentPercent: parseNumber(analysis.down_payment_percent),
      mortgageInterestRate: parseNumber(analysis.mortgage_interest_rate),
      mortgageTermYears: parseNumber(analysis.mortgage_term_years),
      expectedMonthlyRent: parseNumber(analysis.expected_monthly_rent),
      serviceChargeAnnual: parseNumber(analysis.service_charge_annual),
      annualMaintenancePercent: parseNumber(analysis.annual_maintenance_percent),
      propertyManagementFeePercent: parseNumber(analysis.property_management_fee_percent),
    };
  } catch (error) {
    console.error('Error building PropertyInputs from analysis:', error);
    return null;
  }
}

export default function ResultsPage() {
  const location = useLocation();
  const { user } = useAuth();
  
  const results = location.state?.results as CalculationResults | null;
  const inputs = location.state?.inputs as PropertyInputs | null;
  const savedAnalysis = location.state?.analysis;
  const fromDashboard = location.state?.fromDashboard;
  const passedAnalysisId = location.state?.analysisId;
  const isSavedFromCalculator = location.state?.isSaved || false;

  // ================================================================
  // DETERMINE DISPLAY INPUTS & RESULTS WITH ROBUST PRECEDENCE
  // ================================================================
  let displayInputs: Partial<PropertyInputs> | null = null;
  let displayResults: CalculationResults | null = null;

  // Inputs precedence: direct inputs > build from analysis > null
  if (inputs) {
    displayInputs = inputs;
  } else if (savedAnalysis) {
    displayInputs = buildPropertyInputsFromAnalysis(savedAnalysis);
  }

  // Results precedence: direct results > analysis.calculation_results > null
  if (results) {
    displayResults = results;
  } else if (savedAnalysis?.calculation_results) {
    try {
      displayResults = savedAnalysis.calculation_results as CalculationResults;
    } catch (error) {
      console.error('Error parsing calculation_results:', error);
    }
  }

  // ================================================================
  // SAVE STATE TRACKING - CRITICAL FOR GATING
  // ================================================================
  // Convert analysisId to state so it can update after save
  const [analysisId, setAnalysisId] = useState<string | null>(
    passedAnalysisId || savedAnalysis?.id || null
  );
  const [isSaved, setIsSaved] = useState(isSavedFromCalculator || !!analysisId);
  const [saving, setSaving] = useState(false);

  // Premium unlock state
  const [isPremiumUnlocked, setIsPremiumUnlocked] = useState(false);
  const [checkingPurchaseStatus, setCheckingPurchaseStatus] = useState(false);
  const [creatingCheckout, setCreatingCheckout] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [pdfSnapshot, setPdfSnapshot] = useState<any>(null);

  // Check purchase status on mount if we have an analysis ID
  useEffect(() => {
    if (analysisId && user) {
      checkPaymentStatus();
    }
  }, [analysisId, user]);

  const checkPaymentStatus = async () => {
    if (!analysisId || !user) return;

    setCheckingPurchaseStatus(true);

    try {
      const { data, error, requestId } = await checkPurchaseStatus(analysisId);

      if (error) {
        console.error('Error checking purchase status:', error);
        handleError(
          error.error || 'Failed to check purchase status',
          'Check Purchase Status',
          () => checkPaymentStatus(),
          requestId
        );
        return;
      }

      if (data?.isPaid) {
        // Only track unlock event if transitioning from unpaid to paid
        if (!isPremiumUnlocked) {
          trackPremiumUnlock(analysisId);
        }
        setIsPremiumUnlocked(true);
        // Fetch the snapshot for PDF generation
        fetchPdfSnapshot();
      }
    } catch (error: any) {
      console.error('Error checking purchase status:', error);
      handleError(error.message || 'An unexpected error occurred', 'Check Purchase Status');
    } finally {
      setCheckingPurchaseStatus(false);
    }
  };
  
  const handleDownloadPDF = async () => {
    if (!pdfSnapshot) {
      handleError('PDF data not available. Please try again.', 'Download PDF', () => {
        fetchPdfSnapshot();
      });
      return;
    }

    setGeneratingPDF(true);
    try {
      await generatePDF(pdfSnapshot.snapshot, pdfSnapshot.purchaseDate);
      showSuccess('PDF downloaded successfully!');
      trackPdfDownload();
    } catch (error) {
      console.error('Error generating PDF:', error);
      handleError(error, 'Generate PDF', handleDownloadPDF);
    } finally {
      setGeneratingPDF(false);
    }
  };
  
  const handleUnlockPremium = async () => {
    if (!user) {
      alert('Please sign in to unlock the premium report');
      return;
    }

    if (!analysisId) {
      alert('Analysis not saved. Please save your analysis first.');
      return;
    }

    setCreatingCheckout(true);
    
    try {
      const currentOrigin = window.location.origin;
      
      const { data, error, requestId } = await createCheckoutSession({
        analysisId,
        origin: currentOrigin,
      });

      if (error) {
        console.error('Error creating checkout session:', error);
        handleError(
          error.error || 'Failed to create checkout session',
          'Create Checkout',
          () => handleUnlockPremium(),
          requestId
        );
        return;
      }

      if (data?.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      handleError(error.message || 'Failed to initiate payment. Please try again.', 'Create Checkout');
    } finally {
      setCreatingCheckout(false);
    }
  };
  
  const fetchPdfSnapshot = async () => {
    if (!analysisId || !user) return;

    try {
      const { data, error } = await supabase
        .from('report_purchases')
        .select('snapshot, created_at')
        .eq('analysis_id', analysisId)
        .eq('status', 'paid')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching PDF snapshot:', error);
        return;
      }

      if (data?.snapshot) {
        setPdfSnapshot({
          snapshot: data.snapshot,
          purchaseDate: data.created_at
        });
      }
    } catch (error) {
      console.error('Error fetching PDF snapshot:', error);
    }
  };
  
  const handleSaveReport = async () => {
    if (!user || !inputs || !results) return;

    setSaving(true);
    
    try {
      const { data, error, requestId } = await saveAnalysis({
        inputs,
        results,
      });

      if (error) {
        handleError(
          error.error || 'Failed to save report. Please try again.',
          'Save Report',
          () => handleSaveReport(),
          requestId
        );
        return;
      }

      if (data?.id) {
        setAnalysisId(data.id);  // Update state with new analysisId
        setIsSaved(true);
        showSuccess('Report saved successfully! You can now unlock premium features.');
        // Auto-check purchase status for newly saved report
        checkPaymentStatus();
      }
    } catch (error: any) {
      handleError(
        error.message || 'An unexpected error occurred while saving.',
        'Save Report'
      );
    } finally {
      setSaving(false);
    }
  };
  
  if (!displayResults) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-neutral-400" />
            </div>
            <p className="text-neutral-600 text-lg mb-6">No results to display</p>
            <Link 
              to="/calculator" 
              className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary-hover transition-all"
            >
              <span>Go to Calculator</span>
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Calculate sensitivity metrics
  const calculateSensitivity = () => {
    if (!displayInputs) return [];

    // Calculate impact of key variables
    const baseAnnualCashFlow = displayResults.annualCashFlow;
    
    // Rent change sensitivity (±10%)
    const rentIncrease = ((displayInputs.expectedMonthlyRent * 1.1) * 12) - (displayInputs.expectedMonthlyRent * 12);
    const rentDecrease = (displayInputs.expectedMonthlyRent * 12) - ((displayInputs.expectedMonthlyRent * 0.9) * 12);
    
    // Interest rate change sensitivity (±1%)
    const loanAmount = displayInputs.purchasePrice * (1 - displayInputs.downPaymentPercent / 100);
    const currentRate = displayInputs.mortgageInterestRate / 100 / 12;
    const newRateUp = (displayInputs.mortgageInterestRate + 1) / 100 / 12;
    const newRateDown = (displayInputs.mortgageInterestRate - 1) / 100 / 12;
    const n = displayInputs.mortgageTermYears * 12;
    
    const currentPayment = loanAmount * (currentRate * Math.pow(1 + currentRate, n)) / (Math.pow(1 + currentRate, n) - 1);
    const paymentUp = loanAmount * (newRateUp * Math.pow(1 + newRateUp, n)) / (Math.pow(1 + newRateUp, n) - 1);
    const paymentDown = loanAmount * (newRateDown * Math.pow(1 + newRateDown, n)) / (Math.pow(1 + newRateDown, n) - 1);
    
    const rateImpactUp = (currentPayment - paymentUp) * 12;
    const rateImpactDown = (paymentDown - currentPayment) * 12;
    
    // Purchase price change sensitivity (±10%)
    const priceImpact = displayInputs.purchasePrice * 0.1;
    
    return [
      { 
        factor: 'Monthly Rent', 
        impact: Math.abs(rentIncrease), 
        description: '±10% change',
        ranking: 1
      },
      { 
        factor: 'Interest Rate', 
        impact: Math.abs(rateImpactUp), 
        description: '±1% change',
        ranking: 2
      },
      { 
        factor: 'Purchase Price', 
        impact: priceImpact * 0.05, // Approximate impact via yield change
        description: '±10% change',
        ranking: 3
      }
    ].sort((a, b) => b.impact - a.impact);
  };

  const sensitivityFactors = calculateSensitivity();

  // Prepare chart data
  const waterfallData = [
    { name: 'Rental Income', value: displayResults.grossAnnualRentalIncome, fill: '#14b8a6' },
    { name: 'Mortgage Payment', value: -displayResults.annualMortgagePayment, fill: '#ef4444' },
    { name: 'Operating Costs', value: -displayResults.totalAnnualOperatingExpenses, fill: '#f59e0b' },
    { name: 'Net Cash Flow', value: displayResults.annualCashFlow, fill: displayResults.annualCashFlow >= 0 ? '#10b981' : '#dc2626' }
  ];

  const yieldComparisonData = [
    { name: 'Gross Yield', value: displayResults.grossRentalYield * 100 },
    { name: 'Net Yield', value: displayResults.netRentalYield * 100 },
    { name: 'Cash on Cash', value: displayResults.cashOnCashReturn * 100 }
  ];

  const costBreakdownData = [
    { name: 'Service Charge', value: displayResults.annualServiceCharge, fill: '#1e2875' },
    { name: 'Maintenance', value: displayResults.annualMaintenanceCosts, fill: '#14b8a6' },
    { name: 'Property Management', value: displayResults.annualPropertyManagementFee, fill: '#6366f1' },
    { name: 'Mortgage', value: displayResults.annualMortgagePayment, fill: '#f59e0b' }
  ];

  const currentDate = new Date().toLocaleDateString('en-GB', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  });

  // Determine investment grade
  const getInvestmentGrade = () => {
    const netYield = displayResults.netRentalYield * 100;
    const cashFlow = displayResults.monthlyCashFlow;
    
    if (netYield >= 6 && cashFlow >= 0) {
      return { grade: 'Strong', color: 'text-success', bg: 'bg-success/10', border: 'border-success/30' };
    } else if (netYield >= 4 && cashFlow >= -1000) {
      return { grade: 'Moderate', color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/30' };
    } else {
      return { grade: 'Cautious', color: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/30' };
    }
  };

  const investmentGrade = getInvestmentGrade();

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Navigation */}
        <Link 
          to="/calculator" 
          className="inline-flex items-center space-x-2 text-sm text-neutral-600 hover:text-primary mb-8 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Calculator</span>
        </Link>

        {/* Report Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-border p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground mb-1">
                Property Investment Report
              </h1>
              <p className="text-neutral-600 mb-3">
                Yield and cashflow analysis in AED
              </p>
              <p className="text-xs text-neutral-500">
                YieldPulse powered by Constructive
              </p>
              <div className="flex items-center space-x-6 text-sm text-neutral-600 mt-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{currentDate}</span>
                </div>
                {displayInputs?.propertyName && (
                  <div>
                    <span className="font-medium text-foreground">{displayInputs.propertyName}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleDownloadPDF}
                disabled={!isPremiumUnlocked || generatingPDF || !pdfSnapshot}
                className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isPremiumUnlocked && pdfSnapshot
                    ? 'bg-teal text-white hover:bg-teal/90 shadow-sm'
                    : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                }`}
              >
                <Download className="w-4 h-4" />
                <span>{generatingPDF ? 'Generating...' : 'Download PDF'}</span>
                {!isPremiumUnlocked && <span className="text-xs">(premium only)</span>}
              </button>
              <button
                disabled
                className="inline-flex items-center space-x-2 px-4 py-2 bg-neutral-100 text-neutral-400 rounded-lg text-sm font-medium cursor-not-allowed"
              >
                <GitCompare className="w-4 h-4" />
                <span>Compare</span>
                <span className="text-xs">(coming next)</span>
              </button>
            </div>
          </div>
          <div className="flex items-start space-x-2 text-xs text-neutral-500 bg-muted/50 p-3 rounded-lg border border-border">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>
              This report is for informational purposes only and does not constitute financial, investment, or legal advice. 
              Consult with qualified professionals before making investment decisions.
            </p>
          </div>
        </div>

        {/* SAVE ENFORCEMENT BANNER - Show if authenticated but not saved */}
        {user && !isSaved && !analysisId && inputs && results && (
          <div className="bg-warning/10 border border-warning/30 rounded-xl p-6 mb-8">
            <div className="flex items-start space-x-4">
              <AlertCircle className="w-6 h-6 text-warning flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-2">
                  Save Report to Continue
                </h3>
                <p className="text-neutral-700 mb-4 leading-relaxed">
                  You must save this report to your dashboard before you can unlock premium features or compare properties.
                </p>
                <button
                  onClick={handleSaveReport}
                  disabled={saving}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FileText className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save Report to Dashboard'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Free Section: Executive Summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-border p-8 mb-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Executive Summary
              </h2>
              <p className="text-neutral-600">Key investment metrics at a glance</p>
            </div>
            <div className="px-4 py-2 bg-success/10 border border-success/30 rounded-lg">
              <span className="text-sm font-medium text-success">Free Preview</span>
            </div>
          </div>
          
          {/* KPI Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatCard
              label="Gross Yield"
              value={formatPercent(displayResults.grossRentalYield)}
              icon={TrendingUp}
              description="Annual rental income divided by purchase price"
              variant="navy"
            />
            <StatCard
              label="Net Yield"
              value={formatPercent(displayResults.netRentalYield)}
              icon={TrendingUp}
              description="After operating expenses"
              variant="teal"
            />
            <StatCard
              label="Cash on Cash Return"
              value={formatPercent(displayResults.cashOnCashReturn)}
              icon={TrendingUp}
              description="Return on invested capital"
              variant="warning"
            />
            <StatCard
              label="Monthly Cash Flow"
              value={formatCurrency(displayResults.monthlyCashFlow)}
              icon={DollarSign}
              description="Net income after all expenses"
              variant="success"
              trend={displayResults.monthlyCashFlow >= 0 ? 'positive' : 'negative'}
            />
            <StatCard
              label="Annual Cash Flow"
              value={formatCurrency(displayResults.annualCashFlow)}
              icon={DollarSign}
              description="Yearly net income"
              variant={displayResults.annualCashFlow >= 0 ? 'success' : 'warning'}
              trend={displayResults.annualCashFlow >= 0 ? 'positive' : 'negative'}
            />
            <StatCard
              label="Initial Investment"
              value={formatCurrency(displayResults.totalInitialInvestment)}
              icon={DollarSign}
              description="Down payment plus closing costs"
              variant="navy"
            />
          </div>

          {/* What This Means Section */}
          <div className={`${investmentGrade.bg} border ${investmentGrade.border} rounded-xl p-6`}>
            <div className="flex items-start space-x-3 mb-4">
              <Info className={`w-5 h-5 ${investmentGrade.color} flex-shrink-0 mt-0.5`} />
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-2">What This Means</h3>
                <div className="space-y-3 text-sm text-neutral-700 leading-relaxed">
                  <p>
                    <strong className={investmentGrade.color}>Investment Grade: {investmentGrade.grade}</strong>
                  </p>
                  
                  {displayResults.monthlyCashFlow >= 0 ? (
                    <p>
                      <strong>Positive Cash Flow:</strong> This property generates {formatCurrency(displayResults.monthlyCashFlow)} per month after all expenses including mortgage, operating costs, and vacancy allowance. This means the property pays for itself and provides additional monthly income.
                    </p>
                  ) : (
                    <p>
                      <strong>Negative Cash Flow:</strong> This property requires {formatCurrency(Math.abs(displayResults.monthlyCashFlow))} per month to cover the gap between rental income and total expenses. You will need to subsidize the property from other income, but may still benefit from capital appreciation and mortgage paydown.
                    </p>
                  )}

                  <p>
                    <strong>Yield Analysis:</strong> Your gross yield of {formatPercent(displayResults.grossRentalYield)} represents the annual rent as a percentage of purchase price. After accounting for operating expenses, your net yield is {formatPercent(displayResults.netRentalYield)}. For context, typical UAE residential yields range from 4% to 8% gross.
                  </p>

                  <p>
                    <strong>Return on Investment:</strong> Your cash on cash return of {formatPercent(displayResults.cashOnCashReturn)} measures the annual cash flow relative to your initial investment of {formatCurrency(displayResults.totalInitialInvestment)}. This shows how efficiently your down payment is working for you.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Metric Definitions */}
        <div className="bg-white rounded-2xl shadow-sm border border-border p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Understanding the Metrics
              </h2>
              <p className="text-neutral-600">Clear definitions of key terms</p>
            </div>
            <div className="px-4 py-2 bg-success/10 border border-success/30 rounded-lg">
              <span className="text-sm font-medium text-success">Free Preview</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-border rounded-xl p-5">
              <h4 className="font-semibold text-foreground mb-2">Gross Yield</h4>
              <p className="text-sm text-neutral-700 leading-relaxed">
                Annual rental income divided by purchase price. This is the headline return before any expenses. Use this to quickly compare properties, but always look at net yield for real returns.
              </p>
              <p className="text-xs text-neutral-500 mt-2">
                Formula: (Annual Rent ÷ Purchase Price) × 100
              </p>
            </div>

            <div className="border border-border rounded-xl p-5">
              <h4 className="font-semibold text-foreground mb-2">Net Yield</h4>
              <p className="text-sm text-neutral-700 leading-relaxed">
                Annual rental income minus operating expenses (service charges, maintenance, management fees), divided by purchase price. This is your true rental return before mortgage costs.
              </p>
              <p className="text-xs text-neutral-500 mt-2">
                Formula: (Net Operating Income ÷ Purchase Price) × 100
              </p>
            </div>

            <div className="border border-border rounded-xl p-5">
              <h4 className="font-semibold text-foreground mb-2">Cash Flow</h4>
              <p className="text-sm text-neutral-700 leading-relaxed">
                Net income after all expenses including mortgage payments, operating costs, and vacancy allowance. Positive cash flow means the property pays for itself. Negative means you subsidize it monthly.
              </p>
              <p className="text-xs text-neutral-500 mt-2">
                Formula: Rental Income - All Expenses - Mortgage
              </p>
            </div>

            <div className="border border-border rounded-xl p-5">
              <h4 className="font-semibold text-foreground mb-2">Cash on Cash Return</h4>
              <p className="text-sm text-neutral-700 leading-relaxed">
                Annual cash flow divided by your initial cash investment (down payment plus closing costs). This measures how hard your actual money is working. Higher is better for leveraged returns.
              </p>
              <p className="text-xs text-neutral-500 mt-2">
                Formula: (Annual Cash Flow ÷ Initial Investment) × 100
              </p>
            </div>
          </div>
        </div>

        {/* Sensitivity Analysis */}
        <div className="bg-white rounded-2xl shadow-sm border border-border p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Sensitivity Analysis
              </h2>
              <p className="text-neutral-600">Key factors that influence your returns</p>
            </div>
            <div className="px-4 py-2 bg-success/10 border border-success/30 rounded-lg">
              <span className="text-sm font-medium text-success">Free Preview</span>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-foreground mb-2">Most Influential Inputs</h4>
                <p className="text-sm text-neutral-700 leading-relaxed mb-4">
                  These three factors have the largest impact on your investment returns. Small changes to these inputs can significantly affect your cash flow and yield.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {sensitivityFactors.slice(0, 3).map((factor, index) => (
              <div key={index} className="border border-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <h4 className="font-semibold text-foreground">{factor.factor}</h4>
                  </div>
                  <span className="text-sm font-medium text-neutral-600">{factor.description}</span>
                </div>
                <div className="ml-11">
                  <p className="text-sm text-neutral-700">
                    Estimated annual cash flow impact: <strong className="text-primary">{formatCurrency(factor.impact)}</strong>
                  </p>
                  {index === 0 && (
                    <p className="text-xs text-neutral-500 mt-1">
                      Rental income is the most significant driver. Market research and realistic rent estimates are critical.
                    </p>
                  )}
                  {index === 1 && (
                    <p className="text-xs text-neutral-500 mt-1">
                      Interest rate changes affect mortgage payments. Consider fixing your rate to reduce this risk.
                    </p>
                  )}
                  {index === 2 && (
                    <p className="text-xs text-neutral-500 mt-1">
                      Purchase price determines your entry point. Negotiate hard and buy below market when possible.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-muted/50 rounded-lg p-4 border border-border">
            <p className="text-sm text-neutral-700 leading-relaxed">
              <strong>Risk Management:</strong> Given these sensitivities, ensure your rent estimate is based on recent comparable properties, secure a competitive interest rate, and negotiate the best possible purchase price. Consider stress testing with 10% lower rent or 1% higher interest rates.
            </p>
          </div>
        </div>

        {/* Premium Section */}
        <div className="relative bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
          {/* Premium Header */}
          <div className="bg-gradient-to-r from-primary to-primary-hover px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Sparkles className="w-5 h-5 text-primary-foreground" />
                  <h2 className="text-2xl font-bold text-primary-foreground">Premium Report Analysis</h2>
                </div>
                <p className="text-primary-foreground/90">Unlock comprehensive insights and detailed projections</p>
              </div>
              {!isPremiumUnlocked && (
                <div className="text-right">
                  <div className="text-4xl font-bold text-primary-foreground mb-1">AED 49</div>
                  <div className="text-sm text-primary-foreground/80">one time unlock</div>
                </div>
              )}
            </div>
          </div>

          {/* What's Included Panel */}
          {!isPremiumUnlocked && (
            <div className="bg-muted/30 border-b border-border px-8 py-6">
              <h3 className="font-semibold text-foreground mb-4">What You Get with Premium</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground text-sm">Visual Analysis Charts</p>
                    <p className="text-xs text-neutral-600">Interactive cash flow waterfall, yield comparison, and cost breakdown charts</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground text-sm">5 Year Financial Projection</p>
                    <p className="text-xs text-neutral-600">Year by year breakdown of property value, equity, and returns with growth assumptions</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground text-sm">Detailed Financial Tables</p>
                    <p className="text-xs text-neutral-600">Complete income statement, cost breakdown, and assumption audit trail</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground text-sm">Line Item Expense Detail</p>
                    <p className="text-xs text-neutral-600">Exact breakdown of every cost: service charges, maintenance, insurance, and more</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Premium Content */}
          <div className="p-8 space-y-10">
            
            {/* Charts Section */}
            <div>
              <h3 className="text-xl font-bold text-foreground mb-6">Visual Analysis</h3>
              
              <div className="grid lg:grid-cols-2 gap-8 mb-8">
                {/* Cashflow Waterfall Chart */}
                <div className="bg-muted/50 rounded-xl p-6 border border-border">
                  <h4 className="font-semibold text-foreground mb-4">Annual Cash Flow Breakdown</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={waterfallData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} angle={-15} textAnchor="end" height={80} />
                      <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                        {waterfallData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Yield Comparison Chart */}
                <div className="bg-muted/50 rounded-xl p-6 border border-border">
                  <h4 className="font-semibold text-foreground mb-4">Yield and Return Comparison</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={yieldComparisonData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} />
                      <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} tickFormatter={(value) => `${value.toFixed(1)}%`} />
                      <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
                      <Bar dataKey="value" fill="#1e2875" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Cost Breakdown Pie Chart */}
              <div className="bg-muted/50 rounded-xl p-6 border border-border">
                <h4 className="font-semibold text-foreground mb-4">Annual Cost Breakdown</h4>
                <div className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                      <Pie
                        data={costBreakdownData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {costBreakdownData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Tables Section */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Assumptions Table */}
              <div>
                <h3 className="text-xl font-bold text-foreground mb-4">Key Assumptions</h3>
                <div className="bg-muted/50 rounded-xl border border-border overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted">
                        <th className="text-left py-3 px-4 font-semibold text-foreground text-sm">Assumption</th>
                        <th className="text-right py-3 px-4 font-semibold text-foreground text-sm">Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {displayInputs && (
                        <>
                          <tr className="bg-white">
                            <td className="py-3 px-4 text-sm text-neutral-700">Purchase Price</td>
                            <td className="py-3 px-4 text-sm text-right font-medium text-foreground">{formatCurrency(displayInputs.purchasePrice)}</td>
                          </tr>
                          <tr className="bg-muted/50">
                            <td className="py-3 px-4 text-sm text-neutral-700">Down Payment</td>
                            <td className="py-3 px-4 text-sm text-right font-medium text-foreground">{displayInputs.downPaymentPercent}%</td>
                          </tr>
                          <tr className="bg-white">
                            <td className="py-3 px-4 text-sm text-neutral-700">Mortgage Interest Rate</td>
                            <td className="py-3 px-4 text-sm text-right font-medium text-foreground">{displayInputs.mortgageInterestRate}%</td>
                          </tr>
                          <tr className="bg-muted/50">
                            <td className="py-3 px-4 text-sm text-neutral-700">Mortgage Term</td>
                            <td className="py-3 px-4 text-sm text-right font-medium text-foreground">{displayInputs.mortgageTermYears} years</td>
                          </tr>
                          <tr className="bg-white">
                            <td className="py-3 px-4 text-sm text-neutral-700">Expected Monthly Rent</td>
                            <td className="py-3 px-4 text-sm text-right font-medium text-foreground">{formatCurrency(displayInputs.expectedMonthlyRent)}</td>
                          </tr>
                          {displayInputs.vacancyRatePercent !== undefined && (
                            <tr className="bg-muted/50">
                              <td className="py-3 px-4 text-sm text-neutral-700">Vacancy Rate</td>
                              <td className="py-3 px-4 text-sm text-right font-medium text-foreground">{displayInputs.vacancyRatePercent}%</td>
                            </tr>
                          )}
                          {displayInputs.capitalGrowthPercent !== undefined && (
                            <tr className="bg-white">
                              <td className="py-3 px-4 text-sm text-neutral-700">Capital Growth Rate</td>
                              <td className="py-3 px-4 text-sm text-right font-medium text-foreground">{displayInputs.capitalGrowthPercent}%</td>
                            </tr>
                          )}
                          {displayInputs.rentGrowthPercent !== undefined && (
                            <tr className="bg-muted/50">
                              <td className="py-3 px-4 text-sm text-neutral-700">Rent Growth Rate</td>
                              <td className="py-3 px-4 text-sm text-right font-medium text-foreground">{displayInputs.rentGrowthPercent}%</td>
                            </tr>
                          )}
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Financial Summary Table */}
              <div>
                <h3 className="text-xl font-bold text-foreground mb-4">Financial Summary</h3>
                <div className="bg-muted/50 rounded-xl border border-border overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted">
                        <th className="text-left py-3 px-4 font-semibold text-foreground text-sm">Category</th>
                        <th className="text-right py-3 px-4 font-semibold text-foreground text-sm">Annual Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      <tr className="bg-white">
                        <td className="py-3 px-4 text-sm font-semibold text-foreground" colSpan={2}>Income</td>
                      </tr>
                      <tr className="bg-muted/50">
                        <td className="py-3 px-4 text-sm text-neutral-700 pl-8">Gross Rental Income</td>
                        <td className="py-3 px-4 text-sm text-right font-medium text-foreground">{formatCurrency(displayResults.grossAnnualRentalIncome)}</td>
                      </tr>
                      <tr className="bg-white">
                        <td className="py-3 px-4 text-sm text-neutral-700 pl-8">Effective Rental Income</td>
                        <td className="py-3 px-4 text-sm text-right font-medium text-foreground">{formatCurrency(displayResults.effectiveAnnualRentalIncome)}</td>
                      </tr>
                      <tr className="bg-muted/50">
                        <td className="py-3 px-4 text-sm font-semibold text-foreground" colSpan={2}>Operating Expenses</td>
                      </tr>
                      <tr className="bg-white">
                        <td className="py-3 px-4 text-sm text-neutral-700 pl-8">Service Charge</td>
                        <td className="py-3 px-4 text-sm text-right font-medium text-foreground">{formatCurrency(displayResults.annualServiceCharge)}</td>
                      </tr>
                      <tr className="bg-muted/50">
                        <td className="py-3 px-4 text-sm text-neutral-700 pl-8">Maintenance</td>
                        <td className="py-3 px-4 text-sm text-right font-medium text-foreground">{formatCurrency(displayResults.annualMaintenanceCosts)}</td>
                      </tr>
                      <tr className="bg-white">
                        <td className="py-3 px-4 text-sm text-neutral-700 pl-8">Property Management</td>
                        <td className="py-3 px-4 text-sm text-right font-medium text-foreground">{formatCurrency(displayResults.annualPropertyManagementFee)}</td>
                      </tr>
                      <tr className="bg-muted/50">
                        <td className="py-3 px-4 text-sm font-semibold text-foreground" colSpan={2}>Results</td>
                      </tr>
                      <tr className="bg-white">
                        <td className="py-3 px-4 text-sm text-neutral-700 pl-8">Net Operating Income</td>
                        <td className="py-3 px-4 text-sm text-right font-semibold text-teal">{formatCurrency(displayResults.netOperatingIncome)}</td>
                      </tr>
                      <tr className="bg-muted/50">
                        <td className="py-3 px-4 text-sm text-neutral-700 pl-8">Annual Mortgage Payment</td>
                        <td className="py-3 px-4 text-sm text-right font-medium text-foreground">{formatCurrency(displayResults.annualMortgagePayment)}</td>
                      </tr>
                      <tr className="bg-white">
                        <td className="py-3 px-4 text-sm font-semibold text-foreground pl-8">Annual Cash Flow</td>
                        <td className={`py-3 px-4 text-sm text-right font-bold ${displayResults.annualCashFlow >= 0 ? 'text-success' : 'text-destructive'}`}>
                          {formatCurrency(displayResults.annualCashFlow)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Locked Overlay */}
          {!isPremiumUnlocked && (
            <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center max-w-lg px-6">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <Lock className="w-10 h-10 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  Unlock Complete Analysis
                </h3>
                <p className="text-neutral-700 mb-6 leading-relaxed">
                  Get instant access to interactive charts, detailed financial tables, 5 year projections, and complete cost breakdowns to make a confident investment decision.
                </p>
                <div className="bg-muted/50 rounded-lg p-4 mb-6 border border-border">
                  <p className="text-sm font-medium text-foreground mb-2">One time payment. Lifetime access to this report.</p>
                  <p className="text-xs text-neutral-600">View anytime from your dashboard. No recurring fees.</p>
                </div>
                <button 
                  disabled={creatingCheckout || !user || !analysisId}
                  className={`inline-flex items-center space-x-2 px-8 py-4 rounded-xl font-medium shadow-lg transition-all ${
                    !analysisId 
                      ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed' 
                      : 'bg-primary text-primary-foreground hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed'
                  }`}
                  onClick={handleUnlockPremium}
                >
                  <Lock className="w-5 h-5" />
                  <span>
                    {!analysisId && 'Save Report First'}
                    {analysisId && !user && 'Sign In to Unlock'}
                    {analysisId && user && (creatingCheckout ? 'Processing...' : 'Unlock for AED 49')}
                  </span>
                </button>
                {!user && (
                  <p className="text-sm text-neutral-500 mt-4">
                    <Link to="/auth/signin" className="text-primary hover:underline font-medium">Sign in</Link> to unlock premium reports
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sign In Prompt for Non Authenticated Users */}
        {!user && (
          <div className="mt-8 bg-success/10 border border-success/30 rounded-xl p-8">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-success/20 rounded-xl flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Save Your Analysis
                </h3>
                <p className="text-neutral-700 mb-6 leading-relaxed">
                  Sign in to save this analysis and access it anytime from your dashboard. 
                  Track multiple properties and compare investments side by side.
                </p>
                <Link 
                  to="/auth/signin"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary-hover transition-all"
                >
                  <span>Sign In to Save</span>
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Back to Calculator */}
        <div className="mt-10 text-center">
          <Link 
            to="/calculator"
            className="inline-flex items-center space-x-2 text-neutral-600 hover:text-primary font-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Calculate Another Property</span>
          </Link>
        </div>
      </div>
    </div>
  );
}