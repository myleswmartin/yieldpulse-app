import { useEffect, useState } from 'react';
import { Users, DollarSign, TrendingUp, MessageCircle, AlertCircle, CreditCard, Webhook, FileText, Calendar, BarChart3, Activity } from 'lucide-react';
import { adminApi } from '../../utils/adminApi';
import { toast } from 'sonner';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface AdminStats {
  totalUsers: number;
  totalRevenue: number;
  conversionRate: number;
  openTickets: number;
  pendingPurchases: number;
  paidPurchases: number;
  recentPurchases: number;
  revenueByDay?: RevenueData[];
  userGrowthByDay?: UserGrowthData[];
  rangeDays?: number;
}

interface RevenueData {
  date: string;
  revenue: number;
  purchases: number;
}

interface UserGrowthData {
  date: string;
  users: number;
  newUsers: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [userGrowthData, setUserGrowthData] = useState<UserGrowthData[]>([]);

  useEffect(() => {
    fetchStats();
  }, [timeRange]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApi.stats.get(timeRange);
      setStats(data);
      setRevenueData(data.revenueByDay || []);
      setUserGrowthData(data.userGrowthByDay || []);
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
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="h-80 bg-slate-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <div className="font-semibold text-red-900">Failed to load dashboard</div>
            <div className="text-sm text-red-700 mt-1">{error}</div>
            <button
              onClick={fetchStats}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium transition-colors cursor-pointer"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const rangeLabel = stats?.rangeDays ? `Last ${stats.rangeDays} days` : 'Live';
  const kpiCards = [
    { 
      label: 'Total Users', 
      value: stats?.totalUsers || 0, 
      icon: Users, 
      trend: rangeLabel,
      trendUp: true,
      bgGradient: 'from-blue-500 to-blue-600',
    },
    { 
      label: 'Total Revenue', 
      value: `AED ${(stats?.totalRevenue || 0).toLocaleString()}`, 
      icon: DollarSign, 
      trend: rangeLabel,
      trendUp: true,
      bgGradient: 'from-green-500 to-emerald-600',
    },
    { 
      label: 'Conversion Rate', 
      value: `${stats?.conversionRate || 0}%`, 
      icon: TrendingUp, 
      trend: rangeLabel,
      trendUp: true,
      bgGradient: 'from-purple-500 to-purple-600',
    },
    { 
      label: 'Open Tickets', 
      value: stats?.openTickets || 0, 
      icon: MessageCircle, 
      trend: stats?.openTickets && stats.openTickets > 5 ? 'Needs attention' : 'All good',
      trendUp: false,
      bgGradient: 'from-orange-500 to-orange-600',
    },
  ];

  const purchaseStatusData = [
    { name: 'Paid', value: stats?.paidPurchases || 0, color: '#10b981' },
    { name: 'Pending', value: stats?.pendingPurchases || 0, color: '#f59e0b' },
  ];

  const COLORS = ['#1e2875', '#14b8a6', '#f59e0b', '#10b981', '#64748b'];

  return (
    <div className="p-6 lg:p-8 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
            <p className="text-slate-600 mt-1">Monitor your YieldPulse platform performance</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={fetchStats}
              className="px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 font-medium transition-colors flex items-center space-x-2 cursor-pointer"
            >
              <Activity className="w-4 h-4" />
              <span>Refresh</span>
            </button>
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d')}
              className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className={`h-2 bg-gradient-to-r ${card.bgGradient}`}></div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-medium text-slate-600">{card.label}</div>
                  <div className={`p-3 bg-gradient-to-br ${card.bgGradient} rounded-xl`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-2">{card.value}</div>
                <div className={`text-sm flex items-center ${card.trendUp ? 'text-green-600' : 'text-slate-500'}`}>
                  {card.trendUp && <TrendingUp className="w-4 h-4 mr-1" />}
                  {card.trend}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pending Purchases Alert */}
      {stats && stats.pendingPurchases > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="font-semibold text-yellow-900">
                {stats.pendingPurchases} pending purchase{stats.pendingPurchases > 1 ? 's' : ''} require attention
              </div>
              <div className="text-sm text-yellow-700 mt-1">
                Some payments may need manual verification or webhook retry
              </div>
              <a
                href="/admin/purchases?status=pending"
                className="mt-3 inline-block px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm font-medium transition-colors"
              >
                View Pending Purchases
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Trend Chart */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900">Revenue Trend</h3>
            <p className="text-sm text-slate-600">Daily revenue over the last 30 days</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '12px'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#14b8a6" 
                strokeWidth={2}
                fill="url(#colorRevenue)" 
                name="Revenue (AED)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* User Growth Chart */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900">User Growth</h3>
            <p className="text-sm text-slate-600">New users registered over time</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '12px'
                }} 
              />
              <Bar dataKey="newUsers" fill="#1e2875" radius={[8, 8, 0, 0]} name="New Users" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-slate-600">Paid Purchases</div>
            <CreditCard className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-green-600">{stats?.paidPurchases || 0}</div>
          <div className="text-sm text-slate-500 mt-1">Successfully completed</div>
        </div>
        
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-slate-600">Recent Purchases</div>
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-blue-600">{stats?.recentPurchases || 0}</div>
          <div className="text-sm text-slate-500 mt-1">Last 7 days</div>
        </div>
        
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-slate-600">Pending Purchases</div>
            <AlertCircle className="w-5 h-5 text-yellow-600" />
          </div>
          <div className="text-3xl font-bold text-yellow-600">{stats?.pendingPurchases || 0}</div>
          <div className="text-sm text-slate-500 mt-1">Awaiting confirmation</div>
        </div>
      </div>

      {/* Purchase Status & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Purchase Status Pie Chart */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900">Purchase Status</h3>
            <p className="text-sm text-slate-600">Distribution of purchase states</p>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={purchaseStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {purchaseStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Quick Actions</h3>
          <div className="space-y-3">
            <a
              href="/admin/users"
              className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-primary transition-all group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Manage Users</div>
                  <div className="text-sm text-slate-600">View and manage user accounts</div>
                </div>
              </div>
              <TrendingUp className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
            </a>
            
            <a
              href="/admin/purchases"
              className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-primary transition-all group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
                  <CreditCard className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">View Purchases</div>
                  <div className="text-sm text-slate-600">Monitor payment transactions</div>
                </div>
              </div>
              <TrendingUp className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
            </a>
            
            <a
              href="/admin/support"
              className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-primary transition-all group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-50 rounded-lg group-hover:bg-orange-100 transition-colors">
                  <MessageCircle className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Support Tickets</div>
                  <div className="text-sm text-slate-600">Handle customer support requests</div>
                </div>
              </div>
              <TrendingUp className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
            </a>
            
            <a
              href="/admin/webhooks"
              className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-primary transition-all group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                  <Webhook className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Webhook Logs</div>
                  <div className="text-sm text-slate-600">Debug payment webhooks</div>
                </div>
              </div>
              <TrendingUp className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
