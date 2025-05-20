
/**
 * Utility functions for error testing and management
 */
import * as React from 'react';

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

// Site protection system initialization
export function initProtectionSystem() {
  console.log('Initializing site protection system...');
  
  // Basic health check function
  const checkHealth = () => {
    console.log('Running system health check...');
    // Check if critical application components are available
    const reactAvailable = typeof React !== 'undefined';
    const domAvailable = document.getElementById('root') !== null;
    
    if (!reactAvailable || !domAvailable) {
      console.error('Health check failed: Critical system components missing');
      // Attempt recovery if needed
      return false;
    }
    
    console.log('Health check passed: System operating normally');
    return true;
  };
  
  // Return protection system API
  return {
    checkHealth,
    protect: () => {
      console.log('Site protection enabled');
      // Add protection methods here
    },
    recover: () => {
      console.log('Attempting system recovery');
      // Add recovery methods here
      return true;
    }
  };
}

// Update the window typing
declare global {
  interface Window {
    lovableChat?: {
      createErrorDialog?: (errorData: any) => void;
      clearErrors?: () => void;
      [key: string]: any;
    };
  }
}
