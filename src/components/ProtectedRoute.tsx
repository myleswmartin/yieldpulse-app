import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  let user = null;
  let loading = true;
  const location = useLocation();

  // Wrap useAuth in try-catch to handle HMR issues gracefully
  try {
    const auth = useAuth();
    user = auth.user;
    loading = auth.loading;
  } catch (error) {
    console.warn('⚠️ Auth context not available (likely HMR reload):', error);
    // During HMR, show loading state instead of crashing
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-border border-t-primary mb-6"></div>
          <p className="text-neutral-600">Initializing...</p>
        </div>
      </div>
    );
  }

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-border border-t-primary mb-6"></div>
          <p className="text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to sign in if not authenticated
  if (!user) {
    return <Navigate to="/auth/signin" state={{ from: location }} replace />;
  }

  // Check if email is verified - if not, redirect to verification page
  if (!user.emailVerified) {
    return <Navigate to="/auth/verify-email" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}