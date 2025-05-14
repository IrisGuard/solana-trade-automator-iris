
import { errorCollector, type ErrorData } from './collector';
import { toast } from 'sonner';

// Error display options
interface ErrorDisplayOptions {
  title?: string;
  showToast?: boolean;
  logToConsole?: boolean;
  source?: string;
  component?: string;
  details?: any;
  sendToChat?: boolean;
  useCollector?: boolean;
}

/**
 * Default options for error display
 */
const defaultOptions: ErrorDisplayOptions = {
  title: 'Error',
  showToast: true,
  logToConsole: true,
  source: 'client',
  useCollector: true
};

/**
 * Display an error with various output options
 * @param error The error to display
 * @param options Display options
 */
export function displayError(error: Error | string, options: ErrorDisplayOptions = {}): ErrorData {
  const opts = { ...defaultOptions, ...options };
  const errorMessage = typeof error === 'string' ? error : error.message;
  const errorStack = typeof error === 'string' ? undefined : error.stack;
  
  // Create error data for collector
  const errorData: ErrorData = {
    message: errorMessage,
    stack: errorStack,
    source: opts.source || 'client',
    timestamp: Date.now(),
    component: opts.component,
    details: opts.details
  };

  // Log to console if enabled
  if (opts.logToConsole) {
    console.error(`[${opts.title}]`, errorMessage);
    if (errorStack) {
      console.error(errorStack);
    }
    if (opts.details) {
      console.error('Details:', opts.details);
    }
  }

  // Add to error collector if enabled
  if (opts.useCollector) {
    errorCollector.captureError(error, {
      component: opts.component,
      source: opts.source,
      details: opts.details
    });
  }

  // Show toast if enabled
  if (opts.showToast) {
    toast.error(opts.title || 'Error', {
      description: errorMessage
    });
  }

  return errorData;
}

/**
 * Format error message for display
 */
export function formatErrorMessage(error: Error | string): string {
  if (typeof error === 'string') {
    return error;
  }
  
  return error.message || 'An unknown error occurred';
}

/**
 * Send error to chat for analysis
 */
export function sendErrorToChat(error: Error | string, additionalInfo?: any): void {
  try {
    // Convert string to Error if needed
    const errorObject = typeof error === 'string' ? new Error(error) : error;
    
    // Create error data object for chat
    const errorData = {
      type: 'error',
      message: errorObject.message,
      stack: errorObject.stack,
      additionalInfo,
      url: window.location.href,
      timestamp: new Date().toISOString(),
    };
    
    // Store in localStorage for Lovable Chat
    try {
      const storedErrors = JSON.parse(localStorage.getItem('lovable_chat_errors') || '[]');
      storedErrors.push(errorData);
      localStorage.setItem('lovable_chat_errors', JSON.stringify(storedErrors));
    } catch (e) {
      console.error("Error storing error for chat:", e);
    }
    
    // Dispatch custom event for Lovable Chat
    try {
      const event = new CustomEvent('lovable-error', { detail: errorData });
      window.dispatchEvent(event);
      console.log('Error sent to chat successfully');
    } catch (e) {
      console.error('Failed to dispatch error event to chat:', e);
    }
  } catch (e) {
    console.error("Error in sendErrorToChat:", e);
  }
}
