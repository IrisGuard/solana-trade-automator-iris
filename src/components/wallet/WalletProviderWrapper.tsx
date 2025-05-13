
import React, { ReactNode } from 'react';
import { toast } from 'sonner';

// Αυτό το component θα αποτρέπει τα σφάλματα όταν ο WalletProvider δεν είναι διαθέσιμος
export function WalletProviderWrapper({ children }: { children: ReactNode }) {
  try {
    return <>{children}</>;
  } catch (error) {
    console.error("Error in WalletProvider:", error);
    toast.error("Πρόβλημα φόρτωσης του wallet provider");
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600">Πρόβλημα φόρτωσης του Solana wallet provider.</p>
      </div>
    );
  }
}
