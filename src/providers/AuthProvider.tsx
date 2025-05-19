
import React, { createContext, useContext, ReactNode } from 'react';
import { useAuthSession } from '@/hooks/useAuthSession';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@/types/auth';
import { toast } from 'sonner';
import { errorCollector } from '@/utils/error-handling/collector';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null; data: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, session, loading, signOut, refreshSession } = useAuthSession();
  
  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        toast.error(`Σφάλμα σύνδεσης: ${error.message}`);
        return { error };
      }
      
      toast.success('Επιτυχής σύνδεση!');
      return { error: null };
    } catch (error) {
      errorCollector.captureError(error as Error, {
        component: 'AuthProvider',
        source: 'signIn'
      });
      
      toast.error('Απρόσμενο σφάλμα κατά τη σύνδεση');
      return { error: error as Error };
    }
  };
  
  // Sign up with email and password
  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin
        }
      });
      
      if (error) {
        toast.error(`Σφάλμα εγγραφής: ${error.message}`);
        return { error, data: null };
      }
      
      toast.success('Η εγγραφή ολοκληρώθηκε! Παρακαλώ ελέγξτε το email σας για επιβεβαίωση.');
      return { error: null, data: data.user };
    } catch (error) {
      errorCollector.captureError(error as Error, {
        component: 'AuthProvider',
        source: 'signUp'
      });
      
      toast.error('Απρόσμενο σφάλμα κατά την εγγραφή');
      return { error: error as Error, data: null };
    }
  };
  
  // Reset password
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) {
        toast.error(`Σφάλμα επαναφοράς κωδικού: ${error.message}`);
        return { error };
      }
      
      toast.success('Οδηγίες επαναφοράς κωδικού έχουν σταλεί στο email σας.');
      return { error: null };
    } catch (error) {
      errorCollector.captureError(error as Error, {
        component: 'AuthProvider',
        source: 'resetPassword'
      });
      
      toast.error('Απρόσμενο σφάλμα κατά την επαναφορά του κωδικού');
      return { error: error as Error };
    }
  };
  
  // Context value
  const authContextValue: AuthContextType = {
    user,
    session,
    loading,
    initialized: !loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    refreshSession
  };
  
  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
