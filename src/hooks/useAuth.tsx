
import { useAuth as useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

/**
 * This is now just a passthrough to the useAuth from SupabaseAuthContext
 * to maintain compatibility with existing code that might be using this hook
 */
export function useAuth() {
  return useSupabaseAuth();
}
