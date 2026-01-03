import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  description?: string;
  trend?: 'positive' | 'negative' | 'neutral';
  variant?: 'default' | 'navy' | 'teal' | 'success' | 'warning';
  className?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  description,
  trend,
  variant = 'default',
  className = ''
}: StatCardProps) {
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
    return trend === 'positive' ? 'text-emerald-600' : trend === 'negative' ? 'text-red-600' : 'text-neutral-600';
  };

  return (
    <div className={`rounded-xl p-6 transition-all hover:shadow-md ${variantStyles[variant]} ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <span className="text-sm font-medium text-neutral-600">{label}</span>
        {Icon && <Icon className={`w-5 h-5 ${iconColorStyles[variant]}`} />}
      </div>
      <p className={`text-3xl font-bold tracking-tight mb-2 ${getTrendColor() || 'text-neutral-900'}`}>
        {value}
      </p>
      {description && (
        <p className="text-xs text-neutral-500">{description}</p>
      )}
    </div>
  );
}
