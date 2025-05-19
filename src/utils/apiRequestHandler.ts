
import { toast } from "sonner";
import { isRateLimited, withRateLimitRetry } from "@/utils/error-handling/rateLimitHandler";

interface ApiRequestOptions {
  endpoint?: string; // Make this optional
  headers?: Record<string, string>;
  method?: string;
  body?: any;
  maxRetries?: number;
  retryDelay?: number;
  cacheTime?: number; // Time in milliseconds to cache the response
}

// Simple in-memory cache for API responses
const apiCache: Record<string, { data: any, timestamp: number }> = {};

/**
 * Make an API request with rate limiting, caching, and retry capabilities
 */
export async function makeApiRequest<T>(url: string, options: ApiRequestOptions): Promise<T> {
  const {
    endpoint = 'default',
    headers = {},
    method = 'GET',
    body,
    maxRetries = 3,
    retryDelay = 2000,
    cacheTime = 30000 // Default 30 seconds cache
  } = options;

  // Create a cache key based on the URL and request body (if it exists)
  const cacheKey = `${url}-${method}-${body ? JSON.stringify(body) : ''}`;

  // Check if the result is in cache and not expired
  if (method === 'GET' && apiCache[cacheKey] && (Date.now() - apiCache[cacheKey].timestamp < cacheTime)) {
    console.log(`Using cached response for ${url}`);
    return apiCache[cacheKey].data;
  }

  // Use the rate limit handler
  return withRateLimitRetry(
    async () => {
      const fetchOptions: RequestInit = {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      };

      const response = await fetch(url, fetchOptions);
      
      if (!response.ok) {
        // Handle specific status codes
        if (response.status === 429) {
          toast.warning("API rate limit reached, retrying with backoff...", {
            id: `rate-limit-${endpoint}`
          });
          throw new Error(`Rate limit exceeded for ${endpoint}`);
        }
        
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Cache the response for GET requests
      if (method === 'GET') {
        apiCache[cacheKey] = { data, timestamp: Date.now() };
      }
      
      return data;
    },
    {
      endpoint,
      maxRetries,
      retryDelay
    }
  );
}

/**
 * Clear the API cache for a specific endpoint or all endpoints
 */
export function clearApiCache(urlPattern?: string): void {
  if (urlPattern) {
    // Clear only matching keys
    Object.keys(apiCache).forEach(key => {
      if (key.includes(urlPattern)) {
        delete apiCache[key];
      }
    });
  } else {
    // Clear all cache
    Object.keys(apiCache).forEach(key => {
      delete apiCache[key];
    });
  }
}

/**
 * Create a service-specific API wrapper
 */
export function createApiService(baseUrl: string, serviceName: string) {
  return {
    get: async <T>(path: string, options: Omit<ApiRequestOptions, 'method' | 'body'> = {}): Promise<T> => {
      return makeApiRequest<T>(`${baseUrl}${path}`, {
        ...options,
        endpoint: options.endpoint || serviceName,
        method: 'GET'
      });
    },
    
    post: async <T>(path: string, body: any, options: Omit<ApiRequestOptions, 'method'> = {}): Promise<T> => {
      return makeApiRequest<T>(`${baseUrl}${path}`, {
        ...options,
        endpoint: options.endpoint || serviceName,
        method: 'POST',
        body
      });
    }
  };
}
