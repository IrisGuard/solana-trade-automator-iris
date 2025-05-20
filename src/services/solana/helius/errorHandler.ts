
import { errorCollector } from '@/utils/error-handling/collector';
import { toast } from 'sonner';
import { sanitizeErrorObject } from '@/utils/errorTestUtils';

/**
 * Error handler specifically for Helius API errors
 */
export const handleHeliusError = (error: unknown, source: string) => {
  // Create a proper error object
  const errorObj = error instanceof Error ? error : new Error(String(error));
  const errorMessage = errorObj.message;
  
  // Ensure stack trace is properly set
  if (!(error instanceof Error) || !errorObj.stack) {
    // Generate a new stack trace or use one from the original error
    if (typeof error === 'object' && error !== null && 'stack' in error && typeof error.stack === 'string') {
      errorObj.stack = error.stack;
    } else {
      // Create a new stack trace if none exists
      try {
        throw errorObj;
      } catch (e) {
        // The error now has a stack trace
      }
    }
  }
  
  // Create a proper details object that satisfies Record<string, unknown>
  const details: Record<string, unknown> = {
    originalError: typeof errorMessage === 'string' ? errorMessage : String(errorMessage),
    source,
    timestamp: new Date().toISOString()
  };
  
  // Sanitize the error before collection
  const sanitizedError = sanitizeErrorObject(errorObj);
  
  errorCollector.captureError(sanitizedError, {
    component: 'HeliusService',
    source,
    details,
    severity: 'high'
  });
  
  // Show toast notification for critical errors
  toast.error('Helius API Error', {
    description: typeof errorMessage === 'string' ? errorMessage.substring(0, 100) : String(errorMessage).substring(0, 100), // Limit the length
    duration: 5000
  });
  
  throw errorObj;
};
