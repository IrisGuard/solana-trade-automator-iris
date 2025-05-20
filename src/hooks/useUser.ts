
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/gotrue-js';
import { toast } from 'sonner';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
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
          setUser(user);
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
      setUser(session?.user ?? null);
      
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
