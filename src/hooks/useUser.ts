
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Avoid importing specific types that might change between Supabase versions
// Instead, use a type that accurately represents the user object structure
type SupabaseUser = {
  id: string;
  email?: string;
  app_metadata: any;
  user_metadata: any;
  aud: string;
  created_at: string;
};

export function useUser() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    // Get current user on mount
    const getCurrentUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error('Error getting user:', error);
          setUser(null);
        } else {
          setUser(user as SupabaseUser);
        }
      } catch (error) {
        console.error('Unexpected error in useUser:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    getCurrentUser();
    
    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user as SupabaseUser ?? null);
      
      // Show toast on login/logout
      if (event === 'SIGNED_IN') {
        toast.success('Επιτυχής σύνδεση!');
      } else if (event === 'SIGNED_OUT') {
        toast.info('Αποσυνδεθήκατε από το λογαριασμό σας.');
      }
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  
  return { user, isLoading };
}
