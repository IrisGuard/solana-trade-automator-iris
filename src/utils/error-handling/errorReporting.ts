
/**
 * Error reporting utilities to centralize error capture and reporting
 */

type ErrorLevel = 'error' | 'warning' | 'info';

/**
 * Captures an exception for error reporting
 * @param error The error to capture
 * @param context Additional context about the error
 */
export function captureException(error: Error, context: Record<string, any> = {}): void {
  // In a real app, this would send the error to a service like Sentry
  console.error('[Error Reporting] Captured exception:', error, context);
}

/**
 * Captures a message for error reporting
 * @param message The message to capture
 * @param level The severity level
 * @param context Additional context about the message
 */
export function captureMessage(message: string, level: ErrorLevel = 'info', context: Record<string, any> = {}): void {
  // In a real app, this would send the message to a service like Sentry
  console[level]('[Error Reporting] Captured message:', message, context);
}

/**
 * Clears all errors from the error collector
 */
export function clearAllErrors(): void {
  try {
    // Import the error collector and clear errors
    const { errorCollector } = require('../error-handling/collector');
    if (errorCollector && typeof errorCollector.clearAll === 'function') {
      errorCollector.clearAll();
    }
  } catch (error) {
    console.error('Failed to clear errors:', error);
  }
}
