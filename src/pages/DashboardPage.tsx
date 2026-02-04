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
  Download,
  Archive,
  Image,
  Upload,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import {
  getUserAnalyses,
  deleteAnalysis,
  checkPurchaseStatus,
  updateAnalysis,
  updateAnalysisNote,
  updatePropertyName,
  updatePropertyImage,
} from "../utils/apiClient";
import {
  formatCurrency,
  formatPercent,
} from "../utils/calculations";
import { Header } from "../components/Header";
import {
  showSuccess,
  showInfo,
  handleError,
} from "../utils/errorHandling";
import { trackPageView } from "../utils/analytics";
import { supabase } from "../utils/supabaseClient";
import { toast } from "sonner";
import React from "react";
import { usePublicPricing } from "../utils/usePublicPricing";

interface Analysis {
  id: string;
  property_name?: string;
  property_image_url?: string | null;
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
  const { priceLabel } = usePublicPricing();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(
    null,
  );
  const [expandedRow, setExpandedRow] = useState<string | null>(
    null,
  );
  const [deleteConfirmId, setDeleteConfirmId] = useState<
    string | null
  >(null);
  
  // Storage availability state
  const [storageAvailable, setStorageAvailable] = useState<boolean>(true);

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

  // Bulk action state (separate from comparison mode)
  const [bulkSelection, setBulkSelection] = useState<Set<string>>(
    new Set(),
  );
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] =
    useState(false);
  const [showBulkExportModal, setShowBulkExportModal] =
    useState(false);

  // Mock data state
  const [usingMockData, setUsingMockData] = useState(false);

  // Payment banner state
  const [showPaymentBanner, setShowPaymentBanner] =
    useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    "success" | "cancelled" | null
  >(null);
  const [purchasedAnalysisId, setPurchasedAnalysisId] =
    useState<string | null>(null);

  useEffect(() => {
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

    fetchAnalyses();
    trackPageView("Dashboard");
  }, []);

  // Clear bulk selection when filter changes
  useEffect(() => {
    if (bulkSelection.size > 0) {
      setBulkSelection(new Set());
      showInfo(
        "Selection cleared",
        "Selection cleared due to filter change.",
      );
    }
  }, [filter]);

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

  const fetchAnalyses = async () => {
    try {
      const { data, error, requestId } =
        await getUserAnalyses();

      if (error) {
        // Handle session expired / unauthorized
        if (error.status === 401) {
          console.error('❌ 401 Unauthorized from /analyses/user/me');
          console.error('🔍 This indicates a backend authentication issue');
          console.error('⚠️ User has valid frontend session but backend rejected token');
          console.error('🔧 Loading with mock data until backend is fixed...');
          
          // TEMPORARY: Use mock data until backend is fixed
          const mockAnalyses = [
            {
              id: 'mock-1',
              user_id: user?.id || 'mock-user',
              created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
              updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
              inputs: {
                propertyName: 'Marina Heights Tower',
                portalSource: 'Property Finder',
                listingUrl: 'https://propertyfinder.ae/sample-listing',
                areaSqft: 1200,
                purchasePrice: 1500000,
                downPaymentPercent: 25,
                mortgageInterestRate: 4.5,
                mortgageTermYears: 25,
                expectedMonthlyRent: 8500,
                serviceChargeAnnual: 12000,
                annualMaintenancePercent: 1,
                propertyManagementFeePercent: 5,
                dldFeePercent: 4,
                agentFeePercent: 2,
                capitalGrowthPercent: 5,
                rentGrowthPercent: 3,
                vacancyRatePercent: 5,
                holdingPeriodYears: 10,
              },
              results: {
                netCashFlow: 45000,
                netCashYield: 4.8,
                netRoi: 12.5,
                totalEquityAtExit: 750000,
              },
              is_paid: false,
              property_name: 'Marina Heights Tower',
              property_image_url: null,
              note: 'Sample investment opportunity in Dubai Marina',
              paid_status: 'checking',
            },
            {
              id: 'mock-2',
              user_id: user?.id || 'mock-user',
              created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
              updated_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
              inputs: {
                propertyName: 'Downtown Vista Apartment',
                portalSource: 'Bayut',
                listingUrl: 'https://bayut.com/sample-listing',
                areaSqft: 850,
                purchasePrice: 950000,
                downPaymentPercent: 30,
                mortgageInterestRate: 4.25,
                mortgageTermYears: 20,
                expectedMonthlyRent: 6000,
                serviceChargeAnnual: 8500,
                annualMaintenancePercent: 1,
                propertyManagementFeePercent: 5,
                dldFeePercent: 4,
                agentFeePercent: 2,
                capitalGrowthPercent: 4,
                rentGrowthPercent: 2.5,
                vacancyRatePercent: 5,
                holdingPeriodYears: 10,
              },
              results: {
                netCashFlow: 32000,
                netCashYield: 5.2,
                netRoi: 14.8,
                totalEquityAtExit: 580000,
              },
              is_paid: true,
              property_name: 'Downtown Vista Apartment',
              property_image_url: null,
              note: null,
              paid_status: 'paid',
            },
          ];

          setAnalyses(mockAnalyses);
          setUsingMockData(true);
          
          // Show informational message
          showInfo(
            'Dashboard loaded with sample data',
            'Backend authentication needs to be fixed. Check /BACKEND_JWT_FIX_REQUIRED.md for details.'
          );
          return;
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
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    // Prevent deleting mock data
    if (id.startsWith('mock-')) {
      showInfo(
        'Cannot delete sample data',
        'This is sample data displayed while backend authentication is being fixed.'
      );
      return;
    }

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
      
      // Remove from bulk selection if present
      setBulkSelection((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      
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
      if (selectedForComparison.length >= 3) {
        showInfo(
          "Maximum 3 reports",
          "You can compare up to 3 premium reports at once.",
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
    if (selectedForComparison.length < 2 || selectedForComparison.length > 3) {
      showInfo(
        "Selection Error",
        "Please select 2-3 premium reports to compare.",
      );
      return;
    }
    const idsParam = selectedForComparison.join(',');
    navigate(`/comparison?ids=${encodeURIComponent(idsParam)}`);
  };

  const cancelComparisonMode = () => {
    setComparisonMode(false);
    setSelectedForComparison([]);
  };

  // Bulk action handlers
  const toggleBulkSelection = (analysisId: string) => {
    setBulkSelection((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(analysisId)) {
        newSet.delete(analysisId);
      } else {
        newSet.add(analysisId);
      }
      return newSet;
    });
  };

  const handleMasterCheckboxChange = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(filteredAnalyses.map((a) => a.id));
      setBulkSelection(allIds);
    } else {
      setBulkSelection(new Set());
    }
  };

  const clearBulkSelection = () => {
    setBulkSelection(new Set());
  };

  const handleBulkCompare = () => {
    const selectedIds = Array.from(bulkSelection);
    console.log('🎯 [Dashboard] handleBulkCompare called');
    console.log('🎯 [Dashboard] bulkSelection:', bulkSelection);
    console.log('🎯 [Dashboard] selectedIds:', selectedIds);
    
    const premiumIds = selectedIds.filter((id) => {
      const analysis = analyses.find((a) => a.id === id);
      return analysis && getPaidStatus(analysis) === "paid";
    });

    console.log('🎯 [Dashboard] premiumIds:', premiumIds);
    console.log('🎯 [Dashboard] premiumIds.length:', premiumIds.length);

    if (premiumIds.length < 2 || premiumIds.length > 3) {
      showInfo(
        "Selection Error",
        "Please select 2-3 premium reports to compare.",
      );
      return;
    }

    // Use URL search params instead of location.state for reliability
    const idsParam = premiumIds.join(',');
    const navigateUrl = `/comparison?ids=${encodeURIComponent(idsParam)}`;
    console.log('🎯 [Dashboard] Navigating to:', navigateUrl);
    console.log('🎯 [Dashboard] Raw idsParam:', idsParam);
    navigate(navigateUrl);
  };

  const handleBulkExport = () => {
    setShowBulkExportModal(true);
  };

  const confirmBulkExport = async () => {
    const selectedIds = Array.from(bulkSelection);
    const selectedAnalyses = analyses.filter((a) =>
      selectedIds.includes(a.id),
    );

    const premiumAnalyses = selectedAnalyses.filter(
      (a) => getPaidStatus(a) === "paid",
    );
    const freeAnalyses = selectedAnalyses.filter(
      (a) => getPaidStatus(a) !== "paid",
    );

    if (premiumAnalyses.length === 0) {
      showInfo(
        "No Premium Reports",
        "You have only selected free reports. Premium reports are required for PDF export.",
      );
      setShowBulkExportModal(false);
      return;
    }

    // Note: Actual PDF generation would go here
    // For now, show a message about the feature
    showInfo(
      "Export Initiated",
      `Exporting ${premiumAnalyses.length} premium report${premiumAnalyses.length > 1 ? "s" : ""}. ${freeAnalyses.length > 0 ? `${freeAnalyses.length} free report${freeAnalyses.length > 1 ? "s" : ""} cannot be exported.` : ""}`,
    );

    setShowBulkExportModal(false);
  };

  const handleBulkArchive = () => {
    showInfo(
      "Archive Feature",
      "Archive functionality requires database schema update. This feature will be available soon.",
    );
  };

  const handleBulkDelete = () => {
    setShowBulkDeleteConfirm(true);
  };

  const confirmBulkDelete = async () => {
    const selectedIds = Array.from(bulkSelection);
    const deletePromises = selectedIds.map((id) =>
      deleteAnalysis(id).catch((err) => ({ error: err, id })),
    );

    const results = await Promise.all(deletePromises);
    const successIds = results
      .filter((r: any) => !r.error)
      .map((r: any, idx) => selectedIds[idx]);
    const failedCount = results.filter((r: any) => r.error).length;

    if (successIds.length > 0) {
      setAnalyses((prev) =>
        prev.filter((a) => !successIds.includes(a.id)),
      );
      showSuccess(
        `${successIds.length} report${successIds.length > 1 ? "s" : ""} deleted successfully.`,
      );
    }

    if (failedCount > 0) {
      handleError(
        `Failed to delete ${failedCount} report${failedCount > 1 ? "s" : ""}.`,
        "Bulk Delete",
      );
    }

    setBulkSelection(new Set());
    setShowBulkDeleteConfirm(false);
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

  // Property image upload state
  const [uploadingImageId, setUploadingImageId] = useState<string | null>(null);

  const handleImageUpload = async (analysisId: string, file: File) => {
    try {
      setUploadingImageId(analysisId);

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file (JPG, PNG, etc.).');
        setUploadingImageId(null);
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB.');
        setUploadingImageId(null);
        return;
      }

      // Create unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${analysisId}-${Date.now()}.${fileExt}`;
      const filePath = `property-images/${fileName}`;

      // Upload to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('analysis-assets')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        
        // Provide specific error message for missing bucket
        if (uploadError.message?.includes('Bucket not found')) {
          setStorageAvailable(false);
          toast.error('Storage not configured. Please create the "analysis-assets" bucket in Supabase (see supabase-storage-setup.sql).');
        } else {
          toast.error(uploadError.message || 'Failed to upload image. Please try again.');
        }
        
        setUploadingImageId(null);
        return;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('analysis-assets')
        .getPublicUrl(filePath);

      const imageUrl = urlData.publicUrl;

      // Update analysis with image URL
      const { error: updateError } = await updatePropertyImage(analysisId, imageUrl);

      if (updateError) {
        console.error('Error updating property image:', updateError);
        handleError(
          updateError.error || 'Failed to save image. Please try again.',
          'Save Image'
        );
        setUploadingImageId(null);
        return;
      }

      // Update local state
      setAnalyses((prev) =>
        prev.map((a) =>
          a.id === analysisId ? { ...a, property_image_url: imageUrl } : a
        )
      );
      
      showSuccess('Property image uploaded successfully.');
      setUploadingImageId(null);
    } catch (err: any) {
      console.error('Error uploading image:', err);
      handleError(
        err.message || 'Failed to upload image. Please try again.',
        'Upload Image'
      );
      setUploadingImageId(null);
    }
  };

  const handleImageDelete = async (analysisId: string, currentImageUrl?: string | null) => {
    try {
      setUploadingImageId(analysisId);

      // Delete from storage if there's an existing image
      if (currentImageUrl) {
        const urlParts = currentImageUrl.split('/');
        const filePath = `property-images/${urlParts[urlParts.length - 1]}`;
        
        await supabase.storage
          .from('analysis-assets')
          .remove([filePath]);
      }

      // Update analysis to remove image URL
      const { error: updateError } = await updatePropertyImage(analysisId, null);

      if (updateError) {
        console.error('Error removing property image:', updateError);
        handleError(
          updateError.error || 'Failed to remove image. Please try again.',
          'Remove Image'
        );
        setUploadingImageId(null);
        return;
      }

      // Update local state
      setAnalyses((prev) =>
        prev.map((a) =>
          a.id === analysisId ? { ...a, property_image_url: null } : a
        )
      );
      
      showSuccess('Property image removed successfully.');
      setUploadingImageId(null);
    } catch (err: any) {
      console.error('Error removing image:', err);
      handleError(
        err.message || 'Failed to remove image. Please try again.',
        'Remove Image'
      );
      setUploadingImageId(null);
    }
  };

  // Portfolio snapshot calculations
  const now = Date.now();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const safeDate = (value: any) => {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  };

  let activeCount = 0;
  let archivedCount = 0;
  let activeYieldSum = 0;

  let mostRecentDate: Date | null = null;

  for (const a of analyses) {
    const d = safeDate(a.updated_at);

    // Conservative default: unknown dates are treated as archived
    const isActive = d ? d >= thirtyDaysAgo : false;

    if (isActive) {
      activeCount += 1;
      activeYieldSum += Number(a.gross_yield) || 0;
    } else {
      archivedCount += 1;
    }

    if (d && (!mostRecentDate || d > mostRecentDate)) {
      mostRecentDate = d;
    }
  }

  const activeAvgYield = activeCount >= 2 ? activeYieldSum / activeCount : null;

  const lastUpdatedText = (() => {
    if (!mostRecentDate) return null;

    const diffMs = now - mostRecentDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "just now";
    if (diffHours < 24) return "today";
    if (diffDays === 1) return "yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
  })();

  // Status distribution
  // TODO: Add a true status field for Draft Finalised Compared.
  // Current implementation only proxies Finalised via paid status.
  // Draft and Compared are not tracked at present.
  const draftCount = 0;
  const finalisedCount = analyses.filter((a) => getPaidStatus(a) === "paid").length;
  const comparedCount = 0;

  const totalForBar = Math.max(analyses.length, 1);
  const draftPercent = (draftCount / totalForBar) * 100;
  const finalisedPercent = (finalisedCount / totalForBar) * 100;
  const comparedPercent = (comparedCount / totalForBar) * 100;

  // Prevent fully invisible bar when all segments are 0
  const hasAnyStatus = draftCount + finalisedCount + comparedCount > 0;
  const adjustedDraftPercent = hasAnyStatus ? draftPercent : 0;
  const adjustedFinalisedPercent = hasAnyStatus ? finalisedPercent : 100;
  const adjustedComparedPercent = hasAnyStatus ? comparedPercent : 0;

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
            Your property investment control center
          </p>
        </div>

        {/* Mock Data Warning Banner */}
        {usingMockData && (
          <div className="rounded-xl shadow-sm border border-warning/30 bg-warning/10 p-6 mb-8">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-warning/20 rounded-xl flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-warning" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-2">
                  ⚠️ Viewing Sample Data
                </h3>
                <p className="text-neutral-700 text-sm mb-3">
                  The dashboard is currently displaying sample property analyses because the backend is not properly validating authentication tokens. 
                  Your actual saved analyses will appear once the backend Edge Function is updated.
                </p>
                <div className="bg-white rounded-lg border border-warning/20 p-3 text-sm">
                  <p className="font-medium text-foreground mb-1">🔧 Fix Required:</p>
                  <p className="text-neutral-600">
                    Update the Supabase Edge Function to use <code className="bg-neutral-100 px-2 py-0.5 rounded text-xs font-mono">supabase.auth.getUser(jwt)</code> for JWT validation.
                    See <code className="bg-neutral-100 px-2 py-0.5 rounded text-xs font-mono">/BACKEND_JWT_FIX_REQUIRED.md</code> for complete instructions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Banner */}
        {showPaymentBanner && (
          <div
            className={`rounded-xl shadow-sm border p-6 mb-8 flex items-start justify-between ${
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

        {/* Storage Setup Banner */}
        {!storageAvailable && analyses.some(a => getPaidStatus(a) === 'paid') && (
          <div className="rounded-xl shadow-sm border border-warning/30 bg-warning/10 p-6 mb-8">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-warning/20 rounded-xl flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-warning" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-2">
                  Property Image Upload Requires Setup
                </h3>
                <p className="text-neutral-700 text-sm mb-3">
                  To enable property image uploads for premium reports, you need to create the storage bucket in Supabase.
                </p>
                <div className="bg-white/60 rounded-lg p-4 text-sm space-y-2 mb-4">
                  <p className="font-medium text-foreground">Quick Setup Steps:</p>
                  <ol className="list-decimal list-inside space-y-1 text-neutral-700 pl-2">
                    <li>Open the <code className="bg-white px-2 py-0.5 rounded text-xs">supabase-storage-setup.sql</code> file in your project</li>
                    <li>Copy the SQL script</li>
                    <li>Go to your Supabase project → SQL Editor</li>
                    <li>Paste and run the script</li>
                    <li>Refresh this page - image upload will work!</li>
                  </ol>
                </div>
                <p className="text-xs text-neutral-600">
                  The setup takes less than 1 minute. See <code className="bg-white px-1.5 py-0.5 rounded">SUPABASE_SETUP.md</code> for detailed instructions.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Portfolio Snapshot */}
        {analyses.length > 0 && (
          <div className="mb-8 pb-5 border-b border-neutral-200">
            <h2 className="text-xs uppercase tracking-wider text-neutral-400 font-medium mb-4">
              Portfolio Snapshot
            </h2>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              {/* Active vs Archived */}
              <div className="flex items-baseline gap-3">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-sm text-neutral-500">Active:</span>
                  <span className="text-xl font-semibold text-foreground">{activeCount}</span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-sm text-neutral-400">Archived:</span>
                  <span className="text-lg font-medium text-neutral-400">{archivedCount}</span>
                </div>
              </div>

              {/* Status Distribution Bar */}
              <div
                className="h-1.5 w-32 bg-neutral-100 rounded-full overflow-hidden flex"
                role="img"
                aria-label={`Status model Draft Finalised Compared. Currently tracked finalised ${finalisedCount}.`}
                title={`Status model: Draft • Finalised • Compared. Currently tracked: Finalised ${finalisedCount}.`}
              >
                <div className="bg-neutral-300" style={{ width: `${adjustedDraftPercent}%` }} />
                <div className="bg-primary" style={{ width: `${adjustedFinalisedPercent}%` }} />
                <div className="bg-teal" style={{ width: `${adjustedComparedPercent}%` }} />
              </div>

              {/* Optional: Average Yield (only if 2+ active reports) */}
              {activeAvgYield !== null && (
                <div className="flex items-baseline gap-1.5">
                  <span className="text-sm text-neutral-500">Avg yield:</span>
                  <span className="text-lg font-semibold text-primary">
                    {formatPercent(activeAvgYield)}
                  </span>
                </div>
              )}

              {/* Most Recent Activity */}
              {lastUpdatedText && (
                <div className="text-sm text-neutral-500 ml-auto">
                  Last updated {lastUpdatedText}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Comparison Mode Banner */}
        {comparisonMode && analyses.length > 0 && (
          <div className="mb-8 bg-teal/10 border border-teal/30 rounded-xl p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-teal/20 rounded-lg">
                  <GitCompare className="w-6 h-6 text-teal" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    Comparison Mode
                  </h3>
                  <p className="text-sm text-neutral-700">
                    Select 2 to 3 premium reports to compare.
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
                  disabled={selectedForComparison.length < 2 || selectedForComparison.length > 3}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-[#14b8a6] text-white rounded-lg font-medium hover:bg-[#0f766e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
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
                  className="px-4 py-3 text-neutral-700 hover:text-foreground font-medium border border-border rounded-lg hover:bg-neutral-50 transition-colors"
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
                  className="inline-flex items-center space-x-3 px-10 py-5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary-hover transition-all shadow-lg hover:shadow-xl text-lg"
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
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setFilter("free")}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        filter === "free"
                          ? "bg-white text-foreground shadow-sm"
                          : "text-neutral-600 hover:text-foreground"
                      }`}
                    >
                      Free
                    </button>
                    <button
                      onClick={() => setFilter("premium")}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        filter === "premium"
                          ? "bg-white text-foreground shadow-sm"
                          : "text-neutral-600 hover:text-foreground"
                      }`}
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
                          setBulkSelection(new Set());
                        }}
                        className="inline-flex items-center space-x-2 px-5 py-2.5 bg-teal/10 text-teal border border-teal/30 rounded-lg font-medium hover:bg-teal/20 transition-colors text-sm shadow-sm"
                      >
                        <GitCompare className="w-4 h-4" />
                        <span>Compare Reports</span>
                      </button>
                    )}

                  {/* New Analysis Button */}
                  {!comparisonMode && (
                    <button
                      onClick={() => navigate("/calculator")}
                      className="inline-flex items-center space-x-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary-hover transition-colors text-sm shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>New Analysis</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Bulk Action Bar */}
            {!comparisonMode && bulkSelection.size > 0 && (
              <div className="sticky top-0 z-10 bg-neutral-50 border-b border-border px-8 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-foreground">
                    {bulkSelection.size} report{bulkSelection.size > 1 ? "s" : ""} selected
                  </span>
                  <button
                    onClick={clearBulkSelection}
                    className="text-sm text-primary hover:underline"
                  >
                    Clear selection
                  </button>
                </div>
                <div className="flex items-center space-x-3">
                  {/* Compare Button */}
                  <button
                    onClick={handleBulkCompare}
                    disabled={bulkSelection.size < 2 || bulkSelection.size > 3}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    title={bulkSelection.size < 2 || bulkSelection.size > 3 ? "Select 2-3 reports to compare" : "Compare selected reports"}
                  >
                    <GitCompare className="w-4 h-4" />
                    <span>Compare</span>
                  </button>

                  {/* Export PDF Button */}
                  <button
                    onClick={handleBulkExport}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary-hover transition-colors text-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export PDF</span>
                  </button>

                  {/* Archive Button */}
                  <button
                    onClick={handleBulkArchive}
                    className="inline-flex items-center space-x-2 px-4 py-2 border border-border text-foreground rounded-lg font-medium hover:bg-neutral-100 transition-colors text-sm"
                  >
                    <Archive className="w-4 h-4" />
                    <span>Archive</span>
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={handleBulkDelete}
                    className="inline-flex items-center space-x-2 px-4 py-2 border border-destructive/30 text-destructive rounded-lg font-medium hover:bg-destructive/10 transition-colors text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    {/* Bulk Selection Checkbox Column */}
                    {!comparisonMode && (
                      <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide w-16">
                        <input
                          type="checkbox"
                          checked={
                            bulkSelection.size > 0 &&
                            bulkSelection.size === filteredAnalyses.length
                          }
                          ref={(el) => {
                            if (el) {
                              el.indeterminate =
                                bulkSelection.size > 0 &&
                                bulkSelection.size < filteredAnalyses.length;
                            }
                          }}
                          onChange={(e) =>
                            handleMasterCheckboxChange(e.target.checked)
                          }
                          className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-ring"
                        />
                      </th>
                    )}

                    {/* Comparison Mode Checkbox Column */}
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
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide w-24">
                      Image
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
                      toggleReportSelection={toggleReportSelection}
                      bulkSelection={bulkSelection}
                      toggleBulkSelection={toggleBulkSelection}
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
                      uploadingImageId={uploadingImageId}
                      handleImageUpload={handleImageUpload}
                      handleImageDelete={handleImageDelete}
                      storageAvailable={storageAvailable}
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
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
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
                  className="flex-shrink-0 inline-flex items-center space-x-3 px-8 py-4 bg-white text-primary rounded-xl font-medium hover:shadow-2xl transition-all"
                >
                  <Plus className="w-5 h-5" />
                  <span>New Analysis</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Delete Confirmation Modal */}
        {showBulkDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-foreground mb-3">
                Delete {bulkSelection.size} Report{bulkSelection.size > 1 ? "s" : ""}?
              </h3>
              <p className="text-sm text-neutral-700 mb-6">
                This action cannot be undone. Your PDF downloads will remain available, but the reports will be permanently removed from your dashboard.
              </p>
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowBulkDeleteConfirm(false)}
                  className="px-4 py-2 border border-border rounded-lg text-foreground font-medium hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmBulkDelete}
                  className="px-4 py-2 bg-destructive text-white rounded-lg font-medium hover:bg-destructive/90 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Export Modal */}
        {showBulkExportModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-foreground mb-3">
                Export Selected Reports
              </h3>
              <p className="text-sm text-neutral-700 mb-4">
                {(() => {
                  const selectedIds = Array.from(bulkSelection);
                  const selectedAnalyses = analyses.filter((a) =>
                    selectedIds.includes(a.id),
                  );
                  const premiumCount = selectedAnalyses.filter(
                    (a) => getPaidStatus(a) === "paid",
                  ).length;
                  const freeCount = selectedAnalyses.filter(
                    (a) => getPaidStatus(a) !== "paid",
                  ).length;

                  if (premiumCount === 0) {
                    return "You have selected only free reports. Premium reports are required for PDF export.";
                  }
                  
                  if (freeCount === 0) {
                    return `You have selected ${premiumCount} premium report${premiumCount > 1 ? "s" : ""}. All will be exported as PDF.`;
                  }

                  return `You have selected ${bulkSelection.size} reports: ${premiumCount} premium (will export), ${freeCount} free (cannot export). Continue?`;
                })()}
              </p>
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowBulkExportModal(false)}
                  className="px-4 py-2 border border-border rounded-lg text-foreground font-medium hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmBulkExport}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary-hover transition-colors"
                >
                  Continue
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
        <div className="flex items-start justify-between mb-4">
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
  toggleReportSelection: (analysisId: string) => void;
  bulkSelection: Set<string>;
  toggleBulkSelection: (id: string) => void;
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
  uploadingImageId: string | null;
  handleImageUpload: (analysisId: string, file: File) => void;
  handleImageDelete: (analysisId: string, currentImageUrl?: string | null) => void;
  storageAvailable: boolean;
}

function AnalysisRow({
  analysis,
  comparisonMode,
  selectedForComparison,
  setSelectedForComparison,
  toggleReportSelection,
  bulkSelection,
  toggleBulkSelection,
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
  uploadingImageId,
  handleImageUpload,
  handleImageDelete,
  storageAvailable,
}: AnalysisRowProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  return (
    <>
      <tr className="hover:bg-muted/20 transition-colors">
        {/* Bulk Selection Checkbox */}
        {!comparisonMode && (
          <td className="px-6 py-5">
            <input
              type="checkbox"
              checked={bulkSelection.has(analysis.id)}
              onChange={() => toggleBulkSelection(analysis.id)}
              className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-ring"
            />
          </td>
        )}

        {/* Comparison Mode Checkbox */}
        {comparisonMode && (
          <td className="px-6 py-5">
            <input
              type="checkbox"
              checked={selectedForComparison.includes(analysis.id)}
              onChange={() => toggleReportSelection(analysis.id)}
              disabled={
                getPaidStatus(analysis) !== "paid" ||
                (!selectedForComparison.includes(analysis.id) &&
                  selectedForComparison.length >= 3)
              }
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
                className="p-1.5 text-success hover:bg-success/10 rounded transition-colors"
                title="Save"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={handlePropertyNameCancel}
                className="p-1.5 text-neutral-500 hover:bg-muted rounded transition-colors"
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
        
        {/* Property Image Column */}
        <td className="px-6 py-5">
          <div className="relative group">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleImageUpload(analysis.id, file);
                }
                // Reset input
                e.target.value = '';
              }}
            />
            
            {analysis.property_image_url ? (
              <div className="relative">
                <img
                  src={analysis.property_image_url}
                  alt={analysis.property_name || 'Property'}
                  className="w-14 h-14 object-cover rounded-lg border border-border"
                />
                {getPaidStatus(analysis) === 'paid' && (
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-1">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImageId === analysis.id}
                      className="p-1.5 bg-white rounded hover:bg-gray-100 transition-colors disabled:opacity-50"
                      title="Change image"
                    >
                      <Upload className="w-3 h-3 text-gray-700" />
                    </button>
                    <button
                      onClick={() => handleImageDelete(analysis.id, analysis.property_image_url)}
                      disabled={uploadingImageId === analysis.id}
                      className="p-1.5 bg-white rounded hover:bg-gray-100 transition-colors disabled:opacity-50"
                      title="Remove image"
                    >
                      <X className="w-3 h-3 text-gray-700" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative">
                <div className="w-14 h-14 bg-muted rounded-lg border border-border flex items-center justify-center">
                  <Image className="w-6 h-6 text-muted-foreground" />
                </div>
                {getPaidStatus(analysis) === 'paid' && storageAvailable && (
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImageId === analysis.id}
                      className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                      title="Upload image"
                    >
                      <Upload className="w-4 h-4 text-gray-700" />
                    </button>
                  </div>
                )}
                {getPaidStatus(analysis) === 'paid' && !storageAvailable && (
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center p-2">
                    <div className="text-[10px] text-white text-center leading-tight">
                      Run setup SQL
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {uploadingImageId === analysis.id && (
              <div className="absolute inset-0 bg-white/80 rounded-lg flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
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
              {analysis.area_sqft != null
                ? `${analysis.area_sqft.toLocaleString()} sqft`
                : "N/A"}
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
              className="p-2 text-neutral-500 hover:bg-muted/50 rounded-lg transition-colors"
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
              className="inline-flex items-center space-x-1.5 px-4 py-2 text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors font-medium text-sm"
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
                  className="px-3 py-2 bg-destructive text-destructive-foreground rounded-lg text-xs font-medium hover:bg-destructive/90 transition-colors disabled:opacity-50"
                >
                  {deletingId === analysis.id
                    ? "Deleting..."
                    : "Confirm"}
                </button>
                <button
                  onClick={() =>
                    setDeleteConfirmId(null)
                  }
                  className="px-3 py-2 bg-muted text-foreground rounded-lg text-xs font-medium hover:bg-muted/80 transition-colors"
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
                className="p-2 text-neutral-400 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
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
                className="p-1.5 text-success hover:bg-success/10 rounded transition-colors"
                title="Save"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={handleNoteCancel}
                className="p-1.5 text-neutral-500 hover:bg-muted rounded transition-colors"
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
                    className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors"
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
