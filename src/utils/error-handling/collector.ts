
interface ErrorContext {
  component?: string;
  source?: string;
  details?: any;
}

class ErrorCollector {
  captureError(error: any, context?: ErrorContext) {
    console.error('Error captured:', error, context);
    
    // In production, this would send to error reporting service
    if (typeof window !== 'undefined') {
      (window as any).errorCollector = this;
    }
  }

  captureException(error: Error, context?: ErrorContext) {
    this.captureError(error, context);
  }
}

export const errorCollector = new ErrorCollector();

// Make it available globally for emergency recovery
if (typeof window !== 'undefined') {
  (window as any).errorCollector = errorCollector;
}
