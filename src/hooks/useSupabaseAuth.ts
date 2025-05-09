
import { useState, useEffect } from 'react';
import { supabase, Tables } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { User, Session } from '@supabase/supabase-js';

export type UserType = {
  id: string;
  email?: string;
  created_at?: string;
  profile?: Partial<Tables['profiles']>;
};

export function useSupabaseAuth() {
  const [user, setUser] = useState<UserType | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ? {
          id: newSession.user.id,
          email: newSession.user.email,
          created_at: newSession.user.created_at
        } : null);
        setLoading(false);
        
        // Load profile data after auth state changes, but don't block the auth flow
        if (newSession?.user) {
          setTimeout(() => {
            fetchProfile(newSession.user.id);
          }, 0);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ? {
        id: currentSession.user.id,
        email: currentSession.user.email,
        created_at: currentSession.user.created_at
      } : null);
      
      // Load profile data if session exists
      if (currentSession?.user) {
        fetchProfile(currentSession.user.id);
      }
      
      setLoading(false);
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
      
      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }
      
      if (data) {
        setUser(prev => prev ? { ...prev, profile: data as Tables['profiles'] } : null);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return { error };
    }

    toast.success('Συνδεθήκατε με επιτυχία!');
    setLoading(false);
    return { success: true, data };
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return { error };
    }

    toast.success('Στάλθηκε email επιβεβαίωσης. Παρακαλώ ελέγξτε τα εισερχόμενά σας.');
    setLoading(false);
    return { success: true, data };
  };

  const signOut = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast.error(error.message);
      setLoading(false);
      return { error };
    }
    
    toast.success('Αποσυνδεθήκατε με επιτυχία');
    setLoading(false);
    return { success: true };
  };

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };
}
