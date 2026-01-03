import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, TrendingUp, DollarSign, ArrowRight, Info, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { calculateROI, PropertyInputs, CalculationResults, formatCurrency, formatPercent } from '../utils/calculations';
import { supabase } from '../utils/supabaseClient';
import { Header } from '../components/Header';
import { Section } from '../components/Section';
import { StatCard } from '../components/StatCard';

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

    const calculatedResults = calculateROI(inputs);
    setResults(calculatedResults);

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
      setShowSignInPrompt(true);
    }

    navigate('/results', { state: { inputs, results: calculatedResults } });
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        {/* Page Header */}
        <div className="mb-12">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-primary rounded-xl shadow-sm">
              <Calculator className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">UAE Property ROI Calculator</h1>
              <p className="text-neutral-600 mt-1">Enter your property details to calculate investment returns</p>
            </div>
          </div>
        </div>

        {/* Sign In Prompt */}
        {showSignInPrompt && !user && (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-8">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Save Your Analysis</h3>
                <p className="text-neutral-700 mb-3">
                  <Link to="/auth/signin" className="font-medium text-primary hover:underline">Sign in</Link> or{' '}
                  <Link to="/auth/signup" className="font-medium text-primary hover:underline">create an account</Link> to save your analyses and access them anytime from your dashboard.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Calculator Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
          <form onSubmit={handleCalculate} className="divide-y divide-border">
            
            {/* Property Information Section */}
            <div className="p-8 lg:p-10">
              <div className="mb-6">
                <h2 className="font-semibold text-foreground mb-2">Property Information</h2>
                <p className="text-sm text-neutral-600">Basic details about the property</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Portal Source
                  </label>
                  <select
                    name="portalSource"
                    value={formData.portalSource}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                  >
                    <option>Bayut</option>
                    <option>Property Finder</option>
                    <option>Dubizzle</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Listing URL <span className="text-neutral-400 font-normal">(optional reference)</span>
                  </label>
                  <input
                    type="url"
                    name="listingUrl"
                    value={formData.listingUrl}
                    onChange={handleInputChange}
                    placeholder="https://..."
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Purchase Price <span className="text-neutral-500 font-normal">(AED)</span>
                  </label>
                  <input
                    type="number"
                    name="purchasePrice"
                    value={formData.purchasePrice}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="1000"
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Property Size <span className="text-neutral-500 font-normal">(sqft)</span>
                  </label>
                  <input
                    type="number"
                    name="areaSqft"
                    value={formData.areaSqft}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Rent Section */}
            <div className="p-8 lg:p-10">
              <div className="mb-6">
                <h2 className="font-semibold text-foreground mb-2">Rent Information</h2>
                <p className="text-sm text-neutral-600">Expected rental income</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Expected Monthly Rent <span className="text-neutral-500 font-normal">(AED)</span>
                  </label>
                  <input
                    type="number"
                    name="expectedMonthlyRent"
                    value={formData.expectedMonthlyRent}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                  />
                  <p className="mt-2 text-xs text-neutral-500">
                    Current market rent for similar properties in the area
                  </p>
                </div>
              </div>
            </div>

            {/* Financing Section */}
            <div className="p-8 lg:p-10">
              <div className="mb-6">
                <h2 className="font-semibold text-foreground mb-2">Financing</h2>
                <p className="text-sm text-neutral-600">Mortgage and down payment details</p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Down Payment <span className="text-neutral-500 font-normal">(%)</span>
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
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Interest Rate <span className="text-neutral-500 font-normal">(%)</span>
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
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Mortgage Term <span className="text-neutral-500 font-normal">(years)</span>
                  </label>
                  <input
                    type="number"
                    name="mortgageTermYears"
                    value={formData.mortgageTermYears}
                    onChange={handleInputChange}
                    required
                    min="1"
                    max="30"
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Operating Costs Section */}
            <div className="p-8 lg:p-10">
              <div className="mb-6">
                <h2 className="font-semibold text-foreground mb-2">Operating Costs</h2>
                <p className="text-sm text-neutral-600">Annual expenses and maintenance</p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Service Charge <span className="text-neutral-500 font-normal">(AED/sqft/year)</span>
                  </label>
                  <input
                    type="number"
                    name="serviceChargePerSqft"
                    value={formData.serviceChargePerSqft}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.1"
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Management Fee <span className="text-neutral-500 font-normal">(% of rent)</span>
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
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Annual Maintenance <span className="text-neutral-500 font-normal">(% of value)</span>
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
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Annual Insurance <span className="text-neutral-500 font-normal">(AED)</span>
                  </label>
                  <input
                    type="number"
                    name="insuranceAnnual"
                    value={formData.insuranceAnnual}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Other Annual Costs <span className="text-neutral-500 font-normal">(AED)</span>
                  </label>
                  <input
                    type="number"
                    name="otherCostsAnnual"
                    value={formData.otherCostsAnnual}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Assumptions Section */}
            <div className="p-8 lg:p-10">
              <div className="mb-6">
                <h2 className="font-semibold text-foreground mb-2">Assumptions</h2>
                <p className="text-sm text-neutral-600">Expected vacancy and market conditions</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Vacancy Rate <span className="text-neutral-500 font-normal">(%)</span>
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
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                  />
                  <p className="mt-2 text-xs text-neutral-500">
                    Expected percentage of time property will be vacant
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="p-8 lg:p-10 bg-muted/30">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-sm text-neutral-600">
                  All calculations use UAE specific fees (DLD 4%, agent 2%)
                </p>
                <button
                  type="submit"
                  disabled={saving}
                  className="group inline-flex items-center space-x-3 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary-hover hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>{saving ? 'Calculating...' : 'Calculate ROI'}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </form>

          {/* Quick Results Preview */}
          {results && (
            <div className="bg-gradient-to-br from-muted/50 to-white border-t border-border p-8">
              <h3 className="font-semibold text-foreground mb-6">Quick Results</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  label="Gross Yield"
                  value={formatPercent(results.grossRentalYield)}
                  icon={TrendingUp}
                  variant="navy"
                />
                <StatCard
                  label="Net Yield"
                  value={formatPercent(results.netRentalYield)}
                  icon={TrendingUp}
                  variant="teal"
                />
                <StatCard
                  label="Monthly Cash Flow"
                  value={formatCurrency(results.monthlyCashFlow)}
                  icon={DollarSign}
                  variant="success"
                  trend={results.monthlyCashFlow >= 0 ? 'positive' : 'negative'}
                />
                <StatCard
                  label="Cash on Cash Return"
                  value={formatPercent(results.cashOnCashReturn)}
                  icon={TrendingUp}
                  variant="warning"
                />
              </div>

              <div className="mt-8 text-center">
                <button
                  onClick={() => navigate('/results', { state: { inputs: formData, results } })}
                  className="inline-flex items-center space-x-2 text-primary font-medium hover:text-primary-hover transition-colors"
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