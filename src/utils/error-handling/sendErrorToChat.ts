
/**
 * Utility for sending errors to the lovable chat system
 */
import { sanitizeErrorObject } from '@/utils/errorTestUtils';

// Define a window interface extension to ensure TypeScript understands lovableChat
declare global {
  interface Window {
    lovableChat?: {
      createErrorDialog?: (errorData: any) => void;
      clearErrors?: () => void;
      [key: string]: any;
    };
  }
}

export function sendErrorToChat(error: Error | unknown, options: { component?: string; details?: Record<string, unknown> } = {}) {
  // Early return if window or lovableChat is not available
  if (!window.lovableChat || !window.lovableChat.createErrorDialog) {
    console.error("[sendErrorToChat] Chat error dialog system is not available");
    return;
  }

  try {
    // Ensure we have a properly sanitized error object with all string properties
    const sanitizedError = sanitizeErrorObject(error);
    
    // Create error detail object with only string values
    const errorData: Record<string, string> = {
      name: sanitizedError.name,
      message: sanitizedError.message,
      stack: sanitizedError.stack,
      timestamp: sanitizedError.timestamp,
      url: sanitizedError.url,
      component: options.component ? String(options.component) : 'unknown'
    };

    // Handle details separately to ensure they're all strings
    if (options.details) {
      const stringifiedDetails: Record<string, string> = {};
      Object.entries(options.details).forEach(([key, value]) => {
        if (value === null) {
          stringifiedDetails[key] = 'null';
        } else if (value === undefined) {
          stringifiedDetails[key] = 'undefined';
        } else if (typeof value === 'object') {
          try {
            stringifiedDetails[key] = JSON.stringify(value);
          } catch (e) {
            stringifiedDetails[key] = '[Object cannot be stringified]';
          }
        } else {
          stringifiedDetails[key] = String(value);
        }
      });
      
      errorData.details = JSON.stringify(stringifiedDetails);
    }

    // Send to chat system
    window.lovableChat.createErrorDialog(errorData);
  } catch (e) {
    console.error("[sendErrorToChat] Failed to send error to chat:", e);
  }
}
