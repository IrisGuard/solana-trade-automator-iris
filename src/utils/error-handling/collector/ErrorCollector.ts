export interface ErrorData {
  message: string;
  stack?: string;
  timestamp: string;
  component?: string;
  source?: string;
  details?: string;
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
   * Get all collected errors
   */
  getErrors(): ErrorData[] {
    return [...this.errors];
  }

  /**
   * Clear all errors
   */
  clearAll(): void {
    this.errors = [];
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
