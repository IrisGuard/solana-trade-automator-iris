
/**
 * Setup global error handling for the application
 * This includes window.onerror, unhandled promises, etc.
 */

import { errorCollector } from "./collector";

// Setup error handling for the application
export const setupGlobalErrorHandling = () => {
  // Handle window errors
  window.onerror = (message, source, lineno, colno, error) => {
    errorCollector.logErrorAndNotify(error || String(message), {
      source: 'window.onerror',
      location: { source, lineno, colno }
    });
    return false; // Let the default handler run too
  };

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    errorCollector.logErrorAndNotify(
      event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
      { source: 'unhandledrejection' }
    );
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
      errorCollector.logErrorAndNotify(
        new Error(errorMessage),
        { source: 'console.error', isReactError: true }
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
