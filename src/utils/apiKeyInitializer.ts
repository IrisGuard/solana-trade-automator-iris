
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { addHeliusKey, addHeliusEndpoints } from '@/utils/addHeliusEndpoints';

/**
 * Initializes system API keys in a non-blocking way
 * This function is designed to be called once on app initialization
 * but should not block the application from loading if it fails
 */
export async function initializeSystemApiKeys(): Promise<boolean> {
  try {
    console.log('Starting API key initialization');
    
    // Check if user is signed in first
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.log('No user session, skipping API key initialization');
      return false;
    }
    
    // Initialize Helius endpoints
    const endpointsAdded = await addHeliusEndpoints();
    
    if (!endpointsAdded) {
      console.warn('Failed to initialize Helius endpoints');
      return false;
    }
    
    console.log('Successfully initialized API endpoints');
    return true;
  } catch (err) {
    // Log error but don't block app loading
    console.error('Error during API key initialization:', err);
    return false;
  }
}

/**
 * Add Helius keys for a specific user
 * @param userId The user ID to associate the keys with
 * @returns Promise resolving to true if successful, false otherwise
 */
export async function addHeliusKeysForUser(userId: string): Promise<boolean> {
  try {
    if (!userId) {
      toast.error('No user ID provided');
      return false;
    }
    
    // Add a placeholder Helius key for the user
    const keyAdded = await addHeliusKey(userId);
    
    if (!keyAdded) {
      toast.error('Failed to add Helius key');
      return false;
    }
    
    toast.success('Successfully added Helius keys');
    return true;
  } catch (err) {
    console.error('Error adding Helius keys:', err);
    toast.error('Error adding Helius keys');
    return false;
  }
}

// Add a debounced version that can be used in performance-sensitive contexts
let initializationTimeout: number | null = null;

export function initializeApiKeysDebounced(delayMs = 500): void {
  if (initializationTimeout) {
    clearTimeout(initializationTimeout);
  }
  
  initializationTimeout = window.setTimeout(() => {
    initializeSystemApiKeys().catch(err => {
      console.error('Failed in debounced API key initialization:', err);
    });
    initializationTimeout = null;
  }, delayMs);
}
