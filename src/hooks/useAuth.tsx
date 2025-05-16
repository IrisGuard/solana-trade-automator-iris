
import { useAuth as useSupabaseAuth } from '@/providers/SupabaseAuthProvider';

// This is now just a passthrough to the useAuth from SupabaseAuthProvider
// to maintain compatibility with existing code
export function useAuth() {
  return useSupabaseAuth();
}
