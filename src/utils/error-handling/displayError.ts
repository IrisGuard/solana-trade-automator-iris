
import { toast } from 'sonner';
import { errorCollector } from './collector';
import type { ErrorDisplayOptions } from './types';

/**
 * Εμφανίζει ένα σφάλμα στο UI και προαιρετικά το καταγράφει
 * 
 * @param error Το σφάλμα προς εμφάνιση
 * @param options Επιλογές για τον τρόπο εμφάνισης και καταγραφής του σφάλματος
 */
export function displayError(
  error: string | Error,
  options?: ErrorDisplayOptions
) {
  const {
    toastDuration = 5000,
    component = 'unknown',
    details = {},
    source = 'client',
    showToast = true
  } = options || {};
  
  // Μετατροπή του σφάλματος σε μορφή string αν δεν είναι ήδη
  const errorMessage = typeof error === 'string' 
    ? error 
    : error.message || 'Άγνωστο σφάλμα';
  
  // Καταγραφή του σφάλματος στην κονσόλα
  console.error(`[${component}] ${errorMessage}`, error);
  
  // Καταγραφή στο σύστημα συλλογής σφαλμάτων
  errorCollector.captureError(typeof error === 'string' ? new Error(error) : error, {
    component,
    details,
    source
  });
  
  // Εμφάνιση του σφάλματος σε toast αν επιθυμούμε
  if (showToast) {
    toast.error(errorMessage, {
      duration: toastDuration,
      description: source === 'server' 
        ? 'Σφάλμα διακομιστή' 
        : 'Σφάλμα εφαρμογής',
    });
  }
  
  // Επιστρέφουμε το error message για ευκολία
  return errorMessage;
}

// Εξάγουμε τον τύπο ώστε να είναι διαθέσιμος στον κώδικα
export type { ErrorDisplayOptions };

/**
 * Εμφανίζει ένα προειδοποιητικό μήνυμα στο UI
 */
export function displayWarning(message: string, duration: number = 5000) {
  toast.warning(message, { duration });
  return message;
}

/**
 * Εμφανίζει ένα πληροφοριακό μήνυμα στο UI
 */
export function displayInfo(message: string, duration: number = 5000) {
  toast.info(message, { duration });
  return message;
}

/**
 * Εμφανίζει ένα μήνυμα επιτυχίας στο UI
 */
export function displaySuccess(message: string, duration: number = 5000) {
  toast.success(message, { duration });
  return message;
}

/**
 * Στέλνει ένα σφάλμα στο chat
 * Λειτουργικότητα που προς το παρόν παρέχει stub
 */
export function sendErrorToChat(error: string | Error, component?: string, details?: any) {
  // Placeholder για μελλοντική λειτουργικότητα
  console.log("Error would be sent to chat:", 
    typeof error === 'string' ? error : error.message,
    component || 'unknown',
    details || {});
}
