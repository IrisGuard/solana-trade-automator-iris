
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { errorCollector } from '@/utils/error-handling/collector';

/**
 * Synchronizes Helius keys from database to local storage
 */
export async function syncHeliusKeys(): Promise<boolean> {
  try {
    // Try to get the active keys first
    const { data: heliusKeys, error } = await supabase
      .from('api_keys_storage')
      .select('*')
      .eq('service', 'helius')
      .eq('status', 'active')
      .limit(1);
    
    if (error) {
      console.error('Error fetching Helius keys:', error);
      errorCollector.captureError(error, { 
        component: 'syncHeliusKeys',
        source: 'databaseInitializer'
      });
      return false;
    }
    
    if (!heliusKeys || heliusKeys.length === 0) {
      console.warn('No active Helius keys found, trying to get any Helius key');
      
      // Try to get any Helius key, not just active ones
      const { data: anyKeys, error: anyError } = await supabase
        .from('api_keys_storage')
        .select('*')
        .eq('service', 'helius')
        .limit(1);
        
      if (anyError || !anyKeys || anyKeys.length === 0) {
        console.error('No Helius keys found at all');
        return false;
      }
      
      // Use any key available
      const apiKey = anyKeys[0].key_value;
      
      // Save to local storage
      localStorage.setItem('api_key_helius', JSON.stringify({
        key: apiKey,
        timestamp: Date.now()
      }));
      
      console.log('Using non-active Helius key as fallback');
      return true;
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
    errorCollector.captureError(error, { 
      component: 'syncHeliusKeys',
      source: 'databaseInitializer'
    });
    return false;
  }
}

/**
 * Initializes database tables if they don't exist
 */
export async function initializeDatabase(): Promise<boolean> {
  try {
    // Check if we have connectivity to Supabase
    const { error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
      
    if (error) {
      console.error('Error connecting to database:', error);
      toast.error('Σφάλμα σύνδεσης με τη βάση δεδομένων');
      return false;
    }
    
    // Initialize by syncing Helius keys
    const heliusSuccess = await syncHeliusKeys();
    
    if (!heliusSuccess) {
      console.warn('Failed to sync Helius keys, but database is initialized');
      // Continue with initialization even if Helius keys failed
    }
    
    console.log('Database successfully initialized');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    toast.error('Σφάλμα κατά την αρχικοποίηση της βάσης δεδομένων');
    return false;
  }
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
