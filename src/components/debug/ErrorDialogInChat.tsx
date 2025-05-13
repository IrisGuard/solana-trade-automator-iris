
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle, MessageSquare, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { clearAllErrors } from '@/utils/errorTestUtils';

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
  // Συνάρτηση για αποστολή του σφάλματος στο Lovable chat
  const sendToLovableChat = () => {
    try {
      // Δημιουργία μηνύματος για αποστολή στο chat
      const errorMessage = `Παρακαλώ διορθώστε το παρακάτω σφάλμα:\n\nΜήνυμα: ${error.message}\n\n${error.stack ? `Stack Trace: ${error.stack}\n\n` : ''}Χρονοσήμανση: ${new Date(error.timestamp).toLocaleString()}\nURL: ${error.url}`;
      
      // Αντιγραφή στο πρόχειρο
      navigator.clipboard.writeText(errorMessage)
        .then(() => {
          toast.success('Το σφάλμα αντιγράφηκε στο πρόχειρο', {
            duration: 3000
          });
        })
        .catch((err) => {
          console.error('Σφάλμα κατά την αντιγραφή στο πρόχειρο:', err);
        });
      
      // Αποστολή event για το chat
      const customEvent = new CustomEvent('lovable-send-to-chat', {
        detail: { message: errorMessage }
      });
      window.dispatchEvent(customEvent);
      
      // Κλείσιμο του dialog
      onClose();
    } catch (e) {
      console.error("Σφάλμα κατά την αποστολή του σφάλματος στο chat:", e);
      onClose();
    }
  };

  // Auto-close mechanism
  useEffect(() => {
    // Create a force close timer - reduced to 10 seconds
    const forceCloseTimer = setTimeout(() => {
      console.log('Αυτόματο κλείσιμο του dialog σφάλματος λόγω timeout');
      onClose();
    }, 10000);
    
    // Keyboard escape listener
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        console.log('Κλείσιμο με πλήκτρο Escape');
        onClose();
      }
    };
    
    // Click outside listener
    const handleClickOutside = (e: MouseEvent) => {
      const dialogContent = document.querySelector('.DialogContent');
      if (dialogContent && !dialogContent.contains(e.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      clearTimeout(forceCloseTimer);
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-row items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-destructive" />
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
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="default" 
            onClick={sendToLovableChat}
            className="sm:order-2 w-full sm:w-auto flex items-center gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            Αποστολή στο chat
          </Button>
          <Button 
            variant="outline" 
            onClick={() => {
              navigator.clipboard.writeText(`${error.message}\n\n${error.stack || ''}`);
              toast.success('Αντιγράφηκε στο πρόχειρο');
            }}
            className="sm:order-1 w-full sm:w-auto flex items-center gap-2"
          >
            <Copy className="h-4 w-4" />
            Αντιγραφή
          </Button>
          <Button 
            variant="outline" 
            onClick={onClose}
            className="sm:order-1 w-full sm:w-auto"
          >
            Κλείσιμο
          </Button>
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
    // Καθαρισμός τυχόν υπαρχόντων σφαλμάτων κατά την αρχικοποίηση
    setErrors([]);
    
    // Ορισμός χειριστή για το lovable-error event
    const handleLovableError = (event: CustomEvent) => {
      console.log('Λήφθηκε lovable-error event:', event.detail);
      
      // Καθαρισμός όλων των προηγούμενων σφαλμάτων και εμφάνιση μόνο του νέου
      setErrors([event.detail]);
    };
    
    // Προσθήκη του window.lovableChat object αν δεν υπάρχει
    if (!window.lovableChat) {
      window.lovableChat = {};
    }
    
    // Προσθήκη της συνάρτησης createErrorDialog στο window.lovableChat
    window.lovableChat.createErrorDialog = (errorData: any) => {
      console.log('Κλήση του createErrorDialog με δεδομένα:', errorData);
      
      // Καθαρισμός όλων των προηγούμενων σφαλμάτων και εμφάνιση μόνο του νέου
      setErrors([errorData]);
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
      {errors.length > 0 && (
        <ErrorDialogInChat
          key={`error-${Date.now()}`}
          error={errors[0]}
          onClose={() => setErrors([])}
        />
      )}
    </>
  );
  
  return { ErrorDialogs, errors, clearAllErrors: () => setErrors([]) };
}
