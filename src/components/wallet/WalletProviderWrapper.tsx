
import React, { ReactNode, Suspense } from 'react';
import { toast, Toaster } from 'sonner';
import { ErrorBoundary } from 'react-error-boundary';

interface WalletProviderWrapperProps {
  children: ReactNode;
}

// Custom fallback component for wallet provider errors
function WalletErrorFallback() {
  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-md">
      <p className="text-red-600">Πρόβλημα φόρτωσης του Solana wallet provider.</p>
    </div>
  );
}

// Αυτό το component θα αποτρέπει τα σφάλματα όταν ο WalletProvider δεν είναι διαθέσιμος
export function WalletProviderWrapper({ children }: WalletProviderWrapperProps) {
  // Χειριστής σφαλμάτων για το ErrorBoundary
  const handleError = (error: Error) => {
    console.error("Error in WalletProvider:", error);
    toast.error("Πρόβλημα φόρτωσης του wallet provider");
  };

  return (
    <ErrorBoundary FallbackComponent={WalletErrorFallback} onError={handleError}>
      <Suspense fallback={<div>Φόρτωση wallet provider...</div>}>
        {/* Προσθήκη Toaster component για την εμφάνιση των toast notifications */}
        <Toaster position="top-right" richColors />
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}
