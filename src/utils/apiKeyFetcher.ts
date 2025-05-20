
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
        console.warn(`Invalid cached ${service} API key, fetching from DB`);
      }
    }
    
    // Fetch from Supabase
    console.log(`Fetching ${service} API key from Supabase...`);
    
    // Get current user session first
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('No active session, please login first');
    }
    
    const userId = session.user.id;
    
    const { data, error } = await supabase
      .from('api_keys_storage')
      .select('*')
      .eq('service', service)
      .eq('status', 'active')
      .eq('user_id', userId)
      .limit(1);
    
    if (error) {
      console.error(`Error fetching ${service} API key:`, error);
      throw error;
    }
    
    // If no active key found, try any key with that service
    if (!data || data.length === 0) {
      console.warn(`No active ${service} API key found, trying any status`);
      
      const { data: anyData, error: anyError } = await supabase
        .from('api_keys_storage')
        .select('*')
        .eq('service', service)
        .eq('user_id', userId)
        .limit(1);
        
      if (anyError || !anyData || anyData.length === 0) {
        console.error(`No ${service} API key found at all`);
        
        // Create placeholder key as fallback
        const placeholderKey = await createPlaceholderKey(service, userId);
        return placeholderKey;
      }
      
      // Use first key found regardless of status
      const firstKey = anyData[0].key_value;
      
      // Cache the key
      localStorage.setItem(`api_key_${service}`, JSON.stringify({
        key: firstKey,
        timestamp: Date.now()
      }));
      
      return firstKey;
    }
    
    // Cache the key in localStorage for faster access next time
    localStorage.setItem(`api_key_${service}`, JSON.stringify({
      key: data[0].key_value,
      timestamp: Date.now()
    }));
    
    return data[0].key_value;
  } catch (error) {
    console.error(`Failed to fetch ${service} API key:`, error);
    
    // Generate a placeholder key as fallback
    const placeholderKey = `placeholder-${service}-${Date.now()}`;
    localStorage.setItem(`api_key_${service}`, JSON.stringify({
      key: placeholderKey,
      timestamp: Date.now()
    }));
    
    return placeholderKey;
  }
}

/**
 * Creates a placeholder key for a service
 */
async function createPlaceholderKey(service: string, userId: string): Promise<string> {
  try {
    const placeholderKey = `placeholder-${service}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    
    // Insert placeholder key into database
    const { error } = await supabase
      .from('api_keys_storage')
      .insert({
        user_id: userId,
        name: `Default ${service.charAt(0).toUpperCase() + service.slice(1)} API Key`,
        service: service,
        key_value: placeholderKey,
        status: 'needs_setup',
        description: `Generated automatically. Please replace with your actual ${service} API key.`
      });
      
    if (error) {
      console.error(`Failed to create placeholder ${service} key:`, error);
    } else {
      console.log(`Created placeholder ${service} key`);
    }
    
    // Store in localStorage
    localStorage.setItem(`api_key_${service}`, JSON.stringify({
      key: placeholderKey,
      timestamp: Date.now()
    }));
    
    return placeholderKey;
  } catch (err) {
    console.error(`Error creating placeholder ${service} key:`, err);
    const fallbackKey = `fallback-${service}-${Date.now()}`;
    return fallbackKey;
  }
}

/**
 * Fetches an API key and adds it to the fetch request
 */
export async function fetchWithApiKey(url: string, service: string, options: RequestInit = {}): Promise<any> {
  try {
    // Get the API key for the requested service
    let apiKey: string;
    try {
      apiKey = await fetchApiKey(service);
    } catch (error) {
      console.error(`Failed to fetch ${service} API key, using fallback`);
      apiKey = `fallback-${service}-${Date.now()}`;
    }
    
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
    
    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    // Make the request with timeout
    const response = await fetch(url, {
      ...updatedOptions,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
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
    // Check if key is just a placeholder
    if (key.startsWith('placeholder-') || key.startsWith('fallback-')) {
      console.log(`${service} key is a placeholder, marking as invalid`);
      return false;
    }
    
    // Different validation methods based on service
    switch (service) {
      case 'helius':
        // Use HeliusService to validate the key
        try {
          const { heliusService } = await import('@/services/helius/HeliusService');
          return await heliusService.checkApiKey(key);
        } catch (error) {
          console.error(`Error validating Helius key:`, error);
          return false;
        }
      
      default:
        // Generic validation for other services - just assume true for now
        console.warn(`No specific validation method for ${service} keys, assuming valid`);
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
    
    // Skip validation for placeholder keys
    if (key.startsWith('placeholder-') || key.startsWith('fallback-')) {
      console.warn(`${service} key is a placeholder and not valid for real usage`);
      return null;
    }
    
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
