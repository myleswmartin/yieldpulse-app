import { Link, useLocation, useNavigate } from 'react-router-dom';
import { TrendingUp, LogIn, LogOut, LayoutDashboard, Calculator, Menu, X, Shield, FileCheck, Settings, User, BookOpen, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

interface HeaderProps {
  variant?: 'default' | 'transparent';
}

export function Header({ variant = 'default' }: HeaderProps = {}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

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
    return `px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
      active 
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
            <Link to="/sample-premium-report" className={`flex items-center space-x-2 ${navLinkClass('/sample-premium-report')} bg-gradient-to-r from-secondary/10 to-primary/10 border border-primary/20`}>
              <FileCheck className="w-4 h-4" />
              <span>Sample Report</span>
            </Link>
            <Link to="/how-it-works" className={navLinkClass('/how-it-works')}>
              How It Works
            </Link>
            <Link to="/pricing" className={navLinkClass('/pricing')}>
              Pricing
            </Link>
            
            {/* Resources Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setResourcesOpen(!resourcesOpen)}
                className={`flex items-center space-x-2 ${navLinkClass('/resources')} ${
                  isActive('/premium-report-guide') || isActive('/glossary') || isActive('/faqs') 
                    ? 'text-primary bg-primary/10' 
                    : ''
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Resources</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${resourcesOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {resourcesOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setResourcesOpen(false)}
                  ></div>
                  <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-neutral-200 py-2 z-20">
                    <Link
                      to="/premium-report-guide"
                      onClick={() => setResourcesOpen(false)}
                      className="flex items-start space-x-3 px-4 py-3 text-sm hover:bg-neutral-50 transition-colors"
                    >
                      <BookOpen className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-foreground">Premium Report Guide</p>
                        <p className="text-xs text-neutral-500">Learn to read your report</p>
                      </div>
                    </Link>
                    
                    <Link
                      to="/glossary"
                      onClick={() => setResourcesOpen(false)}
                      className="flex items-start space-x-3 px-4 py-3 text-sm hover:bg-neutral-50 transition-colors"
                    >
                      <BookOpen className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-foreground">Investment Glossary</p>
                        <p className="text-xs text-neutral-500">All terms explained</p>
                      </div>
                    </Link>
                    
                    <Link
                      to="/faqs"
                      onClick={() => setResourcesOpen(false)}
                      className="flex items-start space-x-3 px-4 py-3 text-sm hover:bg-neutral-50 transition-colors"
                    >
                      <BookOpen className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-foreground">FAQs</p>
                        <p className="text-xs text-neutral-500">Common questions</p>
                      </div>
                    </Link>
                    
                    <div className="border-t border-neutral-200 my-2"></div>
                    
                    <Link
                      to="/contact"
                      onClick={() => setResourcesOpen(false)}
                      className="flex items-start space-x-3 px-4 py-3 text-sm hover:bg-neutral-50 transition-colors"
                    >
                      <BookOpen className="w-4 h-4 text-neutral-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-foreground">Contact Support</p>
                        <p className="text-xs text-neutral-500">Get help from our team</p>
                      </div>
                    </Link>
                  </div>
                </>
              )}
            </div>
            
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
                {isAdmin && (
                  <Link to="/admin/dashboard" className={`flex items-center space-x-2 ${navLinkClass('/admin')}`}>
                    <Shield className="w-4 h-4" />
                    <span>Admin</span>
                  </Link>
                )}
                
                {/* Profile Menu */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground hover:bg-primary-hover transition-colors"
                    aria-label="Profile menu"
                  >
                    <User className="w-5 h-5" />
                  </button>
                  
                  {profileMenuOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setProfileMenuOpen(false)}
                      ></div>
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-neutral-200 py-2 z-20">
                        <div className="px-4 py-3 border-b border-neutral-200">
                          <p className="text-sm font-medium text-neutral-900">{user.email}</p>
                        </div>
                        
                        <Link
                          to="/profile-settings"
                          onClick={() => setProfileMenuOpen(false)}
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          <span>Profile & Settings</span>
                        </Link>
                        
                        <div className="border-t border-neutral-200 mt-2 pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setProfileMenuOpen(false);
                              handleSignOut();
                            }}
                            className="flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
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
              
              {/* Resources Section */}
              <div className="pt-2">
                <p className="px-4 py-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Resources</p>
                <Link 
                  to="/premium-report-guide" 
                  className={`${navLinkClass('/premium-report-guide')} w-full text-left flex items-center space-x-2`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Report Guide</span>
                </Link>
                <Link 
                  to="/glossary" 
                  className={`${navLinkClass('/glossary')} w-full text-left flex items-center space-x-2`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Glossary</span>
                </Link>
                <Link 
                  to="/faqs" 
                  className={`${navLinkClass('/faqs')} w-full text-left flex items-center space-x-2`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>FAQs</span>
                </Link>
              </div>
              
              <Link 
                to="/calculator" 
                className={`${navLinkClass('/calculator')} w-full text-left flex items-center space-x-2 pt-2`}
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
                  {isAdmin && (
                    <Link 
                      to="/admin/dashboard" 
                      className={`${navLinkClass('/admin')} w-full text-left flex items-center space-x-2`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Shield className="w-4 h-4" />
                      <span>Admin</span>
                    </Link>
                  )}
                  
                  <Link 
                    to="/profile-settings" 
                    className={`${navLinkClass('/profile-settings')} w-full text-left flex items-center space-x-2`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Settings className="w-4 h-4" />
                    <span>Profile & Settings</span>
                  </Link>
                  
                  <div className="pt-4 mt-4 border-t border-neutral-200">
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleSignOut();
                      }}
                      className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
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