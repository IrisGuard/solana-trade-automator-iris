
import { toast } from 'sonner';
import { errorCollector } from './collector';
import { ErrorOptions } from './types';

/**
 * Εμφανίζει ένα σφάλμα με διαφορετικούς τρόπους ανάλογα με τις επιλογές
 * 
 * @param error Το σφάλμα που θα εμφανιστεί
 * @param options Επιλογές εμφάνισης του σφάλματος
 */
export function displayError(error: Error | string, options: ErrorOptions = {}) {
  const {
    showToast = true,
    logToConsole = true,
    useCollector = true,
    title = 'Σφάλμα',
    component = 'unknown',
    details = {},
    source = 'client'
  } = options;

  // Μετατροπή του error σε string αν είναι Error object
  const errorMessage = error instanceof Error ? error.message : error;

  // Εμφάνιση toast αν ζητήθηκε
  if (showToast) {
    toast.error(title, {
      description: errorMessage,
      duration: 5000
    });
  }

  // Καταγραφή στην κονσόλα αν ζητήθηκε
  if (logToConsole) {
    console.error(`[${component}] ${errorMessage}`, details);
  }

  // Προσθήκη στον collector αν ζητήθηκε
  if (useCollector) {
    const errorObj = error instanceof Error ? error : new Error(errorMessage);
    errorCollector.captureError(errorObj, {
      component,
      details,
      source
    });
  }

  return { 
    success: false, 
    error: errorMessage 
  };
}

/**
 * Αποστέλλει ένα σφάλμα στο chat υποστήριξης
 */
export function sendErrorToChat(errorMessage: string, component: string = 'unknown', details: any = {}) {
  console.log('Sending error to support chat:', {
    error: errorMessage,
    component,
    details,
    timestamp: new Date().toISOString()
  });

  // Εδώ θα μπορούσε να υπάρχει κώδικας για αποστολή στο chat
  // αλλά για την ώρα απλά καταγράφουμε το σφάλμα
  
  return {
    success: true,
    message: 'Error sent to support'
  };
}

// Για λόγους συμβατότητας με τον παλιό κώδικα
export { displayError as logError };
