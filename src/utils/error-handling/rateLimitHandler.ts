
import { toast } from 'sonner';

interface RetryConfig {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
  backoffFactor: number;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 5,         // Increased from 3 to 5
  initialDelay: 1500,    // Increased from 1000 to 1500ms
  maxDelay: 15000,       // Increased from 10000 to 15000ms
  backoffFactor: 2
};

/**
 * Check if an error is due to rate limiting
 */
export function isRateLimitError(error: unknown): boolean {
  const errorStr = String(error);
  return errorStr.includes('rate limit') || 
         errorStr.includes('429') || 
         errorStr.includes('-32429') ||
         errorStr.includes('Too many requests') ||
         errorStr.includes('exceeded') && errorStr.includes('limit');
}

/**
 * Function that executes a task with automatic retries for Rate Limit errors
 */
export async function withRateLimitRetry<T>(
  fn: () => Promise<T>, 
  options: Partial<RetryConfig> = {}
): Promise<T> {
  const config = { ...DEFAULT_RETRY_CONFIG, ...options };
  let delay = config.initialDelay;
  let attempt = 0;
  let lastError: Error | null = null;
  
  while (true) {
    try {
      return await fn();
    } catch (error) {
      attempt++;
      const errorStr = String(error);
      const isRateLimitDetected = isRateLimitError(error);
      
      // If it's not a rate limit error or we've exceeded retry attempts, forward the error
      if (!isRateLimitDetected || attempt >= config.maxRetries) {
        if (isRateLimitDetected) {
          console.warn(`Rate limit persists after ${attempt} attempts. Giving up.`);
          toast.error('Solana API rate limit exceeded. Please try again later.', {
            description: 'The application will use cached data if available.'
          });
        }
        throw error;
      }
      
      lastError = error instanceof Error ? error : new Error(errorStr);
      console.log(`Rate limit hit. Retrying in ${delay}ms (attempt ${attempt}/${config.maxRetries})`);
      
      // Notify user only on first and last retry attempt
      if (attempt === 1) {
        toast.info('API rate limit exceeded. Retrying automatically...', {
          id: 'rate-limit-retry',
          duration: delay * 1.2
        });
      } else if (attempt === config.maxRetries - 1) {
        toast.loading('Final retry attempt...', {
          id: 'rate-limit-retry',
          duration: delay * 1.2
        });
      }
      
      // Wait before next attempt
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Increase delay for next attempt (exponential backoff)
      delay = Math.min(delay * config.backoffFactor, config.maxDelay);
    }
  }
}

/**
 * Handle rate limit errors with friendly user interface
 */
export function handleRateLimitError(error: unknown, fallbackValue: any = null): any {
  if (isRateLimitError(error)) {
    console.warn('Rate limit error handled:', error);
    toast.error('Solana API rate limit exceeded', {
      description: 'Please try again in a moment.',
      position: 'top-center',
      duration: 5000
    });
    return fallbackValue;
  }
  throw error;
}
