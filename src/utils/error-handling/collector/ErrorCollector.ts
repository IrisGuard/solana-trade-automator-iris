export type ErrorData = {
  message: string;
  source: 'client' | 'server' | 'network';
  stack?: string;
  details?: Record<string, any>;
};

export interface ErrorMetadata {
  component?: string;
  method?: string;
  details?: string | Record<string, any>;
  [key: string]: any;
}

export class ErrorCollector {
  private errors: ErrorData[] = [];
  private maxErrors = 50;

  addError(error: ErrorData): void {
    this.errors.unshift(error);
    
    // Keep only the most recent errors
    if (this.errors.length > this.maxErrors) {
      this.errors.pop();
    }
    
    // Log the error to console for development purposes
    console.error('Error collected:', error.message, error);
  }
  
  // Add the missing captureError method
  captureError(error: Error | unknown, metadata: ErrorMetadata = {}): void {
    // Extract error message and stack
    const errorMessage = error instanceof Error 
      ? error.message 
      : String(error);
      
    const errorStack = error instanceof Error 
      ? error.stack 
      : new Error().stack;
      
    // Create an ErrorData object
    const errorData: ErrorData = {
      message: errorMessage,
      source: metadata.component ? 'client' : 'network',
      stack: errorStack,
      details: {
        ...metadata,
        timestamp: new Date().toISOString()
      }
    };
    
    // Add the error using the existing method
    this.addError(errorData);
  }
  
  getErrors(): ErrorData[] {
    return [...this.errors];
  }
  
  clearErrors(): void {
    this.errors = [];
  }
}

export const errorCollector = new ErrorCollector();
