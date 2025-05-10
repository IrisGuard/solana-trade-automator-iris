
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
   * Sign up with email and password - απλοποιημένη έκδοση
   */
  async signUp(email: string, password: string) {
    try {
      console.log('Attempting to sign up user:', email);
      
      // Βασικός έλεγχος μήκους κωδικού
      if (password.length < 6) {
        toast.error('Ο κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες');
        return { error: { message: 'Ο κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες' } };
      }
      
      // Απλή εγγραφή
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
        }
      });

      if (error) {
        console.error('Signup error:', error);
        toast.error(error.message);
        return { error };
      }

      // Άμεση σύνδεση μετά την εγγραφή
      console.log('Signup successful');
      
      toast.success('Η εγγραφή ολοκληρώθηκε με επιτυχία!');
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
