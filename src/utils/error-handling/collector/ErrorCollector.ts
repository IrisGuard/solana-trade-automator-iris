import { toast } from "sonner";
import { reportErrorToSupabase } from "../displayError";
import type { ErrorData, ErrorOptions } from "./types";

class ErrorCollector {
  private errors: ErrorData[] = [];
  private maxErrors: number = 100;

  constructor() {
    // Initialize the error collector
  }

  /**
   * Capture an error and store it in the collector
   */
  captureError(error: Error, options: ErrorOptions = {}): ErrorData {
    const {
      component = "unknown",
      details = {},
      source = "client"
    } = options;

    const errorData: ErrorData = {
      message: error.message,
      stack: error.stack,
      component,
      details: details ? JSON.stringify(details) : undefined,
      source,
      url: window.location.href,
      browserInfo: {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform
      },
      timestamp: new Date().toISOString()
    };

    this.errors.push(errorData);

    // Keep only the most recent errors
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }

    // Optionally report to Supabase if connected
    if (options.reportToServer !== false) {
      reportErrorToSupabase(error, {
        component,
        details,
        stack: error.stack,
        url: window.location.href
      }).catch(err => {
        console.error("Failed to report error to server:", err);
      });
    }

    return errorData;
  }

  /**
   * Get all collected errors
   */
  getAllErrors(): ErrorData[] {
    return this.errors;
  }

  /**
   * Clear all collected errors
   */
  clearAllErrors(): void {
    this.errors = [];
    console.log("All errors cleared");
  }

  /**
   * Get the most recent error
   */
  getLastError(): ErrorData | null {
    if (this.errors.length === 0) {
      return null;
    }
    return this.errors[this.errors.length - 1];
  }

  /**
   * Show all errors in the console
   */
  logAllErrors(): void {
    console.group("All captured errors:");
    this.errors.forEach((err, index) => {
      console.groupCollapsed(`Error ${index + 1}: ${err.message}`);
      console.log("Error details:", err);
      console.groupEnd();
    });
    console.groupEnd();
  }

  /**
   * Show all errors as toasts
   */
  showAllErrorsAsToasts(): void {
    this.errors.forEach(err => {
      toast.error(err.message, {
        description: `Component: ${err.component || 'unknown'}`,
        duration: 5000,
        id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      });
    });
  }
}

// Create a singleton instance
export const errorCollector = new ErrorCollector();

// Export types
export type { ErrorData };
