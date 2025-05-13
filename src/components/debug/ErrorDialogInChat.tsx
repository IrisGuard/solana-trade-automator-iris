
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle, MessageSquare } from 'lucide-react';

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
      
      // Προσπάθεια να βρεθεί το textarea του chat
      const textarea = document.querySelector('.lov-chat-textarea') || 
                       document.querySelector('textarea[placeholder*="Type"]') || 
                       document.querySelector('textarea'); // Fallback σε οποιοδήποτε textarea

      if (textarea) {
        try {
          // Αντιγραφή στο πρόχειρο για χειροκίνητη επικόλληση
          navigator.clipboard.writeText(errorMessage).then(() => {
            // Εμφάνιση μηνύματος ότι αντιγράφηκε στο πρόχειρο
            alert('Το σφάλμα αντιγράφηκε στο πρόχειρο. Μπορείτε να το επικολλήσετε στο chat.');
          });
        } catch (copyError) {
          console.error('Σφάλμα κατά την αντιγραφή στο πρόχειρο:', copyError);
        }
      } else {
        // Εναλλακτική μέθοδος με αποστολή event
        const customEvent = new CustomEvent('lovable-send-to-chat', {
          detail: { message: errorMessage }
        });
        window.dispatchEvent(customEvent);
        console.log('Αποστολή μέσω custom event');
      }
      
      // Κλείσιμο του dialog μετά την προσπάθεια αποστολής
      onClose();
    } catch (e) {
      console.error("Σφάλμα κατά την αποστολή του σφάλματος στο chat:", e);
      // Σιγουρευόμαστε ότι το dialog θα κλείσει ακόμα κι αν αποτύχει η αποστολή
      onClose();
    }
  };

  // Force close mechanism
  useEffect(() => {
    // Create a force close timer
    const forceCloseTimer = setTimeout(() => {
      console.log('Αναγκαστικό κλείσιμο του dialog σφάλματος λόγω timeout');
      onClose();
    }, 15000); // 15 seconds timeout (reduced from 30)
    
    // Keyboard escape listener
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        console.log('Κλείσιμο με πλήκτρο Escape');
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      clearTimeout(forceCloseTimer);
      document.removeEventListener('keydown', handleEscape);
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
  
  // Αφαίρεση σφάλματος από τη λίστα
  const removeError = (index: number) => {
    console.log('Αφαίρεση σφάλματος με index:', index);
    setErrors([]);
  };
  
  // Καθαρισμός όλων των σφαλμάτων
  const clearAllErrors = () => {
    console.log('Καθαρισμός όλων των σφαλμάτων');
    setErrors([]);
  };
  
  // Παροχή των components για τα διαλογικά παράθυρα σφαλμάτων
  const ErrorDialogs = () => (
    <>
      {errors.length > 0 && (
        <ErrorDialogInChat
          key={`error-${Date.now()}`}
          error={errors[0]}
          onClose={clearAllErrors}
        />
      )}
    </>
  );
  
  return { ErrorDialogs, errors, clearAllErrors };
}
