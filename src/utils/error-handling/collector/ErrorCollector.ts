
import { v4 as uuidv4 } from 'uuid';

export interface ErrorData {
  id: string;
  message: string;
  stack?: string;
  timestamp: string;
  component?: string;
  source?: string;
  details?: any;
  resolved?: boolean;
}

export type ErrorOptions = {
  component?: string;
  details?: any;
  source?: string;
  logToConsole?: boolean;
  showToast?: boolean;
};

class ErrorCollector {
  private errors: ErrorData[] = [];
  private maxErrors: number = 100;

  constructor() {
    // Φόρτωση σφαλμάτων από το localStorage αν υπάρχουν
    try {
      const savedErrors = localStorage.getItem('errorCollector');
      if (savedErrors) {
        this.errors = JSON.parse(savedErrors);
      }
    } catch (e) {
      console.error('Failed to load errors from localStorage', e);
    }
  }

  public captureError(error: Error, options: ErrorOptions = {}): string {
    const { component = 'unknown', source = 'client', details } = options;
    
    const errorData: ErrorData = {
      id: uuidv4(),
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      component,
      source,
      details,
      resolved: false
    };

    this.errors.unshift(errorData);
    
    // Περιορισμός του μεγέθους του πίνακα σφαλμάτων
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors);
    }

    // Αποθήκευση στο localStorage
    try {
      localStorage.setItem('errorCollector', JSON.stringify(this.errors));
    } catch (e) {
      console.error('Failed to save errors to localStorage', e);
    }

    return errorData.id;
  }

  public getError(id: string): ErrorData | undefined {
    return this.errors.find(error => error.id === id);
  }

  public getAllErrors(): ErrorData[] {
    return [...this.errors];
  }

  public clearAllErrors(): void {
    this.errors = [];
    try {
      localStorage.removeItem('errorCollector');
    } catch (e) {
      console.error('Failed to clear errors from localStorage', e);
    }
  }

  public resolveError(id: string): void {
    const errorIndex = this.errors.findIndex(error => error.id === id);
    if (errorIndex !== -1) {
      this.errors[errorIndex].resolved = true;
      try {
        localStorage.setItem('errorCollector', JSON.stringify(this.errors));
      } catch (e) {
        console.error('Failed to save resolved error to localStorage', e);
      }
    }
  }
}

export const errorCollector = new ErrorCollector();
