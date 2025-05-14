
/**
 * Setup global error handling for the application
 * This includes window.onerror, unhandled promises, etc.
 */

import { errorCollector } from "./collector";
import { displayError } from "./displayError";

// Setup error handling for the application
export const setupGlobalErrorHandling = () => {
  // Handle window errors
  window.onerror = (message, source, lineno, colno, error) => {
    const errorObj = error || new Error(String(message));
    displayError(errorObj, {
      title: 'Uncaught Error',
      source: 'window.onerror',
      details: { source, lineno, colno },
      sendToChat: false
    });
    return false; // Let the default handler run too
  };

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const errorObj = event.reason instanceof Error ? event.reason : new Error(String(event.reason));
    displayError(errorObj, { 
      title: 'Unhandled Promise Rejection',
      source: 'unhandledrejection',
      sendToChat: false
    });
  });

  // Handle React errors that happen outside of error boundaries
  const originalConsoleError = console.error;
  console.error = (...args) => {
    // Call the original console.error
    originalConsoleError.apply(console, args);

    // Check if this is a React error
    const errorMessage = args.join(' ');
    if (
      errorMessage.includes('React') ||
      errorMessage.includes('react-dom') ||
      errorMessage.includes('Uncaught')
    ) {
      displayError(
        new Error(errorMessage),
        { 
          title: 'React Error',
          source: 'console.error', 
          details: { isReactError: true },
          sendToChat: false
        }
      );
    }
  };

  return {
    // Clean up function to restore original handlers
    cleanup: () => {
      window.onerror = null;
      window.removeEventListener('unhandledrejection', () => {});
      console.error = originalConsoleError;
    }
  };
};
