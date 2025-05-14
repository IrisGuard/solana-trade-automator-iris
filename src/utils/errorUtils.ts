
import { toast } from "sonner";
import { errorCollector, type ErrorData } from './error-handling/collector';

/**
 * Καταγραφεί σφάλματα κατά τη διάρκεια εκτέλεσης της εφαρμογής
 */
export class ErrorUtils {
  /**
   * Καταγραφεί ένα σφάλμα με μόνο μήνυμα
   */
  static logSimpleError(message: string, component?: string) {
    // Εμφάνιση σφάλματος στην κονσόλα
    console.error(`[${component || 'App'}]`, message);
    
    // Προσθήκη στον συλλέκτη σφαλμάτων
    errorCollector.addError({
      message,
      timestamp: new Date().toISOString(),
      source: component || 'unknown',
    });
    
    // Εμφάνιση toast
    ErrorUtils.showErrorToast(message, component);
  }
  
  /**
   * Καταγραφεί ένα σφάλμα τύπου Error
   */
  static logError(error: Error, component?: string, details?: any) {
    // Εμφάνιση σφάλματος στην κονσόλα
    console.error(`[${component || 'App'}]`, error);
    
    // Προσθήκη στον συλλέκτη σφαλμάτων
    errorCollector.addError({
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      source: component || 'unknown',
      details: details ? JSON.stringify(details) : undefined
    });
    
    // Εμφάνιση toast
    ErrorUtils.showErrorToast(error.message, component);
  }
  
  /**
   * Εμφάνιση toast με το σφάλμα
   */
  private static showErrorToast(message: string, component?: string) {
    if (process.env.NODE_ENV !== 'production') {
      toast.error(message, {
        description: component ? `Source: ${component}` : undefined
      });
    }
  }
}

/**
 * Απλή συνάρτηση καταγραφής σφαλμάτων για τα service modules
 */
export function logError(message: string, source?: string, details?: any) {
  console.error(`[${source || 'unknown'}]`, message, details || '');
  
  // Προσθήκη στον συλλέκτη σφαλμάτων
  errorCollector.addError({
    message,
    stack: details?.stack || new Error().stack,
    timestamp: new Date().toISOString(),
    source: source || 'unknown',
    details: details ? JSON.stringify(details) : undefined
  });
  
  // Εμφάνιση toast σε μη παραγωγικό περιβάλλον
  if (process.env.NODE_ENV !== 'production') {
    toast.error(`Error: ${message}`, {
      description: `Source: ${source || 'unknown'}`
    });
  }
}

// Export the displayError function from error-handling module
export { displayError, type ErrorDisplayOptions } from './error-handling/displayError';
