import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, TrendingUp, DollarSign, ArrowRight, Info, AlertCircle, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { calculateROI, PropertyInputs, CalculationResults, formatCurrency, formatPercent } from '../utils/calculations';
import { saveAnalysis } from '../utils/apiClient';
import { Header } from '../components/Header';
import { StatCard } from '../components/StatCard';
import { Tooltip } from '../components/Tooltip';
import { showSuccess, showInfo, handleError } from '../utils/errorHandling';

interface FieldWarning {
  field: string;
  message: string;
  severity: 'warning' | 'info';
}

export default function CalculatorPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [saving, setSaving] = useState(false);
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);
  const [warnings, setWarnings] = useState<FieldWarning[]>([]);

  const savePendingAnalysis = (payload: { inputs: PropertyInputs; results: CalculationResults }) => {
    try {
      const key = 'yieldpulse-pending-analyses';
      const raw = localStorage.getItem(key);
      const existing = raw ? JSON.parse(raw) : [];
      const next = Array.isArray(existing) ? existing : [];
      next.push({ ...payload, createdAt: new Date().toISOString() });
      localStorage.setItem(key, JSON.stringify(next));
    } catch (err) {
      console.warn('Failed to save pending analysis to localStorage:', err);
    }
  };


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

  const validateAndWarn = (name: string, value: number): string | null => {
    const newWarnings: FieldWarning[] = warnings.filter(w => w.field !== name);

    switch (name) {
      case 'purchasePrice':
        if (value < 300000) {
          newWarnings.push({ field: name, message: 'Purchase price is unusually low for UAE property. Typical range: AED 500K to AED 50M+', severity: 'warning' });
        } else if (value > 50000000) {
          newWarnings.push({ field: name, message: 'Very high value property. Ensure all costs are proportionally accurate.', severity: 'info' });
        }
        break;
      
      case 'expectedMonthlyRent':
        const annualRent = value * 12;
        const currentYield = (annualRent / formData.purchasePrice) * 100;
        if (currentYield < 2) {
          newWarnings.push({ field: name, message: `Gross yield of ${currentYield.toFixed(1)}% is below typical UAE range (4-8%). Consider reviewing rent or purchase price.`, severity: 'warning' });
        } else if (currentYield > 12) {
          newWarnings.push({ field: name, message: `Gross yield of ${currentYield.toFixed(1)}% is unusually high. Verify rent estimate is realistic.`, severity: 'warning' });
        }
        break;

      case 'downPaymentPercent':
        if (value < 20) {
          newWarnings.push({ field: name, message: 'UAE banks typically require minimum 20% down payment for expats, 15% for UAE nationals.', severity: 'info' });
        } else if (value > 50) {
          newWarnings.push({ field: name, message: 'High down payment reduces leverage and may impact cash on cash returns.', severity: 'info' });
        }
        break;

      case 'mortgageInterestRate':
        if (value < 3) {
          newWarnings.push({ field: name, message: 'Interest rate below 3% is uncommon in UAE. Current market rates typically 4.5% to 6.5%.', severity: 'warning' });
        } else if (value > 8) {
          newWarnings.push({ field: name, message: 'Interest rate above 8% is high for UAE mortgages. Verify with your bank.', severity: 'warning' });
        }
        break;

      case 'serviceChargePerSqft':
        if (value < 5) {
          newWarnings.push({ field: name, message: 'Service charge below AED 5/sqft is very low. Check with developer or community.', severity: 'warning' });
        } else if (value > 30) {
          newWarnings.push({ field: name, message: 'Service charge above AED 30/sqft is high. Common range is AED 10-25/sqft.', severity: 'info' });
        }
        break;

      case 'propertyManagementFeePercent':
        if (value > 10) {
          newWarnings.push({ field: name, message: 'Property management fees above 10% are high. Typical UAE range is 5-8% of annual rent.', severity: 'warning' });
        }
        break;

      case 'vacancyRatePercent':
        if (value > 15) {
          newWarnings.push({ field: name, message: 'Vacancy rate above 15% significantly impacts returns. UAE average is 5-10%.', severity: 'warning' });
        } else if (value === 0) {
          newWarnings.push({ field: name, message: 'Zero vacancy is optimistic. Consider 5% for conservative estimates.', severity: 'info' });
        }
        break;
    }

    setWarnings(newWarnings);
    return null;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numValue = name === 'portalSource' || name === 'listingUrl' ? value : parseFloat(value) || 0;
    
    setFormData(prev => ({
      ...prev,
      [name]: numValue
    }));

    // Validate numeric fields
    if (name !== 'portalSource' && name !== 'listingUrl') {
      validateAndWarn(name, numValue as number);
    }
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
        const { data, error, requestId } = await saveAnalysis({
          inputs,
          results: calculatedResults,
        });

        if (error) {
          console.error('Failed to save analysis:', error);
          handleError(
            error.error || 'Failed to save analysis. Please try again before viewing results.',
            'Save Analysis',
            () => handleCalculate(e),
            requestId
          );
          setSaving(false);
          return; // CRITICAL: Block navigation if save fails
        }

        if (data?.id) {
          showSuccess('Analysis saved successfully');
          // Navigate WITH analysisId only on successful save
          navigate('/results', { 
            state: { 
              inputs, 
              results: calculatedResults, 
              analysisId: data.id,
              isSaved: true 
            } 
          });
        } else {
          handleError('Analysis saved but no ID returned. Please try again.');
          setSaving(false);
          return;
        }
      } catch (error: any) {
        console.error('Error saving analysis:', error);
        handleError(
          error.message || 'An unexpected error occurred while saving. Please try again.',
          'Save Analysis',
          () => handleCalculate(e)
        );
        setSaving(false);
        return; // CRITICAL: Block navigation on error
      } finally {
        setSaving(false);
      }
    } else {
      // Unauthenticated users: navigate with in-memory state only
      setShowSignInPrompt(true);
      savePendingAnalysis({ inputs, results: calculatedResults });
      navigate('/results', { 
        state: { 
          inputs, 
          results: calculatedResults,
          isSaved: false 
        } 
      });
    }
  };

  const handleRetrySave = async () => {
    if (!results || !user) return;

    setSaving(true);

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

    try {
      const { error, requestId } = await saveAnalysis({
        inputs,
        results,
      });

      if (error) {
        handleError(error.error || 'Failed to save analysis. Please try again later.', 'Retry Save', undefined, requestId);
      } else {
        showSuccess('Analysis saved successfully');
      }
    } catch (error: any) {
      handleError(error.message || 'An unexpected error occurred. Please try again.', 'Retry Save');
    } finally {
      setSaving(false);
    }
  };

  // Calculate key assumptions for summary panel
  const totalMonthlyPayment = results ? (
    results.annualMortgagePayment / 12 +
    results.totalAnnualOperatingExpenses / 12
  ) : 0;

  const effectiveYield = results ? (
    ((formData.expectedMonthlyRent * 12) * (1 - formData.vacancyRatePercent / 100)) / formData.purchasePrice * 100
  ) : 0;

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

        {/* Field Warnings */}
        {warnings.length > 0 && (
          <div className="bg-warning/10 border border-warning/30 rounded-xl p-5 mb-8 space-y-3">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-warning mb-2">Input Guidance</p>
                <ul className="space-y-2">
                  {warnings.map((warning, idx) => (
                    <li key={idx} className="text-sm text-warning/90">
                      • {warning.message}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-warning/70 mt-3">These are guidance notes only. You can proceed with your inputs.</p>
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
                <p className="text-sm text-neutral-600">Basic details about the property you are analyzing</p>
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
                  <p className="mt-1.5 text-xs text-neutral-500">Where did you find this listing?</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Listing URL <span className="text-neutral-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="url"
                    name="listingUrl"
                    value={formData.listingUrl}
                    onChange={handleInputChange}
                    placeholder="https://..."
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                  />
                  <p className="mt-1.5 text-xs text-neutral-500">Link to the property listing for your reference</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2 flex items-center space-x-2">
                    <span>Purchase Price <span className="text-neutral-500 font-normal">(AED)</span></span>
                    <Tooltip content="The asking price or agreed purchase price of the property. This is the most significant factor affecting your returns." />
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
                  <p className="mt-1.5 text-xs text-neutral-500">Total property cost before fees</p>
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
                  <p className="mt-1.5 text-xs text-neutral-500">Built up area in square feet</p>
                </div>
              </div>
            </div>

            {/* Rent Section */}
            <div className="p-8 lg:p-10">
              <div className="mb-6">
                <h2 className="font-semibold text-foreground mb-2">Rent Information</h2>
                <p className="text-sm text-neutral-600">Expected rental income from the property</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2 flex items-center space-x-2">
                    <span>Expected Monthly Rent <span className="text-neutral-500 font-normal">(AED)</span></span>
                    <Tooltip content="Current market rent for similar properties in the area. Check recent listings on Bayut or Property Finder for comparable units. This is the second most influential factor after purchase price." />
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
                    Market rent for similar properties. Typical UAE yields: 4% to 8%.
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
                  <label className="block text-sm font-medium text-foreground mb-2 flex items-center space-x-2">
                    <span>Down Payment <span className="text-neutral-500 font-normal">(%)</span></span>
                    <Tooltip content="Percentage of purchase price paid upfront. UAE banks require minimum 20% for expats, 15% for nationals. Higher down payment means less leverage but lower debt service." />
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
                  <p className="mt-1.5 text-xs text-neutral-500">Default: 20% (UAE minimum for expats)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2 flex items-center space-x-2">
                    <span>Interest Rate <span className="text-neutral-500 font-normal">(%)</span></span>
                    <Tooltip content="Annual mortgage interest rate. Current UAE rates typically range from 4.5% to 6.5% depending on your bank and profile. This significantly impacts monthly payments and returns." />
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
                  <p className="mt-1.5 text-xs text-neutral-500">Default: 5.5% (current UAE market average)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2 flex items-center space-x-2">
                    <span>Mortgage Term <span className="text-neutral-500 font-normal">(years)</span></span>
                    <Tooltip content="Length of mortgage in years. UAE maximum is typically 25 years for expats, 30 years for nationals. Longer terms reduce monthly payments but increase total interest paid." />
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
                  <p className="mt-1.5 text-xs text-neutral-500">Default: 25 years (UAE standard)</p>
                </div>
              </div>
            </div>

            {/* Operating Costs Section */}
            <div className="p-8 lg:p-10">
              <div className="mb-6">
                <h2 className="font-semibold text-foreground mb-2">Operating Costs</h2>
                <p className="text-sm text-neutral-600">Annual expenses and maintenance for the property</p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2 flex items-center space-x-2">
                    <span>Service Charge <span className="text-neutral-500 font-normal">(AED/sqft/year)</span></span>
                    <Tooltip content="Annual community or building service charge per square foot. Covers maintenance of common areas, security, and amenities. Check with developer or building management." />
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
                  <p className="mt-1.5 text-xs text-neutral-500">Default: AED 15/sqft (typical UAE range: 10-25)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2 flex items-center space-x-2">
                    <span>Management Fee <span className="text-neutral-500 font-normal">(% of rent)</span></span>
                    <Tooltip content="Property management company fee if you hire professional management. Covers tenant sourcing, rent collection, maintenance coordination. Optional if self managing." />
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
                  <p className="mt-1.5 text-xs text-neutral-500">Default: 5% (UAE standard: 5-8% of annual rent)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2 flex items-center space-x-2">
                    <span>Annual Maintenance <span className="text-neutral-500 font-normal">(% of value)</span></span>
                    <Tooltip content="Annual maintenance and repair budget as percentage of property value. Covers appliance repairs, painting, wear and tear. Typically 0.5% to 2% depending on property age." />
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
                  <p className="mt-1.5 text-xs text-neutral-500">Default: 1% (standard maintenance reserve)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2 flex items-center space-x-2">
                    <span>Annual Insurance <span className="text-neutral-500 font-normal">(AED)</span></span>
                    <Tooltip content="Property and contents insurance. Typically required by mortgage lender. Cost varies by property value and coverage level." />
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
                  <p className="mt-1.5 text-xs text-neutral-500">Default: AED 2,000 (typical for AED 1.5M property)</p>
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
                  <p className="mt-1.5 text-xs text-neutral-500">Miscellaneous costs (chiller, inspections, etc.)</p>
                </div>
              </div>
            </div>

            {/* Assumptions Section */}
            <div className="p-8 lg:p-10">
              <div className="mb-6">
                <h2 className="font-semibold text-foreground mb-2">Risk Assumptions</h2>
                <p className="text-sm text-neutral-600">Expected vacancy and market conditions</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2 flex items-center space-x-2">
                    <span>Vacancy Rate <span className="text-neutral-500 font-normal">(%)</span></span>
                    <Tooltip content="Expected percentage of time property will be vacant between tenants. Even well managed properties experience some vacancy. Conservative estimate is 5-10% for UAE market." />
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
                    Default: 5% (conservative assumption for UAE market)
                  </p>
                </div>
              </div>
            </div>

            {/* Assumptions Summary Panel */}
            {formData.purchasePrice > 0 && formData.expectedMonthlyRent > 0 && (
              <div className="p-8 lg:p-10 bg-primary/5 border-t border-border">
                <div className="flex items-start space-x-3 mb-4">
                  <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">Key Assumptions Summary</h3>
                    <p className="text-sm text-neutral-600 mb-4">Review these key drivers before calculating</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-border">
                    <p className="text-xs text-neutral-500 mb-1">Initial Investment</p>
                    <p className="font-semibold text-foreground">{formatCurrency(formData.purchasePrice * formData.downPaymentPercent / 100)}</p>
                    <p className="text-xs text-neutral-500 mt-1">{formData.downPaymentPercent}% down + closing costs</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-border">
                    <p className="text-xs text-neutral-500 mb-1">Gross Yield Est.</p>
                    <p className="font-semibold text-foreground">{((formData.expectedMonthlyRent * 12 / formData.purchasePrice) * 100).toFixed(2)}%</p>
                    <p className="text-xs text-neutral-500 mt-1">Before expenses</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-border">
                    <p className="text-xs text-neutral-500 mb-1">Loan Amount</p>
                    <p className="font-semibold text-foreground">{formatCurrency(formData.purchasePrice * (100 - formData.downPaymentPercent) / 100)}</p>
                    <p className="text-xs text-neutral-500 mt-1">at {formData.mortgageInterestRate}% for {formData.mortgageTermYears} years</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-border">
                    <p className="text-xs text-neutral-500 mb-1">Service Charge</p>
                    <p className="font-semibold text-foreground">{formatCurrency(formData.serviceChargePerSqft * formData.areaSqft)}</p>
                    <p className="text-xs text-neutral-500 mt-1">per year</p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="p-8 lg:p-10 bg-muted/30">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm text-neutral-600">
                  <p className="font-medium mb-1">Calculation includes:</p>
                  <ul className="text-xs space-y-0.5">
                    <li>• Dubai Land Department (DLD) fee: 4%</li>
                    <li>• Real estate agent commission: 2%</li>
                    <li>• 5 year projection with 5% capital growth, 3% rent growth</li>
                  </ul>
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="group inline-flex items-center space-x-3 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary-hover hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
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