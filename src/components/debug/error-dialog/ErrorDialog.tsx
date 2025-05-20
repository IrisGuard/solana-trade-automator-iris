
import React, { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { ErrorDialogContent } from './ErrorDialogContent';
import { generateErrorCode } from './errorCodeUtils';
import { useEscapeKeyHandler } from './useEscapeKeyHandler';

interface ErrorDialogProps {
  error: {
    message: string;
    stack?: string;
    timestamp?: string;
    url?: string;
  };
  onClose: () => void;
}

export function ErrorDialogInChat({ error, onClose }: ErrorDialogProps) {
  // Απενεργοποίηση αυτόματου κλεισίματος
  const [autoClose] = useState<boolean>(false);
  
  // Δημιουργία κωδικού σφάλματος
  const errorCode = generateErrorCode();
  
  // Χειρισμός του πλήκτρου escape
  useEscapeKeyHandler(autoClose, onClose);

  // Process error to ensure all properties are strings and handle complex objects
  const processedError = {
    message: typeof error.message === 'string' ? error.message : 
      typeof error.message === 'object' ? JSON.stringify(error.message, null, 2) : 
      String(error.message || 'Unknown Error'),
    
    stack: typeof error.stack === 'string' ? error.stack : 
      typeof error.stack === 'object' ? JSON.stringify(error.stack, null, 2) : 
      String(error.stack || 'No stack trace available'),
    
    timestamp: typeof error.timestamp === 'string' ? error.timestamp : 
      typeof error.timestamp === 'object' ? JSON.stringify(error.timestamp) : 
      String(error.timestamp || new Date().toISOString()),
    
    url: typeof error.url === 'string' ? error.url : 
      typeof error.url === 'object' ? JSON.stringify(error.url) :
      String(error.url || window.location.href)
  };

  return (
    <Dialog open={true} onOpenChange={() => autoClose && onClose()}>
      <ErrorDialogContent 
        error={processedError} 
        onClose={onClose}
        errorCode={errorCode}
      />
    </Dialog>
  );
}
