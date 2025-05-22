
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetches an active API key for the specified service
 */
export async function fetchApiKey(service: string): Promise<string> {
  try {
    // First try to fetch from localStorage for quick access
    const cachedKey = localStorage.getItem(`api_key_${service}`);
    if (cachedKey) {
      try {
        // Check if the cached key is still valid (not expired)
        const parsedKey = JSON.parse(cachedKey);
        const expiryTime = parsedKey.timestamp + (1000 * 60 * 30); // 30 minutes cache
        
        if (Date.now() < expiryTime) {
          console.log(`Using cached ${service} API key`);
          return parsedKey.key;
        }
      } catch (e) {
        // Invalid JSON in localStorage, will fetch from DB
      }
    }
    
    // Fetch from Supabase
    console.log(`Fetching ${service} API key from Supabase...`);
    const { data, error } = await supabase
      .from('api_keys_storage')
      .select('*')
      .eq('service', service)
      .eq('status', 'active')
      .limit(1);
    
    if (error) {
      console.error(`Error fetching ${service} API key:`, error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      throw new Error(`No active ${service} API key found`);
    }
    
    // Cache the key in localStorage for faster access next time
    localStorage.setItem(`api_key_${service}`, JSON.stringify({
      key: data[0].key_value,
      timestamp: Date.now()
    }));
    
    return data[0].key_value;
  } catch (error) {
    console.error(`Failed to fetch ${service} API key:`, error);
    throw error;
  }
}

/**
 * Fetches an API key and adds it to the fetch request
 * This is a convenience wrapper for the TestApp component
 */
export async function fetchWithApiKey(url: string, service: string, options: RequestInit = {}): Promise<any> {
  try {
    // Get the API key for the requested service
    const apiKey = await fetchApiKey(service);
    
    // Create headers with the API key
    const headers = new Headers(options.headers || {});
    
    // Different services may expect the key in different header formats
    switch (service) {
      case 'helius':
        // Helius accepts the API key as a URL parameter
        const separator = url.includes('?') ? '&' : '?';
        url = `${url}${separator}api-key=${apiKey}`;
        break;
      case 'solscan':
        headers.set('Authorization', `Bearer ${apiKey}`);
        break;
      default:
        headers.set('X-API-Key', apiKey);
    }
    
    // Merge the headers back into the options
    const updatedOptions = {
      ...options,
      headers
    };
    
    // Make the request
    const response = await fetch(url, updatedOptions);
    
    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error in fetchWithApiKey for ${service}:`, error);
    throw error;
  }
}

/**
 * Tests if an API key is valid for the specified service
 */
export async function testApiKey(service: string, key: string): Promise<boolean> {
  try {
    // Different validation methods based on service
    switch (service) {
      case 'helius':
        // Use HeliusService to validate the key
        const { heliusService } = await import('@/services/helius/HeliusService');
        return await heliusService.checkApiKey(key);
      
      default:
        // Generic validation for other services
        console.warn(`No specific validation method for ${service} keys`);
        return true;
    }
  } catch (error) {
    console.error(`Error testing ${service} API key:`, error);
    return false;
  }
}

/**
 * Fetches and validates the specified service API key
 */
export async function getValidatedApiKey(service: string): Promise<string | null> {
  try {
    const key = await fetchApiKey(service);
    const isValid = await testApiKey(service, key);
    
    if (isValid) {
      return key;
    }
    
    // If key is invalid, clear it from cache
    localStorage.removeItem(`api_key_${service}`);
    return null;
  } catch (error) {
    console.error(`Could not get validated ${service} API key:`, error);
    return null;
  }
}
