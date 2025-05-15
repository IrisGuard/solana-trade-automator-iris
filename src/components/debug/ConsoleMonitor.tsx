
import React, { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { useErrorReporting } from "@/hooks/useErrorReporting";
import { displayError } from "@/utils/error-handling/displayError";

interface LogRecord {
  type: 'error' | 'warn' | 'info';
  message: string;
  timestamp: Date;
}

// Utility to avoid duplicate error notifications
const errorCache = new Map<string, number>();
const ERROR_NOTIFICATION_COOLDOWN = 30000; // 30 seconds

export function ConsoleMonitor() {
  const [logs, setLogs] = useState<LogRecord[]>([]);
  const { reportError } = useErrorReporting();
  const fetchInterceptorActive = useRef(false);
  
  // Track how many API errors we've seen recently
  const recentApiErrors = useRef<{count: number, lastReset: number}>({
    count: 0,
    lastReset: Date.now()
  });
  
  useEffect(() => {
    // Original console methods
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;
    
    // Override console.error to capture errors
    console.error = (...args: any[]) => {
      // Call original first to ensure it's displayed
      originalConsoleError.apply(console, args);
      
      try {
        const message = args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
        ).join(' ');
        
        // Add to logs
        setLogs(prev => [
          { type: 'error', message, timestamp: new Date() },
          ...prev.slice(0, 99) // Keep maximum 100 logs
        ]);
        
        // Check for known error patterns and avoid duplicate notifications
        const errorKey = message.slice(0, 100); // Use first 100 chars as key
        const lastNotified = errorCache.get(errorKey) || 0;
        const now = Date.now();
        
        if (now - lastNotified > ERROR_NOTIFICATION_COOLDOWN) {
          errorCache.set(errorKey, now);
          
          // Only handle critical errors that match certain patterns
          if (
            message.includes('Failed to fetch') || 
            message.includes('NetworkError') ||
            message.includes('TypeError') ||
            message.includes('Unhandled error')
          ) {
            // Create an error object to report
            const error = new Error(message);
            reportError(error, {
              component: 'ConsoleMonitor',
              source: 'client',
              severity: 'medium'
            });
          }
        }
      } catch (e) {
        // Do nothing, don't want to create infinite loops
        originalConsoleError('Error in console.error override:', e);
      }
    };
    
    // Override console.warn to capture warnings
    console.warn = (...args: any[]) => {
      // Call original first
      originalConsoleWarn.apply(console, args);
      
      try {
        const message = args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
        ).join(' ');
        
        // Add to logs
        setLogs(prev => [
          { type: 'warn', message, timestamp: new Date() },
          ...prev.slice(0, 99)
        ]);
      } catch (e) {
        // Handle quietly
        originalConsoleError('Error in console.warn override:', e);
      }
    };
    
    // Set up fetch interceptor to monitor API calls if not already active
    if (!fetchInterceptorActive.current) {
      fetchInterceptorActive.current = true;
      
      const originalFetch = window.fetch;
      window.fetch = async (input, init) => {
        const startTime = performance.now();
        try {
          const response = await originalFetch(input, init);
          
          // Log slow API calls
          const elapsed = performance.now() - startTime;
          if (elapsed > 5000) { // 5 seconds
            console.warn(`Slow API call to ${input} took ${elapsed.toFixed(2)}ms`);
          }
          
          // Return response if successful
          if (response.ok) return response;
          
          // Track API errors
          const now = Date.now();
          if (now - recentApiErrors.current.lastReset > 60000) {
            // Reset counter after a minute
            recentApiErrors.current = { count: 1, lastReset: now };
          } else {
            recentApiErrors.current.count++;
          }
          
          // Alert if we've seen multiple API errors recently
          if (recentApiErrors.current.count >= 3) {
            toast.error("Πολλαπλά σφάλματα API", {
              description: "Παρουσιάστηκαν πολλαπλά σφάλματα στην επικοινωνία με το API."
            });
            recentApiErrors.current.count = 0; // Reset to avoid spamming
          }
          
          return response;
        } catch (error) {
          // Network errors or CORS issues
          console.error(`API call to ${input} failed:`, error);
          throw error;
        }
      };
    }
    
    // Cleanup function
    return () => {
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
    };
  }, [reportError]);
  
  return null; // This is a monitoring component, no UI
}
