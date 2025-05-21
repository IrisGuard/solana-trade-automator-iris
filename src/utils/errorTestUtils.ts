
/**
 * Utility functions for error handling and testing
 */

/**
 * Safely sanitizes an error object to ensure it won't cause issues when displayed or logged
 * This is especially important when dealing with non-standard error objects
 */
export function sanitizeErrorObject(error: unknown): Error {
  if (error instanceof Error) {
    // Already an Error object, make a safe copy
    const sanitizedError = new Error(error.message);
    sanitizedError.name = error.name;
    sanitizedError.stack = error.stack;
    return sanitizedError;
  }
  
  // Handle other types of errors
  if (typeof error === 'string') {
    return new Error(error);
  }
  
  if (error === null) {
    return new Error('Null error');
  }
  
  if (error === undefined) {
    return new Error('Undefined error');
  }
  
  try {
    // Try to convert to string representation
    const errorString = JSON.stringify(error);
    return new Error(`Non-standard error: ${errorString}`);
  } catch (jsonError) {
    // Last resort if JSON.stringify fails
    return new Error(`Unknown error: ${String(error)}`);
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
      documentMode: document.documentMode,
      userAgent: navigator.userAgent
    };
  } catch (e) {
    return { error: sanitizeErrorObject(e).message };
  }
}
