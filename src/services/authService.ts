
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const authService = {
  async signInWithPassword(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        toast.error(`Σφάλμα σύνδεσης: ${error.message}`);
        return { error };
      }
      
      toast.success('Επιτυχής σύνδεση!');
      return { user: data.user };
    } catch (error) {
      toast.error('Απρόσμενο σφάλμα κατά τη σύνδεση');
      return { error };
    }
  },
  
  async signUp(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
        }
      });
      
      if (error) {
        toast.error(`Σφάλμα εγγραφής: ${error.message}`);
        return { error };
      }
      
      toast.success('Η εγγραφή ολοκληρώθηκε! Παρακαλώ ελέγξτε το email σας για επιβεβαίωση.');
      return { user: data.user };
    } catch (error) {
      toast.error('Απρόσμενο σφάλμα κατά την εγγραφή');
      return { error };
    }
  },
  
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast.error(`Σφάλμα αποσύνδεσης: ${error.message}`);
        return { error };
      }
      
      toast.success('Αποσυνδεθήκατε επιτυχώς');
      return { success: true };
    } catch (error) {
      toast.error('Απρόσμενο σφάλμα κατά την αποσύνδεση');
      return { error };
    }
  },
  
  async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        toast.error(`Σφάλμα επαναφοράς κωδικού: ${error.message}`);
        return { error };
      }
      
      toast.success('Οδηγίες επαναφοράς κωδικού έχουν σταλεί στο email σας.');
      return { success: true };
    } catch (error) {
      toast.error('Απρόσμενο σφάλμα κατά την επαναφορά του κωδικού');
      return { error };
    }
  }
};
