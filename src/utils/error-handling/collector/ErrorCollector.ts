
/**
 * ErrorCollector: Utility for collecting multiple errors and processing them together
 */

export interface ErrorData {
  error: Error | string;
  component?: string;
  details?: any;
  timestamp?: Date;
}

export interface ErrorOptions {
  component?: string;
  details?: any;
}

export class ErrorCollector {
  private errors: ErrorData[] = [];
  private maxErrors: number;

  constructor(maxErrors = 10) {
    this.maxErrors = maxErrors;
  }

  /**
   * Add an error to the collection
   */
  addError(error: Error | string, options: ErrorOptions = {}): void {
    if (this.errors.length >= this.maxErrors) {
      console.warn('Maximum error limit reached. Dropping oldest error.');
      this.errors.shift();
    }
    
    this.errors.push({
      error,
      component: options.component,
      details: options.details,
      timestamp: new Date()
    });
  }

  /**
   * Get all collected errors
   */
  getErrors(): ErrorData[] {
    return [...this.errors];
  }

  /**
   * Get the count of collected errors
   */
  getErrorCount(): number {
    return this.errors.length;
  }

  /**
   * Clear all collected errors
   */
  clearErrors(): void {
    this.errors = [];
  }

  /**
   * Process all errors with the given callback function
   */
  processErrors(callback: (errors: ErrorData[]) => void): void {
    if (this.errors.length > 0) {
      callback([...this.errors]);
      this.clearErrors();
    }
  }
}

// Create and export a singleton instance
export const errorCollector = new ErrorCollector();
