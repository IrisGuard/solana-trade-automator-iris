
import { dbClient } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/client';

/**
 * Handles user profile operations
 */
export const profileService = {
  /**
   * Fetch a user's profile by user ID
   */
  async getProfile(userId: string) {
    const { data, error } = await dbClient
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data as Tables['profiles'];
  },
  
  /**
   * Update a user's profile
   */
  async updateProfile(userId: string, updates: Partial<Tables['profiles']>) {
    const { data, error } = await dbClient
      .from('profiles')
      .update(updates)
      .eq('id', userId);
    
    if (error) throw error;
    return data;
  }
};
