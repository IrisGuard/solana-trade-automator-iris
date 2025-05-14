
import { useCallback } from 'react';
import { errorCollector } from '@/utils/error-handling/collector';
import { captureException, captureMessage } from '@/utils/error-handling/errorReporting';
import { toast } from 'sonner';

export interface ErrorReportingOptions {
  component?: string;
  details?: Record<string, any>;
  source?: string;
  showToast?: boolean;
}

/**
 * Hook to provide error reporting functionality
 */
export function useErrorReporting() {
  const reportError = useCallback((error: Error, options: ErrorReportingOptions = {}) => {
    const {
      component = 'unknown',
      details = {},
      source = 'client',
      showToast = false
    } = options;

    // Capture the error for monitoring
    captureException(error);
    
    // Add to error collector for internal display
    errorCollector.addError({
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      component,
      source,
      details: JSON.stringify(details)
    });
    
    // Show a toast if requested
    if (showToast) {
      toast.error('An error occurred', {
        description: error.message
      });
    }
    
    console.error(`[${component}] Error:`, error);
    
    // Return the error for chaining
    return error;
  }, []);

  const reportMessage = useCallback((message: string, level: 'error' | 'warning' | 'info' = 'info', options: ErrorReportingOptions = {}) => {
    captureMessage(message, level);
    
    if (options.showToast) {
      if (level === 'error') {
        toast.error(message);
      } else if (level === 'warning') {
        toast.warning(message);
      } else {
        toast.info(message);
      }
    }
  }, []);

  const clearAllErrors = useCallback(() => {
    errorCollector.clearAllErrors();
  }, []);

  return {
    reportError,
    reportMessage,
    clearAllErrors
  };
}
