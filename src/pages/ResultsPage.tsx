import { useLocation, Link, useSearchParams } from 'react-router-dom';
import { TrendingUp, DollarSign, Lock, ArrowLeft, CheckCircle, FileText, Download, GitCompare, Calendar, Info, AlertCircle, Sparkles, Save, UserPlus, LogIn, Shield, Home, Share2 } from 'lucide-react';
import { CalculationResults, formatCurrency, formatPercent, PropertyInputs } from '../utils/calculations';
import { useAuth } from '../contexts/AuthContext';
import { Header } from '../components/Header';
import { StatCard } from '../components/StatCard';
import { PremiumReport } from '../components/PremiumReport';
import { PremiumCTA } from '../components/PremiumCTA';
import { PremiumPreviewStrip } from '../components/PremiumPreviewStrip';
import { LockedPremiumSection } from '../components/LockedPremiumSection';
import { ShareModal } from '../components/ShareModal';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../utils/supabaseClient';
import { generatePDF } from '../utils/pdfGenerator';
import { showSuccess, handleError } from '../utils/errorHandling';
import { trackPdfDownload, trackPremiumUnlock } from '../utils/analytics';
import { checkPurchaseStatus, createCheckoutSession, saveAnalysis, createGuestCheckoutSession, createShareLink, claimGuestPurchase } from '../utils/apiClient';
import { buildPendingSignature, getSyncedAnalysisId } from '../utils/pendingAnalysis';
import { usePublicPricing } from '../utils/usePublicPricing';
import { toast } from 'sonner';

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
      propertyName: parseString(analysis.property_name),
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
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { priceLabel } = usePublicPricing();
  
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
  const [notes, setNotes] = useState<string | null>(savedAnalysis?.notes || null);

  // Premium unlock state
  const [isPremiumUnlocked, setIsPremiumUnlocked] = useState(!!savedAnalysis?.is_paid);
  const [checkingPurchaseStatus, setCheckingPurchaseStatus] = useState(false);
  const [creatingCheckout, setCreatingCheckout] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [claimingGuestPurchase, setClaimingGuestPurchase] = useState(false);

  const reportRef = useRef<HTMLDivElement | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [creatingShareLink, setCreatingShareLink] = useState(false);
  
  // Admin preview toggle (UI only, does not bypass payment)
  const [adminPreviewEnabled, setAdminPreviewEnabled] = useState(false);
  
  // Determine if premium should be shown
  const showPremiumContent = isPremiumUnlocked || (user?.isAdmin && adminPreviewEnabled);

  // Check purchase status on mount if we have an analysis ID
  useEffect(() => {
    if (analysisId && user) {
      checkPaymentStatus();
    }
  }, [analysisId, user]);

  useEffect(() => {
    const attemptGuestClaim = async () => {
      if (!user || analysisId || isPremiumUnlocked || claimingGuestPurchase) return;

      const purchaseIdFromQuery = searchParams.get('purchaseId');
      let purchaseId = purchaseIdFromQuery;

      if (!purchaseId) {
        try {
          purchaseId = localStorage.getItem('yieldpulse-guest-purchase-id') || null;
        } catch (err) {
          purchaseId = null;
        }
      }

      if (!purchaseId) return;

      setClaimingGuestPurchase(true);
      try {
        const { data, error } = await claimGuestPurchase(purchaseId);
        if (error) {
          console.warn('Guest claim failed:', error.error);
          return;
        }
        if (data?.analysisId) {
          setAnalysisId(data.analysisId);
          setIsSaved(true);
          setIsPremiumUnlocked(true);
          }
      } finally {
        setClaimingGuestPurchase(false);
      }
    };

    attemptGuestClaim();
  }, [user, analysisId, isPremiumUnlocked, claimingGuestPurchase, searchParams]);

  useEffect(() => {
    if (!user || analysisId || !displayInputs || !displayResults) return;
    const signature = buildPendingSignature(displayInputs, displayResults);
    if (!signature) return;
    const syncedId = getSyncedAnalysisId(signature);
    if (syncedId) {
      setAnalysisId(syncedId);
      setIsSaved(true);
    }
  }, [user, analysisId, displayInputs, displayResults]);

  // Fetch notes if we have an analysisId but no notes yet
  useEffect(() => {
    const fetchNotes = async () => {
      if (analysisId && !notes && user) {
        try {
          const { data, error } = await supabase
            .from('analyses')
            .select('notes')
            .eq('id', analysisId)
            .single();
          
          if (!error && data?.notes) {
            setNotes(data.notes);
          }
        } catch (error) {
          console.error('Error fetching notes:', error);
        }
      }
    };
    
    fetchNotes();
  }, [analysisId, user]);

  const checkPaymentStatus = async () => {
    if (!analysisId || !user) return;

    setCheckingPurchaseStatus(true);

    try {
      const { data, error, requestId } = await checkPurchaseStatus(analysisId);

      if (error) {
        // If it's a 401 error, the user has been signed out - silently fail
        if (error.status === 401) {
          console.log('Session expired during purchase status check - user has been signed out');
          setCheckingPurchaseStatus(false);
          return;
        }
        
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
      }
    } catch (error: any) {
      console.error('Error checking purchase status:', error);
      handleError(error.message || 'An unexpected error occurred', 'Check Purchase Status');
    } finally {
      setCheckingPurchaseStatus(false);
    }
  };
  
  const handleDownloadPDF = async () => {
    if (!displayInputs || !displayResults) {
      handleError('PDF export is not ready yet. Please try again.', 'Download PDF');
      return;
    }

    const safeName = (displayInputs?.propertyName || 'YieldPulse_Report')
      .replace(/[^a-z0-9]/gi, '_')
      .slice(0, 50);
    const dateStamp = new Date().toISOString().split('T')[0];
    const fileName = `YieldPulse_${safeName}_${dateStamp}.pdf`;

    setGeneratingPDF(true);
    let timeoutId: number | undefined;
    try {
      const timeoutPromise = new Promise<void>((_, reject) => {
        timeoutId = window.setTimeout(() => {
          reject(new Error('PDF export timed out. Please try again.'));
        }, 45000);
      });
      const snapshot = {
        inputs: {
          portal_source: displayInputs.propertyName || displayInputs.portalSource || undefined,
          listing_url: displayInputs.listingUrl || undefined,
          purchase_price: displayInputs.purchasePrice ?? 0,
          expected_monthly_rent: displayInputs.expectedMonthlyRent ?? 0,
          down_payment_percent: displayInputs.downPaymentPercent ?? 0,
          mortgage_interest_rate: displayInputs.mortgageInterestRate ?? 0,
          loan_term_years: displayInputs.mortgageTermYears ?? 0,
          service_charge_per_year: displayInputs.serviceChargeAnnual ?? 0,
          maintenance_per_year: displayInputs.annualMaintenancePercent ?? 0,
          property_management_fee: displayInputs.propertyManagementFeePercent ?? 0,
          vacancy_rate: displayInputs.vacancyRatePercent ?? 0,
          rent_growth_rate: displayInputs.rentGrowthPercent ?? 0,
          capital_growth_rate: displayInputs.capitalGrowthPercent ?? 0,
          holding_period_years: displayInputs.holdingPeriodYears ?? 0,
          area_sqft: displayInputs.areaSqft ?? 0,
        },
        results: {
          grossYield: displayResults.grossRentalYield ?? 0,
          netYield: displayResults.netRentalYield ?? 0,
          cashOnCashReturn: displayResults.cashOnCashReturn ?? 0,
          capRate: displayResults.capRate ?? 0,
          monthlyCashFlow: displayResults.monthlyCashFlow ?? 0,
          annualCashFlow: displayResults.annualCashFlow ?? 0,
          monthlyMortgagePayment: displayResults.monthlyMortgagePayment ?? 0,
          totalOperatingCosts: displayResults.totalAnnualOperatingExpenses ?? 0,
          monthlyIncome:
            (displayResults.effectiveAnnualRentalIncome ?? 0) / 12 ||
            (displayInputs.expectedMonthlyRent ?? 0),
          annualIncome: (
            displayResults.effectiveAnnualRentalIncome ??
            displayResults.grossAnnualRentalIncome ??
            (displayInputs.expectedMonthlyRent ?? 0) * 12
          ),
          costPerSqft: displayResults.costPerSqft ?? undefined,
          rentPerSqft: displayResults.rentPerSqft ?? undefined,
        },
      };

      const purchaseDate =
        savedAnalysis?.purchased_at ||
        savedAnalysis?.created_at ||
        new Date().toISOString();

      await Promise.race([
        generatePDF(snapshot, purchaseDate),
        timeoutPromise,
      ]);
      showSuccess('PDF downloaded successfully!');
      trackPdfDownload();
    } catch (error) {
      console.error('Error generating PDF:', error);
      handleError(error, 'Generate PDF', handleDownloadPDF);
    } finally {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
      setGeneratingPDF(false);
    }
  };

  
  const handleShare = async () => {
    if (!user) {
      handleError('Please sign in to share reports.', 'Share Report');
      return;
    }

    if (!analysisId && (!displayInputs || !displayResults)) {
      handleError('Please save the report before sharing.', 'Share Report');
      return;
    }

    setCreatingShareLink(true);
    try {
      const payload = analysisId
        ? { analysisId, propertyName: displayInputs?.propertyName }
        : { inputs: displayInputs, results: displayResults, propertyName: displayInputs?.propertyName };

      const { data, error } = await createShareLink(payload);

      if (error) {
        handleError(error.error || 'Failed to create share link.', 'Share Report');
        return;
      }

      if (data?.shareUrl) {
        setShareUrl(data.shareUrl);
        setShowShareModal(true);
      }
    } catch (error) {
      console.error('Error creating share link:', error);
      handleError(error, 'Share Report', handleShare);
    } finally {
      setCreatingShareLink(false);
    }
  };

