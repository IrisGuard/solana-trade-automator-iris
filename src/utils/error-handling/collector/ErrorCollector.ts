import { toast } from "sonner";

/**
 * Represents error data stored in the collector
 */
export interface ErrorData {
  id: string;
  timestamp: string;
  message: string;
  stack?: string;
  component?: string;
  details?: any;
  source?: string;
  resolved?: boolean;
}

export interface ErrorDisplayOptions {
  showToast?: boolean;
  logToConsole?: boolean;
  saveToDatabase?: boolean;
  sendToChatInterface?: boolean;
  title?: string; // Added title for display purposes
}

/**
 * Class responsible for collecting and managing errors in the application
 */
export class ErrorCollector {
  private static instance: ErrorCollector;
  private errors: ErrorData[] = [];
  private isReporting: boolean = false;
  
  // Maximum number of errors to store
  private readonly MAX_ERRORS = 100;

  private constructor() {
    // Private constructor for singleton pattern
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): ErrorCollector {
    if (!ErrorCollector.instance) {
      ErrorCollector.instance = new ErrorCollector();
    }
    return ErrorCollector.instance;
  }

  /**
   * Capture an error and add it to the collector
   */
  public captureError(
    error: Error | string,
    options?: {
      component?: string;
      details?: any;
      source?: string;
    }
  ): ErrorData {
    const errorData: ErrorData = {
      id: `error-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date().toISOString(),
      message: typeof error === 'string' ? error : error.message,
      stack: typeof error !== 'string' ? error.stack : undefined,
      component: options?.component,
      details: options?.details,
      source: options?.source || 'client',
      resolved: false
    };

    // Add to internal array, keeping the limit of MAX_ERRORS
    this.errors = [errorData, ...this.errors].slice(0, this.MAX_ERRORS);
    
    // Log the error to console
    this.logError(errorData);

    return errorData;
  }

  /**
   * Log the error to console with color formatting
   */
  private logError(errorData: ErrorData): void {
    const componentInfo = errorData.component ? `[${errorData.component}] ` : '';
    const sourceInfo = errorData.source === 'server' ? '[SERVER] ' : '';
    
    console.error(
      `%c${sourceInfo}${componentInfo}Error: ${errorData.message}`,
      'color: #FF4560; font-weight: bold',
      '\n',
      errorData.stack || '',
      '\nDetails:',
      errorData.details || {}
    );
  }

  /**
   * Get all captured errors
   */
  public getErrors(): ErrorData[] {
    return [...this.errors];
  }

  /**
   * Get a specific error by ID
   */
  public getErrorById(id: string): ErrorData | undefined {
    return this.errors.find(error => error.id === id);
  }

  /**
   * Clear all errors from the collector
   */
  public clearErrors(): void {
    this.errors = [];
  }

  /**
   * Mark an error as resolved
   */
  public resolveError(id: string): boolean {
    const errorIndex = this.errors.findIndex(error => error.id === id);
    if (errorIndex !== -1) {
      this.errors = [
        ...this.errors.slice(0, errorIndex),
        { ...this.errors[errorIndex], resolved: true },
        ...this.errors.slice(errorIndex + 1)
      ];
      return true;
    }
    return false;
  }

  /**
   * Report error to the server (e.g., Supabase)
   */
  public async reportError(
    error: string | Error,
    component?: string,
    details?: any
  ): Promise<boolean> {
    if (this.isReporting) {
      return false;
    }
    
    this.isReporting = true;
    
    try {
      // Add error to local collection first
      const errorData = this.captureError(error, { component, details });
      
      // Implementation of sending to server would go here
      console.log("Error would be reported to server:", errorData);
      
      return true;
    } catch (reportError) {
      console.error("Failed to report error:", reportError);
      return false;
    } finally {
      this.isReporting = false;
    }
  }
  
  /**
   * Add an error directly - legacy compatibility method
   */
  public addError(
    message: string,
    details?: any,
    component?: string,
    source?: string
  ): ErrorData {
    return this.captureError(message, { component, details, source });
  }

  /**
   * Log an error and notify users - legacy compatibility method
   */
  public logErrorAndNotify(
    error: Error | string,
    options?: {
      component?: string;
      details?: any;
      showToast?: boolean;
      title?: string;
    }
  ): ErrorData {
    // Add to error collection
    const errorData = this.captureError(error, {
      component: options?.component,
      details: options?.details
    });
    
    // Show toast notification if requested
    if (options?.showToast !== false) {
      toast.error(
        options?.title || 'Error',
        {
          description: typeof error === 'string' ? error : error.message
        }
      );
    }
    
    return errorData;
  }
  
  /**
   * Report errors to the chat interface - legacy compatibility method
   */
  public reportErrors(): ErrorData[] {
    // This would handle sending errors to a chat interface
    return this.getErrors();
  }
  
  /**
   * Send error to chat interface - legacy compatibility method
   */
  public sendErrorToChat(
    error: string | Error | ErrorDisplayOptions,
    details?: any,
    component?: string
  ): void {
    // Handle the different parameter types
    if (typeof error === 'object' && !('message' in error)) {
      // It's an ErrorDisplayOptions
      const options = error as ErrorDisplayOptions;
      console.log('Would send to chat interface with options:', options);
      return;
    }
    
    // Normal error handling
    const errorData = this.captureError(
      error as string | Error, 
      { component, details }
    );
    
    console.log('Would send to chat interface:', errorData);
  }
}

// Export a singleton instance
export const errorCollector = ErrorCollector.getInstance();
