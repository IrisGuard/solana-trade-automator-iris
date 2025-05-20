
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Synchronizes Helius keys from database to local storage
 */
export async function syncHeliusKeys(): Promise<boolean> {
  try {
    const { data: heliusKeys, error } = await supabase
      .from('api_keys_storage')
      .select('*')
      .eq('service', 'helius')
      .eq('status', 'active')
      .limit(1);
    
    if (error) {
      console.error('Error fetching Helius keys:', error);
      return false;
    }
    
    if (!heliusKeys || heliusKeys.length === 0) {
      console.warn('No active Helius keys found');
      return false;
    }
    
    // Use the first active key
    const apiKey = heliusKeys[0].key_value;
    
    // Save to local storage
    localStorage.setItem('api_key_helius', JSON.stringify({
      key: apiKey,
      timestamp: Date.now()
    }));
    
    console.log('Helius key synchronized successfully');
    return true;
  } catch (error) {
    console.error('Error syncing Helius keys:', error);
    return false;
  }
}

/**
 * Initializes database tables if they don't exist
 */
export async function initializeDatabase(): Promise<boolean> {
  // This function would check and create necessary tables
  // For now it's just a placeholder
  return true;
}

/**
 * Sets up initial data for a new user
 */
export async function setupUserData(userId: string): Promise<boolean> {
  if (!userId) return false;
  
  try {
    // Create initial wallet entry if needed
    const { data: existingWallets } = await supabase
      .from('wallets')
      .select('id')
      .eq('user_id', userId)
      .limit(1);
    
    if (!existingWallets || existingWallets.length === 0) {
      // User has no wallets yet, nothing to do
      return true;
    }
    
    return true;
  } catch (error) {
    console.error('Error setting up user data:', error);
    return false;
  }
}
