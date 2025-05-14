
import { errorCollector } from './collector';

/**
 * Set up global error handling for the application
 * This captures unhandled errors and logs them to the error collector
 */
export function setupGlobalErrorHandling() {
  // Previous error handler (if any)
  const previousErrorHandler = window.onerror;
  
  // Set up window.onerror handler
  window.onerror = (message, source, lineno, colno, error) => {
    // Call previous handler if it exists
    if (previousErrorHandler) {
      previousErrorHandler(message, source, lineno, colno, error);
    }
    
    // Log error to collector
    errorCollector.captureError(error || String(message), {
      component: 'GlobalErrorHandler',
      source: 'client',
      details: { source, lineno, colno }
    });
    
    // Return false to allow the error to propagate
    return false;
  };
  
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason instanceof Error 
      ? event.reason 
      : new Error(String(event.reason));
    
    // Log to error collector
    errorCollector.captureError(error, {
      component: 'UnhandledPromiseRejection',
      source: 'client'
    });
  });
  
  // Handle React errors via error boundaries
  // This is just for logging purposes, actual handling will be done by ErrorBoundary components
  const originalConsoleError = console.error;
  console.error = (...args) => {
    // Call original console.error
    originalConsoleError.apply(console, args);
    
    // Check if this is a React error (usually starts with "Error:" or "Warning:")
    const errorMessage = args[0];
    if (typeof errorMessage === 'string' && 
        (errorMessage.startsWith('Error:') || errorMessage.includes('React'))) {
      // Log to error collector
      errorCollector.captureError(args.join(' '), {
        component: 'ReactError',
        source: 'client'
      });
    }
  };
  
  return () => {
    // Cleanup function to remove handlers if needed
    window.onerror = previousErrorHandler;
    console.error = originalConsoleError;
  };
}
