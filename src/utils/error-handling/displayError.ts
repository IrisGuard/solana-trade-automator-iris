
import { toast } from "sonner";
import { errorCollector } from './collector';
import { ErrorDisplayOptions } from "./types";

/**
 * Εμφανίζει ένα σφάλμα στη διασύνδεση χρήστη και το καταγράφει
 * στον συλλέκτη σφαλμάτων.
 *
 * @param error Το σφάλμα που θα εμφανιστεί (μπορεί να είναι Error ή string)
 * @param options Πρόσθετες επιλογές για την εμφάνιση του σφάλματος
 */
export function displayError(error: Error | string, options: ErrorDisplayOptions = {}): void {
  // Εξαγωγή του μηνύματος σφάλματος
  const message = error instanceof Error ? error.message : error;
  const stack = error instanceof Error ? error.stack : undefined;
  
  const { component, showToast = true, details, title, logToConsole = true, sendToChat = false, useCollector = true, toastDuration = 5000 } = options;
  
  // Καταγραφή στην κονσόλα αν ζητηθεί
  if (logToConsole) {
    if (component) {
      console.error(`[${component}] ${message}`, details || '');
    } else {
      console.error(message, details || '');
    }
  }
  
  // Προσθήκη στον συλλέκτη σφαλμάτων αν ζητηθεί
  if (useCollector) {
    errorCollector.captureError(error instanceof Error ? error : new Error(message), {
      component,
      details: JSON.stringify(details),
      source: options.source || 'client'
    });
  }
  
  // Εμφάνιση toast αν ζητηθεί
  if (showToast) {
    toast.error(title || message, {
      description: component ? `Στο: ${component}` : undefined,
      duration: toastDuration
    });
  }
  
  // Αποστολή στο chat αν ζητηθεί
  if (sendToChat) {
    sendErrorToChat(message, component, details);
  }
}

/**
 * Αποστέλλει ένα σφάλμα στην υποστήριξη μέσω chat (προσομοίωση)
 */
export function sendErrorToChat(message: string, component?: string, details?: any): void {
  // Προσομοίωση αποστολής στην υποστήριξη
  console.log("Sending error to support chat:", {
    message,
    component,
    details,
    timestamp: new Date().toISOString()
  });
  
  // Σε πραγματική εφαρμογή, εδώ θα κάναμε ένα API call στο σύστημα υποστήριξης
}

/**
 * Αναφέρει ένα σφάλμα στο Supabase για καταγραφή
 */
export async function reportErrorToSupabase(error: Error | string, options: ErrorDisplayOptions = {}): Promise<void> {
  const { component, details, source } = options;
  const message = error instanceof Error ? error.message : error;
  const stack = error instanceof Error ? error.stack : undefined;
  
  try {
    // Προσθήκη στον συλλέκτη σφαλμάτων
    errorCollector.captureError(error instanceof Error ? error : new Error(message), {
      component,
      details: JSON.stringify(details),
      source: source || 'client'
    });
    
    // Εδώ θα μπορούσαμε να καλέσουμε μια λειτουργία του Supabase για καταγραφή σφαλμάτων
  } catch (err) {
    console.error("Error reporting to Supabase:", err);
  }
}
