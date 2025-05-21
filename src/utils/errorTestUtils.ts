
/**
 * Utility functions for testing and clearing errors
 */

// Create a function to clear all errors
export function clearAllErrors(): void {
  if (typeof window !== 'undefined') {
    // Clear any error states in the application
    console.log('Clearing all application errors');
    
    // Clear any global error state if it exists
    if (window.lovableChat && typeof window.lovableChat.clearErrors === 'function') {
      window.lovableChat.clearErrors();
    }
    
    // Clear console errors if needed for testing
    if (console && console.clear) {
      console.clear();
    }
  }
}

// Test function to trigger an error for testing purposes
export function triggerTestError(errorType: string = 'general'): void {
  console.log(`Triggering test error of type: ${errorType}`);
  
  switch(errorType) {
    case 'reference':
      // Trigger a reference error
      try {
        // @ts-ignore - intentional error
        nonExistentVariable.property = true;
      } catch (e) {
        console.error('Reference error triggered:', e);
        throw e;
      }
      break;
      
    case 'type':
      // Trigger a type error
      try {
        // @ts-ignore - intentional error
        const num: number = 'string' as any;
        // @ts-ignore - intentional error
        num.toFixed(2).substring(3).nonExistentMethod();
      } catch (e) {
        console.error('Type error triggered:', e);
        throw e;
      }
      break;
      
    case 'syntax':
      // We can't directly trigger a syntax error at runtime,
      // but we can simulate one with an eval
      try {
        // @ts-ignore - intentional error
        eval('const x = {');
      } catch (e) {
        console.error('Syntax error triggered:', e);
        throw e;
      }
      break;
      
    case 'async':
      // Return a promise that rejects
      console.log('Triggering async error');
      return Promise.reject(new Error('Async test error')).then(() => {
        console.log('This should not execute');
      });
      
    default:
      // General error
      throw new Error('Test error triggered');
  }
}

// Export the utility functions
export default {
  clearAllErrors,
  triggerTestError
};
