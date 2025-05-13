
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useErrorReporting } from './useErrorReporting';

export function useConsoleErrorMonitor() {
  const { reportError } = useErrorReporting();

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

      // Έλεγχος για αποφυγή διπλότυπων σφαλμάτων (συχνά εμφανίζονται πολλαπλά ίδια σφάλματα)
      const now = Date.now();
      const lastErrorKey = 'last_console_error';
      const lastErrorTimeKey = 'last_console_error_time';
      
      const lastError = sessionStorage.getItem(lastErrorKey);
      const lastErrorTimeStr = sessionStorage.getItem(lastErrorTimeKey);
      const lastErrorTime = lastErrorTimeStr ? parseInt(lastErrorTimeStr) : 0;
      
      // Έλεγχος αν το ίδιο σφάλμα έχει ήδη καταγραφεί πρόσφατα (τελευταία 3 δευτερόλεπτα)
      const isDuplicate = lastError === errorMessage && (now - lastErrorTime) < 3000;
      
      if (!isDuplicate) {
        // Αποθήκευση του τρέχοντος σφάλματος ως το τελευταίο που καταγράφηκε
        sessionStorage.setItem(lastErrorKey, errorMessage);
        sessionStorage.setItem(lastErrorTimeKey, now.toString());
        
        // Εμφάνιση toast για σφάλματα που δεν είναι συνηθισμένα ή αναμενόμενα
        // Αποφύγετε τα πολύ συχνά σφάλματα από βιβλιοθήκες
        if (!errorMessage.includes('ResizeObserver') && 
            !errorMessage.includes('act(...)') &&
            !errorMessage.includes('findDOMNode') &&
            !errorMessage.includes('React does not recognize')) {
          
          // Αναφορά σφάλματος μέσω του συστήματος αναφοράς
          if (errorObject) {
            reportError(errorObject, {
              showToast: false, // Αλλαγή σε false για να αποφύγουμε το διπλό παράθυρο
              sendToChatInterface: true
            });
          } else {
            reportError(errorMessage, {
              showToast: false, // Αλλαγή σε false για να αποφύγουμε το διπλό παράθυρο
              sendToChatInterface: true
            });
          }
        }
      }
    };

    // Καθαρισμός κατά την απομόντωση
    return () => {
      console.error = originalConsoleError;
    };
  }, [reportError]);
}
