
import { toast } from "sonner";
import { errorCollector, type ErrorData } from './collector';

type ErrorOptions = {
  component?: string;
  showToast?: boolean;
  details?: any;
};

/**
 * Εμφανίζει ένα σφάλμα στη διασύνδεση χρήστη και το καταγράφει
 * στον συλλέκτη σφαλμάτων.
 *
 * @param message Το μήνυμα σφάλματος που θα εμφανιστεί
 * @param options Πρόσθετες επιλογές για την εμφάνιση του σφάλματος
 */
export function displayError(message: string, options: ErrorOptions = {}): void {
  const { component, showToast = true, details } = options;
  
  // Καταγραφή στην κονσόλα
  if (component) {
    console.error(`[${component}] ${message}`, details || '');
  } else {
    console.error(message, details || '');
  }
  
  // Προσθήκη στον συλλέκτη σφαλμάτων
  errorCollector.captureError(new Error(message), {
    component,
    details: JSON.stringify(details),
    source: 'client'
  });
  
  // Εμφάνιση toast αν ζητηθεί
  if (showToast) {
    toast.error(message, {
      description: component ? `Στο: ${component}` : undefined,
      duration: 5000
    });
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
export async function reportErrorToSupabase(error: Error, options: ErrorOptions = {}): Promise<void> {
  const { component, details } = options;
  
  try {
    // Προσθήκη στον συλλέκτη σφαλμάτων
    errorCollector.captureError(error, {
      component,
      details: JSON.stringify(details),
      source: 'client'
    });
    
    // Εδώ θα μπορούσαμε να καλέσουμε μια λειτουργία του Supabase για καταγραφή σφαλμάτων
  } catch (err) {
    console.error("Error reporting to Supabase:", err);
  }
}
