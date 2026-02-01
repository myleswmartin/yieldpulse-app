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
  
  const { signIn, signInWithOAuth, user, loading: authLoading } = authContext;
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [sessionMessage, setSessionMessage] = useState('');

  // Get redirect path from query params or location state
  const fromLocation = (location.state as any)?.from;
  const redirectFromState = fromLocation
    ? `${fromLocation.pathname || ''}${fromLocation.search || ''}${fromLocation.hash || ''}`
    : '';
  const redirectTo = searchParams.get('redirect') || redirectFromState || '/dashboard';

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

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithOAuth('google');
    } catch (err: any) {
      console.error('Google sign in error:', err);
      setError(err.message || 'Failed to sign in with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithOAuth('apple');
    } catch (err: any) {
      console.error('Apple sign in error:', err);
      setError(err.message || 'Failed to sign in with Apple. Please try again.');
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

          {/* OAuth Options */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-neutral-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full inline-flex justify-center items-center gap-3 px-4 py-3 bg-white border border-neutral-300 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Continue with Google</span>
              </button>

              <button
                type="button"
                onClick={handleAppleSignIn}
                disabled={loading}
                className="w-full inline-flex justify-center items-center gap-3 px-4 py-3 bg-black border border-black rounded-lg text-sm font-medium text-white hover:bg-neutral-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                <span>Continue with Apple</span>
              </button>
            </div>
          </div>

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
