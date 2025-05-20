
import { useAuth as useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

// This is now just a passthrough to the useAuth from SupabaseAuthContext
// to maintain compatibility with existing code
export function useAuth() {
  return useSupabaseAuth();
}
