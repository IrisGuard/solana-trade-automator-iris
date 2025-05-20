
/**
 * Utility for sending errors to the support chat
 */

interface ErrorDetails {
  component?: string;
  details?: Record<string, unknown>;
  [key: string]: unknown;
}

/**
 * Send error details to the support chat
 */
export function sendErrorToChat(error: Error, options: ErrorDetails = {}): boolean {
  try {
    // In a production app, we would integrate with a chat service
    console.log('[Support Chat] Sending error to support chat:', {
      message: error.message,
      stack: error.stack,
      ...options
    });
    
    return true;
  } catch (e) {
    console.error('Failed to send error to chat:', e);
    return false;
  }
}
