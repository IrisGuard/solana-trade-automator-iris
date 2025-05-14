
import { errorCollector } from '@/utils/error-handling/collector';
import { ErrorDisplayOptions, ErrorSource } from '@/utils/error-handling/collector/types';
import { toast } from 'sonner';

/**
 * Display an error to the user with optional configuration
 */
export function displayError(
  error: Error | string,
  options: ErrorDisplayOptions = {}
) {
  // Convert string error to Error object
  const errorObj = typeof error === 'string' ? new Error(error) : error;
  
  // Generate title based on context or use default
  const title = options.title || 'An error occurred';
  
  // Log error to collector for tracking
  let errorSource: ErrorSource = 'client';
  
  // Make sure the source is a valid ErrorSource
  if (typeof errorObj === 'string' && 
      (errorObj === 'client' || errorObj === 'server' || 
       errorObj === 'network' || errorObj === 'test' || errorObj === 'helius')) {
    errorSource = errorObj as ErrorSource;
  }
  
  errorCollector.captureError(errorObj, { 
    source: errorSource
  });
  
  // Display toast notification
  toast.error(title, {
    description: errorObj.message,
    duration: 5000,
  });
}
