
/**
 * Utility για καθαρισμό όλων των σφαλμάτων
 */
import { errorCollector } from './error-handling/collector';

/**
 * Καθαρίζει όλα τα καταγεγραμμένα σφάλματα
 */
export function clearAllErrors() {
  if (errorCollector && typeof errorCollector.clearAllErrors === 'function') {
    errorCollector.clearAllErrors();
    console.log('All errors cleared');
  } else {
    console.warn('Error collector not available');
  }
}
