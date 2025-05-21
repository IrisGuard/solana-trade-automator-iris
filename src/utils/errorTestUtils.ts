
/**
 * Utility functions for error handling and testing
 */

/**
 * Safely sanitizes an error object to ensure it won't cause issues when displayed or logged
 * This is especially important when dealing with non-standard error objects
 */
export function sanitizeErrorObject(error: unknown): Error & { 
  timestamp?: string;
  url?: string;
  name: string; 
} {
  if (error instanceof Error) {
    // Already an Error object, make a safe copy
    const sanitizedError = new Error(error.message) as Error & { timestamp?: string; url?: string };
    sanitizedError.name = error.name || 'Error';
    sanitizedError.stack = error.stack;
    
    // Copy any custom properties that might exist on the error
    if ('timestamp' in error) {
      sanitizedError.timestamp = String(error['timestamp']);
    } else {
      sanitizedError.timestamp = new Date().toISOString();
    }
    
    if ('url' in error) {
      sanitizedError.url = String(error['url']);
    } else if (typeof window !== 'undefined') {
      sanitizedError.url = window.location.href;
    }
    
    return sanitizedError;
  }
  
  // Handle other types of errors
  if (typeof error === 'string') {
    const err = new Error(error) as Error & { timestamp: string; url?: string };
    err.name = 'StringError';
    err.timestamp = new Date().toISOString();
    if (typeof window !== 'undefined') {
      err.url = window.location.href;
    }
    return err;
  }
  
  if (error === null) {
    const err = new Error('Null error') as Error & { timestamp: string; url?: string };
    err.name = 'NullError';
    err.timestamp = new Date().toISOString();
    if (typeof window !== 'undefined') {
      err.url = window.location.href;
    }
    return err;
  }
  
  if (error === undefined) {
    const err = new Error('Undefined error') as Error & { timestamp: string; url?: string };
    err.name = 'UndefinedError';
    err.timestamp = new Date().toISOString();
    if (typeof window !== 'undefined') {
      err.url = window.location.href;
    }
    return err;
  }
  
  try {
    // Try to convert to string representation
    const errorString = JSON.stringify(error);
    const err = new Error(`Non-standard error: ${errorString}`) as Error & { timestamp: string; url?: string };
    err.name = 'NonStandardError';
    err.timestamp = new Date().toISOString();
    if (typeof window !== 'undefined') {
      err.url = window.location.href;
    }
    return err;
  } catch (jsonError) {
    // Last resort if JSON.stringify fails
    const err = new Error(`Unknown error: ${String(error)}`) as Error & { timestamp: string; url?: string };
    err.name = 'UnknownError';
    err.timestamp = new Date().toISOString();
    if (typeof window !== 'undefined') {
      err.url = window.location.href;
    }
    return err;
  }
}

/**
 * Clear all errors from collector for testing purposes
 */
export function clearAllErrors(): void {
  try {
    // Try to access the error collector from the global scope
    const collector = window['errorCollector'];
    if (collector && typeof collector.clearErrors === 'function') {
      collector.clearErrors();
      console.log('All errors cleared from collector');
    } else {
      console.warn('Error collector not found or missing clearErrors method');
    }
  } catch (e) {
    console.error('Failed to clear errors:', e);
  }
}

/**
 * Initialize the site protection system
 */
export function initProtectionSystem(): { checkHealth: () => void } {
  console.log('Initializing site protection system');
  
  // Create a simple protection system
  const protectionSystem = {
    checkHealth: () => {
      console.log('Running site health check');
      // Simplified health check - in a real system this would check various aspects
      try {
        // Check React is available
        if (typeof window !== 'undefined' && !window.React) {
          console.warn('React not found in global scope');
        }
        
        // Check if essential DOM elements exist
        const root = document.getElementById('root');
        if (!root) {
          console.warn('Root element not found');
        }
        
        console.log('Health check completed');
      } catch (e) {
        console.error('Error during health check:', e);
      }
    }
  };
  
  return protectionSystem;
}

/**
 * Utility to check React version and runtime environment
 */
export function checkReactEnvironment(): Record<string, unknown> {
  try {
    return {
      reactVersion: window.React?.version || 'unknown',
      hasJsx: typeof window.React?.jsx === 'function',
      hasJsxs: typeof window.React?.jsxs === 'function',
      hasCreateElement: typeof window.React?.createElement === 'function',
      hasUseState: typeof window.React?.useState === 'function',
      // Safely check document mode with type check to avoid TS errors
      documentMode: typeof document !== 'undefined' && 
                  'documentMode' in document ? 
                  (document as any).documentMode : undefined,
      userAgent: navigator.userAgent
    };
  } catch (e) {
    return { error: sanitizeErrorObject(e).message };
  }
}
