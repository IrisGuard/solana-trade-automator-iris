
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

interface User {
  id: string;
  email?: string;
  created_at?: string;
  user_metadata?: any;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('[Auth] Error getting session:', error);
          setError(error.message);
        } else {
          setSession(session);
          if (session?.user) {
            setUser({
              id: session.user.id,
              email: session.user.email,
              created_at: session.user.created_at,
              user_metadata: session.user.user_metadata
            });
          }
        }
      } catch (err) {
        console.error('[Auth] Exception getting session:', err);
        setError('Σφάλμα κατά την ανάκτηση της συνεδρίας');
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[Auth] Auth state changed:', event);
        
        setSession(session);
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            created_at: session.user.created_at,
            user_metadata: session.user.user_metadata
          });
        } else {
          setUser(null);
        }
        setLoading(false);
        setError(null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        setError(error.message);
        toast.error('Αποτυχία σύνδεσης: ' + error.message);
        throw error;
      }
      
      toast.success('Επιτυχής σύνδεση!');
    } catch (err) {
      console.error('[Auth] Sign in error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });
      
      if (error) {
        setError(error.message);
        toast.error('Αποτυχία εγγραφής: ' + error.message);
        throw error;
      }
      
      toast.success('Επιτυχής εγγραφή! Ελέγξτε το email σας για επιβεβαίωση.');
    } catch (err) {
      console.error('[Auth] Sign up error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        setError(error.message);
        toast.error('Αποτυχία αποσύνδεσης: ' + error.message);
        throw error;
      }
      
      toast.success('Επιτυχής αποσύνδεση!');
    } catch (err) {
      console.error('[Auth] Sign out error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) {
        setError(error.message);
        toast.error('Αποτυχία επαναφοράς κωδικού: ' + error.message);
        throw error;
      }
      
      toast.success('Email επαναφοράς κωδικού στάλθηκε!');
    } catch (err) {
      console.error('[Auth] Reset password error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      error,
      signIn,
      signUp,
      signOut,
      resetPassword
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
