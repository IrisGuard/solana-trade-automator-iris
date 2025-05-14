
import { toast } from 'sonner';
import { errorCollector } from './collector';
import type { ErrorDisplayOptions } from './types';

/**
 * Display an error message with various options
 */
export function displayError(error: Error | string, options: ErrorDisplayOptions = {}): string {
  const {
    showToast = true,
    logToConsole = true,
    sendToChat = false,
    useCollector = true,
    component,
    source = 'application',
    title,
    details,
    code
  } = options;

  // Get the error message
  const errorMessage = typeof error === 'string' ? error : error.message;
  
  // Log to console if requested
  if (logToConsole) {
    console.error(`Error in ${component || 'unknown component'}:`, error);
    if (details) {
      console.error('Error details:', details);
    }
  }

  // Show toast if requested
  if (showToast) {
    toast.error(title || errorMessage);
  }

  // Send to chat if requested
  if (sendToChat) {
    sendErrorToChat(errorMessage);
  }

  // Capture in error collector if requested
  if (useCollector) {
    return errorCollector.captureError(error, { 
      component, 
      context: details,
      code, 
      title
    });
  }

  return '';
}

/**
 * Send error to chat for assistance
 */
export function sendErrorToChat(errorMessage: string): void {
  // Create custom event to send error to chat
  const errorEvent = new CustomEvent('lovable-error', {
    detail: {
      message: errorMessage,
      timestamp: new Date()
    }
  });
  
  // Dispatch event
  window.dispatchEvent(errorEvent);
  
  // Also add to window.lovableChat if available
  if (window.lovableChat?.createErrorDialog) {
    window.lovableChat.createErrorDialog({
      message: errorMessage,
      timestamp: new Date()
    });
  }
  
  console.log('Error sent to chat:', errorMessage);
}

/**
 * Report error to Supabase for logging
 */
export function reportErrorToSupabase(error: Error | string, options: ErrorDisplayOptions = {}): void {
  // Implementation for reporting to Supabase would go here
  console.log('Error would be reported to Supabase:', error, options);
}
