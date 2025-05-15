
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';
import { toast } from 'sonner';

// Define the Tables type properly
type Tables = Database['public']['Tables'];

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Tables['profiles']['Row'] | null;
  isLoading: boolean;
  error: Error | null;
}

interface AuthContextValue extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error?: any; success?: boolean }>;
  signUp: (email: string, password: string) => Promise<{ error?: any; success?: boolean }>;
  signOut: () => Promise<{ error?: any; success?: boolean }>;
  refreshProfile: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    // Set up the auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setState(prev => ({ ...prev, session, user: session?.user || null }));
        
        // Fetch profile on auth change with setTimeout to avoid deadlock
        if (session?.user) {
          setTimeout(() => {
            fetchProfile(session.user.id);
          }, 0);
        } else {
          setState(prev => ({ ...prev, profile: null }));
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        setState(prev => ({ ...prev, error: error as Error, isLoading: false }));
        return;
      }
      
      setState(prev => ({ 
        ...prev, 
        session: data.session,
        user: data.session?.user || null,
        isLoading: !!data.session // Keep loading true if we need to fetch profile
      }));
      
      // Fetch profile if user exists
      if (data.session?.user) {
        fetchProfile(data.session.user.id);
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      setState(prev => ({ 
        ...prev, 
        profile: data,
        isLoading: false
      }));
    } catch (error) {
      console.error('Error fetching profile:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const refreshProfile = async () => {
    if (!state.user?.id) return;
    
    setState(prev => ({ ...prev, isLoading: true }));
    await fetchProfile(state.user.id);
  };

  const signIn = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      toast.success('Επιτυχής σύνδεση');
      return { success: true };
    } catch (error: any) {
      console.error('Σφάλμα σύνδεσης:', error);
      toast.error('Αποτυχία σύνδεσης', {
        description: error.message || 'Ελέγξτε τα στοιχεία σας και προσπαθήστε ξανά'
      });
      
      setState(prev => ({ ...prev, isLoading: false }));
      return { error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });
      
      if (error) throw error;
      
      toast.success('Επιτυχής εγγραφή');
      return { success: true };
    } catch (error: any) {
      console.error('Σφάλμα εγγραφής:', error);
      toast.error('Αποτυχία εγγραφής', {
        description: error.message || 'Δοκιμάστε με διαφορετικό email'
      });
      
      setState(prev => ({ ...prev, isLoading: false }));
      return { error };
    }
  };

  const signOut = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      setState({
        user: null,
        profile: null,
        session: null,
        isLoading: false,
        error: null
      });
      
      toast.success('Αποσυνδεθήκατε επιτυχώς');
      return { success: true };
    } catch (error: any) {
      console.error('Σφάλμα αποσύνδεσης:', error);
      toast.error('Αποτυχία αποσύνδεσης');
      
      setState(prev => ({ ...prev, isLoading: false }));
      return { error };
    }
  };

  const value: AuthContextValue = {
    ...state,
    signIn,
    signUp,
    signOut,
    refreshProfile,
    isAuthenticated: !!state.user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useSupabaseAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider');
  }
  
  return context;
};
