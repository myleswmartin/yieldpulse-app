import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calculator, TrendingUp, DollarSign, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { calculateROI, PropertyInputs, CalculationResults, formatCurrency, formatPercent } from '../utils/calculations';
import { supabase } from '../utils/supabaseClient';

export default function CalculatorPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [saving, setSaving] = useState(false);
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);

  const [formData, setFormData] = useState({
    portalSource: 'Bayut',
    listingUrl: '',
    purchasePrice: 1500000,
    areaSqft: 1000,
    expectedMonthlyRent: 8000,
    downPaymentPercent: 20,
    mortgageInterestRate: 5.5,
    mortgageTermYears: 25,
    serviceChargePerSqft: 15,
    propertyManagementFeePercent: 5,
    annualMaintenancePercent: 1,
    insuranceAnnual: 2000,
    vacancyRatePercent: 5,
    otherCostsAnnual: 1000,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'portalSource' || name === 'listingUrl' ? value : parseFloat(value) || 0
    }));
  };

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare inputs for calculation
    const inputs: PropertyInputs = {
      portalSource: formData.portalSource,
      listingUrl: formData.listingUrl,
      areaSqft: formData.areaSqft,
      purchasePrice: formData.purchasePrice,
      downPaymentPercent: formData.downPaymentPercent,
      mortgageInterestRate: formData.mortgageInterestRate,
      mortgageTermYears: formData.mortgageTermYears,
      expectedMonthlyRent: formData.expectedMonthlyRent,
      serviceChargeAnnual: formData.serviceChargePerSqft * formData.areaSqft,
      annualMaintenancePercent: formData.annualMaintenancePercent,
      propertyManagementFeePercent: formData.propertyManagementFeePercent,
      dldFeePercent: 4,
      agentFeePercent: 2,
      capitalGrowthPercent: 5,
      rentGrowthPercent: 3,
      vacancyRatePercent: formData.vacancyRatePercent,
      holdingPeriodYears: 5,
    };

    // Calculate ROI
    const calculatedResults = calculateROI(inputs);
    setResults(calculatedResults);

    // Save to database if user is signed in (direct client insert)
    if (user) {
      setSaving(true);
      try {
        const { error } = await supabase
          .from('analyses')
          .insert({
            portal_source: inputs.portalSource,
            listing_url: inputs.listingUrl,
            area_sqft: inputs.areaSqft,
            purchase_price: inputs.purchasePrice,
            down_payment_percent: inputs.downPaymentPercent,
            mortgage_interest_rate: inputs.mortgageInterestRate,
            mortgage_term_years: inputs.mortgageTermYears,
            expected_monthly_rent: inputs.expectedMonthlyRent,
            service_charge_annual: inputs.serviceChargeAnnual,
            annual_maintenance_percent: inputs.annualMaintenancePercent,
            property_management_fee_percent: inputs.propertyManagementFeePercent,
            gross_yield: calculatedResults.grossRentalYield,
            net_yield: calculatedResults.netRentalYield,
            monthly_cash_flow: calculatedResults.monthlyCashFlow,
            cash_on_cash_return: calculatedResults.cashOnCashReturn,
            calculation_results: calculatedResults,
            is_paid: false,
          });

        if (error) {
          console.error('Failed to save analysis:', error);
        }
      } catch (error) {
        console.error('Error saving analysis:', error);
      } finally {
        setSaving(false);
      }
    } else {
      // Show sign in prompt for non-authenticated users
      setShowSignInPrompt(true);
    }

    // Navigate to results page with data
    navigate('/results', { state: { inputs, results: calculatedResults } });
  };

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
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center space-x-3 mb-6">
            <Calculator className="w-8 h-8 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-900">UAE Property ROI Calculator</h2>
          </div>

          {showSignInPrompt && !user && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800">
                💡 <Link to="/auth/signin" className="font-semibold underline">Sign in</Link> or{' '}
                <Link to="/auth/signup" className="font-semibold underline">create an account</Link> to save your analyses and access them anytime from your dashboard.
              </p>
            </div>
          )}

          <form onSubmit={handleCalculate} className="space-y-6">
            {/* Portal & Listing URL */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Portal
                </label>
                <select
                  name="portalSource"
                  value={formData.portalSource}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option>Bayut</option>
                  <option>Property Finder</option>
                  <option>Dubizzle</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Listing URL (optional reference)
                </label>
                <input
                  type="url"
                  name="listingUrl"
                  value={formData.listingUrl}
                  onChange={handleInputChange}
                  placeholder="https://..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Property Details */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Purchase Price (AED)
                  </label>
                  <input
                    type="number"
                    name="purchasePrice"
                    value={formData.purchasePrice}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="1000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Size (sqft)
                  </label>
                  <input
                    type="number"
                    name="areaSqft"
                    value={formData.areaSqft}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Annual Rent (AED)
                  </label>
                  <input
                    type="number"
                    name="expectedMonthlyRent"
                    value={formData.expectedMonthlyRent}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter monthly rent amount</p>
                </div>
              </div>
            </div>

            {/* Financing */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Financing</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deposit (%)
                  </label>
                  <input
                    type="number"
                    name="downPaymentPercent"
                    value={formData.downPaymentPercent}
                    onChange={handleInputChange}
                    required
                    min="0"
                    max="100"
                    step="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interest Rate (%)
                  </label>
                  <input
                    type="number"
                    name="mortgageInterestRate"
                    value={formData.mortgageInterestRate}
                    onChange={handleInputChange}
                    required
                    min="0"
                    max="100"
                    step="0.1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mortgage Term (years)
                  </label>
                  <input
                    type="number"
                    name="mortgageTermYears"
                    value={formData.mortgageTermYears}
                    onChange={handleInputChange}
                    required
                    min="1"
                    max="30"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Operating Expenses */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Operating Expenses</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Charge (AED per sqft per year)
                  </label>
                  <input
                    type="number"
                    name="serviceChargePerSqft"
                    value={formData.serviceChargePerSqft}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Management Fee (%)
                  </label>
                  <input
                    type="number"
                    name="propertyManagementFeePercent"
                    value={formData.propertyManagementFeePercent}
                    onChange={handleInputChange}
                    required
                    min="0"
                    max="100"
                    step="0.1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maintenance (%)
                  </label>
                  <input
                    type="number"
                    name="annualMaintenancePercent"
                    value={formData.annualMaintenancePercent}
                    onChange={handleInputChange}
                    required
                    min="0"
                    max="100"
                    step="0.1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Insurance (AED per year)
                  </label>
                  <input
                    type="number"
                    name="insuranceAnnual"
                    value={formData.insuranceAnnual}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vacancy Rate (%)
                  </label>
                  <input
                    type="number"
                    name="vacancyRatePercent"
                    value={formData.vacancyRatePercent}
                    onChange={handleInputChange}
                    required
                    min="0"
                    max="100"
                    step="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Other Costs (AED per year)
                  </label>
                  <input
                    type="number"
                    name="otherCostsAnnual"
                    value={formData.otherCostsAnnual}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t">
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 shadow-lg flex items-center space-x-2 disabled:opacity-50"
              >
                <span>{saving ? 'Calculating...' : 'Calculate ROI'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* Quick Results Preview (shown on same page) */}
          {results && (
            <div className="mt-12 pt-8 border-t">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Results</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Gross Yield</span>
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{formatPercent(results.grossRentalYield)}</p>
                </div>

                <div className="bg-green-50 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Net Yield</span>
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{formatPercent(results.netRentalYield)}</p>
                </div>

                <div className="bg-purple-50 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Monthly Cash Flow</span>
                    <DollarSign className="w-5 h-5 text-purple-600" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{formatCurrency(results.monthlyCashFlow)}</p>
                </div>

                <div className="bg-orange-50 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Cash on Cash Return</span>
                    <TrendingUp className="w-5 h-5 text-orange-600" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{formatPercent(results.cashOnCashReturn)}</p>
                </div>
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={() => navigate('/results', { state: { inputs: formData, results } })}
                  className="text-blue-600 font-semibold hover:text-blue-700 flex items-center space-x-2 mx-auto"
                >
                  <span>View Detailed Analysis</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}