export interface ErrorData {
  message: string;
  stack?: string;
  timestamp?: number;
  source?: string;
  context?: Record<string, any>;
}

export class ErrorCollector {
  private errors: ErrorData[] = [];
  private maxErrors: number = 50;

  constructor(maxErrors?: number) {
    if (maxErrors) {
      this.maxErrors = maxErrors;
    }
  }

  addError(error: ErrorData): void {
    // Add timestamp if not provided
    if (!error.timestamp) {
      error.timestamp = Date.now();
    }
    
    this.errors.unshift(error);
    
    // Keep only the most recent errors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors);
    }
  }

  collect(error: Error, metadata: Record<string, any> = {}): void {
    const errorData: ErrorData = {
      message: error.message,
      stack: error.stack,
      timestamp: Date.now(),
      source: metadata.source || 'client',
      context: metadata
    };
    
    this.addError(errorData);
  }
  
  logErrorAndNotify(error: Error, component?: string): void {
    console.error(`Error in ${component || 'unknown component'}:`, error);
    this.collect(error, { component });
  }

  getErrors(): ErrorData[] {
    return [...this.errors];
  }

  clearErrors(): void {
    this.errors = [];
  }
  
  reportErrors(): Promise<string> {
    // In a real implementation, this would send errors to a server
    return new Promise((resolve) => {
      console.log('Reporting collected errors:', this.errors);
      setTimeout(() => resolve('success'), 500);
    });
  }
}

export const errorCollector = new ErrorCollector();
