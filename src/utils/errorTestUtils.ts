
/**
 * Utility functions for error handling and sanitization
 */

/**
 * Safely sanitizes an error object to ensure all properties are serializable
 * and won't cause React rendering issues
 * 
 * @param error The error object to sanitize
 * @returns A sanitized version of the error object with safe-to-render values
 */
export function sanitizeErrorObject(error: any): { 
  message: string;
  name: string;
  stack?: string;
  timestamp?: string;
  url?: string;
  [key: string]: string | undefined;
} {
  // Handle null or undefined
  if (error == null) {
    return { message: 'Unknown error (null)', name: 'Error', sanitized: 'true' };
  }

  try {
    // If it's already a string, just return a simple object
    if (typeof error === 'string') {
      return { message: error, name: 'Error', sanitized: 'true' };
    }

    // For errors or objects, create a sanitized version
    const sanitized: { 
      message: string;
      name: string;
      [key: string]: string | undefined;
    } = {
      message: 'Unknown error',
      name: 'Error'
    };
    
    // Process common error properties - ensure all values are strings
    if (error.message) sanitized.message = String(error.message);
    if (error.name) sanitized.name = String(error.name);
    if (error.stack) sanitized.stack = String(error.stack);
    if (error.code) sanitized.code = String(error.code);
    if (error.fileName) sanitized.fileName = String(error.fileName);
    if (error.lineNumber) sanitized.lineNumber = String(error.lineNumber);
    if (error.columnNumber) sanitized.columnNumber = String(error.columnNumber);
    if (error.timestamp) sanitized.timestamp = String(error.timestamp);
    if (error.url) sanitized.url = String(error.url);
    
    // If the error has no standard properties, try to stringify it or add generic message
    if (!sanitized.message || sanitized.message === 'Unknown error') {
      try {
        sanitized.message = JSON.stringify(error);
      } catch {
        sanitized.message = 'Unserializable error object';
      }
    }
    
    sanitized.sanitized = 'true';
    return sanitized;
  } catch (e) {
    // Fallback if anything goes wrong during sanitization
    return { 
      message: 'Error during sanitization', 
      name: 'SanitizationError',
      sanitizationError: String(e),
      sanitized: 'true'
    };
  }
}

/**
 * Initialize site protection system with error handling
 */
export function initProtectionSystem() {
  const system = {
    initialized: true,
    checkHealth: () => {
      console.log('[Health] Running site health check');
      return true;
    },
    recover: () => {
      console.log('[Health] Running recovery procedure');
      return true;
    }
  };
  
  return system;
}

/**
 * Clear all captured errors and reset error state
 */
export function clearAllErrors() {
  console.log('[ErrorSystem] Clearing all errors');
  
  try {
    // Clear errors from lovableChat if available
    if (window.lovableChat && typeof window.lovableChat.clearErrors === 'function') {
      window.lovableChat.clearErrors();
    }
    
    // Dispatch clear errors event
    window.dispatchEvent(new CustomEvent('lovable-clear-errors'));
    
    return true;
  } catch (e) {
    console.error('[ErrorSystem] Failed to clear errors:', e);
    return false;
  }
}

export default {
  sanitizeErrorObject,
  initProtectionSystem,
  clearAllErrors
};
