
import { useCallback } from 'react';
import { errorCollector } from '@/utils/error-handling/collector';
import { captureException } from '@/utils/error-handling/errorReporting';
import { displayError } from '@/utils/error-handling/displayError';

export function useErrorReporting() {
  const reportError = useCallback((error: Error, options = {}) => {
    // Log to console
    console.error('Error reported:', error);
    
    // Add to error collector
    const errorId = errorCollector.captureError(error, {
      component: (options as any).component || 'unknown',
      source: (options as any).source || 'client',
      ...(options as any)
    });
    
    // Send to error reporting service
    captureException(error);
    
    // Display error UI if needed
    if ((options as any).showUI) {
      displayError(error, {
        showToast: true,
        ...(options as any)
      });
    }
    
    return errorId;
  }, []);
  
  return { reportError };
}
