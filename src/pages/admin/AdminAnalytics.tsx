import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, DollarSign, Users, Calendar, Download, Filter } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart, ComposedChart } from 'recharts';
import { toast } from 'sonner';

interface AnalyticsData {
  revenueByMonth: Array<{ month: string; revenue: number; count: number }>;
  usersByMonth: Array<{ month: string; users: number }>;
  topProperties: Array<{ name: string; views: number; reports: number }>;
  conversionFunnel: Array<{ stage: string; users: number; percentage: number }>;
  averageROI: number;
  avgReportValue: number;
}

export default function AdminAnalytics() {
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState<'30d' | '90d' | '1y'>('90d');
  const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'users' | 'reports'>('revenue');

  // Mock data - in production, fetch from API
  const revenueByMonth = [
    { month: 'Jan', revenue: 2450, count: 50, users: 120 },
    { month: 'Feb', revenue: 3200, count: 65, users: 145 },
    { month: 'Mar', revenue: 4100, count: 84, users: 178 },
    { month: 'Apr', revenue: 3800, count: 78, users: 165 },
    { month: 'May', revenue: 5200, count: 106, users: 210 },
    { month: 'Jun', revenue: 6100, count: 124, users: 245 },
  ];

  const topProperties = [
    { name: 'Dubai Marina Apartments', views: 1250, reports: 85, avgROI: 7.2 },
    { name: 'Downtown Dubai Units', views: 1100, reports: 72, avgROI: 6.8 },
    { name: 'Business Bay Studios', views: 950, reports: 68, avgROI: 8.1 },
    { name: 'JBR Beach Residences', views: 820, reports: 54, avgROI: 6.5 },
    { name: 'Palm Jumeirah Villas', views: 750, reports: 48, avgROI: 5.9 },
    { name: 'Arabian Ranches', views: 680, reports: 42, avgROI: 7.5 },
  ];

  const conversionFunnel = [
    { stage: 'Visitors', users: 10000, percentage: 100, color: '#1e2875' },
    { stage: 'Started Calculator', users: 4500, percentage: 45, color: '#2f3aad' },
    { stage: 'Completed Analysis', users: 3200, percentage: 32, color: '#14b8a6' },
    { stage: 'Signed Up', users: 1500, percentage: 15, color: '#0d9488' },
    { stage: 'Purchased Report', users: 480, percentage: 4.8, color: '#10b981' },
  ];

  const revenueBySource = [
    { name: 'Organic Search', value: 45, revenue: 28000, color: '#1e2875' },
    { name: 'Direct Traffic', value: 30, revenue: 18500, color: '#14b8a6' },
    { name: 'Social Media', value: 15, revenue: 9200, color: '#f59e0b' },
    { name: 'Referrals', value: 10, revenue: 6100, color: '#10b981' },
  ];

  const avgMetrics = {
    reportValue: 49,
    roiPerReport: 7.2,
    timeToConversion: 2.5,
    customerLifetimeValue: 147,
  };

  const exportData = () => {
    toast.success('Analytics data exported successfully');
  };

  return (
    <div className="p-6 lg:p-8 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-primary">Advanced Analytics</h1>
            <p className="text-slate-600 mt-1">Deep insights into platform performance and user behavior</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={exportData}
              className="px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 font-medium transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export Data</span>
            </button>
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as '30d' | '90d' | '1y')}
              className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium"
            >
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-slate-600">Avg Report Value</div>
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-slate-900">AED {avgMetrics.reportValue}</div>
          <div className="text-sm text-green-600 mt-1">+5.2% vs last period</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-slate-600">Avg ROI Per Report</div>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-slate-900">{avgMetrics.roiPerReport}%</div>
          <div className="text-sm text-blue-600 mt-1">+0.8% vs last period</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-slate-600">Avg Time to Convert</div>
            <Calendar className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-3xl font-bold text-slate-900">{avgMetrics.timeToConversion} days</div>
          <div className="text-sm text-purple-600 mt-1">-0.3 days improvement</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-slate-600">Customer LTV</div>
            <Users className="w-5 h-5 text-teal" />
          </div>
          <div className="text-3xl font-bold text-slate-900">AED {avgMetrics.customerLifetimeValue}</div>
          <div className="text-sm text-teal mt-1">+12% vs last period</div>
        </div>
      </div>

      {/* Revenue & User Growth - Combined Chart */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-900">Revenue & User Growth Trends</h3>
          <p className="text-sm text-slate-600">Monthly revenue and user acquisition over time</p>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={revenueByMonth}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
            <YAxis yAxisId="left" stroke="#64748b" fontSize={12} />
            <YAxis yAxisId="right" orientation="right" stroke="#64748b" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '12px'
              }} 
            />
            <Legend />
            <Bar yAxisId="left" dataKey="revenue" fill="#14b8a6" radius={[8, 8, 0, 0]} name="Revenue (AED)" />
            <Line yAxisId="right" type="monotone" dataKey="users" stroke="#1e2875" strokeWidth={3} name="Total Users" dot={{ r: 5 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Conversion Funnel & Revenue Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Conversion Funnel */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900">Conversion Funnel</h3>
            <p className="text-sm text-slate-600">User journey from visitor to customer</p>
          </div>
          <div className="space-y-4">
            {conversionFunnel.map((stage, index) => {
              const dropRate = index > 0 ? 
                ((conversionFunnel[index - 1].users - stage.users) / conversionFunnel[index - 1].users * 100).toFixed(1) 
                : 0;
              
              return (
                <div key={stage.stage}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: stage.color }}
                      ></div>
                      <span className="text-sm font-medium text-slate-900">{stage.stage}</span>
                    </div>
                    <div className="text-sm text-slate-600">
                      {stage.users.toLocaleString()} ({stage.percentage}%)
                    </div>
                  </div>
                  <div className="relative h-8 bg-slate-100 rounded-lg overflow-hidden">
                    <div 
                      className="absolute inset-y-0 left-0 rounded-lg transition-all"
                      style={{ 
                        width: `${stage.percentage}%`,
                        backgroundColor: stage.color
                      }}
                    ></div>
                  </div>
                  {index > 0 && (
                    <div className="text-xs text-red-600 mt-1">
                      ↓ {dropRate}% drop from previous stage
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Revenue by Source */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900">Revenue by Traffic Source</h3>
            <p className="text-sm text-slate-600">Where your customers are coming from</p>
          </div>
          <div className="flex items-center justify-center mb-6">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={revenueBySource}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {revenueBySource.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {revenueBySource.map((source) => (
              <div key={source.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded" 
                    style={{ backgroundColor: source.color }}
                  ></div>
                  <span className="text-sm font-medium text-slate-900">{source.name}</span>
                </div>
                <div className="text-sm text-slate-600">
                  AED {source.revenue.toLocaleString()} ({source.value}%)
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Properties Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-900">Top Performing Properties</h3>
          <p className="text-sm text-slate-600">Most viewed and analyzed properties</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Property Name</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-900">Views</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-900">Reports Generated</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-900">Avg ROI</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-900">Conversion Rate</th>
              </tr>
            </thead>
            <tbody>
              {topProperties.map((property, index) => {
                const conversionRate = ((property.reports / property.views) * 100).toFixed(1);
                return (
                  <tr key={property.name} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </div>
                        <span className="font-medium text-slate-900">{property.name}</span>
                      </div>
                    </td>
                    <td className="text-right py-4 px-4 text-slate-600">{property.views.toLocaleString()}</td>
                    <td className="text-right py-4 px-4 text-slate-600">{property.reports}</td>
                    <td className="text-right py-4 px-4">
                      <span className="text-green-600 font-semibold">{property.avgROI}%</span>
                    </td>
                    <td className="text-right py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        parseFloat(conversionRate) > 7 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {conversionRate}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
