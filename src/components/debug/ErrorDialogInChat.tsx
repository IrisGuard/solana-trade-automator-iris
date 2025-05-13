
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
      
      // Άμεση καταγραφή για debugging
      console.log('Προσπάθεια αποστολής σφάλματος στο chat:', { errorMessage });
      
      // Εντοπισμός των στοιχείων του chat με πολλαπλές στρατηγικές
      const textareaSelectors = [
        '.lov-chat-textarea', 
        '.lovable-chat-textarea', 
        'textarea.lovable-chat-input',
        'textarea[placeholder*="Πληκτρολογήστε"]',
        'textarea[placeholder*="Type"]',
        '#lov-chat-textarea',
        'textarea'  // Τελευταία προσπάθεια: οποιοδήποτε textarea
      ];
      
      const sendButtonSelectors = [
        '.lov-chat-send',
        '.lovable-chat-send', 
        'button.lovable-send-button',
        'button[aria-label*="Send"]',
        '#lov-chat-send-button',
        'button[type="submit"]', // Συνήθως κουμπιά αποστολής
        'button:last-child' // Τελευταία προσπάθεια
      ];
      
      // Αναζήτηση για το πρώτο textarea που ταιριάζει με οποιοδήποτε από τους selectors
      let textarea = null;
      for (const selector of textareaSelectors) {
        const element = document.querySelector(selector);
        if (element) {
          textarea = element;
          console.log('Βρέθηκε textarea με selector:', selector);
          break;
        }
      }
      
      // Αναζήτηση για το πρώτο κουμπί αποστολής που ταιριάζει με οποιοδήποτε από τους selectors
      let sendButton = null;
      for (const selector of sendButtonSelectors) {
        const element = document.querySelector(selector);
        if (element) {
          sendButton = element;
          console.log('Βρέθηκε κουμπί αποστολής με selector:', selector);
          break;
        }
      }
      
      console.log('Αποτελέσματα αναζήτησης UI:', { 
        textareaFound: !!textarea, 
        sendButtonFound: !!sendButton,
        availableTextareas: document.querySelectorAll('textarea').length,
        availableButtons: document.querySelectorAll('button').length
      });
      
      if (textarea && sendButton) {
        // Typescript type assertion
        const textareaElement = textarea as HTMLTextAreaElement;
        
        // Αποθήκευση αρχικής τιμής για επαναφορά σε περίπτωση αποτυχίας
        const originalValue = textareaElement.value;
        
        // Εισαγωγή του περιεχομένου στο textarea
        textareaElement.value = errorMessage;
        
        // Ενεργοποίηση του event για να ενημερώσει το React για την αλλαγή
        const inputEvent = new Event('input', { bubbles: true });
        textareaElement.dispatchEvent(inputEvent);
        
        // Μικρή καθυστέρηση πριν το "κλικ" για να βεβαιωθούμε ότι το textarea έχει ενημερωθεί
        setTimeout(() => {
          try {
            // Κλικ στο κουμπί αποστολής
            (sendButton as HTMLButtonElement).click();
            console.log('Κλικ στο κουμπί αποστολής επιτυχές');
            
            // Κλείσιμο του dialog μετά την αποστολή
            onClose();
          } catch (clickError) {
            console.error('Σφάλμα κατά το κλικ στο κουμπί αποστολής:', clickError);
            // Επαναφορά της αρχικής τιμής του textarea σε περίπτωση αποτυχίας
            textareaElement.value = originalValue;
            textareaElement.dispatchEvent(inputEvent);
          }
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
        console.log('Αποστολή μέσω custom event');
        
        // Παρά την αποτυχία, κλείνουμε το dialog
        onClose();
        
        // Εναλλακτικά, δημιουργία ενός προσωρινού textarea απευθείας στο body
        try {
          const tempTextarea = document.createElement('textarea');
          tempTextarea.value = errorMessage;
          document.body.appendChild(tempTextarea);
          tempTextarea.select();
          document.execCommand('copy');
          document.body.removeChild(tempTextarea);
          alert('Το σφάλμα αντιγράφηκε στο πρόχειρο. Μπορείτε να το επικολλήσετε στο chat.');
        } catch (copyError) {
          console.error('Αποτυχία δημιουργίας προσωρινού textarea:', copyError);
        }
      }
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
    }, 30000); // 30 seconds timeout
    
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
      // Προσθήκη του σφάλματος στη λίστα
      setErrors(prev => {
        // Έλεγχος για διπλότυπα σφάλματα
        const isDuplicate = prev.some(err => 
          err.message === event.detail.message && 
          err.timestamp === event.detail.timestamp
        );
        
        if (isDuplicate) {
          console.log('Το σφάλμα υπάρχει ήδη, παραλείπεται');
          return prev;
        }
        
        return [...prev, event.detail];
      });
    };
    
    // Προσθήκη του window.lovableChat object αν δεν υπάρχει
    if (!window.lovableChat) {
      window.lovableChat = {};
    }
    
    // Προσθήκη της συνάρτησης createErrorDialog στο window.lovableChat
    window.lovableChat.createErrorDialog = (errorData: any) => {
      console.log('Κλήση του createErrorDialog με δεδομένα:', errorData);
      
      // Έλεγχος για διπλότυπα σφάλματα
      setErrors(prev => {
        const isDuplicate = prev.some(err => 
          err.message === errorData.message && 
          err.timestamp === errorData.timestamp
        );
        
        if (isDuplicate) {
          console.log('Το σφάλμα υπάρχει ήδη, παραλείπεται');
          return prev;
        }
        
        return [...prev, errorData];
      });
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
    console.log('Αφαίρεση σφάλματος με index:', index);
    setErrors(prev => prev.filter((_, i) => i !== index));
  };
  
  // Καθαρισμός όλων των σφαλμάτων
  const clearAllErrors = () => {
    console.log('Καθαρισμός όλων των σφαλμάτων');
    setErrors([]);
  };
  
  // Παροχή των components για τα διαλογικά παράθυρα σφαλμάτων
  const ErrorDialogs = () => (
    <>
      {errors.map((error, index) => (
        <ErrorDialogInChat
          key={`error-${index}-${error.timestamp || Date.now()}`}
          error={error}
          onClose={() => removeError(index)}
        />
      ))}
    </>
  );
  
  return { ErrorDialogs, errors, clearAllErrors };
}
