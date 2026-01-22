import { useState, FormEvent, useEffect } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { TrendingUp, Mail, Lock, AlertCircle, ArrowLeft, Info } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { handleError } from '../utils/errorHandling';

export default function SignInPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  // Safely access useAuth with error boundary
  let authContext;
  try {
    authContext = useAuth();
  } catch (err) {
    console.error('AuthContext not available, reloading page...');
    // Force a full page reload to reinitialize the context
    window.location.reload();
    return <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-border border-t-primary mb-4"></div>
        <p className="text-neutral-600">Initializing...</p>
      </div>
    </div>;
  }
  
  const { signIn, user, loading: authLoading } = authContext;
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [sessionMessage, setSessionMessage] = useState('');

  // Get redirect path from query params or location state
  const redirectTo = searchParams.get('redirect') || (location.state as any)?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (!authLoading && user) {
      navigate(redirectTo, { replace: true });
    }
    
    // Check for session expiration message from navigation state
    if (location.state?.message) {
      setSessionMessage(location.state.message);
    }

    // Save pending analysis from location.state to localStorage before sign-in
    // This ensures it will be synced after authentication
    const state = location.state as any;
    if (state?.inputs && state?.results && !user) {
      try {
        const key = 'yieldpulse-pending-analyses';
        const existing = localStorage.getItem(key);
        const list = existing ? JSON.parse(existing) : [];
        
        // Add this analysis to the pending list
        list.push({
          inputs: state.inputs,
          results: state.results,
          timestamp: Date.now()
        });
        
        localStorage.setItem(key, JSON.stringify(list));
        console.log('📝 Saved pending analysis to localStorage before sign-in');
      } catch (err) {
        console.warn('Failed to save pending analysis:', err);
      }
    }
  }, [user, authLoading, navigate, redirectTo, location.state]);

  const handleDemoMode = () => {
    console.log('🎭 Entering demo mode - bypassing authentication');
    setDemoMode(true);
    // Store demo flag in session storage
    sessionStorage.setItem('yieldpulse-demo-mode', 'true');
    // Navigate to calculator instead of dashboard since demo doesn't have auth
    navigate('/calculator', { replace: true });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      navigate(redirectTo, { replace: true });
    } catch (err: any) {
      console.error('Sign in error:', err);
      
      // Parse error message
      const message = err.message?.toLowerCase() || '';
      
      if (message.includes('invalid login credentials') || message.includes('invalid credentials')) {
        setError('Email or password is incorrect. Please check your credentials and try again. If you don\'t have an account yet, please sign up below.');
      } else if (message.includes('email not confirmed')) {
        setError('Please verify your email address before signing in. Check your inbox for the verification link.');
      } else if (message.includes('user not found')) {
        setError('No account found with this email address. Please sign up to create an account.');
      } else {
        setError('Unable to sign in. Please check your credentials and try again.');
      }
      
      // Also show toast for network errors
      if (err.message?.toLowerCase().includes('fetch') || err.message?.toLowerCase().includes('network')) {
        handleError(err, 'Sign In', () => handleSubmit(e));
      }
    } finally {
      setLoading(false);
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
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-12">
          <Link to="/" className="inline-flex items-center space-x-3 mb-10 group">
            <div className="p-3 bg-primary rounded-xl shadow-sm">
              <TrendingUp className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-semibold text-primary tracking-tight">
              YieldPulse
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-3 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-neutral-600">
            Sign in to access your property analyses
          </p>
        </div>

        {/* Sign In Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-border p-8">
          {error && (
            <div className="mb-6 bg-destructive/10 border border-destructive/30 rounded-xl p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive leading-relaxed">{error}</p>
            </div>
          )}

          {sessionMessage && (
            <div className="mb-6 bg-yellow-100 border border-yellow-300 rounded-xl p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-500 leading-relaxed">{sessionMessage}</p>
            </div>
          )}

          {!error && !sessionMessage && (
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start space-x-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800 leading-relaxed">
                <p className="font-semibold mb-1">First time here?</p>
                <p>Create a free account to save your property analyses and access premium reports. Use the <strong>Sign Up</strong> link below to get started.</p>
              </div>
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
              <div className="mt-2 text-right">
                <Link 
                  to="/auth/forgot-password" 
                  className="text-sm font-medium text-[#1e2875] hover:text-[#2f3aad] transition-colors"
                >
                  Forgot password?
                </Link>
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