
/**
 * Utility for sending errors to the lovable chat system
 */
import { sanitizeErrorObject } from '@/utils/errorTestUtils';

export function sendErrorToChat(error: Error | unknown, options: { component?: string; details?: Record<string, unknown> } = {}) {
  // Early return if window or lovableChat is not available
  if (!window.lovableChat || !window.lovableChat.createErrorDialog) {
    console.error("[sendErrorToChat] Chat error dialog system is not available");
    return;
  }

  try {
    // Ensure we have a proper Error object
    const errorObj = error instanceof Error ? error : new Error(String(error));
    
    // Sanitize the error object to ensure all properties are strings
    const sanitizedError = sanitizeErrorObject(errorObj);
    
    // Create error detail object with string properties
    const errorData = {
      message: sanitizedError.message,
      stack: sanitizedError.stack || '',
      timestamp: sanitizedError.timestamp || new Date().toISOString(),
      url: sanitizedError.url || window.location.href,
      component: options.component || 'unknown',
      details: options.details ? JSON.stringify(options.details) : undefined
    };

    // Send to chat system
    window.lovableChat.createErrorDialog(errorData);
  } catch (e) {
    console.error("[sendErrorToChat] Failed to send error to chat:", e);
  }
}
