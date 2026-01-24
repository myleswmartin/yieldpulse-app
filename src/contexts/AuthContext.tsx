import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
  useRef,
} from "react";
import { supabase } from "../utils/supabaseClient";
import { saveAnalysis } from "../utils/apiClient";
import { projectId } from "../../utils/supabase/info";

interface User {
  id: string;
  email: string;
  fullName?: string;
  isAdmin?: boolean;
  emailVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  sessionExpired: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
  ) => Promise<void>;
  signOut: () => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  clearSessionExpired: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

// Add display name for better debugging
AuthContext.displayName = "AuthContext";

const withTimeout = <T,>(
  promise: Promise<T>,
  ms: number,
  label: string,
): Promise<T> => {
  let timer: number | undefined;
  const timeout = new Promise<T>((_, reject) => {
    timer = window.setTimeout(
      () =>
        reject(new Error(`${label} timed out after ${ms}ms`)),
      ms,
    );
  });
  return Promise.race([promise, timeout]).finally(() => {
    if (timer) window.clearTimeout(timer);
  });
};

// Make context HMR-safe by preventing hot reload issues
if (import.meta.hot) {
  import.meta.hot.accept(() => {
    console.log("🔄 AuthContext hot reloaded");
  });
}

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);

  const pendingSyncRef = useRef(false);
  const accountConfirmedSentRef = useRef(false);

  const markAccountConfirmedSent = (userId: string) => {
    accountConfirmedSentRef.current = true;
    try {
      localStorage.setItem(`account-confirmed-sent:${userId}`, "true");
    } catch {
      // ignore storage errors
    }
  };

  const wasAccountConfirmedSent = (userId: string | undefined | null) => {
    if (!userId) return false;
    if (accountConfirmedSentRef.current) return true;
    try {
      return localStorage.getItem(`account-confirmed-sent:${userId}`) === "true";
    } catch {
      return false;
    }
  };

  const sendAccountConfirmedEmail = async (userId: string) => {
    if (!userId || wasAccountConfirmedSent(userId)) return;

    const { data: { session } } = await supabase.auth.getSession();
    const accessToken = session?.access_token;
    if (!accessToken) return;

    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-ef294769/auth/account-confirmed`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (response.ok) {
      markAccountConfirmedSent(userId);
    }
  };

  const syncPendingAnalyses = async () => {
    if (pendingSyncRef.current) return;
    pendingSyncRef.current = true;
    try {
      const key = "yieldpulse-pending-analyses";
      const raw = localStorage.getItem(key);
      if (!raw) return;
      const list = JSON.parse(raw);
      if (!Array.isArray(list) || list.length === 0) {
        localStorage.removeItem(key);
        return;
      }

      const remaining = [];
      for (const item of list) {
        if (!item?.inputs || !item?.results) continue;
        const { error } = await saveAnalysis({
          inputs: item.inputs,
          results: item.results,
        });
        if (error) {
          remaining.push(item);
        }
      }

      if (remaining.length > 0) {
        localStorage.setItem(key, JSON.stringify(remaining));
      } else {
        localStorage.removeItem(key);
      }
    } catch (err) {
      console.warn("Failed to sync pending analyses:", err);
    } finally {
      pendingSyncRef.current = false;
    }
  };

  const fetchUserProfile = async (
    userId: string,
    email: string,
    emailConfirmed: boolean,
  ) => {
    try {
      // Add timeout to prevent hanging on RLS issues
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        8000,
      ); // 8 second timeout

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .abortSignal(controller.signal)
        .single();

      clearTimeout(timeoutId);

      if (error) {
        console.warn(
          "Profile fetch error (using fallback):",
          error.message,
        );
        // If profile doesn't exist, create basic user object from auth
        setUser({
          id: userId,
          email: email,
          fullName: email.split("@")[0],
          emailVerified: emailConfirmed,
        });
        return;
      }

      setUser({
        id: profile.id,
        email: profile.email,
        fullName: profile.full_name,
        isAdmin: profile.is_admin,
        emailVerified: emailConfirmed,
      });
    } catch (error: any) {
      console.warn(
        "Error in fetchUserProfile (using fallback):",
        error.message,
      );
      // Fallback to basic user info
      setUser({
        id: userId,
        email: email,
        emailVerified: emailConfirmed,
      });
    }
  };

  const initializeAuth = async () => {
    try {
      const result = await withTimeout(
        supabase.auth.getSession(),
        8000,
        "auth.getSession",
      );
      const session = result.data?.session;

      if (result.error) {
        console.warn("Session error:", result.error.message);
        setUser(null);
        return;
      }

      if (session?.user) {
        const emailConfirmed =
          session.user.email_confirmed_at !== null;

        // IMPORTANT: set basic user immediately (unblocks UI)
        setUser({
          id: session.user.id,
          email: session.user.email || "",
          emailVerified: emailConfirmed,
        });

        if (emailConfirmed) {
          void sendAccountConfirmedEmail(session.user.id);
        }

        void syncPendingAnalyses();

        // Fetch profile in background (never await here)
        fetchUserProfile(
          session.user.id,
          session.user.email || "",
          emailConfirmed,
        ).catch((err) =>
          console.warn("Profile fetch failed:", err?.message),
        );
      } else {
        setUser(null);
      }
    } catch (error: any) {
      console.warn(
        "Auth initialization error:",
        error?.message,
      );
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event);

      if (event === "SIGNED_IN" && session?.user) {
        const emailConfirmed =
          session.user.email_confirmed_at !== null;

        // Set basic user immediately
        setUser({
          id: session.user.id,
          email: session.user.email || "",
          emailVerified: emailConfirmed,
        });

        if (emailConfirmed) {
          void sendAccountConfirmedEmail(session.user.id);
        }

        void syncPendingAnalyses();

        setSessionExpired(false);

        // Background profile fetch
        fetchUserProfile(
          session.user.id,
          session.user.email || "",
          emailConfirmed,
        ).catch((err) =>
          console.warn("Profile fetch failed:", err?.message),
        );
      }

      if (event === "TOKEN_REFRESHED" && session?.user) {
        console.log("✅ Token refreshed successfully, updating user state");
        const emailConfirmed =
          session.user.email_confirmed_at !== null;

        // Preserve admin flag while we refresh profile in background
        setUser((prev) => ({
          id: session.user.id,
          email: session.user.email || "",
          fullName: prev?.fullName,
          isAdmin: prev?.isAdmin,
          emailVerified: emailConfirmed,
        }));

        if (emailConfirmed) {
          void sendAccountConfirmedEmail(session.user.id);
        }

        fetchUserProfile(
          session.user.id,
          session.user.email || "",
          emailConfirmed,
        ).catch((err) =>
          console.warn("Profile fetch failed:", err?.message),
        );

        setSessionExpired(false);
      }

      if (event === "SIGNED_OUT") {
        console.log("🚪 User signed out");
        setUser(null);
        setSessionExpired(true);
        accountConfirmedSentRef.current = false;
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log("🔐 Starting sign in process...");
      console.log("📧 Email:", email);

      // Direct auth call without complex timeout wrapper
      console.log("🌐 Sending authentication request...");
      const { data, error } = await withTimeout(
        supabase.auth.signInWithPassword({ email, password }),
        10000,
        "auth.signInWithPassword",
      );

      console.log("📨 Authentication response received");

      if (error) {
        console.error("❌ Sign in error:", error);
        throw new Error(error.message || "Failed to sign in");
      }

      if (!data || !data.session) {
        console.error("❌ No session data returned");
        throw new Error("Sign in failed - no session created");
      }

      console.log("✅ Sign in successful, session created");

      if (data.session?.user) {
        const emailConfirmed =
          data.session.user.email_confirmed_at !== null;

        // Set user immediately with basic info to unblock UI
        setUser({
          id: data.session.user.id,
          email: data.session.user.email || "",
          emailVerified: emailConfirmed,
        });

        console.log(
          "✅ User state updated, fetching profile in background...",
        );

        // Fetch profile in background - don't block sign in on this
        fetchUserProfile(
          data.session.user.id,
          data.session.user.email || "",
          emailConfirmed,
        )
          .then(() =>
            console.log("✅ Profile loaded successfully"),
          )
          .catch((err) =>
            console.warn(
              "⚠️ Profile fetch failed (user still authenticated):",
              err.message,
            ),
          );

        // Clear pending verification email from localStorage
        try {
          localStorage.removeItem("pendingVerificationEmail");
        } catch (e) {
          // Ignore localStorage errors
        }
      }
    } catch (error: any) {
      // Re-throw authentication errors
      if (
        error.message?.includes("Invalid login credentials") ||
        error.message?.includes("Email not confirmed") ||
        error.message?.includes("Failed to sign in")
      ) {
        throw error;
      }
      // For other errors, throw a generic message
      console.error("❌ Unexpected sign in error:", error);
      throw new Error("Unable to sign in. Please try again.");
    }
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
  ) => {
    // Use backend to create user and send custom verification email
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-ef294769/auth/signup`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, fullName }),
      },
    );

    if (!response.ok) {
      const { error } = await response.json().catch(() => ({ error: "Failed to sign up" }));
      throw new Error(error || "Failed to sign up");
    }

    // Store email in localStorage for resend functionality (before verification)
    try {
      localStorage.setItem("pendingVerificationEmail", email);
    } catch (e) {
      console.warn("Could not store email in localStorage:", e);
    }

    // User must verify email before login
  };

  const signOut = async () => {
    try {
      // Clear user state immediately
      setUser(null);

      // Attempt to sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Sign out error:", error);
        // Don't throw - user state is already cleared
      }
    } catch (error) {
      console.error("Error in signOut:", error);
      // User state already cleared above
    }
  };

  const resendVerificationEmail = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      throw new Error("No session. Please sign in first.");
    }

    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-ef294769/auth/send-verification`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
      },
    );

    if (!response.ok) {
      const { error } = await response.json().catch(() => ({ error: "Failed to resend verification email" }));
      throw new Error(error || "Failed to resend verification email");
    }
  };

  const resetPassword = async (email: string) => {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-ef294769/auth/password-reset`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      },
    );

    if (!response.ok) {
      const { error } = await response.json().catch(() => ({ error: "Failed to send password reset email" }));
      throw new Error(error || "Failed to send password reset email");
    }
  };

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      console.error("Update password error:", error);
      throw new Error(
        error.message || "Failed to update password",
      );
    }
  };

  const clearSessionExpired = () => {
    setSessionExpired(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        sessionExpired,
        signIn,
        signUp,
        signOut,
        resendVerificationEmail,
        resetPassword,
        updatePassword,
        clearSessionExpired,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // During HMR (Hot Module Reload) in development, React might re-render components
    // before the AuthProvider is fully initialized. Log a warning but don't crash the app.
    console.warn(
      "⚠️ Auth context not available (likely HMR reload):",
      new Error("useAuth must be used within an AuthProvider")
    );
    // Return a safe default object to prevent crashes during development HMR
    return {
      user: null,
      loading: false,
      sessionExpired: false,
      signIn: async () => {},
      signUp: async () => {},
      signOut: async () => {},
      resendVerificationEmail: async () => {},
      resetPassword: async () => {},
      updatePassword: async () => {},
      clearSessionExpired: () => {},
    };
  }
  return context;
}
