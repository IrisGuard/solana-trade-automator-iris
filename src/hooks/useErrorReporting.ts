
import { toast } from "sonner";

interface ErrorReportingOptions {
  showToast?: boolean;
  logToConsole?: boolean;
}

export function useErrorReporting() {
  const defaultOptions: ErrorReportingOptions = {
    showToast: true,
    logToConsole: true,
  };

  const reportError = (error: Error | string, options: ErrorReportingOptions = defaultOptions) => {
    const errorMessage = typeof error === 'string' ? error : error.message;
    const errorStack = typeof error !== 'string' ? error.stack : undefined;
    
    // Εμφάνιση toast μηνύματος
    if (options.showToast) {
      toast.error(`Σφάλμα: ${errorMessage}`, {
        description: "Το σφάλμα καταγράφηκε αυτόματα.",
        duration: 5000,
      });
    }
    
    // Καταγραφή στην κονσόλα
    if (options.logToConsole) {
      console.error("Αυτόματη αναφορά σφάλματος:", {
        message: errorMessage,
        stack: errorStack,
        timestamp: new Date().toISOString(),
        url: window.location.href,
      });
    }
    
    // Εδώ μπορείτε να προσθέσετε κώδικα για αποστολή του σφάλματος σε κάποιο σύστημα καταγραφής
    // π.χ. Supabase, ή κάποια άλλη υπηρεσία παρακολούθησης σφαλμάτων
  };
  
  return { reportError };
}
