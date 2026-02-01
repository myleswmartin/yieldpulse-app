import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, DollarSign, AlertTriangle, CheckCircle, XCircle, BarChart3, Download, Share2, Edit3, Check, X, Image } from 'lucide-react';
import { Header } from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import { formatCurrency, formatPercent, CalculationResults, PropertyInputs } from '../utils/calculations';
import { handleError, showSuccess } from '../utils/errorHandling';
import { getUserAnalyses, checkPurchaseStatus, updatePropertyName, createComparisonShareLink } from '../utils/apiClient';
import { ShareModal } from '../components/ShareModal';
import { generateComparisonPDF } from '../utils/comparisonPdfGenerator';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

interface SavedAnalysis {
  id: string;
  property_name: string;
  property_image_url?: string | null;
  purchase_price: number;
  expected_monthly_rent: number;
  calculation_results: CalculationResults;
  notes?: string;
  created_at: string;
  is_paid: boolean;
  paid_status?: "paid" | "free" | "checking";
}

const parseIdsParam = (value: string | null): string[] | null => {
  if (!value) return null;
  let decoded = value;
  try {
    decoded = decodeURIComponent(value);
  } catch {
    decoded = value;
  }
  const normalized = decoded.replace(/%2C/gi, ',');
  const ids = normalized
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);
  if (ids.length === 0) return null;
  return Array.from(new Set(ids));
};

