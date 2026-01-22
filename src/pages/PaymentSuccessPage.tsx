import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(true);

  const purchaseId = searchParams.get('purchaseId');
  const isGuest = searchParams.get('guest') === 'true';

  useEffect(() => {
    // Simulate processing delay
    const timer = setTimeout(() => {
      setIsProcessing(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    if (user) {
      // User is logged in, go to dashboard
      navigate('/dashboard');
    } else {
      // Guest user, prompt to sign up
      navigate(`/signup?purchaseId=${purchaseId}`);
    }
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-4" />
          <p className="text-lg text-neutral-600">Processing your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 px-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <div className="text-center">
          {/* Success Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>

          {/* Heading */}
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
            Payment Successful!
          </h1>

          {/* Message */}
          <p className="text-lg text-neutral-600 mb-8">
            Thank you for your purchase. Your premium ROI report is ready.
          </p>

          {/* Details Card */}
          <div className="bg-primary/5 rounded-xl p-6 mb-8 text-left">
            <h2 className="font-semibold text-neutral-900 mb-3">What's Next?</h2>
            {user ? (
              <ul className="space-y-2 text-neutral-700">
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
                  <span>Access your premium report in the dashboard</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
                  <span>Export detailed PDF analysis</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
                  <span>View comprehensive multi-year projections</span>
                </li>
              </ul>
            ) : (
              <ul className="space-y-2 text-neutral-700">
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
                  <span>Create your free account to access your report</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
                  <span>Save and manage all your property analyses</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
                  <span>Export your premium report as PDF anytime</span>
                </li>
              </ul>
            )}
          </div>

          {/* Action Button */}
          <button
            onClick={handleContinue}
            className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground rounded-xl font-medium shadow-lg transition-all hover:bg-primary-hover"
          >
            <span>{user ? 'Go to Dashboard' : 'Create Account & Access Report'}</span>
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>

          {/* Fine Print */}
          <p className="text-sm text-neutral-500 mt-6">
            Purchase ID: {purchaseId?.slice(0, 8)}...
          </p>
        </div>
      </div>
    </div>
  );
}
