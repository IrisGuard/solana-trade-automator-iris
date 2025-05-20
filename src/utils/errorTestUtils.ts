
/**
 * Utility functions for error testing and management
 */

// Function to clear all error dialogs
export function clearAllErrors() {
  // Dispatch custom event to clear errors
  const clearEvent = new Event('lovable-clear-errors');
  window.dispatchEvent(clearEvent);
  
  // Backup: also call the direct method if available
  if (window.lovableChat?.clearErrors) {
    window.lovableChat.clearErrors();
  }
  
  console.log('All error dialogs cleared');
}

// Function to create and display a test error
export function createTestError(message: string = 'This is a test error') {
  try {
    // Explicitly throw an error to generate a stack trace
    throw new Error(message);
  } catch (error) {
    // Format the error properly to avoid object rendering issues
    const errorObj = {
      message: error instanceof Error ? error.message : String(message),
      stack: error instanceof Error ? error.stack : 'No stack trace available',
      timestamp: new Date().toISOString(),
      url: window.location.href
    };
    
    // Log the error
    console.error('Test error created:', errorObj);
    
    // Use the global error handler if available
    if (window.lovableChat?.createErrorDialog) {
      window.lovableChat.createErrorDialog(errorObj);
    }
    
    return errorObj;
  }
}

// Update the window typing
declare global {
  interface Window {
    lovableChat?: {
      createErrorDialog?: (error: any) => void;
      clearErrors?: () => void;
    };
  }
}
