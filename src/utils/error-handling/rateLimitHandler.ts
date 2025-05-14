
import { toast } from "sonner";

// Rate limit error timeout configuration
const RATE_LIMIT_RETRY_DELAYS = [1000, 2000, 5000, 10000]; // Growing delays between retries
const MAX_RETRIES = RATE_LIMIT_RETRY_DELAYS.length;
const RATE_LIMIT_TOAST_ID = "rate-limit-warning";

// Tracking for rate limit notifications to avoid spamming the user
const rateLimitWarningTimers: Record<string, {
  lastShown: number;
  count: number;
}> = {};

/**
 * Check if an error appears to be a rate limit error (HTTP 429)
 */
export function isRateLimitError(error: any): boolean {
  if (!error) return false;
  
  // Check HTTP status
  if (error.status === 429 || error.statusCode === 429) return true;
  
  // Check for rate limit error message
  const errorMessage = (error.message || error.toString()).toLowerCase();
  return (
    errorMessage.includes('rate limit') ||
    errorMessage.includes('too many requests') ||
    errorMessage.includes('429') ||
    errorMessage.includes('rpc request rate exceeded')
  );
}

/**
 * Wrapper function that handles rate limit errors with automatic retries
 * @param asyncFn The API function to call
 * @param options Configuration options for retry behavior
 * @returns The result of the async function
 */
export async function withRateLimitRetry<T>(
  asyncFn: () => Promise<T>,
  options: {
    maxRetries?: number;
    endpoint?: string;
    silent?: boolean;
  } = {}
): Promise<T> {
  const maxRetries = options.maxRetries || MAX_RETRIES;
  const endpointId = options.endpoint || 'api-call';
  const silent = options.silent || false;
  
  let lastError: any;
  
  // Try the initial request plus retries
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Attempt the API call
      return await asyncFn();
    } catch (error) {
      lastError = error;
      
      // If not a rate limit error, throw immediately
      if (!isRateLimitError(error)) {
        throw error;
      }
      
      // Last retry failed, show warning and throw
      if (attempt === maxRetries) {
        // Only show the warning once per endpoint every 30 seconds
        const now = Date.now();
        const warningRecord = rateLimitWarningTimers[endpointId] || { lastShown: 0, count: 0 };
        
        if (now - warningRecord.lastShown > 30000) {
          if (!silent) {
            toast.warning(
              `Το API έχει φτάσει το όριο αιτημάτων. Δοκιμάστε αργότερα.`,
              { id: `${RATE_LIMIT_TOAST_ID}-${endpointId}`, duration: 5000 }
            );
          }
          
          rateLimitWarningTimers[endpointId] = {
            lastShown: now,
            count: warningRecord.count + 1
          };
        } else {
          // Increment count without showing toast
          rateLimitWarningTimers[endpointId] = {
            lastShown: warningRecord.lastShown,
            count: warningRecord.count + 1
          };
        }
        
        console.log(`Rate limit exceeded for ${endpointId} (${warningRecord.count + 1} times in the last 30 seconds)`);
        throw error;
      }
      
      // Wait before retry with increasing backoff
      const delay = RATE_LIMIT_RETRY_DELAYS[attempt];
      console.log(`Rate limit hit for ${endpointId}. Retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  // This should never be reached due to the loop's exit condition
  throw lastError;
}
