
import { errorCollector } from '@/utils/error-handling/collector';
import { toast } from 'sonner';
import { sanitizeErrorObject } from '@/utils/errorTestUtils';

/**
 * Error handler specifically for Helius API errors
 */
export const handleHeliusError = (error: unknown, source: string) => {
  // Sanitize and create proper Error object with all required properties including 'name'
  const sanitizedError = sanitizeErrorObject(error);
  
  // Create a proper details object that satisfies Record<string, unknown>
  const details: Record<string, unknown> = {
    originalError: typeof sanitizedError.message === 'string' ? sanitizedError.message : String(sanitizedError.message),
    source,
    timestamp: new Date().toISOString()
  };
  
  errorCollector.captureError(sanitizedError, {
    component: 'HeliusService',
    source,
    details,
    severity: 'high'
  });
  
  // Show toast notification for critical errors
  toast.error('Helius API Error', {
    description: typeof sanitizedError.message === 'string' ? 
      sanitizedError.message.substring(0, 100) : 
      String(sanitizedError.message).substring(0, 100), // Limit the length
    duration: 5000
  });
  
  throw sanitizedError;
};
