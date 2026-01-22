import { useState } from 'react';
import { ThumbsUp, ThumbsDown, CheckCircle, MessageSquare } from 'lucide-react';

interface FeedbackWidgetProps {
  pageId: string;
  title?: string;
}

export function FeedbackWidget({ pageId, title = "Was this helpful?" }: FeedbackWidgetProps) {
  const [feedback, setFeedback] = useState<'positive' | 'negative' | null>(null);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleFeedback = async (type: 'positive' | 'negative') => {
    setFeedback(type);
    
    // Track in analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'feedback', {
        event_category: 'User Feedback',
        event_label: pageId,
        value: type === 'positive' ? 1 : 0
      });
    }

    // If negative, show comment box
    if (type === 'negative') {
      setShowCommentBox(true);
    } else {
      // Auto-submit positive feedback after 2 seconds
      setTimeout(() => {
        setSubmitted(true);
      }, 2000);
    }
  };

  const handleSubmitComment = async () => {
    // Track comment submission
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'feedback_comment', {
        event_category: 'User Feedback',
        event_label: pageId,
        event_value: comment.length
      });
    }

    // Here you could send to backend API if needed
    console.log('Feedback submitted:', { pageId, feedback, comment });
    
    setSubmitted(true);
    setShowCommentBox(false);
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center no-print">
        <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
        <p className="text-green-800 font-medium mb-1">Thank you for your feedback!</p>
        <p className="text-sm text-green-700">Your input helps us improve our content.</p>
      </div>
    );
  }

  return (
    <div className="bg-neutral-50 border border-border rounded-xl p-6 no-print">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-neutral-600">Your feedback helps us create better content for UAE investors.</p>
      </div>

      {feedback === null ? (
        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => handleFeedback('positive')}
            className="group flex items-center space-x-2 px-6 py-3 bg-white border-2 border-border rounded-lg hover:border-green-500 hover:bg-green-50 transition-all"
          >
            <ThumbsUp className="w-5 h-5 text-neutral-600 group-hover:text-green-600 transition-colors" />
            <span className="font-medium text-neutral-700 group-hover:text-green-700">Yes, helpful</span>
          </button>

          <button
            type="button"
            onClick={() => handleFeedback('negative')}
            className="group flex items-center space-x-2 px-6 py-3 bg-white border-2 border-border rounded-lg hover:border-red-500 hover:bg-red-50 transition-all"
          >
            <ThumbsDown className="w-5 h-5 text-neutral-600 group-hover:text-red-600 transition-colors" />
            <span className="font-medium text-neutral-700 group-hover:text-red-700">Not helpful</span>
          </button>
        </div>
      ) : feedback === 'positive' && !showCommentBox ? (
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 px-6 py-3 bg-green-100 border border-green-300 rounded-lg">
            <ThumbsUp className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-700">Thanks for the positive feedback!</span>
          </div>
        </div>
      ) : null}

      {showCommentBox && (
        <div className="mt-4 space-y-3">
          <div className="flex items-start space-x-2 text-sm text-neutral-600">
            <MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p>Help us improve - what could we do better?</p>
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Optional: Tell us how we can improve this content..."
            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
            rows={4}
          />
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setShowCommentBox(false);
                setSubmitted(true);
              }}
              className="px-4 py-2 text-neutral-600 hover:text-neutral-800 font-medium transition-colors"
            >
              Skip
            </button>
            <button
              type="button"
              onClick={handleSubmitComment}
              disabled={comment.trim().length === 0}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Feedback
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
