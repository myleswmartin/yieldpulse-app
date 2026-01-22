import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TrendingUp, Mail, CheckCircle, AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabaseClient';
import { handleError, showSuccess, showInfo } from '../utils/errorHandling';

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading, resendVerificationEmail } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [resending, setResending] = useState(false);
  const [checkingVerification, setCheckingVerification] = useState(false);

  useEffect(() => {
    const getEmail = async () => {
      // Try to get email from current session
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        setEmail(session.user.email);
        return;
      }
      
      // If no session, try localStorage (for unverified users)
      try {
        const pendingEmail = localStorage.getItem('pendingVerificationEmail');
        if (pendingEmail) {
          setEmail(pendingEmail);
        }
      } catch (e) {
        console.warn('Could not read from localStorage:', e);
      }
    };

    getEmail();
  }, []);

  useEffect(() => {
    // If user is already verified, redirect to calculator
    if (!authLoading && user?.emailVerified) {
      navigate('/calculator', { replace: true });
    }
  }, [user, authLoading, navigate]);

  const handleResendEmail = async () => {
    setResending(true);

    try {
      await resendVerificationEmail();
      showSuccess('Verification email sent', 'Please check your inbox and spam folder.');
    } catch (error: any) {
      console.error('Resend verification error:', error);
      handleError(error, 'Resend Email', () => handleResendEmail());
    } finally {
      setResending(false);
    }
  };

  const handleCheckVerification = async () => {
    setCheckingVerification(true);

    try {
      // First, try to get the current session (user may not have one yet if they haven't clicked email link)
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
      
      // If there's no session at all, user hasn't clicked the verification link yet
      if (!currentSession) {
        showInfo('Email not verified yet', 'Please check your inbox and click the verification link first.');
        setCheckingVerification(false);
        return;
      }

      // If we have a session, refresh it to get the latest verification status
      const { data: { session }, error: refreshError } = await supabase.auth.refreshSession();
      
      if (refreshError) {
        // If refresh fails, fall back to checking current session
        console.warn('Session refresh failed, using current session:', refreshError);
        if (currentSession?.user?.email_confirmed_at) {
          showSuccess('Email verified successfully');
          setTimeout(() => {
            window.location.href = '/calculator';
          }, 1000);
        } else {
          showInfo('Email not verified yet', 'Please check your inbox and click the verification link.');
        }
        return;
      }

      // Check if email is now verified
      if (session?.user?.email_confirmed_at) {
        // Email is verified! Force a page reload to update auth context
        showSuccess('Email verified successfully');
        setTimeout(() => {
          window.location.href = '/calculator';
        }, 1000);
      } else {
        showInfo('Email not verified yet', 'Please check your inbox and click the verification link.');
      }
    } catch (error: any) {
      console.error('Check verification error:', error);
      // Don't show error for missing session - it's expected before email verification
      if (error.message?.includes('Auth session missing')) {
        showInfo('Email not verified yet', 'Please check your inbox and click the verification link first.');
      } else {
        handleError(error, 'Check Verification');
      }
    } finally {
      setCheckingVerification(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-border border-t-primary mb-4"></div>
          <p className="text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center space-x-3 mb-8 group">
            <div className="p-3 bg-gradient-to-br from-primary to-primary-hover rounded-xl group-hover:scale-105 transition-transform">
              <TrendingUp className="w-7 h-7 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
              YieldPulse
            </span>
          </Link>
          
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Mail className="w-8 h-8 text-primary" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-3">
            Verify Your Email
          </h1>
          <p className="text-neutral-600 text-lg leading-relaxed">
            We have sent a verification email to confirm your account
          </p>
        </div>

        {/* Verification Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-border p-8">
          {/* Email Address Display */}
          <div className="mb-6 p-4 bg-muted/50 rounded-xl border border-border">
            <p className="text-sm text-muted-foreground mb-1">Email sent to:</p>
            <p className="font-semibold text-foreground break-all">{email || 'Loading...'}</p>
          </div>

          {/* Instructions */}
          <div className="mb-6 space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                1
              </div>
              <div>
                <p className="text-sm text-neutral-700 leading-relaxed">
                  Check your inbox for an email from YieldPulse
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                2
              </div>
              <div>
                <p className="text-sm text-neutral-700 leading-relaxed">
                  Click the verification link in the email
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                3
              </div>
              <div>
                <p className="text-sm text-neutral-700 leading-relaxed">
                  You will be automatically redirected to start using YieldPulse
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleCheckVerification}
              disabled={checkingVerification}
              className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {checkingVerification ? 'Checking...' : 'I Have Verified My Email'}
            </button>

            <button
              onClick={handleResendEmail}
              disabled={resending}
              className="w-full py-4 bg-muted text-foreground rounded-xl font-medium hover:bg-muted/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <RefreshCw className={`w-4 h-4 ${resending ? 'animate-spin' : ''}`} />
              <span>{resending ? 'Sending...' : 'Resend Verification Email'}</span>
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-6 pt-6 border-t border-border">
            <div className="bg-primary/5 rounded-lg p-4">
              <p className="text-sm text-neutral-700 leading-relaxed">
                <span className="font-semibold">Why verify your email?</span><br />
                Email verification ensures account security and allows us to send you important updates about your property analyses and reports.
              </p>
            </div>
          </div>

          {/* Spam Folder Notice */}
          <div className="mt-4 text-center">
            <p className="text-xs text-neutral-500 leading-relaxed">
              Did not receive the email? Check your spam or junk folder.
            </p>
          </div>

          {/* Sign Out Link */}
          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-neutral-600 text-sm">
              Wrong email address?{' '}
              <Link to="/auth/signup" className="font-medium text-primary hover:text-primary-hover transition-colors">
                Sign up again
              </Link>
            </p>
          </div>

          {/* Back to Home */}
          <div className="mt-4 text-center">
            <Link 
              to="/" 
              className="inline-flex items-center space-x-2 text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>

        {/* Trust Badge */}
        <div className="mt-8 text-center">
          <p className="text-sm text-neutral-500">
            Trusted by property investors across the UAE
          </p>
        </div>
      </div>
    </div>
  );
}