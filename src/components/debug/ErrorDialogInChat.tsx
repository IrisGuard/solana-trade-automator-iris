
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
      
      // Εντοπισμός των στοιχείων του chat
      const textarea = document.querySelector('.lov-chat-textarea') || 
                       document.querySelector('.lovable-chat-textarea') || 
                       document.querySelector('textarea.lovable-chat-input') || 
                       document.querySelector('textarea[placeholder*="Πληκτρολογήστε"]') || 
                       document.querySelector('textarea[placeholder*="Type"]') || 
                       document.querySelector('#lov-chat-textarea');
      
      const sendButton = document.querySelector('.lov-chat-send') || 
                         document.querySelector('.lovable-chat-send') || 
                         document.querySelector('button.lovable-send-button') || 
                         document.querySelector('button[aria-label*="Send"]') || 
                         document.querySelector('#lov-chat-send-button');
      
      if (textarea && sendButton) {
        // Typescript type assertion
        const textareaElement = textarea as HTMLTextAreaElement;
        // Εισαγωγή του περιεχομένου στο textarea
        textareaElement.value = errorMessage;
        
        // Ενεργοποίηση του event για να ενημερώσει το React για την αλλαγή
        const inputEvent = new Event('input', { bubbles: true });
        textareaElement.dispatchEvent(inputEvent);
        
        // Μικρή καθυστέρηση πριν το "κλικ" για να βεβαιωθούμε ότι το textarea έχει ενημερωθεί
        setTimeout(() => {
          // Κλικ στο κουμπί αποστολής
          (sendButton as HTMLButtonElement).click();
          // Κλείσιμο του dialog μετά την αποστολή
          onClose();
        }, 100);
      } else {
        console.error("Δεν βρέθηκαν τα στοιχεία της συνομιλίας για αποστολή του σφάλματος", {
          textareaFound: !!textarea,
          sendButtonFound: !!sendButton,
          availableTextareas: document.querySelectorAll('textarea').length,
          availableButtons: document.querySelectorAll('button').length
        });
        
        // Εναλλακτική μέθοδος - χρήση custom event
        const customEvent = new CustomEvent('lovable-send-to-chat', {
          detail: { message: errorMessage }
        });
        window.dispatchEvent(customEvent);
        
        // Κλείσιμο του dialog ακόμη κι αν αποτύχει η κύρια μέθοδος
        onClose();
      }
    } catch (e) {
      console.error("Σφάλμα κατά την αποστολή του σφάλματος στο chat:", e);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
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
