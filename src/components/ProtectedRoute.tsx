import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { user, loading } = useAuth();

  console.log("ProtectedRoute state", { userId: user?.id, loading, path: location.pathname });

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

  if (!user) {
    return <Navigate to="/auth/signin" state={{ from: location }} replace />;
  }

  if (!user.emailVerified) {
    return <Navigate to="/auth/verify-email" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
