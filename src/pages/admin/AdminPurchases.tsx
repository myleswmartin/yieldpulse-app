import { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Search, 
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Calendar,
  AlertCircle,
  Download,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { adminApi } from '../../utils/adminApi';

interface Purchase {
  id: string;
  purchaseId: string;
  userId: string;
  userName: string;
  userEmail: string;
  reportId: string;
  propertyName: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed' | 'refunded';
  paymentMethod: 'card' | 'wallet';
  stripePaymentId: string;
  createdAt: string;
  refundedAt?: string;
  refundReason?: string;
}

export default function AdminPurchases() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPurchases();
  }, [statusFilter, searchQuery]);

  const mapPurchase = (purchase: any): Purchase => ({
    id: purchase.id,
    purchaseId: purchase.id,
    userId: purchase.user_id,
    userName: purchase.user_full_name || purchase.user_email || 'Unknown',
    userEmail: purchase.user_email || '—',
    reportId: purchase.analysis_id || '—',
    propertyName: purchase.property_name || purchase.portal_source || 'Untitled',
    amount: Number(purchase.amount_aed || purchase.amount || 0),
    currency: String(purchase.currency || 'AED').toUpperCase(),
    status: (purchase.status || 'pending') as Purchase['status'],
    paymentMethod: 'card',
    stripePaymentId: purchase.stripe_payment_intent_id || purchase.stripe_checkout_session_id || '—',
    createdAt: purchase.created_at,
    refundedAt: purchase.refunded_at,
    refundReason: purchase.refund_reason,
  });

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApi.purchases.list({
        status: statusFilter,
        search: searchQuery || undefined,
        page: 1,
        limit: 50,
      });
      const mapped = (data.purchases || []).map(mapPurchase);
      setPurchases(mapped);
    } catch (err: any) {
      console.error('Failed to fetch purchases:', err);
      setError(err.message || 'Failed to load purchases');
      toast.error(err.message || 'Failed to load purchases');
      setPurchases([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      'paid': { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', label: 'Paid' },
      'pending': { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', label: 'Pending' },
      'failed': { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', label: 'Failed' },
      'refunded': { icon: RefreshCw, color: 'text-neutral-600', bg: 'bg-neutral-50', border: 'border-neutral-200', label: 'Refunded' }
    };
    return configs[status as keyof typeof configs] || configs.pending;
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const filteredPurchases = purchases.filter(purchase => {
    const matchesSearch = 
      purchase.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      purchase.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      purchase.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      purchase.purchaseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      purchase.stripePaymentId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || purchase.status === statusFilter;

    const matchesDateRange = (() => {
      if (dateRange === 'all') return true;
      const purchaseDate = new Date(purchase.createdAt);
      const now = new Date();
      const diffDays = Math.floor((now.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24));

      if (dateRange === 'today') return diffDays === 0;
      if (dateRange === 'week') return diffDays <= 7;
      if (dateRange === 'month') return diffDays <= 30;
      return true;
    })();

    return matchesSearch && matchesStatus && matchesDateRange;
  });

  const stats = {
    totalRevenue: purchases.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0),
    totalPurchases: purchases.length,
    successfulPurchases: purchases.filter(p => p.status === 'paid').length,
    pendingPurchases: purchases.filter(p => p.status === 'pending').length,
    failedPurchases: purchases.filter(p => p.status === 'failed').length,
    refundedPurchases: purchases.filter(p => p.status === 'refunded').length
  };

  const handleRefund = async (purchaseId: string) => {
    if (!confirm('Are you sure you want to issue a refund for this purchase? This action cannot be undone.')) {
      return;
    }

    const reason = prompt('Enter refund reason:');
    if (!reason) return;

    try {
      await adminApi.purchases.refund(purchaseId, reason, true);
      toast.success('Refund processed successfully');
      fetchPurchases();
    } catch (err: any) {
      console.error('Refund failed:', err);
      toast.error(err.message || 'Failed to process refund');
    }
  };

  const exportToCSV = () => {
    toast.info('CSV export functionality coming soon');
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
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
          {error}
        </div>
      )}

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
          <p className="text-3xl font-bold text-red-600">{stats.failedPurchases + stats.refundedPurchases}</p>
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
                placeholder="Search by property, user, email, purchase ID, or payment ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
              {searchQuery || statusFilter !== 'all' || dateRange !== 'all'
                ? 'Try adjusting your filters'
                : 'All purchases will appear here'}
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
                  const statusConfig = getStatusConfig(purchase.status);

                  return (
                    <tr key={purchase.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-mono text-sm font-medium text-primary">
                          {purchase.purchaseId}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-foreground">{purchase.userName}</div>
                          <div className="text-sm text-neutral-600">{purchase.userEmail}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <div className="font-medium text-foreground truncate">{purchase.propertyName}</div>
                          <div className="text-sm text-neutral-600">Report: {purchase.reportId}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-foreground">
                          {purchase.currency} {purchase.amount}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border}`}>
                          <statusConfig.icon className="w-3 h-3" />
                          <span>{statusConfig.label}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-mono text-xs text-neutral-600">
                          {purchase.stripePaymentId}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-600">
                        {formatTimestamp(purchase.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {purchase.status === 'paid' && (
                          <button
                            onClick={() => handleRefund(purchase.id)}
                            className="inline-flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <RefreshCw className="w-4 h-4" />
                            <span>Refund</span>
                          </button>
                        )}
                        {purchase.status === 'refunded' && (
                          <div className="text-xs text-neutral-600">
                            <div>Refunded {formatTimestamp(purchase.refundedAt!)}</div>
                            {purchase.refundReason && (
                              <div className="text-neutral-500 italic truncate max-w-xs">
                                {purchase.refundReason}
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
