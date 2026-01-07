import { useEffect, useState } from 'react';
import { Users, DollarSign, TrendingUp, MessageCircle, AlertCircle, CreditCard, Webhook } from 'lucide-react';
import { adminApi } from '../../utils/adminApi';
import { toast } from 'sonner';

interface AdminStats {
  totalUsers: number;
  totalRevenue: number;
  conversionRate: number;
  openTickets: number;
  pendingPurchases: number;
  paidPurchases: number;
  recentPurchases: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApi.stats.get();
      setStats(data);
    } catch (err: any) {
      console.error('Failed to fetch stats:', err);
      setError(err.message || 'Failed to load dashboard stats');
      toast.error(err.message || 'Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-neutral-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-neutral-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
          <div>
            <div className="font-semibold text-red-900">Failed to load dashboard</div>
            <div className="text-sm text-red-700 mt-1">{error}</div>
            <button
              onClick={fetchStats}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const kpiCards = [
    { 
      label: 'Total Users', 
      value: stats?.totalUsers || 0, 
      icon: Users, 
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    { 
      label: 'Total Revenue', 
      value: `AED ${stats?.totalRevenue || 0}`, 
      icon: DollarSign, 
      color: 'green',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    { 
      label: 'Conversion Rate', 
      value: `${stats?.conversionRate || 0}%`, 
      icon: TrendingUp, 
      color: 'purple',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    { 
      label: 'Open Tickets', 
      value: stats?.openTickets || 0, 
      icon: MessageCircle, 
      color: 'orange',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600'
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-neutral-600 mt-1">Overview and key metrics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white p-6 rounded-lg border border-border shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-medium text-neutral-600">{card.label}</div>
                <div className={`p-2 ${card.bgColor} rounded-lg`}>
                  <Icon className={`w-5 h-5 ${card.iconColor}`} />
                </div>
              </div>
              <div className="text-3xl font-bold text-foreground">{card.value}</div>
            </div>
          );
        })}
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-border">
          <div className="text-sm text-neutral-600 mb-2">Paid Purchases</div>
          <div className="text-3xl font-bold text-green-600">{stats?.paidPurchases || 0}</div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-border">
          <div className="text-sm text-neutral-600 mb-2">Recent Purchases (7 days)</div>
          <div className="text-3xl font-bold text-blue-600">{stats?.recentPurchases || 0}</div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-border">
          <div className="text-sm text-neutral-600 mb-2">Pending Purchases</div>
          <div className="text-3xl font-bold text-yellow-600">{stats?.pendingPurchases || 0}</div>
        </div>
      </div>

      {/* Pending Purchases Alert */}
      {stats && stats.pendingPurchases > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <div className="font-semibold text-yellow-900">
                {stats.pendingPurchases} pending purchase{stats.pendingPurchases > 1 ? 's' : ''}
              </div>
              <div className="text-sm text-yellow-700 mt-1">
                Some payments may need manual verification or webhook retry
              </div>
              <a
                href="/admin/purchases?status=pending"
                className="mt-3 inline-block px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm"
              >
                View Pending Purchases
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin/users"
            className="p-4 border border-border rounded-lg hover:bg-neutral-50 transition-colors"
          >
            <Users className="w-5 h-5 text-primary mb-2" />
            <div className="font-medium text-foreground">Manage Users</div>
            <div className="text-sm text-neutral-600 mt-1">View and manage user accounts</div>
          </a>
          <a
            href="/admin/purchases"
            className="p-4 border border-border rounded-lg hover:bg-neutral-50 transition-colors"
          >
            <CreditCard className="w-5 h-5 text-primary mb-2" />
            <div className="font-medium text-foreground">View Purchases</div>
            <div className="text-sm text-neutral-600 mt-1">Monitor payment transactions</div>
          </a>
          <a
            href="/admin/webhooks"
            className="p-4 border border-border rounded-lg hover:bg-neutral-50 transition-colors"
          >
            <Webhook className="w-5 h-5 text-primary mb-2" />
            <div className="font-medium text-foreground">Webhook Logs</div>
            <div className="text-sm text-neutral-600 mt-1">Debug payment webhooks</div>
          </a>
        </div>
      </div>
    </div>
  );
}