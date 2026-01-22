import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Footer() {
  const { user } = useAuth();

  return (
    <footer className="bg-neutral-900 text-neutral-300 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-6xl mx-auto text-center">
          {/* Column 1 - Product */}
          <div>
            <h3 className="font-semibold text-white mb-4">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/calculator" className="text-sm text-slate-300 hover:text-secondary transition-colors">
                  Calculator
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-sm text-slate-300 hover:text-secondary transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/sample-premium-report" className="text-sm text-slate-300 hover:text-secondary transition-colors">
                  Sample Premium Report
                </Link>
              </li>
              {user?.isAdmin && (
                <li>
                  <Link to="/admin/dashboard" className="text-sm text-slate-300 hover:text-secondary transition-colors inline-flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" />
                    Admin Panel
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Column 2 - Resources */}
          <div>
            <h3 className="font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/premium-report-guide" className="text-sm text-slate-300 hover:text-secondary transition-colors">
                  Report Guide
                </Link>
              </li>
              <li>
                <Link to="/glossary" className="text-sm text-slate-300 hover:text-secondary transition-colors">
                  Investment Glossary
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="text-sm text-slate-300 hover:text-secondary transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-sm text-slate-300 hover:text-secondary transition-colors">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Company */}
          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-sm text-slate-300 hover:text-secondary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-slate-300 hover:text-secondary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-sm text-slate-300 hover:text-secondary transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Legal */}
          <div>
            <h3 className="font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/terms-of-service" className="text-sm text-slate-300 hover:text-secondary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-sm text-slate-300 hover:text-secondary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="text-sm text-slate-300 hover:text-secondary transition-colors">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="mt-12 pt-8 border-t border-neutral-800">
          <div className="text-center text-xs text-neutral-500 space-y-2">
            <p>
              © {new Date().getFullYear()} YieldPulse. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}