
export interface ErrorData {
  id?: string;
  message: string;
  stack?: string;
  timestamp: string;
  details?: string;
  source?: string;
  resolved?: boolean;
}

class ErrorCollector {
  private errors: ErrorData[] = [];
  private maxErrors: number = 100;

  /**
   * Add an error to the collector
   */
  addError(error: ErrorData): void {
    // Add a unique ID if not provided
    if (!error.id) {
      error.id = Math.random().toString(36).substring(2, 15);
    }

    // Add to the beginning for most recent first
    this.errors.unshift(error);
    
    // Limit the number of errors stored
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors);
    }
    
    // Log to console for immediate feedback
    console.log(`[ErrorCollector] Added error: ${error.message}`);
  }

  /**
   * Get all errors
   */
  getAllErrors(): ErrorData[] {
    return [...this.errors];
  }

  /**
   * Clear all errors
   */
  clearAllErrors(): void {
    this.errors = [];
    console.log('[ErrorCollector] All errors cleared');
  }

  /**
   * Get errors by source
   */
  getErrorsBySource(source: string): ErrorData[] {
    return this.errors.filter(err => err.source === source);
  }

  /**
   * Mark an error as resolved
   */
  resolveError(id: string): void {
    const errorIndex = this.errors.findIndex(err => err.id === id);
    if (errorIndex !== -1) {
      this.errors[errorIndex].resolved = true;
    }
  }

  /**
   * Report a new error (alias for addError)
   */
  reportError(error: Error, metadata: any = {}): void {
    this.addError({
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      details: JSON.stringify(metadata),
      source: metadata.component || 'unknown'
    });
  }
}

// Create a singleton instance
export const errorCollector = new ErrorCollector();
