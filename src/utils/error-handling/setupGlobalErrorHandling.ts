
import { errorCollector } from './collector';

/**
 * Sets up global error handlers for uncaught exceptions and unhandled rejections
 * @returns cleanup function
 */
export function setupGlobalErrorHandling() {
  console.log('Setting up global error handling...');
  
  // Handler for uncaught exceptions
  const handleError = (event: ErrorEvent) => {
    console.error('Global error caught:', event.error);
    
    errorCollector.captureError(event.error || new Error(event.message), {
      component: 'GlobalErrorHandler',
      source: 'window',
      details: {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      }
    });
    
    // Don't prevent default error handling
    // event.preventDefault();
  };
  
  // Handler for unhandled promise rejections
  const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    console.error('Unhandled promise rejection:', event.reason);
    
    errorCollector.captureError(
      event.reason instanceof Error ? event.reason : new Error(String(event.reason)), 
      {
        component: 'GlobalErrorHandler',
        source: 'promise',
        details: {
          type: 'unhandled_rejection',
        }
      }
    );
    
    // Don't prevent default error handling
    // event.preventDefault();
  };
  
  // Add error handlers
  window.addEventListener('error', handleError);
  window.addEventListener('unhandledrejection', handleUnhandledRejection);
  
  // Log successful setup
  console.log('Global error handlers installed');
  
  // Return cleanup function
  return () => {
    window.removeEventListener('error', handleError);
    window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    console.log('Global error handlers removed');
  };
}
