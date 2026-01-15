import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Mail, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { handleError, showSuccess } from '../utils/errorHandling';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      await resetPassword(email);
      setSuccess(true);
      showSuccess('Password reset email sent', 'Check your inbox for reset instructions.');
    } catch (err: any) {
      console.error('Password reset error:', err);
      setError('Unable to send reset email. Please try again.');
      
      // Show toast for network errors
      if (err.message?.toLowerCase().includes('fetch') || err.message?.toLowerCase().includes('network')) {
        handleError(err, 'Send Reset Email', () => handleSubmit(e));
      }
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-3xl font-bold text-foreground mb-3">
            Reset Your Password
          </h1>
          <p className="text-neutral-600 text-lg">
            Enter your email address and we will send you a password reset link
          </p>
        </div>

        {/* Reset Password Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-border p-8">
          {success ? (
            // Success State
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-success/10 rounded-full mb-6">
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
              
              <h2 className="font-semibold text-foreground mb-3">
                Check Your Email
              </h2>
              
              <p className="text-neutral-700 mb-6 leading-relaxed">
                We have sent password reset instructions to <span className="font-semibold">{email}</span>
              </p>

              <div className="bg-primary/5 rounded-xl p-4 mb-6">
                <p className="text-sm text-neutral-700 leading-relaxed">
                  <span className="font-semibold">Next steps:</span><br />
                  1. Check your email inbox<br />
                  2. Click the password reset link<br />
                  3. Enter your new password<br />
                  4. Sign in with your new password
                </p>
              </div>

              <p className="text-xs text-neutral-500 mb-6">
                Did not receive the email? Check your spam or junk folder.
              </p>

              <div className="space-y-3">
                <Link
                  to="/auth/signin"
                  className="block w-full py-4 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary-hover transition-all text-center shadow-sm"
                >
                  Back to Sign In
                </Link>

                <button
                  onClick={() => {
                    setSuccess(false);
                    setEmail('');
                  }}
                  className="w-full py-3 text-primary hover:text-primary-hover font-medium transition-colors cursor-pointer"
                >
                  Try a Different Email
                </button>
              </div>
            </div>
          ) : (
            // Form State
            <>
              {error && (
                <div className="mb-6 bg-destructive/10 border border-destructive/30 rounded-xl p-4 flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-destructive leading-relaxed">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-3.5 bg-input-background border border-border rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                      placeholder="you@example.com"
                      disabled={loading}
                    />
                  </div>
                  <p className="mt-2 text-xs text-neutral-500">
                    Enter the email address associated with your account
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm cursor-pointer"
                >
                  {loading ? 'Sending Reset Link...' : 'Send Reset Link'}
                </button>
              </form>

              {/* Back to Sign In */}
              <div className="mt-8 pt-6 border-t border-border text-center">
                <p className="text-neutral-600">
                  Remember your password?{' '}
                  <Link to="/auth/signin" className="font-medium text-primary hover:text-primary-hover transition-colors">
                    Sign In
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
            </>
          )}
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