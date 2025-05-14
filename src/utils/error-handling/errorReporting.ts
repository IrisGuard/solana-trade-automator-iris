
/**
 * Utility for error reporting and monitoring
 */

/**
 * Captures an exception and sends it to an error monitoring service
 * @param error The error to capture
 */
export function captureException(error: Error): void {
  // In production, this would send the error to a service like Sentry
  console.error('Captured exception:', error);
}

/**
 * Captures a message and sends it to an error monitoring service
 * @param message The message to capture
 * @param level The level of the message (error, warning, info)
 */
export function captureMessage(message: string, level: 'error' | 'warning' | 'info' = 'info'): void {
  // In production, this would send the message to a service like Sentry
  console.log(`Captured ${level} message:`, message);
}
