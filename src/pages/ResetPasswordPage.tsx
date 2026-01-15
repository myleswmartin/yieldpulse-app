import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TrendingUp, Lock, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { handleError, showSuccess } from '../utils/errorHandling';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const { updatePassword } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await updatePassword(newPassword);
      setSuccess(true);
      showSuccess('Password updated successfully', 'Redirecting to sign in...');
      
      // Redirect to sign in after 2 seconds
      setTimeout(() => {
        navigate('/auth/signin', { replace: true });
      }, 2000);
    } catch (err: any) {
      console.error('Password update error:', err);
      setError('Unable to update password. Please try again or request a new reset link.');
      
      // Show toast for network errors
      if (err.message?.toLowerCase().includes('fetch') || err.message?.toLowerCase().includes('network')) {
        handleError(err, 'Update Password', () => handleSubmit(e));
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
            Create New Password
          </h1>
          <p className="text-neutral-600 text-lg">
            Enter your new password below
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
                Password Updated Successfully
              </h2>
              
              <p className="text-neutral-700 mb-6 leading-relaxed">
                Your password has been reset. You will be redirected to the sign in page shortly.
              </p>

              <div className="flex items-center justify-center space-x-2 text-sm text-neutral-500">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-border border-t-primary"></div>
                <span>Redirecting...</span>
              </div>

              <div className="mt-8">
                <Link
                  to="/auth/signin"
                  className="inline-flex items-center space-x-2 text-primary hover:text-primary-hover font-medium transition-colors"
                >
                  <span>Continue to Sign In</span>
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </Link>
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
                  <label htmlFor="newPassword" className="block text-sm font-semibold text-foreground mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full pl-12 pr-4 py-3.5 bg-input-background border border-border rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                      placeholder="••••••••"
                      disabled={loading}
                    />
                  </div>
                  <p className="mt-2 text-xs text-neutral-500">Minimum 6 characters</p>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-foreground mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full pl-12 pr-4 py-3.5 bg-input-background border border-border rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                      placeholder="••••••••"
                      disabled={loading}
                    />
                  </div>
                  <p className="mt-2 text-xs text-neutral-500">Re-enter your new password</p>
                </div>

                {/* Password Requirements */}
                <div className="bg-primary/5 rounded-xl p-4">
                  <p className="text-sm font-semibold text-foreground mb-2">Password requirements:</p>
                  <ul className="space-y-1 text-sm text-neutral-700">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className={`w-4 h-4 ${newPassword.length >= 6 ? 'text-success' : 'text-neutral-400'}`} />
                      <span>At least 6 characters</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className={`w-4 h-4 ${newPassword && confirmPassword && newPassword === confirmPassword ? 'text-success' : 'text-neutral-400'}`} />
                      <span>Passwords match</span>
                    </li>
                  </ul>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm cursor-pointer"
                >
                  {loading ? 'Updating Password...' : 'Update Password'}
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