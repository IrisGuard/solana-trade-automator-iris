
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  email?: string;
  created_at?: string;
}

interface AuthContextType {
  user: User | null;
  session: any | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Mock user for now
    setUser({ id: 'mock-user-id' });
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    // Mock implementation
    setUser({ id: 'mock-user-id', email });
  };

  const signUp = async (email: string, password: string) => {
    // Mock implementation
    setUser({ id: 'mock-user-id', email });
  };

  const signOut = async () => {
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      error,
      signIn,
      signUp,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within a SupabaseAuthProvider');
  }
  return context;
}
