import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { supabase } from '../utils/supabaseClient';

interface User {
  id: string;
  email: string;
  fullName?: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (userId: string, email: string) => {
    try {
      // Try to fetch profile from database
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        // If profile doesn't exist, create basic user object from auth
        setUser({
          id: userId,
          email: email,
          fullName: email.split('@')[0], // Fallback to email username
        });
        return;
      }

      setUser({
        id: profile.id,
        email: profile.email,
        fullName: profile.full_name,
        isAdmin: profile.is_admin,
      });
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      // Fallback to basic user info
      setUser({
        id: userId,
        email: email,
      });
    }
  };

  const initializeAuth = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session error:', error);
        setUser(null);
        setLoading(false);
        return;
      }

      if (session?.user) {
        await fetchUserProfile(session.user.id, session.user.email || '');
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_IN' && session?.user) {
        await fetchUserProfile(session.user.id, session.user.email || '');
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        await fetchUserProfile(session.user.id, session.user.email || '');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Sign in error:', error);
      throw new Error(error.message || 'Failed to sign in');
    }
    
    if (data.session?.user) {
      await fetchUserProfile(data.session.user.id, data.session.user.email || '');
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    // Sign up with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: undefined, // No email confirmation for MVP
      },
    });

    if (error) {
      console.error('Sign up error:', error);
      throw new Error(error.message || 'Failed to sign up');
    }

    if (!data.user) {
      throw new Error('Signup failed - no user returned');
    }

    // Create profile in database
    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email: email,
          full_name: fullName,
          is_admin: false,
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        // Don't throw - profile might already exist or will be created by trigger
      }
    } catch (profileErr) {
      console.error('Error creating profile:', profileErr);
      // Continue anyway - user is authenticated
    }

    // If session exists (auto-confirmed), set user
    if (data.session?.user) {
      await fetchUserProfile(data.session.user.id, data.session.user.email || '');
    }
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

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
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