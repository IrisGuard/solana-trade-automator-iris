
import React, { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { ErrorDialogContent } from './ErrorDialogContent';
import { generateErrorCode } from './errorCodeUtils';
import { useEscapeKeyHandler } from './useEscapeKeyHandler';
import { sanitizeErrorObject } from '@/utils/errorTestUtils';

interface ErrorDialogProps {
  error: {
    message: string;
    stack?: string;
    timestamp?: string;
    url?: string;
  } | Error | string | unknown;
  onClose: () => void;
}

export function ErrorDialogInChat({ error, onClose }: ErrorDialogProps) {
  // Απενεργοποίηση αυτόματου κλεισίματος
  const [autoClose] = useState<boolean>(false);
  
  // Δημιουργία κωδικού σφάλματος
  const errorCode = generateErrorCode();
  
  // Χειρισμός του πλήκτρου escape
  useEscapeKeyHandler(autoClose, onClose);

  // Process error to ensure all properties are strings
  const processedError = sanitizeErrorObject(error);

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
