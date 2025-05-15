
import { displayError } from './error-handling/displayError';
import { errorCollector } from './error-handling/collector';
import type { ErrorOptions } from './error-handling/collector/types';

export function logError(error: Error | string, component?: string, details?: any) {
  // Convert string to Error if needed
  const errorObj = typeof error === 'string' ? new Error(error) : error;
  
  return errorCollector.captureError(errorObj, {
    component,
    details,
    source: 'service'
  });
}

export {
  displayError,
  errorCollector,
  type ErrorOptions
};
