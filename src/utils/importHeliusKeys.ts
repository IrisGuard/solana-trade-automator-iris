
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { heliusKeyManager } from '@/services/helius/HeliusKeyManager';

/**
 * Imports Helius API keys for a user
 */
export async function importHeliusKeys(userId: string): Promise<boolean> {
  if (!userId) {
    console.error('Cannot import Helius keys: No user ID provided');
    return false;
  }
  
  try {
    console.log('Importing Helius keys in progress...');
    
    // First, let's check if the user has any keys already
    const { data: existingKeys, error: checkError } = await supabase
      .from('api_keys_storage')
      .select('id')
      .eq('service', 'helius')
      .eq('user_id', userId)
      .limit(1);
      
    if (checkError) {
      console.error('Error checking existing Helius keys:', checkError);
    }
    
    // Ask user for their Helius API key
    const apiKey = prompt('Please enter your Helius API key');
    
    if (!apiKey) {
      console.log('No API key provided by user');
      return false;
    }
    
    // Validate the key format (basic check)
    if (apiKey.length < 10) {
      toast.error('Invalid Helius API key format');
      return false;
    }
    
    // Save to Supabase
    const { error } = await supabase
      .from('api_keys_storage')
      .insert({
        user_id: userId,
        name: 'Helius API Key',
        service: 'helius',
        key_value: apiKey,
        status: 'active',
        description: 'Imported from user input'
      });
      
    if (error) {
      console.error('Error saving Helius key to database:', error);
      toast.error('Σφάλμα αποθήκευσης κλειδιού Helius');
      return false;
    }
    
    // Save to local storage
    localStorage.setItem('api_key_helius', JSON.stringify({
      key: apiKey,
      timestamp: Date.now()
    }));
    
    // Force reload Helius key manager
    await heliusKeyManager.forceReload();
    
    toast.success('Το κλειδί Helius API αποθηκεύτηκε με επιτυχία');
    return true;
  } catch (error) {
    console.error('Error importing Helius key:', error);
    toast.error('Σφάλμα εισαγωγής κλειδιού Helius');
    return false;
  }
}
