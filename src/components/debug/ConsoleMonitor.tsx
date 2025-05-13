
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
  const { reportError, sendErrorToChat } = useErrorReporting();

  // Παρακολούθηση του console.error και console.warn
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
        
        // Εμφάνιση toast με επιλογή αποστολής στο chat
        toast.error(`Σφάλμα: ${errorMessage.substring(0, 50)}${errorMessage.length > 50 ? '...' : ''}`, {
          description: "Πατήστε για αποστολή στο chat",
          duration: 5000,
          action: {
            label: "Αποστολή",
            onClick: () => {
              if (errorObject) {
                sendErrorToChat(errorMessage, errorObject.stack);
              } else {
                sendErrorToChat(errorMessage);
              }
            }
          }
        });
        
        // Αυτόματη αποστολή στο σύστημα αναφοράς σφαλμάτων
        if (errorObject) {
          reportError(errorObject, {
            showToast: false,
            sendToChatInterface: true
          });
        } else {
          reportError(errorMessage, {
            showToast: false,
            sendToChatInterface: true
          });
        }
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

    // Δημιουργία χειριστή για το lovable-error event
    const handleLovableError = (event: CustomEvent) => {
      // Το event έχει ήδη δημιουργηθεί, οπότε δεν χρειάζεται επιπλέον επεξεργασία
      console.log("Λήφθηκε lovable-error event:", event.detail);
    };

    // Προσθήκη του event listener
    window.addEventListener('lovable-error', handleLovableError as EventListener);

    // Καθαρισμός κατά την απομόντωση
    return () => {
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
      window.removeEventListener('lovable-error', handleLovableError as EventListener);
    };
  }, [reportError, sendErrorToChat]);

  // Προσθήκη περιοδικού ελέγχου για νέα σφάλματα στο lovable_chat_errors
  useEffect(() => {
    const checkErrorsInterval = setInterval(() => {
      try {
        const storedErrors = JSON.parse(localStorage.getItem('lovable_chat_errors') || '[]');
        if (storedErrors.length > 0) {
          // Εδώ μπορούμε να κάνουμε κάτι με τα νέα σφάλματα αν χρειαστεί
          localStorage.setItem('lovable_chat_errors', '[]'); // Καθαρισμός αφού τα ελέγξαμε
        }
      } catch (e) {
        // Σιωπηλή αποτυχία
      }
    }, 5000); // Έλεγχος κάθε 5 δευτερόλεπτα

    return () => clearInterval(checkErrorsInterval);
  }, []);

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
