
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useErrorReporting } from './useErrorReporting';
import { clearAllErrors } from '@/utils/errorTestUtils';

export function useConsoleErrorMonitor() {
  const { reportError } = useErrorReporting();

  useEffect(() => {
    // Καθαρισμός όλων των σφαλμάτων αρχικά
    clearAllErrors();

    // Αποθηκεύστε την αρχική συνάρτηση console.error
    const originalConsoleError = console.error;

    // Μεταβλητές για αποφυγή διπλότυπων σφαλμάτων
    let lastErrorMessage = '';
    let lastErrorTime = 0;
    const errorDedupeDelay = 5000; // 5 δευτερόλεπτα

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

      // Έλεγχος για διπλότυπα σφάλματα
      const now = Date.now();
      const isDuplicate = (errorMessage === lastErrorMessage) && ((now - lastErrorTime) < errorDedupeDelay);

      if (!isDuplicate) {
        // Καταγραφή του τρέχοντος σφάλματος
        lastErrorMessage = errorMessage;
        lastErrorTime = now;
        
        // Αποφεύγουμε τα συνήθη σφάλματα από βιβλιοθήκες
        if (!errorMessage.includes('ResizeObserver') && 
            !errorMessage.includes('act(...)') &&
            !errorMessage.includes('findDOMNode') &&
            !errorMessage.includes('React does not recognize') &&
            !errorMessage.includes('Missing `Description`')) {
          
          // Καθαρισμός υπαρχόντων σφαλμάτων πριν την εμφάνιση νέου
          clearAllErrors();
          
          // Μικρή καθυστέρηση πριν την αναφορά νέου σφάλματος
          setTimeout(() => {
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
          }, 300);
        }
      }
    };

    // Καθαρισμός κατά την απομόντωση
    return () => {
      console.error = originalConsoleError;
    };
  }, [reportError]);
}
