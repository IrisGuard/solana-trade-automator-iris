
/**
 * Βοηθητικές συναρτήσεις για δοκιμή των σφαλμάτων και του συστήματος καταγραφής
 */
import { useState, useCallback } from 'react';
import { toast } from "sonner";
import { errorCollector } from './error-handling/collector';
import { sendErrorToChat } from './error-handling/sendErrorToChat';
import { displayError } from './error-handling/displayError';

// Options for error generation
interface ErrorOptions {
  showToast?: boolean;
  logToConsole?: boolean;
  sendToChat?: boolean;
  useCollector?: boolean;
}

/**
 * Generate a test error with specified options
 */
export function generateTestError(message: string = "Δοκιμαστικό σφάλμα", options: ErrorOptions = {}) {
  const {
    showToast = true,
    logToConsole = true,
    sendToChat = false,
    useCollector = false
  } = options;
  
  try {
    // Create the error
    const error = new Error(message);
    console.error("Test error generated:", error);
    
    // Add to collector if requested
    if (useCollector) {
      errorCollector.addError(error);
    }
    
    // Display toast if requested
    if (showToast) {
      toast.error(message, {
        description: "Δοκιμαστικό σφάλμα για έλεγχο του συστήματος",
        action: sendToChat ? {
          label: "Αποστολή στο Chat",
          onClick: () => sendErrorToChat(error),
        } : undefined
      });
    }
    
    // Log to console if requested
    if (logToConsole) {
      console.error("Generated test error:", error);
    }
    
    // Send to chat if requested
    if (sendToChat) {
      sendErrorToChat(error);
    }
    
    return error;
  } catch (e) {
    console.error("Error while generating test error:", e);
    return new Error("Error while generating test error");
  }
}

/**
 * Generate various types of errors for testing purposes
 */
export function generateVariousErrors() {
  console.log("Generating various errors for testing...");
  
  // Array of errors to be created
  const errors = [
    new Error('Δοκιμαστικό σφάλμα 1: Απλό σφάλμα'),
    new Error('Δοκιμαστικό σφάλμα 2: Σφάλμα ως string χωρίς stack trace'),
    new Error('Δοκιμαστικό σφάλμα 3: Προσομοίωση σφάλματος Supabase'),
    new Error('Δοκιμαστικό σφάλμα 4: Προσομοίωση σφάλματος δικτύου')
  ];
  
  // Add to collector
  errors.forEach(error => {
    errorCollector.addError(error);
  });
  
  toast.error("Δημιουργήθηκαν πολλαπλά σφάλματα", {
    description: `${errors.length} σφάλματα προστέθηκαν στη συλλογή`,
    duration: 3000,
  });
  
  // Send after 3 seconds all errors if they haven't been sent yet
  setTimeout(() => {
    errorCollector.reportErrors();
  }, 3000);
  
  return errors;
}

/**
 * Hook για δοκιμή των σφαλμάτων
 */
export function useErrorTesting() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  
  // Παραγωγή δοκιμαστικού σφάλματος
  const generateTestErrorCallback = useCallback((message: string = "Δοκιμαστικό σφάλμα") => {
    setIsGenerating(true);
    
    try {
      // Δημιουργία σφάλματος
      const error = generateTestError(message);
      
      // Αύξηση του μετρητή
      setErrorCount(count => count + 1);
      
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
    
    try {
      const errors = generateVariousErrors();
      setErrorCount(count => count + errors.length);
    } finally {
      setIsGenerating(false);
    }
  }, []);
  
  return {
    generateTestError: generateTestErrorCallback,
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
