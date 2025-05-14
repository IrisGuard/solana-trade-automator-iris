
// This file contains utility functions for testing error handling
import { toast } from 'sonner';
import { errorCollector, type ErrorData } from './error-handling/collector';

// Generate a sample error with stack trace
export function generateSampleError(message = 'Sample Error'): Error {
  const error = new Error(message);
  
  // Add custom properties for testing
  Object.assign(error, {
    code: 'TEST_ERROR',
    statusCode: 500,
    details: { test: true }
  });
  
  return error;
}

// Create test errors for basic testing functionality
export function generateTestError(message = 'Test Error'): Error {
  return generateSampleError(message);
}

// Create various types of errors for advanced testing
export function generateVariousErrors(): Error[] {
  return [
    generateSampleError('API Error'),
    generateSampleError('Network Error'),
    generateSampleError('Validation Error')
  ];
}

// Clear all errors from the error collector
export function clearAllErrors(): void {
  errorCollector.clearErrors();
  toast.success('All errors cleared');
}

// Test adding errors to the error collector
export function testAddError(count = 1): string[] {
  const ids: string[] = [];
  
  for (let i = 0; i < count; i++) {
    const message = `Test Error ${i + 1}`;
    const error = new Error(message);
    
    // Add with metadata
    const id = errorCollector.addError({
      message,
      stack: error.stack,
      timestamp: Date.now(),
      details: { testIndex: i }
    });
    
    ids.push(id);
  }
  
  toast.success(`Added ${count} test errors`);
  return ids;
}

// Test unhandled promise rejection
export function testUnhandledPromiseRejection(): void {
  setTimeout(() => {
    // Create a promise that rejects
    new Promise((_, reject) => {
      reject(new Error('Unhandled Promise Rejection Test'));
    });
  }, 100);
  
  toast.info('Unhandled promise rejection will occur shortly');
}

// Test asynchronous error
export async function testAsyncError(): Promise<void> {
  try {
    await new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Async Operation Failed'));
      }, 500);
    });
  } catch (error) {
    toast.error('Async error caught');
    throw error;
  }
}

// Simulate runtime error
export function simulateRuntimeError(): void {
  try {
    // @ts-ignore - Intentionally causing error
    const obj = null;
    obj.nonExistentMethod();
  } catch (error) {
    if (error instanceof Error) {
      errorCollector.addError({
        message: error.message,
        stack: error.stack,
        details: { test: true }
      });
      toast.error('Runtime error simulated');
    }
  }
}

// Generate DOM errors
export function generateDOMError(): void {
  try {
    // Create an element that doesn't exist
    document.createElement('nonexistentelement' as any);
  } catch (error) {
    if (error instanceof Error) {
      errorCollector.addError({
        message: error.message,
        stack: error.stack,
        details: { location: window.location.href }
      });
      toast.error('DOM error simulated');
    }
  }
}
