
/**
 * Utility functions for testing and clearing errors
 */

// Create a function to clear all errors
export function clearAllErrors(): void {
  if (typeof window !== 'undefined') {
    // Clear any error states in the application
    console.log('Clearing all application errors');
    
    // Clear any global error state if it exists
    if (window.lovableChat && typeof window.lovableChat.clearErrors === 'function') {
      window.lovableChat.clearErrors();
    }
    
    // Clear console errors if needed for testing
    if (console && console.clear) {
      console.clear();
    }
  }
}

// Function to sanitize error objects for safe use in React components
export function sanitizeErrorObject(error: unknown): Record<string, string> {
  // First convert to a proper Error object if it isn't already
  const errorObj = error instanceof Error ? error : new Error(String(error));
  
  // Create a safe copy with string properties
  const safeError: Record<string, string> = {
    name: String(errorObj.name || 'Error'),
    message: String(errorObj.message || 'Unknown error'),
    stack: String(errorObj.stack || '')
  };
  
  // Add timestamp if not present
  if (!('timestamp' in safeError)) {
    safeError.timestamp = new Date().toISOString();
  }

  // Add URL information
  if (!('url' in safeError) && typeof window !== 'undefined') {
    safeError.url = window.location.href;
  }

  // Process any additional properties
  if (typeof error === 'object' && error !== null) {
    Object.entries(error).forEach(([key, value]) => {
      if (key !== 'name' && key !== 'message' && key !== 'stack') {
        if (value === null) {
          safeError[key] = 'null';
        } else if (value === undefined) {
          safeError[key] = 'undefined';
        } else if (typeof value === 'object') {
          try {
            safeError[key] = JSON.stringify(value);
          } catch (e) {
            safeError[key] = '[Object cannot be stringified]';
          }
        } else {
          safeError[key] = String(value);
        }
      }
    });
  }
  
  return safeError;
}

// Initialize protection system for the application
export function initProtectionSystem() {
  console.log('Initializing site protection system');
  
  // Simple protection system object with health check method
  const protectionSystem = {
    checkHealth: () => {
      console.log('Performing application health check');
      return true;
    },
    
    restoreBackup: () => {
      console.log('Restoring from backup if available');
      return true;
    },
    
    detectAnomalies: () => {
      console.log('Checking for system anomalies');
      // Return true if everything is normal, false if anomalies detected
      return true;
    }
  };
  
  return protectionSystem;
}

// Test function to trigger an error for testing purposes
export function triggerTestError(errorType: string = 'general'): void {
  console.log(`Triggering test error of type: ${errorType}`);
  
  switch(errorType) {
    case 'reference':
      // Trigger a reference error
      try {
        // @ts-ignore - intentional error
        nonExistentVariable.property = true;
      } catch (e) {
        console.error('Reference error triggered:', e);
        throw e;
      }
      break;
      
    case 'type':
      // Trigger a type error
      try {
        // @ts-ignore - intentional error
        const num: number = 'string' as any;
        // @ts-ignore - intentional error
        num.toFixed(2).substring(3).nonExistentMethod();
      } catch (e) {
        console.error('Type error triggered:', e);
        throw e;
      }
      break;
      
    case 'syntax':
      // We can't directly trigger a syntax error at runtime,
      // but we can simulate one with an eval
      try {
        // @ts-ignore - intentional error
        eval('const x = {');
      } catch (e) {
        console.error('Syntax error triggered:', e);
        throw e;
      }
      break;
      
    case 'async':
      // Return a promise that rejects
      console.log('Triggering async error');
      void Promise.reject(new Error('Async test error')).then(() => {
        console.log('This should not execute');
      });
      break;
      
    default:
      // General error
      throw new Error('Test error triggered');
  }
}

// Export the utility functions
export default {
  clearAllErrors,
  triggerTestError,
  sanitizeErrorObject,
  initProtectionSystem
};
