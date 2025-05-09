
import { dbClient } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/client';

/**
 * Handles user profile operations
 */
export const profileService = {
  /**
   * Fetch a user's profile by user ID
   */
  async fetchProfile(userId: string) {
    try {
      // Using any type assertion to bypass TypeScript errors
      const { data, error } = await (dbClient as any)
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      
      return data as Tables['profiles'];
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      return null;
    }
  },

  /**
   * Update a user's profile
   */
  async updateProfile(userId: string, updates: Partial<Tables['profiles']>) {
    try {
      const { data, error } = await dbClient
        .from('profiles')
        .update(updates)
        .eq('id', userId);
      
      if (error) {
        console.error('Error updating profile:', error);
        return { error };
      }
      
      return { success: true, data };
    } catch (error) {
      console.error('Failed to update profile:', error);
      return { error };
    }
  }
};
