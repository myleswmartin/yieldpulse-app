import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { supabase } from '../utils/supabaseClient';

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

// Add display name for better debugging
AuthContext.displayName = 'AuthContext';

// Make context HMR-safe by preventing hot reload issues
if (import.meta.hot) {
  import.meta.hot.accept(() => {
    console.log('🔄 AuthContext hot reloaded');
  });
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);

  const fetchUserProfile = async (userId: string, email: string, emailConfirmed: boolean) => {
    try {
      // Add timeout to prevent hanging on RLS issues
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .abortSignal(controller.signal)
        .single();

      clearTimeout(timeoutId);

      if (error) {
        console.warn('Profile fetch error (using fallback):', error.message);
        // If profile doesn't exist, create basic user object from auth
        setUser({
          id: userId,
          email: email,
          fullName: email.split('@')[0],
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
      console.warn('Error in fetchUserProfile (using fallback):', error.message);
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
      // Try to get session with a reasonable timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      let session = null;
      let sessionError = null;

      try {
        const result = await supabase.auth.getSession();
        clearTimeout(timeoutId);
        session = result.data?.session;
        sessionError = result.error;
      } catch (err: any) {
        clearTimeout(timeoutId);
        console.warn('Session check failed (continuing without session):', err.message);
        // Continue without session - user can still sign in
      }
      
      if (sessionError) {
        console.warn('Session error (continuing without session):', sessionError.message);
        setUser(null);
        return;
      }

      if (session?.user) {
        const emailConfirmed = session.user.email_confirmed_at !== null;
        await fetchUserProfile(session.user.id, session.user.email || '', emailConfirmed);
      } else {
        setUser(null);
      }
    } catch (error: any) {
      console.warn('Auth initialization error (app will continue):', error.message);
      setUser(null);
    } finally {
      // CRITICAL: Always set loading to false, even on errors
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_IN' && session?.user) {
        const emailConfirmed = session.user.email_confirmed_at !== null;
        await fetchUserProfile(session.user.id, session.user.email || '', emailConfirmed);
        setSessionExpired(false);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        const emailConfirmed = session.user.email_confirmed_at !== null;
        await fetchUserProfile(session.user.id, session.user.email || '', emailConfirmed);
      } else if (event === 'USER_UPDATED' && session?.user) {
        // Handle email verification completion
        const emailConfirmed = session.user.email_confirmed_at !== null;
        await fetchUserProfile(session.user.id, session.user.email || '', emailConfirmed);
      } else if (event === 'PASSWORD_RECOVERY') {
        // Password recovery link clicked - user will be redirected to reset page
        console.log('Password recovery initiated');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 Starting sign in process...');
      console.log('📧 Email:', email);
      
      // Direct auth call without complex timeout wrapper
      console.log('🌐 Sending authentication request...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      console.log('📨 Authentication response received');

      if (error) {
        console.error('❌ Sign in error:', error);
        throw new Error(error.message || 'Failed to sign in');
      }
      
      if (!data || !data.session) {
        console.error('❌ No session data returned');
        throw new Error('Sign in failed - no session created');
      }
      
      console.log('✅ Sign in successful, session created');
      
      if (data.session?.user) {
        const emailConfirmed = data.session.user.email_confirmed_at !== null;
        
        // Set user immediately with basic info to unblock UI
        setUser({
          id: data.session.user.id,
          email: data.session.user.email || '',
          emailVerified: emailConfirmed,
        });
        
        console.log('✅ User state updated, fetching profile in background...');
        
        // Fetch profile in background - don't block sign in on this
        fetchUserProfile(data.session.user.id, data.session.user.email || '', emailConfirmed)
          .then(() => console.log('✅ Profile loaded successfully'))
          .catch((err) => console.warn('⚠️ Profile fetch failed (user still authenticated):', err.message));
        
        // Clear pending verification email from localStorage
        try {
          localStorage.removeItem('pendingVerificationEmail');
        } catch (e) {
          // Ignore localStorage errors
        }
      }
    } catch (error: any) {
      // Re-throw authentication errors
      if (error.message?.includes('Invalid login credentials') || 
          error.message?.includes('Email not confirmed') ||
          error.message?.includes('Failed to sign in')) {
        throw error;
      }
      // For other errors, throw a generic message
      console.error('❌ Unexpected sign in error:', error);
      throw new Error('Unable to sign in. Please try again.');
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    // Get the current app URL for email redirect
    const redirectUrl = `${window.location.origin}/auth/verify-email`;

    // Sign up with Supabase Auth - email verification required
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: redirectUrl,
      },
    });

    if (error) {
      console.error('Sign up error:', error);
      throw new Error(error.message || 'Failed to sign up');
    }

    if (!data.user) {
      throw new Error('Signup failed - no user returned');
    }

    // Store email in localStorage for resend functionality (before verification)
    try {
      localStorage.setItem('pendingVerificationEmail', email);
    } catch (e) {
      console.warn('Could not store email in localStorage:', e);
    }

    // Profile will be created by database trigger when user verifies email
    // Do NOT manually insert into profiles table - RLS policy prevents it
    
    // User is created but not confirmed - they need to verify email
    // Do NOT set user in state - they must verify first
  };

  const signOut = async () => {
    try {
      // Clear user state immediately
      setUser(null);
      
      // Attempt to sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        // Don't throw - user state is already cleared
      }
    } catch (error) {
      console.error('Error in signOut:', error);
      // User state already cleared above
    }
  };

  const resendVerificationEmail = async () => {
    // Try to get email from session first
    const { data: { session } } = await supabase.auth.getSession();
    
    let emailToUse = session?.user?.email;
    
    // If no session (unverified user), try localStorage
    if (!emailToUse) {
      try {
        emailToUse = localStorage.getItem('pendingVerificationEmail');
      } catch (e) {
        console.warn('Could not read from localStorage:', e);
      }
    }
    
    if (!emailToUse) {
      throw new Error('No email found. Please sign up again.');
    }

    const redirectUrl = `${window.location.origin}/auth/verify-email`;
    
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: emailToUse,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });

    if (error) {
      console.error('Resend verification error:', error);
      throw new Error(error.message || 'Failed to resend verification email');
    }
  };

  const resetPassword = async (email: string) => {
    const redirectUrl = `${window.location.origin}/auth/reset-password`;
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    if (error) {
      console.error('Password reset error:', error);
      throw new Error(error.message || 'Failed to send password reset email');
    }
  };

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      console.error('Update password error:', error);
      throw new Error(error.message || 'Failed to update password');
    }
  };

  const clearSessionExpired = () => {
    setSessionExpired(false);
  };

  return (
    <AuthContext.Provider value={{ 
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
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}