import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TrendingUp, ArrowLeft, X, AlertCircle, Calculator, FileText, Lock } from 'lucide-react';
import { Header } from '../components/Header';
import { formatCurrency, formatPercent } from '../utils/calculations';
import { supabase } from '../utils/supabaseClient';
import { showInfo, handleError } from '../utils/errorHandling';
import { trackComparisonStarted } from '../utils/analytics';

interface ReportSnapshot {
  id: string;
  analysis_id: string;
  snapshot: any;
  created_at: string;
}

export default function ComparisonPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [reports, setReports] = useState<ReportSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Get selected report IDs from location state
  const selectedIds = (location.state as any)?.selectedIds as string[] || [];

  useEffect(() => {
    // Redirect if no reports selected
    if (selectedIds.length === 0) {
      showInfo('No reports selected', 'Please select at least 2 reports to compare.');
      navigate('/dashboard', { replace: true });
      return;
    }

    if (selectedIds.length < 2) {
      showInfo('Minimum 2 reports required', 'Please select at least 2 reports to compare.');
      navigate('/dashboard', { replace: true });
      return;
    }

    fetchReports();
  }, [selectedIds]);

  const fetchReports = async () => {
    setLoading(true);
    setError('');

    try {
      const { data, error: fetchError } = await supabase
        .from('report_purchases')
        .select('id, analysis_id, snapshot, created_at')
        .in('analysis_id', selectedIds)
        .eq('status', 'paid')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      if (!data || data.length === 0) {
        setError('No purchased reports found. Only premium reports can be compared.');
        return;
      }

      // Validate snapshots
      const validReports = data.filter(report => {
        if (!report.snapshot) {
          console.error(`Report ${report.id} has missing snapshot`);
          return false;
        }
        return true;
      });

      if (validReports.length < 2) {
        setError('Not enough valid reports to compare. Please select different reports.');
        return;
      }

      setReports(validReports);
      trackComparisonStarted(validReports.length);
    } catch (err) {
      console.error('Error fetching reports:', err);
      handleError(err, 'Load Comparison', () => fetchReports());
      setError('Unable to load reports for comparison. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const removeReport = (analysisId: string) => {
    const remaining = reports.filter(r => r.analysis_id !== analysisId);
    
    if (remaining.length < 2) {
      showInfo('Minimum 2 reports required', 'Returning to dashboard.');
      navigate('/dashboard');
      return;
    }

    setReports(remaining);
  };

  const getPropertyName = (snapshot: any, index: number): string => {
    return snapshot?.inputs?.portal_source || `Property ${index + 1}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-border border-t-primary mb-4"></div>
            <p className="text-neutral-600">Loading comparison...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || reports.length < 2) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Header />
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="bg-white rounded-2xl shadow-sm border border-border p-12 text-center">
            <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-foreground mb-4">Unable to Load Comparison</h2>
            <p className="text-neutral-600 mb-8 max-w-md mx-auto">
              {error || 'Not enough valid reports to compare. Please select different reports.'}
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary-hover transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center space-x-2 text-neutral-600 hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Back to Dashboard</span>
          </button>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Report Comparison</h1>
              <p className="text-neutral-600">
                Comparing {reports.length} premium {reports.length === 1 ? 'report' : 'reports'}
              </p>
            </div>
          </div>
        </div>

        {/* Comparison Table Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border sticky top-0 z-10">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold text-foreground bg-white sticky left-0 z-20 border-r border-border min-w-[200px]">
                    Metric
                  </th>
                  {reports.map((report, index) => (
                    <th key={report.id} className="px-6 py-4 min-w-[200px]">
                      <div className="flex items-start justify-between space-x-2">
                        <div className="flex-1 text-left">
                          <div className="font-semibold text-foreground mb-1">
                            {getPropertyName(report.snapshot, index)}
                          </div>
                          <div className="text-xs text-neutral-500 font-normal">
                            Purchased {new Date(report.created_at).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </div>
                        </div>
                        <button
                          onClick={() => removeReport(report.analysis_id)}
                          className="text-neutral-400 hover:text-destructive transition-colors p-1"
                          title="Remove from comparison"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              
              <tbody>
                {/* Top Summary Section */}
                <tr className="bg-muted/30">
                  <td colSpan={reports.length + 1} className="px-6 py-3">
                    <h3 className="font-semibold text-foreground">Summary</h3>
                  </td>
                </tr>
                
                <MetricRow
                  label="Purchase Price"
                  reports={reports}
                  getValue={(s) => s?.inputs?.purchase_price}
                  format={(v) => formatCurrency(v)}
                />
                
                <MetricRow
                  label="Expected Monthly Rent"
                  reports={reports}
                  getValue={(s) => s?.inputs?.expected_monthly_rent}
                  format={(v) => formatCurrency(v)}
                />
                
                <MetricRow
                  label="Gross Yield"
                  reports={reports}
                  getValue={(s) => s?.results?.grossYield}
                  format={(v) => formatPercent(v)}
                  highlightBest="high"
                />
                
                <MetricRow
                  label="Net Yield"
                  reports={reports}
                  getValue={(s) => s?.results?.netYield}
                  format={(v) => formatPercent(v)}
                  highlightBest="high"
                />
                
                <MetricRow
                  label="Cash on Cash Return"
                  reports={reports}
                  getValue={(s) => s?.results?.cashOnCashReturn}
                  format={(v) => formatPercent(v)}
                  highlightBest="high"
                />
                
                <MetricRow
                  label="Monthly Cash Flow"
                  reports={reports}
                  getValue={(s) => s?.results?.monthlyCashFlow}
                  format={(v) => formatCurrency(v)}
                  highlightBest="high"
                  showSign
                />
                
                <MetricRow
                  label="Annual Cash Flow"
                  reports={reports}
                  getValue={(s) => s?.results?.annualCashFlow}
                  format={(v) => formatCurrency(v)}
                  highlightBest="high"
                  showSign
                />

                {/* Financial Breakdown Section */}
                <tr className="bg-muted/30">
                  <td colSpan={reports.length + 1} className="px-6 py-3">
                    <h3 className="font-semibold text-foreground">Financial Breakdown</h3>
                  </td>
                </tr>
                
                <MetricRow
                  label="Monthly Mortgage Payment"
                  reports={reports}
                  getValue={(s) => s?.results?.monthlyMortgagePayment}
                  format={(v) => formatCurrency(v)}
                />
                
                <MetricRow
                  label="Operating Costs (Annual)"
                  reports={reports}
                  getValue={(s) => s?.results?.totalOperatingCosts}
                  format={(v) => formatCurrency(v)}
                />
                
                <MetricRow
                  label="Service Charge (Annual)"
                  reports={reports}
                  getValue={(s) => s?.inputs?.service_charge_per_year}
                  format={(v) => formatCurrency(v)}
                />
                
                <MetricRow
                  label="Maintenance (Annual)"
                  reports={reports}
                  getValue={(s) => s?.inputs?.maintenance_per_year}
                  format={(v) => formatCurrency(v)}
                />
                
                <MetricRow
                  label="Management Fee"
                  reports={reports}
                  getValue={(s) => s?.inputs?.property_management_fee}
                  format={(v) => formatPercent(v / 100)}
                />
                
                <MetricRow
                  label="Vacancy Allowance"
                  reports={reports}
                  getValue={(s) => s?.inputs?.vacancy_rate}
                  format={(v) => v ? formatPercent(v / 100) : 'Not set'}
                />

                {/* Assumptions Section */}
                <tr className="bg-muted/30">
                  <td colSpan={reports.length + 1} className="px-6 py-3">
                    <h3 className="font-semibold text-foreground">Assumptions</h3>
                  </td>
                </tr>
                
                <MetricRow
                  label="Mortgage Interest Rate"
                  reports={reports}
                  getValue={(s) => s?.inputs?.mortgage_interest_rate}
                  format={(v) => formatPercent(v / 100)}
                />
                
                <MetricRow
                  label="Loan Term"
                  reports={reports}
                  getValue={(s) => s?.inputs?.loan_term_years}
                  format={(v) => `${v} years`}
                />
                
                <MetricRow
                  label="Down Payment"
                  reports={reports}
                  getValue={(s) => s?.inputs?.down_payment_percent}
                  format={(v) => formatPercent(v / 100)}
                />
                
                <MetricRow
                  label="Rent Growth Rate"
                  reports={reports}
                  getValue={(s) => s?.inputs?.rent_growth_rate}
                  format={(v) => formatPercent(v / 100)}
                />
                
                <MetricRow
                  label="Capital Growth Rate"
                  reports={reports}
                  getValue={(s) => s?.inputs?.capital_growth_rate}
                  format={(v) => formatPercent(v / 100)}
                />
                
                <MetricRow
                  label="Holding Period"
                  reports={reports}
                  getValue={(s) => s?.inputs?.holding_period_years}
                  format={(v) => `${v} years`}
                />
              </tbody>
            </table>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center text-sm text-neutral-500">
          All values are taken from the premium report snapshots at the time of purchase
        </div>
      </div>
    </div>
  );
}

// Metric Row Component
interface MetricRowProps {
  label: string;
  reports: ReportSnapshot[];
  getValue: (snapshot: any) => any;
  format: (value: any) => string;
  highlightBest?: 'high' | 'low';
  showSign?: boolean;
}

function MetricRow({ label, reports, getValue, format, highlightBest, showSign }: MetricRowProps) {
  const values = reports.map(r => getValue(r.snapshot));
  
  // Find best value if highlighting is enabled
  let bestIndex = -1;
  if (highlightBest && values.some(v => typeof v === 'number')) {
    const numericValues = values.map(v => typeof v === 'number' ? v : -Infinity);
    if (highlightBest === 'high') {
      const maxValue = Math.max(...numericValues);
      bestIndex = numericValues.indexOf(maxValue);
    } else {
      const minValue = Math.min(...numericValues.filter(v => v !== -Infinity));
      bestIndex = numericValues.indexOf(minValue);
    }
  }

  return (
    <tr className="border-b border-border hover:bg-muted/20 transition-colors">
      <td className="px-6 py-4 font-medium text-neutral-700 bg-white sticky left-0 z-10 border-r border-border">
        {label}
      </td>
      {values.map((value, index) => {
        const isBest = index === bestIndex;
        const isNegative = typeof value === 'number' && value < 0;
        
        return (
          <td
            key={index}
            className={`px-6 py-4 ${isBest ? 'bg-success/5' : ''}`}
          >
            <span
              className={`font-medium ${
                isNegative && showSign
                  ? 'text-destructive'
                  : isBest
                  ? 'text-success'
                  : 'text-foreground'
              }`}
            >
              {value !== null && value !== undefined ? format(value) : '—'}
            </span>
          </td>
        );
      })}
    </tr>
  );
}