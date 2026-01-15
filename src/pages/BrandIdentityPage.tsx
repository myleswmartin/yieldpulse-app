import { useState } from 'react';
import { ArrowLeft, Home } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import InteractiveBrandGuidelines from '../components/InteractiveBrandGuidelines';

export default function BrandIdentityPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={handleBack}
              className="inline-flex items-center space-x-2 text-sm text-neutral-600 hover:text-primary transition-colors font-medium cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary rounded-lg">
                <Home className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-foreground">YieldPulse</h1>
                <p className="text-xs text-neutral-600">Brand Guidelines</p>
              </div>
            </div>

            <Link
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-all text-sm"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <InteractiveBrandGuidelines />
    </div>
  );
}
