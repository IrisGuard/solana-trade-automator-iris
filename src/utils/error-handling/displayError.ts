
import { toast } from 'sonner';
import { ErrorDisplayOptions } from './types';
import { errorCollector } from './collector';

/**
 * Εμφανίζει ένα σφάλμα με διάφορους τρόπους ανάλογα με τις παραμέτρους
 * @param error Το σφάλμα που θα εμφανιστεί
 * @param options Επιλογές για την εμφάνιση του σφάλματος
 */
export function displayError(
  error: Error | string,
  options: ErrorDisplayOptions = {}
) {
  const errorMessage = typeof error === 'string' ? error : error.message;
  const errorStack = typeof error !== 'string' ? error.stack : undefined;

  const {
    component,
    details,
    source = 'app',
    title = 'Σφάλμα',
    showToast = true,
    logToConsole = true,
    useCollector = true,
    sendToChat = false,
    toastDuration = 5000
  } = options;

  // Καταγραφή στον browser console
  if (logToConsole) {
    if (component) {
      console.error(`[${component}]`, error);
    } else {
      console.error(error);
    }

    if (details) {
      console.error('Additional details:', details);
    }
  }

  // Καταγραφή στον error collector
  if (useCollector) {
    errorCollector.addError({
      message: errorMessage,
      stack: errorStack,
      timestamp: new Date().toISOString(),
      component,
      source,
      details: details ? JSON.stringify(details) : undefined
    });
  }

  // Εμφάνιση toast μηνύματος
  if (showToast) {
    toast.error(title, {
      description: errorMessage,
      duration: toastDuration
    });
  }

  // Αποστολή στο chat support
  if (sendToChat) {
    sendErrorToChat({
      message: errorMessage,
      component: component ? { _type: 'string', value: component } : { _type: 'undefined', value: 'undefined' },
      details: details ? { _type: 'object', value: JSON.stringify(details) } : { _type: 'undefined', value: 'undefined' },
      timestamp: new Date().toISOString()
    });
  }

  return {
    error,
    handled: true,
    options
  };
}

/**
 * Αποστέλλει το σφάλμα στο chat support
 * @param errorData Τα δεδομένα του σφάλματος
 */
export function sendErrorToChat(errorData: any) {
  try {
    console.info('Sending error to support chat:', errorData);
    // Εδώ θα υπήρχε κώδικας για αποστολή στο chat
  } catch (e) {
    console.error('Failed to send error to support chat:', e);
  }
}

/**
 * Αποστέλλει το σφάλμα στο Supabase
 * @param error Το σφάλμα
 * @param metadata Επιπρόσθετα μεταδεδομένα
 */
export function reportErrorToSupabase(error: Error, metadata: any = {}) {
  try {
    console.info('Reporting error to Supabase:', error, metadata);
    // Εδώ θα υπήρχε κώδικας για αποστολή στο Supabase
    return Promise.resolve({ success: true, id: 'mock-id-' + Date.now() });
  } catch (e) {
    console.error('Failed to report error to Supabase:', e);
    return Promise.resolve({ success: false, error: e });
  }
}
