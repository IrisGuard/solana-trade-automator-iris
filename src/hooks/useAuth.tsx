
import { useSupabaseAuth } from './useSupabaseAuth';
import { toast } from 'sonner';

export function useAuth() {
  const auth = useSupabaseAuth();

  // Εδώ μπορούμε να προσθέσουμε επιπλέον λογική ή να αναδιαμορφώσουμε τα δεδομένα
  // από την αυθεντικοποίηση του Supabase αν χρειάζεται
  
  // Καταγραφή σφαλμάτων αυθεντικοποίησης
  if (auth.error) {
    console.error("Σφάλμα αυθεντικοποίησης:", auth.error);
    toast.error("Πρόβλημα σύνδεσης", {
      description: auth.error.message
    });
  }
  
  return auth;
}
