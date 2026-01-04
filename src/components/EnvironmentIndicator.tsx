import { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';

export function EnvironmentIndicator() {
  const [isVisible, setIsVisible] = useState(false);
  const [environment, setEnvironment] = useState<'development' | 'staging' | 'production'>('production');

  useEffect(() => {
    // Detect environment
    const hostname = window.location.hostname;
    const isDev = hostname === 'localhost' || hostname === '127.0.0.1';
    const isStaging = hostname.includes('staging') || hostname.includes('test');

    if (isDev) {
      setEnvironment('development');
      setIsVisible(true);
    } else if (isStaging) {
      setEnvironment('staging');
      setIsVisible(true);
    } else {
      setEnvironment('production');
      setIsVisible(false);
    }
  }, []);

  if (!isVisible) return null;

  const config = {
    development: {
      bg: 'bg-warning/90',
      text: 'text-warning-foreground',
      label: 'Development',
    },
    staging: {
      bg: 'bg-primary/90',
      text: 'text-primary-foreground',
      label: 'Staging',
    },
    production: {
      bg: 'bg-success/90',
      text: 'text-success-foreground',
      label: 'Live',
    },
  };

  const { bg, text, label } = config[environment];

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className={`${bg} ${text} px-3 py-1.5 rounded-lg shadow-lg flex items-center space-x-2 text-xs font-medium`}>
        {environment !== 'production' && <AlertTriangle className="w-3 h-3" />}
        <span>{label} Environment</span>
      </div>
    </div>
  );
}
