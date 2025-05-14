
import { useEffect, useRef } from 'react';
import { useErrorReporting } from '@/hooks/useErrorReporting';
import { errorCollector } from '@/utils/error-handling/collector';

interface GlobalErrorHandlerProps {
  children: React.ReactNode;
}

export function GlobalErrorHandler({ children }: GlobalErrorHandlerProps) {
  const { reportError } = useErrorReporting();
  const errorHandlerSet = useRef(false);

  useEffect(() => {
    if (errorHandlerSet.current) return;
    
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;
    
    // Override console.error
    console.error = (...args: any[]) => {
      // Call the original console.error
      originalConsoleError.apply(console, args);
      
      // Extract error message or object
      const errorMessage = args.map(arg => {
        if (arg instanceof Error) {
          return arg.message;
        } else if (typeof arg === 'string') {
          return arg;
        } else {
          try {
            return JSON.stringify(arg);
          } catch {
            return String(arg);
          }
        }
      }).join(' ');
      
      // Create an error object if a string was passed
      const errorObject = args[0] instanceof Error 
        ? args[0] 
        : new Error(errorMessage);
      
      // Report the error
      errorCollector.addError({
        message: errorObject.message,
        stack: errorObject.stack,
        timestamp: new Date().toISOString(),
        component: 'GlobalErrorHandler',
        source: 'console'
      });
    };
    
    // Override console.warn
    console.warn = (...args: any[]) => {
      // Call the original console.warn
      originalConsoleWarn.apply(console, args);
      
      // Extract warning message
      const warningMessage = args.map(arg => {
        if (typeof arg === 'string') {
          return arg;
        } else {
          try {
            return JSON.stringify(arg);
          } catch {
            return String(arg);
          }
        }
      }).join(' ');
      
      // Report the warning as an info message
      errorCollector.addError({
        message: `Warning: ${warningMessage}`,
        timestamp: new Date().toISOString(),
        component: 'GlobalErrorHandler',
        source: 'console'
      });
    };
    
    // Global error handler
    const handleGlobalError = (event: ErrorEvent) => {
      event.preventDefault();
      const error = event.error || new Error(event.message);
      reportError(error, {
        component: 'Window',
        source: 'global',
        details: {
          fileName: event.filename,
          lineNumber: event.lineno,
          columnNumber: event.colno
        }
      });
    };
    
    // Unhandled promise rejection handler
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      event.preventDefault();
      const error = event.reason instanceof Error 
        ? event.reason 
        : new Error(String(event.reason));
      
      reportError(error, {
        component: 'Promise',
        source: 'unhandledRejection'
      });
    };
    
    // Add event listeners
    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    errorHandlerSet.current = true;
    
    // Cleanup
    return () => {
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [reportError]);
  
  return <>{children}</>;
}
