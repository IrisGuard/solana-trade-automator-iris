
import { sanitizeErrorObject } from '@/utils/errorTestUtils';

interface ErrorContext {
  component?: string;
  source?: string;
  details?: Record<string, any>;
  additional?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  showToast?: boolean;
  toastTitle?: string;
  toastDescription?: string;
  showUI?: boolean;
  sendToChat?: boolean;
  useCollector?: boolean;
  notifyUser?: boolean;
}

export function useErrorReporting() {
  const reportError = (error: unknown, context?: ErrorContext) => {
    // Sanitize the error to ensure it's safe for display and logging
    const sanitizedError = sanitizeErrorObject(error);
    
    // Extract meaningful information from the sanitized error
    const errorMessage = sanitizedError.message;
    const errorStack = sanitizedError.stack;
    
    // Log to console with context
    console.error('Error reported:', {
      message: errorMessage,
      stack: errorStack,
      ...context
    });
    
    // In a production app, we would send this to an error tracking service
    
    return { reported: true, errorId: Date.now().toString() };
  };

  return { reportError };
}
