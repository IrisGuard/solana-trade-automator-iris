
import { toast } from 'sonner';
import { errorCollector } from '@/utils/error-handling/collector';
import { sendErrorToChat } from '@/utils/error-handling/sendErrorToChat';

// Error display options
export interface ErrorDisplayOptions {
  title?: string;
  showToast?: boolean;
  logToConsole?: boolean;
  sendToChat?: boolean;
  useCollector?: boolean;
  details?: Record<string, any>;
  source?: string;
  component?: string;
}

/**
 * Centralized error display and logging function
 */
export function displayError(error: Error | string, options: ErrorDisplayOptions = {}) {
  const {
    title = 'Error',
    showToast = true,
    logToConsole = true,
    sendToChat = false,
    useCollector = true,
    details = {},
    source = 'client',
    component = 'unknown'
  } = options;
  
  const errorMessage = typeof error === 'string' ? error : error.message;
  const errorStack = error instanceof Error ? error.stack : undefined;
  
  // Display in toast notification
  if (showToast) {
    toast.error(title, {
      description: errorMessage,
      duration: 5000,
    });
  }
  
  // Log to console
  if (logToConsole) {
    console.error(`[${title}]`, error);
    console.error('Details:', details);
  }
  
  // Send to chat for debugging
  if (sendToChat) {
    sendErrorToChat(errorMessage, details, errorStack);
  }
  
  // Add to error collector
  if (useCollector) {
    errorCollector.captureError(
      typeof error === 'string' ? new Error(error) : error, 
      { component, details, source }
    );
  }
  
  return errorMessage;
}

/**
 * Log an error to the console and optionally to the error collector
 */
export function logError(
  message: string, 
  component: string = 'unknown', 
  details: string | Record<string, any> = {}
) {
  console.error(`[${component}] ${message}`, details);
  
  errorCollector.captureError(new Error(message), {
    component,
    details: typeof details === 'string' ? details : JSON.stringify(details),
    source: 'client'
  });
}
