
import { v4 as uuidv4 } from 'uuid';
import type { ErrorCollector as IErrorCollector, ErrorData, ErrorOptions } from './types';

class ErrorCollector implements IErrorCollector {
  private errors: ErrorData[] = [];
  private maxErrors: number = 50;

  constructor(maxErrors?: number) {
    if (maxErrors) {
      this.maxErrors = maxErrors;
    }
  }
  
  /**
   * Adds an error to the collector
   */
  addError(errorData: ErrorData): string {
    // Generate ID if not provided
    const id = errorData.id || uuidv4();
    const errorWithId = { ...errorData, id };
    
    // Add to beginning of array for newest-first sorting
    this.errors.unshift(errorWithId);
    
    // Trim the array if it exceeds maxErrors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors);
    }
    
    return id;
  }
  
  /**
   * Gets all collected errors
   */
  getErrors(): ErrorData[] {
    return this.errors;
  }
  
  /**
   * Alias for getErrors() for compatibility
   */
  getAllErrors(): ErrorData[] {
    return this.getErrors();
  }
  
  /**
   * Clears all errors
   */
  clearErrors(): void {
    this.errors = [];
  }
  
  /**
   * Alias for clearErrors() for compatibility
   */
  clearAllErrors(): void {
    this.clearErrors();
  }
  
  /**
   * Captures an Error object and adds it to the collector
   */
  captureError(error: Error, options?: ErrorOptions): string {
    const errorData: ErrorData = {
      message: error.message,
      stack: error.stack,
      component: options?.component || 'unknown',
      source: options?.source || 'client',
      timestamp: new Date().toISOString(),
      url: options?.url || (typeof window !== 'undefined' ? window.location.href : undefined),
      browserInfo: options?.browserInfo,
      errorType: options?.errorType
    };
    
    return this.addError(errorData);
  }
}

// Create a singleton instance
export const errorCollector = new ErrorCollector();

// Type exports
export type { ErrorData, ErrorOptions };
