
import { TestErrorOptions } from "@/utils/error-handling/types";
import { errorCollector } from "@/utils/error-handling/collector";

// Generate various types of errors for testing
export function generateVariousErrors(options: TestErrorOptions = {}) {
  const { message = 'Test error', errorType, component, details } = options;
  
  console.log(`Generating test error: ${errorType || 'generic'}`);
  
  try {
    switch (errorType) {
      case 'reference':
        // Generate ReferenceError
        // @ts-ignore - intentionally causing an error
        nonExistentVariable.doSomething();
        break;
        
      case 'type':
        // Generate TypeError
        // @ts-ignore - intentionally causing an error
        const num: number = 'not a number';
        (null).toString();
        break;
        
      case 'syntax':
        // Simulate SyntaxError (can't actually create at runtime)
        throw new SyntaxError('Simulated syntax error in test');
        break;
        
      case 'promise':
        // Generate unhandled promise rejection
        Promise.reject(new Error('Unhandled promise rejection in test'));
        break;
        
      case 'async':
        // Simulate async error
        setTimeout(() => {
          throw new Error('Async error in setTimeout');
        }, 0);
        break;
        
      case 'render':
        // Simulate React render error
        throw new Error('Error rendering component');
        break;
        
      case 'prop':
        // Simulate missing props error
        throw new Error('Missing required props');
        break;
        
      case 'state':
        // Simulate state update error
        throw new Error('Cannot update state of unmounted component');
        break;
        
      case 'network':
        // Simulate network error
        const status = details?.status || 404;
        const networkError = new Error(`${status} error in network request`);
        // @ts-ignore - adding custom properties
        networkError.status = status;
        throw networkError;
        break;
        
      case 'timeout':
        // Simulate timeout error
        throw new Error('Request timed out after 30000ms');
        break;
        
      default:
        // Generate generic error
        throw new Error(message);
    }
  } catch (error) {
    console.error('Test error generated:', error);
    
    // Add to error collector for persistence
    if (error instanceof Error) {
      errorCollector.captureError(error, {
        component: component || 'ErrorTestUtils',
        errorType: errorType || 'generic',
        details
      });
    }
    
    return error;
  }
}

// Clear all tracked errors
export function clearAllErrors() {
  console.log('Clearing all error collections');
  errorCollector.clearAllErrors();
  
  // Clear localStorage items related to errors
  try {
    localStorage.removeItem('app_errors');
    localStorage.removeItem('app_console_logs');
  } catch (e) {
    console.error('Error clearing localStorage error items:', e);
  }
  
  return true;
}

export type { TestErrorOptions };
