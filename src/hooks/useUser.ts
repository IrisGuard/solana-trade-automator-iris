
import { useState, useEffect } from 'react';

export interface User {
  id: string;
  username?: string;
  email?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
}

export function useUser(): AuthContextType {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Mock user for demo - in production this would come from Supabase auth
    setUser({ 
      id: 'demo-user-123',
      username: 'Demo User',
      email: 'demo@example.com'
    });
  }, []);

  return {
    user,
    loading
  };
}
