
import React, { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { useErrorReporting } from "@/hooks/useErrorReporting";
import { displayError } from "@/utils/errorUtils";

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

  // Resets the API error counter periodically
  useEffect(() => {
    const resetInterval = setInterval(() => {
      recentApiErrors.current = {
        count: 0,
        lastReset: Date.now()
      };
    }, 60000); // Reset counter every minute
    
    return () => clearInterval(resetInterval);
  }, []);

  // Παρακολούθηση των σφαλμάτων API
  useEffect(() => {
    // Avoid setting up multiple interceptors
    if (fetchInterceptorActive.current) {
      return () => {};
    }
  
    const handleFetchErrors = () => {
      fetchInterceptorActive.current = true;
      
      // Δημιουργία αντικαταστάτη για την fetch API
      const originalFetch = window.fetch;
      window.fetch = async (...args) => {
        try {
          const response = await originalFetch(...args);
          
          // Έλεγχος για HTTP σφάλματα
          if (!response.ok) {
            const url = typeof args[0] === 'string' 
              ? args[0] 
              : (args[0] instanceof Request ? args[0].url : 'unknown');
            
            const errorMessage = `HTTP ${response.status}: ${response.statusText} - ${url}`;
            
            // Check if this is a rate limit error (HTTP 429)
            const isRateLimit = response.status === 429;
            
            // Extract domain for categorization
            let domain = 'unknown';
            try {
              const urlObj = new URL(url);
              domain = urlObj.hostname;
            } catch (e) {
              // Ignore URL parsing errors
            }
            
            // Create a cache key based on status code and URL pattern
            const cacheKey = `${response.status}-${domain}`;
            const now = Date.now();
            const lastNotification = errorCache.get(cacheKey) || 0;
            
            // Only show notifications if we haven't shown one recently for this error type
            if (now - lastNotification > ERROR_NOTIFICATION_COOLDOWN) {
              errorCache.set(cacheKey, now);
              
              // Handle different error categories
              if (isRateLimit) {
                // Just log rate limits, don't display them (handled elsewhere)
                console.warn(`Rate limit detected for ${domain}`);
              } else if (url.includes('supabase') || url.includes('lvkbyfocssuzcdphpmfu')) {
                // Handle Supabase errors
                if (response.status >= 500) {
                  displayError(new Error(errorMessage), {
                    title: 'Σφάλμα Supabase Server',
                    showToast: true,
                    logToConsole: true,
                    sendToChat: false
                  });
                } else {
                  console.warn(`Supabase client error: ${errorMessage}`);
                }
              } else if (response.status >= 500) {
                // Track API error frequency to avoid flooding
                recentApiErrors.current.count++;
                
                // Only show error if we haven't shown too many
                if (recentApiErrors.current.count <= 3) {
                  displayError(new Error(errorMessage), {
                    title: 'Σφάλμα API Server',
                    showToast: true,
                    logToConsole: true,
                    sendToChat: false
                  });
                } else if (recentApiErrors.current.count === 4) {
                  // Show a consolidated message when we hit too many errors
                  toast.error('Πολλαπλά σφάλματα API', {
                    description: 'Ορισμένα αιτήματα αποτυγχάνουν. Θα συνεχίσουμε να προσπαθούμε.',
                    id: 'multiple-api-errors',
                    duration: 5000
                  });
                }
              }
            }
          }
          
          return response;
        } catch (error: any) {
          // Determine if this is a CORS or network error
          const isCorsError = error.message?.includes('CORS') || error.name === 'TypeError';
          const isNetworkError = error.name === 'TypeError' || error.message?.includes('NetworkError');
          
          // Create a cache key for this type of error
          const cacheKey = isNetworkError ? 'network-error' : 
                          (isCorsError ? 'cors-error' : 'fetch-error');
          
          const now = Date.now();
          const lastNotification = errorCache.get(cacheKey) || 0;
          
          // Only show notifications if we haven't shown one recently for this error type
          if (now - lastNotification > ERROR_NOTIFICATION_COOLDOWN) {
            errorCache.set(cacheKey, now);
            
            if (isNetworkError) {
              displayError(new Error('Network error: check your internet connection'), {
                title: 'Σφάλμα δικτύου',
                showToast: true,
                logToConsole: true,
                sendToChat: false
              });
            } else if (isCorsError) {
              console.warn('CORS error detected:', error);
            } else {
              displayError(error, {
                title: 'Σφάλμα δικτύου',
                showToast: true,
                logToConsole: true,
                sendToChat: false
              });
            }
          }
          throw error;
        }
      };
      
      // Καθαρισμός
      return () => {
        window.fetch = originalFetch;
        fetchInterceptorActive.current = false;
      };
    };
    
    return handleFetchErrors();
  }, [reportError]);

  // Δεν χρειάζεται να επιστρέψουμε JSX καθώς αυτό είναι ένα "αόρατο" component
  return null;
}