export default function ComparisonPage() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [analyses, setAnalyses] = useState<SavedAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [comparisonData, setComparisonData] = useState<SavedAnalysis[]>([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [creatingShareLink, setCreatingShareLink] = useState(false);
  
  // Get pre-selected analysis IDs from URL search params or navigation state
  const searchParams = new URLSearchParams(location.search);
  const idsParam = searchParams.get('ids');
  const parsedIds = parseIdsParam(idsParam);
  const stateSelectedIds = (location.state as { selectedIds?: string[] } | null)?.selectedIds;
  const stateAnalysisId = (location.state as { analysisId?: string } | null)?.analysisId;
  const safeStateIds = Array.isArray(stateSelectedIds)
    ? stateSelectedIds.filter((id) => typeof id === 'string' && id.length > 0)
    : null;
  const preSelectedIds = parsedIds ?? safeStateIds ?? (stateAnalysisId ? [stateAnalysisId] : null);
  
  // Track if we've already processed preselected IDs to avoid re-processing
  const hasProcessedPreselection = useRef(false);

  // Reset preselection when query params change to avoid stale comparisons
  useEffect(() => {
    hasProcessedPreselection.current = false;
    setComparisonData([]);
  }, [location.search]);

  console.log('🚀 ComparisonPage loaded');
  console.log('📋 URL param ids:', idsParam);
  console.log('📋 preSelectedIds:', preSelectedIds);

  // Helper function to determine paid status (same logic as Dashboard)
  const getPaidStatus = (analysis: SavedAnalysis) =>
    analysis.paid_status ?? (analysis.is_paid ? "paid" : "free");

  // Property name editing state
  const [editingPropertyNameId, setEditingPropertyNameId] = useState<string | null>(null);
  const [propertyNameValue, setPropertyNameValue] = useState<string>("");

  const handlePropertyNameEdit = (analysis: SavedAnalysis) => {
    setEditingPropertyNameId(analysis.id);
    setPropertyNameValue(analysis.property_name || "");
  };

  const handlePropertyNameSave = async (analysisId: string) => {
    try {
      const { error } = await updatePropertyName(analysisId, propertyNameValue);
      
      if (error) {
        handleError(error, 'Update Property Name');
        return;
      }
      
      // Update both analyses list and comparisonData
      setAnalyses((prev) =>
        prev.map((a) =>
          a.id === analysisId ? { ...a, property_name: propertyNameValue } : a
        )
      );
      setComparisonData((prev) =>
        prev.map((a) =>
          a.id === analysisId ? { ...a, property_name: propertyNameValue } : a
        )
      );
      setEditingPropertyNameId(null);
      showSuccess("Property name updated successfully.");
    } catch (err: any) {
      console.error("Error saving property name:", err);
      handleError(
        err.message || "Failed to save property name. Please try again.",
        "Update Property Name"
      );
    }
  };

  const handlePropertyNameCancel = () => {
    setEditingPropertyNameId(null);
    setPropertyNameValue("");
  };

  // Check auth and redirect if needed
  useEffect(() => {
    console.log('🔐 [Auth Check] Running auth check useEffect');
    console.log('🔐 [Auth Check] User:', user ? 'authenticated' : 'not authenticated');
    console.log('🔐 [Auth Check] preSelectedIds:', preSelectedIds);
    
    if (!user) {
      console.log('❌ [Auth Check] No user, redirecting to signin');
      navigate('/auth/signin');
      return;
    }

    console.log('✅ [Auth Check] User authenticated, fetching analyses...');
    
    // Always fetch analyses - don't check preselection here
    fetchAnalyses();
  }, [user]); // Only depend on user

  // Process preselected IDs when analyses are loaded
  useEffect(() => {
    console.log('📊 [Preselection Check] Running preselection useEffect');
    console.log('📊 [Preselection Check] hasProcessedPreselection.current:', hasProcessedPreselection.current);
    console.log('📊 [Preselection Check] analyses.length:', analyses.length);
    console.log('📊 [Preselection Check] loading:', loading);
    console.log('📊 [Preselection Check] preSelectedIds:', preSelectedIds);
    
    // Skip if already processed or no data
    if (hasProcessedPreselection.current) {
      console.log('⏭️ [Preselection Check] Already processed, skipping');
      return;
    }
    
    if (analyses.length === 0) {
      console.log('⏭️ [Preselection Check] No analyses loaded yet, skipping');
      return;
    }
    
    // Check if we have valid preselected IDs
    if (!preSelectedIds || !Array.isArray(preSelectedIds) || preSelectedIds.length < 2) {
      console.log('❌ [Preselection Check] Invalid preselection, redirecting to dashboard');
      console.log('❌ [Preselection Check] preSelectedIds type:', typeof preSelectedIds);
      console.log('❌ [Preselection Check] preSelectedIds value:', preSelectedIds);
      navigate('/dashboard', { replace: true });
      return;
    }
    
    console.log('🔍 [Preselection Check] Processing preselection...');
    console.log('🔍 [Preselection Check] Total analyses loaded:', analyses.length);
    console.log('🔍 [Preselection Check] PreSelected IDs:', preSelectedIds);
    console.log('🔍 [Preselection Check] All analysis IDs:', analyses.map(a => a.id));
    
    const normalizedIds = preSelectedIds.map((id) => id.toLowerCase());
    const selected = analyses.filter((a) => normalizedIds.includes(a.id.toLowerCase()));
    
    console.log('✨ [Preselection Check] Found', selected.length, 'matching analyses');
    console.log('✨ [Preselection Check] Matched IDs:', selected.map(a => a.id));
    
    if (selected.length >= 2) {
      console.log('🎉 [Preselection Check] SUCCESS! Setting comparison data with', selected.length, 'properties');
      setComparisonData(selected);
      hasProcessedPreselection.current = true;
    } else {
      console.log('❌ [Preselection Check] Not enough matches, redirecting to dashboard');
      navigate('/dashboard', { replace: true });
    }
  }, [analyses, preSelectedIds, navigate]);

  const fetchAnalyses = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await getUserAnalyses();
      
      if (error) {
        if (error.status === 401) {
          setLoading(false);
          navigate('/auth/signin', { 
            state: { 
              message: 'Your session has expired. Please sign in again.',
              returnTo: '/dashboard'
            },
            replace: true
          });
          return;
        }
        
        console.error('Error fetching analyses:', error);
        handleError('Failed to load your saved analyses', 'Load Analyses');
        setLoading(false);
        return;
      }

      if (data) {
        // Map initial data with paid_status (same logic as Dashboard)
        const list = (data as SavedAnalysis[]).map((analysis) => ({
          ...analysis,
          paid_status: analysis.is_paid ? "paid" : "checking",
        }));

        // Check pending purchases for all "checking" status reports
        const pending = list.filter(
          (analysis) => analysis.paid_status === "checking",
        );
        
        if (pending.length > 0) {
          const results = await Promise.all(
            pending.map((analysis) =>
              checkPurchaseStatus(analysis.id).catch((err) => {
                return { error: err };
              }),
            ),
          );

          const paidIds = new Set<string>();
          const freeIds = new Set<string>();

          results.forEach((res, idx) => {
            if (!res.error && res.data?.isPaid) {
              paidIds.add(pending[idx].id);
            } else if (!res.error) {
              freeIds.add(pending[idx].id);
            }
          });

          // Update the list with confirmed statuses
          const updatedList = list.map((analysis) => {
            if (paidIds.has(analysis.id)) {
              return {
                ...analysis,
                is_paid: true,
                paid_status: "paid" as const,
              };
            }
            if (freeIds.has(analysis.id)) {
              return { ...analysis, paid_status: "free" as const };
            }
            return analysis;
          });

          const premiumAnalyses = updatedList.filter(analysis => getPaidStatus(analysis) === "paid");
          const analysesToUse = preSelectedIds && preSelectedIds.length > 0
            ? updatedList
            : premiumAnalyses;
          console.log('Premium analyses loaded:', premiumAnalyses.length);
          setAnalyses(analysesToUse);
        } else {
          const premiumAnalyses = list.filter(analysis => getPaidStatus(analysis) === "paid");
          const analysesToUse = preSelectedIds && preSelectedIds.length > 0
            ? list
            : premiumAnalyses;
          console.log('Premium analyses loaded:', premiumAnalyses.length);
          setAnalyses(analysesToUse);
        }
      }
    } catch (error) {
      console.error('Unexpected error in fetchAnalyses:', error);
      if (user) {
        handleError('Failed to load your saved analyses', 'Load Analyses');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle PDF Download
  const handleDownloadPDF = async () => {
    setGeneratingPDF(true);
    try {
      await generateComparisonPDF(comparisonData);
      showSuccess('Comparison PDF downloaded successfully!');
    } catch (error) {
      console.error('Error generating comparison PDF:', error);
      handleError(error, 'Generate Comparison PDF', handleDownloadPDF);
    } finally {
      setGeneratingPDF(false);
    }
  };

  // Handle Share
  const handleShare = async () => {
    if (comparisonData.length === 0) return;
    
    setCreatingShareLink(true);
    try {
      const analysisIds = comparisonData.map((analysis) => analysis.id);
      const propertyName = `Comparison (${analysisIds.length} properties)`;
      const { data, error } = await createComparisonShareLink({
        analysisIds,
        propertyName,
      });

      if (error) {
        handleError(error, 'Create Share Link');
        return;
      }

      if (data?.shareUrl) {
        setShareUrl(data.shareUrl);
        setShowShareModal(true);
      } else {
        throw new Error('Share link was not returned');
      }
    } catch (error) {
      console.error('Error creating share link:', error);
      handleError(error, 'Create Share Link');
    } finally {
      setCreatingShareLink(false);
    }
  };

  // Helper to determine best/worst for a metric
  const getBestWorst = (values: number[], higherIsBetter: boolean) => {
    const best = higherIsBetter ? Math.max(...values) : Math.min(...values);
    const worst = higherIsBetter ? Math.min(...values) : Math.max(...values);
    return { best, worst };
  };

  // Prepare chart data for comparison
  const prepareChartData = () => {
    if (comparisonData.length === 0) return [];

    const metrics = [
      { name: 'Gross Yield %', key: 'grossRentalYield', multiplier: 100 },
      { name: 'Net Yield %', key: 'netRentalYield', multiplier: 100 },
      { name: 'Cash on Cash %', key: 'cashOnCashReturn', multiplier: 100 },
    ];

    return metrics.map(metric => {
      const dataPoint: any = { metric: metric.name };
      comparisonData.forEach((analysis, idx) => {
        const value = (analysis.calculation_results[metric.key as keyof CalculationResults] as number) * metric.multiplier;
        dataPoint[`Property ${idx + 1}`] = value;
      });
      return dataPoint;
    });
  };

  // Prepare 5-year cash flow comparison
  const prepareCashFlowData = () => {
    if (comparisonData.length === 0) return [];

    const years = [1, 2, 3, 4, 5];
    return years.map(year => {
      const dataPoint: any = { year: `Year ${year}` };
      comparisonData.forEach((analysis, idx) => {
        const projection = analysis.calculation_results.projection;
        if (projection && projection[year - 1]) {
          dataPoint[`Property ${idx + 1}`] = projection[year - 1].cashFlow;
        }
      });
      return dataPoint;
    });
  };

  // Prepare risk radar chart data
  const prepareRiskData = () => {
    if (comparisonData.length === 0) return [];

    const riskFactors = [
      { name: 'Rent Stability', getValue: (a: SavedAnalysis) => {
        const rentRisk = Math.min(100, (a.expected_monthly_rent / a.purchase_price) * 1000);
        return 100 - rentRisk;
      }},
      { name: 'Cash Flow', getValue: (a: SavedAnalysis) => {
        const cf = a.calculation_results.monthlyCashFlow;
        return cf >= 1000 ? 100 : cf >= 0 ? 70 : Math.max(0, 50 + (cf / 100));
      }},
      { name: 'Leverage', getValue: (a: SavedAnalysis) => {
        const ltv = (a.calculation_results.loanAmount / a.purchase_price) * 100;
        return Math.max(0, 100 - ltv);
      }},
      { name: 'Yield Quality', getValue: (a: SavedAnalysis) => {
        return Math.min(100, a.calculation_results.netRentalYield * 1000);
      }},
    ];

    return riskFactors.map(factor => {
      const dataPoint: any = { factor: factor.name };
      comparisonData.forEach((analysis, idx) => {
        dataPoint[`Property ${idx + 1}`] = Math.round(factor.getValue(analysis));
      });
      return dataPoint;
    });
  };

  const colors = ['#1e2875', '#14b8a6', '#f59e0b', '#6366f1'];

  // Generate human-readable Report ID from database ID
  const formatReportId = (id: string): string => {
    const numericHash = id.split('').reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);
    const reportNumber = (numericHash % 999999).toString().padStart(6, '0');
    return `YP-${reportNumber}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Header />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-neutral-600">Loading comparison...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If no comparison data at this point, show empty state
  if (comparisonData.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Header />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Unable to Load Comparison</h3>
              <p className="text-neutral-600 mb-6">
                Please go back to your dashboard and select 2-3 premium properties to compare.
              </p>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Navigation */}
        <Link 
          to="/dashboard" 
          className="inline-flex items-center space-x-2 text-sm text-neutral-600 hover:text-primary mb-8 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Property Comparison</h1>
          <p className="text-neutral-600">
            Side-by-side analysis of {comparisonData.length} properties
          </p>
        </div>

        {/* Comparison Results */}
        <div className="space-y-8">
          {/* Action Bar */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">
              Comparing {comparisonData.length} Properties
            </h2>
            <div className="flex gap-3">
              <button
                onClick={handleDownloadPDF}
                disabled={generatingPDF}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-border text-neutral-700 rounded-lg font-medium hover:bg-neutral-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                {generatingPDF ? 'Generating...' : 'Download PDF'}
              </button>
              <button
                onClick={handleShare}
                disabled={creatingShareLink}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Share2 className="w-4 h-4" />
                {creatingShareLink ? 'Creating...' : 'Share'}
              </button>
            </div>
          </div>

          {/* Key Metrics Comparison */}
          <div className="bg-white rounded-2xl border border-border p-8">
            <h3 className="text-xl font-semibold text-foreground mb-6">Key Metrics Comparison</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Metric</th>
                    {comparisonData.map((analysis, idx) => (
                      <th key={analysis.id} className="text-right py-3 px-4 font-semibold text-foreground align-top">
                        <div className="flex flex-col items-end">
                          <div
                            className="w-3 h-3 rounded-full mb-2"
                            style={{ backgroundColor: colors[idx] }}
                          ></div>
                          {editingPropertyNameId === analysis.id ? (
                            <div className="flex items-center space-x-1 mb-1">
                              <input
                                type="text"
                                value={propertyNameValue}
                                onChange={(e) => setPropertyNameValue(e.target.value)}
                                onBlur={() => handlePropertyNameSave(analysis.id)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    handlePropertyNameSave(analysis.id);
                                  } else if (e.key === "Escape") {
                                    handlePropertyNameCancel();
                                  }
                                }}
                                maxLength={100}
                                autoFocus
                                className="w-full px-2 py-1 text-xs font-semibold border border-primary rounded-md focus:ring-2 focus:ring-primary focus:border-transparent text-right"
                                placeholder="Enter property name..."
                              />
                              <button
                                onClick={() => handlePropertyNameSave(analysis.id)}
                                className="p-0.5 text-success hover:bg-success/10 rounded transition-colors flex-shrink-0"
                                title="Save"
                              >
                                <Check className="w-3 h-3" />
                              </button>
                              <button
                                onClick={handlePropertyNameCancel}
                                className="p-0.5 text-neutral-500 hover:bg-muted rounded transition-colors flex-shrink-0"
                                title="Cancel"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePropertyNameEdit(analysis);
                              }}
                              className="group cursor-pointer mb-1"
                            >
                              <div className="text-xs font-semibold text-foreground flex items-center justify-end space-x-1">
                                <span>{analysis.property_name || 'Unnamed Property'}</span>
                                <Edit3 className="w-2.5 h-2.5 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                              </div>
                            </div>
                          )}
                          <span className="text-[10px] font-mono text-neutral-500">
                            {formatReportId(analysis.id)}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {/* Property Images */}
                  {comparisonData.some(a => a.property_image_url) && (
                    <tr className="bg-neutral-50/50">
                      <td className="py-3 px-4 text-sm font-medium text-neutral-700">Property Image</td>
                      {comparisonData.map((analysis) => (
                        <td key={analysis.id} className="py-3 px-4 text-right">
                          {analysis.property_image_url ? (
                            <img
                              src={analysis.property_image_url}
                              alt={analysis.property_name || 'Property'}
                              className="w-24 h-24 object-cover rounded-lg border border-border ml-auto"
                            />
                          ) : (
                            <div className="w-24 h-24 bg-muted rounded-lg border border-border flex items-center justify-center ml-auto">
                              <Image className="w-8 h-8 text-muted-foreground" />
                            </div>
                          )}
                        </td>
                      ))}
                    </tr>
                  )}
                  
                  {/* Purchase Price */}
                  <tr>
                    <td className="py-3 px-4 text-sm font-medium text-neutral-700">Purchase Price</td>
                    {comparisonData.map((analysis) => (
                      <td key={analysis.id} className="py-3 px-4 text-sm text-right text-neutral-700">
                        {formatCurrency(analysis.purchase_price)}
                      </td>
                    ))}
                  </tr>

                  {/* Monthly Rent */}
                  <tr className="bg-neutral-50">
                    <td className="py-3 px-4 text-sm font-medium text-neutral-700">Monthly Rent</td>
                    {comparisonData.map((analysis) => (
                      <td key={analysis.id} className="py-3 px-4 text-sm text-right text-neutral-700">
                        {formatCurrency(analysis.expected_monthly_rent)}/mo
                      </td>
                    ))}
                  </tr>

                  {/* Gross Rental Yield */}
                  <tr>
                    <td className="py-3 px-4 text-sm font-medium text-neutral-700 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      Gross Rental Yield
                    </td>
                    {(() => {
                      const values = comparisonData.map(a => a.calculation_results.grossRentalYield);
                      const { best, worst } = getBestWorst(values, true);
                      return comparisonData.map((analysis) => {
                        const value = analysis.calculation_results.grossRentalYield;
                        const isBest = value === best;
                        const isWorst = value === worst && comparisonData.length > 2;
                        return (
                          <td key={analysis.id} className="py-3 px-4 text-right">
                            <div className="inline-flex items-center gap-2">
                              <span className={`text-sm font-medium ${isBest ? 'text-success' : isWorst ? 'text-destructive' : 'text-neutral-700'}`}>
                                {formatPercent(value)}
                              </span>
                              {isBest && <CheckCircle className="w-4 h-4 text-success" />}
                              {isWorst && <XCircle className="w-4 h-4 text-destructive" />}
                            </div>
                          </td>
                        );
                      });
                    })()}
                  </tr>

                  {/* Net Rental Yield */}
                  <tr className="bg-neutral-50">
                    <td className="py-3 px-4 text-sm font-medium text-neutral-700 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-teal" />
                      Net Rental Yield
                    </td>
                    {(() => {
                      const values = comparisonData.map(a => a.calculation_results.netRentalYield);
                      const { best, worst } = getBestWorst(values, true);
                      return comparisonData.map((analysis) => {
                        const value = analysis.calculation_results.netRentalYield;
                        const isBest = value === best;
                        const isWorst = value === worst && comparisonData.length > 2;
                        return (
                          <td key={analysis.id} className="py-3 px-4 text-right">
                            <div className="inline-flex items-center gap-2">
                              <span className={`text-sm font-medium ${isBest ? 'text-success' : isWorst ? 'text-destructive' : 'text-neutral-700'}`}>
                                {formatPercent(value)}
                              </span>
                              {isBest && <CheckCircle className="w-4 h-4 text-success" />}
                              {isWorst && <XCircle className="w-4 h-4 text-destructive" />}
                            </div>
                          </td>
                        );
                      });
                    })()}
                  </tr>

                  {/* Monthly Cash Flow */}
                  <tr>
                    <td className="py-3 px-4 text-sm font-medium text-neutral-700 flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-primary" />
                      Monthly Cash Flow
                    </td>
                    {(() => {
                      const values = comparisonData.map(a => a.calculation_results.monthlyCashFlow);
                      const { best, worst } = getBestWorst(values, true);
                      return comparisonData.map((analysis) => {
                        const value = analysis.calculation_results.monthlyCashFlow;
                        const isBest = value === best;
                        const isWorst = value === worst && comparisonData.length > 2;
                        return (
                          <td key={analysis.id} className="py-3 px-4 text-right">
                            <div className="inline-flex items-center gap-2">
                              <span className={`text-sm font-medium ${isBest ? 'text-success' : isWorst ? 'text-destructive' : value >= 0 ? 'text-neutral-700' : 'text-destructive'}`}>
                                {formatCurrency(value)}/mo
                              </span>
                              {isBest && <CheckCircle className="w-4 h-4 text-success" />}
                              {isWorst && <XCircle className="w-4 h-4 text-destructive" />}
                            </div>
                          </td>
                        );
                      });
                    })()}
                  </tr>

                  {/* Cash on Cash Return */}
                  <tr className="bg-neutral-50">
                    <td className="py-3 px-4 text-sm font-medium text-neutral-700 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-teal" />
                      Cash on Cash Return
                    </td>
                    {(() => {
                      const values = comparisonData.map(a => a.calculation_results.cashOnCashReturn);
                      const { best, worst } = getBestWorst(values, true);
                      return comparisonData.map((analysis) => {
                        const value = analysis.calculation_results.cashOnCashReturn;
                        const isBest = value === best;
                        const isWorst = value === worst && comparisonData.length > 2;
                        return (
                          <td key={analysis.id} className="py-3 px-4 text-right">
                            <div className="inline-flex items-center gap-2">
                              <span className={`text-sm font-medium ${isBest ? 'text-success' : isWorst ? 'text-destructive' : 'text-neutral-700'}`}>
                                {formatPercent(value)}
                              </span>
                              {isBest && <CheckCircle className="w-4 h-4 text-success" />}
                              {isWorst && <XCircle className="w-4 h-4 text-destructive" />}
                            </div>
                          </td>
                        );
                      });
                    })()}
                  </tr>

                  {/* Total Initial Investment */}
                  <tr>
                    <td className="py-3 px-4 text-sm font-medium text-neutral-700 flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-primary" />
                      Total Initial Investment
                    </td>
                    {(() => {
                      const values = comparisonData.map(a => a.calculation_results.totalInitialInvestment);
                      const { best, worst } = getBestWorst(values, false);
                      return comparisonData.map((analysis) => {
                        const value = analysis.calculation_results.totalInitialInvestment;
                        const isBest = value === best;
                        const isWorst = value === worst && comparisonData.length > 2;
                        return (
                          <td key={analysis.id} className="py-3 px-4 text-right">
                            <div className="inline-flex items-center gap-2">
                              <span className={`text-sm font-medium ${isBest ? 'text-success' : isWorst ? 'text-destructive' : 'text-neutral-700'}`}>
                                {formatCurrency(value)}
                              </span>
                              {isBest && <CheckCircle className="w-4 h-4 text-success" />}
                              {isWorst && <XCircle className="w-4 h-4 text-destructive" />}
                            </div>
                          </td>
                        );
                      });
                    })()}
                  </tr>

                  {/* Breakeven Occupancy */}
                  <tr className="bg-neutral-50">
                    <td className="py-3 px-4 text-sm font-medium text-neutral-700 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      Breakeven Occupancy
                    </td>
                    {(() => {
                      const values = comparisonData.map(a => a.calculation_results.breakevenOccupancy);
                      const { best, worst } = getBestWorst(values, false);
                      return comparisonData.map((analysis) => {
                        const value = analysis.calculation_results.breakevenOccupancy;
                        const isBest = value === best;
                        const isWorst = value === worst && comparisonData.length > 2;
                        return (
                          <td key={analysis.id} className="py-3 px-4 text-right">
                            <div className="inline-flex items-center gap-2">
                              <span className={`text-sm font-medium ${isBest ? 'text-success' : isWorst ? 'text-destructive' : 'text-neutral-700'}`}>
                                {formatPercent(value)}
                              </span>
                              {isBest && <CheckCircle className="w-4 h-4 text-success" />}
                              {isWorst && <XCircle className="w-4 h-4 text-destructive" />}
                            </div>
                          </td>
                        );
                      });
                    })()}
                  </tr>

                  {/* 5-Year Total Cash Flow */}
                  <tr>
                    <td className="py-3 px-4 text-sm font-medium text-neutral-700 flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-teal" />
                      5-Year Total Cash Flow
                    </td>
                    {(() => {
                      const values = comparisonData.map(a => {
                        const projection = a.calculation_results.projection;
                        return projection ? projection.reduce((sum, year) => sum + year.cashFlow, 0) : 0;
                      });
                      const { best, worst } = getBestWorst(values, true);
                      return comparisonData.map((analysis) => {
                        const projection = analysis.calculation_results.projection;
                        const value = projection ? projection.reduce((sum, year) => sum + year.cashFlow, 0) : 0;
                        const isBest = value === best;
                        const isWorst = value === worst && comparisonData.length > 2;
                        return (
                          <td key={analysis.id} className="py-3 px-4 text-right">
                            <div className="inline-flex items-center gap-2">
                              <span className={`text-sm font-medium ${isBest ? 'text-success' : isWorst ? 'text-destructive' : 'text-neutral-700'}`}>
                                {formatCurrency(value)}
                              </span>
                              {isBest && <CheckCircle className="w-4 h-4 text-success" />}
                              {isWorst && <XCircle className="w-4 h-4 text-destructive" />}
                            </div>
                          </td>
                        );
                      });
                    })()}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Return Metrics Chart */}
          <div className="bg-white rounded-2xl border border-border p-8">
            <h3 className="text-xl font-semibold text-foreground mb-6">Return Metrics</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={prepareChartData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="metric" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                  }}
                />
                <Legend />
                {comparisonData.map((_, idx) => (
                  <Bar
                    key={idx}
                    dataKey={`Property ${idx + 1}`}
                    fill={colors[idx]}
                    radius={[4, 4, 0, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 5-Year Cash Flow Projection */}
          <div className="bg-white rounded-2xl border border-border p-8">
            <h3 className="text-xl font-semibold text-foreground mb-6">5-Year Cash Flow Projection</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={prepareCashFlowData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="year" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                  }}
                  formatter={(value: any) => formatCurrency(value)}
                />
                <Legend />
                {comparisonData.map((_, idx) => (
                  <Line
                    key={idx}
                    type="monotone"
                    dataKey={`Property ${idx + 1}`}
                    stroke={colors[idx]}
                    strokeWidth={2}
                    dot={{ fill: colors[idx], r: 4 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Risk Profile Radar */}
          <div className="bg-white rounded-2xl border border-border p-8">
            <h3 className="text-xl font-semibold text-foreground mb-6">Risk Profile Comparison</h3>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={prepareRiskData()}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="factor" stroke="#6b7280" />
                <PolarRadiusAxis stroke="#6b7280" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                  }}
                />
                <Legend />
                {comparisonData.map((_, idx) => (
                  <Radar
                    key={idx}
                    name={`Property ${idx + 1}`}
                    dataKey={`Property ${idx + 1}`}
                    stroke={colors[idx]}
                    fill={colors[idx]}
                    fillOpacity={0.3}
                  />
                ))}
              </RadarChart>
            </ResponsiveContainer>
            <p className="text-sm text-neutral-600 mt-4 text-center">
              Higher values indicate better performance/lower risk. This is a relative comparison based on the selected properties.
            </p>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <ShareModal
          shareUrl={shareUrl}
          propertyName={`Comparison Report (${comparisonData.length} properties)`}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
}
