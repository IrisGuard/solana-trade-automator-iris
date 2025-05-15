
import React, { useState, useEffect } from 'react';
import { Toast, ToastAction } from '@/components/ui/toast';
import { errorCollector } from '@/utils/error-handling/collector';
import { ErrorData } from '@/utils/error-handling/collector/types';
import { Button } from '@/components/ui/button';
import { AlertCircle, X } from 'lucide-react';
import { displayError } from '@/utils/error-handling/displayError';
import { useErrorReporting } from '@/hooks/useErrorReporting';

export function GlobalErrorHandler() {
  const [errors, setErrors] = useState<ErrorData[]>([]);
  const [lastError, setLastError] = useState<ErrorData | null>(null);
  const { reportError } = useErrorReporting();
  
  // Λήψη των σφαλμάτων από τον collector
  useEffect(() => {
    const checkForErrors = () => {
      const allErrors = errorCollector.getErrors();
      setErrors(allErrors);
      
      // Εάν υπάρχει νέο σφάλμα, το αποθηκεύουμε ως το τελευταίο
      if (allErrors.length > 0 && (!lastError || allErrors[0].id !== lastError.id)) {
        setLastError(allErrors[0]);
      }
    };
    
    // Αρχική λήψη σφαλμάτων
    checkForErrors();
    
    // Περιοδικός έλεγχος για νέα σφάλματα
    const intervalId = setInterval(checkForErrors, 3000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [lastError]);
  
  // Διαχείριση αποστολής σφάλματος σε υποστήριξη
  const handleSendToSupport = (error: ErrorData) => {
    try {
      const supportMessage = `
        Error Report:
        - Message: ${error.message || 'No message provided'}
        - Component: ${error.component || 'Unknown'}
        - Source: ${error.source || 'Unknown'}
        - Timestamp: ${error.timestamp}
      `;
      
      // Αποστολή του σφάλματος (για την προσομοίωση)
      console.log("Sending error to support:", supportMessage);
      
      // Ενημέρωση του χρήστη
      displayError(new Error("Το σφάλμα στάλθηκε στην υποστήριξη"), { 
        showToast: true
      });
      
    } catch (e) {
      console.error("Σφάλμα κατά την αποστολή του σφάλματος:", e);
      reportError(e instanceof Error ? e : new Error("Αποτυχία αποστολής σφάλματος στην υποστήριξη"));
    }
  };

  if (!lastError) return null;

  return (
    <Toast className="bg-destructive text-white">
      <div className="flex items-start gap-2">
        <AlertCircle className="h-5 w-5 mt-0.5" />
        <div className="flex-1">
          <div className="font-semibold">Σφάλμα Εφαρμογής</div>
          <div className="text-sm opacity-90">{lastError.message || 'Unknown error'}</div>
          <div className="text-xs opacity-75 mt-1">
            Στο: {lastError.component || 'Unknown'} | {new Date(lastError.timestamp).toLocaleTimeString()}
          </div>
        </div>
      </div>
      <ToastAction className="flex gap-2" asChild altText="Αποστολή στην υποστήριξη">
        <div>
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-transparent hover:bg-white/10 text-white border-white/20"
            onClick={() => handleSendToSupport(lastError)}
          >
            Αναφορά
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="bg-transparent hover:bg-white/10 text-white border-white/20"
            onClick={() => setLastError(null)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </ToastAction>
    </Toast>
  );
}
