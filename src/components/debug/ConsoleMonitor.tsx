
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";
import { useErrorReporting } from "@/hooks/useErrorReporting";

interface LogRecord {
  type: 'error' | 'warn' | 'info';
  message: string;
  timestamp: Date;
}

export function ConsoleMonitor() {
  const [logs, setLogs] = useState<LogRecord[]>([]);
  const { reportError } = useErrorReporting();

  useEffect(() => {
    // Αποθηκεύστε τις αρχικές μεθόδους κονσόλας
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;

    // Αντικαταστήστε τη μέθοδο console.error
    console.error = (...args) => {
      // Καλέστε την αρχική μέθοδο
      originalConsoleError.apply(console, args);
      
      // Δημιουργήστε ένα μήνυμα για το σφάλμα
      let errorMessage = "";
      let errorObject: Error | null = null;

      if (args.length > 0) {
        if (args[0] instanceof Error) {
          errorMessage = args[0].message;
          errorObject = args[0];
        } else if (typeof args[0] === 'string') {
          errorMessage = args[0];
        } else {
          try {
            errorMessage = JSON.stringify(args[0]);
          } catch {
            errorMessage = "Μη αναγνώσιμο σφάλμα";
          }
        }
      }

      // Εμφάνιση toast μόνο για μη συνηθισμένα σφάλματα
      if (!errorMessage.includes('ResizeObserver') && 
          !errorMessage.includes('act(...)') &&
          !errorMessage.includes('findDOMNode') &&
          !errorMessage.includes('React does not recognize')) {
        
        // Προσθέστε το στο state
        const newLog: LogRecord = {
          type: 'error',
          message: errorMessage,
          timestamp: new Date()
        };
        
        setLogs(prev => [...prev, newLog]);
        
        // Αποστολή στο σύστημα αναφοράς σφαλμάτων
        if (errorObject) {
          reportError(errorObject, {showToast: false});
        } else {
          reportError(errorMessage, {showToast: false});
        }
        
        // Εμφάνιση toast
        toast.error("Σφάλμα εφαρμογής", {
          description: errorMessage.length > 100 
            ? errorMessage.substring(0, 100) + '...' 
            : errorMessage,
          icon: <AlertCircle className="h-4 w-4" />,
          duration: 5000
        });
      }
    };

    // Αντικαταστήστε τη μέθοδο console.warn
    console.warn = (...args) => {
      // Καλέστε την αρχική μέθοδο
      originalConsoleWarn.apply(console, args);
      
      // Δημιουργήστε ένα μήνυμα για την προειδοποίηση
      let warnMessage = "";
      if (args.length > 0) {
        if (typeof args[0] === 'string') {
          warnMessage = args[0];
        } else {
          try {
            warnMessage = JSON.stringify(args[0]);
          } catch {
            warnMessage = "Μη αναγνώσιμη προειδοποίηση";
          }
        }
      }

      // Προσθέστε το στο state
      const newLog: LogRecord = {
        type: 'warn',
        message: warnMessage,
        timestamp: new Date()
      };
      
      setLogs(prev => [...prev, newLog]);
    };

    // Καθαρισμός κατά την απομόντωση
    return () => {
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
    };
  }, [reportError]);

  // Αποθήκευση logs στο localStorage όταν αλλάζουν
  useEffect(() => {
    if (logs.length > 0) {
      try {
        // Κρατάμε μόνο τα τελευταία 50 logs για απόδοση
        const logsToStore = logs.slice(-50);
        localStorage.setItem('app_console_logs', JSON.stringify(logsToStore));
      } catch (e) {
        // Σιωπηλή αποτυχία αν δεν μπορούμε να αποθηκεύσουμε στο localStorage
      }
    }
  }, [logs]);

  // Δεν χρειάζεται να επιστρέψουμε JSX καθώς αυτό είναι ένα "αόρατο" component
  return null;
}
