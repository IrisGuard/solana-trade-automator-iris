
import { useSupabaseAuth } from './useSupabaseAuth';
import { toast } from 'sonner';

export function useAuth() {
  const auth = useSupabaseAuth();

  // Here we can add additional logic or reshape data
  // from Supabase authentication if needed
  
  // Log authentication errors
  if (auth.error) {
    console.error("Authentication error:", auth.error);
    toast.error("Connection problem", {
      description: auth.error.message
    });
  }
  
  return auth;
}
