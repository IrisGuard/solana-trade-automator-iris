
import { ErrorData, ErrorCollector, ErrorOptions } from './types';

export class ErrorCollectorImpl implements ErrorCollector {
  private errors = new Map<string, ErrorData>();

  captureError(error: Error, options: ErrorOptions = {}): string {
    const errorId = options.id || crypto.randomUUID();
    
    const errorData: ErrorData = {
      error,
      timestamp: Date.now(),
      component: options.component || 'unknown',
      source: options.source || 'app',
      details: options.details || null,
      severity: options.severity || 'medium',
      resolved: false
    };
    
    this.errors.set(errorId, errorData);
    return errorId;
  }
  
  getAllErrors(): Map<string, ErrorData> {
    return new Map(this.errors);
  }
  
  clearErrors(): void {
    this.errors.clear();
  }
  
  getError(id: string): ErrorData | undefined {
    return this.errors.get(id);
  }
  
  removeError(id: string): boolean {
    return this.errors.delete(id);
  }
  
  updateError(id: string, updates: Partial<ErrorData>): boolean {
    const error = this.errors.get(id);
    if (!error) return false;
    
    this.errors.set(id, { ...error, ...updates });
    return true;
  }
  
  onErrorCaptured(callback: (errorId: string, error: Error) => void): void {
    // Implementation of the error capture callback
    const originalCaptureError = this.captureError.bind(this);
    
    this.captureError = (error: Error, options: ErrorOptions = {}) => {
      const errorId = originalCaptureError(error, options);
      callback(errorId, error);
      return errorId;
    };
  }
}

export const errorCollector: ErrorCollector = new ErrorCollectorImpl();