const handleUnlockPremium = async () => {
    setCreatingCheckout(true);
    
    try {
      const currentOrigin = window.location.origin;
      
      // NEW FLOW: Use guest checkout for everyone
      // If user is logged in AND has saved the report, use authenticated checkout
      if (user && analysisId) {
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
      } else {
        // Guest checkout for non-authenticated users OR users who haven't saved
        if (!inputs || !displayResults) {
          handleError('Analysis data not available. Please try again.', 'Create Checkout');
          return;
        }

        const { data, error, requestId } = await createGuestCheckoutSession({
          inputs,
          results: displayResults,
          origin: currentOrigin,
        });

        if (error) {
          console.error('Error creating guest checkout session:', error);
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
      }
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      handleError(error.message || 'Failed to initiate payment. Please try again.', 'Create Checkout');
    } finally {
      setCreatingCheckout(false);
    }
  };
  
  
  
  const handleSaveReport = async () => {
    const payloadInputs = (inputs ?? displayInputs) as PropertyInputs | null;
    const payloadResults = (results ?? displayResults) as CalculationResults | null;

    if (!user || !payloadInputs || !payloadResults) return;

    setSaving(true);
    
    try {
      console.log('💾 [ResultsPage] Saving analysis with data:', {
        hasPropertyName: !!payloadInputs.propertyName,
        propertyName: payloadInputs.propertyName,
        portalSource: payloadInputs.portalSource
      });
      
      const { data, error, requestId } = await saveAnalysis({
        inputs: payloadInputs,
        results: payloadResults,
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

  // Calculate additional derived values for premium sections
  const vacancyAmount = displayResults ? displayResults.grossAnnualRentalIncome * (displayInputs?.vacancyRatePercent || 0) / 100 : 0;
  
  // Calculate first-year principal and interest breakdown
  const calculateFirstYearAmortization = () => {
    if (!displayInputs || !displayResults) return { principal: 0, interest: 0 };
    
    const loanAmount = displayResults.loanAmount;
    const monthlyRate = displayInputs.mortgageInterestRate / 12 / 100;
    const monthlyPayment = displayResults.monthlyMortgagePayment;
    
    let remainingBalance = loanAmount;
    let totalPrincipal = 0;
    let totalInterest = 0;
    
    for (let month = 1; month <= 12; month++) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      
      totalInterest += interestPayment;
      totalPrincipal += principalPayment;
      remainingBalance -= principalPayment;
    }
    
    return { principal: totalPrincipal, interest: totalInterest };
  };
  
  const firstYearAmortization = calculateFirstYearAmortization();
  const totalInterestOverTerm = displayResults && displayInputs 
    ? (displayResults.monthlyMortgagePayment * displayInputs.mortgageTermYears * 12) - displayResults.loanAmount
    : 0;

  // Calculate selling fee for exit scenario
  const sellingFee = displayResults?.projection?.[4] 
    ? displayResults.projection[4].propertyValue * 0.02 
    : 0;

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

  // Get personalized upgrade message based on results
  const getPersonalizedMessage = () => {
    if (displayResults.annualCashFlow < 0) {
      return "Your cash flow is negative in year one. The Premium Report shows whether it turns positive over time and what your year 5 exit looks like.";
    }
    
    if (investmentGrade.grade === 'Moderate' || investmentGrade.grade === 'Cautious') {
      return "Your grade suggests caution. The Premium Report shows the exact levers to improve returns and stress tests the downside.";
    }
    
    return "Your headline metrics look promising. The Premium Report validates the assumptions, projects year 5 outcomes, and quantifies downside risk.";
  };

  // Scroll to locked premium section element
  const handlePreviewScroll = (itemId: string) => {
    const element = document.getElementById(itemId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      // Fallback to locked premium section
      const lockedSection = document.getElementById('locked-premium-section');
      if (lockedSection) {
        lockedSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Scroll to see included content
  const handleSeeIncluded = () => {
    const lockedSection = document.getElementById('locked-premium-section');
    if (lockedSection) {
      lockedSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      {generatingPDF && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="flex items-center gap-4 rounded-xl bg-white px-6 py-5 shadow-xl">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            <div>
              <p className="text-sm font-semibold text-foreground">Generating PDF</p>
              <p className="text-xs text-neutral-600">This may take a few seconds. Please keep this tab open.</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* REPORT SAVED CONFIRMATION - Show when saved */}
        {user && isSaved && analysisId && (
          <div className="bg-white border border-border rounded-xl p-4 mb-8 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              {/* LEFT: Status + Navigation */}
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">

                {/* Saved badge */}
                <div className="flex items-center gap-2 px-4 py-2 bg-success/10 border border-success/30 rounded-lg w-fit">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span className="text-sm font-semibold text-success">
                    Saved to Dashboard
                  </span>
                </div>

                {/* Divider (desktop only) */}
                <div className="hidden lg:block h-4 w-px bg-border"></div>

                {/* Back links */}
                <div className="flex flex-wrap gap-2">
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-neutral-700 hover:text-primary transition-colors rounded-lg hover:bg-neutral-100"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                  </Link>

                  <Link
                    to="/calculator"
                    className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-neutral-700 hover:text-primary transition-colors rounded-lg hover:bg-neutral-100"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Calculator
                  </Link>
                </div>
              </div>

              {/* RIGHT: Actions */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">

                {/* Export PDF */}
                <button
                  onClick={handleDownloadPDF}
                  disabled={!isPremiumUnlocked || generatingPDF}
                  className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all w-full sm:w-auto ${isPremiumUnlocked
                      ? 'bg-teal text-white hover:bg-teal/90 shadow-sm'
                      : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                    } cursor-pointer`}
                >
                  <Download className="w-4 h-4" />
                  {generatingPDF ? 'Generating...' : 'Export PDF'}
                </button>

                {/* Share */}
                <button
                  onClick={handleShare}
                  disabled={!displayInputs || !displayResults || creatingShareLink}
                  className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all w-full sm:w-auto ${displayInputs && displayResults
                      ? 'bg-white border border-border text-neutral-700 hover:bg-neutral-50'
                      : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                    } cursor-pointer`}
                >
                  <Share2 className="w-4 h-4" />
                  {creatingShareLink ? 'Creating Link...' : 'Share'}
                </button>
                {/* Compare */}
                <Link
                  to="/comparison"
                  state={{ analysisId }}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 w-full sm:w-auto bg-white border border-border text-neutral-700 rounded-lg text-sm font-medium hover:bg-neutral-50 transition-all"
                >
                  <GitCompare className="w-4 h-4" />
                  Compare
                </Link>
              </div>
            </div>
          </div>

        )}

        {/* ADMIN PREVIEW TOGGLE - Only visible to admin users */}
        {user?.isAdmin && !isPremiumUnlocked && (
          <div className="bg-gradient-to-r from-secondary/10 to-primary/10 border-2 border-secondary/30 rounded-xl p-4 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-secondary" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Admin Preview Mode</p>
                  <p className="text-xs text-neutral-600">UI toggle only - does not bypass payment</p>
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-sm font-medium text-neutral-700">Show premium</span>
                <input
                  type="checkbox"
                  checked={adminPreviewEnabled}
                  onChange={(e) => setAdminPreviewEnabled(e.target.checked)}
                  className="w-5 h-5 rounded border-neutral-300 text-primary focus:ring-primary cursor-pointer"
                />
              </label>
            </div>
          </div>
        )}

        {/* SAVE ENFORCEMENT BANNER - Show if authenticated but not saved */}
        {user && !isSaved && !analysisId && inputs && results && (
          <div className="bg-gradient-to-r from-primary/10 via-secondary/5 to-primary/10 border-2 border-primary/30 rounded-xl p-6 mb-8 shadow-sm">
            <div className="flex items-start space-x-4">
              <div className="p-2.5 bg-primary rounded-lg flex-shrink-0">
                <Save className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-foreground mb-1.5">
                  One More Step to Unlock Premium
                </h3>
                <p className="text-neutral-600 mb-4 leading-relaxed text-sm">
                  Save this analysis to enable comparisons, track your portfolio, and purchase the full PDF report.
                </p>
                <button
                  onClick={handleSaveReport}
                  disabled={saving}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary-hover transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save to My Dashboard'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SAVE REPORT SECTION - For non-authenticated users */}
        {!user && inputs && results && (
          <div className="bg-gradient-to-br from-primary/5 via-white to-secondary/5 border-2 border-primary/20 rounded-2xl p-8 mb-8 shadow-lg">
            <div className="flex items-start gap-6">
              <div className="p-4 bg-gradient-to-br from-primary to-primary-hover rounded-2xl flex-shrink-0 shadow-md">
                <Save className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-bold text-foreground">
                    Don't Lose This Analysis
                  </h3>
                  <span className="px-3 py-1 bg-success/10 border border-success/30 rounded-full text-xs font-semibold text-success">
                    100% FREE
                  </span>
                </div>
                <p className="text-neutral-600 mb-6 leading-relaxed text-lg">
                  Save to your dashboard, then unlock the full investor-grade PDF report with detailed charts, projections, and insights for just {priceLabel}.
                </p>
                
                {/* Value propositions */}
                <div className="grid md:grid-cols-3 gap-4 mb-6 pb-6 border-b border-neutral-200">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">Save Analysis Free</p>
                      <p className="text-xs text-neutral-500">Access anytime</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">Compare Properties</p>
                      <p className="text-xs text-neutral-500">Side-by-side view</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Lock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">Full PDF Report</p>
                      <p className="text-xs text-neutral-500">{priceLabel} to unlock</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    to="/auth/signup"
                    state={{ from: location.pathname, inputs, results }}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary-hover transition-all shadow-md hover:shadow-lg hover:scale-[1.02]"
                  >
                    <UserPlus className="w-5 h-5" />
                    <span>Save Report - It's Free</span>
                  </Link>
                  <button
                    onClick={handleUnlockPremium}
                    disabled={creatingCheckout}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal to-teal/90 text-white rounded-xl font-semibold hover:from-teal/90 hover:to-teal/80 transition-all shadow-md hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Lock className="w-5 h-5" />
                    <span>{creatingCheckout ? 'Processing...' : `Unlock Premium - ${priceLabel}`}</span>
                  </button>
                  <Link
                    to="/auth/signin"
                    state={{ from: location.pathname, inputs, results }}
                    className="inline-flex items-center gap-2 px-6 py-4 bg-white text-primary border-2 border-primary/30 rounded-xl font-medium hover:bg-primary/5 hover:border-primary transition-all"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Already have an account?</span>
                  </Link>
                </div>
                <p className="text-xs text-neutral-500 mt-3 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  No credit card required • Takes 30 seconds • Instant access
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Free Section: Executive Summary */}
        {!showPremiumContent && (
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
              label="Cap Rate"
              value={formatPercent(displayResults.capRate)}
              icon={TrendingUp}
              description="Net operating income divided by purchase price"
              variant="success"
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
            <StatCard
              label="Cost per sq ft"
              value={formatCurrency(displayResults.costPerSqft)}
              icon={Home}
              description="Purchase price per square foot (BUA)"
              variant="teal"
            />
            <StatCard
              label="Rent per sq ft (Annual)"
              value={formatCurrency(displayResults.rentPerSqft)}
              icon={Home}
              description="Annual rental income per square foot"
              variant="warning"
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
        )}

        {/* CONVERSION LAYER: Premium CTA after Executive Summary (only show if not unlocked) */}
        {!showPremiumContent && (
          <PremiumCTA 
            onUnlock={handleUnlockPremium}
            onSeeIncluded={handleSeeIncluded}
            isLoading={creatingCheckout}
            personalizedMessage={getPersonalizedMessage()}
          />
        )}

        {/* CONVERSION LAYER: Premium Preview Strip (only show if not unlocked) */}
        {!showPremiumContent && (
          <PremiumPreviewStrip onPreviewClick={handlePreviewScroll} />
        )}

        {/* Metric Definitions */}
        {!showPremiumContent && (
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
        )}

        {/* Sensitivity Analysis */}
        {!showPremiumContent && (
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
        )}
        
        {/* Premium Section */}
        {showPremiumContent && displayResults && displayInputs ? (
          <div ref={reportRef} className="pdf-export-scope">
            <PremiumReport
            displayResults={displayResults}
            displayInputs={displayInputs}
            vacancyAmount={vacancyAmount}
            firstYearAmortization={firstYearAmortization}
            totalInterestOverTerm={totalInterestOverTerm}
            sellingFee={sellingFee}
            analysisId={analysisId}
            notes={notes}
          />
          </div>
        ) : (
          <>
            {/* CONVERSION LAYER: Locked Premium Section with CTA */}
            <div id="locked-premium-section">
              <LockedPremiumSection 
                onUnlock={handleUnlockPremium}
                isLoading={creatingCheckout}
              />
            </div>
          </>
        )}

        {/* Sign In Prompt for Non Authenticated Users */}
        {!user && (
          <div className="mt-8 bg-gradient-to-br from-primary/10 via-secondary/5 to-primary/5 border-2 border-primary/30 rounded-xl p-8">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-primary rounded-xl flex-shrink-0">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Ready for the Full Report?
                </h3>
                <p className="text-neutral-700 mb-4 leading-relaxed">
                  Sign in to save this analysis free, compare 2-4 properties, and unlock investor-grade PDF reports for {priceLabel} each.
                </p>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span>Free to save & compare</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <Lock className="w-4 h-4 text-primary" />
                    <span>{priceLabel} for full PDF</span>
                  </div>
                </div>
                <Link 
                  to="/auth/signin"
                  state={{ inputs: displayInputs, results: displayResults }}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary-hover transition-all shadow-md hover:shadow-lg"
                >
                  <span>Sign In to Continue</span>
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
      
      {/* Share Modal */}
      {showShareModal && shareUrl && (
        <ShareModal
          shareUrl={shareUrl}
          propertyName={displayInputs?.propertyName || 'Investment Property'}
          onClose={() => setShowShareModal(false)}
        />
      )}
</div>
    </div>
  );
}
