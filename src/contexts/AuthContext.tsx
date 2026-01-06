import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../utils/supabaseClient";

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
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  clearSessionExpired: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
AuthContext.displayName = "AuthContext";

/** Real timeout wrapper (your AbortController approach did nothing for getSession). */
function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  let timer: number | undefined;

  const timeout = new Promise<T>((_, reject) => {
    timer = window.setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
  });

  return Promise.race([promise, timeout]).finally(() => {
    if (timer) window.clearTimeout(timer);
  });
}

function safeLocalStorageGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeLocalStorageRemove(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);

  const mountedRef = useRef(true);

  const safeSetUser = (u: User | null) => {
    if (!mountedRef.current) return;
    setUser(u);
  };

  const safeSetLoading = (v: boolean) => {
    if (!mountedRef.current) return;
    setLoading(v);
  };

  const buildBasicUser = (userId: string, email: string, emailConfirmed: boolean): User => ({
    id: userId,
    email,
    emailVerified: emailConfirmed,
  });

  const fetchUserProfile = async (userId: string, email: string, emailConfirmed: boolean) => {
    // Never let profile fetch block the app.
    // If RLS blocks or table missing, we still keep the user logged in with basic info.
    try {
      // If this query hangs due to network, timeout and fallback.
      const result = await withTimeout(
        supabase.from("profiles").select("*").eq("id", userId).single(),
        8000,
        "profiles.select"
      );

      const profile = (result as any).data;
      const error = (result as any).error;

      if (error || !profile) {
        console.warn("Profile fetch failed; using fallback:", error?.message);
        safeSetUser({
          ...buildBasicUser(userId, email, emailConfirmed),
          fullName: email?.split("@")[0] || undefined,
        });
        return;
      }

      safeSetUser({
        id: profile.id,
        email: profile.email ?? email,
        fullName: profile.full_name ?? undefined,
        isAdmin: !!profile.is_admin,
        emailVerified: emailConfirmed,
      });
    } catch (err: any) {
      console.warn("Profile fetch timeout/error; using fallback:", err?.message);
      safeSetUser({
        ...buildBasicUser(userId, email, emailConfirmed),
        fullName: email?.split("@")[0] || undefined,
      });
    }
  };

  const applySession = async (session: any | null) => {
    if (!session?.user) {
      safeSetUser(null);
      return;
    }

    const email = session.user.email || "";
    const emailConfirmed = session.user.email_confirmed_at != null;

    // Set basic user immediately so UI can move on.
    safeSetUser(buildBasicUser(session.user.id, email, emailConfirmed));

    // Fetch profile in background (non-blocking).
    void fetchUserProfile(session.user.id, email, emailConfirmed);
  };

  const initializeAuth = async () => {
    safeSetLoading(true);

    try {
      // Real timeout. If this hangs, we still release loading and let user sign in.
      const { data, error } = await withTimeout(supabase.auth.getSession(), 8000, "auth.getSession");

      if (error) {
        console.warn("getSession error:", error.message);
        safeSetUser(null);
        return;
      }

      await applySession(data?.session ?? null);
    } catch (err: any) {
      console.warn("Auth init failed (continuing without session):", err?.message);
      safeSetUser(null);
    } finally {
      safeSetLoading(false);
    }
  };

  useEffect(() => {
    mountedRef.current = true;

    void initializeAuth();

    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      // IMPORTANT: never block auth state updates on profile fetch.
      console.log("Auth state changed:", event, {
        userId: session?.user?.id,
        email: session?.user?.email,
      });

      try {
        if (event === "SIGNED_OUT") {
          safeSetUser(null);
          setSessionExpired(false);
          return;
        }

        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "USER_UPDATED") {
          await applySession(session);
          setSessionExpired(false);
          return;
        }

        // PASSWORD_RECOVERY etc. can be ignored here.
      } finally {
        // If auth init was stuck for some reason, this guarantees we stop showing loading.
        safeSetLoading(false);
      }
    });

    return () => {
      mountedRef.current = false;
      data.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log("AuthContext: signIn start", { email });

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error("AuthContext: signIn error:", error);
      throw new Error(error.message || "Failed to sign in");
    }

    if (!data?.session?.user) {
      throw new Error("Sign in failed - no session created");
    }

    const emailConfirmed = data.session.user.email_confirmed_at != null;

    // Set basic user immediately (no waiting).
    safeSetUser(buildBasicUser(data.session.user.id, data.session.user.email || "", emailConfirmed));

    // Fetch profile async.
    void fetchUserProfile(data.session.user.id, data.session.user.email || "", emailConfirmed);

    safeLocalStorageRemove("pendingVerificationEmail");
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const redirectUrl = `${window.location.origin}/auth/verify-email`;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: redirectUrl,
      },
    });

    if (error) {
      console.error("Sign up error:", error);
      throw new Error(error.message || "Failed to sign up");
    }

    if (!data.user) {
      throw new Error("Signup failed - no user returned");
    }

    // For resend
    try {
      localStorage.setItem("pendingVerificationEmail", email);
    } catch {
      // ignore
    }

    // Do NOT set user here; user must verify first (depending on your Supabase settings).
  };

  const signOut = async () => {
    // Clear UI immediately.
    safeSetUser(null);

    const { error } = await supabase.auth.signOut();
    if (error) console.error("Sign out error:", error);
  };

  const resendVerificationEmail = async () => {
    const { data } = await supabase.auth.getSession();

    let emailToUse = data.session?.user?.email || safeLocalStorageGet("pendingVerificationEmail");
    if (!emailToUse) throw new Error("No email found. Please sign up again.");

    const redirectUrl = `${window.location.origin}/auth/verify-email`;

    const { error } = await supabase.auth.resend({
      type: "signup",
      email: emailToUse,
      options: { emailRedirectTo: redirectUrl },
    });

    if (error) throw new Error(error.message || "Failed to resend verification email");
  };

  const resetPassword = async (email: string) => {
    const redirectUrl = `${window.location.origin}/auth/reset-password`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    if (error) throw new Error(error.message || "Failed to send password reset email");
  };

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw new Error(error.message || "Failed to update password");
  };

  const clearSessionExpired = () => setSessionExpired(false);

  const value = useMemo<AuthContextType>(
    () => ({
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
    }),
    [user, loading, sessionExpired]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
