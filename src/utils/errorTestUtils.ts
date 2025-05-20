
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
export function sanitizeErrorObject(error: any): Error & {
  message: string; 
  name: string;
  stack?: string;
  timestamp?: string;
  url?: string;
  [key: string]: any;
} {
  // Handle null or undefined error
  if (error === null || error === undefined) {
    return {
      name: 'Error',
      message: 'Unknown Error',
      stack: 'No stack trace available',
      timestamp: new Date().toISOString(),
      url: window.location.href
    };
  }

  // First ensure error is an object
  const errorObj = typeof error === 'object' ? error : { message: String(error), name: 'Error' };
  
  // Create a new object with sanitized properties
  const sanitized: Record<string, any> = {};
  
  // Process each property to ensure it's in string format
  Object.entries(errorObj).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      sanitized[key] = key === 'message' ? 'Unknown Error' : 
                      key === 'name' ? 'Error' : undefined;
    } else if (typeof value === 'string') {
      sanitized[key] = value;
    } else if (typeof value === 'object') {
      try {
        // Special handling for objects with fileName, lineNumber, columnNumber
        if (value && typeof value === 'object' && 
            ('fileName' in value || 'lineNumber' in value || 'columnNumber' in value)) {
          const objDetails = [];
          if ('fileName' in value) objDetails.push(`file: ${String(value.fileName)}`);
          if ('lineNumber' in value) objDetails.push(`line: ${String(value.lineNumber)}`);
          if ('columnNumber' in value) objDetails.push(`column: ${String(value.columnNumber)}`);
          sanitized[key] = objDetails.join(', ');
        } else if (Array.isArray(value)) {
          // Handle arrays by converting each item to string
          sanitized[key] = value.map(item => 
            typeof item === 'object' ? JSON.stringify(item) : String(item)
          ).join(', ');
        } else {
          // Try to stringify other objects
          try {
            sanitized[key] = JSON.stringify(value);
          } catch (e) {
            sanitized[key] = `[Complex ${key} object]`;
          }
        }
      } catch (e) {
        sanitized[key] = `[Complex ${key} object]`;
      }
    } else if (typeof value === 'function') {
      sanitized[key] = `[Function: ${value.name || 'anonymous'}]`;
    } else if (typeof value === 'symbol') {
      sanitized[key] = value.toString();
    } else {
      sanitized[key] = String(value);
    }
  });

  // Ensure required properties exist
  return {
    ...sanitized,
    message: sanitized.message || 'Unknown Error',
    name: sanitized.name || 'Error', // Ensure name is present for Error interface
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
