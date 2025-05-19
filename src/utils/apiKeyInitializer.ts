
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Initializes system API keys in a non-blocking way
 * This function is designed to be called once on app initialization
 * but should not block the application from loading if it fails
 */
export async function initializeSystemApiKeys(): Promise<void> {
  return new Promise<void>(async (resolve) => {
    try {
      console.log('Starting lazy API key initialization');
      
      // Check if user is signed in first
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log('No user session, skipping API key initialization');
        return resolve();
      }
      
      // Attempt to load API keys, but don't block app if it fails
      const { data, error } = await supabase
        .from('api_keys_storage')
        .select('*')
        .limit(5);
      
      if (error) {
        console.warn('API key initialization warning:', error.message);
        toast.warning('Μη κρίσιμο σφάλμα φόρτωσης κλειδιών API', { 
          id: 'api-key-warning',
          duration: 3000 
        });
      } else {
        console.log(`Successfully loaded ${data?.length || 0} API keys`);
      }
      
      resolve();
    } catch (err) {
      // Log error but don't block app loading
      console.error('Non-critical error during API key initialization:', err);
      resolve();
    }
  });
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
