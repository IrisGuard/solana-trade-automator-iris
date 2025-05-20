
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ErrorDialogContentProps {
  error: {
    message: string;
    stack?: string;
    timestamp?: string;
    url?: string;
  };
  onClose: () => void;
  errorCode?: string;
}

export function ErrorDialogContent({ error, onClose, errorCode }: ErrorDialogContentProps) {
  // Format timestamp if available, otherwise use current time
  const timestamp = error.timestamp ? new Date(String(error.timestamp)).toLocaleString() : new Date().toLocaleString();
  
  // Ensure stack trace is displayed as a string
  const stackTrace = typeof error.stack === 'string' 
    ? error.stack 
    : error.stack 
      ? JSON.stringify(error.stack, null, 2)
      : 'No stack trace available';
  
  // Ensure message is a string
  const errorMessage = typeof error.message === 'string' 
    ? error.message 
    : error.message 
      ? JSON.stringify(error.message, null, 2)
      : 'Unknown error';
  
  return (
    <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden">
      <DialogHeader>
        <DialogTitle className="text-destructive">Σφάλμα Εφαρμογής</DialogTitle>
      </DialogHeader>
      
      <div className="py-2">
        <h3 className="font-medium mb-1">Μήνυμα σφάλματος:</h3>
        <p className="text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded">
          {errorMessage}
        </p>
      </div>
      
      {errorCode && (
        <div className="py-2">
          <h3 className="font-medium mb-1">Κωδικός σφάλματος:</h3>
          <p className="text-sm font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">
            {String(errorCode)}
          </p>
        </div>
      )}
      
      <div className="py-2">
        <h3 className="font-medium mb-1">Λεπτομέρειες:</h3>
        <div className="text-xs space-y-1">
          <p>Χρόνος: {timestamp}</p>
          {typeof error.url === 'string' && <p>URL: {error.url}</p>}
        </div>
      </div>
      
      <Separator />
      
      <div className="py-2">
        <h3 className="font-medium mb-1">Τεχνικές πληροφορίες:</h3>
        <ScrollArea className="h-[200px] rounded border">
          <pre className="text-xs p-3 whitespace-pre-wrap">
            {stackTrace}
          </pre>
        </ScrollArea>
      </div>
      
      <DialogFooter>
        <Button 
          variant="default" 
          onClick={onClose}
        >
          Κλείσιμο
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
