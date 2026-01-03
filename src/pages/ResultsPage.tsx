import { useLocation, Link } from 'react-router-dom';
import { TrendingUp, DollarSign, Lock, ArrowLeft, CheckCircle, FileText, Download, GitCompare, Calendar, Info } from 'lucide-react';
import { CalculationResults, formatCurrency, formatPercent, PropertyInputs } from '../utils/calculations';
import { useAuth } from '../contexts/AuthContext';
import { Header } from '../components/Header';
import { StatCard } from '../components/StatCard';
import { useState, useEffect } from 'react';
import { projectId } from '../../utils/supabase/info';
import { supabase } from '../utils/supabaseClient';
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

export default function ResultsPage() {
  const location = useLocation();
  const { user } = useAuth();
  
  const results = location.state?.results as CalculationResults | null;
  const inputs = location.state?.inputs as PropertyInputs | null;
  const savedAnalysis = location.state?.analysis;
  const fromDashboard = location.state?.fromDashboard;

  let displayResults = results;
  let displayInputs = inputs;
  let analysisId = savedAnalysis?.id;
  
  if (savedAnalysis && !results) {
    displayResults = savedAnalysis.calculation_results as CalculationResults;
    displayInputs = savedAnalysis.property_inputs as PropertyInputs;
  }

  // Premium unlock state
  const [isPremiumUnlocked, setIsPremiumUnlocked] = useState(false);
  const [checkingPurchaseStatus, setCheckingPurchaseStatus] = useState(false);
  const [creatingCheckout, setCreatingCheckout] = useState(false);

  // Check purchase status on mount if we have an analysis ID
  useEffect(() => {
    if (analysisId && user) {
      checkPurchaseStatus();
    }
  }, [analysisId, user]);

  const checkPurchaseStatus = async () => {
    if (!analysisId || !user) return;

    setCheckingPurchaseStatus(true);
    try {
      // Get user access token
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        console.error('No access token available');
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ef294769/purchases/status?analysisId=${analysisId}`,
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log('Purchase status:', data);
        if (data.status === 'paid') {
          setIsPremiumUnlocked(true);
        }
      }
    } catch (error) {
      console.error('Error checking purchase status:', error);
    } finally {
      setCheckingPurchaseStatus(false);
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
      // Get user access token
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        alert('Please sign in again to continue');
        return;
      }

      const currentOrigin = window.location.origin;
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ef294769/stripe/checkout-session`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            analysisId,
            origin: currentOrigin,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create checkout session');
      }

      const { url } = await response.json();
      
      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Failed to initiate payment. Please try again.');
    } finally {
      setCreatingCheckout(false);
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
              className="inline-flex items-center space-x-2 px-6 py-3 bg-[#1e2875] text-white rounded-lg font-semibold hover:bg-[#2f3aad] transition-all"
            >
              <span>Go to Calculator</span>
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Navigation */}
        <Link 
          to="/calculator" 
          className="inline-flex items-center space-x-2 text-sm text-neutral-600 hover:text-[#1e2875] mb-8 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Calculator</span>
        </Link>

        {/* Report Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-neutral-900 mb-1">
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
                    <span className="font-medium text-neutral-900">{displayInputs.propertyName}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                disabled
                className="inline-flex items-center space-x-2 px-4 py-2 bg-neutral-100 text-neutral-400 rounded-lg text-sm font-medium cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
                <span className="text-xs">(coming next)</span>
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
          <div className="flex items-start space-x-2 text-xs text-neutral-500 bg-neutral-50 p-3 rounded-lg border border-neutral-200">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>
              This report is for informational purposes only and does not constitute financial, investment, or legal advice. 
              Consult with qualified professionals before making investment decisions.
            </p>
          </div>
        </div>

        {/* Free Section: Executive Summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-8 mb-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                Executive Summary
              </h2>
              <p className="text-neutral-600">Key investment metrics at a glance</p>
            </div>
            <div className="px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
              <span className="text-sm font-semibold text-emerald-700">Free Preview</span>
            </div>
          </div>
          
          {/* KPI Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          </div>
        </div>

        {/* Premium Section */}
        <div className="relative bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
          {/* Premium Header */}
          <div className="bg-gradient-to-r from-[#1e2875] to-[#2f3aad] px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Premium Report Analysis</h2>
                <p className="text-white/90">Detailed charts, projections, and financial tables</p>
              </div>
              {!isPremiumUnlocked && (
                <div className="text-right">
                  <div className="text-4xl font-bold text-white mb-1">AED 49</div>
                  <div className="text-sm text-white/80">one time unlock</div>
                </div>
              )}
            </div>
          </div>

          {/* Premium Content */}
          <div className="p-8 space-y-10">
            
            {/* Charts Section */}
            <div>
              <h3 className="text-xl font-bold text-neutral-900 mb-6">Visual Analysis</h3>
              
              <div className="grid lg:grid-cols-2 gap-8 mb-8">
                {/* Cashflow Waterfall Chart */}
                <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-200">
                  <h4 className="font-semibold text-neutral-900 mb-4">Annual Cash Flow Breakdown</h4>
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
                <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-200">
                  <h4 className="font-semibold text-neutral-900 mb-4">Yield and Return Comparison</h4>
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
              <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-200">
                <h4 className="font-semibold text-neutral-900 mb-4">Annual Cost Breakdown</h4>
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
                <h3 className="text-xl font-bold text-neutral-900 mb-4">Key Assumptions</h3>
                <div className="bg-neutral-50 rounded-xl border border-neutral-200 overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-neutral-100">
                        <th className="text-left py-3 px-4 font-semibold text-neutral-700 text-sm">Assumption</th>
                        <th className="text-right py-3 px-4 font-semibold text-neutral-700 text-sm">Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {displayInputs && (
                        <>
                          <tr className="bg-white">
                            <td className="py-3 px-4 text-sm text-neutral-700">Purchase Price</td>
                            <td className="py-3 px-4 text-sm text-right font-medium text-neutral-900">{formatCurrency(displayInputs.purchasePrice)}</td>
                          </tr>
                          <tr className="bg-neutral-50">
                            <td className="py-3 px-4 text-sm text-neutral-700">Down Payment</td>
                            <td className="py-3 px-4 text-sm text-right font-medium text-neutral-900">{displayInputs.downPaymentPercent}%</td>
                          </tr>
                          <tr className="bg-white">
                            <td className="py-3 px-4 text-sm text-neutral-700">Mortgage Interest Rate</td>
                            <td className="py-3 px-4 text-sm text-right font-medium text-neutral-900">{displayInputs.mortgageInterestRate}%</td>
                          </tr>
                          <tr className="bg-neutral-50">
                            <td className="py-3 px-4 text-sm text-neutral-700">Mortgage Term</td>
                            <td className="py-3 px-4 text-sm text-right font-medium text-neutral-900">{displayInputs.mortgageTermYears} years</td>
                          </tr>
                          <tr className="bg-white">
                            <td className="py-3 px-4 text-sm text-neutral-700">Expected Monthly Rent</td>
                            <td className="py-3 px-4 text-sm text-right font-medium text-neutral-900">{formatCurrency(displayInputs.expectedMonthlyRent)}</td>
                          </tr>
                          <tr className="bg-neutral-50">
                            <td className="py-3 px-4 text-sm text-neutral-700">Vacancy Rate</td>
                            <td className="py-3 px-4 text-sm text-right font-medium text-neutral-900">{displayInputs.vacancyRatePercent}%</td>
                          </tr>
                          <tr className="bg-white">
                            <td className="py-3 px-4 text-sm text-neutral-700">Capital Growth Rate</td>
                            <td className="py-3 px-4 text-sm text-right font-medium text-neutral-900">{displayInputs.capitalGrowthPercent}%</td>
                          </tr>
                          <tr className="bg-neutral-50">
                            <td className="py-3 px-4 text-sm text-neutral-700">Rent Growth Rate</td>
                            <td className="py-3 px-4 text-sm text-right font-medium text-neutral-900">{displayInputs.rentGrowthPercent}%</td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Financial Summary Table */}
              <div>
                <h3 className="text-xl font-bold text-neutral-900 mb-4">Financial Summary</h3>
                <div className="bg-neutral-50 rounded-xl border border-neutral-200 overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-neutral-100">
                        <th className="text-left py-3 px-4 font-semibold text-neutral-700 text-sm">Category</th>
                        <th className="text-right py-3 px-4 font-semibold text-neutral-700 text-sm">Annual Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      <tr className="bg-white">
                        <td className="py-3 px-4 text-sm font-semibold text-neutral-900" colSpan={2}>Income</td>
                      </tr>
                      <tr className="bg-neutral-50">
                        <td className="py-3 px-4 text-sm text-neutral-700 pl-8">Gross Rental Income</td>
                        <td className="py-3 px-4 text-sm text-right font-medium text-neutral-900">{formatCurrency(displayResults.grossAnnualRentalIncome)}</td>
                      </tr>
                      <tr className="bg-white">
                        <td className="py-3 px-4 text-sm text-neutral-700 pl-8">Effective Rental Income</td>
                        <td className="py-3 px-4 text-sm text-right font-medium text-neutral-900">{formatCurrency(displayResults.effectiveAnnualRentalIncome)}</td>
                      </tr>
                      <tr className="bg-neutral-50">
                        <td className="py-3 px-4 text-sm font-semibold text-neutral-900" colSpan={2}>Operating Expenses</td>
                      </tr>
                      <tr className="bg-white">
                        <td className="py-3 px-4 text-sm text-neutral-700 pl-8">Service Charge</td>
                        <td className="py-3 px-4 text-sm text-right font-medium text-neutral-900">{formatCurrency(displayResults.annualServiceCharge)}</td>
                      </tr>
                      <tr className="bg-neutral-50">
                        <td className="py-3 px-4 text-sm text-neutral-700 pl-8">Maintenance</td>
                        <td className="py-3 px-4 text-sm text-right font-medium text-neutral-900">{formatCurrency(displayResults.annualMaintenanceCosts)}</td>
                      </tr>
                      <tr className="bg-white">
                        <td className="py-3 px-4 text-sm text-neutral-700 pl-8">Property Management</td>
                        <td className="py-3 px-4 text-sm text-right font-medium text-neutral-900">{formatCurrency(displayResults.annualPropertyManagementFee)}</td>
                      </tr>
                      <tr className="bg-neutral-50">
                        <td className="py-3 px-4 text-sm font-semibold text-neutral-900" colSpan={2}>Results</td>
                      </tr>
                      <tr className="bg-white">
                        <td className="py-3 px-4 text-sm text-neutral-700 pl-8">Net Operating Income</td>
                        <td className="py-3 px-4 text-sm text-right font-semibold text-[#14b8a6]">{formatCurrency(displayResults.netOperatingIncome)}</td>
                      </tr>
                      <tr className="bg-neutral-50">
                        <td className="py-3 px-4 text-sm text-neutral-700 pl-8">Annual Mortgage Payment</td>
                        <td className="py-3 px-4 text-sm text-right font-medium text-neutral-900">{formatCurrency(displayResults.annualMortgagePayment)}</td>
                      </tr>
                      <tr className="bg-white">
                        <td className="py-3 px-4 text-sm font-semibold text-neutral-900 pl-8">Annual Cash Flow</td>
                        <td className={`py-3 px-4 text-sm text-right font-bold ${displayResults.annualCashFlow >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
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
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center max-w-md px-6">
                <div className="w-20 h-20 bg-[#1e2875] rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <Lock className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-3">
                  Unlock Premium Report
                </h3>
                <p className="text-neutral-600 mb-6 leading-relaxed">
                  Get access to detailed charts, 5 year projections, sensitivity analysis, and comprehensive financial tables for AED 49
                </p>
                <button 
                  disabled={creatingCheckout}
                  className="inline-flex items-center space-x-2 px-8 py-4 bg-[#1e2875] text-white rounded-xl font-semibold shadow-lg hover:bg-[#2f3aad] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleUnlockPremium}
                >
                  <Lock className="w-5 h-5" />
                  <span>{creatingCheckout ? 'Processing...' : 'Unlock for AED 49'}</span>
                </button>
                {!user && (
                  <p className="text-sm text-neutral-500 mt-4">
                    Please sign in to unlock premium reports
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sign In Prompt for Non Authenticated Users */}
        {!user && (
          <div className="mt-8 bg-emerald-50 border border-emerald-200 rounded-xl p-8">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-emerald-100 rounded-xl flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                  Save Your Analysis
                </h3>
                <p className="text-neutral-700 mb-6 leading-relaxed">
                  Sign in to save this analysis and access it anytime from your dashboard. 
                  Track multiple properties and compare investments side by side.
                </p>
                <Link 
                  to="/auth/signin"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-[#1e2875] text-white rounded-lg font-semibold hover:bg-[#2f3aad] transition-all"
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
            className="inline-flex items-center space-x-2 text-neutral-600 hover:text-[#1e2875] font-semibold transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Calculate Another Property</span>
          </Link>
        </div>
      </div>
    </div>
  );
}