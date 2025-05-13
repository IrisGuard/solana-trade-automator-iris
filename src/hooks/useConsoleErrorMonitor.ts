
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useErrorReporting } from './useErrorReporting';

export function useConsoleErrorMonitor() {
  const { reportError, sendErrorToChat } = useErrorReporting();

  useEffect(() => {
    // Αποθηκεύστε την αρχική συνάρτηση console.error
    const originalConsoleError = console.error;

    // Αντικαταστήστε την με τη δική μας έκδοση
    console.error = (...args) => {
      // Καταγράψτε το σφάλμα με την αρχική μέθοδο
      originalConsoleError.apply(console, args);

      // Δημιουργήστε ένα ανθρώπινα αναγνώσιμο μήνυμα
      let errorMessage = "Σφάλμα στην εφαρμογή";
      let errorObject: Error | null = null;
      
      // Προσπαθήστε να εξάγετε ένα κατανοητό μήνυμα σφάλματος
      if (args.length > 0) {
        if (args[0] instanceof Error) {
          errorMessage = args[0].message;
          errorObject = args[0];
        } else if (typeof args[0] === 'string') {
          errorMessage = args[0];
        }
      }

      // Εμφάνιση toast για σφάλματα που δεν είναι συνηθισμένα ή αναμενόμενα
      // Αποφύγετε τα πολύ συχνά σφάλματα από βιβλιοθήκες
      if (!errorMessage.includes('ResizeObserver') && 
          !errorMessage.includes('act(...)') &&
          !errorMessage.includes('findDOMNode') &&
          !errorMessage.includes('React does not recognize')) {
        
        // Αναφορά σφάλματος μέσω του συστήματος αναφοράς
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
        
        // Εμφάνιση toast με επιλογή αποστολής στο chat
        toast.error("Σφάλμα στην εφαρμογή", {
          description: errorMessage.length > 100 
            ? errorMessage.substring(0, 100) + '...' 
            : errorMessage,
          action: {
            label: "Αποστολή στο chat",
            onClick: () => {
              if (errorObject) {
                sendErrorToChat(errorMessage, errorObject.stack);
              } else {
                sendErrorToChat(errorMessage);
              }
            }
          }
        });
      }
    };

    // Καθαρισμός κατά την απομόντωση
    return () => {
      console.error = originalConsoleError;
    };
  }, [reportError, sendErrorToChat]);
}
