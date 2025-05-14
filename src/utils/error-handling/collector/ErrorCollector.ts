import { createHash } from 'crypto';
import { ErrorCollector, ErrorOptions, ErrorData } from './types';

const MAX_ERRORS = 50;

/**
 * Implementation of the ErrorCollector interface
 * Collects errors for later analysis and reporting
 */
export class ErrorCollectorImpl implements ErrorCollector {
  private errors: ErrorData[] = [];
  
  /**
   * Captures an error into the collector
   * @param error - The error to capture
   * @param options - Additional options for error context
   * @returns The ID of the captured error
   */
  captureError(error: Error | string, options: ErrorOptions = {}): string {
    return this.collectError(error, options);
  }
  
  /**
   * Collects an error into the collector (alias for captureError)
   * @param error - The error to collect
   * @param options - Additional options for error context
   * @returns The ID of the collected error
   */
  collectError(error: Error | string, options: ErrorOptions = {}): string {
    const timestamp = new Date();
    
    // Generate a unique ID for the error
    const id = `err_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    // Create the error data object
    const errorData: ErrorData = {
      id,
      error,
      timestamp,
      component: options.component,
      source: options.source,
      url: options.url,
      browserInfo: options.browserInfo,
      details: options.details
    };
    
    // If the error is an Error object, extract the stack trace
    if (error instanceof Error) {
      errorData.stack = error.stack;
    }
    
    // Add the error to the collection, keeping only the most recent errors
    this.errors.unshift(errorData);
    
    // Limit the number of stored errors to prevent memory issues
    if (this.errors.length > MAX_ERRORS) {
      this.errors = this.errors.slice(0, MAX_ERRORS);
    }
    
    // Log the error to the console for debugging
    console.error('[ErrorCollector]', errorData);
    
    return id;
  }
  
  /**
   * Gets all collected errors
   * @returns Array of error data
   */
  getErrors(): ErrorData[] {
    return [...this.errors];
  }
  
  /**
   * Gets the most recent errors
   * @param count - Number of recent errors to retrieve
   * @returns Array of most recent error data
   */
  getRecentErrors(count: number = 10): ErrorData[] {
    return this.errors.slice(0, Math.min(count, this.errors.length));
  }
  
  /**
   * Checks if there are any critical errors
   * @returns True if critical errors exist
   */
  hasCriticalErrors(): boolean {
    // For now, consider any error as critical
    // This could be enhanced to check for specific error types or conditions
    return this.errors.length > 0;
  }
  
  /**
   * Creates a hash for an error to help with grouping similar errors
   * @param errorData - The error data to hash
   * @returns Hash string
   */
  private createErrorHash(errorData: ErrorData): string {
    const hashInput = [
      errorData.error instanceof Error ? errorData.error.message : errorData.error,
      errorData.stack,
      errorData.component,
      errorData.source,
      errorData.url,
      errorData.browserInfo ? JSON.stringify(errorData.browserInfo) : '',
    ]
      .filter(Boolean)
      .join('|');
    
    return createHash('sha256').update(hashInput).digest('hex').substring(0, 8);
  }
  
  /**
   * Clears all collected errors
   */
  clearErrors(): void {
    this.errors = [];
  }
}

// Singleton instance of the error collector
export const errorCollector = new ErrorCollectorImpl();
