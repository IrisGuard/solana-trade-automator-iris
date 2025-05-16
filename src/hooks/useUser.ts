
import { useState, useEffect } from 'react';

interface User {
  id: string;
  email?: string;
  name?: string;
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // This is a placeholder to simulate loading a user
    // In a real implementation, this would check for a logged-in user
    const checkForUser = async () => {
      try {
        // Check localStorage for user data
        const storedUser = localStorage.getItem('user');
        
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error checking for user:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkForUser();
  }, []);
  
  const login = async (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };
  
  return {
    user,
    isLoading,
    login,
    logout
  };
}
