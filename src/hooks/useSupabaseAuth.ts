
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { profileService } from '@/services/profileService';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/client';

export interface AuthContextType {
  user: User | null;
  profile: Tables['profiles'] | null;
  session: Session | null;
  isLoading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
}

export function useSupabaseAuth(): AuthContextType {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Tables['profiles'] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchInitialSession = async () => {
      try {
        setIsLoading(true);
        
        // Ανάκτηση του session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }
        
        if (mounted) {
          setSession(session);
          setUser(session?.user || null);
          
          // Αν υπάρχει χρήστης, φέρε το προφίλ του
          if (session?.user) {
            try {
              const userProfile = await profileService.getProfile(session.user.id);
              setProfile(userProfile);
            } catch (profileError) {
              console.error('Error fetching profile:', profileError);
              // Δεν ορίζουμε error state για σφάλματα προφίλ, καθώς ο χρήστης εξακολουθεί να έχει συνδεθεί
            }
          }
        }
      } catch (error) {
        console.error('Error getting session:', error);
        if (mounted) {
          setError(error as Error);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // Αρχική φόρτωση του session
    fetchInitialSession();

    // Εγγραφή στις αλλαγές του session
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (mounted) {
          setSession(newSession);
          setUser(newSession?.user || null);
          
          // Ανανέωση προφίλ κατά τη σύνδεση ή αλλαγή χρήστη
          if (newSession?.user) {
            try {
              const userProfile = await profileService.getProfile(newSession.user.id);
              setProfile(userProfile);
            } catch (profileError) {
              console.error('Error fetching profile:', profileError);
            }
          } else {
            setProfile(null);
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      toast.success('Έχετε αποσυνδεθεί επιτυχώς');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Σφάλμα κατά την αποσύνδεση');
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    profile,
    session,
    isLoading,
    error,
    isAuthenticated: !!user,
    signOut,
  };
}
