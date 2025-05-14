
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  id: string;
  username?: string;
  avatar_url?: string;
  created_at?: string;
}

export function useUser() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getUserProfile() {
      try {
        setLoading(true);
        
        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }
        
        if (!session) {
          setUser(null);
          setProfile(null);
          return;
        }
        
        // Set user from session
        setUser(session.user);
        
        // Get user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (profileError && profileError.code !== 'PGRST116') {
          // PGRST116 means no rows returned, which is expected for new users
          throw profileError;
        }
        
        setProfile(profileData || { id: session.user.id });
        setError(null);
        
      } catch (err) {
        console.error('Error loading user:', err);
        setError('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    }
    
    getUserProfile();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
        // When auth state changes, refresh profile
        if (session?.user) {
          getUserProfile();
        } else {
          setProfile(null);
        }
      }
    );
    
    // Clean up subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    profile,
    isLoading: loading,
    error,
    isAuthenticated: !!user,
    userId: user?.id
  };
}
