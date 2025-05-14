import { v4 as uuidv4 } from 'uuid';

export interface ErrorData {
  message: string;
  stack?: string;
  timestamp?: number;
  details?: any;
  source?: string;
  component?: string;
}

export class ErrorCollector {
  private errors: Map<string, ErrorData> = new Map();
  private maxErrors: number = 100;

  constructor(maxErrors?: number) {
    if (maxErrors) {
      this.maxErrors = maxErrors;
    }
  }

  /**
   * Add an error to the collector
   * @param error The error data to add
   * @returns The error ID
   */
  addError(error: ErrorData): string {
    const errorId = uuidv4().substring(0, 8);
    const errorWithTimestamp = {
      ...error,
      timestamp: error.timestamp || Date.now()
    };

    this.errors.set(errorId, errorWithTimestamp);

    // Keep error count within limits
    if (this.errors.size > this.maxErrors) {
      const oldestKey = this.getOldestErrorKey();
      if (oldestKey) {
        this.errors.delete(oldestKey);
      }
    }

    return errorId;
  }

  /**
   * Log error and notify systems
   * @param error The error object
   * @param component Optional component name
   */
  logErrorAndNotify(error: Error, component?: string): string {
    return this.addError({
      message: error.message,
      stack: error.stack,
      source: 'client',
      component,
      details: {
        browserInfo: {
          userAgent: navigator.userAgent,
          language: navigator.language
        },
        url: window.location.href
      }
    });
  }

  /**
   * Get an error by its ID
   * @param errorId The error ID
   */
  getError(errorId: string): ErrorData | undefined {
    return this.errors.get(errorId);
  }

  /**
   * Get all errors
   */
  getAllErrors(): ErrorData[] {
    return Array.from(this.errors.values());
  }

  /**
   * Get the number of stored errors
   */
  getErrorCount(): number {
    return this.errors.size;
  }

  /**
   * Clear all errors
   */
  clearErrors(): void {
    this.errors.clear();
  }

  /**
   * Get all errors as a map
   */
  getErrorMap(): Map<string, ErrorData> {
    return new Map(this.errors);
  }

  /**
   * Get all error IDs
   */
  getErrorIds(): string[] {
    return Array.from(this.errors.keys());
  }

  /**
   * Get most recent errors
   * @param count Number of errors to return
   */
  getRecentErrors(count: number = 10): ErrorData[] {
    return Array.from(this.errors.values())
      .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
      .slice(0, count);
  }

  /**
   * Get the oldest error key
   */
  private getOldestErrorKey(): string | null {
    if (this.errors.size === 0) return null;

    let oldestTimestamp = Infinity;
    let oldestKey: string | null = null;

    this.errors.forEach((error, key) => {
      const timestamp = error.timestamp || 0;
      if (timestamp < oldestTimestamp) {
        oldestTimestamp = timestamp;
        oldestKey = key;
      }
    });

    return oldestKey;
  }
}

// Create and export a singleton instance
export const errorCollector = new ErrorCollector();
