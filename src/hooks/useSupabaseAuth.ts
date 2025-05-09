
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export type UserType = {
  id: string;
  email?: string;
  created_at?: string;
};

export function useSupabaseAuth() {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error checking session:', error);
        setLoading(false);
        return;
      }
      
      if (session) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          created_at: session.user.created_at
        });
      }
      
      setLoading(false);
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            created_at: session.user.created_at
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return { error };
    }

    toast.success('Logged in successfully');
    setLoading(false);
    return { success: true };
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return { error };
    }

    toast.success('Verification email sent. Please check your inbox.');
    setLoading(false);
    return { success: true };
  };

  const signOut = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast.error(error.message);
      setLoading(false);
      return { error };
    }
    
    toast.success('Logged out successfully');
    setLoading(false);
    return { success: true };
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };
}
