import { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  Search, 
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  User,
  Mail,
  Calendar,
  MessageSquare,
  Eye,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { adminApi } from '../../utils/adminApi';

interface SupportTicket {
  id: string;
  ticketNumber: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  message: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'technical' | 'billing' | 'feature-request' | 'general';
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  responses: number;
}

export default function AdminSupport() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [busyTicketId, setBusyTicketId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [selectedMessages, setSelectedMessages] = useState<any[]>([]);

  useEffect(() => {
    fetchTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const normalizeTicket = (t: any): SupportTicket => {
    const ticketNumber = t.ticket_number || `SUP-${(t.id || '').slice(0, 6).toUpperCase()}`;
    return {
      id: t.id,
      ticketNumber,
      userId: t.user_id || '',
      userName: t.user_name || t.user_full_name || (t.user_email ? t.user_email.split('@')[0] : 'Guest'),
      userEmail: t.user_email || t.email || '',
      subject: t.subject || '',
      message: t.message || t.last_message || '',
      status: t.status || 'open',
      priority: t.priority || 'medium',
      category: t.category || 'general',
      createdAt: t.created_at || t.createdAt,
      updatedAt: t.updated_at || t.updatedAt || t.created_at,
      assignedTo: t.assigned_to || undefined,
      responses: t.responses ?? 0,
    };
  };

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await adminApi.support.tickets.list({
        status: statusFilter !== 'all' ? statusFilter : undefined,
      });
      const normalized = (data.tickets || []).map(normalizeTicket);
      setTickets(normalized);
    } catch (err: any) {
      console.error('Failed to fetch support tickets:', err);
      toast.error(err.message || 'Failed to load support tickets');
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      'open': { icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', label: 'Open' },
      'in-progress': { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', label: 'In Progress' },
      'resolved': { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', label: 'Resolved' },
      'closed': { icon: XCircle, color: 'text-neutral-600', bg: 'bg-neutral-50', border: 'border-neutral-200', label: 'Closed' }
    };
    return configs[status as keyof typeof configs] || configs.open;
  };

  const getPriorityConfig = (priority: string) => {
    const configs = {
      'low': { color: 'text-neutral-600', bg: 'bg-neutral-100', label: 'Low' },
      'medium': { color: 'text-blue-600', bg: 'bg-blue-100', label: 'Medium' },
      'high': { color: 'text-amber-600', bg: 'bg-amber-100', label: 'High' },
      'urgent': { color: 'text-red-600', bg: 'bg-red-100', label: 'Urgent' }
    };
    return configs[priority as keyof typeof configs] || configs.low;
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      'technical': 'Technical',
      'billing': 'Billing',
      'feature-request': 'Feature Request',
      'general': 'General'
    };
    return labels[category as keyof typeof labels] || category;
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
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in-progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length
  };

  const handleStatusChange = async (ticketId: string, newStatus: SupportTicket['status']) => {
    try {
      setBusyTicketId(ticketId);
      await adminApi.support.tickets.update(ticketId, { status: newStatus });
      setTickets(prev => prev.map(t =>
        t.id === ticketId
          ? { ...t, status: newStatus, updatedAt: new Date().toISOString() }
          : t
      ));
      if (selectedTicket?.id === ticketId) {
        setSelectedTicket({ ...selectedTicket, status: newStatus, updatedAt: new Date().toISOString() });
      }
      toast.success('Ticket status updated');
    } catch (err: any) {
      console.error('Failed to update ticket:', err);
      toast.error(err.message || 'Failed to update ticket');
    } finally {
      setBusyTicketId(null);
    }
  };

  const handleViewTicket = async (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setSelectedMessages([]);
    try {
      setDetailLoading(true);
      const data = await adminApi.support.tickets.get(ticket.id);
      const normalized = normalizeTicket(data.ticket || ticket);
      setSelectedTicket(normalized);
      setSelectedMessages(data.messages || []);
    } catch (err: any) {
      console.error('Failed to load ticket details:', err);
      toast.error(err.message || 'Failed to load ticket details');
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Support Tickets</h1>
        <p className="text-neutral-600 mt-1">Manage customer support requests and inquiries</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-neutral-600">Total Tickets</span>
            <MessageCircle className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl font-bold text-foreground">{stats.total}</p>
        </div>

        <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-neutral-600">Open</span>
            <AlertCircle className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-3xl font-bold text-amber-600">{stats.open}</p>
        </div>

        <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-neutral-600">In Progress</span>
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-blue-600">{stats.inProgress}</p>
        </div>

        <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-neutral-600">Resolved</span>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-green-600">{stats.resolved}</p>
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
                placeholder="Search tickets by subject, user, email, or ticket number..."
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
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Tickets List */}
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-neutral-600">Loading tickets...</div>
        ) : filteredTickets.length === 0 ? (
          <div className="p-12 text-center">
            <MessageCircle className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No tickets found</h3>
            <p className="text-neutral-600">
              {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'All support tickets will appear here'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Ticket
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Subject
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Priority
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Status
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
                {filteredTickets.map((ticket) => {
                  const statusConfig = getStatusConfig(ticket.status);
                  const priorityConfig = getPriorityConfig(ticket.priority);

                  return (
                    <tr key={ticket.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-mono text-sm font-medium text-primary">
                          {ticket.ticketNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-foreground">{ticket.userName}</div>
                          <div className="text-sm text-neutral-600">{ticket.userEmail}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <div className="font-medium text-foreground truncate">{ticket.subject}</div>
                          {ticket.responses > 0 && (
                            <div className="flex items-center space-x-1 text-xs text-neutral-600 mt-1">
                              <MessageSquare className="w-3 h-3" />
                              <span>{ticket.responses} response{ticket.responses !== 1 ? 's' : ''}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-neutral-600">
                          {getCategoryLabel(ticket.category)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${priorityConfig.bg} ${priorityConfig.color}`}>
                          {priorityConfig.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={ticket.status}
                          onChange={(e) => handleStatusChange(ticket.id, e.target.value as SupportTicket['status'])}
                          disabled={busyTicketId === ticket.id}
                          className={`text-xs font-medium px-2.5 py-1.5 rounded-lg border ${statusConfig.bg} ${statusConfig.border} ${statusConfig.color} focus:ring-2 focus:ring-primary focus:border-transparent`}
                        >
                          <option value="open">Open</option>
                          <option value="in-progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                          <option value="closed">Closed</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-600">
                        {formatTimestamp(ticket.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleViewTicket(ticket)}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-border p-6 flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-2xl font-bold text-foreground">{selectedTicket.ticketNumber}</h2>
                  {(() => {
                    const statusConfig = getStatusConfig(selectedTicket.status);
                    return (
                      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color} border ${statusConfig.border}`}>
                        <statusConfig.icon className="w-3 h-3" />
                        <span>{statusConfig.label}</span>
                      </span>
                    );
                  })()}
                  {(() => {
                    const priorityConfig = getPriorityConfig(selectedTicket.priority);
                    return (
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${priorityConfig.bg} ${priorityConfig.color}`}>
                        {priorityConfig.label} Priority
                      </span>
                    );
                  })()}
                </div>
                <p className="text-sm text-neutral-600">{getCategoryLabel(selectedTicket.category)}</p>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-neutral-600" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* User Info */}
              <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-neutral-600" />
                    <div>
                      <p className="text-xs text-neutral-600">User</p>
                      <p className="font-medium text-foreground">{selectedTicket.userName}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-neutral-600" />
                    <div>
                      <p className="text-xs text-neutral-600">Email</p>
                      <p className="font-medium text-foreground">{selectedTicket.userEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-neutral-600" />
                    <div>
                      <p className="text-xs text-neutral-600">Created</p>
                      <p className="font-medium text-foreground">{formatTimestamp(selectedTicket.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-neutral-600" />
                    <div>
                      <p className="text-xs text-neutral-600">Last Updated</p>
                      <p className="font-medium text-foreground">{formatTimestamp(selectedTicket.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div>
                <h3 className="text-sm font-semibold text-neutral-600 mb-2">Subject</h3>
                <p className="text-lg font-semibold text-foreground">{selectedTicket.subject}</p>
              </div>

              {/* Message */}
              <div>
                <h3 className="text-sm font-semibold text-neutral-600 mb-2">Message</h3>
                <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200 space-y-3">
                  {detailLoading && <p className="text-neutral-600">Loading conversation...</p>}
                  {!detailLoading && selectedMessages.length === 0 && (
                    <p className="text-neutral-600">No messages yet.</p>
                  )}
                  {!detailLoading && selectedMessages.map((msg: any) => (
                    <div key={msg.id} className="p-3 bg-white rounded-lg border border-neutral-200">
                      <div className="text-xs text-neutral-500 mb-1">
                        {msg.is_admin ? 'Admin' : 'User'} - {formatTimestamp(msg.created_at)}
                      </div>
                      <div className="text-sm text-foreground">{msg.message}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-neutral-600">Change Status:</span>
                  <select
                    value={selectedTicket.status}
                    onChange={(e) => {
                      handleStatusChange(selectedTicket.id, e.target.value as SupportTicket['status']);
                      setSelectedTicket({ ...selectedTicket, status: e.target.value as SupportTicket['status'] });
                    }}
                    className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <a
                  href={`mailto:${selectedTicket.userEmail}?subject=${encodeURIComponent(`Re: ${selectedTicket.subject}`)}`}
                  className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors cursor-pointer"
                >
                  Reply to User
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
