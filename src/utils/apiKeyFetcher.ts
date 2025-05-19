
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetches an API key for a specific service from the database
 * @param service The service name (e.g., 'helius')
 * @returns Promise resolving to the API key or null if not found
 */
export async function fetchApiKey(service: string): Promise<string | null> {
  try {
    // Get the current user
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session || !session.user) {
      console.error('No active user session found when fetching API key');
      return null;
    }
    
    // Query for the API key
    const { data, error } = await supabase
      .from('api_keys_storage')
      .select('key_value')
      .eq('user_id', session.user.id)
      .eq('service', service)
      .eq('status', 'active')
      .maybeSingle();
    
    if (error) {
      console.error(`Error fetching ${service} API key:`, error);
      return null;
    }
    
    if (!data || !data.key_value) {
      console.warn(`No active ${service} API key found for user`);
      return null;
    }
    
    return data.key_value;
  } catch (err) {
    console.error(`Error in fetchApiKey for ${service}:`, err);
    return null;
  }
}

/**
 * Checks if the user has a valid API key for a specific service
 * @param service The service name (e.g., 'helius')
 * @returns Promise resolving to true if a valid key exists
 */
export async function hasValidApiKey(service: string): Promise<boolean> {
  const key = await fetchApiKey(service);
  return !!key;
}

/**
 * Fetches data from an API endpoint with automatic API key inclusion
 * @param url The API endpoint URL
 * @param service The service name for the API key
 * @param options Optional fetch options
 * @returns Promise resolving to the JSON response
 */
export async function fetchWithApiKey(url: string, service: string, options: RequestInit = {}): Promise<any> {
  try {
    const apiKey = await fetchApiKey(service);
    
    if (!apiKey) {
      throw new Error(`No API key available for service: ${service}`);
    }
    
    // Clone the options to avoid modifying the original
    const fetchOptions = { ...options };
    
    // Prepare URL with API key based on service
    let apiUrl = url;
    
    // Add API key based on service-specific patterns
    if (service === 'helius') {
      const separator = url.includes('?') ? '&' : '?';
      apiUrl = `${url}${separator}api-key=${apiKey}`;
    } else if (service === 'solscan' || service === 'birdeye') {
      // For services that use headers for API keys
      fetchOptions.headers = {
        ...(fetchOptions.headers || {}),
        'x-api-key': apiKey
      };
    }
    
    // Make the request
    const response = await fetch(apiUrl, fetchOptions);
    
    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }
    
    return await response.json();
  } catch (err) {
    console.error(`Error in fetchWithApiKey for ${service}:`, err);
    throw err;
  }
}
