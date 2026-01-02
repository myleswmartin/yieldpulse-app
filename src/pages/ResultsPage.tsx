import { useLocation, Link } from 'react-router-dom';
import { TrendingUp, DollarSign, Lock, ArrowLeft } from 'lucide-react';
import { CalculationResults, formatCurrency, formatPercent } from '../utils/calculations';
import { useAuth } from '../contexts/AuthContext';

export default function ResultsPage() {
  const location = useLocation();
  const { user } = useAuth();
  
  // Handle both new calculations and saved analyses
  const results = location.state?.results as CalculationResults | null;
  const savedAnalysis = location.state?.analysis;
  const fromDashboard = location.state?.fromDashboard;

  // If viewing from dashboard, reconstruct results from saved analysis
  let displayResults = results;
  if (savedAnalysis && !results) {
    // Use the stored calculation_results if available
    displayResults = savedAnalysis.calculation_results as CalculationResults;
  }

  if (!displayResults) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">No results to display</p>
          <Link 
            to="/calculator" 
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            Go to Calculator
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <TrendingUp className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">YieldPulse</h1>
            </Link>
            <Link to="/calculator" className="text-gray-600 hover:text-gray-900 flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Calculator</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Investment Analysis Results</h2>
          <p className="text-gray-600">Comprehensive ROI analysis for your UAE property investment</p>
        </div>

        {/* Free Summary Cards */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Key Metrics Summary</h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Gross Yield</span>
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{formatPercent(displayResults.grossRentalYield)}</p>
              <p className="text-xs text-gray-500 mt-2">Annual rental income / Purchase price</p>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Net Yield</span>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{formatPercent(displayResults.netRentalYield)}</p>
              <p className="text-xs text-gray-500 mt-2">After operating expenses</p>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Monthly Cash Flow</span>
                <DollarSign className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(displayResults.monthlyCashFlow)}</p>
              <p className="text-xs text-gray-500 mt-2">Net income after all expenses</p>
            </div>

            <div className="bg-orange-50 p-6 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Cash on Cash Return</span>
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{formatPercent(displayResults.cashOnCashReturn)}</p>
              <p className="text-xs text-gray-500 mt-2">Return on invested capital</p>
            </div>
          </div>

          {/* Additional Free Metrics */}
          <div className="border-t pt-6">
            <h4 className="font-semibold text-gray-900 mb-4">Financial Overview</h4>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Initial Investment</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(displayResults.totalInitialInvestment)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Annual Rental Income</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(displayResults.grossAnnualRentalIncome)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Annual Cash Flow</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(displayResults.annualCashFlow)}</p>
              </div>
            </div>
          </div>

          <div className="border-t mt-6 pt-6">
            <h4 className="font-semibold text-gray-900 mb-4">Operating Expenses</h4>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Service Charge</p>
                <p className="text-lg font-semibold text-gray-900">{formatCurrency(displayResults.annualServiceCharge)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Maintenance</p>
                <p className="text-lg font-semibold text-gray-900">{formatCurrency(displayResults.annualMaintenanceCosts)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Management Fee</p>
                <p className="text-lg font-semibold text-gray-900">{formatCurrency(displayResults.annualPropertyManagementFee)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Section (Locked) */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg shadow-lg p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
          <div className="relative">
            <div className="flex items-center space-x-3 mb-6">
              <Lock className="w-8 h-8" />
              <h3 className="text-2xl font-bold">Unlock Full Investment Report</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white bg-opacity-10 p-4 rounded-lg backdrop-blur-sm">
                <p className="font-semibold mb-2">📊 5 Year Projections</p>
                <p className="text-sm text-blue-100">Year by year cash flow and ROI analysis</p>
              </div>
              <div className="bg-white bg-opacity-10 p-4 rounded-lg backdrop-blur-sm">
                <p className="font-semibold mb-2">📈 Sensitivity Analysis</p>
                <p className="text-sm text-blue-100">Vacancy, interest rate, and rent scenarios</p>
              </div>
              <div className="bg-white bg-opacity-10 p-4 rounded-lg backdrop-blur-sm">
                <p className="font-semibold mb-2">💰 Exit Strategy</p>
                <p className="text-sm text-blue-100">Sale proceeds and total return calculations</p>
              </div>
              <div className="bg-white bg-opacity-10 p-4 rounded-lg backdrop-blur-sm">
                <p className="font-semibold mb-2">📄 PDF Report</p>
                <p className="text-sm text-blue-100">Professional downloadable investment report</p>
              </div>
            </div>

            <div className="text-center">
              <p className="text-3xl font-bold mb-2">AED 49</p>
              <p className="text-blue-100 mb-6">One time payment for full access</p>
              <button 
                disabled
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold shadow-lg hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Coming Soon
              </button>
              <p className="text-sm text-blue-100 mt-4">Payment integration will be available soon</p>
            </div>
          </div>
        </div>

        {/* Sign in prompt for non-authenticated users */}
        {!user && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-2">💾 Save Your Analysis</h4>
            <p className="text-gray-700 mb-4">
              Sign in to save this analysis and access it anytime from your dashboard. Track multiple properties and compare investments.
            </p>
            <Link 
              to="/auth/signin"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700"
            >
              Sign In to Save
            </Link>
          </div>
        )}

        {/* Back to Calculator */}
        <div className="mt-8 text-center">
          <Link 
            to="/calculator"
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Calculate Another Property</span>
          </Link>
        </div>
      </div>
    </div>
  );
}