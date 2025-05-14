
// Εξάγουμε όλη τη λειτουργικότητα διαχείρισης σφαλμάτων από το εξειδικευμένο module
import { displayError, sendErrorToChat, reportErrorToSupabase } from './error-handling/displayError';
import { errorCollector } from './error-handling/collector';
import type { ErrorDisplayOptions } from './error-handling/types';

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

// Re-export all the functions and types
export {
  displayError,
  sendErrorToChat,
  reportErrorToSupabase,
  errorCollector,
  type ErrorDisplayOptions
};
