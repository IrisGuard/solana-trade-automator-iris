
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
      
      return () => {
        if (typeof originalFetch === 'function') {
          window.fetch = originalFetch;
        }
        fetchInterceptorActive.current = false;
      };
    }
    
    return () => {};
  }, [reportError]);
  
  return null; // This is a monitoring component, no UI
}
