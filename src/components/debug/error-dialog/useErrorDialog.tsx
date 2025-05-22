
import React, { useState, useEffect } from 'react';
import { ErrorDialogInChat } from './ErrorDialog';

export function useErrorDialogInChat() {
  const [errors, setErrors] = useState<any[]>([]);
  
  // Προσθήκη του event listener για τα σφάλματα
  useEffect(() => {
    // Ορισμός χειριστή για το lovable-error event
    const handleLovableError = (event: CustomEvent) => {
      console.log('Λήφθηκε lovable-error event:', event.detail);
      
      // Προσθήκη του νέου σφάλματος στο array (διατηρώντας και τα προηγούμενα)
      setErrors(prevErrors => {
        // Έλεγχος για αποφυγή διπλότυπων σφαλμάτων
        const isDuplicate = prevErrors.some(err => 
          err.message === event.detail.message && 
          err.stack === event.detail.stack
        );
        
        if (isDuplicate) return prevErrors;
        
        // Περιορισμός στα τελευταία 10 σφάλματα για απόδοση
        const updatedErrors = [...prevErrors, event.detail].slice(-10);
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
      
      // Προσθήκη του νέου σφάλματος στο array (διατηρώντας και τα προηγούμενα)
      setErrors(prevErrors => {
        // Έλεγχος για αποφυγή διπλότυπων σφαλμάτων
        const isDuplicate = prevErrors.some(err => 
          err.message === errorData.message && 
          err.stack === errorData.stack
        );
        
        if (isDuplicate) return prevErrors;
        
        // Περιορισμός στα τελευταία 10 σφάλματα για απόδοση
        return [...prevErrors, errorData].slice(-10);
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
