import { useState, useEffect } from 'react';
import { 
  Webhook, 
  Search,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Eye,
  RefreshCw,
  Activity,
  Code,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { adminApi } from '../../utils/adminApi';

interface WebhookEvent {
  id: string;
  eventId: string;
  eventType: string;
  status: 'success' | 'failed' | 'pending' | 'retrying';
  source: 'stripe' | 'system';
  payload: any;
  response?: any;
  errorMessage?: string;
  attempts: number;
  nextRetry?: string;
  createdAt: string;
  processedAt?: string;
  sessionId?: string;
}

export default function AdminWebhooks() {
  const [webhookEvents, setWebhookEvents] = useState<WebhookEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<WebhookEvent | null>(null);

  useEffect(() => {
    fetchWebhooks();
  }, []);

  const mapLogToEvent = (log: any): WebhookEvent => {
    const createdAt = log.timestamp || log.created_at || log.createdAt || log.processed_at || new Date().toISOString();
    const statusBase = log.status || 'pending';
    const status = log.next_retry ? 'retrying' : statusBase;
    return {
      id: log.id || log.event_id || log.eventId || `${createdAt}-${log.event_type}`,
      eventId: log.event_id || log.eventId || log.id || 'unknown',
      eventType: log.event_type || log.eventType || 'unknown',
      status,
      source: log.source || 'stripe',
      payload: log.payload || log.data || {},
      response: log.response,
      errorMessage: log.error_message || log.errorMessage,
      attempts: log.attempts || 1,
      nextRetry: log.next_retry || log.nextRetry,
      createdAt,
      processedAt: log.processed_at || log.processedAt,
      sessionId: log.session_id || log.sessionId,
    } as WebhookEvent;
  };

  const fetchWebhooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApi.webhooks.list();
      const logs = data.logs || [];
      setWebhookEvents(logs.map(mapLogToEvent));
    } catch (err: any) {
      console.error('Failed to fetch webhooks:', err);
      setError(err.message || 'Failed to load webhooks');
      toast.error(err.message || 'Failed to load webhooks');
      setWebhookEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      'success': { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', label: 'Success' },
      'failed': { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', label: 'Failed' },
      'pending': { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', label: 'Pending' },
      'retrying': { icon: RefreshCw, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', label: 'Retrying' }
    };
    return configs[status as keyof typeof configs] || configs.pending;
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return formatTimestamp(timestamp);
  };

  const filteredEvents = webhookEvents.filter(event => {
    const matchesSearch = 
      event.eventId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.eventType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      JSON.stringify(event.payload).toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    const matchesSource = sourceFilter === 'all' || event.source === sourceFilter;

    return matchesSearch && matchesStatus && matchesSource;
  });

  const stats = {
    total: webhookEvents.length,
    success: webhookEvents.filter(e => e.status === 'success').length,
    failed: webhookEvents.filter(e => e.status === 'failed').length,
    retrying: webhookEvents.filter(e => e.status === 'retrying').length
  };

  const handleRetry = async (eventId: string) => {
    const event = webhookEvents.find((e) => e.id === eventId);
    const sessionId = event?.sessionId;
    if (!sessionId) {
      toast.error('Missing session ID for retry');
      return;
    }

    try {
      await adminApi.webhooks.retry(sessionId);
      toast.info('Webhook event queued for retry');
      fetchWebhooks();
    } catch (err: any) {
      console.error('Failed to retry webhook:', err);
      toast.error(err.message || 'Failed to retry webhook');
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Webhook Monitoring</h1>
        <p className="text-neutral-600 mt-1">Monitor and debug Stripe webhooks and system events</p>
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
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl font-bold text-foreground">{stats.total}</p>
        </div>

        <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-neutral-600">Successful</span>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-green-600">{stats.success}</p>
        </div>

        <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-neutral-600">Failed</span>
            <XCircle className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-3xl font-bold text-red-600">{stats.failed}</p>
        </div>

        <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-neutral-600">Retrying</span>
            <RefreshCw className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-blue-600">{stats.retrying}</p>
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
                placeholder="Search by event ID, type, or payload..."
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
            <option value="success">Success</option>
            <option value="failed">Failed</option>
            <option value="retrying">Retrying</option>
            <option value="pending">Pending</option>
          </select>

          {/* Source Filter */}
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Sources</option>
            <option value="stripe">Stripe</option>
            <option value="system">System</option>
          </select>
        </div>
      </div>

      {/* Webhook Events Table */}
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-neutral-600">Loading webhook events...</div>
        ) : filteredEvents.length === 0 ? (
          <div className="p-12 text-center">
            <Webhook className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No webhook events found</h3>
            <p className="text-neutral-600">
              {searchQuery || statusFilter !== 'all' || sourceFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Webhook events will appear here'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Event ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Source
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Attempts
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Created
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredEvents.map((event) => {
                  const statusConfig = getStatusConfig(event.status);

                  return (
                    <tr key={event.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-mono text-xs text-primary">
                          {event.eventId}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground text-sm">
                          {event.eventType}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          event.source === 'stripe' ? 'bg-purple-100 text-purple-700' : 'bg-neutral-100 text-neutral-700'
                        }`}>
                          {event.source}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border}`}>
                          <statusConfig.icon className="w-3 h-3" />
                          <span>{statusConfig.label}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-foreground">{event.attempts}</span>
                          {event.nextRetry && (
                            <span className="text-xs text-amber-600">
                              (retrying)
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-600">
                        {formatTimeAgo(event.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => setSelectedEvent(event)}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </button>
                        {event.status === 'failed' && (
                          <button
                            onClick={() => handleRetry(event.id)}
                            className="inline-flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <RefreshCw className="w-4 h-4" />
                            <span>Retry</span>
                          </button>
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

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-border p-6 flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-2xl font-bold text-foreground">Webhook Event Details</h2>
                  {(() => {
                    const statusConfig = getStatusConfig(selectedEvent.status);
                    return (
                      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color} border ${statusConfig.border}`}>
                        <statusConfig.icon className="w-3 h-3" />
                        <span>{statusConfig.label}</span>
                      </span>
                    );
                  })()}
                </div>
                <p className="text-sm text-neutral-600 font-mono">{selectedEvent.eventId}</p>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-neutral-600" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Metadata */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                  <p className="text-xs text-neutral-600 mb-1">Event Type</p>
                  <p className="font-medium text-foreground">{selectedEvent.eventType}</p>
                </div>
                <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                  <p className="text-xs text-neutral-600 mb-1">Source</p>
                  <p className="font-medium text-foreground capitalize">{selectedEvent.source}</p>
                </div>
                <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                  <p className="text-xs text-neutral-600 mb-1">Created At</p>
                  <p className="font-medium text-foreground">{formatTimestamp(selectedEvent.createdAt)}</p>
                </div>
                <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                  <p className="text-xs text-neutral-600 mb-1">Attempts</p>
                  <p className="font-medium text-foreground">{selectedEvent.attempts}</p>
                </div>
              </div>

              {/* Error Message */}
              {selectedEvent.errorMessage && (
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-red-900 mb-1">Error Message</p>
                      <p className="text-sm text-red-700">{selectedEvent.errorMessage}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Payload */}
              <div>
                <h3 className="text-sm font-semibold text-neutral-700 mb-3 flex items-center space-x-2">
                  <Code className="w-4 h-4" />
                  <span>Webhook Payload</span>
                </h3>
                <div className="bg-neutral-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-xs text-green-400 font-mono">
                    {JSON.stringify(selectedEvent.payload, null, 2)}
                  </pre>
                </div>
              </div>

              {/* Response */}
              {selectedEvent.response && (
                <div>
                  <h3 className="text-sm font-semibold text-neutral-700 mb-3 flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Response</span>
                  </h3>
                  <div className="bg-neutral-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-xs text-green-400 font-mono">
                      {JSON.stringify(selectedEvent.response, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
