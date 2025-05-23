
import React, { useEffect } from 'react';
import { toast } from 'sonner';
import { errorCollector } from '@/utils/error-handling/collector';
import { ErrorData } from '@/utils/error-handling/collector/types';

// Add this to window interface to avoid TypeScript errors
declare global {
  interface Window {
    _lastErrorDisplayTime?: number;
    _lastErrorDisplayTimes?: Record<string, number>;
    _errorQueue?: Array<{message: string; timestamp: string; type: string}>;
  }
}

export function GlobalErrorHandler() {
  useEffect(() => {
    // Handle uncaught errors
    const handleWindowError = (event: ErrorEvent) => {
      // Prevent duplicate errors from being reported
      event.preventDefault();
      
      // Create structured error object with required id field
      const errorData: ErrorData = {
        message: event.message || 'Unknown error',
        stack: event.error?.stack,
        source: event.filename || 'window',
        timestamp: new Date(),
        component: 'GlobalErrorHandler',
        data: {
          lineno: event.lineno,
          colno: event.colno,
          filename: event.filename
        }
      };
      
      console.error('[GlobalError]', errorData.message, errorData);
      
      // Add to error collector
      errorCollector.captureError(event.error || new Error(event.message), {
        component: 'GlobalErrorHandler',
        source: 'window',
        details: {
          lineno: event.lineno,
          colno: event.colno,
          filename: event.filename
        }
      });
      
      // Show error toast (rate limited)
      handleErrorNotification(errorData);
    };
    
    // Handle promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // Prevent duplicate errors
      event.preventDefault();
      
      const errorMessage = event.reason?.message || 'Unhandled Promise Rejection';
      const errorStack = event.reason?.stack;
      
      // Create error object with required id field
      const errorData: ErrorData = {
        message: errorMessage,
        stack: errorStack,
        timestamp: new Date(),
        component: 'GlobalErrorHandler',
        source: 'promise'
      };
      
      console.error('[UnhandledRejection]', errorMessage, event.reason);
      
      // Add to error collector
      errorCollector.captureError(
        event.reason instanceof Error ? event.reason : new Error(errorMessage),
        { component: 'GlobalErrorHandler', source: 'promise' }
      );
      
      // Show error toast (rate limited)
      handleErrorNotification(errorData);
    };
    
    window.addEventListener('error', handleWindowError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    return () => {
      window.removeEventListener('error', handleWindowError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);
  
  return null; // No UI for this component
}

// Rate limit error notifications
function handleErrorNotification(errorData: ErrorData) {
  const now = Date.now();
  const errorId = (errorData.message || '').substring(0, 50);
  
  // Initialize tracking objects if they don't exist
  window._lastErrorDisplayTime = window._lastErrorDisplayTime || 0;
  window._lastErrorDisplayTimes = window._lastErrorDisplayTimes || {};
  window._errorQueue = window._errorQueue || [];
  
  // Check if we've shown this specific error recently
  const lastShownTime = window._lastErrorDisplayTimes[errorId] || 0;
  
  if (now - lastShownTime > 10000) { // 10 second cooldown per unique error
    // Check global rate limit
    if (now - window._lastErrorDisplayTime > 3000) { // 3 second global cooldown
      showErrorToast(errorData);
      window._lastErrorDisplayTime = now;
      window._lastErrorDisplayTimes[errorId] = now;
    } else {
      // Queue the error for later
      window._errorQueue.push({
        message: errorData.message || 'Unknown error',
        timestamp: new Date().toISOString(),
        type: errorData.source || 'unknown'
      });
      
      // Show summary toast if we have accumulated errors
      if (window._errorQueue.length === 3) {
        toast.error(`Multiple errors (${window._errorQueue.length})`, {
          description: "Several errors have occurred. Check the console for details.",
          action: {
            label: "Clear",
            onClick: () => {
              window._errorQueue = [];
            }
          }
        });
      }
    }
  }
}

function showErrorToast(errorData: ErrorData) {
  toast.error("Σφάλμα Εφαρμογής", {
    description: (errorData.message || '').length > 60 
      ? (errorData.message || '').substring(0, 60) + '...' 
      : errorData.message,
    duration: 5000
  });
}
