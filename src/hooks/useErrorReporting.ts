
import { useCallback } from 'react';
import { errorCollector } from '@/utils/error-handling/collector';
import { displayError } from '@/utils/error-handling/displayError';

/**
 * Hook για αναφορά σφαλμάτων με συνεπή τρόπο
 */
export function useErrorReporting() {
  const reportError = useCallback((error: Error | string, options: {
    component?: string;
    details?: any;
  } = {}) => {
    const errorObj = typeof error === 'string' ? new Error(error) : error;
    
    // Καταγραφή στον collector
    errorCollector.captureError(errorObj, {
      component: options.component || 'unknown',
      details: options.details || {},
      source: 'client'
    });
    
    // Εμφάνιση στο UI με toast
    displayError(errorObj, {
      showToast: true,
      logToConsole: true,
      component: options.component || 'unknown',
      details: options.details || {}
    });
    
    return {
      success: false,
      error: errorObj.message
    };
  }, []);

  return { reportError };
}
