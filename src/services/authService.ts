
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
    try {
      console.log('Attempting to sign in user:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign-in error:', error);
        toast.error(error.message);
        return { error };
      }

      console.log('Sign-in successful');
      toast.success('Συνδεθήκατε με επιτυχία!');
      return { success: true, data };
    } catch (err) {
      console.error('Unexpected error during sign-in:', err);
      toast.error('Παρουσιάστηκε απρόσμενο σφάλμα κατά τη σύνδεση.');
      return { error: err };
    }
  },

  /**
   * Sign up with email and password
   */
  async signUp(email: string, password: string) {
    try {
      console.log('Attempting to sign up user:', email);
      // Εγγραφή χρήστη - το προφίλ θα δημιουργηθεί αυτόματα μέσω του SQL trigger
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          // Προσθέτουμε κενά δεδομένα για το userData για να αποφύγουμε προβλήματα με το search_path
          data: {
            full_name: ''
          }
        }
      });

      if (error) {
        console.error('Signup error:', error);
        toast.error(error.message);
        return { error };
      }

      // Αν η δημιουργία λογαριασμού ήταν επιτυχής
      if (data.user) {
        console.log('Signup successful, user:', data.user.id);
        toast.success('Η εγγραφή ολοκληρώθηκε με επιτυχία!');
        
        // Άμεση σύνδεση μετά την εγγραφή
        console.log("Attempting direct login after signup");
        
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
          console.log('Auto-login successful');
          toast.success('Συνδεθήκατε αυτόματα μετά την εγγραφή!');
        }
      } else {
        // Αυτό συμβαίνει αν έχει ενεργοποιηθεί η επιβεβαίωση email
        console.log('Email confirmation may be required');
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
    try {
      console.log('Attempting to sign out user');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign-out error:', error);
        toast.error(error.message);
        return { error };
      }
      
      console.log('Sign-out successful');
      toast.success('Αποσυνδεθήκατε με επιτυχία');
      return { success: true };
    } catch (err) {
      console.error('Unexpected error during sign-out:', err);
      toast.error('Παρουσιάστηκε απρόσμενο σφάλμα κατά την αποσύνδεση');
      return { error: err };
    }
  },

  /**
   * Get the current session
   */
  async getSession() {
    console.log('Getting current session');
    return await supabase.auth.getSession();
  }
};
