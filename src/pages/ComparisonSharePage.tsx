import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Header } from '../components/Header';
import { Calendar, Eye, Users, ArrowRight, BarChart3, TrendingUp, DollarSign } from 'lucide-react';
import { getSharedComparison } from '../utils/apiClient';
import { CalculationResults, PropertyInputs, formatCurrency, formatPercent } from '../utils/calculations';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  Legend,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';

interface SharedComparisonItem {
  propertyName?: string;
  inputs: PropertyInputs;
  results: CalculationResults;
}

interface ComparisonShareData {
  propertyName: string;
  comparisonItems: SharedComparisonItem[];
  sharedByEmail?: string;
  createdAt: string;
  viewCount: number;
}

const colors = ['#1e2875', '#14b8a6', '#f59e0b', '#6366f1'];

export default function ComparisonSharePage() {
  const { token } = useParams<{ token: string }>();
  const [share, setShare] = useState<ComparisonShareData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    const load = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await getSharedComparison(token);
        if (fetchError) {
          setError(fetchError.error || 'Failed to load shared comparison');
          return;
        }
        setShare(data as ComparisonShareData);
      } catch (err) {
        console.error('Error loading comparison share:', err);
        setError('Failed to load shared comparison');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  const comparisonData = share?.comparisonItems ?? [];

  const getBestWorst = (values: number[], higherIsBetter: boolean) => {
    const best = higherIsBetter ? Math.max(...values) : Math.min(...values);
    const worst = higherIsBetter ? Math.min(...values) : Math.max(...values);
    return { best, worst };
  };

  const chartData = useMemo(() => {
    if (!comparisonData.length) return [];
    const metrics = [
      { name: 'Gross Yield %', key: 'grossRentalYield', multiplier: 100 },
      { name: 'Net Yield %', key: 'netRentalYield', multiplier: 100 },
      { name: 'Cash on Cash %', key: 'cashOnCashReturn', multiplier: 100 },
    ];
    return metrics.map((metric) => {
      const row: any = { metric: metric.name };
      comparisonData.forEach((item, idx) => {
        const value = (item.results as any)[metric.key] * metric.multiplier;
        row[`Property ${idx + 1}`] = value;
      });
      return row;
    });
  }, [comparisonData]);

  const cashFlowData = useMemo(() => {
    if (!comparisonData.length) return [];
    const years = [1, 2, 3, 4, 5];
    return years.map((year) => {
      const row: any = { year: `Year ${year}` };
      comparisonData.forEach((item, idx) => {
        const projection = item.results.projection;
        if (projection && projection[year - 1]) {
          row[`Property ${idx + 1}`] = projection[year - 1].cashFlow;
        }
      });
      return row;
    });
  }, [comparisonData]);

  const riskData = useMemo(() => {
    if (!comparisonData.length) return [];
    const riskFactors = [
      {
        name: 'Rent Stability',
        getValue: (a: SharedComparisonItem) => {
          const rentRisk = Math.min(100, ((a.inputs.expectedMonthlyRent || 0) / (a.inputs.purchasePrice || 1)) * 1000);
          return 100 - rentRisk;
        },
      },
      {
        name: 'Cash Flow',
        getValue: (a: SharedComparisonItem) => {
          const cf = a.results.monthlyCashFlow;
          return cf >= 1000 ? 100 : cf >= 0 ? 70 : Math.max(0, 50 + cf / 100);
        },
      },
      {
        name: 'Leverage',
        getValue: (a: SharedComparisonItem) => {
          const ltv = (a.results.loanAmount / (a.inputs.purchasePrice || 1)) * 100;
          return Math.max(0, 100 - ltv);
        },
      },
      {
        name: 'Yield Quality',
        getValue: (a: SharedComparisonItem) => Math.min(100, a.results.netRentalYield * 1000),
      },
    ];
    return riskFactors.map((factor) => {
      const row: any = { factor: factor.name };
      comparisonData.forEach((item, idx) => {
        row[`Property ${idx + 1}`] = Math.round(factor.getValue(item));
      });
      return row;
    });
  }, [comparisonData]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-600">Loading comparison...</p>
          </div>
        </div>
      );
    }

    if (error || !share) {
      return (
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-3">Comparison Not Found</h1>
            <p className="text-neutral-600 mb-6">{error || 'This comparison link is invalid or expired.'}</p>
            <Link
              to="/calculator"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary-hover transition-all"
            >
              <ArrowRight className="w-4 h-4" />
              <span>Build a New Comparison</span>
            </Link>
          </div>
        </div>
      );
    }

    return (
      <>
        <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">{share.propertyName}</h1>
          <p className="text-sm text-white/90 mb-4">Shared comparison generated with YieldPulse</p>
          <div className="flex flex-wrap gap-6 text-xs uppercase tracking-widest text-white/80">
            {share.sharedByEmail && (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Shared by {share.sharedByEmail}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(share.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>
                {share.viewCount} {share.viewCount === 1 ? 'view' : 'views'}
              </span>
            </div>
          </div>
        </div>

        {/* Key cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {comparisonData.map((item, idx) => (
            <div key={idx} className="rounded-2xl border border-border bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[idx % colors.length] }}></div>
                <p className="text-sm font-semibold text-foreground">{item.propertyName || `Property ${idx + 1}`}</p>
              </div>
              <p className="text-xs text-neutral-500 mb-1">Price</p>
              <p className="text-lg font-bold text-foreground mb-2">{formatCurrency(item.inputs.purchasePrice || 0)}</p>
              <div className="flex items-center justify-between text-xs text-neutral-600">
                <span>Rent</span>
                <span className="font-semibold text-primary">{formatCurrency(item.inputs.expectedMonthlyRent || 0)}/mo</span>
              </div>
              <div className="flex items-center justify_between text-xs text-neutral-600">
                <span>Net Yield</span>
                <span className="font-semibold text-primary">{formatPercent(item.results.netRentalYield)}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-neutral-600">
                <span>Cash Flow</span>
                <span className="font-semibold text-primary">{formatCurrency(item.results.monthlyCashFlow)}/mo</span>
              </div>
            </div>
          ))}
        </div>

        {/* Metrics table */}
        <div className="bg-white rounded-2xl border border-border p-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Headline Metrics</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-neutral-50">
                  <th className="text-left py-3 px-4 font-semibold text-neutral-700">Metric</th>
                  {comparisonData.map((item, idx) => (
                    <th key={idx} className="text-right py-3 px-4 font-semibold text-neutral-700">
                      {item.propertyName || `Property ${idx + 1}`}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  { label: 'Net Yield', extractor: (a: SharedComparisonItem) => a.results.netRentalYield, fmt: formatPercent, higher: true },
                  { label: 'Monthly Cash Flow', extractor: (a: SharedComparisonItem) => a.results.monthlyCashFlow, fmt: formatCurrency, higher: true },
                  { label: 'Initial Investment', extractor: (a: SharedComparisonItem) => a.results.totalInitialInvestment, fmt: formatCurrency, higher: false },
                  { label: 'Year 5 ROI %', extractor: (a: SharedComparisonItem) => a.results.projection?.[4]?.roiPercent ?? 0, fmt: formatPercent, higher: true },
                ].map((row) => {
                  const values = comparisonData.map(row.extractor);
                  const { best, worst } = getBestWorst(values, row.higher);
                  return (
                    <tr key={row.label}>
                      <td className="py-3 px-4 font-medium text-neutral-800">{row.label}</td>
                      {comparisonData.map((_, idx) => {
                        const value = values[idx];
                        const isBest = value === best;
                        const isWorst = value === worst && comparisonData.length > 2;
                        return (
                          <td
                            key={idx}
                            className="py-3 px-4 text-right font-medium"
                            style={{ color: isBest ? '#10b981' : isWorst ? '#ef4444' : '#334155' }}
                          >
                            {row.fmt(value)}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-border p-8">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" /> Yield & Return Comparison
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="metric" />
                <YAxis />
                <ReTooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
                <Legend />
                {comparisonData.map((item, idx) => (
                  <Bar
                    key={idx}
                    dataKey={`Property ${idx + 1}`}
                    fill={colors[idx % colors.length]}
                    name={item.propertyName || `Property ${idx + 1}`}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl border border-border p-8">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-teal" /> 5-Year Cash Flow Trajectory
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <ReTooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                {comparisonData.map((item, idx) => (
                  <Line
                    key={idx}
                    type="monotone"
                    dataKey={`Property ${idx + 1}`}
                    stroke={colors[idx % colors.length]}
                    strokeWidth={2}
                    name={item.propertyName || `Property ${idx + 1}`}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk radar */}
        <div className="bg-white rounded-2xl border border-border p-8">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-warning" /> Risk Profile
          </h3>
          <ResponsiveContainer width="100%" height={360}>
            <RadarChart data={riskData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="factor" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <ReTooltip />
              <Legend />
              {comparisonData.map((item, idx) => (
                <Radar
                  key={idx}
                  name={item.propertyName || `Property ${idx + 1}`}
                  dataKey={`Property ${idx + 1}`}
                  stroke={colors[idx % colors.length]}
                  fill={colors[idx % colors.length]}
                  fillOpacity={0.3}
                />
              ))}
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* CTA */}
        <div className="bg-white rounded-2xl border border-border p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">View the Full Comparison</h2>
          <p className="text-neutral-600 mb-4">
            Sign in to interact with the comparison dashboard, download PDFs, and save these reports.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/auth/signin"
              className="px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary-hover transition-all"
            >
              Sign In
            </Link>
            <Link
              to="/auth/signup"
              className="px-6 py-3 bg-white border-2 border-primary text-primary rounded-full font-medium hover:bg-primary/10 transition-all"
            >
              Sign Up for Free
            </Link>
            <Link
              to="/calculator"
              className="px-6 py-3 bg-muted text-foreground rounded-full font-medium hover:bg-neutral-200 transition-all"
            >
              Open Calculator
            </Link>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {renderContent()}
      </div>
    </div>
  );
}
