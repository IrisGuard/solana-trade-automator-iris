
/**
 * Utility functions for error testing and management
 */

import { errorCollector } from './error-handling/collector';
import { errorManager } from './error-handling/ErrorManager';
import { toast } from 'sonner';

/**
 * Clear all errors from various sources
 */
export function clearAllErrors() {
  // Clear errors from the collector
  if (errorCollector && typeof errorCollector.clearErrors === 'function') {
    errorCollector.clearErrors();
  }
  
  // Clear errors from error manager
  if (errorManager && typeof errorManager.clearErrors === 'function') {
    errorManager.clearErrors();
  }
  
  // Clear error logs from local storage
  try {
    localStorage.removeItem('app_errors');
    localStorage.removeItem('app_console_logs');
  } catch (e) {
    console.error('Failed to clear errors from localStorage:', e);
  }
  
  toast.success('Όλα τα σφάλματα καθαρίστηκαν');
  
  return true;
}
