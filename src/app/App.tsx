import { AuthProvider } from '../contexts/AuthContext';
import { Calculator, TrendingUp, DollarSign, Building } from 'lucide-react';

function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">YieldPulse</h1>
            </div>
            <nav className="flex space-x-4">
              <button className="text-gray-600 hover:text-gray-900 px-4 py-2">
                Calculator
              </button>
              <button className="text-gray-600 hover:text-gray-900 px-4 py-2">
                Sign In
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Get Started
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            UAE Property Investment
            <br />
            <span className="text-blue-600">ROI Calculator</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Make smarter property investment decisions in the UAE. Calculate returns, 
            analyze cash flow, and generate detailed investment reports in minutes.
          </p>
          <button className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 shadow-lg">
            Start Calculating Free
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
              <Calculator className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Comprehensive ROI Analysis
            </h3>
            <p className="text-gray-600">
              Calculate gross yield, net yield, cash-on-cash return, and 5-year projections 
              with UAE-specific formulas and fees.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Cash Flow Projections
            </h3>
            <p className="text-gray-600">
              Understand your monthly and annual cash flow with detailed breakdowns of 
              income, expenses, and mortgage payments.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
              <Building className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Detailed PDF Reports
            </h3>
            <p className="text-gray-600">
              Generate professional investment reports with sensitivity analysis and 
              all calculations documented for your records.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-20 bg-white rounded-2xl shadow-lg p-12">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h3>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Enter Property Details</h4>
              <p className="text-gray-600 text-sm">
                Add your property information and financial assumptions
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Get Instant Results</h4>
              <p className="text-gray-600 text-sm">
                View key metrics including yield, cash flow, and returns
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Unlock Full Report</h4>
              <p className="text-gray-600 text-sm">
                Get detailed analysis with projections for just 49 AED
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">4</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Save & Download</h4>
              <p className="text-gray-600 text-sm">
                Access your analyses anytime from your dashboard
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-blue-600 rounded-2xl shadow-lg p-12 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Analyze Your Investment?
          </h3>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Join property investors across the UAE who trust YieldPulse for 
            accurate ROI calculations and investment analysis.
          </p>
          <button className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 shadow-lg">
            Start Your Free Analysis
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="w-6 h-6 text-blue-400" />
                <span className="font-bold text-lg">YieldPulse</span>
              </div>
              <p className="text-gray-400 text-sm">
                Professional UAE property investment analysis and ROI calculator.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>ROI Calculator</li>
                <li>Reports</li>
                <li>Pricing</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Disclaimer</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>© 2026 YieldPulse. For informational purposes only. Not financial advice.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <HomePage />
    </AuthProvider>
  );
}
