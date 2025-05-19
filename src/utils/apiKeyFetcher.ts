
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Fetches an API key for a specific service from the database
 * @param service The service name (e.g., 'jupiter', 'helius', 'solscan')
 * @param userId Optional user ID. If not provided, will fetch any key for the service with status 'active'
 * @returns The API key value or null if not found
 */
export async function fetchApiKey(service: string, userId?: string): Promise<string | null> {
  try {
    let query = supabase
      .from('api_keys_storage')
      .select('key_value')
      .eq('service', service)
      .eq('status', 'active')
      .limit(1);
    
    // If userId is provided, filter by user
    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;
    
    if (error) {
      console.error(`Error fetching ${service} API key:`, error);
      return null;
    }
    
    if (data && data.length > 0) {
      return data[0].key_value;
    }
    
    return null;
  } catch (err) {
    console.error(`Failed to fetch ${service} API key:`, err);
    return null;
  }
}

/**
 * Caches API keys to minimize database calls
 * @param services Array of service names to cache keys for
 * @param userId Optional user ID
 * @returns Object with service names as keys and API keys as values
 */
export async function cacheApiKeys(services: string[], userId?: string): Promise<Record<string, string>> {
  const cachedKeys: Record<string, string> = {};
  
  try {
    let query = supabase
      .from('api_keys_storage')
      .select('service, key_value')
      .in('service', services)
      .eq('status', 'active');
    
    if (userId) {
      query = query.eq('user_id', userId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching API keys:', error);
      return cachedKeys;
    }
    
    if (data) {
      data.forEach(item => {
        cachedKeys[item.service] = item.key_value;
      });
    }
    
    return cachedKeys;
  } catch (err) {
    console.error('Failed to cache API keys:', err);
    return cachedKeys;
  }
}
