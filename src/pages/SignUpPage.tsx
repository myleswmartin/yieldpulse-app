import { useState, FormEvent, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { TrendingUp, Mail, Lock, User, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { handleError, showSuccess } from '../utils/errorHandling';

export default function SignUpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signUp, user, loading: authLoading } = useAuth();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      navigate('/dashboard', { replace: true });
    }

    // Save pending analysis from location.state to localStorage before sign-up
    // This ensures it will be synced after email verification and authentication
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
        console.log('📝 Saved pending analysis to localStorage before sign-up');
      } catch (err) {
        console.warn('Failed to save pending analysis:', err);
      }
    }
  }, [user, authLoading, navigate, location.state]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!firstName.trim() || !lastName.trim()) {
      setError('Please enter your first and last name');
      return;
    }

    setLoading(true);

    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`;
      await signUp(email, password, fullName);
      showSuccess('Account created successfully. Please verify your email.');
      navigate('/auth/verify-email', { replace: true });
    } catch (err: any) {
      console.error('Sign up error:', err);
      
      const message = err.message?.toLowerCase() || '';
      
      if (message.includes('user already registered')) {
        setError('An account with this email already exists. Try signing in instead.');
      } else if (message.includes('password')) {
        setError('Password must be at least 6 characters long');
      } else {
        setError('Unable to create account. Please try again.');
      }
      
      // Also show toast for network errors
      if (message.includes('fetch') || message.includes('network')) {
        handleError(err, 'Sign Up', () => handleSubmit(e));
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
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center space-x-3 mb-8 group">
            <div className="p-3 bg-primary rounded-xl shadow-sm group-hover:scale-105 transition-transform">
              <TrendingUp className="w-7 h-7 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-primary">
              YieldPulse
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-3">
            Create Your Account
          </h1>
          <p className="text-neutral-600 text-lg">
            Start analyzing UAE property investments today
          </p>
        </div>

        {/* Sign Up Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-neutral-200 p-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800 leading-relaxed">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="firstName" className="block text-sm font-semibold text-neutral-700 mb-2">
                First Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-[#1e2875] focus:border-transparent focus:bg-white transition-all"
                  placeholder="John"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-semibold text-neutral-700 mb-2">
                Last Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-[#1e2875] focus:border-transparent focus:bg-white transition-all"
                  placeholder="Smith"
                  disabled={loading}
                />
              </div>
            </div>

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
                  minLength={6}
                  className="w-full pl-12 pr-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-[#1e2875] focus:border-transparent focus:bg-white transition-all"
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>
              <p className="mt-2 text-xs text-neutral-500">Minimum 6 characters</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-neutral-700 mb-2">
                Confirm Password
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
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Benefits */}
          <div className="mt-8 pt-6 border-t border-neutral-200">
            <p className="text-sm font-semibold text-neutral-700 mb-4">What you get:</p>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-[#14b8a6] flex-shrink-0 mt-0.5" />
                <span className="text-sm text-neutral-600">Save unlimited property analyses</span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-[#14b8a6] flex-shrink-0 mt-0.5" />
                <span className="text-sm text-neutral-600">Access your reports anytime</span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-[#14b8a6] flex-shrink-0 mt-0.5" />
                <span className="text-sm text-neutral-600">Compare 2-4 properties side-by-side</span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-[#14b8a6] flex-shrink-0 mt-0.5" />
                <span className="text-sm text-neutral-600">Unlock premium reports for AED 49</span>
              </li>
            </ul>
          </div>

          {/* Sign In Link */}
          <div className="mt-8 pt-6 border-t border-neutral-200 text-center">
            <p className="text-neutral-600">
              Already have an account?{' '}
              <Link to="/auth/signin" className="font-semibold text-[#1e2875] hover:text-[#2f3aad] transition-colors">
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
        </div>

        {/* Trust Badge */}
        <div className="mt-8 text-center">
          <p className="text-sm text-neutral-500">
            Join property investors across the UAE
          </p>
        </div>
      </div>
    </div>
  );
}