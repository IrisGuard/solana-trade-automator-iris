
/**
 * Console logger utility
 * Captures console errors and integrates with error reporting
 */

// Original console methods
let originalConsoleError: typeof console.error;
let originalConsoleWarn: typeof console.warn;

export const consoleLogger = {
  initialize: () => {
    // Save original methods
    originalConsoleError = console.error;
    originalConsoleWarn = console.warn;

    // Override console.error
    console.error = (...args: any[]) => {
      // Call original method
      originalConsoleError.apply(console, args);
      
      // Handle React error - don't double report these
      const errorString = args.join(' ');
      const isReactError = 
        errorString.includes('React') || 
        errorString.includes('Warning:') ||
        errorString.includes('Error: Minified') ||
        errorString.includes('Check the render');
        
      if (!isReactError && typeof window !== 'undefined') {
        try {
          // Create an error to capture stack trace
          const error = args[0] instanceof Error 
            ? args[0] 
            : new Error(args.map(arg => String(arg)).join(' '));
            
          // Add to error queue for UI processing if needed
          if (window._errorQueue) {
            window._errorQueue.push({
              message: error.message,
              stack: error.stack,
              timestamp: new Date().toISOString(),
              type: 'console.error'
            });
          }
        } catch (e) {
          // Don't crash if error handling fails
        }
      }
    };

    // Override console.warn
    console.warn = (...args: any[]) => {
      // Call original method
      originalConsoleWarn.apply(console, args);
      
      // We could add warning tracking here if needed
    };
  },

  restore: () => {
    // Restore original console methods
    if (originalConsoleError) {
      console.error = originalConsoleError;
    }
    if (originalConsoleWarn) {
      console.warn = originalConsoleWarn;
    }
  }
};

export default consoleLogger;
