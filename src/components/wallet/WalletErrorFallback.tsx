
import React from 'react';
import { FallbackProps } from 'react-error-boundary';
import { Button } from '@/components/ui/button';

export function WalletErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-background">
      <div className="w-full max-w-md p-6 space-y-6 border rounded-lg shadow-lg">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold tracking-tight">Πρόβλημα με το Wallet</h2>
          <p className="text-sm text-muted-foreground">
            Παρουσιάστηκε ένα σφάλμα κατά τη σύνδεση με το wallet.
          </p>
        </div>
        
        <div className="p-4 border border-red-200 bg-red-50 dark:bg-red-900/20 rounded-md text-sm">
          <p className="font-medium text-red-800 dark:text-red-300">Σφάλμα: {error.message}</p>
        </div>
        
        <div className="space-y-4">
          <Button className="w-full" onClick={resetErrorBoundary}>
            Προσπάθεια Επανασύνδεσης
          </Button>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => window.location.href = '/'}
          >
            Επιστροφή στην Αρχική
          </Button>
        </div>
        
        <p className="text-xs text-center text-muted-foreground">
          Αν το πρόβλημα παραμένει, επικοινωνήστε με την υποστήριξη.
        </p>
      </div>
    </div>
  );
}
