
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { heliusService } from '@/services/helius/HeliusService';

/**
 * Adds a new Helius API key for the user
 * @param userId User ID to associate the key with
 * @returns Promise resolving to true if successful
 */
export async function addHeliusKey(userId: string): Promise<boolean> {
  try {
    // Generate a placeholder key or obtain it from elsewhere
    const placeholderKey = `helius-placeholder-${Date.now()}-${Math.round(Math.random() * 1000)}`;
    
    // Add the key to the database
    const { error } = await supabase.from('api_keys_storage').insert({
      user_id: userId,
      service: 'helius',
      name: 'Default Helius API Key',
      key_value: placeholderKey,
      status: 'needs_setup',
      description: 'Generated automatically. Please replace with your actual Helius API key.'
    });
    
    if (error) {
      console.error('Error adding Helius key:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Error in addHeliusKey:', err);
    return false;
  }
}

/**
 * Adds default Helius endpoints to the database
 * @returns Promise resolving to true if successful
 */
export async function addHeliusEndpoints(): Promise<boolean> {
  try {
    // First check if endpoints already exist
    const { data: existingEndpoints, error: checkError } = await supabase
      .from('api_endpoints')
      .select('name')
      .eq('category', 'helius');
    
    if (checkError) {
      console.error('Error checking existing Helius endpoints:', checkError);
      return false;
    }
    
    // If endpoints already exist, return success
    if (existingEndpoints && existingEndpoints.length > 0) {
      console.log('Helius endpoints already exist, skipping creation');
      return true;
    }
    
    // Create default Helius endpoints
    const endpoints = [
      {
        name: 'helius_base',
        url: 'https://api.helius.xyz/v0',
        category: 'helius',
        is_active: true
      },
      {
        name: 'helius_balances',
        url: 'https://api.helius.xyz/v0/addresses/{address}/balances',
        category: 'helius',
        is_active: true
      },
      {
        name: 'helius_transactions',
        url: 'https://api.helius.xyz/v0/addresses/{address}/transactions',
        category: 'helius',
        is_active: true
      }
    ];
    
    // Insert endpoints
    const { error } = await supabase.from('api_endpoints').insert(endpoints);
    
    if (error) {
      console.error('Error adding Helius endpoints:', error);
      return false;
    }
    
    // Reset Helius service to use new endpoints
    heliusService.reinitialize();
    
    return true;
  } catch (err) {
    console.error('Error in addHeliusEndpoints:', err);
    return false;
  }
}
