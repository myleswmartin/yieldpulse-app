import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { supabase, apiUrl } from '../utils/supabaseClient';

interface User {
  id: string;
  email: string;
  fullName?: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        setUser(null);
        setAccessToken(null);
        return;
      }

      setAccessToken(session.access_token);
      
      // Fetch user profile
      const response = await fetch(`${apiUrl}/profile/me`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        const profile = await response.json();
        setUser({
          id: profile.id,
          email: profile.email,
          fullName: profile.full_name,
          isAdmin: profile.is_admin,
        });
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setAccessToken(session.access_token);
        await refreshUser();
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setAccessToken(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    
    if (data.session) {
      setAccessToken(data.session.access_token);
      await refreshUser();
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const response = await fetch(`${apiUrl}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, fullName }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Signup failed');
    }

    if (data.session) {
      setAccessToken(data.session.access_token);
      await supabase.auth.setSession(data.session);
      await refreshUser();
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, loading, signIn, signUp, signOut, refreshUser }}>
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