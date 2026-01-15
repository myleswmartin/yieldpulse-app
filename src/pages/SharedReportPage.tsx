import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowRight, LogIn, UserPlus, Save, Eye, Users, Calendar, TrendingUp } from 'lucide-react';
import { Header } from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import { getSharedReport, saveSharedReport } from '../utils/apiClient';
import { formatCurrency, formatPercent, CalculationResults, PropertyInputs } from '../utils/calculations';
import { PremiumReport } from '../components/PremiumReport';
import { toast } from 'sonner';

interface SharedReportData {
  propertyName: string;
  inputs: PropertyInputs;
  results: CalculationResults;
  sharedByEmail?: string;
  createdAt: string;
  viewCount: number;
}

export default function SharedReportPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [report, setReport] = useState<SharedReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (token) {
      fetchSharedReport();
    }
  }, [token]);

  const fetchSharedReport = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await getSharedReport(token!);

      if (fetchError) {
        setError(fetchError.error || 'Failed to load shared report');
        return;
      }

      setReport(data);
    } catch (err: any) {
      console.error('Error fetching shared report:', err);
      setError('Failed to load shared report');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveReport = async () => {
    if (!user) {
      // Redirect to sign up with return path
      navigate('/auth/signup', {
        state: {
          returnTo: `/shared/${token}`,
          message: 'Sign up to save this report to your dashboard',
        },
      });
      return;
    }

    try {
      setSaving(true);

      const { data, error: saveError } = await saveSharedReport(token!);

      if (saveError) {
        toast.error(saveError.error || 'Failed to save report');
        return;
      }

      setSaved(true);
      toast.success('Report saved to your dashboard!');

      // Navigate to dashboard after a delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err: any) {
      console.error('Error saving report:', err);
      toast.error('Failed to save report');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-neutral-600">Loading shared report...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center max-w-md mx-auto">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Report Not Found</h1>
            <p className="text-neutral-600 mb-6">
              {error || 'This shared report link is invalid or has expired.'}
            </p>
            <Link
              to="/calculator"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-all font-medium"
            >
              <span>Create Your Own Analysis</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header with CTA */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 mb-8 text-white">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{report.propertyName}</h1>
              <p className="text-white/90 mb-4">
                Shared investment analysis • Generated with YieldPulse
              </p>
              <div className="flex items-center gap-6 text-sm text-white/80">
                {report.sharedByEmail && (
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>Shared by {report.sharedByEmail}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>{report.viewCount} {report.viewCount === 1 ? 'view' : 'views'}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {user ? (
                <button
                  onClick={handleSaveReport}
                  disabled={saving || saved}
                  className="flex items-center space-x-2 px-6 py-3 bg-white text-primary rounded-lg hover:bg-white/90 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{saved ? 'Saved!' : saving ? 'Saving...' : 'Save to Dashboard'}</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSaveReport}
                    className="flex items-center space-x-2 px-6 py-3 bg-white text-primary rounded-lg hover:bg-white/90 transition-all font-medium cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Sign Up & Save</span>
                  </button>
                  <Link
                    to={`/auth/signin?returnTo=/shared/${token}`}
                    className="flex items-center justify-center space-x-2 px-6 py-3 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white/10 transition-all font-medium"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Already have an account?</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Report Content */}
        <div className="bg-white rounded-2xl border border-border p-8">
          <PremiumReport
            displayResults={report.results}
            displayInputs={report.inputs}
            vacancyAmount={report.results.grossAnnualRentalIncome * ((report.inputs.vacancyRate || 0) / 100)}
            firstYearAmortization={{
              principal: report.results.annualMortgagePayment - (report.results.loanAmount * ((report.inputs.interestRate || 0) / 100)),
              interest: report.results.loanAmount * ((report.inputs.interestRate || 0) / 100),
            }}
            totalInterestOverTerm={report.results.loanAmount * ((report.inputs.interestRate || 0) / 100) * (report.inputs.loanTerm || 25)}
            sellingFee={report.inputs.purchasePrice * 0.02}
            analysisId={null}
            notes={null}
          />
        </div>

        {/* Bottom CTA for non-users */}
        {!user && (
          <div className="mt-8 bg-gradient-to-r from-teal/10 to-primary/10 rounded-2xl border-2 border-primary/30 p-8">
            <div className="text-center max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Want to create your own analysis?
              </h3>
              <p className="text-neutral-600 mb-6">
                Sign up for free to access YieldPulse's powerful property investment calculator. 
                Save unlimited reports, compare properties, and unlock premium features.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Link
                  to="/auth/signup"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-all font-medium"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create Free Account</span>
                </Link>
                <Link
                  to="/calculator"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-white border-2 border-border text-neutral-700 rounded-lg hover:bg-neutral-50 transition-all font-medium"
                >
                  <span>Try Calculator</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}