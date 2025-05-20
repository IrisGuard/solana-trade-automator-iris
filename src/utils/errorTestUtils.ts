
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
  // Handle null or undefined error
  if (error === null || error === undefined) {
    return {
      message: 'Unknown Error',
      stack: 'No stack trace available',
      timestamp: new Date().toISOString(),
      url: window.location.href
    };
  }

  // First ensure error is an object
  const errorObj = typeof error === 'object' ? error : { message: String(error) };
  
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
        // Handle objects that might have fileName, lineNumber, columnNumber keys
        if (value && typeof value === 'object' && ('fileName' in value || 'lineNumber' in value || 'columnNumber' in value)) {
          const objDetails = [];
          if ('fileName' in value) objDetails.push(`file: ${String(value.fileName)}`);
          if ('lineNumber' in value) objDetails.push(`line: ${String(value.lineNumber)}`);
          if ('columnNumber' in value) objDetails.push(`column: ${String(value.columnNumber)}`);
          sanitized[key] = objDetails.join(', ');
        } else {
          sanitized[key] = JSON.stringify(value, null, 2);
        }
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
      // Sanitize the error before logging
      const sanitizedError = sanitizeErrorObject(err);
      console.error("[Protection] Failed to perform health check:", sanitizedError);
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
