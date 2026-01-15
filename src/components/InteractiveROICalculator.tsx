import { useState } from 'react';
import { Calculator, TrendingUp } from 'lucide-react';

export function InteractiveROICalculator() {
  const [investment, setInvestment] = useState(300000);
  const [annualProfit, setAnnualProfit] = useState(25000);
  const [years, setYears] = useState(5);

  const totalProfit = annualProfit * years;
  const roi = ((totalProfit / investment) * 100).toFixed(1);
  const annualizedReturn = (((totalProfit / investment) / years) * 100).toFixed(1);
  const breakEvenYears = (investment / annualProfit).toFixed(1);

  return (
    <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-6 border-2 border-primary/20 my-8 print-no-break">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Calculator className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h4 className="font-bold text-foreground">Interactive ROI Calculator</h4>
          <p className="text-sm text-neutral-600">Adjust the values to see how ROI changes</p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        {/* Initial Investment */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Initial Investment: <span className="text-primary font-semibold">AED {investment.toLocaleString()}</span>
          </label>
          <input
            type="range"
            min="100000"
            max="1000000"
            step="50000"
            value={investment}
            onChange={(e) => setInvestment(Number(e.target.value))}
            className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-xs text-neutral-500 mt-1">
            <span>AED 100K</span>
            <span>AED 1M</span>
          </div>
        </div>

        {/* Annual Profit */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Annual Profit: <span className="text-secondary font-semibold">AED {annualProfit.toLocaleString()}</span>
          </label>
          <input
            type="range"
            min="5000"
            max="100000"
            step="5000"
            value={annualProfit}
            onChange={(e) => setAnnualProfit(Number(e.target.value))}
            className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-secondary"
          />
          <div className="flex justify-between text-xs text-neutral-500 mt-1">
            <span>AED 5K</span>
            <span>AED 100K</span>
          </div>
        </div>

        {/* Years */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Time Period: <span className="text-primary font-semibold">{years} years</span>
          </label>
          <input
            type="range"
            min="1"
            max="20"
            step="1"
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-xs text-neutral-500 mt-1">
            <span>1 year</span>
            <span>20 years</span>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-white rounded-lg border border-border">
        <div className="text-center">
          <p className="text-xs text-neutral-600 mb-1">Total Profit</p>
          <p className="text-xl font-bold text-foreground">AED {totalProfit.toLocaleString()}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-neutral-600 mb-1">ROI</p>
          <p className="text-xl font-bold text-primary">{roi}%</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-neutral-600 mb-1">Annualized</p>
          <p className="text-xl font-bold text-secondary">{annualizedReturn}%</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-neutral-600 mb-1">Break-Even</p>
          <p className="text-xl font-bold text-foreground">{breakEvenYears} yrs</p>
        </div>
      </div>

      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-start space-x-2">
          <TrendingUp className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-green-800">
            <strong>Interpretation:</strong> A {roi}% ROI over {years} years means every AED 100 invested returns AED {((parseFloat(roi) / 100) * 100).toFixed(0)} profit. 
            {parseFloat(roi) >= 30 ? ' This is considered a strong return for UAE property!' : parseFloat(roi) >= 20 ? ' This is a decent return.' : ' Consider looking for better opportunities.'}
          </p>
        </div>
      </div>
    </div>
  );
}
