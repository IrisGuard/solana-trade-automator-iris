
import { errorCollector, type ErrorData } from '@/utils/error-handling/collector';

// Test errors with different levels of severity
export const TEST_ERRORS = {
  SIMPLE: 'This is a simple test error',
  DETAILED: 'This is a detailed test error with stack trace',
  COMPLEX: 'This is a complex error with component and method information',
  NETWORK: 'Network request failed',
  DATABASE: 'Database operation failed',
  VALIDATION: 'Validation error: Invalid input'
};

// Generate a basic stack trace for test purposes
export function generateTestStack(depth: number = 5): string {
  let stack = 'Error: Test Error\n';
  
  for (let i = 0; i < depth; i++) {
    stack += `    at TestFunction${i} (TestFile${i}.js:${i * 10 + 1}:${i * 5 + 2})\n`;
  }
  
  return stack;
}

// Generate test error data
export function generateTestErrorData(
  message: string, 
  includeStack: boolean = true,
  includeComponent: boolean = false,
  includeMethod: boolean = false
): ErrorData {
  const errorData: ErrorData = {
    message,
    timestamp: Date.now(),
    source: 'test'
  };
  
  if (includeStack) {
    errorData.stack = generateTestStack();
  }
  
  if (includeComponent) {
    errorData.component = 'TestComponent';
  }
  
  if (includeMethod) {
    errorData.method = 'testMethod';
  }
  
  return errorData;
}

// Generate test error with specified options
export function generateTestError(message: string, options = {
  showToast: true,
  logToConsole: true,
  useCollector: true,
  sendToChat: false
}): void {
  const error = new Error(message);
  
  // Add to collector if needed
  if (options.useCollector) {
    errorCollector.captureError(error, {
      source: 'test',
      component: 'TestComponent',
      details: { testType: 'basic' }
    });
  }
  
  // Log to console if needed
  if (options.logToConsole) {
    console.error('Test error generated:', message, error.stack);
  }
  
  // Toast is handled in the component
}

// Generate various types of errors for testing
export function generateVariousErrors(): void {
  // Generate a few different types of errors
  errorCollector.captureError(new Error('API Rate Limit Exceeded'), {
    source: 'api',
    component: 'FetchClient',
    details: { endpoint: '/users', status: 429 }
  });
  
  errorCollector.captureError(new Error('Database connection failed'), {
    source: 'database',
    component: 'QueryExecutor',
    details: { query: 'SELECT * FROM users' }
  });
  
  errorCollector.captureError(new Error('User validation failed'), {
    source: 'validation',
    component: 'UserForm',
    details: { fields: ['email', 'password'] }
  });
  
  console.log('Generated various test errors in collector');
}

// Simulate different types of errors
export function simulateError(errorType: keyof typeof TEST_ERRORS): void {
  const errorMessage = TEST_ERRORS[errorType];
  const testIndex = Object.keys(TEST_ERRORS).indexOf(errorType);
  
  // Add the error to the collector
  errorCollector.captureError(new Error(errorMessage), {
    source: 'test',
    component: `TestComponent${testIndex}`,
    method: `testMethod${testIndex}`,
    details: { testIndex }
  });
  
  console.error(`Simulated error (${errorType}):`, errorMessage);
}

// Clear all test errors
export function clearTestErrors(): void {
  errorCollector.clearErrors();
  console.log('All test errors cleared');
}

// General function to clear all errors - used by multiple components
export function clearAllErrors(): void {
  errorCollector.clearErrors();
  console.log('All errors cleared');
}

// Throw error for testing error boundaries
export function throwTestError(errorType: keyof typeof TEST_ERRORS): never {
  const error = new Error(TEST_ERRORS[errorType]);
  
  // Add to collector before throwing
  errorCollector.captureError(error, {
    source: 'test',
    details: { test: true }
  });
  
  throw error;
}

// Throw async error for testing async error handling
export async function throwAsyncTestError(errorType: keyof typeof TEST_ERRORS): Promise<never> {
  return new Promise((_, reject) => {
    const error = new Error(TEST_ERRORS[errorType]);
    
    // Add to collector before throwing
    errorCollector.captureError(error, {
      source: 'test',
      details: { location: 'async' }
    });
    
    reject(error);
  });
}
