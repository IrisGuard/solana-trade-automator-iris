
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useErrorReporting } from '@/hooks/useErrorReporting';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

// Component που εμφανίζεται σε περίπτωση σφάλματος
const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <Alert variant="destructive" className="my-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Σφάλμα στην εφαρμογή</AlertTitle>
      <AlertDescription className="mt-2">
        <p className="mb-2">
          Εντοπίστηκε ένα πρόβλημα κατά την εκτέλεση της εφαρμογής. Το σφάλμα έχει καταγραφεί αυτόματα.
        </p>
        <p className="text-sm font-mono bg-destructive/10 p-2 rounded max-h-32 overflow-y-auto mb-2">
          {error.message}
        </p>
        <Button 
          size="sm" 
          variant="outline"
          className="mt-2"
          onClick={resetErrorBoundary}
        >
          <RefreshCw className="h-4 w-4 mr-2" /> Επαναφόρτωση
        </Button>
      </AlertDescription>
    </Alert>
  );
};

interface GlobalErrorHandlerProps {
  children: React.ReactNode;
}

export const GlobalErrorHandler: React.FC<GlobalErrorHandlerProps> = ({ children }) => {
  const { reportError } = useErrorReporting();

  // Χειριστής σφαλμάτων που καταγράφει τα σφάλματα
  const logError = (error: Error, info: { componentStack: string }) => {
    reportError(error, {
      showToast: true,
      logToConsole: true,
      saveToDatabase: true
    });
  };

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={logError}
      onReset={() => {
        // Επαναφορά κατάστασης εδώ αν χρειάζεται
      }}
    >
      {children}
    </ErrorBoundary>
  );
};
