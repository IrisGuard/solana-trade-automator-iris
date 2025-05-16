
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  email: string;
  username: string;
  role: string;
  avatar?: string;
  isVerified: boolean;
}

const mockProfile: UserProfile = {
  id: 'user123',
  email: 'demo@example.com',
  username: 'traderuser',
  role: 'premium',
  avatar: 'https://github.com/shadcn.png',
  isVerified: true
};

export function useUser() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchUserProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(r => setTimeout(r, 800));
      
      // For demo, use mock data
      setUser(mockProfile);
    } catch (err: any) {
      console.error('Error fetching user profile:', err);
      setError(err.message || 'Failed to load user profile');
      toast.error('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  }, []);
  
  const updateUserProfile = useCallback(async (updates: Partial<UserProfile>) => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(r => setTimeout(r, 800));
      
      setUser(prev => {
        if (!prev) return null;
        return { ...prev, ...updates };
      });
      
      toast.success('Profile updated successfully');
      return true;
    } catch (err: any) {
      console.error('Error updating profile:', err);
      toast.error('Failed to update profile');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);
  
  return {
    user,
    loading,
    error,
    fetchUserProfile,
    updateUserProfile
  };
}
