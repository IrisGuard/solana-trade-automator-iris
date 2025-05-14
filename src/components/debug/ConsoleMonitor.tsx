
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useErrorReporting } from "@/hooks/useErrorReporting";
import { clearAllErrors } from "@/utils/errorTestUtils";
import { displayError } from "@/utils/errorUtils";

interface LogRecord {
  type: 'error' | 'warn' | 'info';
  message: string;
  timestamp: Date;
}

export function ConsoleMonitor() {
  const [logs, setLogs] = useState<LogRecord[]>([]);
  const { reportError } = useErrorReporting();

  // Παρακολούθηση των σφαλμάτων API
  useEffect(() => {
    const handleFetchErrors = () => {
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
            
            // Αν είναι σφάλμα Supabase, το εμφανίζουμε
            if (url.includes('supabase') || url.includes('lvkbyfocssuzcdphpmfu')) {
              displayError(new Error(errorMessage), {
                title: 'Σφάλμα Supabase',
                showToast: true,
                logToConsole: true,
                sendToChat: true
              });
            } else if (response.status >= 500) {
              // Σοβαρό σφάλμα σε API
              displayError(new Error(errorMessage), {
                title: 'Σοβαρό σφάλμα API',
                showToast: true,
                logToConsole: true,
                sendToChat: true
              });
            }
          }
          
          return response;
        } catch (error: any) {
          // Σφάλμα δικτύου ή CORS
          displayError(error, {
            title: 'Σφάλμα δικτύου',
            showToast: true,
            logToConsole: true,
            sendToChat: true
          });
          throw error;
        }
      };
      
      // Καθαρισμός
      return () => {
        window.fetch = originalFetch;
      };
    };
    
    return handleFetchErrors();
  }, []);

  // Δεν χρειάζεται να επιστρέψουμε JSX καθώς αυτό είναι ένα "αόρατο" component
  return null;
}
