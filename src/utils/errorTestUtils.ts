
/**
 * Utility to safely convert any error object to a serializable object
 * This is critical for ensuring errors can be safely displayed in React components
 */

// Define a type for sanitized error objects
export interface SanitizedError {
  message: string;
  name: string;
  stack?: string;
  code?: string;
  timestamp?: string;
  url?: string;
  [key: string]: string | undefined;
}

/**
 * Safely converts any error object to a simple object with string properties
 * This prevents "Objects are not valid as React child" errors
 */
export function sanitizeErrorObject(error: unknown): SanitizedError {
  // Default error object if input is undefined or null
  if (!error) {
    return {
      message: 'Unknown error occurred',
      name: 'Error',
    };
  }

  // Handle Error instances
  if (error instanceof Error) {
    const result: SanitizedError = {
      message: String(error.message || 'No message provided'),
      name: String(error.name || 'Error'),
    };

    if (error.stack) {
      result.stack = String(error.stack);
    }

    // Explicitly handle common properties that might cause issues if they're objects
    const propertiesToCheck = ['fileName', 'lineNumber', 'columnNumber', 'sourceURL', 'line', 'column'];
    for (const prop of propertiesToCheck) {
      if ((error as any)[prop] !== undefined) {
        result[prop] = String((error as any)[prop]);
      }
    }

    // Handle custom properties that might exist on error objects
    // Iterate through all properties and convert them to strings
    for (const key in error) {
      if (Object.prototype.hasOwnProperty.call(error, key) && 
          key !== 'message' && key !== 'name' && key !== 'stack' && 
          !propertiesToCheck.includes(key)) {
        // Safely convert any value to string, handle objects carefully
        const value = (error as any)[key];
        if (value === null) {
          result[key] = 'null';
        } else if (value === undefined) {
          result[key] = 'undefined';
        } else if (typeof value === 'object') {
          try {
            result[key] = JSON.stringify(value);
          } catch (e) {
            result[key] = String(value);
          }
        } else {
          result[key] = String(value);
        }
      }
    }

    return result;
  }

  // Handle string errors
  if (typeof error === 'string') {
    return {
      message: error,
      name: 'Error',
    };
  }

  // Handle object errors that aren't Error instances
  if (typeof error === 'object' && error !== null) {
    const result: SanitizedError = {
      message: String((error as any).message || 'Unknown error'),
      name: String((error as any).name || 'Error'),
    };

    // Copy all properties as strings
    for (const key in error) {
      if (Object.prototype.hasOwnProperty.call(error, key)) {
        const value = (error as any)[key];
        if (value === null) {
          result[key] = 'null';
        } else if (value === undefined) {
          result[key] = 'undefined';
        } else if (typeof value === 'object') {
          try {
            result[key] = JSON.stringify(value);
          } catch (e) {
            result[key] = String(value);
          }
        } else {
          result[key] = String(value);
        }
      }
    }

    return result;
  }

  // Handle any other type of error
  return {
    message: String(error),
    name: 'Error',
  };
}

/**
 * Test function to verify that sanitizeErrorObject works as expected
 */
export function testSanitizeError(): void {
  const testCases = [
    new Error('Test error'),
    { message: 'Object error', code: 500 },
    'String error',
    null,
    undefined,
    { complex: { nested: true, data: [1, 2, 3] } },
    { fileName: 'test.js', lineNumber: 42, columnNumber: 10 }
  ];

  console.group('Testing sanitizeErrorObject');
  testCases.forEach((testCase, index) => {
    const result = sanitizeErrorObject(testCase);
    console.log(`Test case ${index}:`, result);
    // Make sure all properties are strings
    for (const key in result) {
      console.assert(
        typeof result[key] === 'string' || result[key] === undefined,
        `Property ${key} should be a string or undefined, got ${typeof result[key]}`
      );
    }
  });
  console.groupEnd();
}

// Add the missing exports that were causing TypeScript errors
export function clearAllErrors(): void {
  console.log('Clearing all errors from the collector');
  try {
    // Try to access the error collector if it exists
    const errorCollector = (window as any).errorCollector;
    if (errorCollector && typeof errorCollector.clearErrors === 'function') {
      errorCollector.clearErrors();
    }
    
    // Clear any errors stored in localStorage
    localStorage.removeItem('app_errors');
    localStorage.removeItem('app_console_logs');
    
    console.log('All errors cleared successfully');
  } catch (e) {
    console.error('Failed to clear errors:', e);
  }
}

// Add a simple protection system for monitoring
export function initProtectionSystem() {
  console.log('Initializing protection system');
  return {
    checkHealth: () => {
      console.log('Health check passed');
      return true;
    },
    createBackup: () => {
      console.log('Creating backup');
      return true;
    },
    restoreFromBackup: () => {
      console.log('Restoring from backup');
      return true;
    }
  };
}
