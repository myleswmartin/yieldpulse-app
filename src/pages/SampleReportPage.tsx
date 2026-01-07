import { Link } from 'react-router-dom';
import { TrendingUp, DollarSign, ArrowLeft, FileText, Download, Calendar, CheckCircle, Sparkles, AlertCircle, Info } from 'lucide-react';
import { formatCurrency, formatPercent, CalculationResults, PropertyInputs } from '../utils/calculations';
import { Header } from '../components/Header';
import { StatCard } from '../components/StatCard';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Line
} from 'recharts';

// Sample data showcasing a typical Dubai investment property
const sampleInputs: PropertyInputs = {
  portalSource: 'Bayut',
  listingUrl: 'https://www.bayut.com/property/details-example.html',
  areaSqft: 850,
  purchasePrice: 1200000,
  downPaymentPercent: 25,
  mortgageInterestRate: 5.5,
  mortgageTermYears: 25,
  expectedMonthlyRent: 7000,
  serviceChargeAnnual: 8500,
  annualMaintenancePercent: 1.5,
  propertyManagementFeePercent: 5,
  dldFeePercent: 4,
  agentFeePercent: 2,
  capitalGrowthPercent: 5,
  rentGrowthPercent: 3,
  vacancyRatePercent: 5,
  holdingPeriodYears: 5,
};

const sampleResults: CalculationResults = {
  // Purchase Costs
  totalPurchaseCost: 1272000,
  downPayment: 300000,
  dldTransferFee: 48000,
  agentCommission: 24000,
  mortgageAmount: 900000,
  
  // Monthly Financials
  monthlyMortgagePayment: 5573,
  monthlyCashFlow: 686,
  
  // Annual Financials
  grossAnnualRentalIncome: 84000,
  annualMortgagePayment: 66876,
  annualServiceCharge: 8500,
  annualMaintenanceCosts: 18000,
  annualPropertyManagementFee: 4200,
  totalAnnualOperatingExpenses: 30700,
  netAnnualRentalIncome: 53300,
  annualCashFlow: 8232,
  
  // Yields & Returns
  grossRentalYield: 0.07,
  netRentalYield: 0.0444,
  cashOnCashReturn: 0.0274,
  
  // 5-Year Projections
  projectedPropertyValue: 1531969,
  projectedMonthlyRent: 8113,
  totalEquityBuildup: 82456,
  totalCapitalAppreciation: 331969,
  totalCashFlowAccumulated: 43789,
  totalReturn: 458214,
  totalReturnPercent: 1.527,
  annualizedReturn: 0.088,
  
  // Break-even Analysis
  breakEvenOccupancyRate: 0.85,
  cashFlowBreakEvenRent: 6200,
  
  // 5-Year Year-by-Year Projections
  yearByYearProjections: [
    {
      year: 1,
      propertyValue: 1260000,
      monthlyRent: 7210,
      annualRent: 86520,
      mortgageBalance: 887234,
      equityBuildup: 12766,
      cashFlow: 8479,
      cumulativeCashFlow: 8479,
      cumulativeEquity: 312766,
      netWorth: 385532,
    },
    {
      year: 2,
      propertyValue: 1323000,
      monthlyRent: 7426,
      annualRent: 89116,
      mortgageBalance: 873723,
      equityBuildup: 13511,
      cashFlow: 8735,
      cumulativeCashFlow: 17214,
      cumulativeEquity: 326277,
      netWorth: 466491,
    },
    {
      year: 3,
      propertyValue: 1389150,
      monthlyRent: 7649,
      annualRent: 91789,
      mortgageBalance: 859411,
      equityBuildup: 14312,
      cashFlow: 8999,
      cumulativeCashFlow: 26213,
      cumulativeEquity: 340589,
      netWorth: 555952,
    },
    {
      year: 4,
      propertyValue: 1458608,
      monthlyRent: 7878,
      annualRent: 94543,
      mortgageBalance: 844245,
      equityBuildup: 15166,
      cashFlow: 9271,
      cumulativeCashFlow: 35484,
      cumulativeEquity: 355755,
      netWorth: 649847,
    },
    {
      year: 5,
      propertyValue: 1531969,
      monthlyRent: 8113,
      annualRent: 97440,
      mortgageBalance: 828169,
      equityBuildup: 16076,
      cashFlow: 9552,
      cumulativeCashFlow: 45036,
      cumulativeEquity: 371831,
      netWorth: 749836,
    },
  ],
};

