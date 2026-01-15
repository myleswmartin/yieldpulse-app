import { useEffect, useState } from 'react';
import { Tag, Plus, Trash2, Edit, Copy, Check, TrendingUp, Calendar, Percent, DollarSign, Users, Search, Filter } from 'lucide-react';
import { adminApi } from '../../utils/adminApi';
import { toast } from 'sonner';
import { formatCurrency } from '../../utils/calculations';

interface DiscountCode {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  maxUses?: number | null;
  currentUses?: number;
  expiresAt?: string | null;
  active?: boolean;
  createdAt?: string;
  description?: string;
  totalRevenue?: number;
  totalSavings?: number;
}

interface DiscountUsage {
  code: string;
  purchaseId: string;
  userId: string;
  userEmail?: string;
  discountAmount: number;
  originalPrice: number;
  finalPrice: number;
  usedAt: string;
}

export default function AdminDiscounts() {
  const [codes, setCodes] = useState<DiscountCode[]>([]);
  const [usageHistory, setUsageHistory] = useState<DiscountUsage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCode, setSelectedCode] = useState<DiscountCode | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'expired'>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [busyCode, setBusyCode] = useState<string | null>(null);

  // Form state for creating/editing codes
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: 10,
    maxUses: undefined as number | undefined,
    expiresAt: '',
    description: '',
    active: true,
  });

  useEffect(() => {
    fetchDiscountCodes();
  }, []);

  const fetchDiscountCodes = async () => {
    try {
      setLoading(true);
      const data = await adminApi.discounts.list();
      const normalizedCodes: DiscountCode[] = (data.codes || []).map((c: any) => ({
        code: c.code,
        type: c.type === 'percentage' ? 'percentage' : 'fixed',
        value: Number(c.value) || 0,
        maxUses: c.maxUses ?? c.max_uses ?? c.max_redemptions ?? null,
        currentUses: c.currentUses ?? c.times_redeemed ?? 0,
        expiresAt: c.expiresAt || c.redeem_by || null,
        active: c.active !== false,
        createdAt: c.createdAt || c.created_at || '',
        description: c.description || '',
        totalRevenue: c.totalRevenue || 0,
        totalSavings: c.totalSavings || 0,
      }));
      setCodes(normalizedCodes);
      setUsageHistory(data.recentUsage || []);
    } catch (err: any) {
      console.error('Failed to fetch discount codes:', err);
      toast.error('Failed to load discount codes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCode = async () => {
    if (!formData.code.trim()) {
      toast.error('Code is required');
      return;
    }

    if (formData.value <= 0) {
      toast.error('Discount value must be greater than 0');
      return;
    }

    if (formData.type === 'percentage' && formData.value > 100) {
      toast.error('Percentage discount cannot exceed 100%');
      return;
    }

    try {
      setIsCreating(true);
      const created = await adminApi.discounts.create({
        code: formData.code.toUpperCase().trim(),
        type: formData.type,
        value: formData.value,
        maxUses: formData.maxUses,
        expiresAt: formData.expiresAt || undefined,
        description: formData.description,
        active: formData.active,
      });

      // Optimistically insert created code so UI shows without waiting for Stripe propagation
      const newCode: DiscountCode = {
        code: created.code,
        type: created.type === 'percentage' ? 'percentage' : 'fixed',
        value: Number(created.value) || formData.value,
        maxUses: created.maxUses ?? created.max_uses ?? created.max_redemptions ?? null,
        currentUses: created.currentUses ?? created.times_redeemed ?? 0,
        expiresAt: created.expiresAt || created.redeem_by || null,
        active: created.active !== false,
        description: created.description || formData.description,
        createdAt: created.createdAt || new Date().toISOString(),
        totalRevenue: created.totalRevenue || 0,
        totalSavings: created.totalSavings || 0,
      };
      setCodes(prev => [newCode, ...prev]);

      toast.success('Discount code created successfully');
      setShowCreateModal(false);
      resetForm();
      // Also refresh from API to ensure parity with Stripe
      fetchDiscountCodes();
    } catch (err: any) {
      console.error('Failed to create discount code:', err);
      toast.error(err.message || 'Failed to create discount code');
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateCode = async () => {
    if (!selectedCode) return;

    try {
      setIsUpdating(true);
      await adminApi.discounts.update(selectedCode.code, {
        type: formData.type,
        value: formData.value,
        maxUses: formData.maxUses,
        expiresAt: formData.expiresAt || undefined,
        description: formData.description,
        active: formData.active,
      });

      toast.success('Discount code updated successfully');
      setShowEditModal(false);
      setSelectedCode(null);
      resetForm();
      fetchDiscountCodes();
    } catch (err: any) {
      console.error('Failed to update discount code:', err);
      toast.error(err.message || 'Failed to update discount code');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteCode = async (code: string) => {
    if (!confirm(`Are you sure you want to delete discount code "${code}"?`)) {
      return;
    }

    try {
      setBusyCode(code);
      await adminApi.discounts.delete(code);
      toast.success('Discount code deleted successfully');
      fetchDiscountCodes();
    } catch (err: any) {
      console.error('Failed to delete discount code:', err);
      toast.error(err.message || 'Failed to delete discount code');
    } finally {
      setBusyCode(null);
    }
  };

  const handleToggleActive = async (code: string, currentStatus: boolean) => {
    try {
      setBusyCode(code);
      await adminApi.discounts.update(code, { active: !currentStatus });
      toast.success(`Code ${!currentStatus ? 'activated' : 'deactivated'}`);
      fetchDiscountCodes();
    } catch (err: any) {
      console.error('Failed to toggle code status:', err);
      toast.error('Failed to update code status');
    } finally {
      setBusyCode(null);
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success('Code copied to clipboard');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const resetForm = () => {
    setFormData({
      code: '',
      type: 'percentage',
      value: 10,
      maxUses: undefined,
      expiresAt: '',
      description: '',
      active: true,
    });
  };

  const openEditModal = (code: DiscountCode) => {
    setSelectedCode(code);
    setFormData({
      code: code.code,
      type: code.type,
      value: code.value,
      maxUses: code.maxUses,
      expiresAt: code.expiresAt ? new Date(code.expiresAt).toISOString().split('T')[0] : '',
      description: code.description || '',
      active: code.active,
    });
    setShowEditModal(true);
  };

  const filteredCodes = codes.filter(code => {
    // Search filter
    const matchesSearch = code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      code.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const now = new Date();
    const isExpired = code.expiresAt ? new Date(code.expiresAt) < now : false;
    const isMaxedOut = code.maxUses ? code.currentUses >= code.maxUses : false;
    
    let matchesStatus = true;
    if (filterStatus === 'active') {
      matchesStatus = code.active && !isExpired && !isMaxedOut;
    } else if (filterStatus === 'inactive') {
      matchesStatus = !code.active;
    } else if (filterStatus === 'expired') {
      matchesStatus = isExpired || isMaxedOut;
    }

    return matchesSearch && matchesStatus;
  });

  const totalStats = codes.reduce((acc, code) => ({
    totalUses: acc.totalUses + (code.currentUses || 0),
    totalRevenue: acc.totalRevenue + (code.totalRevenue || 0),
    totalSavings: acc.totalSavings + (code.totalSavings || 0),
  }), { totalUses: 0, totalRevenue: 0, totalSavings: 0 });

  return (
    <div className="space-y-6 p-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Discount Codes</h1>
          <p className="text-sm text-neutral-600 mt-1">
            Create and manage discount codes for premium reports
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Code</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-600">Total Codes</span>
            <Tag className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">{codes.length}</p>
          <p className="text-xs text-neutral-500 mt-1">
            {codes.filter(c => c.active).length} active
          </p>
        </div>

        <div className="bg-white border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-600">Total Uses</span>
            <Users className="w-4 h-4 text-secondary" />
          </div>
          <p className="text-2xl font-bold text-foreground">{totalStats.totalUses}</p>
          <p className="text-xs text-neutral-500 mt-1">
            All-time redemptions
          </p>
        </div>

        <div className="bg-white border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-600">Revenue with Discounts</span>
            <DollarSign className="w-4 h-4 text-success" />
          </div>
          <p className="text-2xl font-bold text-foreground">
            {formatCurrency(totalStats.totalRevenue)}
          </p>
          <p className="text-xs text-neutral-500 mt-1">
            Total sales after discounts
          </p>
        </div>

        <div className="bg-white border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-600">Total Savings</span>
            <TrendingUp className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-foreground">
            {formatCurrency(totalStats.totalSavings)}
          </p>
          <p className="text-xs text-neutral-500 mt-1">
            Given to customers
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-border rounded-lg p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search codes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-neutral-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">All Codes</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
              <option value="expired">Expired/Maxed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Codes Table */}
      <div className="bg-white border border-border rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-neutral-500">
            Loading discount codes...
          </div>
        ) : filteredCodes.length === 0 ? (
          <div className="p-8 text-center">
            <Tag className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-600 font-medium">No discount codes found</p>
            <p className="text-sm text-neutral-500 mt-1">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your filters'
                : 'Create your first discount code to get started'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-border">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Code</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Discount</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Usage</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Revenue</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Expires</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Status</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredCodes.map((code) => {
                  const now = new Date();
                  const isExpired = code.expiresAt ? new Date(code.expiresAt) < now : false;
                  const isMaxedOut = code.maxUses ? code.currentUses >= code.maxUses : false;
                  const isEffectivelyActive = code.active && !isExpired && !isMaxedOut;

                  return (
                    <tr key={code.code} className="hover:bg-neutral-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <code className="px-2 py-1 bg-neutral-100 text-primary font-mono text-sm rounded">
                            {code.code}
                          </code>
                          <button
                            onClick={() => copyToClipboard(code.code)}
                            className="text-neutral-400 hover:text-primary transition-colors cursor-pointer"
                          >
                            {copiedCode === code.code ? (
                              <Check className="w-4 h-4 text-success" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                        {code.description && (
                          <p className="text-xs text-neutral-500 mt-1">{code.description}</p>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          code.type === 'percentage' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {code.type === 'percentage' ? (
                            <>
                              <Percent className="w-3 h-3 mr-1" />
                              Percentage
                            </>
                          ) : (
                            <>
                              <DollarSign className="w-3 h-3 mr-1" />
                              Fixed
                            </>
                          )}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-foreground">
                        {code.type === 'percentage' ? `${code.value}%` : formatCurrency(code.value)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm">
                          <span className="font-semibold text-foreground">{code.currentUses}</span>
                          {code.maxUses && (
                            <span className="text-neutral-500"> / {code.maxUses}</span>
                          )}
                        </div>
                        {code.maxUses && (
                          <div className="w-24 h-1.5 bg-neutral-200 rounded-full mt-1">
                            <div
                              className="h-full bg-primary rounded-full transition-all"
                              style={{ width: `${Math.min((code.currentUses / code.maxUses) * 100, 100)}%` }}
                            />
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm font-semibold text-foreground">
                          {formatCurrency(code.totalRevenue)}
                        </div>
                        <div className="text-xs text-neutral-500">
                          -{formatCurrency(code.totalSavings)} saved
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {code.expiresAt ? (
                          <div className="text-sm">
                            <div className={isExpired ? 'text-destructive font-medium' : 'text-neutral-700'}>
                              {new Date(code.expiresAt).toLocaleDateString()}
                            </div>
                            {isExpired && (
                              <span className="text-xs text-destructive">Expired</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-neutral-500">No expiry</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleActive(code.code, code.active)}
                          disabled={busyCode === code.code}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                            isEffectivelyActive
                              ? 'bg-success/10 text-success hover:bg-success/20'
                              : 'bg-neutral-200 text-neutral-600 hover:bg-neutral-300'
                          } cursor-pointer`}
                        >
                          {busyCode === code.code
                            ? 'Working...'
                            : isEffectivelyActive
                              ? 'Active'
                              : isExpired
                                ? 'Expired'
                                : isMaxedOut
                                  ? 'Maxed'
                                  : 'Inactive'}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => openEditModal(code)}
                            disabled={busyCode === code.code}
                            className="p-2 text-neutral-600 hover:text-primary hover:bg-neutral-100 rounded transition-colors cursor-pointer"
                            title="Edit code"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCode(code.code)}
                            disabled={busyCode === code.code}
                            className="p-2 text-neutral-600 hover:text-destructive hover:bg-red-50 rounded transition-colors cursor-pointer"
                            title="Delete code"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Usage */}
      {usageHistory.length > 0 && (
        <div className="bg-white border border-border rounded-lg p-6">
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-primary" />
            Recent Usage
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-border">
                <tr>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-neutral-700">Code</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-neutral-700">User</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-neutral-700">Original</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-neutral-700">Discount</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-neutral-700">Final</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-neutral-700">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {usageHistory.slice(0, 10).map((usage, idx) => (
                  <tr key={idx} className="hover:bg-neutral-50">
                    <td className="py-2 px-3">
                      <code className="text-xs font-mono text-primary">{usage.code}</code>
                    </td>
                    <td className="py-2 px-3 text-sm text-neutral-700">
                      {usage.userEmail || 'Guest'}
                    </td>
                    <td className="py-2 px-3 text-sm text-neutral-700">
                      {formatCurrency(usage.originalPrice)}
                    </td>
                    <td className="py-2 px-3 text-sm font-medium text-success">
                      -{formatCurrency(usage.discountAmount)}
                    </td>
                    <td className="py-2 px-3 text-sm font-semibold text-foreground">
                      {formatCurrency(usage.finalPrice)}
                    </td>
                    <td className="py-2 px-3 text-sm text-neutral-500">
                      {new Date(usage.usedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-foreground mb-4">
              {showCreateModal ? 'Create Discount Code' : 'Edit Discount Code'}
            </h2>

            <div className="space-y-4">
              {/* Code */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Code *
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="SAVE20"
                  disabled={showEditModal}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono disabled:bg-neutral-100"
                />
                <p className="text-xs text-neutral-500 mt-1">
                  Letters and numbers only. Will be auto-capitalized.
                </p>
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Discount Type *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setFormData({ ...formData, type: 'percentage' })}
                    className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                      formData.type === 'percentage'
                        ? 'border-primary bg-primary/5 text-primary font-medium'
                        : 'border-border text-neutral-700 hover:border-neutral-300'
                    } cursor-pointer`}
                  >
                    <Percent className="w-4 h-4 inline mr-1" />
                    Percentage
                  </button>
                  <button
                    onClick={() => setFormData({ ...formData, type: 'fixed' })}
                    className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                      formData.type === 'fixed'
                        ? 'border-primary bg-primary/5 text-primary font-medium'
                        : 'border-border text-neutral-700 hover:border-neutral-300'
                    } cursor-pointer`}
                  >
                    <DollarSign className="w-4 h-4 inline mr-1" />
                    Fixed Amount
                  </button>
                </div>
              </div>

              {/* Value */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Discount Value *
                </label>
                <div className="relative">
                  {formData.type === 'fixed' && (
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500">
                      AED
                    </span>
                  )}
                  <input
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })}
                    className={`w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                      formData.type === 'fixed' ? 'pl-14' : ''
                    }`}
                    min="0"
                    max={formData.type === 'percentage' ? 100 : undefined}
                  />
                  {formData.type === 'percentage' && (
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500">
                      %
                    </span>
                  )}
                </div>
              </div>

              {/* Max Uses */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Maximum Uses (Optional)
                </label>
                <input
                  type="number"
                  value={formData.maxUses || ''}
                  onChange={(e) => setFormData({ ...formData, maxUses: e.target.value ? parseInt(e.target.value) : undefined })}
                  placeholder="Unlimited"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  min="1"
                />
                <p className="text-xs text-neutral-500 mt-1">
                  Leave empty for unlimited uses
                </p>
              </div>

              {/* Expires At */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Expiration Date (Optional)
                </label>
                <input
                  type="date"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g., New Year Promotion"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between py-2 px-3 bg-neutral-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-neutral-700">Active Status</p>
                  <p className="text-xs text-neutral-500">Enable this code immediately</p>
                </div>
                <button
                  onClick={() => setFormData({ ...formData, active: !formData.active })}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    formData.active ? 'bg-success' : 'bg-neutral-300'
                  } cursor-pointer`}
                >
                  <div
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      formData.active ? 'transform translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  showCreateModal ? setShowCreateModal(false) : setShowEditModal(false);
                  resetForm();
                  setSelectedCode(null);
                }}
                className="px-4 py-2 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={showCreateModal ? handleCreateCode : handleUpdateCode}
                disabled={showCreateModal ? isCreating : isUpdating}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors font-medium cursor-pointer"
              >
                {showCreateModal ? (isCreating ? 'Creating...' : 'Create Code') : (isUpdating ? 'Saving...' : 'Save Changes')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
