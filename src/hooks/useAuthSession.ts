
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/auth';
import { errorCollector } from '@/utils/error-handling/collector';
import { useErrorReporting } from './useErrorReporting';
import type { Session } from '@supabase/supabase-js';

/**
 * Hook for managing Supabase authentication session with proper cleanup
 */
export function useAuthSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { reportError } = useErrorReporting();
  
  // Get current session and user
  const refreshSession = useCallback(async () => {
    try {
      setLoading(true);
      
      const { data: { session: currentSession }, error: sessionError } = 
        await supabase.auth.getSession();
      
      if (sessionError) throw sessionError;
      
      setSession(currentSession as Session);
      
      if (currentSession) {
        // Get user details if we have a session
        const { data: { user: currentUser }, error: userError } = 
          await supabase.auth.getUser();
        
        if (userError) throw userError;
        
        setUser(currentUser as User);
      } else {
        setUser(null);
      }
    } catch (error) {
      reportError(error as Error, {
        component: 'useAuthSession',
        source: 'refreshSession'
      });
      
      // Reset authentication state on error
      setUser(null);
      setSession(null);
    } finally {
      setLoading(false);
    }
  }, [reportError]);
  
  // Setup auth state listener
  useEffect(() => {
    setLoading(true);
    
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Auth state changed:', event);
        setSession(currentSession as Session | null);
        setUser(currentSession?.user as User | null);
        setLoading(false);
      }
    );
    
    // Then check current session
    refreshSession();
    
    // Cleanup listener on unmount
    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, [refreshSession]);
  
  // Handle sign out
  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      // Auth state change listener will update state
    } catch (error) {
      reportError(error as Error, {
        component: 'useAuthSession',
        source: 'signOut'
      });
    } finally {
      setLoading(false);
    }
  }, [reportError]);
  
  return {
    session,
    user,
    loading,
    signOut,
    refreshSession
  };
}
