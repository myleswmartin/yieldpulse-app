import { useState } from 'react';
import { X, Copy, Check, Share2, Mail, MessageCircle, Linkedin, Twitter } from 'lucide-react';
import { toast } from 'sonner';

interface ShareModalProps {
  shareUrl: string;
  propertyName: string;
  onClose: () => void;
}

export function ShareModal({ shareUrl, propertyName, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareViaWhatsApp = () => {
    const text = encodeURIComponent(`Check out this investment analysis for ${propertyName} on YieldPulse: ${shareUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Investment Analysis: ${propertyName}`);
    const body = encodeURIComponent(
      `I wanted to share this investment analysis for ${propertyName} with you.\n\nYou can view the full report here:\n${shareUrl}\n\nGenerated with YieldPulse - UAE Property Investment ROI Calculator`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const shareViaLinkedIn = () => {
    const url = encodeURIComponent(shareUrl);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  };

  const shareViaTwitter = () => {
    const text = encodeURIComponent(`Check out this investment analysis for ${propertyName}`);
    const url = encodeURIComponent(shareUrl);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Share2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Share Report</h2>
              <p className="text-sm text-neutral-600">{propertyName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Copy Link Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Share Link
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 px-3 py-2 border border-border rounded-lg bg-neutral-50 text-sm text-neutral-700 font-mono"
              onClick={(e) => e.currentTarget.select()}
            />
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium flex items-center space-x-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Share Options */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-3">
            Share via
          </label>
          <div className="grid grid-cols-2 gap-3">
            {/* WhatsApp */}
            <button
              onClick={shareViaWhatsApp}
              className="flex items-center space-x-3 px-4 py-3 border-2 border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all group"
            >
              <MessageCircle className="w-5 h-5 text-[#25D366] group-hover:scale-110 transition-transform" />
              <span className="font-medium text-neutral-700 group-hover:text-primary">WhatsApp</span>
            </button>

            {/* Email */}
            <button
              onClick={shareViaEmail}
              className="flex items-center space-x-3 px-4 py-3 border-2 border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all group"
            >
              <Mail className="w-5 h-5 text-[#EA4335] group-hover:scale-110 transition-transform" />
              <span className="font-medium text-neutral-700 group-hover:text-primary">Email</span>
            </button>

            {/* LinkedIn */}
            <button
              onClick={shareViaLinkedIn}
              className="flex items-center space-x-3 px-4 py-3 border-2 border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all group"
            >
              <Linkedin className="w-5 h-5 text-[#0A66C2] group-hover:scale-110 transition-transform" />
              <span className="font-medium text-neutral-700 group-hover:text-primary">LinkedIn</span>
            </button>

            {/* Twitter */}
            <button
              onClick={shareViaTwitter}
              className="flex items-center space-x-3 px-4 py-3 border-2 border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all group"
            >
              <Twitter className="w-5 h-5 text-[#1DA1F2] group-hover:scale-110 transition-transform" />
              <span className="font-medium text-neutral-700 group-hover:text-primary">Twitter</span>
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 p-4 bg-teal/10 rounded-lg border border-teal/30">
          <p className="text-sm text-neutral-700">
            <strong className="text-teal">Anyone with this link</strong> can view this report. 
            Recipients can sign up to save it to their dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
