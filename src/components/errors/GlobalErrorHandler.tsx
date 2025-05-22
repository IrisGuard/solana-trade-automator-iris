
import React, { useState, useEffect } from 'react';
import { errorCollector } from '@/utils/error-handling/collector';
import { ErrorData } from '@/utils/error-handling/collector/types';
import { Button } from '@/components/ui/button';
import { AlertCircle, X } from 'lucide-react';
import { displayError } from '@/utils/error-handling/displayError';
import { useErrorReporting } from '@/hooks/useErrorReporting';
import { toast } from 'sonner';
import { sanitizeErrorObject } from '@/utils/errorTestUtils';

export function GlobalErrorHandler() {
  const [errors, setErrors] = useState<ErrorData[]>([]);
  const [lastError, setLastError] = useState<ErrorData | null>(null);
  const { reportError } = useErrorReporting();
  
  // Λήψη των σφαλμάτων από τον collector
  useEffect(() => {
    const checkForErrors = () => {
      try {
        // Use getRecentErrors instead of getErrors to match implementation
        const allErrors = (errorCollector.getRecentErrors ? errorCollector.getRecentErrors() : errorCollector.getErrors()).map(e => {
          // Ensure error is an Error object with required properties
          const errorObj = e.error instanceof Error ? e.error : new Error(String(e.error || 'Unknown error'));
          const sanitizedError = sanitizeErrorObject(errorObj);
          
          // Create a properly typed ErrorData object
          const typedErrorData: ErrorData = {
            id: `err_${e.timestamp || Date.now()}`,
            error: errorObj, // Use the actual Error object, not the sanitized version
            timestamp: e.timestamp ? new Date(e.timestamp).toISOString() : new Date().toISOString(),
            message: sanitizedError.message,
            stack: sanitizedError.stack || '',
            component: e.data?.component || null,
            source: e.data?.source || 'client',
            url: window.location.href,
            browserInfo: { 
              userAgent: navigator.userAgent,
              language: navigator.language,
              platform: navigator.platform
            },
            errorCode: null,
            context: null,
            metadata: null,
            status: null,
            errorId: null,
            errorType: e.data?.method,
            details: e.data?.details,
            severity: e.data?.severity || 'medium',
            options: e.data
          };
          
          return typedErrorData;
        });
        
        setErrors(allErrors);
        
        // Εάν υπάρχει νέο σφάλμα, το αποθηκεύουμε ως το τελευταίο
        if (allErrors.length > 0 && (!lastError || allErrors[0].id !== lastError.id)) {
          setLastError(allErrors[0]);
        }
      } catch (error) {
        // Handle any errors during error processing
        const error2 = error instanceof Error ? error : new Error(String(error));
        console.error("Error processing errors in GlobalErrorHandler:", error2);
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
        - Message: ${String(error.message || 'No message provided')}
        - Component: ${String(error.component || 'Unknown')}
        - Source: ${String(error.source || 'Unknown')}
        - Timestamp: ${String(error.timestamp)}
      `;
      
      // Αποστολή του σφάλματος (για την προσομοίωση)
      console.log("Sending error to support:", supportMessage);
      
      // Ενημέρωση του χρήστη
      displayError(new Error("Το σφάλμα στάλθηκε στην υποστήριξη"), { 
        showToast: true
      });
      
    } catch (e) {
      // Sanitize any errors that occur during error handling
      const error2 = e instanceof Error ? e : new Error(String(e));
      console.error("Σφάλμα κατά την αποστολή του σφάλματος:", error2);
      reportError(error2, {
        component: 'GlobalErrorHandler',
        severity: 'low',
      });
    }
  };

  if (!lastError) return null;

  // Make sure we properly stringify any potential object values before rendering
  const errorMessage = String(lastError.message || 'Unknown error');
  const componentName = String(lastError.component || 'Unknown');
  const timestamp = typeof lastError.timestamp === 'string' ? 
    new Date(lastError.timestamp).toLocaleTimeString() : 
    new Date().toLocaleTimeString();

  return (
    <div className="fixed bottom-4 right-4 max-w-md z-50 animate-in fade-in slide-in-from-right">
      <div className="bg-destructive text-white p-4 rounded-md shadow-lg flex flex-col">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <div className="font-semibold">Σφάλμα Εφαρμογής</div>
            <div className="text-sm opacity-90">{errorMessage}</div>
            <div className="text-xs opacity-75 mt-1">
              Στο: {componentName} | {timestamp}
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-3 justify-end">
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
      </div>
    </div>
  );
}
