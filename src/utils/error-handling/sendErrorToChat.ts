
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
    
    // Create error detail object
    const errorData = {
      name: sanitizedError.name,
      message: sanitizedError.message,
      stack: sanitizedError.stack,
      timestamp: sanitizedError.timestamp,
      url: sanitizedError.url,
      component: options.component ? String(options.component) : 'unknown',
      details: options.details ? JSON.stringify(options.details) : undefined
    };

    // Send to chat system
    window.lovableChat.createErrorDialog(errorData);
  } catch (e) {
    console.error("[sendErrorToChat] Failed to send error to chat:", e);
  }
}
