
import { errorCollector } from './collector';

class ConsoleLogger {
  private originalConsoleError: typeof console.error;
  private originalConsoleWarn: typeof console.warn;
  private originalConsoleInfo: typeof console.info;
  private initialized: boolean = false;

  constructor() {
    this.originalConsoleError = console.error;
    this.originalConsoleWarn = console.warn;
    this.originalConsoleInfo = console.info;
  }

  public initialize() {
    // Prevent double initialization
    if (this.initialized) {
      return;
    }
    
    this.initialized = true;
    
    // Override console.error
    console.error = (...args) => {
      // Call original first
      this.originalConsoleError.apply(console, args);
      
      try {
        const message = args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
        ).join(' ');
        
        // Skip logging for known monitoring messages to avoid cycles
        if (message.includes('[ErrorCollector]') || 
            message.includes('[ConsoleLogger]')) {
          return;
        }
        
        // Log to error collector if this is likely an application error
        if (message.includes('Error:') || 
            message.includes('TypeError:') ||
            message.includes('ReferenceError:') ||
            message.includes('Failed to') ||
            message.includes('Uncaught')) {
          
          errorCollector.captureError(new Error(message), {
            component: 'ConsoleError',
            source: 'client',
            severity: 'medium'
          });
        }
      } catch (e) {
        // Use original to avoid potential infinite loops
        this.originalConsoleError('[ConsoleLogger] Error in console.error override:', e);
      }
    };
    
    // Override console.warn
    console.warn = (...args) => {
      // Call original first
      this.originalConsoleWarn.apply(console, args);
      
      try {
        const message = args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
        ).join(' ');
        
        // Skip logging for known monitoring messages
        if (message.includes('[ErrorCollector]') || 
            message.includes('[ConsoleLogger]')) {
          return;
        }
        
        // Log critical warnings
        if (message.includes('Critical') || 
            message.includes('critical issue') || 
            message.includes('security')) {
          
          errorCollector.captureError(new Error(`Warning: ${message}`), {
            component: 'ConsoleWarn',
            source: 'client',
            severity: 'medium'
          });
        }
      } catch (e) {
        this.originalConsoleError('[ConsoleLogger] Error in console.warn override:', e);
      }
    };
  }

  public restore() {
    if (!this.initialized) {
      return;
    }
    
    console.error = this.originalConsoleError;
    console.warn = this.originalConsoleWarn;
    console.info = this.originalConsoleInfo;
    this.initialized = false;
  }
}

export const consoleLogger = new ConsoleLogger();