export default function SampleReportPage() {
  const currentDate = new Date().toLocaleDateString('en-GB', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  });

  // Calculate sensitivity metrics
  const sensitivityFactors = [
    { 
      factor: 'Monthly Rent', 
      impact: 8400, 
      description: '±10% change',
      ranking: 1
    },
    { 
      factor: 'Interest Rate', 
      impact: 7234, 
      description: '±1% change',
      ranking: 2
    },
    { 
      factor: 'Purchase Price', 
      impact: 6000, 
      description: '±10% change',
      ranking: 3
    }
  ];

  // Prepare chart data
  const waterfallData = [
    { name: 'Rental Income', value: sampleResults.grossAnnualRentalIncome, fill: '#14b8a6' },
    { name: 'Mortgage Payment', value: -sampleResults.annualMortgagePayment, fill: '#ef4444' },
    { name: 'Operating Costs', value: -sampleResults.totalAnnualOperatingExpenses, fill: '#f59e0b' },
    { name: 'Net Cash Flow', value: sampleResults.annualCashFlow, fill: sampleResults.annualCashFlow >= 0 ? '#10b981' : '#dc2626' }
  ];

  const yieldComparisonData = [
    { name: 'Gross Yield', value: sampleResults.grossRentalYield * 100 },
    { name: 'Net Yield', value: sampleResults.netRentalYield * 100 },
    { name: 'Cash on Cash', value: sampleResults.cashOnCashReturn * 100 }
  ];

  const costBreakdownData = [
    { name: 'Service Charge', value: sampleResults.annualServiceCharge, fill: '#1e2875' },
    { name: 'Maintenance', value: sampleResults.annualMaintenanceCosts, fill: '#14b8a6' },
    { name: 'Property Management', value: sampleResults.annualPropertyManagementFee, fill: '#6366f1' },
    { name: 'Mortgage', value: sampleResults.annualMortgagePayment, fill: '#f59e0b' }
  ];

  // Determine investment grade
  const getInvestmentGrade = () => {
    const netYield = sampleResults.netRentalYield * 100;
    const cashOnCash = sampleResults.cashOnCashReturn * 100;
    
    if (netYield >= 5 && cashOnCash >= 4) {
      return { grade: 'A', label: 'Excellent', color: 'text-emerald-600', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200' };
    } else if (netYield >= 4 && cashOnCash >= 3) {
      return { grade: 'B', label: 'Good', color: 'text-teal-600', bgColor: 'bg-teal-50', borderColor: 'border-teal-200' };
    } else if (netYield >= 3 && cashOnCash >= 2) {
      return { grade: 'C', label: 'Fair', color: 'text-amber-600', bgColor: 'bg-amber-50', borderColor: 'border-amber-200' };
    } else {
      return { grade: 'D', label: 'Below Average', color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' };
    }
  };

  const investmentGrade = getInvestmentGrade();

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Demo Banner */}
        <div className="mb-8 p-6 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border border-primary/20 rounded-2xl">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary rounded-xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-neutral-900 mb-2 flex items-center gap-2">
                Sample Premium Report
                <span className="px-2 py-1 bg-primary text-white text-xs rounded-full">DEMO</span>
              </h3>
              <p className="text-neutral-700 text-sm leading-relaxed mb-4">
                This is a complete example of what you'll receive when you unlock a premium report for AED 49. 
                All charts, tables, and projections shown below are unlocked and fully accessible in the paid version.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link 
                  to="/calculator"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors text-sm font-medium"
                >
                  <span>Try Calculator</span>
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </Link>
                <Link 
                  to="/pricing"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors text-sm font-medium"
                >
                  <span>View Pricing</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Link 
              to="/"
              className="inline-flex items-center space-x-2 text-neutral-600 hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
            <div className="flex items-center gap-2 text-sm text-neutral-500">
              <Calendar className="w-4 h-4" />
              <span>Generated: {currentDate}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-neutral-900 mb-2">Investment Analysis Report</h1>
              <p className="text-neutral-600">Sample Property - Dubai Marina Apartment</p>
            </div>
          </div>
        </div>

        {/* Investment Grade Badge */}
        <div className={`inline-flex items-center gap-3 px-6 py-4 ${investmentGrade.bgColor} ${investmentGrade.borderColor} border-2 rounded-2xl mb-8`}>
          <div className={`text-4xl font-bold ${investmentGrade.color}`}>
            {investmentGrade.grade}
          </div>
          <div>
            <div className={`font-semibold ${investmentGrade.color}`}>{investmentGrade.label} Investment</div>
            <div className="text-sm text-neutral-600">Based on net yield and cash-on-cash return</div>
          </div>
        </div>

        {/* Executive Summary */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary" />
            Executive Summary
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Gross Yield"
              value={formatPercent(sampleResults.grossRentalYield)}
              subtitle="Annual rental income vs. purchase price"
              icon={TrendingUp}
              trend="neutral"
            />
            <StatCard
              title="Net Yield"
              value={formatPercent(sampleResults.netRentalYield)}
              subtitle="After all operating expenses"
              icon={DollarSign}
              trend={sampleResults.netRentalYield >= 0.04 ? 'up' : 'down'}
            />
            <StatCard
              title="Cash-on-Cash Return"
              value={formatPercent(sampleResults.cashOnCashReturn)}
              subtitle="Annual return on cash invested"
              icon={DollarSign}
              trend={sampleResults.cashOnCashReturn >= 0.03 ? 'up' : 'down'}
            />
            <StatCard
              title="Monthly Cash Flow"
              value={formatCurrency(sampleResults.monthlyCashFlow)}
              subtitle="Net income after all costs"
              icon={DollarSign}
              trend={sampleResults.monthlyCashFlow >= 0 ? 'up' : 'down'}
            />
          </div>
        </section>

        {/* PREMIUM CONTENT - Financial Overview */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
              <FileText className="w-6 h-6 text-primary" />
              Detailed Financial Analysis
            </h2>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              Premium Unlocked
            </span>
          </div>

          {/* Purchase Breakdown */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-8 mb-6">
            <h3 className="text-xl font-semibold text-neutral-900 mb-6">Purchase Cost Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
              <div className="flex justify-between items-center py-3 border-b border-neutral-100">
                <span className="text-neutral-600">Purchase Price</span>
                <span className="font-semibold text-neutral-900">{formatCurrency(sampleInputs.purchasePrice)}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-neutral-100">
                <span className="text-neutral-600">Down Payment ({sampleInputs.downPaymentPercent}%)</span>
                <span className="font-semibold text-neutral-900">{formatCurrency(sampleResults.downPayment)}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-neutral-100">
                <span className="text-neutral-600">DLD Transfer Fee (4%)</span>
                <span className="font-semibold text-neutral-900">{formatCurrency(sampleResults.dldTransferFee)}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-neutral-100">
                <span className="text-neutral-600">Agent Commission (2%)</span>
                <span className="font-semibold text-neutral-900">{formatCurrency(sampleResults.agentCommission)}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-neutral-100">
                <span className="text-neutral-600">Mortgage Amount</span>
                <span className="font-semibold text-neutral-900">{formatCurrency(sampleResults.mortgageAmount)}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-neutral-100">
                <span className="text-neutral-600 font-semibold">Total Cash Required</span>
                <span className="font-bold text-primary text-lg">{formatCurrency(sampleResults.downPayment + sampleResults.dldTransferFee + sampleResults.agentCommission)}</span>
              </div>
            </div>
          </div>

          {/* Annual Operating Costs */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-8">
            <h3 className="text-xl font-semibold text-neutral-900 mb-6">Annual Operating Costs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
              <div className="flex justify-between items-center py-3 border-b border-neutral-100">
                <span className="text-neutral-600">Service Charge</span>
                <span className="font-semibold text-neutral-900">{formatCurrency(sampleResults.annualServiceCharge)}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-neutral-100">
                <span className="text-neutral-600">Maintenance ({sampleInputs.annualMaintenancePercent}%)</span>
                <span className="font-semibold text-neutral-900">{formatCurrency(sampleResults.annualMaintenanceCosts)}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-neutral-100">
                <span className="text-neutral-600">Property Management ({sampleInputs.propertyManagementFeePercent}%)</span>
                <span className="font-semibold text-neutral-900">{formatCurrency(sampleResults.annualPropertyManagementFee)}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-neutral-100">
                <span className="text-neutral-600">Mortgage Payments</span>
                <span className="font-semibold text-neutral-900">{formatCurrency(sampleResults.annualMortgagePayment)}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-neutral-600 font-semibold">Total Annual Costs</span>
                <span className="font-bold text-red-600 text-lg">
                  {formatCurrency(sampleResults.totalAnnualOperatingExpenses + sampleResults.annualMortgagePayment)}
                </span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-neutral-600 font-semibold">Net Annual Cash Flow</span>
                <span className={`font-bold text-lg ${sampleResults.annualCashFlow >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {formatCurrency(sampleResults.annualCashFlow)}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* PREMIUM CONTENT - Charts */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Visual Analysis</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Cash Flow Waterfall */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-6">
              <h3 className="font-semibold text-neutral-900 mb-4">Annual Cash Flow Breakdown</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={waterfallData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e5e5', borderRadius: '8px' }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {waterfallData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Yield Comparison */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-6">
              <h3 className="font-semibold text-neutral-900 mb-4">Return Metrics Comparison</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={yieldComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} label={{ value: '%', position: 'insideLeft' }} />
                  <Tooltip 
                    formatter={(value: number) => `${value.toFixed(2)}%`}
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e5e5', borderRadius: '8px' }}
                  />
                  <Bar dataKey="value" fill="#14b8a6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Cost Breakdown Pie Chart */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-6">
            <h3 className="font-semibold text-neutral-900 mb-4">Annual Cost Distribution</h3>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={costBreakdownData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {costBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e5e5', borderRadius: '8px' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* PREMIUM CONTENT - 5 Year Projections */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">5-Year Investment Projections</h2>
          
          <div className="bg-white border border-neutral-200 rounded-2xl p-8 mb-6">
            <h3 className="text-xl font-semibold text-neutral-900 mb-6">Projected Returns Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/20">
                <div className="text-sm text-neutral-600 mb-2">Property Value (Year 5)</div>
                <div className="text-2xl font-bold text-primary">{formatCurrency(sampleResults.projectedPropertyValue)}</div>
                <div className="text-xs text-emerald-600 mt-1">+{formatPercent((sampleResults.projectedPropertyValue - sampleInputs.purchasePrice) / sampleInputs.purchasePrice)} growth</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-secondary/5 to-secondary/10 rounded-xl border border-secondary/20">
                <div className="text-sm text-neutral-600 mb-2">Total Cash Flow</div>
                <div className="text-2xl font-bold text-secondary">{formatCurrency(sampleResults.totalCashFlowAccumulated)}</div>
                <div className="text-xs text-neutral-600 mt-1">Over 5 years</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200">
                <div className="text-sm text-neutral-600 mb-2">Total Return</div>
                <div className="text-2xl font-bold text-emerald-700">{formatCurrency(sampleResults.totalReturn)}</div>
                <div className="text-xs text-emerald-600 mt-1">{formatPercent(sampleResults.totalReturnPercent)} ROI</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl border border-teal-200">
                <div className="text-sm text-neutral-600 mb-2">Annualized Return</div>
                <div className="text-2xl font-bold text-teal-700">{formatPercent(sampleResults.annualizedReturn)}</div>
                <div className="text-xs text-neutral-600 mt-1">Per year average</div>
              </div>
            </div>
          </div>

          {/* Year by Year Table */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-8 overflow-x-auto">
            <h3 className="text-xl font-semibold text-neutral-900 mb-6">Year-by-Year Breakdown</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-3 px-4 font-semibold text-neutral-700">Year</th>
                  <th className="text-right py-3 px-4 font-semibold text-neutral-700">Property Value</th>
                  <th className="text-right py-3 px-4 font-semibold text-neutral-700">Monthly Rent</th>
                  <th className="text-right py-3 px-4 font-semibold text-neutral-700">Annual Cash Flow</th>
                  <th className="text-right py-3 px-4 font-semibold text-neutral-700">Equity Buildup</th>
                  <th className="text-right py-3 px-4 font-semibold text-neutral-700">Total Net Worth</th>
                </tr>
              </thead>
              <tbody>
                {sampleResults.yearByYearProjections.map((projection) => (
                  <tr key={projection.year} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                    <td className="py-4 px-4 font-medium text-neutral-900">{projection.year}</td>
                    <td className="py-4 px-4 text-right text-neutral-900">{formatCurrency(projection.propertyValue)}</td>
                    <td className="py-4 px-4 text-right text-neutral-900">{formatCurrency(projection.monthlyRent)}</td>
                    <td className="py-4 px-4 text-right text-emerald-600 font-medium">{formatCurrency(projection.cashFlow)}</td>
                    <td className="py-4 px-4 text-right text-teal-600 font-medium">{formatCurrency(projection.equityBuildup)}</td>
                    <td className="py-4 px-4 text-right text-primary font-semibold">{formatCurrency(projection.netWorth)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* PREMIUM CONTENT - Sensitivity Analysis */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Risk & Sensitivity Analysis</h2>
          
          <div className="bg-white border border-neutral-200 rounded-2xl p-8 mb-6">
            <h3 className="text-xl font-semibold text-neutral-900 mb-4">Key Risk Factors</h3>
            <p className="text-neutral-600 mb-6">
              Understanding which variables have the greatest impact on your returns helps you focus on the most important factors to manage and monitor.
            </p>
            <div className="space-y-4">
              {sensitivityFactors.map((factor, index) => (
                <div key={index} className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-semibold text-sm">
                        {factor.ranking}
                      </span>
                      <div>
                        <div className="font-semibold text-neutral-900">{factor.factor}</div>
                        <div className="text-sm text-neutral-600">{factor.description}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary">{formatCurrency(factor.impact)}</div>
                      <div className="text-xs text-neutral-600">Annual impact</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Break-even Analysis */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-8">
            <h3 className="text-xl font-semibold text-neutral-900 mb-4">Break-even Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border border-amber-200">
                <div className="text-sm text-neutral-700 mb-2">Break-even Occupancy Rate</div>
                <div className="text-3xl font-bold text-amber-700 mb-1">
                  {formatPercent(sampleResults.breakEvenOccupancyRate)}
                </div>
                <div className="text-sm text-neutral-600">
                  Minimum occupancy needed to cover all expenses
                </div>
              </div>
              <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                <div className="text-sm text-neutral-700 mb-2">Break-even Monthly Rent</div>
                <div className="text-3xl font-bold text-orange-700 mb-1">
                  {formatCurrency(sampleResults.cashFlowBreakEvenRent)}
                </div>
                <div className="text-sm text-neutral-600">
                  Minimum rent required for positive cash flow
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-2xl p-8 md:p-12">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Analyze Your Investment?</h2>
              <p className="text-lg text-white/90 mb-8">
                Get your own comprehensive report like this for just AED 49. Enter your property details, 
                and receive an instant professional analysis with all the charts, projections, and insights shown above.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link 
                  to="/calculator"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary rounded-xl font-semibold hover:bg-neutral-50 transition-all shadow-lg"
                >
                  <span>Start Your Analysis</span>
                  <ArrowLeft className="w-5 h-5 rotate-180" />
                </Link>
                <Link 
                  to="/how-it-works"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white border-2 border-white/30 rounded-xl font-semibold hover:bg-white/20 transition-all"
                >
                  <span>Learn More</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-neutral-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-neutral-600 leading-relaxed">
              <strong className="text-neutral-900">Important Disclaimer:</strong> This is a sample report for demonstration purposes only. 
              The calculations, projections, and metrics shown are based on hypothetical data and should not be used for actual investment decisions. 
              All premium reports are generated using your actual property data and current market conditions. 
              Not financial advice - consult a licensed financial advisor before making investment decisions.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
