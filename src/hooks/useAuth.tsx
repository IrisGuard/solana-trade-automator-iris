
import { useAuth as useProviderAuth } from '@/providers/AuthProvider';

// This is now just a passthrough to the useAuth from AuthProvider
// to maintain compatibility with existing code
export function useAuth() {
  return useProviderAuth();
}
