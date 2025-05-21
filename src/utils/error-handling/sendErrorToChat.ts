
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
    // Ensure we have a proper Error object with all the required properties
    const sanitizedError = sanitizeErrorObject(error);
    
    // Create error detail object with string properties
    // Make sure all values are strings to prevent React from trying to render objects
    const errorData = {
      name: String(sanitizedError.name || 'Error'),
      message: String(sanitizedError.message || 'Unknown error'),
      stack: String(sanitizedError.stack || ''),
      // Safe access to custom properties added by sanitizeErrorObject
      timestamp: String(sanitizedError.timestamp || new Date().toISOString()),
      url: String(sanitizedError.url || window.location.href),
      component: String(options.component || 'unknown'),
      details: options.details ? JSON.stringify(options.details) : undefined
    };

    // Send to chat system
    window.lovableChat.createErrorDialog(errorData);
  } catch (e) {
    console.error("[sendErrorToChat] Failed to send error to chat:", sanitizeErrorObject(e));
  }
}
