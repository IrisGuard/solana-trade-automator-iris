
import { errorCollector } from './collector';
import { toast } from 'sonner';
import { ErrorOptions } from './types';

/**
 * Capture an exception for monitoring
 */
export function captureException(error: Error, options: ErrorOptions = {}): void {
  const { component = 'unknown', details = {}, source = 'client', showToast = false } = options;
  
  // Log to console
  console.error(`[${component}] Error:`, error, details);
  
  // Add to error collector
  errorCollector.captureError(error, { component, details, source });
  
  // Show toast if requested
  if (showToast) {
    toast.error(error.message, {
      description: component !== 'unknown' ? `Error in ${component}` : undefined
    });
  }
}

/**
 * Capture a message for monitoring
 */
export function captureMessage(message: string, level: 'error' | 'warning' | 'info' = 'info', options: ErrorOptions = {}): void {
  const { component = 'unknown', details = {}, showToast = false } = options;
  
  // Create error object for consistent handling
  const error = new Error(message);
  
  // Log to console
  console[level](`[${component}] ${level.charAt(0).toUpperCase() + level.slice(1)}:`, message, details);
  
  // Add to error collector
  errorCollector.captureError(error, { 
    component, 
    details: { ...details, level },
    source: 'message'
  });
  
  // Show toast if requested
  if (showToast) {
    if (level === 'error') {
      toast.error(message);
    } else if (level === 'warning') {
      toast.warning(message);
    } else {
      toast.info(message);
    }
  }
}

/**
 * Clear all errors from the collector
 */
export function clearAllErrors(): void {
  errorCollector.clearAll();
}
