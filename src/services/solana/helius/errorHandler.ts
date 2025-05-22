
import { errorCollector } from '@/utils/error-handling/collector';
import { toast } from 'sonner';

/**
 * Error handler specifically for Helius API errors
 */
export const handleHeliusError = (error: unknown, source: string) => {
  // Create a proper error object
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;
  const errorObj = error instanceof Error ? error : new Error(errorMessage);
  
  // Create a proper details object that satisfies Record<string, unknown>
  const details: Record<string, unknown> = {
    originalError: error,
    source,
    timestamp: new Date().toISOString()
  };
  
  errorCollector.captureError(errorObj, {
    component: 'HeliusService',
    source,
    details,
    severity: 'high'
  });
  
  // Show toast notification for critical errors
  toast.error('Helius API Error', {
    description: errorMessage.substring(0, 100), // Limit the length
    duration: 5000
  });
  
  throw error;
};
