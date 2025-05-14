
import { errorCollector } from '@/utils/error-handling/collector';
import { toast } from 'sonner';

/**
 * Error handler specifically for Helius API errors
 */
export function handleHeliusError(
  error: Error | unknown,
  context: string = 'Helius API'
): void {
  const errorInstance = error instanceof Error ? error : new Error(String(error));

  console.error(`[Helius Error] ${context}:`, errorInstance);

  // Add specific handling for rate limits
  if (isRateLimitError(errorInstance)) {
    handleRateLimit(errorInstance, context);
    return;
  }

  // Handle authentication errors 
  if (isAuthError(errorInstance)) {
    handleAuthError(errorInstance, context);
    return;
  }

  // Generic error handling
  logHeliusError(errorInstance, context);
}

/**
 * Check if error is a rate limit error
 */
function isRateLimitError(error: Error): boolean {
  const message = error.message.toLowerCase();
  return (
    message.includes('rate limit') || 
    message.includes('too many requests') ||
    message.includes('429')
  );
}

/**
 * Handle rate limit specific errors
 */
function handleRateLimit(error: Error, context: string): void {
  // Log detailed context information
  errorCollector.captureError(error, {
    component: context,
    source: 'helius',
    details: JSON.stringify({
      type: 'rate_limit',
      timestamp: new Date().toISOString(),
      context
    })
  });

  // Show user-friendly notification
  toast.error('API Rate Limit Exceeded', {
    description: 'The Helius API request limit has been reached. Please try again later.',
    duration: 6000
  });
}

/**
 * Check if error is related to authentication
 */
function isAuthError(error: Error): boolean {
  const message = error.message.toLowerCase();
  return (
    message.includes('unauthorized') || 
    message.includes('authentication') || 
    message.includes('auth') ||
    message.includes('api key') ||
    message.includes('401')
  );
}

/**
 * Handle authentication specific errors
 */
function handleAuthError(error: Error, context: string): void {
  // Log detailed context information
  errorCollector.captureError(error, {
    component: context,
    source: 'helius',
    details: JSON.stringify({
      type: 'auth_error',
      timestamp: new Date().toISOString(),
      context
    })
  });

  // Show user-friendly notification
  toast.error('Authentication Error', {
    description: 'There was an error authenticating with Helius API. Please check your API key.',
    duration: 6000
  });
}

/**
 * Log generic Helius errors
 */
function logHeliusError(error: Error, context: string): void {
  // Log detailed context information
  errorCollector.captureError(error, {
    component: context,
    source: 'helius',
    details: JSON.stringify({
      timestamp: new Date().toISOString(),
      context
    })
  });

  // Show generic notification
  toast.error('Helius API Error', {
    description: 'There was a problem with the Helius service. Please try again later.',
    duration: 5000
  });
}
