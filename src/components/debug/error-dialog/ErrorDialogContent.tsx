
import React from 'react';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle, MessageSquare, Copy, X } from 'lucide-react';
import { toast } from 'sonner';

interface ErrorDialogContentProps {
  error: {
    message: string;
    stack?: string;
    timestamp: string;
    url: string;
  };
  onClose: () => void;
  errorCode: string;
}

export function ErrorDialogContent({ error, onClose, errorCode }: ErrorDialogContentProps) {
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
    } catch (e) {
      console.error("Σφάλμα κατά την αποστολή του σφάλματος στο chat:", e);
    }
  };

  return (
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
        
        <ErrorCodeDisplay errorCode={errorCode} />
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
          className="sm:order-1 w-full sm:w-auto flex items-center gap-2"
        >
          <X className="h-4 w-4" />
          Κλείσιμο
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

// Εξωτερικό component για κωδικό σφάλματος
function ErrorCodeDisplay({ errorCode }: { errorCode: string }) {
  return (
    <div className="border border-muted p-2 rounded mt-4">
      <h4 className="font-medium mb-1 text-sm flex justify-between items-center">
        <span>Κωδικός Σφάλματος:</span>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 px-2 text-xs"
          onClick={() => {
            navigator.clipboard.writeText(errorCode);
            toast.success('Ο κωδικός αντιγράφηκε στο πρόχειρο');
          }}
        >
          <Copy className="h-3 w-3 mr-1" />
          Αντιγραφή
        </Button>
      </h4>
      <code className="text-xs bg-muted p-2 rounded block">{errorCode}</code>
    </div>
  );
}
