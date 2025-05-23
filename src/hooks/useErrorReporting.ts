
import { useCallback } from 'react';
import { errorCollector } from '@/utils/error-handling/collector';

export function useErrorReporting() {
  const reportError = useCallback((error: Error | string, context?: any) => {
    errorCollector.captureError(error, context);
  }, []);

  return { reportError };
}
