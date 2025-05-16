
/**
 * Utility to log console messages to localStorage for the error dashboard
 */

interface ConsoleLog {
  type: 'error' | 'warn' | 'info';
  message: string;
  timestamp: string;
}

const MAX_LOGS = 100;

export class ConsoleLogger {
  private static instance: ConsoleLogger;
  private originalConsoleError: typeof console.error;
  private originalConsoleWarn: typeof console.warn;
  private originalConsoleInfo: typeof console.info;
  
  private constructor() {
    // Store original console methods
    this.originalConsoleError = console.error;
    this.originalConsoleWarn = console.warn;
    this.originalConsoleInfo = console.info;
  }
  
  public static getInstance(): ConsoleLogger {
    if (!ConsoleLogger.instance) {
      ConsoleLogger.instance = new ConsoleLogger();
    }
    return ConsoleLogger.instance;
  }
  
  public initialize(): void {
    // Override console.error
    console.error = (...args) => {
      // Call original first
      this.originalConsoleError.apply(console, args);
      
      // Log to storage
      this.logToStorage('error', args);
    };
    
    // Override console.warn
    console.warn = (...args) => {
      // Call original first
      this.originalConsoleWarn.apply(console, args);
      
      // Log to storage
      this.logToStorage('warn', args);
    };
    
    // Override console.info
    console.info = (...args) => {
      // Call original first
      this.originalConsoleInfo.apply(console, args);
      
      // Log to storage
      this.logToStorage('info', args);
    };
  }
  
  public restore(): void {
    console.error = this.originalConsoleError;
    console.warn = this.originalConsoleWarn;
    console.info = this.originalConsoleInfo;
  }
  
  private logToStorage(type: 'error' | 'warn' | 'info', args: any[]): void {
    try {
      // Convert args to string
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ');
      
      // Create log entry
      const logEntry: ConsoleLog = {
        type,
        message,
        timestamp: new Date().toISOString()
      };
      
      // Get existing logs
      const logs: ConsoleLog[] = JSON.parse(localStorage.getItem('app_console_logs') || '[]');
      
      // Add new log at the beginning
      logs.unshift(logEntry);
      
      // Limit number of logs
      const limitedLogs = logs.slice(0, MAX_LOGS);
      
      // Save back to storage
      localStorage.setItem('app_console_logs', JSON.stringify(limitedLogs));
    } catch (error) {
      // Use original console to avoid infinite loop
      this.originalConsoleError('Error logging to storage:', error);
    }
  }
  
  public getLogs(): ConsoleLog[] {
    try {
      return JSON.parse(localStorage.getItem('app_console_logs') || '[]');
    } catch (error) {
      this.originalConsoleError('Error retrieving logs:', error);
      return [];
    }
  }
  
  public clearLogs(): void {
    localStorage.setItem('app_console_logs', '[]');
  }
}

// Create and export a singleton instance
export const consoleLogger = ConsoleLogger.getInstance();
