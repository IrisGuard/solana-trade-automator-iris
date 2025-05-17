
import { toast } from "sonner";
import { BotError } from "./errorTypes";

interface ErrorEntry {
  id: string;
  level: 'INFO' | 'WARNING' | 'CRITICAL';
  message: string;
  source: string;
  stackTrace?: string;
  timestamp: number;
  autoResolved?: boolean;
}

class ErrorManager {
  private errors: ErrorEntry[] = [];
  private maxErrors = 50;
  private autoFixers: Array<(error: BotError) => Promise<boolean>> = [];

  constructor() {
    // Restore any errors from localStorage
    try {
      const savedErrors = localStorage.getItem('errorManager.errors');
      if (savedErrors) {
        this.errors = JSON.parse(savedErrors).slice(0, this.maxErrors);
      }
    } catch (e) {
      console.error("Failed to restore errors from localStorage", e);
    }
  }

  registerAutoFixer(fixer: (error: BotError) => Promise<boolean>): void {
    this.autoFixers.push(fixer);
  }

  async handleError(error: Error | BotError, source: string): Promise<string> {
    const id = `error-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const level = this.determineSeverity(error);
    
    const errorEntry: ErrorEntry = {
      id,
      level,
      message: error.message || "Unknown error",
      source,
      stackTrace: error.stack,
      timestamp: Date.now()
    };

    // Add error to the beginning of the array
    this.errors.unshift(errorEntry);
    
    // Trim the array if it exceeds maxErrors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors);
    }

    // Save to localStorage
    try {
      localStorage.setItem('errorManager.errors', JSON.stringify(this.errors));
    } catch (e) {
      console.error("Failed to save errors to localStorage", e);
    }

    // Try to auto-fix BotErrors
    if ('isBotError' in error && error.isBotError) {
      const botError = error as BotError;
      for (const fixer of this.autoFixers) {
        try {
          const fixed = await fixer(botError);
          if (fixed) {
            // Mark as auto-resolved
            this.markAsResolved(id, true);
            break;
          }
        } catch (fixerError) {
          console.error("Error in auto-fixer:", fixerError);
        }
      }
    }

    return id;
  }

  getRecentErrors(): ErrorEntry[] {
    return [...this.errors];
  }

  clearErrors(): void {
    this.errors = [];
    localStorage.removeItem('errorManager.errors');
  }

  markAsResolved(id: string, autoResolved = false): boolean {
    const errorIndex = this.errors.findIndex(e => e.id === id);
    if (errorIndex >= 0) {
      this.errors[errorIndex] = {
        ...this.errors[errorIndex],
        autoResolved
      };
      
      try {
        localStorage.setItem('errorManager.errors', JSON.stringify(this.errors));
      } catch (e) {
        console.error("Failed to save errors to localStorage", e);
      }
      
      return true;
    }
    return false;
  }

  private determineSeverity(error: Error): 'INFO' | 'WARNING' | 'CRITICAL' {
    const message = error.message.toLowerCase();
    
    // Network errors are typically critical
    if (message.includes('network') || 
        message.includes('fetch') || 
        message.includes('api') || 
        message.includes('timeout')) {
      return 'CRITICAL';
    }
    
    // User interface or validation errors are warnings
    if (message.includes('validation') || 
        message.includes('input') || 
        message.includes('form')) {
      return 'WARNING';
    }
    
    // Default to INFO for other errors
    return 'INFO';
  }
}

// Singleton instance
export const errorManager = new ErrorManager();
