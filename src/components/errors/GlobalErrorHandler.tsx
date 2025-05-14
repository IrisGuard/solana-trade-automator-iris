
import React, { useState, useEffect } from 'react';
import { Toast, ToastAction } from '@/components/ui/toast';
import { errorCollector } from '@/utils/error-handling/collector';
import { ErrorData } from '@/utils/error-handling/collector/ErrorCollector';
import { Button } from '@/components/ui/button';
import { AlertCircle, X } from 'lucide-react';
import { displayError } from '@/utils/errorUtils';
import { sendErrorToChat } from '@/utils/error-handling/displayError';
import { useErrorReporting } from '@/hooks/useErrorReporting';

export function GlobalErrorHandler() {
  const [errors, setErrors] = useState<ErrorData[]>([]);
  const [lastError, setLastError] = useState<ErrorData | null>(null);
  const { reportError } = useErrorReporting();
  
  // Get errors from the collector
  useEffect(() => {
    const checkForErrors = () => {
      const allErrors = errorCollector.getAllErrors();
      setErrors([...allErrors]); // Create a new array to avoid type issues
      
      // If there's a new error, save it as the last one
      if (allErrors.length > 0 && (!lastError || allErrors[0].id !== lastError.id)) {
        setLastError(allErrors[0] as ErrorData);
      }
    };
    
    // Initial error retrieval
    checkForErrors();
    
    // Periodic check for new errors
    const intervalId = setInterval(checkForErrors, 3000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [lastError]);
  
  // Handle sending error to support
  const handleSendToSupport = (error: ErrorData) => {
    try {
      const supportMessage = `
        Error Report:
        - Message: ${error.message}
        - Component: ${error.component}
        - Source: ${error.source}
        - Timestamp: ${error.timestamp}
      `;
      
      // Send the error (for simulation)
      console.log("Sending error to support:", supportMessage);
      // Call the function to send to chat
      sendErrorToChat(error.message);
      
      // Update the user
      displayError("Error sent to support", { 
        showToast: true
      });
      
    } catch (e) {
      console.error("Error while sending error:", e);
      reportError("Failed to send error to support");
    }
  };

  if (!lastError) return null;

  return (
    <Toast className="bg-destructive text-white">
      <div className="flex items-start gap-2">
        <AlertCircle className="h-5 w-5 mt-0.5" />
        <div className="flex-1">
          <div className="font-semibold">Application Error</div>
          <div className="text-sm opacity-90">{lastError.message}</div>
          <div className="text-xs opacity-75 mt-1">
            In: {lastError.component} | {new Date(lastError.timestamp).toLocaleTimeString()}
          </div>
        </div>
      </div>
      <ToastAction className="flex gap-2" asChild altText="Send to support">
        <div>
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-transparent hover:bg-white/10 text-white border-white/20"
            onClick={() => handleSendToSupport(lastError)}
          >
            Report
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
