import { useEffect, useState } from 'react';
import { FileText, Upload, Download, Trash2, Plus, X } from 'lucide-react';
import { adminApi } from '../../utils/adminApi';
import { toast } from 'sonner';

interface Document {
  id: string;
  name: string;
  description: string;
  category: 'brand-identity' | 'logo-usage' | 'user-guide' | 'other';
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  downloadUrl?: string;
}

export default function AdminDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    name: '',
    description: '',
    category: 'user-guide' as Document['category'],
    file: null as File | null
  });

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      console.log('📄 [AdminDocuments] Fetching documents...');
      const data = await adminApi.documents.list();
      console.log('✅ [AdminDocuments] Documents fetched:', data);
      setDocuments(data);
    } catch (err: any) {
      console.error('❌ [AdminDocuments] Failed to fetch documents:', err);
      console.error('Error details:', {
        message: err.message,
        stack: err.stack,
        response: err.response
      });
      // Don't show error toast - documents are optional, we have built-in docs
      // Just set empty array
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadForm.file || !uploadForm.name) {
      toast.error('Please provide a name and select a file');
      return;
    }

    try {
      setUploading(true);
      await adminApi.documents.upload(
        uploadForm.file,
        uploadForm.name,
        uploadForm.description,
        uploadForm.category
      );
      
      toast.success('Document uploaded successfully');
      setShowUploadModal(false);
      setUploadForm({
        name: '',
        description: '',
        category: 'user-guide',
        file: null
      });
      fetchDocuments();
    } catch (err: any) {
      console.error('Failed to upload document:', err);
      toast.error(err.message || 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (docId: string, docName: string) => {
    if (!confirm(`Are you sure you want to delete "${docName}"?`)) {
      return;
    }

    try {
      await adminApi.documents.delete(docId);
      toast.success('Document deleted successfully');
      fetchDocuments();
    } catch (err: any) {
      console.error('Failed to delete document:', err);
      toast.error(err.message || 'Failed to delete document');
    }
  };

  const handleDownload = async (doc: Document) => {
    try {
      const url = await adminApi.documents.getDownloadUrl(doc.id);
      window.open(url, '_blank');
    } catch (err: any) {
      console.error('Failed to download document:', err);
      toast.error(err.message || 'Failed to download document');
    }
  };

  const getCategoryLabel = (category: Document['category']) => {
    const labels = {
      'brand-identity': 'Brand Identity',
      'logo-usage': 'Logo Usage',
      'user-guide': 'User Guide',
      'other': 'Other'
    };
    return labels[category];
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-neutral-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-neutral-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Documents Library</h1>
          <p className="text-neutral-600">
            Upload and manage company documents, guides, and resources
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Documents List */}
      {documents.length === 0 ? (
        <div className="bg-white border border-border rounded-lg p-12 text-center">
          <FileText className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No documents yet</h3>
          <p className="text-neutral-600 mb-4">
            Upload your first document to get started
          </p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Document</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-white border border-border rounded-lg p-6 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-semibold text-foreground truncate">
                        {doc.name}
                      </h3>
                      <span className="px-2 py-0.5 bg-neutral-100 text-neutral-700 text-xs rounded-full whitespace-nowrap">
                        {getCategoryLabel(doc.category)}
                      </span>
                    </div>
                    {doc.description && (
                      <p className="text-sm text-neutral-600 mb-2 line-clamp-2">
                        {doc.description}
                      </p>
                    )}
                    <div className="flex items-center space-x-4 text-xs text-neutral-500">
                      <span>{doc.fileName}</span>
                      <span>•</span>
                      <span>{formatFileSize(doc.fileSize)}</span>
                      <span>•</span>
                      <span>Uploaded {formatDate(doc.uploadedAt)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleDownload(doc)}
                    className="p-2 text-neutral-600 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id, doc.name)}
                    className="p-2 text-neutral-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Upload Document</h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-2 text-neutral-600 hover:text-foreground hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Document Name *
                </label>
                <input
                  type="text"
                  value={uploadForm.name}
                  onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., Brand Guidelines 2024"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description
                </label>
                <textarea
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  rows={3}
                  placeholder="Brief description of the document..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Category *
                </label>
                <select
                  value={uploadForm.category}
                  onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value as Document['category'] })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="brand-identity">Brand Identity</option>
                  <option value="logo-usage">Logo Usage</option>
                  <option value="user-guide">User Guide</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  File *
                </label>
                <div className="relative">
                  <input
                    type="file"
                    onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files?.[0] || null })}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.svg"
                    required
                  />
                </div>
                <p className="text-xs text-neutral-500 mt-2">
                  Accepted formats: PDF, DOC, DOCX, PNG, JPG, SVG (Max 10MB)
                </p>
              </div>

              <div className="flex items-center space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload className="w-4 h-4" />
                  <span>{uploading ? 'Uploading...' : 'Upload'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  disabled={uploading}
                  className="px-4 py-2 border border-border text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}