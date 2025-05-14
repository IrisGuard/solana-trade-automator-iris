
// Εξάγουμε όλη τη λειτουργικότητα διαχείρισης σφαλμάτων από το εξειδικευμένο module
export { displayError, sendErrorToChat, reportErrorToSupabase } from './error-handling/displayError';
export type { ErrorDisplayOptions } from './error-handling/types';
export { errorCollector, type ErrorData } from './error-handling/collector';
