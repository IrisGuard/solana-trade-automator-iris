
import { v4 as uuidv4 } from 'uuid';
import { ErrorData, ErrorCollector, ErrorOptions } from './types';

class ErrorCollectorImpl implements ErrorCollector {
  private errors: ErrorData[] = [];
  private static MAX_ERRORS = 100;

  constructor() {
    // Initialize with empty errors array
    this.errors = [];
  }

  public captureError(error: Error, options: ErrorOptions = {}): string {
    const errorId = uuidv4();
    const timestamp = new Date();
    
    const errorData: ErrorData = {
      id: errorId,
      error,
      timestamp,
      component: options.component,
      source: options.source || 'client',
      severity: options.severity || 'medium',
      details: options.details,
      resolved: false
    };
    
    this.errors.unshift(errorData);
    
    // Trim errors if we have too many
    if (this.errors.length > ErrorCollectorImpl.MAX_ERRORS) {
      this.errors = this.errors.slice(0, ErrorCollectorImpl.MAX_ERRORS);
    }
    
    // Log to console for debugging
    console.error('Error captured:', {
      id: errorId,
      message: error.message,
      component: options.component,
      source: options.source,
      severity: options.severity,
      details: options.details
    });
    
    return errorId;
  }
  
  public getErrors(): ErrorData[] {
    return [...this.errors];
  }
  
  public clearErrors(): void {
    this.errors = [];
  }
  
  public markResolved(errorId: string): boolean {
    const errorIndex = this.errors.findIndex(e => e.id === errorId);
    if (errorIndex >= 0) {
      this.errors[errorIndex].resolved = true;
      return true;
    }
    return false;
  }
}

// Export a singleton instance
export const errorCollector = new ErrorCollectorImpl();
