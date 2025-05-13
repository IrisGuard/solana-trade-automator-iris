
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

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
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Σφάλμα εφαρμογής</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <h4 className="font-medium mb-1">Μήνυμα:</h4>
            <p className="text-sm bg-muted p-2 rounded">{error.message}</p>
          </div>
          
          {error.stack && (
            <div>
              <h4 className="font-medium mb-1">Stack Trace:</h4>
              <pre className="text-xs overflow-auto bg-muted p-2 rounded max-h-40">{error.stack}</pre>
            </div>
          )}
          
          <div className="text-xs text-muted-foreground space-y-1">
            <div>Χρονοσήμανση: {new Date(error.timestamp).toLocaleString()}</div>
            <div>URL: {error.url}</div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Κλείσιμο</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Hook για προσθήκη του ErrorDialogInChat στο παράθυρο
export function useErrorDialogInChat() {
  const [errors, setErrors] = useState<any[]>([]);
  
  // Προσθήκη του event listener για τα σφάλματα
  useEffect(() => {
    // Ορισμός χειριστή για το lovable-error event
    const handleLovableError = (event: CustomEvent) => {
      // Προσθήκη του σφάλματος στη λίστα
      setErrors(prev => [...prev, event.detail]);
    };
    
    // Προσθήκη του window.lovableChat object αν δεν υπάρχει
    if (!window.lovableChat) {
      window.lovableChat = {};
    }
    
    // Προσθήκη της συνάρτησης createErrorDialog στο window.lovableChat
    window.lovableChat.createErrorDialog = (errorData: any) => {
      setErrors(prev => [...prev, errorData]);
    };
    
    // Προσθήκη του event listener
    window.addEventListener('lovable-error', handleLovableError as EventListener);
    
    // Καθαρισμός
    return () => {
      window.removeEventListener('lovable-error', handleLovableError as EventListener);
      if (window.lovableChat) {
        delete window.lovableChat.createErrorDialog;
      }
    };
  }, []);
  
  // Αφαίρεση σφάλματος από τη λίστα
  const removeError = (index: number) => {
    setErrors(prev => prev.filter((_, i) => i !== index));
  };
  
  // Παροχή των components για τα διαλογικά παράθυρα σφαλμάτων
  const ErrorDialogs = () => (
    <>
      {errors.map((error, index) => (
        <ErrorDialogInChat
          key={`error-${index}-${error.timestamp}`}
          error={error}
          onClose={() => removeError(index)}
        />
      ))}
    </>
  );
  
  return { ErrorDialogs };
}
