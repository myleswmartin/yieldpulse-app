import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Info, X, Wifi, WifiOff } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'network-error';

interface ToastProps {
  type: ToastType;
  message: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  onDismiss: () => void;
  autoDismiss?: boolean;
  duration?: number;
}

export function Toast({ 
  type, 
  message, 
  description, 
  action, 
  onDismiss, 
  autoDismiss = true,
  duration = 8000 
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoDismiss && type !== 'error' && type !== 'network-error') {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onDismiss, 300); // Allow exit animation
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoDismiss, duration, onDismiss, type]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 300);
  };

  const config = {
    success: {
      bg: 'bg-white',
      border: 'border-success',
      text: 'text-success',
      icon: CheckCircle,
    },
    error: {
      bg: 'bg-white',
      border: 'border-destructive',
      text: 'text-destructive',
      icon: XCircle,
    },
    info: {
      bg: 'bg-white',
      border: 'border-primary',
      text: 'text-primary',
      icon: Info,
    },
    'network-error': {
      bg: 'bg-white',
      border: 'border-warning',
      text: 'text-warning',
      icon: WifiOff,
    },
  };

  const safeConfig = config[type] ?? config.info;
  const { bg, border, text, icon: Icon } = safeConfig;

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-md w-full transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0'
      }`}
    >
      <div className={`${bg} border ${border} rounded-xl shadow-lg p-4 flex items-start justify-between`}>
        <div className="flex items-start space-x-3 flex-1">
          <Icon className={`w-5 h-5 ${text} flex-shrink-0 mt-0.5`} />
          <div className="flex-1 min-w-0">
            <p className={`font-medium ${text} mb-1`}>{message}</p>
            {description && (
              <p className="text-sm text-neutral-700 leading-relaxed">{description}</p>
            )}
            {action && (
              <button
                onClick={action.onClick}
                className={`mt-3 text-sm font-medium ${text} hover:underline`}
              >
                {action.label}
              </button>
            )}
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className={`${text} hover:opacity-70 transition-opacity flex-shrink-0 ml-2`}
          aria-label="Dismiss"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

// Toast container for managing multiple toasts
interface ToastMessage extends Omit<ToastProps, 'onDismiss'> {
  id: string;
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handler = ((event: CustomEvent) => {
      const toast: Omit<ToastMessage, 'id'> = event.detail;
      const id = Date.now().toString();
      setToasts(prev => [...prev, { ...toast, id }]);
    }) as EventListener;

    window.addEventListener('show-toast', handler);
    return () => window.removeEventListener('show-toast', handler);
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <>
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{ top: `${1 + index * 6}rem` }}
          className="fixed right-4 z-50"
        >
          <Toast {...toast} onDismiss={() => removeToast(toast.id)} />
        </div>
      ))}
    </>
  );
}

// Helper function to show toasts
export function showToast(toast: Omit<ToastMessage, 'id'>) {
  window.dispatchEvent(new CustomEvent('show-toast', { detail: toast }));
}
