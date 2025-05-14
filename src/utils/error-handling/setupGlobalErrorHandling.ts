
/**
 * Ρυθμίσεις για καθολικό χειρισμό σφαλμάτων στην εφαρμογή
 */
import { errorCollector } from "./collector";
import { toast } from "sonner";

export function setupGlobalErrorHandling(): void {
  // Χειρισμός μη διαχειρίσιμων σφαλμάτων
  window.addEventListener('error', (event) => {
    console.error('Global error caught:', event.error);
    
    const error = event.error || new Error('Unknown error');
    errorCollector.addError(error);
    
    // Αποφυγή πολλαπλών ίδιων μηνυμάτων
    const errorKey = `error_${error.message}`;
    const hasShown = sessionStorage.getItem(errorKey);
    
    if (!hasShown) {
      toast.error("Προέκυψε σφάλμα στην εφαρμογή", {
        description: error.message,
        duration: 5000,
      });
      
      // Αποθήκευση για αποφυγή επανάληψης για 1 λεπτό
      sessionStorage.setItem(errorKey, "shown");
      setTimeout(() => {
        sessionStorage.removeItem(errorKey);
      }, 60000);
    }
  });
  
  // Χειρισμός unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    
    let error: Error;
    if (event.reason instanceof Error) {
      error = event.reason;
    } else {
      error = new Error(typeof event.reason === 'string' ? 
        event.reason : 'Απροσδιόριστο σφάλμα υπόσχεσης (Promise)');
    }
    
    errorCollector.addError(error);
    
    // Αποφυγή πολλαπλών ίδιων μηνυμάτων
    const errorKey = `promise_error_${error.message}`;
    const hasShown = sessionStorage.getItem(errorKey);
    
    if (!hasShown) {
      toast.error("Αποτυχία ασύγχρονης λειτουργίας", {
        description: error.message,
        duration: 5000,
      });
      
      // Αποθήκευση για αποφυγή επανάληψης για 1 λεπτό
      sessionStorage.setItem(errorKey, "shown");
      setTimeout(() => {
        sessionStorage.removeItem(errorKey);
      }, 60000);
    }
  });
  
  console.log("Global error handling set up successfully");
}
