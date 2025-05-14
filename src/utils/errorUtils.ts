
import { displayError } from './error-handling/displayError';
import { errorCollector } from './error-handling/collector';
import type { ErrorOptions } from './error-handling/collector/types';

export function logError(error: Error | string, component?: string, details?: any) {
  return errorCollector.captureError(error, {
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
