
import React from 'react';
import { Loader2, Wallet, LogOut } from "lucide-react";

interface WalletButtonContentProps {
  isConnecting: boolean;
  showHeliusStatus: boolean;
  isConnected: boolean;
  walletAddress: string | null;
  children?: React.ReactNode;
}

export function WalletButtonContent({
  isConnecting,
  showHeliusStatus,
  isConnected,
  walletAddress,
  children
}: WalletButtonContentProps) {
  if (isConnecting) {
    return (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        <span>Σύνδεση...</span>
      </>
    );
  }
  
  if (showHeliusStatus) {
    return (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        <span>Συγχρονισμός Helius...</span>
      </>
    );
  }
  
  if (isConnected) {
    return (
      <>
        {walletAddress && (
          <span className="mr-2 text-xs md:text-sm">
            {`${walletAddress.substring(0, 4)}...${walletAddress.substring(walletAddress.length - 4)}`}
          </span>
        )}
        <LogOut className="h-4 w-4" />
        {children || <span className="sr-only md:not-sr-only md:ml-1">Αποσύνδεση</span>}
      </>
    );
  }
  
  return (
    <>
      <Wallet className="mr-2 h-4 w-4" />
      {children || <span>Σύνδεση με Wallet</span>}
    </>
  );
}
