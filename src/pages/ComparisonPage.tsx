import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, DollarSign, AlertTriangle, CheckCircle, XCircle, BarChart3, Minus, Plus, Download, Share2, Edit3, Check, X } from 'lucide-react';
import { Header } from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import { formatCurrency, formatPercent, CalculationResults, PropertyInputs } from '../utils/calculations';
import { handleError, showSuccess } from '../utils/errorHandling';
import { getUserAnalyses, checkPurchaseStatus, createShareLink, updatePropertyName } from '../utils/apiClient';
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
  purchase_price: number;
  expected_monthly_rent: number;
  calculation_results: CalculationResults;
  notes?: string;
  created_at: string;
  is_paid: boolean;
  paid_status?: "paid" | "free" | "checking";
}

export default function ComparisonPage() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [analyses, setAnalyses] = useState<SavedAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [comparisonData, setComparisonData] = useState<SavedAnalysis[]>([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [creatingShareLink, setCreatingShareLink] = useState(false);
  
  // Get pre-selected analysis IDs from navigation state
  const preSelectedIds = location.state?.selectedIds;
  const preSelectedId = location.state?.analysisId;

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

  useEffect(() => {
    if (!user) {
      navigate('/auth/signin');
      return;
    }
    fetchAnalyses();
  }, [user]);

  useEffect(() => {
    // If there are pre-selected IDs from comparison mode, use them
    if (preSelectedIds && Array.isArray(preSelectedIds) && analyses.length > 0) {
      setSelectedIds(preSelectedIds);
      // Auto-trigger comparison if we have at least 2 selected
      if (preSelectedIds.length >= 2) {
        const selected = analyses.filter(a => preSelectedIds.includes(a.id));
        setComparisonData(selected);
      }
    }
    // Otherwise, if there's a single pre-selected ID, add it to selection
    else if (preSelectedId && analyses.length > 0) {
      setSelectedIds([preSelectedId]);
    }
  }, [preSelectedIds, preSelectedId, analyses]);

  const fetchAnalyses = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await getUserAnalyses();
      
      if (error) {
        // Handle session expiration - redirect to login WITHOUT showing error toast
        if (error.status === 401) {
          setLoading(false); // Stop loading immediately
          navigate('/auth/signin', { 
            state: { 
              message: 'Your session has expired. Please sign in again.',
              returnTo: '/comparison'
            },
            replace: true // Replace history so back button doesn't bring them back here
          });
          return; // Exit early - don't show error toast
        }
        
        console.error('Error fetching analyses:', error);
        
        // Only show error toast for non-401 errors
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
                // Silently handle errors for purchase status checks
                // Don't log 401s as they're expected when session expires
                return { error: err };
              }),
            ),
          );

          const paidIds = new Set<string>();
          const freeIds = new Set<string>();

          results.forEach((res, idx) => {
            // Ignore errors - just skip updating status if check failed
            if (!res.error && res.data?.isPaid) {
              paidIds.add(pending[idx].id);
            } else if (!res.error) {
              freeIds.add(pending[idx].id);
            }
            // If there's an error, leave status as "checking" - don't change it
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

          // Filter to only include premium reports
          const premiumAnalyses = updatedList.filter(analysis => getPaidStatus(analysis) === "paid");
          setAnalyses(premiumAnalyses);
        } else {
          // If no pending, filter immediately
          const premiumAnalyses = list.filter(analysis => getPaidStatus(analysis) === "paid");
          setAnalyses(premiumAnalyses);
        }
      }
    } catch (error) {
      console.error('Unexpected error in fetchAnalyses:', error);
      // Don't show error if we're not authenticated
      if (user) {
        handleError('Failed to load your saved analyses', 'Load Analyses');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSelection = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      // Limit to 4 properties max
      if (selectedIds.length < 4) {
        setSelectedIds([...selectedIds, id]);
      }
    }
  };

  const handleCompare = () => {
    const selected = analyses.filter(a => selectedIds.includes(a.id));
    setComparisonData(selected);
  };

  const handleClearComparison = () => {
    setComparisonData([]);
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

  // Handle Share - For comparison, we'll create a descriptive title
  const handleShare = async () => {
    if (comparisonData.length === 0) return;
    
    setCreatingShareLink(true);
    try {
      // Create a share link for the first property as a representative
      // In a real implementation, you might want to create a special comparison share endpoint
      const firstAnalysisId = comparisonData[0].id;
      const { data, error } = await createShareLink({ analysisId: firstAnalysisId });
      
      if (error) {
        handleError(error, 'Create Share Link');
        return;
      }
      
      if (data?.shareUrl) {
        setShareUrl(data.shareUrl);
        setShowShareModal(true);
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
        // Higher rent = higher risk of vacancy
        const rentRisk = Math.min(100, (a.expected_monthly_rent / a.purchase_price) * 1000);
        return 100 - rentRisk;
      }},
      { name: 'Cash Flow', getValue: (a: SavedAnalysis) => {
        const cf = a.calculation_results.monthlyCashFlow;
        return cf >= 1000 ? 100 : cf >= 0 ? 70 : Math.max(0, 50 + (cf / 100));
      }},
      { name: 'Leverage', getValue: (a: SavedAnalysis) => {
        // Lower leverage = lower risk
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
    // Extract numeric part from UUID or use hash code
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
              <p className="text-neutral-600">Loading your analyses...</p>
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
            Select 2-4 properties to compare returns, cash flow, and risk profiles side-by-side
          </p>
        </div>

        {analyses.length === 0 ? (
          <div className="bg-white rounded-2xl border border-border p-12 text-center">
            <BarChart3 className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Premium Reports Available</h3>
            <p className="text-neutral-600 mb-6">
              The comparison tool requires at least 2 Premium Reports with full 5-year projections. 
              Purchase Premium Reports to unlock advanced comparison features.
            </p>
            <div className="flex gap-3 justify-center">
              <Link
                to="/calculator"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-all"
              >
                Go to Calculator
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-neutral-200 text-neutral-700 rounded-lg font-medium hover:bg-neutral-50 transition-all"
              >
                View Dashboard
              </Link>
            </div>
          </div>
        ) : comparisonData.length === 0 ? (
          // Selection Mode
          <div className="bg-white rounded-2xl border border-border p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Select Properties to Compare
              </h2>
              <p className="text-sm text-neutral-600">
                Choose 2-4 properties ({selectedIds.length}/4 selected)
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {analyses.map((analysis) => {
                return (
                  <div
                    key={analysis.id}
                    onClick={() => handleToggleSelection(analysis.id)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedIds.includes(analysis.id)
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/30 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-foreground">
                            {analysis.property_name || 'Unnamed Property'}
                          </h3>
                          {selectedIds.includes(analysis.id) && (
                            <span className="px-2 py-0.5 bg-primary text-white text-xs rounded-full font-medium">
                              Selected
                            </span>
                          )}
                          <span className="px-2 py-0.5 bg-teal/20 text-teal text-xs rounded-full font-medium border border-teal/30">
                            Premium
                          </span>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-neutral-600">
                          <span>Price: {formatCurrency(analysis.purchase_price)}</span>
                          <span>Rent: {formatCurrency(analysis.expected_monthly_rent)}/mo</span>
                          <span>
                            Net Yield: {formatPercent(analysis.calculation_results.netRentalYield)}
                          </span>
                          <span>
                            Cash Flow: {formatCurrency(analysis.calculation_results.monthlyCashFlow)}/mo
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        {selectedIds.includes(analysis.id) ? (
                          <CheckCircle className="w-6 h-6 text-primary" />
                        ) : (
                          <Plus className="w-6 h-6 text-neutral-400" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedIds.length < 2 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-amber-800">
                  <strong>Tip:</strong> Select at least 2 properties to start comparing.
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleCompare}
                disabled={selectedIds.length < 2}
                className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Compare {selectedIds.length > 0 && `(${selectedIds.length})`} Properties
              </button>
              {selectedIds.length > 0 && (
                <button
                  onClick={() => setSelectedIds([])}
                  className="px-6 py-3 bg-white border-2 border-neutral-200 text-neutral-700 rounded-lg font-medium hover:bg-neutral-50 transition-all"
                >
                  Clear Selection
                </button>
              )}
            </div>
          </div>
        ) : (
          // Comparison Results
          <div className="space-y-8">
            {/* Action Bar */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">
                Comparing {comparisonData.length} Properties
              </h2>
              <button
                onClick={handleClearComparison}
                className="px-4 py-2 bg-white border border-border text-neutral-700 rounded-lg font-medium hover:bg-neutral-50 transition-all"
              >
                <Minus className="w-4 h-4 inline mr-2" />
                Change Selection
              </button>
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
                          {formatCurrency(analysis.expected_monthly_rent)}
                        </td>
                      ))}
                    </tr>

                    {/* Cost per sq ft */}
                    <tr>
                      <td className="py-3 px-4 text-sm font-medium text-neutral-700">Cost per sq ft</td>
                      {(() => {
                        const values = comparisonData.map(a => a.calculation_results.costPerSqft || 0);
                        const { best, worst } = getBestWorst(values, false); // Lower is better for cost
                        return comparisonData.map((analysis) => {
                          const value = analysis.calculation_results.costPerSqft || 0;
                          const isBest = value === best;
                          const isWorst = value === worst && comparisonData.length > 2;
                          return (
                            <td
                              key={analysis.id}
                              className="py-3 px-4 text-sm text-right font-medium"
                              style={{ 
                                color: isBest ? '#10b981' : isWorst ? '#ef4444' : '#334155'
                              }}
                            >
                              {formatCurrency(value)}
                            </td>
                          );
                        });
                      })()}
                    </tr>

                    {/* Rent per sq ft (Annual) */}
                    <tr className="bg-neutral-50">
                      <td className="py-3 px-4 text-sm font-medium text-neutral-700">Rent per sq ft (Annual)</td>
                      {(() => {
                        const values = comparisonData.map(a => a.calculation_results.rentPerSqft || 0);
                        const { best, worst } = getBestWorst(values, true); // Higher is better for rent
                        return comparisonData.map((analysis) => {
                          const value = analysis.calculation_results.rentPerSqft || 0;
                          const isBest = value === best;
                          const isWorst = value === worst && comparisonData.length > 2;
                          return (
                            <td
                              key={analysis.id}
                              className="py-3 px-4 text-sm text-right font-medium"
                              style={{ 
                                color: isBest ? '#10b981' : isWorst ? '#ef4444' : '#334155'
                              }}
                            >
                              {formatCurrency(value)}
                            </td>
                          );
                        });
                      })()}
                    </tr>

                    {/* Gross Yield */}
                    <tr>
                      <td className="py-3 px-4 text-sm font-medium text-neutral-700">Gross Yield</td>
                      {(() => {
                        const values = comparisonData.map(a => a.calculation_results.grossRentalYield);
                        const { best, worst } = getBestWorst(values, true);
                        return comparisonData.map((analysis) => {
                          const value = analysis.calculation_results.grossRentalYield;
                          const isBest = value === best;
                          const isWorst = value === worst && comparisonData.length > 2;
                          return (
                            <td
                              key={analysis.id}
                              className="py-3 px-4 text-sm text-right font-medium"
                              style={{ 
                                color: isBest ? '#10b981' : isWorst ? '#ef4444' : '#334155'
                              }}
                            >
                              {formatPercent(value)}
                            </td>
                          );
                        });
                      })()}
                    </tr>

                    {/* Net Yield */}
                    <tr className="bg-neutral-50">
                      <td className="py-3 px-4 text-sm font-medium text-neutral-700">Net Yield</td>
                      {(() => {
                        const values = comparisonData.map(a => a.calculation_results.netRentalYield);
                        const { best, worst } = getBestWorst(values, true);
                        return comparisonData.map((analysis) => {
                          const value = analysis.calculation_results.netRentalYield;
                          const isBest = value === best;
                          const isWorst = value === worst && comparisonData.length > 2;
                          return (
                            <td
                              key={analysis.id}
                              className="py-3 px-4 text-sm text-right font-medium"
                              style={{ 
                                color: isBest ? '#10b981' : isWorst ? '#ef4444' : '#334155'
                              }}
                            >
                              {formatPercent(value)}
                            </td>
                          );
                        });
                      })()}
                    </tr>

                    {/* Cap Rate */}
                    <tr>
                      <td className="py-3 px-4 text-sm font-medium text-neutral-700">Cap Rate</td>
                      {(() => {
                        const values = comparisonData.map(a => a.calculation_results.capRate);
                        const { best, worst } = getBestWorst(values, true);
                        return comparisonData.map((analysis) => {
                          const value = analysis.calculation_results.capRate;
                          const isBest = value === best;
                          const isWorst = value === worst && comparisonData.length > 2;
                          return (
                            <td
                              key={analysis.id}
                              className="py-3 px-4 text-sm text-right font-medium"
                              style={{ 
                                color: isBest ? '#10b981' : isWorst ? '#ef4444' : '#334155'
                              }}
                            >
                              {formatPercent(value)}
                            </td>
                          );
                        });
                      })()}
                    </tr>

                    {/* Monthly Cash Flow */}
                    <tr>
                      <td className="py-3 px-4 text-sm font-medium text-neutral-700">Monthly Cash Flow</td>
                      {(() => {
                        const values = comparisonData.map(a => a.calculation_results.monthlyCashFlow);
                        const { best, worst } = getBestWorst(values, true);
                        return comparisonData.map((analysis) => {
                          const value = analysis.calculation_results.monthlyCashFlow;
                          const isBest = value === best;
                          const isWorst = value === worst && comparisonData.length > 2;
                          return (
                            <td
                              key={analysis.id}
                              className="py-3 px-4 text-sm text-right font-medium"
                              style={{ 
                                color: isBest ? '#10b981' : isWorst ? '#ef4444' : '#334155'
                              }}
                            >
                              {formatCurrency(value)}
                            </td>
                          );
                        });
                      })()}
                    </tr>

                    {/* Cash on Cash Return */}
                    <tr className="bg-neutral-50">
                      <td className="py-3 px-4 text-sm font-medium text-neutral-700">Cash on Cash Return</td>
                      {(() => {
                        const values = comparisonData.map(a => a.calculation_results.cashOnCashReturn);
                        const { best, worst } = getBestWorst(values, true);
                        return comparisonData.map((analysis) => {
                          const value = analysis.calculation_results.cashOnCashReturn;
                          const isBest = value === best;
                          const isWorst = value === worst && comparisonData.length > 2;
                          return (
                            <td
                              key={analysis.id}
                              className="py-3 px-4 text-sm text-right font-medium"
                              style={{ 
                                color: isBest ? '#10b981' : isWorst ? '#ef4444' : '#334155'
                              }}
                            >
                              {formatPercent(value)}
                            </td>
                          );
                        });
                      })()}
                    </tr>

                    {/* Initial Investment */}
                    <tr>
                      <td className="py-3 px-4 text-sm font-medium text-neutral-700">Initial Investment</td>
                      {(() => {
                        const values = comparisonData.map(a => a.calculation_results.totalInitialInvestment);
                        const { best, worst } = getBestWorst(values, false); // Lower is better
                        return comparisonData.map((analysis) => {
                          const value = analysis.calculation_results.totalInitialInvestment;
                          const isBest = value === best;
                          const isWorst = value === worst && comparisonData.length > 2;
                          return (
                            <td
                              key={analysis.id}
                              className="py-3 px-4 text-sm text-right font-medium"
                              style={{ 
                                color: isBest ? '#10b981' : isWorst ? '#ef4444' : '#334155'
                              }}
                            >
                              {formatCurrency(value)}
                            </td>
                          );
                        });
                      })()}
                    </tr>

                    {/* Year 5 Total Return */}
                    {comparisonData.every(a => a.calculation_results.projection?.[4]) && (
                      <tr className="bg-teal/5 border-t-2 border-teal/20">
                        <td className="py-3 px-4 text-sm font-bold text-foreground">Year 5 Total Return</td>
                        {(() => {
                          const values = comparisonData.map(a => a.calculation_results.projection[4].totalReturn);
                          const { best, worst } = getBestWorst(values, true);
                          return comparisonData.map((analysis) => {
                            const value = analysis.calculation_results.projection[4].totalReturn;
                            const isBest = value === best;
                            const isWorst = value === worst && comparisonData.length > 2;
                            return (
                              <td
                                key={analysis.id}
                                className="py-3 px-4 text-sm text-right font-bold"
                                style={{ 
                                  color: isBest ? '#10b981' : isWorst ? '#ef4444' : '#334155'
                                }}
                              >
                                {formatCurrency(value)}
                              </td>
                            );
                          });
                        })()}
                      </tr>
                    )}

                    {/* Year 5 ROI % */}
                    {comparisonData.every(a => a.calculation_results.projection?.[4]) && (
                      <tr className="bg-teal/5">
                        <td className="py-3 px-4 text-sm font-bold text-foreground">Year 5 ROI %</td>
                        {(() => {
                          const values = comparisonData.map(a => a.calculation_results.projection[4].roiPercent);
                          const { best, worst } = getBestWorst(values, true);
                          return comparisonData.map((analysis) => {
                            const value = analysis.calculation_results.projection[4].roiPercent;
                            const isBest = value === best;
                            const isWorst = value === worst && comparisonData.length > 2;
                            return (
                              <td
                                key={analysis.id}
                                className="py-3 px-4 text-sm text-right font-bold"
                                style={{ 
                                  color: isBest ? '#10b981' : isWorst ? '#ef4444' : '#334155'
                                }}
                              >
                                {formatPercent(value)}
                              </td>
                            );
                          });
                        })()}
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-4 bg-neutral-50 rounded-lg border border-border">
                <div className="flex items-start gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-success mt-0.5" />
                  <p className="text-neutral-700">
                    <strong className="text-success">Green</strong> indicates the best performer, 
                    <strong className="text-destructive ml-2">Red</strong> indicates the worst performer in each category.
                  </p>
                </div>
              </div>
            </div>

            {/* Yield & Return Comparison Chart */}
            <div className="bg-white rounded-2xl border border-border p-8">
              <h3 className="text-xl font-semibold text-foreground mb-6">Yield & Return Comparison</h3>
              
              {/* Chart */}
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={prepareChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="metric" />
                  <YAxis label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
                  <Legend />
                  {comparisonData.map((analysis, idx) => (
                    <Bar
                      key={analysis.id}
                      dataKey={`Property ${idx + 1}`}
                      fill={colors[idx]}
                      name={analysis.property_name || `Property ${idx + 1}`}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
              
              {/* Data Table */}
              <div className="mt-8 overflow-x-auto">
                <table className="w-full border border-border rounded-lg">
                  <thead>
                    <tr className="bg-neutral-50">
                      <th className="py-3 px-4 text-left text-sm font-semibold text-foreground border-b border-border">
                        Metric
                      </th>
                      {comparisonData.map((analysis, idx) => (
                        <th
                          key={analysis.id}
                          className="py-3 px-4 text-right text-sm font-semibold border-b border-border"
                          style={{ color: colors[idx] }}
                        >
                          {analysis.property_name || `Property ${idx + 1}`}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4 text-sm font-medium text-neutral-700">Gross Yield %</td>
                      {comparisonData.map((analysis) => (
                        <td key={analysis.id} className="py-3 px-4 text-sm text-right font-medium text-neutral-900">
                          {formatPercent(analysis.calculation_results.grossRentalYield)}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4 text-sm font-medium text-neutral-700">Net Yield %</td>
                      {comparisonData.map((analysis) => (
                        <td key={analysis.id} className="py-3 px-4 text-sm text-right font-medium text-neutral-900">
                          {formatPercent(analysis.calculation_results.netRentalYield)}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-sm font-medium text-neutral-700">Cash on Cash %</td>
                      {comparisonData.map((analysis) => (
                        <td key={analysis.id} className="py-3 px-4 text-sm text-right font-medium text-neutral-900">
                          {formatPercent(analysis.calculation_results.cashOnCashReturn)}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 5-Year Cash Flow Trajectory */}
            {comparisonData.every(a => a.calculation_results.projection) && (
              <div className="bg-white rounded-2xl border border-border p-8">
                <h3 className="text-xl font-semibold text-foreground mb-6">5-Year Cash Flow Trajectory</h3>
                
                {/* Chart */}
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={prepareCashFlowData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis label={{ value: 'Annual Cash Flow (AED)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend />
                    {comparisonData.map((analysis, idx) => (
                      <Line
                        key={analysis.id}
                        type="monotone"
                        dataKey={`Property ${idx + 1}`}
                        stroke={colors[idx]}
                        strokeWidth={2}
                        name={analysis.property_name || `Property ${idx + 1}`}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
                
                {/* Data Table */}
                <div className="mt-8 overflow-x-auto">
                  <table className="w-full border border-border rounded-lg">
                    <thead>
                      <tr className="bg-neutral-50">
                        <th className="py-3 px-4 text-left text-sm font-semibold text-foreground border-b border-border">
                          Year
                        </th>
                        {comparisonData.map((analysis, idx) => (
                          <th
                            key={analysis.id}
                            className="py-3 px-4 text-right text-sm font-semibold border-b border-border"
                            style={{ color: colors[idx] }}
                          >
                            {analysis.property_name || `Property ${idx + 1}`}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[1, 2, 3, 4, 5].map((year) => (
                        <tr key={year} className={year < 5 ? 'border-b border-border' : ''}>
                          <td className="py-3 px-4 text-sm font-medium text-neutral-700">Year {year}</td>
                          {comparisonData.map((analysis) => (
                            <td key={analysis.id} className="py-3 px-4 text-sm text-right font-medium text-neutral-900">
                              {formatCurrency(analysis.calculation_results.projection[year - 1].cashFlow)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <p className="text-sm text-neutral-600 mt-4">
                  This chart shows how annual cash flow evolves over 5 years for each property. 
                  Properties with upward trajectories benefit from rent growth outpacing fixed mortgage payments.
                </p>
              </div>
            )}

            {/* Risk Profile Radar Chart */}
            <div className="bg-white rounded-2xl border border-border p-8">
              <h3 className="text-xl font-semibold text-foreground mb-2">Risk Profile Comparison</h3>
              <p className="text-sm text-neutral-600 mb-6">
                Higher scores indicate lower risk. This radar chart visualizes the relative risk profile across key factors.
              </p>
              
              {/* Chart */}
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={prepareRiskData()}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="factor" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  {comparisonData.map((analysis, idx) => (
                    <Radar
                      key={analysis.id}
                      name={analysis.property_name || `Property ${idx + 1}`}
                      dataKey={`Property ${idx + 1}`}
                      stroke={colors[idx]}
                      fill={colors[idx]}
                      fillOpacity={0.3}
                    />
                  ))}
                </RadarChart>
              </ResponsiveContainer>
              
              {/* Data Table */}
              <div className="mt-8 overflow-x-auto">
                <table className="w-full border border-border rounded-lg">
                  <thead>
                    <tr className="bg-neutral-50">
                      <th className="py-3 px-4 text-left text-sm font-semibold text-foreground border-b border-border">
                        Risk Factor
                      </th>
                      {comparisonData.map((analysis, idx) => (
                        <th
                          key={analysis.id}
                          className="py-3 px-4 text-center text-sm font-semibold border-b border-border"
                          style={{ color: colors[idx] }}
                        >
                          {analysis.property_name || `Property ${idx + 1}`}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {prepareRiskData().map((dataPoint, rowIdx) => (
                      <tr key={rowIdx} className={rowIdx < prepareRiskData().length - 1 ? 'border-b border-border' : ''}>
                        <td className="py-3 px-4 text-sm font-medium text-neutral-700">{dataPoint.factor}</td>
                        {comparisonData.map((analysis, idx) => {
                          const score = dataPoint[`Property ${idx + 1}`] as number;
                          return (
                            <td key={analysis.id} className="py-3 px-4 text-sm text-center font-medium">
                              <span className={
                                score >= 80 ? 'text-success' :
                                score >= 60 ? 'text-warning' :
                                'text-destructive'
                              }>
                                {score.toFixed(0)}/100
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Investment Decision Helper */}
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl border-2 border-primary/30 p-8">
              <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-primary" />
                Investment Decision Helper
              </h3>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Best for Cash Flow */}
                  {(() => {
                    const cashFlows = comparisonData.map((a, idx) => ({
                      value: a.calculation_results.monthlyCashFlow,
                      index: idx,
                      name: a.property_name
                    }));
                    const best = cashFlows.reduce((prev, curr) => curr.value > prev.value ? curr : prev);
                    return (
                      <div className="bg-white rounded-lg p-4 border border-border">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="w-5 h-5 text-success" />
                          <h4 className="font-semibold text-foreground">Best for Cash Flow</h4>
                        </div>
                        <p className="text-sm text-neutral-700 mb-1">
                          <strong>{best.name || `Property ${best.index + 1}`}</strong>
                        </p>
                        <p className="text-lg font-bold text-success">
                          {formatCurrency(best.value)}/month
                        </p>
                      </div>
                    );
                  })()}

                  {/* Best for Total Return */}
                  {comparisonData.every(a => a.calculation_results.projection?.[4]) && (() => {
                    const returns = comparisonData.map((a, idx) => ({
                      value: a.calculation_results.projection[4].totalReturn,
                      index: idx,
                      name: a.property_name
                    }));
                    const best = returns.reduce((prev, curr) => curr.value > prev.value ? curr : prev);
                    return (
                      <div className="bg-white rounded-lg p-4 border border-border">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-5 h-5 text-teal" />
                          <h4 className="font-semibold text-foreground">Best 5-Year Return</h4>
                        </div>
                        <p className="text-sm text-neutral-700 mb-1">
                          <strong>{best.name || `Property ${best.index + 1}`}</strong>
                        </p>
                        <p className="text-lg font-bold text-teal">
                          {formatCurrency(best.value)}
                        </p>
                      </div>
                    );
                  })()}

                  {/* Lowest Initial Investment */}
                  {(() => {
                    const investments = comparisonData.map((a, idx) => ({
                      value: a.calculation_results.totalInitialInvestment,
                      index: idx,
                      name: a.property_name
                    }));
                    const lowest = investments.reduce((prev, curr) => curr.value < prev.value ? curr : prev);
                    return (
                      <div className="bg-white rounded-lg p-4 border border-border">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-5 h-5 text-primary" />
                          <h4 className="font-semibold text-foreground">Lowest Entry Cost</h4>
                        </div>
                        <p className="text-sm text-neutral-700 mb-1">
                          <strong>{lowest.name || `Property ${lowest.index + 1}`}</strong>
                        </p>
                        <p className="text-lg font-bold text-primary">
                          {formatCurrency(lowest.value)}
                        </p>
                      </div>
                    );
                  })()}

                  {/* Best Net Yield */}
                  {(() => {
                    const yields = comparisonData.map((a, idx) => ({
                      value: a.calculation_results.netRentalYield,
                      index: idx,
                      name: a.property_name
                    }));
                    const best = yields.reduce((prev, curr) => curr.value > prev.value ? curr : prev);
                    return (
                      <div className="bg-white rounded-lg p-4 border border-border">
                        <div className="flex items-center gap-2 mb-2">
                          <BarChart3 className="w-5 h-5 text-warning" />
                          <h4 className="font-semibold text-foreground">Best Net Yield</h4>
                        </div>
                        <p className="text-sm text-neutral-700 mb-1">
                          <strong>{best.name || `Property ${best.index + 1}`}</strong>
                        </p>
                        <p className="text-lg font-bold text-warning">
                          {formatPercent(best.value)}
                        </p>
                      </div>
                    );
                  })()}
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                  <p className="text-sm text-amber-900 leading-relaxed">
                    <strong>Remember:</strong> The "best" property depends on your investment goals. 
                    If you need monthly income, prioritize cash flow. If you're focused on long-term wealth, 
                    consider total return and appreciation. Always factor in your risk tolerance and liquidity needs.
                  </p>
                </div>
              </div>
            </div>

            {/* Notes Comparison */}
            {comparisonData.some(a => a.notes) && (
              <div className="bg-white rounded-2xl border border-border p-8">
                <h3 className="text-xl font-semibold text-foreground mb-6">Your Notes</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {comparisonData.map((analysis, idx) => (
                    <div key={analysis.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: colors[idx] }}
                        ></div>
                        <h4 className="font-semibold text-foreground">
                          {analysis.property_name || `Property ${idx + 1}`}
                        </h4>
                      </div>
                      {analysis.notes ? (
                        <p className="text-sm text-neutral-700 whitespace-pre-wrap">{analysis.notes}</p>
                      ) : (
                        <p className="text-sm text-neutral-400 italic">No notes added</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleClearComparison}
                className="px-6 py-3 bg-white border-2 border-neutral-200 text-neutral-700 rounded-lg font-medium hover:bg-neutral-50 transition-all"
              >
                Compare Different Properties
              </button>
              <Link
                to="/dashboard"
                className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-all"
              >
                Back to Dashboard
              </Link>
              <button
                onClick={handleDownloadPDF}
                disabled={generatingPDF}
                className="px-6 py-3 bg-teal text-white rounded-lg font-medium hover:bg-teal/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4 inline mr-2" />
                {generatingPDF ? 'Generating...' : 'Export PDF'}
              </button>
              <button
                onClick={handleShare}
                disabled={creatingShareLink}
                className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Share2 className="w-4 h-4 inline mr-2" />
                {creatingShareLink ? 'Creating Link...' : 'Share'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Share Modal */}
      {showShareModal && shareUrl && (
        <ShareModal
          shareUrl={shareUrl}
          propertyName={`Property Comparison (${comparisonData.length} properties)`}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
}