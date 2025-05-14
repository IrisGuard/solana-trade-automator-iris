
import { toast } from "sonner";
import { errorCollector, type ErrorData } from './collector';

/**
 * Εμφανίζει ένα σφάλμα στο UI και καταγράφει το σφάλμα στον συλλέκτη σφαλμάτων
 * 
 * @param error - Το σφάλμα που θα εμφανιστεί
 * @param options - Επιλογές για το πώς θα εμφανιστεί το σφάλμα
 */
export function displayError(error: Error | string, options?: {
  component?: string;
  details?: any;
  duration?: number;
  showStack?: boolean;
}) {
  const message = typeof error === 'string' ? error : error.message;
  const stack = typeof error === 'string' ? undefined : error.stack;

  // Καταγραφή στην κονσόλα
  console.error(`[${options?.component || 'App'}]`, error);
  
  // Καταγραφή στον συλλέκτη σφαλμάτων
  const errorData: ErrorData = {
    message,
    component: options?.component,
    details: options?.details ? JSON.stringify(options.details) : undefined,
    source: 'client',
  };
  
  if (stack) {
    errorData.stack = stack;
  }
  
  errorCollector.captureError(typeof error === 'string' ? new Error(error) : error, errorData);
  
  // Εμφάνιση toast
  toast.error(message, {
    description: options?.component ? `Σφάλμα στο: ${options.component}` : undefined,
    duration: options?.duration || 5000,
  });
}
