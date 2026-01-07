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
import SampleReportPage from '../pages/SampleReportPage';
import PaymentSuccessPage from '../pages/PaymentSuccessPage';
import ProtectedRoute from '../components/ProtectedRoute';
import { ToastContainer } from '../components/Toast';
import { EnvironmentIndicator } from '../components/EnvironmentIndicator';
import { trackPageView } from '../utils/analytics';

// Admin components
import AdminRoute from '../components/AdminRoute';
import AdminLayout from '../components/admin/AdminLayout';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminPurchases from '../pages/admin/AdminPurchases';
import AdminSupport from '../pages/admin/AdminSupport';
import AdminWebhooks from '../pages/admin/AdminWebhooks';
import AdminAuditLog from '../pages/admin/AdminAuditLog';
import AdminSettings from '../pages/admin/AdminSettings';
import AdminSetupPage from '../pages/admin/AdminSetupPage';

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
  '/sample-report': 'Sample Report',
  '/privacy-policy': 'Privacy Policy',
  '/terms-of-service': 'Terms of Service',
  '/disclaimer': 'Disclaimer',
  '/payment-success': 'Payment Success',
  '/auth/signin': 'Sign In',
  '/auth/signup': 'Sign Up',
  '/auth/verify-email': 'Verify Email',
  '/auth/forgot-password': 'Forgot Password',
  '/auth/reset-password': 'Reset Password',
  '/admin/dashboard': 'Admin Dashboard',
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

// Separate the routes into a component to ensure AuthProvider wraps everything
function AppRoutes() {
  return (
    <>
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
        <Route path="/sample-report" element={<SampleReportPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms-of-service" element={<TermsOfServicePage />} />
        <Route path="/disclaimer" element={<DisclaimerPage />} />
        <Route path="/payment-success" element={<PaymentSuccessPage />} />
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
        
        {/* Admin Routes - Nested under AdminLayout */}
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="purchases" element={<AdminPurchases />} />
          <Route path="support" element={<AdminSupport />} />
          <Route path="webhooks" element={<AdminWebhooks />} />
          <Route path="audit-log" element={<AdminAuditLog />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
        
        <Route 
          path="/admin/setup" 
          element={<AdminSetupPage />} 
        />
      </Routes>
      <ToastContainer />
      <EnvironmentIndicator />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}