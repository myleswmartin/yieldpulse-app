import { AuthProvider } from '../contexts/AuthContext';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import HomePage from '../pages/HomePage';
import CalculatorPage from '../pages/CalculatorPage';
import ResultsPage from '../pages/ResultsPage';
import SignInPage from '../pages/SignInPage';
import SignUpPage from '../pages/SignUpPage';
import VerifyEmailPage from '../pages/VerifyEmailPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import DashboardPage from '../pages/DashboardPage';
import ComparisonPage from '../pages/ComparisonPage';
import HowItWorksPage from '../pages/HowItWorksPage';
import PricingPage from '../pages/PricingPage';
import ReportsPage from '../pages/ReportsPage';
import PrivacyPolicyPage from '../pages/PrivacyPolicyPage';
import TermsOfServicePage from '../pages/TermsOfServicePage';
import DisclaimerPage from '../pages/DisclaimerPage';
import ProtectedRoute from '../components/ProtectedRoute';
import { ToastContainer } from '../components/Toast';
import { EnvironmentIndicator } from '../components/EnvironmentIndicator';
import { trackPageView } from '../utils/analytics';

// Route to page name mapping for analytics
const ROUTE_PAGE_NAMES: Record<string, string> = {
  '/': 'Home',
  '/calculator': 'Calculator',
  '/results': 'Results',
  '/dashboard': 'Dashboard',
  '/comparison': 'Comparison',
  '/how-it-works': 'How It Works',
  '/pricing': 'Pricing',
  '/reports': 'Reports',
  '/privacy-policy': 'Privacy Policy',
  '/terms-of-service': 'Terms of Service',
  '/disclaimer': 'Disclaimer',
  '/auth/signin': 'Sign In',
  '/auth/signup': 'Sign Up',
  '/auth/verify-email': 'Verify Email',
  '/auth/forgot-password': 'Forgot Password',
  '/auth/reset-password': 'Reset Password',
};

// Analytics tracker component
function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    const pageName = ROUTE_PAGE_NAMES[location.pathname] || 'Unknown';
    trackPageView(pageName);
  }, [location.pathname]);

  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AnalyticsTracker />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/calculator" element={<CalculatorPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/auth/signin" element={<SignInPage />} />
          <Route path="/auth/signup" element={<SignUpPage />} />
          <Route path="/auth/verify-email" element={<VerifyEmailPage />} />
          <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          <Route path="/disclaimer" element={<DisclaimerPage />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/comparison" 
            element={
              <ProtectedRoute>
                <ComparisonPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
        <ToastContainer />
        <EnvironmentIndicator />
      </Router>
    </AuthProvider>
  );
}