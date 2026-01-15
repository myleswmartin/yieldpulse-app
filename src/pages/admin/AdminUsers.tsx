import { useEffect, useState } from 'react';
import { Users, Search, Filter, UserPlus, Shield, ShieldOff, Trash2, Eye, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { adminApi } from '../../utils/adminApi';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  full_name: string;
  is_admin: boolean;
  created_at: string;
  purchase_count: number;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [adminFilter, setAdminFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [userDetails, setUserDetails] = useState<any>(null);
  const limit = 20;

  useEffect(() => {
    fetchUsers();
  }, [page, adminFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params: any = { page, limit };
      if (search) params.search = search;
      if (adminFilter !== 'all') params.admin_filter = adminFilter;

      const data = await adminApi.users.list(params);
      setUsers(data.users);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchUsers();
  };

  const handleToggleAdmin = async (userId: string, currentStatus: boolean) => {
    if (!confirm(`Are you sure you want to ${currentStatus ? 'remove' : 'grant'} admin access?`)) {
      return;
    }

    try {
      await adminApi.users.update(userId, { is_admin: !currentStatus });
      toast.success(`Admin access ${currentStatus ? 'removed' : 'granted'} successfully`);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update user');
    }
  };

  const handleDeleteUser = async (userId: string, email: string) => {
    if (!confirm(`Are you sure you want to delete user ${email}? This action cannot be undone.`)) {
      return;
    }

    try {
      await adminApi.users.delete(userId);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete user');
    }
  };

  const handleViewDetails = async (user: User) => {
    try {
      setSelectedUser(user);
      setShowDetails(true);
      const details = await adminApi.users.get(user.id);
      setUserDetails(details);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch user details');
      setShowDetails(false);
    }
  };

  if (showDetails && selectedUser) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <button
            onClick={() => {
              setShowDetails(false);
              setSelectedUser(null);
              setUserDetails(null);
            }}
            className="text-primary hover:underline mb-4 inline-flex items-center cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Users
          </button>
          <h1 className="text-3xl font-bold text-foreground">User Details</h1>
          <p className="text-neutral-600 mt-1">{selectedUser.email}</p>
        </div>

        {!userDetails ? (
          <div className="flex justify-center items-center h-64">
            <RefreshCw className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* User Info Card */}
            <div className="bg-white rounded-lg border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">User Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-neutral-600">Full Name</div>
                  <div className="font-medium text-foreground">{userDetails.user.full_name || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-neutral-600">Email</div>
                  <div className="font-medium text-foreground">{userDetails.user.email}</div>
                </div>
                <div>
                  <div className="text-sm text-neutral-600">User ID</div>
                  <div className="font-mono text-xs text-foreground">{userDetails.user.id}</div>
                </div>
                <div>
                  <div className="text-sm text-neutral-600">Admin Status</div>
                  <div className="font-medium text-foreground">
                    {userDetails.user.is_admin ? (
                      <span className="text-green-600">Admin</span>
                    ) : (
                      <span className="text-neutral-600">User</span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-neutral-600">Joined</div>
                  <div className="font-medium text-foreground">
                    {new Date(userDetails.user.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-neutral-600">Total Spent</div>
                  <div className="font-medium text-foreground">AED {userDetails.stats.total_spent}</div>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg border border-border p-6">
                <div className="text-sm text-neutral-600 mb-2">Total Analyses</div>
                <div className="text-3xl font-bold text-foreground">{userDetails.stats.total_analyses}</div>
              </div>
              <div className="bg-white rounded-lg border border-border p-6">
                <div className="text-sm text-neutral-600 mb-2">Total Purchases</div>
                <div className="text-3xl font-bold text-foreground">{userDetails.stats.total_purchases}</div>
              </div>
              <div className="bg-white rounded-lg border border-border p-6">
                <div className="text-sm text-neutral-600 mb-2">Paid Purchases</div>
                <div className="text-3xl font-bold text-green-600">{userDetails.stats.paid_purchases}</div>
              </div>
            </div>

            {/* Recent Purchases */}
            <div className="bg-white rounded-lg border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Recent Purchases</h2>
              {userDetails.purchases.length === 0 ? (
                <p className="text-neutral-600">No purchases yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Date</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Amount</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Status</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Payment ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userDetails.purchases.slice(0, 10).map((purchase: any) => (
                        <tr key={purchase.id} className="border-b border-border hover:bg-neutral-50">
                          <td className="py-3 px-4 text-sm text-foreground">
                            {new Date(purchase.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 text-sm text-foreground">AED {purchase.amount_aed}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              purchase.status === 'paid' ? 'bg-green-100 text-green-800' :
                              purchase.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              purchase.status === 'refunded' ? 'bg-red-100 text-red-800' :
                              'bg-neutral-100 text-neutral-800'
                            }`}>
                              {purchase.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-xs font-mono text-neutral-600">
                            {purchase.stripe_payment_intent_id?.slice(0, 20) || 'N/A'}...
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Recent Analyses */}
            <div className="bg-white rounded-lg border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Recent Analyses</h2>
              {userDetails.analyses.length === 0 ? (
                <p className="text-neutral-600">No analyses yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Date</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Property Price</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Gross Yield</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Paid</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userDetails.analyses.slice(0, 10).map((analysis: any) => (
                        <tr key={analysis.id} className="border-b border-border hover:bg-neutral-50">
                          <td className="py-3 px-4 text-sm text-foreground">
                            {new Date(analysis.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 text-sm text-foreground">
                            AED {analysis.purchase_price?.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-sm text-foreground">
                            {analysis.gross_yield?.toFixed(2)}%
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              analysis.is_paid ? 'bg-green-100 text-green-800' : 'bg-neutral-100 text-neutral-800'
                            }`}>
                              {analysis.is_paid ? 'Yes' : 'No'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">User Management</h1>
        <p className="text-neutral-600 mt-1">Manage user accounts and permissions</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-border p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Search Users
            </label>
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search by email or name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
              >
                Search
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Filter by Role
            </label>
            <select
              value={adminFilter}
              onChange={(e) => {
                setAdminFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Users</option>
              <option value="true">Admins Only</option>
              <option value="false">Regular Users</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-neutral-600">
          Showing {users.length} of {total} users
        </p>
        <button
          onClick={fetchUsers}
          className="text-primary hover:underline inline-flex items-center text-sm cursor-pointer"
        >
          <RefreshCw className="w-4 h-4 mr-1" />
          Refresh
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-border overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <RefreshCw className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Users className="w-16 h-16 text-neutral-300 mb-4" />
            <p className="text-neutral-600">No users found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50">
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">User</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Role</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Purchases</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Joined</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-neutral-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-border hover:bg-neutral-50">
                      <td className="py-3 px-4">
                        <div className="font-medium text-foreground">{user.full_name || 'N/A'}</div>
                      </td>
                      <td className="py-3 px-4 text-sm text-foreground">{user.email}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.is_admin ? 'bg-purple-100 text-purple-800' : 'bg-neutral-100 text-neutral-800'
                        }`}>
                          {user.is_admin ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-foreground">{user.purchase_count}</td>
                      <td className="py-3 px-4 text-sm text-neutral-600">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleViewDetails(user)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleAdmin(user.id, user.is_admin)}
                            className={`p-2 rounded-lg transition-colors ${
                              user.is_admin 
                                ? 'text-orange-600 hover:bg-orange-50' 
                                : 'text-green-600 hover:bg-green-50'
                            } cursor-pointer`}
                            title={user.is_admin ? 'Remove Admin' : 'Make Admin'}
                          >
                            {user.is_admin ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id, user.email)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-border">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-border rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </button>
                <span className="text-sm text-neutral-600">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-border rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}