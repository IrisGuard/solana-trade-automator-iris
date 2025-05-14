// Define interface for error data
export interface ErrorData {
  id?: string;
  message: string;
  stack?: string;
  source?: string;
  component?: string;
  details?: any;
  timestamp?: number;
  method?: string; // Added method property to fix TypeScript errors
}

class ErrorCollector {
  private errors: ErrorData[] = [];
  private readonly MAX_ERRORS = 100;

  // Capture an error and return the error ID
  captureError(error: Error | string, options?: {
    component?: string;
    details?: any;
    source?: string;
    method?: string; // Added method property
  }): string {
    const errorMessage = typeof error === 'string' ? error : error.message;
    const errorStack = typeof error === 'string' ? undefined : error.stack;
    
    const errorData: ErrorData = {
      id: `err_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      message: errorMessage,
      stack: errorStack,
      timestamp: Date.now(),
      source: options?.source || 'client',
      component: options?.component,
      details: options?.details,
      method: options?.method // Added method property
    };
    
    this.addErrorToCollection(errorData);
    return errorData.id || '';
  }

  // Add error - alias for backward compatibility
  addError(errorData: ErrorData | string): string {
    if (typeof errorData === 'string') {
      return this.captureError(errorData);
    }
    
    const completeErrorData: ErrorData = {
      ...errorData,
      id: errorData.id || `err_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      timestamp: errorData.timestamp || Date.now()
    };
    
    this.addErrorToCollection(completeErrorData);
    return completeErrorData.id || '';
  }

  // Log error and notify - for backward compatibility
  logErrorAndNotify(error: Error | string, options?: {
    component?: string;
    details?: any;
    source?: string;
    method?: string;
  }): string {
    return this.captureError(error, options);
  }

  // Get all errors
  getErrors(): ErrorData[] {
    return [...this.errors];
  }

  // Clear all errors
  clearErrors(): void {
    this.errors = [];
  }

  // Report errors to external system (placeholder)
  reportErrors(): void {
    console.log('Reporting errors to external system:', this.errors);
    // Implementation would send errors to external system
  }

  // Private method to add error to collection
  private addErrorToCollection(errorData: ErrorData): void {
    // Keep collection size under control
    if (this.errors.length >= this.MAX_ERRORS) {
      this.errors.shift(); // Remove oldest error
    }
    
    this.errors.push(errorData);
    
    // Log to console for debugging
    console.error(`[ErrorCollector] ${errorData.component || 'unknown'}: ${errorData.message}`);
  }
}

// Export a singleton instance
export const errorCollector = new ErrorCollector();
