
import React, { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { ErrorDialogContent } from './ErrorDialogContent';
import { generateErrorCode } from './errorCodeUtils';
import { useEscapeKeyHandler } from './useEscapeKeyHandler';

interface ErrorDialogProps {
  error: {
    message: string;
    stack?: string;
    timestamp: string;
    url: string;
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

  return (
    <Dialog open={true} onOpenChange={() => autoClose && onClose()}>
      <ErrorDialogContent 
        error={error} 
        onClose={onClose}
        errorCode={errorCode}
      />
    </Dialog>
  );
}
