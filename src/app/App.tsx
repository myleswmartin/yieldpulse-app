import { AuthProvider } from '../contexts/AuthContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import CalculatorPage from '../pages/CalculatorPage';
import ResultsPage from '../pages/ResultsPage';
import SignInPage from '../pages/SignInPage';
import SignUpPage from '../pages/SignUpPage';
import DashboardPage from '../pages/DashboardPage';
import HowItWorksPage from '../pages/HowItWorksPage';
import PricingPage from '../pages/PricingPage';
import ReportsPage from '../pages/ReportsPage';
import PrivacyPolicyPage from '../pages/PrivacyPolicyPage';
import TermsOfServicePage from '../pages/TermsOfServicePage';
import DisclaimerPage from '../pages/DisclaimerPage';
import ProtectedRoute from '../components/ProtectedRoute';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/calculator" element={<CalculatorPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/auth/signin" element={<SignInPage />} />
          <Route path="/auth/signup" element={<SignUpPage />} />
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
        </Routes>
      </Router>
    </AuthProvider>
  );
}