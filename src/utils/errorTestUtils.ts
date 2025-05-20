
/**
 * Utility functions for error testing and handling
 */

/**
 * Clear all errors from the lovableChat system
 */
export function clearAllErrors(): void {
  if (window.lovableChat && typeof window.lovableChat.clearErrors === 'function') {
    window.lovableChat.clearErrors();
  }
}

/**
 * Ensure an error object has all properties as strings
 * to prevent React rendering issues
 */
export function sanitizeErrorObject(error: any): {
  message: string; 
  stack?: string;
  timestamp?: string;
  url?: string;
  [key: string]: any;
} {
  // First ensure error is an object
  const errorObj = error || {};
  
  // Create a new object with sanitized properties
  const sanitized: Record<string, any> = {};
  
  // Process each property to ensure it's in string format
  Object.entries(errorObj).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      sanitized[key] = key === 'message' ? 'Unknown Error' : undefined;
    } else if (typeof value === 'string') {
      sanitized[key] = value;
    } else if (typeof value === 'object') {
      try {
        sanitized[key] = JSON.stringify(value, null, 2);
      } catch (e) {
        sanitized[key] = `[Complex ${key} object]`;
      }
    } else {
      sanitized[key] = String(value);
    }
  });

  // Ensure required properties exist
  return {
    ...sanitized,
    message: sanitized.message || 'Unknown Error',
    stack: sanitized.stack || undefined,
    timestamp: sanitized.timestamp || new Date().toISOString(),
    url: sanitized.url || window.location.href
  };
}

/**
 * Initialize the site protection system
 */
export function initProtectionSystem() {
  const checkHealth = () => {
    // Simple health check that ensures errors are being handled
    try {
      // Check if the error dialog system is working
      if (!window.lovableChat) {
        console.warn("[Protection] Error dialog system is not initialized");
      }
    } catch (err) {
      console.error("[Protection] Failed to perform health check:", err);
    }
    return true;
  };

  // Initial health check
  checkHealth();

  // Return methods that can be called from outside
  return {
    checkHealth
  };
}
