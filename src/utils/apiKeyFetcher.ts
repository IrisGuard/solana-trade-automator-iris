
import { getRotatedApiKey, markKeyAsFailing } from './apiKeyRotation';

// Optional default keys (fallbacks)
const defaultKeys: Record<string, string> = {
  // Default keys can be added here, but using the database is more secure
};

/**
 * Fetch an API key for a specific service with fallback and error handling
 * @param service The service name (e.g., 'helius', 'jupiter')
 * @returns A promise that resolves to an API key or null if none available
 */
export async function fetchApiKey(service: string): Promise<string | null> {
  try {
    // Try to get a key from the rotation system (from database)
    const key = await getRotatedApiKey(service);
    
    if (key) {
      return key;
    }
    
    // Fall back to default key if available
    if (defaultKeys[service]) {
      console.warn(`Using fallback key for ${service}`);
      return defaultKeys[service];
    }
    
    console.warn(`No API key available for ${service}`);
    return null;
  } catch (error) {
    console.error(`Error fetching ${service} API key:`, error);
    return defaultKeys[service] || null;
  }
}

/**
 * Handle API errors, marking keys as failing if they're rate limited
 * @param error The error that occurred
 * @param service The service name
 * @param key The API key that was used
 */
export function handleApiKeyError(error: any, service: string, key: string): void {
  if (!key) return;
  
  // Check if the error is a rate limit error
  const isRateLimit = error.status === 429 || 
                     (error.message && /rate limit|too many requests/i.test(error.message));
  
  if (isRateLimit) {
    console.warn(`Rate limit hit for ${service} API key: ${key.substring(0, 4)}...`);
    markKeyAsFailing(service, key);
  }
}

/**
 * Make an API request with an API key, handling errors and key rotation
 */
export async function fetchWithApiKey<T>(
  url: string, 
  service: string,
  options: RequestInit = {}
): Promise<T> {
  const key = await fetchApiKey(service);
  
  // Add the API key to the headers based on service-specific format
  let headers = { ...options.headers };
  
  if (key) {
    switch (service) {
      case 'helius':
        // Helius uses query parameters instead of headers
        url = url.includes('?') ? `${url}&api-key=${key}` : `${url}?api-key=${key}`;
        break;
      case 'jupiter':
        headers = { ...headers, 'x-api-key': key };
        break;
      case 'birdeye':
        headers = { ...headers, 'x-api-key': key };
        break;
      case 'solscan':
        headers = { ...headers, 'Authorization': `Bearer ${key}` };
        break;
      default:
        // For other services, add as a generic header
        headers = { ...headers, 'Authorization': `Bearer ${key}` };
    }
  }
  
  try {
    const response = await fetch(url, {
      ...options,
      headers
    });
    
    if (!response.ok) {
      if (response.status === 429 && key) {
        // Rate limit hit, mark the key as failing
        markKeyAsFailing(service, key);
      }
      
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    if (key && error instanceof Error && /rate limit|too many requests/i.test(error.message)) {
      markKeyAsFailing(service, key);
    }
    throw error;
  }
}
