
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { User, Session } from '@supabase/supabase-js';

/**
 * Handles direct Supabase authentication API calls
 */
export const authService = {
  /**
   * Sign in with email and password
   */
  async signInWithPassword(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      return { error };
    }

    toast.success('Συνδεθήκατε με επιτυχία!');
    return { success: true, data };
  },

  /**
   * Sign up with email and password
   */
  async signUp(email: string, password: string) {
    try {
      // Εγγραφή χρήστη - το προφίλ θα δημιουργηθεί αυτόματα μέσω του SQL trigger
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin
        }
      });

      if (error) {
        console.error('Signup error:', error);
        toast.error(error.message);
        return { error };
      }

      // Αν η δημιουργία λογαριασμού ήταν επιτυχής
      if (data.user) {
        toast.success('Η εγγραφή ολοκληρώθηκε με επιτυχία!');
        console.log("Attempting direct login after signup");
        
        // Άμεση σύνδεση μετά την εγγραφή
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (signInError) {
          console.error('Auto-login error:', signInError);
          toast.error('Παρακαλώ συνδεθείτε χειροκίνητα.');
          return { 
            signUpSuccess: true, 
            loginSuccess: false, 
            error: signInError 
          };
        } else {
          toast.success('Συνδεθήκατε αυτόματα μετά την εγγραφή!');
        }
      } else {
        // Αυτό συμβαίνει αν έχει ενεργοποιηθεί η επιβεβαίωση email
        toast.info('Στάλθηκε email επιβεβαίωσης. Παρακαλώ ελέγξτε τα εισερχόμενά σας.');
      }
      
      return { success: true, data };
    } catch (err) {
      console.error('Unexpected error during signup:', err);
      toast.error('Παρουσιάστηκε ένα απρόσμενο σφάλμα κατά την εγγραφή.');
      return { error: err };
    }
  },

  /**
   * Sign out the current user
   */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast.error(error.message);
      return { error };
    }
    
    toast.success('Αποσυνδεθήκατε με επιτυχία');
    return { success: true };
  },

  /**
   * Get the current session
   */
  async getSession() {
    return await supabase.auth.getSession();
  }
};
