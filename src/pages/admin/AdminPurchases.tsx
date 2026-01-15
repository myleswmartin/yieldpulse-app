import { useEffect, useMemo, useState } from "react";
import {
  CreditCard,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  AlertCircle,
  Download,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { adminApi } from "../../utils/adminApi";

type PurchaseStatus = "paid" | "pending" | "failed" | "refunded";

interface Purchase {
  id: string;
  user_id: string | null;
  user_email?: string | null;
  user_full_name?: string | null;
  analysis_id?: string | null;
  property_name?: string | null;
  portal_source?: string | null;
  amount_aed: number;
  currency: string;
  status: PurchaseStatus;
  stripe_payment_intent_id?: string | null;
  stripe_checkout_session_id?: string | null;
  created_at: string;
  purchased_at?: string | null;
  refund_reason?: string | null;
}

const statusConfig = {
  paid: {
    icon: CheckCircle,
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200",
    label: "Paid",
  },
  pending: {
    icon: Clock,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    label: "Pending",
  },
  failed: {
    icon: XCircle,
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    label: "Failed",
  },
  refunded: {
    icon: RefreshCw,
    color: "text-neutral-600",
    bg: "bg-neutral-50",
    border: "border-neutral-200",
    label: "Refunded",
  },
};

const formatTimestamp = (timestamp?: string | null) => {
  if (!timestamp) return "—";
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) {
    const diffMins = Math.floor(diffMs / (1000 * 60));
    return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
  }
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  }
  if (diffDays < 7) {
    return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  }
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function AdminPurchases() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("all");

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const res = await adminApi.purchases.list({
        status: statusFilter,
        search: searchQuery || undefined,
      });
      setPurchases(res.purchases || []);
    } catch (error: any) {
      console.error("Admin purchases fetch error:", error);
      toast.error(error?.message || "Failed to load purchases");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const filteredPurchases = useMemo(() => {
    const lowerSearch = searchQuery.toLowerCase();
    return purchases.filter((p) => {
      const matchesSearch =
        !lowerSearch ||
        (p.property_name || "").toLowerCase().includes(lowerSearch) ||
        (p.portal_source || "").toLowerCase().includes(lowerSearch) ||
        (p.user_full_name || "").toLowerCase().includes(lowerSearch) ||
        (p.user_email || "").toLowerCase().includes(lowerSearch) ||
        (p.id || "").toLowerCase().includes(lowerSearch) ||
        (p.stripe_payment_intent_id || "").toLowerCase().includes(lowerSearch) ||
        (p.stripe_checkout_session_id || "").toLowerCase().includes(lowerSearch);

      const matchesStatus = statusFilter === "all" || p.status === statusFilter;

      const matchesDateRange = (() => {
        if (dateRange === "all") return true;
        const purchaseDate = new Date(p.created_at);
        const now = new Date();
        const diffDays = Math.floor(
          (now.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24),
        );
        if (dateRange === "today") return diffDays === 0;
        if (dateRange === "week") return diffDays <= 7;
        if (dateRange === "month") return diffDays <= 30;
        return true;
      })();

      return matchesSearch && matchesStatus && matchesDateRange;
    });
  }, [purchases, searchQuery, statusFilter, dateRange]);

  const stats = useMemo(() => {
    const paid = purchases.filter((p) => p.status === "paid");
    return {
      totalRevenue: paid.reduce((sum, p) => sum + (p.amount_aed || 0), 0),
      totalPurchases: purchases.length,
      successfulPurchases: paid.length,
      pendingPurchases: purchases.filter((p) => p.status === "pending").length,
      failedPurchases: purchases.filter((p) => p.status === "failed").length,
      refundedPurchases: purchases.filter((p) => p.status === "refunded").length,
    };
  }, [purchases]);

  const handleRefund = async (purchaseId: string) => {
    const reason = window.prompt("Enter refund reason:");
    if (!reason) return;
    try {
      await adminApi.purchases.refund(purchaseId, reason, true);
      toast.success("Refund processed");
      fetchPurchases();
    } catch (error: any) {
      toast.error(error?.message || "Refund failed");
    }
  };

  const exportToCSV = () => {
    toast.info("CSV export coming soon");
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Purchase Management</h1>
          <p className="text-neutral-600 mt-1">Track and manage all premium report purchases</p>
        </div>
        <button
          onClick={exportToCSV}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-primary to-primary-hover rounded-xl border border-border p-6 shadow-sm text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-white/80">Total Revenue</span>
            <DollarSign className="w-5 h-5 text-white/80" />
          </div>
          <p className="text-3xl font-bold">AED {stats.totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-white/70 mt-1">{stats.successfulPurchases} successful purchases</p>
        </div>

        <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-neutral-600">Total Purchases</span>
            <CreditCard className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl font-bold text-foreground">{stats.totalPurchases}</p>
        </div>

        <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-neutral-600">Pending</span>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-3xl font-bold text-amber-600">{stats.pendingPurchases}</p>
        </div>

        <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-neutral-600">Failed/Refunded</span>
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-3xl font-bold text-red-600">
            {stats.failedPurchases + stats.refundedPurchases}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-border p-6 shadow-sm mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search by property, user, purchase or payment ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onBlur={fetchPurchases}
                className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>

          {/* Date Range Filter */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
          </select>
        </div>
      </div>

      {/* Purchases Table */}
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-neutral-600">Loading purchases...</div>
        ) : filteredPurchases.length === 0 ? (
          <div className="p-12 text-center">
            <CreditCard className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No purchases found</h3>
            <p className="text-neutral-600">
              {searchQuery || statusFilter !== "all" || dateRange !== "all"
                ? "Try adjusting your filters"
                : "All purchases will appear here"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Purchase ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Property
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Payment ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Date
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredPurchases.map((purchase) => {
                  const config = statusConfig[purchase.status];
                  const paymentId =
                    purchase.stripe_payment_intent_id ||
                    purchase.stripe_checkout_session_id ||
                    "—";
                  const property =
                    purchase.property_name ||
                    (purchase.portal_source ? `${purchase.portal_source} listing` : "Report");

                  return (
                    <tr key={purchase.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-mono text-sm font-medium text-primary">{purchase.id}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-foreground">
                            {purchase.user_full_name || "—"}
                          </div>
                          <div className="text-sm text-neutral-600">{purchase.user_email || "—"}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <div className="font-medium text-foreground truncate">{property}</div>
                          <div className="text-sm text-neutral-600">
                            Report: {purchase.analysis_id || "—"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-foreground">
                          {purchase.currency} {purchase.amount_aed?.toFixed(2) ?? "0.00"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.color} ${config.border}`}
                        >
                          <config.icon className="w-3 h-3" />
                          <span>{config.label}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-mono text-xs text-neutral-600 truncate max-w-[200px]">
                          {paymentId}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-600">
                        {formatTimestamp(purchase.purchased_at || purchase.created_at)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {purchase.status === "paid" && (
                          <button
                            onClick={() => handleRefund(purchase.id)}
                            className="inline-flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <RefreshCw className="w-4 h-4" />
                            <span>Refund</span>
                          </button>
                        )}
                        {purchase.status === "refunded" && (
                          <div className="text-xs text-neutral-600">
                            <div>Refunded {formatTimestamp(purchase.purchased_at)}</div>
                            {purchase.refund_reason && (
                              <div className="text-neutral-500 italic truncate max-w-xs">
                                {purchase.refund_reason}
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
