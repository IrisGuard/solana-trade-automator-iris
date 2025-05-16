
import { useCallback } from 'react';
import { errorCollector } from '@/utils/error-handling/collector';
import { displayError } from '@/utils/error-handling/displayError';
import { toast } from 'sonner';

interface ErrorReportingOptions {
  component?: string;
  source?: string;
  severity?: 'low' | 'medium' | 'high';
  details?: any;
  showUI?: boolean;
  showToast?: boolean;
  toastTitle?: string;
  toastDescription?: string;
}

export function useErrorReporting() {
  const reportError = useCallback((error: Error, options: ErrorReportingOptions = {}) => {
    // Log to console
    console.error('Error reported:', error);
    
    // Add default options
    const mergedOptions = {
      component: 'unknown',
      source: 'client',
      severity: 'medium' as const,
      ...options
    };
    
    // Add to error collector - ensure this returns a string
    const errorId = errorCollector.captureError(error, mergedOptions);
    
    // Display error UI if needed
    if (options.showUI) {
      displayError(error, {
        showToast: true,
        toastTitle: options.toastTitle,
        ...options
      });
    } else if (options.showToast) {
      toast.error(options.toastTitle || 'Σφάλμα', {
        description: options.toastDescription || error.message,
        id: errorId
      });
    }
    
    return errorId;
  }, []);
  
  return { reportError };
}
