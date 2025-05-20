
import React, { useState, useEffect } from 'react';
import { ErrorDialogInChat } from './ErrorDialog';

export function useErrorDialogInChat() {
  const [errors, setErrors] = useState<any[]>([]);
  
  // Προσθήκη του event listener για τα σφάλματα
  useEffect(() => {
    // Ορισμός χειριστή για το lovable-error event
    const handleLovableError = (event: CustomEvent) => {
      console.log('Λήφθηκε lovable-error event:', event.detail);
      
      // Μετατροπή των πολύπλοκων αντικειμένων σε strings
      const processedError = {
        message: typeof event.detail.message === 'string' 
          ? event.detail.message 
          : typeof event.detail.message === 'object'
            ? JSON.stringify(event.detail.message, null, 2)
            : String(event.detail.message || 'Unknown Error'),
        
        stack: typeof event.detail.stack === 'string' 
          ? event.detail.stack 
          : typeof event.detail.stack === 'object'
            ? JSON.stringify(event.detail.stack, null, 2)
            : String(event.detail.stack || 'No stack trace available'),
        
        timestamp: typeof event.detail.timestamp === 'string'
          ? event.detail.timestamp
          : typeof event.detail.timestamp === 'object'
            ? JSON.stringify(event.detail.timestamp)
            : String(event.detail.timestamp || new Date().toISOString()),
        
        url: typeof event.detail.url === 'string'
          ? event.detail.url
          : typeof event.detail.url === 'object'
            ? JSON.stringify(event.detail.url)
            : String(event.detail.url || window.location.href)
      };
      
      // Προσθήκη του νέου σφάλματος στο array (διατηρώντας και τα προηγούμενα)
      setErrors(prevErrors => {
        // Έλεγχος για αποφυγή διπλότυπων σφαλμάτων
        const isDuplicate = prevErrors.some(err => 
          err.message === processedError.message && 
          err.stack === processedError.stack
        );
        
        if (isDuplicate) return prevErrors;
        
        // Περιορισμός στα τελευταία 10 σφάλματα για απόδοση
        const updatedErrors = [...prevErrors, processedError].slice(-10);
        return updatedErrors;
      });
    };
    
    // Προσθήκη του window.lovableChat object αν δεν υπάρχει
    if (!window.lovableChat) {
      window.lovableChat = {};
    }
    
    // Προσθήκη της συνάρτησης createErrorDialog στο window.lovableChat
    window.lovableChat.createErrorDialog = (errorData: any) => {
      console.log('Κλήση του createErrorDialog με δεδομένα:', errorData);
      
      // Enhanced error processing to handle any possible object type
      const processedError = {
        message: typeof errorData.message === 'string'
          ? errorData.message 
          : typeof errorData.message === 'object' 
            ? JSON.stringify(errorData.message, null, 2)
            : String(errorData.message || 'Unknown Error'),
        
        stack: typeof errorData.stack === 'string' 
          ? errorData.stack 
          : typeof errorData.stack === 'object'
            ? JSON.stringify(errorData.stack, null, 2)
            : String(errorData.stack || 'No stack trace available'),
        
        timestamp: typeof errorData.timestamp === 'string'
          ? errorData.timestamp
          : typeof errorData.timestamp === 'object'
            ? JSON.stringify(errorData.timestamp)
            : String(errorData.timestamp || new Date().toISOString()),
        
        url: typeof errorData.url === 'string'
          ? errorData.url
          : typeof errorData.url === 'object'
            ? JSON.stringify(errorData.url)
            : String(errorData.url || window.location.href)
      };
      
      // Προσθήκη του νέου σφάλματος στο array (διατηρώντας και τα προηγούμενα)
      setErrors(prevErrors => {
        // Έλεγχος για αποφυγή διπλότυπων σφαλμάτων
        const isDuplicate = prevErrors.some(err => 
          err.message === processedError.message && 
          err.stack === processedError.stack
        );
        
        if (isDuplicate) return prevErrors;
        
        // Περιορισμός στα τελευταία 10 σφάλματα για απόδοση
        return [...prevErrors, processedError].slice(-10);
      });
    };

    // Προσθήκη συνάρτησης καθαρισμού σφαλμάτων
    window.lovableChat.clearErrors = () => {
      setErrors([]);
    };
    
    // Προσθήκη του event listener για καθαρισμό σφαλμάτων
    const handleClearErrors = () => {
      setErrors([]);
    };

    // Προσθήκη των event listeners
    window.addEventListener('lovable-error', handleLovableError as EventListener);
    window.addEventListener('lovable-clear-errors', handleClearErrors);
    
    // Καθαρισμός
    return () => {
      window.removeEventListener('lovable-error', handleLovableError as EventListener);
      window.removeEventListener('lovable-clear-errors', handleClearErrors);
      if (window.lovableChat) {
        delete window.lovableChat.createErrorDialog;
        delete window.lovableChat.clearErrors;
      }
    };
  }, []);
  
  // Παροχή των components για τα διαλογικά παράθυρα σφαλμάτων
  const ErrorDialogs = () => (
    <>
      {errors.map((error, index) => (
        <ErrorDialogInChat
          key={`error-${index}-${Date.now()}`}
          error={error}
          onClose={() => {
            setErrors(prevErrors => prevErrors.filter((_, i) => i !== index));
          }}
        />
      ))}
    </>
  );
  
  return { ErrorDialogs, errors, clearAllErrors: () => setErrors([]) };
}
