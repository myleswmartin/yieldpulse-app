import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface StatCardProps {
  label?: string;
  title?: string; // Backwards compatibility
  value: string | number;
  icon?: LucideIcon | React.FC<{ className?: string; size?: number }>;
  description?: string;
  subtitle?: string; // Backwards compatibility
  trend?: 'positive' | 'negative' | 'neutral' | 'up' | 'down'; // Support both naming conventions
  variant?: 'default' | 'navy' | 'teal' | 'success' | 'warning';
  className?: string;
}

export function StatCard({
  label,
  title, // Backwards compatibility
  value,
  icon: Icon,
  description,
  subtitle, // Backwards compatibility
  trend,
  variant = 'default',
  className = ''
}: StatCardProps) {
  // Use title if label is not provided (backwards compatibility)
  const displayLabel = label || title;
  // Use subtitle if description is not provided (backwards compatibility)
  const displayDescription = description || subtitle;
  
  const variantStyles = {
    default: 'bg-white border border-neutral-200',
    navy: 'bg-[#1e2875]/5 border border-[#1e2875]/10',
    teal: 'bg-[#14b8a6]/5 border border-[#14b8a6]/10',
    success: 'bg-emerald-50 border border-emerald-200',
    warning: 'bg-amber-50 border border-amber-200'
  };

  const iconColorStyles = {
    default: 'text-neutral-600',
    navy: 'text-[#1e2875]',
    teal: 'text-[#14b8a6]',
    success: 'text-emerald-600',
    warning: 'text-amber-600'
  };

  const getTrendColor = () => {
    if (!trend) return '';
    // Support both 'positive'/'negative' and 'up'/'down' naming conventions
    if (trend === 'positive' || trend === 'up') return 'text-emerald-600';
    if (trend === 'negative' || trend === 'down') return 'text-red-600';
    return 'text-neutral-600';
  };

  return (
    <div className={`rounded-xl p-4 transition-all hover:shadow-md ${variantStyles[variant]} ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-medium text-neutral-600">{displayLabel}</span>
        {Icon && <Icon className={`w-4 h-4 ${iconColorStyles[variant]}`} />}
      </div>
      <p className={`text-2xl font-bold tracking-tight mb-1 ${getTrendColor() || 'text-neutral-900'}`}>
        {value}
      </p>
      {displayDescription && (
        <p className="text-xs text-neutral-500">{displayDescription}</p>
      )}
    </div>
  );
}
