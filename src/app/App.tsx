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
import SamplePremiumReportPage from '../pages/SamplePremiumReportPage';
import ContactPage from '../pages/ContactPage';
import SupportPage from '../pages/SupportPage';
import AboutPage from '../pages/AboutPage';
import PaymentSuccessPage from '../pages/PaymentSuccessPage';
import ProfileSettingsPage from '../pages/ProfileSettingsPage';
import BrandIdentityPage from '../pages/BrandIdentityPage';
import PremiumReportGuidePage from '../pages/PremiumReportGuidePage';
import GlossaryPage from '../pages/GlossaryPage';
import FAQsPage from '../pages/FAQsPage';
import ProtectedRoute from '../components/ProtectedRoute';
import { ToastContainer } from '../components/Toast';
import { EnvironmentIndicator } from '../components/EnvironmentIndicator';
import { trackPageView } from '../utils/analytics';

// Admin components
import AdminRoute from '../components/AdminRoute';
import AdminLayout from '../components/admin/AdminLayout';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminAnalytics from '../pages/admin/AdminAnalytics';
import AdminReports from '../pages/admin/AdminReports';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminPurchases from '../pages/admin/AdminPurchases';
import AdminDocuments from '../pages/admin/AdminDocuments';
import AdminSupport from '../pages/admin/AdminSupport';
import AdminContactSubmissions from '../pages/admin/AdminContactSubmissions';
import AdminWebhooks from '../pages/admin/AdminWebhooks';
import AdminAuditLog from '../pages/admin/AdminAuditLog';
import AdminSettings from '../pages/admin/AdminSettings';
import AdminSetupPage from '../pages/admin/AdminSetupPage';
import AdminDiscounts from '../pages/admin/AdminDiscounts';
import SharedReportPage from '../pages/SharedReportPage';

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
  '/sample-premium-report': 'Sample Premium Report',
  '/premium-report-guide': 'Premium Report Guide',
  '/glossary': 'Investment Glossary',
  '/faqs': 'FAQs',
  '/privacy-policy': 'Privacy Policy',
  '/terms-of-service': 'Terms of Service',
  '/disclaimer': 'Disclaimer',
  '/contact': 'Contact',
  '/support': 'Support',
  '/about': 'About',
  '/payment-success': 'Payment Success',
  '/auth/signin': 'Sign In',
  '/auth/signup': 'Sign Up',
  '/auth/verify-email': 'Verify Email',
  '/auth/forgot-password': 'Forgot Password',
  '/auth/reset-password': 'Reset Password',
  '/admin/dashboard': 'Admin Dashboard',
};

// Scroll to top on route change for SPA navigation
function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname, location.search]);

  return null;
}

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
      <ScrollToTop />
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
        <Route path="/sample-premium-report" element={<SamplePremiumReportPage />} />
        <Route path="/premium-report-guide" element={<PremiumReportGuidePage />} />
        <Route path="/glossary" element={<GlossaryPage />} />
        <Route path="/faqs" element={<FAQsPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms-of-service" element={<TermsOfServicePage />} />
        <Route path="/disclaimer" element={<DisclaimerPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/about" element={<AboutPage />} />
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
        <Route 
          path="/profile-settings" 
          element={
            <ProtectedRoute>
              <ProfileSettingsPage />
            </ProtectedRoute>
          } 
        />
        <Route path="/brand-identity" element={<BrandIdentityPage />} />
        
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
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="purchases" element={<AdminPurchases />} />
          <Route path="documents" element={<AdminDocuments />} />
          <Route path="support" element={<AdminSupport />} />
          <Route path="contact-submissions" element={<AdminContactSubmissions />} />
          <Route path="webhooks" element={<AdminWebhooks />} />
          <Route path="audit-log" element={<AdminAuditLog />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="discounts" element={<AdminDiscounts />} />
        </Route>
        
        <Route 
          path="/admin/setup" 
          element={<AdminSetupPage />} 
        />
        
        {/* Shared Report - Public route with token parameter */}
        <Route 
          path="/shared/:token" 
          element={<SharedReportPage />} 
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
