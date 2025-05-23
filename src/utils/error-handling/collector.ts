
export interface ErrorData {
  message: string;
  stack?: string;
  timestamp: Date;
  component?: string;
  source?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

interface ErrorContext {
  component?: string;
  source?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  details?: any;
}

class ErrorCollector {
  private errors: ErrorData[] = [];

  captureError(error: any, context?: ErrorContext) {
    console.error('Error captured:', error, context);
    
    const errorData: ErrorData = {
      message: error.message || error.toString(),
      stack: error.stack,
      timestamp: new Date(),
      component: context?.component,
      source: context?.source,
      severity: context?.severity || 'medium'
    };
    
    this.errors.push(errorData);
    
    if (typeof window !== 'undefined') {
      (window as any).errorCollector = this;
    }
  }

  captureException(error: Error, context?: ErrorContext) {
    this.captureError(error, context);
  }

  getErrors(): ErrorData[] {
    return this.errors;
  }

  getRecentErrors(limit = 10): ErrorData[] {
    return this.errors.slice(-limit);
  }

  clearErrors() {
    this.errors = [];
  }
}

export const errorCollector = new ErrorCollector();

if (typeof window !== 'undefined') {
  (window as any).errorCollector = errorCollector;
}
