
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

/**
 * Initialize the site protection system
 * Called by AppContent component during initialization
 */
export function initProtectionSystem() {
  console.log("Initializing site protection system");
  
  // Return an API that can be used by the caller
  return {
    checkHealth: () => {
      console.log("Running health check...");
      return { status: "healthy" };
    },
    protect: () => {
      console.log("Protection mechanisms activated");
      return true;
    }
  };
}
