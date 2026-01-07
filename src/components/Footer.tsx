import { Link } from 'react-router-dom';
import { TrendingUp, Mail, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Footer() {
  const { user } = useAuth();

  return (
    <footer className="bg-neutral-900 text-neutral-300 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4 group">
              <div className="p-2 bg-primary rounded-lg">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-white">
                YieldPulse
              </span>
            </Link>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Professional UAE property investment analysis for informed decision making.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-white mb-4">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/calculator" className="text-sm hover:text-secondary transition-colors">
                  Calculator
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-sm hover:text-secondary transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-sm hover:text-secondary transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/sample-report" className="text-sm hover:text-secondary transition-colors flex items-center gap-1">
                  Sample Report
                  <span className="px-1.5 py-0.5 bg-secondary text-white text-[10px] rounded-full font-semibold">NEW</span>
                </Link>
              </li>
              {user?.isAdmin && (
                <li>
                  <Link to="/admin/dashboard" className="text-sm hover:text-secondary transition-colors flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5" />
                    Admin Panel
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/terms-of-service" className="text-sm hover:text-secondary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-sm hover:text-secondary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="text-sm hover:text-secondary transition-colors">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contact</h3>
            <a
              href="mailto:hello@yieldpulse.com"
              className="inline-flex items-center space-x-2 text-sm hover:text-secondary transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>hello@yieldpulse.com</span>
            </a>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-neutral-500">
              © {new Date().getFullYear()} YieldPulse. All rights reserved.
            </p>
            <p className="text-xs text-neutral-500 text-center md:text-right">
              Not financial advice. For informational purposes only.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}