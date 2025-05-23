
import { useCallback } from 'react';
import { errorCollector } from '@/utils/error-handling/collector';

export function useErrorReporting() {
  const reportError = useCallback((error: Error | string | unknown, context?: any) => {
    try {
      // Convert any error type to Error object
      let errorObj: Error;
      if (error instanceof Error) {
        errorObj = error;
      } else if (typeof error === 'string') {
        errorObj = new Error(error);
      } else {
        errorObj = new Error('Unknown error occurred');
      }
      
      console.error('Error reported:', errorObj, context);
      errorCollector.captureError(errorObj, context);
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  }, []);

  return { reportError };
}
