
export interface ErrorData {
  message: string;
  stack?: string;
  timestamp: string;
  component?: string;
  source?: string;
  details?: string;
}

export interface ErrorCapturingOptions {
  component?: string;
  details?: any;
  source?: string;
}

class ErrorCollector {
  private errors: ErrorData[] = [];
  private maxErrors: number = 50;

  /**
   * Add an error to the collector
   */
  addError(error: ErrorData): void {
    this.errors.unshift(error);
    // Keep only the latest errors to prevent memory leaks
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors);
    }
  }

  /**
   * Capture error with more context options
   */
  captureError(error: Error, options: ErrorCapturingOptions = {}): void {
    const { component = 'unknown', details = {}, source = 'client' } = options;
    
    this.addError({
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      component,
      source,
      details: typeof details === 'string' ? details : JSON.stringify(details)
    });
  }

  /**
   * Get all collected errors
   */
  getErrors(): ErrorData[] {
    return [...this.errors];
  }

  /**
   * Get all collected errors - alias for backward compatibility
   */
  getAllErrors(): ErrorData[] {
    return this.getErrors();
  }

  /**
   * Clear all errors
   */
  clearAll(): void {
    this.errors = [];
  }

  /**
   * Clear all errors - alias for backward compatibility
   */
  clearAllErrors(): void {
    this.clearAll();
  }

  /**
   * Get the most recent error
   */
  getLatestError(): ErrorData | null {
    return this.errors.length > 0 ? this.errors[0] : null;
  }

  /**
   * Check if there are any errors
   */
  hasErrors(): boolean {
    return this.errors.length > 0;
  }
}

export const errorCollector = new ErrorCollector();
