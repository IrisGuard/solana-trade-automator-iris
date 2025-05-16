
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a SupabaseAuthProvider');
  }
  return context;
}

interface SupabaseAuthProviderProps {
  children: ReactNode;
}

export function SupabaseAuthProvider({ children }: SupabaseAuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check for stored user data (placeholder)
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('sb-user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Σφάλμα ελέγχου αυθεντικοποίησης:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  const signIn = async (email: string, password: string) => {
    try {
      // This is a placeholder for actual Supabase authentication
      const mockUser = { id: 'mock-user-id', email };
      setUser(mockUser);
      localStorage.setItem('sb-user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Σφάλμα σύνδεσης:', error);
      throw error;
    }
  };
  
  const signOut = async () => {
    try {
      setUser(null);
      localStorage.removeItem('sb-user');
    } catch (error) {
      console.error('Σφάλμα αποσύνδεσης:', error);
      throw error;
    }
  };
  
  const value = {
    user,
    isLoading,
    signIn,
    signOut,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
