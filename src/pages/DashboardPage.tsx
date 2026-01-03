import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { TrendingUp, Calculator, FileText, Plus, Trash2, Eye, Calendar, AlertCircle, CheckCircle, XCircle, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabaseClient';
import { formatCurrency, formatPercent } from '../utils/calculations';
import { Header } from '../components/Header';
import { StatCard } from '../components/StatCard';

interface Analysis {
  id: string;
  portal_source: string;
  listing_url: string;
  purchase_price: number;
  area_sqft: number;
  gross_yield: number;
  net_yield: number;
  monthly_cash_flow: number;
  cash_on_cash_return: number;
  is_paid: boolean;
  created_at: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Payment banner state
  const [showPaymentBanner, setShowPaymentBanner] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'cancelled' | null>(null);
  const [purchasedAnalysisId, setPurchasedAnalysisId] = useState<string | null>(null);

  useEffect(() => {
    // Check for payment status in URL
    const payment = searchParams.get('payment');
    const analysisId = searchParams.get('analysisId');
    
    if (payment === 'success') {
      setPaymentStatus('success');
      setPurchasedAnalysisId(analysisId);
      setShowPaymentBanner(true);
      
      // Clean URL parameters
      searchParams.delete('payment');
      searchParams.delete('analysisId');
      setSearchParams(searchParams);
    } else if (payment === 'cancelled') {
      setPaymentStatus('cancelled');
      setShowPaymentBanner(true);
      
      // Clean URL parameters
      searchParams.delete('payment');
      setSearchParams(searchParams);
    }

    fetchAnalyses();
  }, []);

  const dismissBanner = () => {
    setShowPaymentBanner(false);
  };

  const viewPurchasedReport = () => {
    if (!purchasedAnalysisId) return;
    
    const analysis = analyses.find(a => a.id === purchasedAnalysisId);
    if (analysis) {
      handleViewAnalysis(analysis);
    }
  };

  const fetchAnalyses = async () => {
    try {
      const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setAnalyses(data || []);
    } catch (err) {
      console.error('Error fetching analyses:', err);
      setError('Failed to load your reports. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this analysis?')) return;

    setDeletingId(id);
    try {
      const { error } = await supabase
        .from('analyses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAnalyses(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error('Error deleting analysis:', err);
      alert('Failed to delete analysis. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleViewAnalysis = (analysis: Analysis) => {
    navigate('/results', { 
      state: { 
        analysis,
        fromDashboard: true 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-3 tracking-tight">
            Welcome back, {user?.fullName || user?.email}
          </h1>
          <p className="text-lg text-neutral-600">
            Manage your saved property analyses and investment reports
          </p>
        </div>

        {/* Payment Banner */}
        {showPaymentBanner && (
          <div className={`rounded-xl shadow-sm border p-6 mb-8 flex items-start justify-between ${
            paymentStatus === 'success' 
              ? 'bg-success/10 border-success/30' 
              : 'bg-warning/10 border-warning/30'
          }`}>
            <div className="flex items-start space-x-4 flex-1">
              {paymentStatus === 'success' ? (
                <div className="p-3 bg-success/20 rounded-xl flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-success" />
                </div>
              ) : (
                <div className="p-3 bg-warning/20 rounded-xl flex-shrink-0">
                  <XCircle className="w-6 h-6 text-warning" />
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-2">
                  {paymentStatus === 'success' ? 'Premium report unlocked successfully' : 'Payment cancelled'}
                </h3>
                <p className="text-neutral-700 text-sm mb-4">
                  {paymentStatus === 'success' 
                    ? 'Your premium analysis is now fully accessible with all charts and projections.' 
                    : 'You can try again anytime from the results page.'}
                </p>
                {paymentStatus === 'success' && (
                  <button
                    onClick={viewPurchasedReport}
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary-hover transition-all shadow-sm"
                  >
                    <Eye className="w-5 h-5" />
                    <span>View Report</span>
                  </button>
                )}
              </div>
            </div>
            <button
              onClick={dismissBanner}
              className="p-2 text-neutral-500 hover:text-neutral-700 rounded-lg transition-colors flex-shrink-0"
              aria-label="Dismiss notification"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <StatCard
            label="Total Analyses"
            value={analyses.length}
            icon={FileText}
            description="Saved property calculations"
            variant="navy"
          />
          <StatCard
            label="Premium Reports"
            value={analyses.filter(a => a.is_paid).length}
            icon={TrendingUp}
            description="Full reports purchased"
            variant="teal"
          />
          <StatCard
            label="Free Reports"
            value={analyses.filter(a => !a.is_paid).length}
            icon={Calculator}
            description="Basic calculations"
            variant="success"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-6 mb-8 flex items-start space-x-3">
            <AlertCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground mb-1">Error Loading Data</h3>
              <p className="text-neutral-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-border p-20 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-border border-t-primary mb-6"></div>
            <p className="text-neutral-600">Loading your reports...</p>
          </div>
        ) : analyses.length === 0 ? (
          // Empty State
          <div className="bg-white rounded-2xl shadow-sm border border-border p-20 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-muted rounded-xl flex items-center justify-center mx-auto mb-6">
                <Calculator className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-bold text-foreground mb-3">
                No Analyses Yet
              </h3>
              <p className="text-neutral-600 mb-8 leading-relaxed">
                Start by calculating your first property ROI. Analyze potential investments and save them for future reference.
              </p>
              <button
                onClick={() => navigate('/calculator')}
                className="inline-flex items-center space-x-3 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary-hover transition-all shadow-sm"
              >
                <Plus className="w-5 h-5" />
                <span>Create First Analysis</span>
              </button>
            </div>
          </div>
        ) : (
          // Analyses Table
          <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
            <div className="px-8 py-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-foreground">Your Analyses</h2>
                <button
                  onClick={() => navigate('/calculator')}
                  className="inline-flex items-center space-x-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary-hover transition-colors text-sm shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Analysis</span>
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Property
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Purchase Price
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Gross Yield
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Cash Flow
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {analyses.map((analysis) => (
                    <tr key={analysis.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-semibold text-foreground">
                            {analysis.portal_source}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {analysis.area_sqft.toLocaleString()} sqft
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="text-sm font-semibold text-foreground">
                          {formatCurrency(analysis.purchase_price)}
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="text-sm font-semibold text-foreground">
                          {formatPercent(analysis.gross_yield)}
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className={`text-sm font-semibold ${
                          analysis.monthly_cash_flow >= 0 ? 'text-success' : 'text-destructive'
                        }`}>
                          {formatCurrency(analysis.monthly_cash_flow)}/mo
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(analysis.created_at).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        {analysis.is_paid ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-secondary/20 text-secondary border border-secondary/30">
                            Premium
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground border border-border">
                            Free
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleViewAnalysis(analysis)}
                            className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                            aria-label="View Analysis"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(analysis.id)}
                            disabled={deletingId === analysis.id}
                            className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors disabled:opacity-50"
                            aria-label="Delete Analysis"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CTA for New Analysis */}
        {analyses.length > 0 && (
          <div className="mt-10 bg-gradient-to-br from-primary via-primary-hover to-primary rounded-2xl shadow-xl overflow-hidden relative">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
            
            <div className="relative p-10 text-primary-foreground">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="font-bold mb-2">
                    Ready to analyze another property?
                  </h3>
                  <p className="text-primary-foreground/90">
                    Compare multiple investments to find the best opportunity
                  </p>
                </div>
                <button
                  onClick={() => navigate('/calculator')}
                  className="flex-shrink-0 inline-flex items-center space-x-3 px-8 py-4 bg-white text-primary rounded-xl font-medium hover:shadow-2xl transition-all"
                >
                  <Plus className="w-5 h-5" />
                  <span>New Analysis</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}