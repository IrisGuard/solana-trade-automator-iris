
import { useState, useEffect } from 'react';

export function useSupabaseAuth() {
  const [user, setUser] = useState<{ id: string } | null>(null);

  useEffect(() => {
    // Mock user for now - in real implementation would use Supabase auth
    setUser({ id: 'mock-user-id' });
  }, []);

  return { user };
}
