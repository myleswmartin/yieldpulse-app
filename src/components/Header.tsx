import { Link, useLocation } from 'react-router-dom';
import { TrendingUp, LogIn, LogOut, LayoutDashboard, Calculator, Menu, X, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface HeaderProps {
  variant?: 'default' | 'transparent';
}

export function Header({ variant = 'default' }: HeaderProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error during sign out:', error);
      navigate('/');
    }
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const baseClasses = variant === 'transparent'
    ? 'bg-white/90 backdrop-blur-sm border-b border-border/50'
    : 'bg-white shadow-sm border-b border-border';

  const navLinkClass = (path: string) => {
    const active = isActive(path);
    return `px-4 py-2 text-sm font-medium rounded-lg transition-colors ${active
        ? 'text-primary bg-primary/10'
        : 'text-neutral-600 hover:text-primary hover:bg-muted'
      }`;
  };

  return (
    <header className={`sticky top-0 z-50 ${baseClasses}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="p-2.5 bg-gradient-to-br from-primary to-primary-hover rounded-xl shadow-sm transition-all group-hover:shadow-md">
              <TrendingUp className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold tracking-tight text-primary">
              YieldPulse
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            <Link to="/how-it-works" className={navLinkClass('/how-it-works')}>
              How It Works
            </Link>
            <Link to="/pricing" className={navLinkClass('/pricing')}>
              Pricing
            </Link>
            <Link to="/calculator" className={`flex items-center space-x-2 ${navLinkClass('/calculator')}`}>
              <Calculator className="w-4 h-4" />
              <span>Calculator</span>
            </Link>

            {user ? (
              <>
                <Link to="/dashboard" className={`flex items-center space-x-2 ${navLinkClass('/dashboard')}`}>
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>

                {/* Admin Link - Only visible to admins */}
                {user.isAdmin && (
                  <Link to="/admin/dashboard" className={`flex items-center space-x-2 ${navLinkClass('/admin')}`}>
                    <Shield className="w-4 h-4" />
                    <span>Admin</span>
                  </Link>
                )}

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-neutral-600 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/auth/signin" className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-neutral-600 hover:text-primary hover:bg-muted rounded-lg transition-colors">
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
                <Link to="/calculator" className="ml-3 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors font-medium shadow-sm">
                  Get Started
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-foreground hover:bg-muted rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-6 border-t border-border">
            <nav className="flex flex-col space-y-2">
              <Link
                to="/how-it-works"
                className={`${navLinkClass('/how-it-works')} w-full text-left`}
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                to="/pricing"
                className={`${navLinkClass('/pricing')} w-full text-left`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                to="/calculator"
                className={`${navLinkClass('/calculator')} w-full text-left flex items-center space-x-2`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Calculator className="w-4 h-4" />
                <span>Calculator</span>
              </Link>

              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className={`${navLinkClass('/dashboard')} w-full text-left flex items-center space-x-2`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>

                  {/* Admin Link - Only visible to admins */}
                  {user.isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      className={`${navLinkClass('/admin')} w-full text-left flex items-center space-x-2`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Shield className="w-4 h-4" />
                      <span>Admin</span>
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleSignOut();
                    }}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-neutral-600 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors w-full text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/auth/signin"
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-neutral-600 hover:text-primary hover:bg-muted rounded-lg transition-colors w-full"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </Link>
                  <Link
                    to="/calculator"
                    className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors font-medium shadow-sm text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}