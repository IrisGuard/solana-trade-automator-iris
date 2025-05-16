
import { errorCollector } from './collector';
import { consoleLogger } from './ConsoleLogger';

let isSetup = false;

/**
 * Set up global error handling for the application
 * This captures unhandled errors and logs them to the error collector
 */
export function setupGlobalErrorHandling() {
  // Prevent double initialization
  if (isSetup) {
    console.log('Global error handling already set up');
    return () => {}; // Return empty cleanup function
  }
  
  isSetup = true;
  
  // Previous error handler (if any)
  const previousErrorHandler = window.onerror;
  
  // Set up window.onerror handler
  window.onerror = (message, source, lineno, colno, error) => {
    // Call previous handler if it exists
    if (previousErrorHandler) {
      previousErrorHandler(message, source, lineno, colno, error);
    }
    
    // Log error to collector
    errorCollector.captureError(error || new Error(String(message)), {
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
  
  // Let consoleLogger handle console errors to avoid conflicts
  consoleLogger.initialize();
  
  return () => {
    // Cleanup function to remove handlers if needed
    window.onerror = previousErrorHandler;
    consoleLogger.restore();
    isSetup = false;
  };
}
