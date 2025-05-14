
import { toast } from "sonner";
import { errorCollector } from "./collector";
import type { ErrorDisplayOptions } from "./types";

/**
 * Εμφανίζει σφάλμα στο UI με διάφορους τρόπους ανάλογα με τις επιλογές
 */
export function displayError(
  error: Error | string,
  options: ErrorDisplayOptions = {}
) {
  const errorObj = typeof error === "string" ? new Error(error) : error;
  const {
    title = "Σφάλμα",
    component = "unknown",
    details = {},
    showToast = true,
    logToConsole = true,
    source = "client",
  } = options;

  // Καταγραφή στον collector
  errorCollector.captureError(errorObj, {
    component,
    details,
    source,
  });

  // Καταγραφή στην κονσόλα αν ζητηθεί
  if (logToConsole) {
    console.error(
      `[ERROR] in ${component}:`,
      errorObj.message,
      errorObj.stack,
      details
    );
  }

  // Εμφάνιση toast αν ζητηθεί
  if (showToast) {
    toast.error(title, {
      description: errorObj.message.substring(0, 100),
      duration: 4000,
    });
  }

  return {
    success: false,
    error: errorObj.message,
  };
}

/**
 * Αποστολή σφάλματος στο chat
 */
export function sendErrorToChat(errorMessage: string) {
  console.log("Αποστολή σφάλματος στο chat:", errorMessage);
  // Στην πραγματική εφαρμογή θα καλούσαμε κάποιο API
  return true;
}

/**
 * Αναφορά σφάλματος στο Supabase
 */
export function reportErrorToSupabase(error: Error | string, options: any = {}) {
  // Αυτή η συνάρτηση θα κάνει κάποια λογική αναφοράς στο Supabase
  const errorObj = typeof error === "string" ? new Error(error) : error;
  
  console.log("Αναφορά σφάλματος στο Supabase:", errorObj.message);
  
  return {
    success: true,
    id: "error-id-mock",
  };
}
