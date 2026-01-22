import { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  User,
  CreditCard,
  FileCheck,
  Trash2,
  Edit,
  Eye,
  Calendar,
  Shield,
  Database,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { adminApi } from '../../utils/adminApi';

interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  actorEmail: string;
  actorRole: 'admin' | 'user' | 'system';
  action: string;
  actionType: 'create' | 'update' | 'delete' | 'view' | 'login' | 'logout' | 'payment' | 'export';
  resource: string;
  resourceType: 'user' | 'report' | 'purchase' | 'setting' | 'document' | 'session';
  details: string;
  ipAddress: string;
  userAgent: string;
  severity: 'info' | 'warning' | 'critical';
}

export default function AdminAuditLog() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionTypeFilter, setActionTypeFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [actorRoleFilter, setActorRoleFilter] = useState<string>('all');

  useEffect(() => {
    fetchAuditLog();
  }, []);

  const deriveActionType = (action: string): AuditLogEntry['actionType'] => {
    const normalized = action.toLowerCase();
    if (normalized.includes('delete') || normalized.includes('remove')) return 'delete';
    if (normalized.includes('update') || normalized.includes('edit')) return 'update';
    if (normalized.includes('create') || normalized.includes('upload')) return 'create';
    if (normalized.includes('refund') || normalized.includes('unlock') || normalized.includes('payment')) return 'payment';
    if (normalized.includes('export')) return 'export';
    if (normalized.includes('login')) return 'login';
    if (normalized.includes('logout')) return 'logout';
    return 'view';
  };

  const deriveResourceType = (action: string): AuditLogEntry['resourceType'] => {
    const normalized = action.toLowerCase();
    if (normalized.includes('user')) return 'user';
    if (normalized.includes('report')) return 'report';
    if (normalized.includes('purchase') || normalized.includes('payment')) return 'purchase';
    if (normalized.includes('setting')) return 'setting';
    if (normalized.includes('document')) return 'document';
    return 'session';
  };

  const deriveSeverity = (actionType: AuditLogEntry['actionType']): AuditLogEntry['severity'] => {
    if (actionType === 'delete' || actionType === 'payment') return 'warning';
    return 'info';
  };

  const mapEntry = (entry: any): AuditLogEntry => {
    const action = entry.action || 'unknown_action';
    const actionType = deriveActionType(action);
    return {
      id: entry.id || `${action}-${entry.timestamp || entry.created_at || Date.now()}`,
      timestamp: entry.timestamp || entry.created_at || new Date().toISOString(),
      actor: entry.admin_id || 'Admin',
      actorEmail: entry.admin_email || '',
      actorRole: 'admin',
      action: action.replace(/_/g, ' '),
      actionType,
      resource: entry.data?.resource || entry.data?.code || entry.data?.documentId || entry.data?.purchase_id || '—',
      resourceType: deriveResourceType(action),
      details: entry.reason || (entry.data ? JSON.stringify(entry.data) : ''),
      ipAddress: entry.ip_address || '—',
      userAgent: entry.user_agent || '—',
      severity: deriveSeverity(actionType),
    };
  };

  const fetchAuditLog = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApi.auditLog.list({ page: 1, limit: 100 });
      const mapped = (data.actions || []).map(mapEntry);
      setLogs(mapped);
    } catch (err: any) {
      console.error('Failed to fetch audit log:', err);
      setError(err.message || 'Failed to load audit log');
      toast.error(err.message || 'Failed to load audit log');
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (actionType: string) => {
    const icons = {
      'create': FileCheck,
      'update': Edit,
      'delete': Trash2,
      'view': Eye,
      'login': User,
      'logout': User,
      'payment': CreditCard,
      'export': Database
    };
    return icons[actionType as keyof typeof icons] || FileText;
  };

  const getActionColor = (actionType: string) => {
    const colors = {
      'create': 'text-green-600 bg-green-50',
      'update': 'text-blue-600 bg-blue-50',
      'delete': 'text-red-600 bg-red-50',
      'view': 'text-neutral-600 bg-neutral-50',
      'login': 'text-primary bg-primary/5',
      'logout': 'text-neutral-600 bg-neutral-50',
      'payment': 'text-secondary bg-secondary/10',
      'export': 'text-amber-600 bg-amber-50'
    };
    return colors[actionType as keyof typeof colors] || 'text-neutral-600 bg-neutral-50';
  };

  const getSeverityConfig = (severity: string) => {
    const configs = {
      'info': { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', label: 'Info' },
      'warning': { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', label: 'Warning' },
      'critical': { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', label: 'Critical' }
    };
    return configs[severity as keyof typeof configs] || configs.info;
  };

  const getRoleBadgeColor = (role: string) => {
    const colors = {
      'admin': 'bg-primary text-white',
      'user': 'bg-secondary text-white',
      'system': 'bg-neutral-600 text-white'
    };
    return colors[role as keyof typeof colors] || 'bg-neutral-200 text-neutral-700';
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

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesActionType = actionTypeFilter === 'all' || log.actionType === actionTypeFilter;
    const matchesSeverity = severityFilter === 'all' || log.severity === severityFilter;
    const matchesActorRole = actorRoleFilter === 'all' || log.actorRole === actorRoleFilter;

    return matchesSearch && matchesActionType && matchesSeverity && matchesActorRole;
  });

  const stats = {
    total: logs.length,
    today: logs.filter(l => new Date(l.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)).length,
    critical: logs.filter(l => l.severity === 'critical').length,
    admin: logs.filter(l => l.actorRole === 'admin').length
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Audit Log</h1>
        <p className="text-neutral-600 mt-1">Track all system activities and user actions</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-neutral-600">Total Events</span>
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl font-bold text-foreground">{stats.total}</p>
        </div>

        <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-neutral-600">Today</span>
            <Calendar className="w-5 h-5 text-secondary" />
          </div>
          <p className="text-3xl font-bold text-secondary">{stats.today}</p>
        </div>

        <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-neutral-600">Critical</span>
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-3xl font-bold text-red-600">{stats.critical}</p>
        </div>

        <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-neutral-600">Admin Actions</span>
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl font-bold text-primary">{stats.admin}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-border p-6 shadow-sm mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search by action, actor, resource, or details..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Action Type Filter */}
          <select
            value={actionTypeFilter}
            onChange={(e) => setActionTypeFilter(e.target.value)}
            className="px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Actions</option>
            <option value="create">Create</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
            <option value="view">View</option>
            <option value="login">Login</option>
            <option value="logout">Logout</option>
            <option value="payment">Payment</option>
            <option value="export">Export</option>
          </select>

          {/* Severity Filter */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Severity</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="critical">Critical</option>
          </select>

          {/* Actor Role Filter */}
          <select
            value={actorRoleFilter}
            onChange={(e) => setActorRoleFilter(e.target.value)}
            className="px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Actors</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="system">System</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-neutral-600">Loading audit logs...</div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No audit logs found</h3>
            <p className="text-neutral-600">
              {searchQuery || actionTypeFilter !== 'all' || severityFilter !== 'all' || actorRoleFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'All system activities will be logged here'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredLogs.map((log) => {
              const ActionIcon = getActionIcon(log.actionType);
              const actionColorClass = getActionColor(log.actionType);
              const severityConfig = getSeverityConfig(log.severity);
              const roleBadgeColor = getRoleBadgeColor(log.actorRole);

              return (
                <div key={log.id} className="p-6 hover:bg-neutral-50 transition-colors">
                  <div className="flex items-start space-x-4">
                    {/* Icon */}
                    <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${actionColorClass} flex items-center justify-center`}>
                      <ActionIcon className="w-5 h-5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-semibold text-foreground">{log.action}</h3>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${severityConfig.bg} ${severityConfig.color} border ${severityConfig.border}`}>
                            {severityConfig.label}
                          </span>
                        </div>
                        <span className="text-sm text-neutral-600">{formatTimestamp(log.timestamp)}</span>
                      </div>

                      <p className="text-sm text-neutral-700 mb-3">{log.details}</p>

                      <div className="flex items-center space-x-6 text-xs text-neutral-600">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">Actor:</span>
                          <span>{log.actor}</span>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${roleBadgeColor}`}>
                            {log.actorRole.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">Resource:</span>
                          <span>{log.resource}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">IP:</span>
                          <span className="font-mono">{log.ipAddress}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
