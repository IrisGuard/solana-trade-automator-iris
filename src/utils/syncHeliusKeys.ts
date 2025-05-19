
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Synchronizes all Helius API keys for a user between Supabase and local storage
 */
export async function syncAllHeliusData(userId: string): Promise<boolean> {
  if (!userId) {
    console.error('Cannot sync Helius data: No user ID provided');
    return false;
  }
  
  try {
    console.log(`Syncing Helius API keys for user ${userId}`);
    
    // Fetch all active Helius keys from Supabase
    const { data: heliusKeys, error } = await supabase
      .from('api_keys_storage')
      .select('*')
      .eq('service', 'helius')
      .eq('status', 'active')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error fetching Helius keys:', error);
      return false;
    }
    
    if (!heliusKeys || heliusKeys.length === 0) {
      console.warn('No Helius keys found for user');
      return false;
    }
    
    // Store the first active key in local storage for quick access
    const firstActiveKey = heliusKeys[0];
    localStorage.setItem(`api_key_helius`, JSON.stringify({
      key: firstActiveKey.key_value,
      timestamp: Date.now()
    }));
    
    console.log(`Synchronized ${heliusKeys.length} Helius keys`);
    
    // Reset the Helius service to use the new key
    const { heliusService } = await import('@/services/helius/HeliusService');
    heliusService.reinitialize();
    
    return true;
  } catch (error) {
    console.error('Error syncing Helius keys:', error);
    toast.error('Σφάλμα συγχρονισμού κλειδιών API', {
      description: 'Παρακαλώ δοκιμάστε ξανά αργότερα'
    });
    return false;
  }
}

/**
 * Tests all Helius API keys for a user and updates their status in Supabase
 */
export async function testAllHeliusKeys(userId: string): Promise<number> {
  if (!userId) {
    console.error('Cannot test Helius keys: No user ID provided');
    return 0;
  }
  
  try {
    console.log(`Testing Helius API keys for user ${userId}`);
    
    // Fetch all Helius keys from Supabase
    const { data: heliusKeys, error } = await supabase
      .from('api_keys_storage')
      .select('*')
      .eq('service', 'helius')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error fetching Helius keys:', error);
      return 0;
    }
    
    if (!heliusKeys || heliusKeys.length === 0) {
      console.warn('No Helius keys found for user');
      return 0;
    }
    
    // Import the HeliusService to test keys
    const { heliusService } = await import('@/services/helius/HeliusService');
    
    // Test each key and update its status
    let workingKeys = 0;
    
    for (const key of heliusKeys) {
      const isWorking = await heliusService.checkApiKey(key.key_value);
      
      // Update key status in Supabase
      const { error: updateError } = await supabase
        .from('api_keys_storage')
        .update({ 
          status: isWorking ? 'active' : 'failing',
          updated_at: new Date().toISOString()
        })
        .eq('id', key.id);
      
      if (updateError) {
        console.error(`Error updating key ${key.id} status:`, updateError);
      }
      
      if (isWorking) {
        workingKeys++;
        
        // If this is the first working key, store it in local storage
        if (workingKeys === 1) {
          localStorage.setItem(`api_key_helius`, JSON.stringify({
            key: key.key_value,
            timestamp: Date.now()
          }));
        }
      }
    }
    
    console.log(`Tested ${heliusKeys.length} Helius keys, ${workingKeys} are working`);
    
    // Reset the Helius service to use the new key
    heliusService.reinitialize();
    
    return workingKeys;
  } catch (error) {
    console.error('Error testing Helius keys:', error);
    return 0;
  }
}
