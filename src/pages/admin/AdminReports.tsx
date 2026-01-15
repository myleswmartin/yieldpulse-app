import { useEffect, useState } from 'react';
import { FileText, Download, Eye, Search, Calendar, DollarSign, TrendingUp, User } from 'lucide-react';
import { toast } from 'sonner';
import { adminApi } from '../../utils/adminApi';

interface Report {
  id: string;
  user_id: string;
  user_email: string;
  property_name: string;
  portal_source: string;
  listing_url: string;
  purchase_price: number;
  gross_yield: number;
  net_yield: number;
  cash_on_cash_return: number;
  is_paid: boolean;
  created_at: string;
}

export default function AdminReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'paid' | 'free'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'yield' | 'price'>('date');

  useEffect(() => {
    fetchReports();
  }, [filter, sortBy, search]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const { reports: data } = await adminApi.reports.list({
        status: filter,
        sort: sortBy,
        search: search.trim() || undefined,
      });
      setReports(data || []);
    } catch (error: any) {
      console.error('Failed to fetch reports:', error);
      toast.error(error.message || 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = reports;

  const stats = {
    total: reports.length,
    paid: reports.filter(r => r.is_paid).length,
    free: reports.filter(r => !r.is_paid).length,
    avgYield: reports.length > 0 ? (reports.reduce((sum, r) => sum + r.net_yield, 0) / reports.length).toFixed(2) : '0.00',
  };

  return (
    <div className="p-6 lg:p-8 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary">Reports Management</h1>
        <p className="text-slate-600 mt-1">View and manage all generated property analysis reports</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-slate-600">Total Reports</div>
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-slate-900">{stats.total}</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-slate-600">Paid Reports</div>
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-green-600">{stats.paid}</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-slate-600">Free Reports</div>
            <FileText className="w-5 h-5 text-slate-600" />
          </div>
          <div className="text-3xl font-bold text-slate-600">{stats.free}</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-slate-600">Avg Net Yield</div>
            <TrendingUp className="w-5 h-5 text-teal" />
          </div>
          <div className="text-3xl font-bold text-teal">{stats.avgYield}%</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by property or user email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'paid' | 'free')}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Reports</option>
              <option value="paid">Paid Only</option>
              <option value="free">Free Only</option>
            </select>
          </div>

          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'yield' | 'price')}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="date">Sort by Date</option>
              <option value="yield">Sort by Yield</option>
              <option value="price">Sort by Price</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-900">Property</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-900">User</th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-slate-900">Price</th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-slate-900">Net Yield</th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-slate-900">CoC Return</th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-slate-900">Status</th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-slate-900">Date</th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      <span className="text-slate-600">Loading reports...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-600">
                    No reports found
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr key={report.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-semibold text-slate-900">{report.property_name}</div>
                        <div className="text-sm text-slate-500">{report.portal_source}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-sm text-slate-600">{report.user_email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="font-semibold text-slate-900">
                        AED {report.purchase_price.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="font-semibold text-teal">
                        {report.net_yield}%
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="font-semibold text-green-600">
                        {report.cash_on_cash_return}%
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      {report.is_paid ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                          Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-700">
                          Free
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="text-sm text-slate-600">
                        {new Date(report.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => toast.info('View report functionality')}
                          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="View Report"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toast.info('Download report functionality')}
                          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Download Report"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredReports.length > 0 && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-600">
                Showing <span className="font-semibold">{filteredReports.length}</span> reports
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-white transition-colors cursor-pointer">
                  Previous
                </button>
                <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors cursor-pointer">
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
