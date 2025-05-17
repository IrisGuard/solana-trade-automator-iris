
import { heliusKeyManager } from '@/services/helius/HeliusKeyManager';
import { supabase } from '@/integrations/supabase/client';
import { errorCollector } from '@/utils/error-handling/collector';
import { toast } from 'sonner';

/**
 * Synchronize all Helius API keys for a specific user
 */
export async function syncAllHeliusData(userId: string): Promise<boolean> {
  if (!userId) {
    console.error('Cannot sync Helius keys: No userId provided');
    return false;
  }

  try {
    console.log(`Synchronizing Helius data for user ${userId}...`);
    
    // Force a fresh reload of the Helius API keys
    const success = await heliusKeyManager.refreshKeys();
    
    if (!success || heliusKeyManager.getKeyCount() === 0) {
      console.warn('No Helius API keys available after refresh');
      
      // Only show toast if this is not a background refresh
      toast.warning('Limited functionality available', {
        description: 'Helius API keys not configured properly'
      });
      
      return false;
    }
    
    console.log(`Successfully synchronized Helius data with ${heliusKeyManager.getKeyCount()} keys available`);
    return true;
  } catch (error) {
    console.error('Error synchronizing Helius data:', error);
    errorCollector.captureError(error, {
      component: 'syncHeliusKeys', 
      method: 'syncAllHeliusData',
      details: { userId }
    });
    
    return false;
  }
}

/**
 * Check if Helius is properly configured
 */
export function isHeliusConfigured(): boolean {
  return heliusKeyManager.hasKeys();
}

/**
 * Get the number of available API keys
 */
export function getHeliusKeyCount(): number {
  return heliusKeyManager.getKeyCount();
}
