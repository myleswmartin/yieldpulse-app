import { useState, useEffect } from 'react';
import { Mail, Clock, User, MessageSquare } from 'lucide-react';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import { useAuth } from '../../contexts/AuthContext';

interface ContactSubmission {
  id: string;
  full_name: string;
  email: string;
  subject: string;
  message: string;
  submitted_at: string;
  status: string;
}

export default function AdminContactSubmissions() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const { session } = useAuth();

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ef294769/admin/contact/submissions`,
        {
          headers: {
            'Authorization': `Bearer ${session?.access_token || publicAnonKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch submissions');
      }

      const data = await response.json();
      setSubmissions(data.submissions || []);
    } catch (error) {
      console.error('Error fetching contact submissions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case 'Premium Report Support':
        return 'bg-red-100 text-red-800';
      case 'Technical Issue':
        return 'bg-orange-100 text-orange-800';
      case 'Account or Access Issue':
        return 'bg-yellow-100 text-yellow-800';
      case 'Calculator or Report Question':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Contact Submissions</h1>
        <p className="text-neutral-600 mt-1">
          View and manage contact form submissions ({submissions.length} total)
        </p>
      </div>

      {submissions.length === 0 ? (
        <div className="bg-white rounded-lg border border-border p-12 text-center">
          <Mail className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">No Submissions</h2>
          <p className="text-neutral-600">No contact form submissions yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Submissions List */}
          <div className="lg:col-span-1 space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
            {submissions.map((submission) => (
              <div
                key={submission.id}
                onClick={() => setSelectedSubmission(submission)}
                className={`bg-white rounded-lg border p-4 cursor-pointer transition-all hover:shadow-md ${
                  selectedSubmission?.id === submission.id
                    ? 'border-primary shadow-md'
                    : 'border-border'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">
                      {submission.full_name}
                    </h3>
                    <p className="text-sm text-neutral-600 truncate">{submission.email}</p>
                  </div>
                </div>
                <div className="mb-2">
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${getSubjectColor(submission.subject)}`}>
                    {submission.subject}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDate(submission.submitted_at)}
                </p>
              </div>
            ))}
          </div>

          {/* Submission Details */}
          <div className="lg:col-span-2">
            {selectedSubmission ? (
              <div className="bg-white rounded-lg border border-border p-6">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-foreground">Submission Details</h2>
                    <span className={`px-3 py-1 text-sm font-medium rounded ${getSubjectColor(selectedSubmission.subject)}`}>
                      {selectedSubmission.subject}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-neutral-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-neutral-500">Name</p>
                        <p className="font-medium text-foreground">{selectedSubmission.full_name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-neutral-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-neutral-500">Email</p>
                        <a 
                          href={`mailto:${selectedSubmission.email}`}
                          className="font-medium text-primary hover:underline"
                        >
                          {selectedSubmission.email}
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-neutral-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-neutral-500">Submitted</p>
                        <p className="font-medium text-foreground">
                          {formatDate(selectedSubmission.submitted_at)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <MessageSquare className="w-5 h-5 text-neutral-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-neutral-500">ID</p>
                        <p className="font-mono text-xs text-neutral-600">
                          {selectedSubmission.id.slice(0, 8)}...
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3">Message</h3>
                  <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                    <p className="text-neutral-700 whitespace-pre-wrap leading-relaxed">
                      {selectedSubmission.message}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-border">
                  <a
                    href={`mailto:${selectedSubmission.email}?subject=Re: ${encodeURIComponent(selectedSubmission.subject)}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    Reply via Email
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-border p-12 text-center h-full flex items-center justify-center">
                <div>
                  <Mail className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                  <p className="text-neutral-600">Select a submission to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}