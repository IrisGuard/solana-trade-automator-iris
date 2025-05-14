
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
  if (options.source && 
      (options.source === 'client' || options.source === 'server' || 
       options.source === 'network' || options.source === 'test' || options.source === 'helius')) {
    errorSource = options.source as ErrorSource;
  }
  
  errorCollector.captureError(errorObj, { 
    source: errorSource,
    component: options.component,
    details: options.details
  });
  
  // Display toast notification if requested
  if (options.showToast !== false) {
    toast.error(title, {
      description: errorObj.message,
      duration: 5000,
    });
  }
}

/**
 * Send error report to chat support
 */
export function sendErrorToChat(message: string): void {
  console.log("Sending error to chat support:", message);
  // Implementation would connect to chat support service
}

/**
 * Report error to Supabase for tracking
 */
export function reportErrorToSupabase(error: Error, options: Record<string, any> = {}): void {
  console.log("Reporting error to Supabase:", error, options);
  // This functionality is handled by errorCollector.logError
  errorCollector.captureError(error, {
    source: options.source || 'client',
    component: options.component,
    details: options.details
  });
}
