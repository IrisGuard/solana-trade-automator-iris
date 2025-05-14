
import { toast } from "sonner";

export interface ErrorData {
  id?: string;
  message: string;
  stack?: string;
  timestamp: Date;
  component?: string;
  severity: 'critical' | 'warning' | 'info';
  code?: string;
  tags?: Record<string, string>;
  handled: boolean;
}

export interface ErrorReportOptions {
  message?: string;
  component?: string;
  severity?: 'critical' | 'warning' | 'info';
  code?: string;
  tags?: Record<string, string>;
  useToast?: boolean;
}

class ErrorCollector {
  private errors: ErrorData[] = [];
  private maxErrors: number = 100;

  constructor(maxErrors: number = 100) {
    this.maxErrors = maxErrors;
  }

  reportError(error: Error, options: ErrorReportOptions = {}): string {
    const errorId = Math.random().toString(36).substring(2, 15);
    const errorData: ErrorData = {
      id: errorId,
      message: options.message || error.message,
      stack: error.stack,
      timestamp: new Date(),
      component: options.component,
      severity: options.severity || 'warning',
      code: options.code,
      tags: options.tags,
      handled: false
    };

    this.addError(errorData);

    // Show toast if enabled (default is true)
    if (options.useToast !== false) {
      this.showToast(errorData);
    }

    return errorId;
  }

  // Alias for reportError to fix errors in the codebase
  captureError(error: Error, options: ErrorReportOptions = {}): string {
    return this.reportError(error, options);
  }

  private addError(error: ErrorData) {
    // Add error to the list and limit the number of stored errors
    this.errors = [error, ...this.errors].slice(0, this.maxErrors);
    console.error(`Error captured: ${error.message}`, error);
  }

  private showToast(error: ErrorData) {
    const toastMessage = `${error.severity === 'critical' ? '🔴' : error.severity === 'warning' ? '🟠' : '🔵'} ${error.message}`;
    const toastDescription = error.code ? `Code: ${error.code}` : '';

    if (error.severity === 'critical') {
      toast.error(toastMessage, {
        description: toastDescription,
        duration: 5000,
        id: error.id
      });
    } else if (error.severity === 'warning') {
      toast.warning(toastMessage, {
        description: toastDescription,
        duration: 4000,
        id: error.id
      });
    } else {
      toast.info(toastMessage, {
        description: toastDescription,
        duration: 3000,
        id: error.id
      });
    }
  }

  getErrors(): ErrorData[] {
    return [...this.errors];
  }

  // Alias for getErrors to fix errors in the codebase
  getAllErrors(): ErrorData[] {
    return this.getErrors();
  }

  getError(id: string): ErrorData | undefined {
    return this.errors.find(error => error.id === id);
  }

  markAsHandled(id: string): boolean {
    const error = this.errors.find(e => e.id === id);
    if (error) {
      error.handled = true;
      return true;
    }
    return false;
  }

  clearErrors(): void {
    this.errors = [];
  }

  // Alias for clearErrors to fix errors in the codebase
  clearAllErrors(): void {
    this.clearErrors();
  }

  getErrorCount(): number {
    return this.errors.length;
  }

  getUnhandledErrorCount(): number {
    return this.errors.filter(e => !e.handled).length;
  }
}

export const errorCollector = new ErrorCollector();
