
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
  return {
    ...error,
    message: typeof error.message === 'string' 
      ? error.message 
      : error.message
        ? JSON.stringify(error.message)
        : 'Unknown Error',
    stack: typeof error.stack === 'string' 
      ? error.stack 
      : error.stack
        ? JSON.stringify(error.stack, null, 2)
        : undefined,
    timestamp: error.timestamp || new Date().toISOString(),
    url: typeof error.url === 'string'
      ? error.url
      : error.url
        ? String(error.url)
        : window.location.href
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
