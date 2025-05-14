
/**
 * Βοηθητικές συναρτήσεις για δοκιμή των σφαλμάτων και του συστήματος καταγραφής
 */
import { useState, useCallback } from 'react';
import { toast } from "sonner";
import { errorCollector } from './error-handling/collector';
import { sendErrorToChat } from './error-handling/sendErrorToChat';

/**
 * Hook για δοκιμή των σφαλμάτων
 */
export function useErrorTesting() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  
  // Παραγωγή δοκιμαστικού σφάλματος
  const generateTestError = useCallback((message: string = "Δοκιμαστικό σφάλμα") => {
    setIsGenerating(true);
    
    try {
      // Δημιουργία σφάλματος
      const error = new Error(message);
      console.error("Test error generated:", error);
      
      // Αύξηση του μετρητή
      setErrorCount(count => count + 1);
      
      // Προσθήκη στο collector
      errorCollector.addError(error);
      
      // Εμφάνιση toast με επιλογή αποστολής στο chat
      toast.error(message, {
        description: "Δοκιμαστικό σφάλμα για έλεγχο του συστήματος",
        action: {
          label: "Αποστολή στο Chat",
          onClick: () => sendErrorToChat(error),
        }
      });
      
      return error;
    } finally {
      setIsGenerating(false);
    }
  }, []);
  
  // Καθαρισμός όλων των σφαλμάτων
  const clearAllErrors = useCallback(() => {
    errorCollector.clearErrors();
    setErrorCount(0);
    
    toast.success("Όλα τα σφάλματα καθαρίστηκαν", {
      description: "Η συλλογή σφαλμάτων είναι τώρα άδεια",
      duration: 2000,
    });
  }, []);
  
  // Παραγωγή πολλαπλών σφαλμάτων για δοκιμή
  const generateMultipleErrors = useCallback(() => {
    setIsGenerating(true);
    
    // Πίνακας με τα σφάλματα που θα δημιουργηθούν
    const errors = [
      new Error('Δοκιμαστικό σφάλμα 1: Απλό σφάλμα'),
      new Error('Δοκιμαστικό σφάλμα 2: Σφάλμα ως string χωρίς stack trace'),
      new Error('Δοκιμαστικό σφάλμα 3: Προσομοίωση σφάλματος Supabase'),
      new Error('Δοκιμαστικό σφάλμα 4: Προσομοίωση σφάλματος δικτύου')
    ];
    
    // Προσθήκη στο collector
    errors.forEach(error => {
      errorCollector.addError(error);
    });
    
    setErrorCount(count => count + errors.length);
    setIsGenerating(false);
    
    // Αποστολή μετά από 3 δευτερόλεπτα όλων των σφαλμάτων αν δεν έχουν σταλεί ακόμα
    setTimeout(() => {
      // Using reportErrors instead of sendCollectedErrors
      errorCollector.reportErrors();
    }, 3000);
  }, []);
  
  return {
    generateTestError,
    clearAllErrors,
    generateMultipleErrors,
    isGenerating,
    errorCount
  };
}

// Εξαγωγή της συνάρτησης καθαρισμού σφαλμάτων για ευκολότερη πρόσβαση
export const clearAllErrors = () => {
  errorCollector.clearErrors();
  toast.success("Όλα τα σφάλματα καθαρίστηκαν");
};
