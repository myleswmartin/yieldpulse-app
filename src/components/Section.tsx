import { ReactNode } from 'react';

interface SectionProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'bordered' | 'elevated';
}

export function Section({ 
  title, 
  description, 
  children, 
  className = '',
  variant = 'default'
}: SectionProps) {
  const variantStyles = {
    default: '',
    bordered: 'border-t border-neutral-200 pt-6',
    elevated: 'bg-white rounded-xl shadow-sm p-6 border border-neutral-100'
  };

  return (
    <div className={`${variantStyles[variant]} ${className}`}>
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h3 className="text-lg font-semibold text-neutral-900 mb-1">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-neutral-600">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
