import { showToast } from '../components/Toast';

export interface AppError {
  message: string;
  userMessage: string;
  isNetworkError: boolean;
  canRetry: boolean;
  requestId?: string;
}

/**
 * Determines if an error is a network-related issue
 */
export function isNetworkError(error: any): boolean {
  // Check for common network error indicators
  if (!error) return false;
  
  const errorString = error.toString().toLowerCase();
  const message = error.message?.toLowerCase() || '';
  
  return (
    errorString.includes('network') ||
    errorString.includes('fetch') ||
    errorString.includes('failed to fetch') ||
    message.includes('network') ||
    message.includes('failed to fetch') ||
    error.name === 'NetworkError' ||
    error.code === 'NETWORK_ERROR' ||
    // Supabase specific
    message.includes('fetcherror') ||
    message.includes('network request failed')
  );
}

/**
 * Parses any error into a standardized AppError format
 */
export function parseError(error: any): AppError {
  // Network errors
  if (isNetworkError(error)) {
    return {
      message: error.message || 'Network request failed',
      userMessage: 'Connection issue. Please check your internet connection and try again.',
      isNetworkError: true,
      canRetry: true,
    };
  }

  // Supabase auth errors
  if (error?.message) {
    const msg = error.message.toLowerCase();
    
    if (msg.includes('invalid login credentials') || msg.includes('invalid credentials')) {
      return {
        message: error.message,
        userMessage: 'Email or password is incorrect. Please try again.',
        isNetworkError: false,
        canRetry: true,
      };
    }
    
    if (msg.includes('email not confirmed')) {
      return {
        message: error.message,
        userMessage: 'Please verify your email address before signing in.',
        isNetworkError: false,
        canRetry: false,
      };
    }
    
    if (msg.includes('user already registered')) {
      return {
        message: error.message,
        userMessage: 'An account with this email already exists. Try signing in instead.',
        isNetworkError: false,
        canRetry: false,
      };
    }

    if (msg.includes('password')) {
      return {
        message: error.message,
        userMessage: 'Password must be at least 6 characters long.',
        isNetworkError: false,
        canRetry: true,
      };
    }
  }

  // Generic Supabase errors
  if (error?.message) {
    return {
      message: error.message,
      userMessage: 'Something went wrong. Please try again.',
      isNetworkError: false,
      canRetry: true,
    };
  }

  // Unknown errors
  return {
    message: String(error),
    userMessage: 'An unexpected error occurred. Please try again.',
    isNetworkError: false,
    canRetry: true,
  };
}

/**
 * Handles an error and shows appropriate user feedback
 */
export function handleError(error: any, context?: string, onRetry?: () => void, requestId?: string) {
  console.error(`Error${context ? ` in ${context}` : ''}${requestId ? ` [${requestId}]` : ''}:`, error);
  
  const appError = parseError(error);
  
  // Build description with requestId if available
  const description = requestId 
    ? `${appError.userMessage}\n\nRequest ID: ${requestId}`
    : appError.userMessage;
  
  if (appError.isNetworkError) {
    showToast({
      type: 'network-error',
      message: 'Connection Issue',
      description,
      action: onRetry ? {
        label: 'Retry',
        onClick: onRetry,
      } : undefined,
      autoDismiss: false,
    });
  } else {
    showToast({
      type: 'error',
      message: context || 'Error',
      description,
      action: appError.canRetry && onRetry ? {
        label: 'Try Again',
        onClick: onRetry,
      } : undefined,
      autoDismiss: false,
    });
  }
}

/**
 * Shows a success message
 */
export function showSuccess(message: string, description?: string) {
  showToast({
    type: 'success',
    message,
    description,
    autoDismiss: true,
    duration: 5000,
  });
}

/**
 * Shows an info message
 */
export function showInfo(message: string, description?: string) {
  showToast({
    type: 'info',
    message,
    description,
    autoDismiss: true,
    duration: 8000,
  });
}