
// Εξάγουμε όλη τη λειτουργικότητα διαχείρισης σφαλμάτων από το εξειδικευμένο module
export { displayError, sendErrorToChat, reportErrorToSupabase } from './error-handling/displayError';
export type { ErrorDisplayOptions } from './error-handling/types';
export { errorCollector, type ErrorData } from './error-handling/collector';

/**
 * Legacy function to maintain compatibility with existing code
 * This is a wrapper around displayError for services that expect logError
 */
export function logError(error: Error | string, component?: string, details?: any) {
  const options = {
    component,
    details,
    logToConsole: true,
    showToast: true,
    source: 'service'
  };
  
  return displayError(error, options);
}
