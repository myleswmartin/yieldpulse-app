import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  TrendingUp,
  Calculator,
  FileText,
  Plus,
  Trash2,
  Eye,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
  X,
  ChevronDown,
  ChevronUp,
  Lock,
  Unlock,
  Filter,
  ArrowUpDown,
  GitCompare,
  Check,
  Edit3,
  Info,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import {
  getUserAnalyses,
  deleteAnalysis,
  checkPurchaseStatus,
  updateAnalysis,
  updateAnalysisNote,
  updatePropertyName,
} from "../utils/apiClient";
import {
  formatCurrency,
  formatPercent,
} from "../utils/calculations";
import { usePublicPricing } from "../utils/usePublicPricing";
import { Header } from "../components/Header";
import {
  showSuccess,
  showInfo,
  handleError,
} from "../utils/errorHandling";
import { trackPageView } from "../utils/analytics";
import { loadPendingAnalyses } from "../utils/pendingAnalysis";
import React from "react";

interface Analysis {
  id: string;
  property_name?: string;
  portal_source: string;
  listing_url: string;
  purchase_price: number;
  expected_monthly_rent: number;
  down_payment_percent: number;
  mortgage_interest_rate: number;
  area_sqft: number;
  gross_yield: number;
  net_yield: number;
  monthly_cash_flow: number;
  cash_on_cash_return: number;
  is_paid: boolean;
  paid_status?: "paid" | "free" | "checking";
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

type FilterType = "all" | "free" | "premium";
type SortType = "newest" | "yield" | "cashflow";

export default function DashboardPage() {
  const { user } = useAuth();
  const { priceLabel } = usePublicPricing();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingSyncing, setPendingSyncing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(
    null,
  );
  const [expandedRow, setExpandedRow] = useState<string | null>(
    null,
  );
  const [deleteConfirmId, setDeleteConfirmId] = useState<
    string | null
  >(null);

  const getPaidStatus = (analysis: Analysis) =>
    analysis.paid_status ??
    (analysis.is_paid ? "paid" : "free");

  // Filter and sort state
  const [filter, setFilter] = useState<FilterType>("all");
  const [sort, setSort] = useState<SortType>("newest");

  // Comparison mode state
  const [comparisonMode, setComparisonMode] = useState(false);
  const [selectedForComparison, setSelectedForComparison] =
    useState<string[]>([]);

  // Payment banner state
  const [showPaymentBanner, setShowPaymentBanner] =
    useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    "success" | "cancelled" | null
  >(null);
  const [purchasedAnalysisId, setPurchasedAnalysisId] =
    useState<string | null>(null);

  useEffect(() => {
    let active = true;

    // Check for payment status in URL
    const payment = searchParams.get("payment");
    const analysisId = searchParams.get("analysisId");

    if (payment === "success") {
      setPaymentStatus("success");
      setPurchasedAnalysisId(analysisId);
      setShowPaymentBanner(true);

      // Clean URL parameters
      searchParams.delete("payment");
      searchParams.delete("analysisId");
      setSearchParams(searchParams);
    } else if (payment === "cancelled") {
      setPaymentStatus("cancelled");
      setShowPaymentBanner(true);

      // Clean URL parameters
      searchParams.delete("payment");
      setSearchParams(searchParams);
    }

    const hasGuestPurchaseId = () => {
      try {
        return !!localStorage.getItem("yieldpulse-guest-purchase-id");
      } catch (err) {
        return false;
      }
    };

    const waitForPendingSync = async () => {
      const initialPending = loadPendingAnalyses();
      const initialGuestClaim = hasGuestPurchaseId();
      if (!initialPending.length && !initialGuestClaim) return;

      setPendingSyncing(true);
      const start = Date.now();
      const timeoutMs = 7000;
      const intervalMs = 300;

      while (Date.now() - start < timeoutMs) {
        if (!active) return;
        const pending = loadPendingAnalyses();
        const guestClaimPending = hasGuestPurchaseId();
        if (pending.length === 0 && !guestClaimPending) break;
        await new Promise((resolve) => setTimeout(resolve, intervalMs));
      }

      if (!active) return;
      setPendingSyncing(false);
    };

    const initialize = async () => {
      const hadGuestClaim = hasGuestPurchaseId();
      await waitForPendingSync();
      if (!active) return;
      await fetchAnalyses();
      if (hadGuestClaim && active) {
        setTimeout(() => {
          if (active) {
            fetchAnalyses({ silent: true });
          }
        }, 1500);
      }
      trackPageView("Dashboard");
    };

    initialize();

    return () => {
      active = false;
    };
  }, []);

  const dismissBanner = () => {
    setShowPaymentBanner(false);
  };

  const viewPurchasedReport = () => {
    if (!purchasedAnalysisId) return;

    const analysis = analyses.find(
      (a) => a.id === purchasedAnalysisId,
    );
    if (analysis) {
      handleViewAnalysis(analysis);
    }
  };

  const fetchAnalyses = async (options?: { silent?: boolean }) => {
    if (!options?.silent) {
      setLoading(true);
    }
    try {
      const { data, error, requestId } =
        await getUserAnalyses();

      if (error) {
        // Handle session expired / unauthorized - redirect WITHOUT showing error toast
        if (error.status === 401) {
          navigate("/auth/signin", {
            state: {
              message: "Your session has expired. Please sign in again.",
              returnTo: "/dashboard",
            },
            replace: true,
          });
          return; // Exit early - no error toast
        }
        
        console.error("Error fetching analyses:", error);
        
        // Only show error toast for non-401 errors
        handleError(
          error.error ||
            "Failed to load your reports. Please try again.",
          "Load Dashboard",
          () => fetchAnalyses(),
          requestId,
        );
        return;
      }

      const list = (data || []).map((analysis) => ({
        ...analysis,
        paid_status: analysis.is_paid ? "paid" : "checking",
      }));

      setAnalyses(list);

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

        if (paidIds.size > 0 || freeIds.size > 0) {
          setAnalyses((prev) =>
            prev.map((analysis) => {
              if (paidIds.has(analysis.id)) {
                return {
                  ...analysis,
                  is_paid: true,
                  paid_status: "paid",
                };
              }
              if (freeIds.has(analysis.id)) {
                return { ...analysis, paid_status: "free" };
              }
              return analysis;
            }),
          );
        }
      }
    } catch (err: any) {
      console.error("Error fetching analyses:", err);
      handleError(
        err.message ||
          "Failed to load your reports. Please try again.",
        "Load Dashboard",
      );
    } finally {
      if (!options?.silent) {
        setLoading(false);
      }
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);

    try {
      const { error, requestId } = await deleteAnalysis(id);

      if (error) {
        console.error("Error deleting analysis:", error);
        handleError(
          error.error ||
            "Failed to delete analysis. Please try again.",
          "Delete Analysis",
          () => retryDelete(id),
          requestId,
        );
        return;
      }

      setAnalyses((prev) => prev.filter((a) => a.id !== id));
      setDeleteConfirmId(null);
      showSuccess("Analysis deleted successfully.");
    } catch (err: any) {
      console.error("Error deleting analysis:", err);
      handleError(
        err.message ||
          "Failed to delete analysis. Please try again.",
        "Delete Analysis",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const retryDelete = (id: string) => {
    handleDelete(id);
  };

  const handleViewAnalysis = (analysis: Analysis) => {
    navigate("/results", {
      state: {
        fromDashboard: true,
        analysisId: analysis.id,
        analysis: analysis,
      },
    });
  };

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  // Filter and sort logic
  const getFilteredAndSortedAnalyses = () => {
    let filtered = analyses;

    // Apply filter
    if (filter === "free") {
      filtered = analyses.filter(
        (analysis) => getPaidStatus(analysis) === "free",
      );
    } else if (filter === "premium") {
      filtered = analyses.filter(
        (analysis) => getPaidStatus(analysis) === "paid",
      );
    }

    // Apply sort
    const sorted = [...filtered].sort((a, b) => {
      if (sort === "newest") {
        return (
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime()
        );
      } else if (sort === "yield") {
        return b.gross_yield - a.gross_yield;
      } else if (sort === "cashflow") {
        return b.monthly_cash_flow - a.monthly_cash_flow;
      }
      return 0;
    });

    return sorted;
  };

  const filteredAnalyses = getFilteredAndSortedAnalyses();

  const formatDate = (dateString: string) => {
    // Ensure the date string is parsed as UTC if it doesn't have timezone info
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    
    // Format date in short numeric format: "11/01/26"
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    const dateStr = `${day}/${month}/${year}`;
    
    // Format time: "2:30 PM"
    const timeStr = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    
    return `${dateStr}, ${timeStr}`;
  };

  // Comparison mode handlers
  const toggleReportSelection = (analysisId: string) => {
    if (selectedForComparison.includes(analysisId)) {
      setSelectedForComparison(
        selectedForComparison.filter((id) => id !== analysisId),
      );
    } else {
      if (selectedForComparison.length >= 5) {
        showInfo(
          "Maximum 5 reports",
          "You can compare up to 5 premium reports at once.",
        );
        return;
      }
      setSelectedForComparison([
        ...selectedForComparison,
        analysisId,
      ]);
    }
  };

  const handleStartComparison = () => {
    if (selectedForComparison.length < 2) {
      showInfo(
        "Minimum 2 reports required",
        "Please select at least 2 premium reports to compare.",
      );
      return;
    }
    navigate("/comparison", {
      state: { selectedIds: selectedForComparison },
    });
  };

  const cancelComparisonMode = () => {
    setComparisonMode(false);
    setSelectedForComparison([]);
  };

  // Generate human-readable Report ID from database ID
  const formatReportId = (id: string): string => {
    // Extract numeric part from UUID or use hash code
    const numericHash = id.split('').reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);
    const reportNumber = (numericHash % 999999).toString().padStart(6, '0');
    return `YP-${reportNumber}`;
  };

  // Notes editing state
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteValue, setNoteValue] = useState<string>("");

  const handleNoteEdit = (analysis: Analysis) => {
    setEditingNoteId(analysis.id);
    setNoteValue(analysis.notes || "");
  };

  const handleNoteSave = async (analysisId: string) => {
    try {
      const { error } = await updateAnalysisNote(analysisId, noteValue);
      
      if (error) {
        console.error("Error saving note:", error);
        handleError(
          error.error || "Failed to save note. Please try again.",
          "Save Note"
        );
        return;
      }

      // Update local state
      setAnalyses((prev) =>
        prev.map((a) =>
          a.id === analysisId ? { ...a, notes: noteValue } : a
        )
      );
      setEditingNoteId(null);
      showSuccess("Note saved successfully.");
    } catch (err: any) {
      console.error("Error saving note:", err);
      handleError(
        err.message || "Failed to save note. Please try again.",
        "Save Note"
      );
    }
  };

  const handleNoteCancel = () => {
    setEditingNoteId(null);
    setNoteValue("");
  };

  // Property name editing state
  const [editingPropertyNameId, setEditingPropertyNameId] = useState<string | null>(null);
  const [propertyNameValue, setPropertyNameValue] = useState<string>("");

  const handlePropertyNameEdit = (analysis: Analysis) => {
    setEditingPropertyNameId(analysis.id);
    setPropertyNameValue(analysis.property_name || "");
  };

  const handlePropertyNameSave = async (analysisId: string) => {
    try {
      const { error } = await updatePropertyName(analysisId, propertyNameValue);
      
      if (error) {
        console.error("Error saving property name:", error);
        handleError(
          error.error || "Failed to save property name. Please try again.",
          "Save Property Name"
        );
        return;
      }

      // Update local state
      setAnalyses((prev) =>
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
        "Save Property Name"
      );
    }
  };

  const handlePropertyNameCancel = () => {
    setEditingPropertyNameId(null);
    setPropertyNameValue("");
  };

  if (loading || pendingSyncing) {
    const message = pendingSyncing
      ? "Syncing your saved reports..."
      : "Syncing saved reports...";

    return (
      <div className="min-h-screen bg-neutral-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          <div className="bg-white rounded-2xl border border-border shadow-sm p-10 flex flex-col items-center text-center gap-4">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-border bg-muted/40">
              <span className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-border border-t-primary"></span>
            </div>
            <div className="">
              <p className="text-lg font-semibold text-foreground">{message}</p>
              <p className="text-sm text-neutral-500 mt-2">
                This usually takes just a moment.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-3 tracking-tight">
            Welcome back, {user?.fullName}
          </h1>
          <p className="text-lg text-neutral-600">
            Your property investment control center
          </p>
        </div>

        {/* Payment Banner */}
        {showPaymentBanner && (
          <div
            className={`rounded-xl shadow-sm border p-6 mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 ${
              paymentStatus === "success"
                ? "bg-success/10 border-success/30"
                : "bg-warning/10 border-warning/30"
            }`}
          >
            <div className="flex items-start space-x-4 flex-1">
              {paymentStatus === "success" ? (
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
                  {paymentStatus === "success"
                    ? "Premium report unlocked successfully"
                    : "Payment cancelled"}
                </h3>
                <p className="text-neutral-700 text-sm mb-4">
                  {paymentStatus === "success"
                    ? "Your premium analysis is now fully accessible with all charts and projections."
                    : "You can try again anytime from the results page."}
                </p>
                {paymentStatus === "success" && (
                  <button
                    onClick={viewPurchasedReport}
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary-hover transition-all shadow-sm cursor-pointer"
                  >
                    <Eye className="w-5 h-5" />
                    <span>View Report</span>
                  </button>
                )}
              </div>
            </div>
            <button
              onClick={dismissBanner}
              className="p-2 text-neutral-500 hover:text-neutral-700 rounded-lg transition-colors flex-shrink-0 cursor-pointer"
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
            value={
              analyses.filter(
                (a) => getPaidStatus(a) === "paid",
              ).length
            }
            icon={TrendingUp}
            description="Full reports unlocked"
            variant="teal"
          />
          <StatCard
            label="Free Reports"
            value={
              analyses.filter(
                (a) => getPaidStatus(a) === "free",
              ).length
            }
            icon={Calculator}
            description="Preview analyses"
            variant="success"
          />
        </div>

        {/* Comparison Mode Banner */}
        {comparisonMode && analyses.length > 0 && (
          <div className="mb-8 bg-teal/10 border border-teal/30 rounded-xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-teal/20 rounded-lg">
                  <GitCompare className="w-6 h-6 text-teal" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    Comparison Mode
                  </h3>
                  <p className="text-sm text-neutral-700">
                    Select 2 to 4 premium reports to compare.
                    {selectedForComparison.length > 0 && (
                      <span className="font-medium text-teal ml-2">
                        {selectedForComparison.length} selected
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleStartComparison}
                  disabled={selectedForComparison.length < 2}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-[#14b8a6] text-white rounded-lg font-medium hover:bg-[#0f766e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm cursor-pointer"
                >
                  <GitCompare className="w-5 h-5" />
                  <span>
                    Compare{" "}
                    {selectedForComparison.length > 0
                      ? `(${selectedForComparison.length})`
                      : ""}
                  </span>
                </button>
                <button
                  onClick={cancelComparisonMode}
                  className="px-4 py-3 text-neutral-700 hover:text-foreground font-medium border border-border rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-border p-20 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-border border-t-primary mb-6"></div>
            <p className="text-neutral-600">
              Loading your reports...
            </p>
          </div>
        ) : analyses.length === 0 ? (
          // Empty State - Instructional
          <div className="bg-gradient-to-br from-white to-muted/30 rounded-2xl shadow-sm border border-border overflow-hidden">
            <div className="p-12 md:p-16 text-center">
              <div className="max-w-2xl mx-auto">
                {/* Icon */}
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                    <Calculator className="w-12 h-12 text-primary" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-teal rounded-full flex items-center justify-center shadow-lg">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* Heading */}
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Your Investment Dashboard Awaits
                </h3>
                <p className="text-lg text-neutral-700 mb-8 leading-relaxed">
                  Calculate your first property ROI to begin
                  building your investment portfolio analysis
                  library
                </p>

                {/* What Gets Saved */}
                <div className="bg-white rounded-xl border border-border p-6 mb-8 text-left">
                  <h4 className="font-semibold text-foreground mb-4 flex items-center space-x-2">
                    <Info className="w-5 h-5 text-primary" />
                    <span>What You'll Save</span>
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          Your Assumptions
                        </p>
                        <p className="text-xs text-neutral-600">
                          Purchase price, rent, financing terms,
                          and all operating costs
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          Calculated Results
                        </p>
                        <p className="text-xs text-neutral-600">
                          Yields, cash flow, ROI metrics, and
                          investment grade
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          Access Anytime
                        </p>
                        <p className="text-xs text-neutral-600">
                          View, compare, and review your
                          analyses from any device
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          Premium Upgrades
                        </p>
                          <p className="text-xs text-neutral-600">
                            Unlock detailed charts and projections
                            for {priceLabel} per property
                          </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <button
                  onClick={() => navigate("/calculator")}
                  className="inline-flex items-center space-x-3 px-10 py-5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary-hover transition-all shadow-lg hover:shadow-xl text-lg cursor-pointer"
                >
                  <Calculator className="w-6 h-6" />
                  <span>Create Your First Analysis</span>
                </button>

                <p className="text-sm text-neutral-500 mt-6">
                  Takes 3 minutes • Free to calculate • Save for
                  later comparison
                </p>
              </div>
            </div>
          </div>
        ) : (
          // Analyses Table
          <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
            <div className="px-8 py-6 border-b border-border">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="font-semibold text-foreground mb-1">
                    Your Analyses
                  </h2>
                  <p className="text-sm text-neutral-600">
                    {filteredAnalyses.length}{" "}
                    {filteredAnalyses.length === 1
                      ? "property"
                      : "properties"}
                    {filter !== "all" && ` (${filter})`}
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  {/* Filter */}
                  <div className="flex items-center space-x-2 bg-muted/50 rounded-lg p-1">
                    <button
                      onClick={() => setFilter("all")}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        filter === "all"
                          ? "bg-white text-foreground shadow-sm"
                          : "text-neutral-600 hover:text-foreground"
                      } cursor-pointer`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setFilter("free")}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        filter === "free"
                          ? "bg-white text-foreground shadow-sm"
                          : "text-neutral-600 hover:text-foreground"
                      } cursor-pointer`}
                    >
                      Free
                    </button>
                    <button
                      onClick={() => setFilter("premium")}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        filter === "premium"
                          ? "bg-white text-foreground shadow-sm"
                          : "text-neutral-600 hover:text-foreground"
                      } cursor-pointer`}
                    >
                      Premium
                    </button>
                  </div>

                  {/* Sort */}
                  <select
                    value={sort}
                    onChange={(e) =>
                      setSort(e.target.value as SortType)
                    }
                    className="px-4 py-2 bg-muted/50 border border-border rounded-lg text-sm font-medium text-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                  >
                    <option value="newest">Newest First</option>
                    <option value="yield">Highest Yield</option>
                    <option value="cashflow">
                      Highest Cash Flow
                    </option>
                  </select>

                  {/* Compare Reports Button */}
                  {analyses.filter(
                    (a) => getPaidStatus(a) === "paid",
                  ).length >= 2 &&
                    !comparisonMode && (
                      <button
                        onClick={() => {
                          setComparisonMode(true);
                          setSelectedForComparison([]);
                        }}
                        className="inline-flex items-center space-x-2 px-5 py-2.5 bg-teal/10 text-teal border border-teal/30 rounded-lg font-medium hover:bg-teal/20 transition-colors text-sm shadow-sm cursor-pointer"
                      >
                        <GitCompare className="w-4 h-4" />
                        <span>Compare Reports</span>
                      </button>
                    )}

                  {/* New Analysis Button */}
                  {!comparisonMode && (
                    <button
                      onClick={() => navigate("/calculator")}
                      className="inline-flex items-center space-x-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary-hover transition-colors text-sm shadow-sm cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>New Analysis</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    {comparisonMode && (
                      <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide w-16">
                        <input
                          type="checkbox"
                          checked={
                            selectedForComparison.length ===
                              filteredAnalyses.filter(
                                (a) =>
                                  getPaidStatus(a) ===
                                  "paid",
                              ).length &&
                            filteredAnalyses.filter(
                              (a) =>
                                getPaidStatus(a) === "paid",
                            ).length > 0
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedForComparison(
                                filteredAnalyses
                                  .filter(
                                    (a) =>
                                      getPaidStatus(a) ===
                                      "paid",
                                  )
                                  .map((a) => a.id),
                              );
                            } else {
                              setSelectedForComparison([]);
                            }
                          }}
                          className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-ring"
                        />
                      </th>
                    )}
                    <th className="px-4 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide w-48">
                      Property Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Date & Time
                    </th>
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
                      Monthly Cash Flow
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      <div className="flex items-center space-x-1">
                        <span>Status</span>
                        <Tooltip content="Premium analyses include full charts, projections, and detailed financial tables. Free analyses show executive summary only.">
                          <Info className="w-3 h-3" />
                        </Tooltip>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Actions
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide min-w-[200px]">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredAnalyses.map((analysis) => (
                    <AnalysisRow
                      key={analysis.id}
                      analysis={analysis}
                      comparisonMode={comparisonMode}
                      selectedForComparison={selectedForComparison}
                      setSelectedForComparison={setSelectedForComparison}
                      formatReportId={formatReportId}
                      getPaidStatus={getPaidStatus}
                      editingNoteId={editingNoteId}
                      noteValue={noteValue}
                      setNoteValue={setNoteValue}
                      handleNoteSave={handleNoteSave}
                      handleNoteCancel={handleNoteCancel}
                      handleNoteEdit={handleNoteEdit}
                      formatDate={formatDate}
                      expandedRow={expandedRow}
                      toggleRow={toggleRow}
                      handleViewAnalysis={handleViewAnalysis}
                      deleteConfirmId={deleteConfirmId}
                      setDeleteConfirmId={setDeleteConfirmId}
                      handleDelete={handleDelete}
                      deletingId={deletingId}
                      editingPropertyNameId={editingPropertyNameId}
                      propertyNameValue={propertyNameValue}
                      setPropertyNameValue={setPropertyNameValue}
                      handlePropertyNameEdit={handlePropertyNameEdit}
                      handlePropertyNameSave={handlePropertyNameSave}
                      handlePropertyNameCancel={handlePropertyNameCancel}
                    />
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
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    Compare Another Investment
                  </h3>
                  <p className="text-primary-foreground/90">
                    Build your portfolio by analyzing multiple
                    properties side by side
                  </p>
                </div>
                <button
                  onClick={() => navigate("/calculator")}
                  className="flex-shrink-0 inline-flex items-center space-x-3 px-8 py-4 bg-white text-primary rounded-xl font-medium hover:shadow-2xl transition-all cursor-pointer"
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

// Helper Components
interface StatCardProps {
  label: string;
  value: number;
  icon: React.ElementType;
  description: string;
  variant: "navy" | "teal" | "success";
}

function StatCard({
  label,
  value,
  icon: Icon,
  description,
  variant,
}: StatCardProps) {
  const variantStyles = {
    navy: "from-[#1e2875] to-[#2f3aad] text-white",
    teal: "from-[#0f766e] to-[#14b8a6] text-white",
    success: "from-emerald-500 to-emerald-400 text-white",
  };

  return (
    <div
      className={`rounded-xl shadow-sm border border-border overflow-hidden bg-gradient-to-br ${variantStyles[variant]}`}
    >
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
          <div className="p-3 bg-white/20 rounded-lg">
            <Icon className="w-6 h-6" />
          </div>
        </div>
        <div className="mb-2">
          <div className="text-3xl font-bold mb-1">{value}</div>
          <div className="text-sm font-medium opacity-90">
            {label}
          </div>
        </div>
        <div className="text-xs opacity-75">{description}</div>
      </div>
    </div>
  );
}

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

function Tooltip({ content, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help"
      >
        {children}
      </div>
      {isVisible && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap shadow-lg">
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
}

// Analysis Row Component
interface AnalysisRowProps {
  analysis: Analysis;
  comparisonMode: boolean;
  selectedForComparison: string[];
  setSelectedForComparison: (ids: string[]) => void;
  formatReportId: (id: string) => string;
  getPaidStatus: (analysis: Analysis) => "paid" | "free" | "checking";
  editingNoteId: string | null;
  noteValue: string;
  setNoteValue: (value: string) => void;
  handleNoteSave: (analysisId: string) => void;
  handleNoteCancel: () => void;
  handleNoteEdit: (analysis: Analysis) => void;
  formatDate: (dateString: string) => string;
  expandedRow: string | null;
  toggleRow: (id: string) => void;
  handleViewAnalysis: (analysis: Analysis) => void;
  deleteConfirmId: string | null;
  setDeleteConfirmId: (id: string | null) => void;
  handleDelete: (id: string) => void;
  deletingId: string | null;
  editingPropertyNameId: string | null;
  propertyNameValue: string;
  setPropertyNameValue: (value: string) => void;
  handlePropertyNameEdit: (analysis: Analysis) => void;
  handlePropertyNameSave: (analysisId: string) => void;
  handlePropertyNameCancel: () => void;
}

function AnalysisRow({
  analysis,
  comparisonMode,
  selectedForComparison,
  setSelectedForComparison,
  formatReportId,
  getPaidStatus,
  editingNoteId,
  noteValue,
  setNoteValue,
  handleNoteSave,
  handleNoteCancel,
  handleNoteEdit,
  formatDate,
  expandedRow,
  toggleRow,
  handleViewAnalysis,
  deleteConfirmId,
  setDeleteConfirmId,
  handleDelete,
  deletingId,
  editingPropertyNameId,
  propertyNameValue,
  setPropertyNameValue,
  handlePropertyNameEdit,
  handlePropertyNameSave,
  handlePropertyNameCancel,
}: AnalysisRowProps) {
  return (
    <>
      <tr className="hover:bg-muted/20 transition-colors">
        {comparisonMode && (
          <td className="px-6 py-5">
            <input
              type="checkbox"
              checked={selectedForComparison.includes(
                analysis.id,
              )}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedForComparison([
                    ...selectedForComparison,
                    analysis.id,
                  ]);
                } else {
                  setSelectedForComparison(
                    selectedForComparison.filter(
                      (id) =>
                        id !== analysis.id,
                    ),
                  );
                }
              }}
              disabled={getPaidStatus(analysis) !== "paid"}
              className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-ring disabled:opacity-30 disabled:cursor-not-allowed"
            />
          </td>
        )}
        <td className="px-4 py-5">
          {editingPropertyNameId === analysis.id ? (
            <div className="flex items-center space-x-2">
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
                className="flex-1 px-3 py-1.5 text-sm font-semibold border border-primary rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter property name..."
              />
              <button
                onClick={() => handlePropertyNameSave(analysis.id)}
                className="p-1.5 text-success hover:bg-success/10 rounded transition-colors cursor-pointer"
                title="Save"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={handlePropertyNameCancel}
                className="p-1.5 text-neutral-500 hover:bg-muted rounded transition-colors cursor-pointer"
                title="Cancel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => handlePropertyNameEdit(analysis)}
              className="group cursor-pointer flex items-center space-x-2"
            >
              <div>
                <div className="text-sm font-semibold text-foreground flex items-center space-x-2">
                  <span>{analysis.property_name || 'Unnamed Property'}</span>
                  <Edit3 className="w-3 h-3 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                </div>
                <div className="text-xs text-muted-foreground font-mono">
                  {formatReportId(analysis.id)}
                </div>
              </div>
            </div>
          )}
        </td>
        <td className="px-6 py-5">
          <div className="text-sm text-muted-foreground">
            {formatDate(analysis.created_at)}
          </div>
        </td>
        <td className="px-6 py-5">
          <div>
            <div className="text-sm font-semibold text-foreground">
              {analysis.portal_source}
            </div>
            <div className="text-sm text-muted-foreground">
              {analysis.area_sqft.toLocaleString()}{" "}
              sqft
            </div>
          </div>
        </td>
        <td className="px-6 py-5">
          <div className="text-sm font-semibold text-foreground">
            {formatCurrency(
              analysis.purchase_price,
            )}
          </div>
        </td>
        <td className="px-6 py-5">
          <div className="text-sm font-semibold text-foreground">
            {formatPercent(
              analysis.gross_yield,
            )}
          </div>
        </td>
        <td className="px-6 py-5">
          <div className="flex items-center space-x-2">
            <span
              className={`text-sm font-semibold ${
                analysis.monthly_cash_flow >= 0
                  ? "text-success"
                  : "text-destructive"
              }`}
            >
              {formatCurrency(
                analysis.monthly_cash_flow,
              )}
            </span>
            <span className="text-xs text-muted-foreground">
              /mo
            </span>
          </div>
        </td>
        <td className="px-6 py-5">
          {(() => {
            const status =
              getPaidStatus(analysis);
            if (status === "paid") {
              return (
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal/20 text-teal border border-teal/30">
                    <Unlock className="w-3 h-3" />
                    <span>Premium</span>
                  </span>
                </div>
              );
            }
            if (status === "checking") {
              return (
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-warning/10 text-warning border border-warning/30">
                    <span className="inline-block animate-spin rounded-full h-3 w-3 border-2 border-warning border-t-transparent"></span>
                    <span>Checking</span>
                  </span>
                </div>
              );
            }
            return (
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground border border-border">
                  <Lock className="w-3 h-3" />
                  <span>Free</span>
                </span>
              </div>
            );
          })()}
        </td>
        <td className="px-6 py-5">
          <div className="flex items-center justify-end space-x-2">
            {/* Expand/Collapse */}
            <button
              onClick={() =>
                toggleRow(analysis.id)
              }
              className="p-2 text-neutral-500 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer"
              aria-label={
                expandedRow === analysis.id
                  ? "Collapse details"
                  : "Expand details"
              }
            >
              {expandedRow === analysis.id ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {/* View */}
            <button
              onClick={() =>
                handleViewAnalysis(analysis)
              }
              className="inline-flex items-center space-x-1.5 px-4 py-2 text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors font-medium text-sm cursor-pointer"
              aria-label="View Analysis"
            >
              <Eye className="w-4 h-4" />
              <span>View</span>
            </button>

            {/* Delete */}
            {deleteConfirmId === analysis.id ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() =>
                    handleDelete(analysis.id)
                  }
                  disabled={
                    deletingId === analysis.id
                  }
                  className="px-3 py-2 bg-destructive text-destructive-foreground rounded-lg text-xs font-medium hover:bg-destructive/90 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {deletingId === analysis.id
                    ? "Deleting..."
                    : "Confirm"}
                </button>
                <button
                  onClick={() =>
                    setDeleteConfirmId(null)
                  }
                  className="px-3 py-2 bg-muted text-foreground rounded-lg text-xs font-medium hover:bg-muted/80 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() =>
                  setDeleteConfirmId(
                    analysis.id,
                  )
                }
                className="p-2 text-neutral-400 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer"
                aria-label="Delete Analysis"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </td>
        <td className="px-6 py-5">
          {editingNoteId === analysis.id ? (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={noteValue}
                onChange={(e) => setNoteValue(e.target.value)}
                onBlur={() => handleNoteSave(analysis.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleNoteSave(analysis.id);
                  } else if (e.key === "Escape") {
                    handleNoteCancel();
                  }
                }}
                maxLength={200}
                autoFocus
                className="flex-1 px-3 py-1.5 text-sm border border-primary rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Add a note..."
              />
              <button
                onClick={() => handleNoteSave(analysis.id)}
                className="p-1.5 text-success hover:bg-success/10 rounded transition-colors cursor-pointer"
                title="Save"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={handleNoteCancel}
                className="p-1.5 text-neutral-500 hover:bg-muted rounded transition-colors cursor-pointer"
                title="Cancel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => handleNoteEdit(analysis)}
              className="group cursor-pointer flex items-center space-x-2 min-h-[32px]"
            >
              {analysis.notes ? (
                <span className="text-sm text-foreground truncate max-w-[180px]" title={analysis.notes}>
                  {analysis.notes}
                </span>
              ) : (
                <span className="text-sm text-neutral-400 italic">
                  Add notes
                </span>
              )}
              <Edit3 className="w-3 h-3 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </div>
          )}
        </td>
      </tr>

      {/* Expandable Row - Assumptions Snapshot */}
      {expandedRow === analysis.id && (
        <tr className="bg-muted/10">
          <td colSpan={comparisonMode ? 10 : 9} className="px-6 py-5">
            <div className="flex items-start space-x-6">
              {/* Assumptions Snapshot */}
              <div className="flex-1">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Key Assumptions
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-neutral-500 mb-1">
                      Purchase Price
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {formatCurrency(
                        analysis.purchase_price,
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 mb-1">
                      Monthly Rent
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {analysis.expected_monthly_rent
                        ? formatCurrency(
                            analysis.expected_monthly_rent,
                          )
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 mb-1">
                      Down Payment
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {analysis.down_payment_percent
                        ? `${analysis.down_payment_percent}%`
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 mb-1">
                      Interest Rate
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {analysis.mortgage_interest_rate
                        ? `${analysis.mortgage_interest_rate}%`
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Premium Upgrade or Status */}
              {getPaidStatus(analysis) ===
              "free" ? (
                <div className="flex-shrink-0 bg-white border border-border rounded-lg p-4 max-w-xs">
                  <div className="flex items-start space-x-3 mb-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Lock className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-foreground text-sm mb-1">
                        Unlock Premium
                      </h5>
                      <p className="text-xs text-neutral-600 leading-relaxed">
                        Get detailed charts, 5
                        year projections, and
                        complete financial
                        tables for this analysis
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      handleViewAnalysis(
                        analysis,
                      )
                    }
                    className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors cursor-pointer"
                  >
                    Upgrade for {priceLabel}
                  </button>
                </div>
              ) : (
                <div className="flex-shrink-0 bg-teal/10 border border-teal/30 rounded-lg p-4 max-w-xs">
                  <div className="flex items-center space-x-2 mb-2">
                    <Unlock className="w-5 h-5 text-teal" />
                    <h5 className="font-semibold text-foreground text-sm">
                      Premium Unlocked
                    </h5>
                  </div>
                  <p className="text-xs text-neutral-700 leading-relaxed">
                    This analysis includes full
                    access to charts,
                    projections, and detailed
                    financial tables
                  </p>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
