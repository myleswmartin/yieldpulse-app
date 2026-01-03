import { useState, FormEvent, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { TrendingUp, Mail, Lock, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function SignInPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, user, loading: authLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (!authLoading && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
      console.error('Sign in error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-neutral-200 border-t-[#1e2875] mb-6"></div>
          <p className="text-neutral-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-12">
          <Link to="/" className="inline-flex items-center space-x-3 mb-10 group">
            <div className="p-3 bg-[#1e2875] rounded-xl shadow-sm">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-semibold text-[#1e2875] tracking-tight">
              YieldPulse
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-neutral-900 mb-3 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-neutral-600">
            Sign in to access your saved analyses
          </p>
        </div>

        {/* Sign In Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800 leading-relaxed">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-neutral-700 mb-2">
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
                  className="w-full pl-12 pr-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-[#1e2875] focus:border-transparent focus:bg-white transition-all"
                  placeholder="you@example.com"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-neutral-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-[#1e2875] focus:border-transparent focus:bg-white transition-all"
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-[#1e2875] to-[#2f3aad] text-white rounded-xl font-semibold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 pt-6 border-t border-neutral-200 text-center">
            <p className="text-neutral-600">
              Don't have an account?{' '}
              <Link to="/auth/signup" className="font-semibold text-[#1e2875] hover:text-[#2f3aad] transition-colors">
                Sign Up
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
