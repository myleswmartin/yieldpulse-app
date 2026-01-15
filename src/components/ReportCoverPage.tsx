import { TrendingUp } from 'lucide-react';
import { PropertyInputs } from '../utils/calculations';

interface ReportCoverPageProps {
  displayInputs: PropertyInputs;
  isSampleMode?: boolean;
}

export function ReportCoverPage({ displayInputs, isSampleMode = false }: ReportCoverPageProps) {
  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  // Provide default values for all fields to prevent undefined errors
  const safeInputs = {
    propertyName: displayInputs.propertyName || 'Property Investment',
    propertyType: displayInputs.propertyType || 'Residential',
    location: displayInputs.location || 'UAE',
    areaSqft: displayInputs.areaSqft || 0,
    purchasePrice: displayInputs.purchasePrice || 0,
    expectedMonthlyRent: displayInputs.expectedMonthlyRent || 0,
    downPaymentPercent: displayInputs.downPaymentPercent || 0,
    holdingPeriodYears: displayInputs.holdingPeriodYears || 5,
    mortgageInterestRate: displayInputs.mortgageInterestRate || 0,
    mortgageTermYears: displayInputs.mortgageTermYears || 0,
    serviceChargeAnnual: displayInputs.serviceChargeAnnual || 0,
    capitalGrowthPercent: displayInputs.capitalGrowthPercent || 0,
    rentGrowthPercent: displayInputs.rentGrowthPercent || 0,
    vacancyRatePercent: displayInputs.vacancyRatePercent || 0,
    listingUrl: displayInputs.listingUrl || '',
  };

  return (
    <section className="pdf-section page-break-after mb-8">
      {/* YieldPulse Branding */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-primary/20">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-br from-primary to-primary-hover rounded-xl shadow-md">
            <TrendingUp className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-primary">YieldPulse</h1>
            <p className="text-sm text-neutral-600">UAE Property Investment Analysis</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-neutral-500 uppercase tracking-wide">Report Date</p>
          <p className="text-sm font-semibold text-foreground">{currentDate}</p>
        </div>
      </div>

      {/* Report Title */}
      <div className="mb-8 text-center">
        <div className="mb-3">
          {isSampleMode && (
            <span className="inline-block px-4 py-1.5 bg-warning/20 border border-warning/40 rounded-full text-xs font-semibold text-foreground uppercase tracking-wide mb-4">
              Sample Report
            </span>
          )}
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Premium Investment Report
        </h2>
        <p className="text-base text-neutral-600">
          Comprehensive ROI Analysis & Financial Projections
        </p>
      </div>

      {/* Property Information */}
      <div className="bg-gradient-to-br from-neutral-50 to-white rounded-2xl border-2 border-neutral-200 p-6 mb-6">
        <h3 className="text-lg font-bold text-foreground mb-4 pb-2 border-b border-neutral-200">
          Property Details
        </h3>
        
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-4">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1">Property Name</p>
              <p className="text-base font-semibold text-foreground">{safeInputs.propertyName}</p>
            </div>
            
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1">Property Type</p>
              <p className="text-base font-semibold text-foreground">{safeInputs.propertyType}</p>
            </div>
            
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1">Location</p>
              <p className="text-base font-semibold text-foreground">{safeInputs.location}</p>
            </div>
            
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1">Area</p>
              <p className="text-base font-semibold text-foreground">{safeInputs.areaSqft.toLocaleString()} sq ft</p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1">Purchase Price</p>
              <p className="text-base font-semibold text-foreground">AED {safeInputs.purchasePrice.toLocaleString()}</p>
            </div>
            
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1">Expected Monthly Rent</p>
              <p className="text-base font-semibold text-foreground">AED {safeInputs.expectedMonthlyRent.toLocaleString()}</p>
            </div>
            
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1">Down Payment</p>
              <p className="text-base font-semibold text-foreground">{safeInputs.downPaymentPercent}%</p>
            </div>
            
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1">Holding Period</p>
              <p className="text-base font-semibold text-foreground">{safeInputs.holdingPeriodYears} Years</p>
            </div>
          </div>
        </div>

        {/* Listing URL - Full Width */}
        {safeInputs.listingUrl && (
          <div className="mt-4 pt-4 border-t border-neutral-200">
            <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1">Listing URL</p>
            <p className="text-base font-semibold text-foreground break-all">{safeInputs.listingUrl}</p>
          </div>
        )}
      </div>

      {/* Financing & Assumptions */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Financing Terms */}
        <div className="bg-white rounded-xl border border-neutral-200 p-4">
          <h3 className="text-base font-bold text-foreground mb-3 pb-2 border-b border-neutral-200">
            Financing Terms
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-neutral-600">Mortgage Interest Rate:</span>
              <span className="text-sm font-semibold text-foreground">{safeInputs.mortgageInterestRate}% p.a.</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-neutral-600">Mortgage Term:</span>
              <span className="text-sm font-semibold text-foreground">{safeInputs.mortgageTermYears} years</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-neutral-600">Service Charge:</span>
              <span className="text-sm font-semibold text-foreground">AED {safeInputs.serviceChargeAnnual.toLocaleString()}/year</span>
            </div>
          </div>
        </div>

        {/* Growth Assumptions */}
        <div className="bg-white rounded-xl border border-neutral-200 p-4">
          <h3 className="text-base font-bold text-foreground mb-3 pb-2 border-b border-neutral-200">
            Growth Assumptions
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-neutral-600">Capital Growth:</span>
              <span className="text-sm font-semibold text-foreground">{safeInputs.capitalGrowthPercent}% p.a.</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-neutral-600">Rent Growth:</span>
              <span className="text-sm font-semibold text-foreground">{safeInputs.rentGrowthPercent}% p.a.</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-neutral-600">Vacancy Rate:</span>
              <span className="text-sm font-semibold text-foreground">{safeInputs.vacancyRatePercent}%</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}