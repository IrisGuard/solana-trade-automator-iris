
import React from 'react';
import { SolanaWalletProvider } from '@/providers/SolanaWalletProvider';

interface WalletProviderWrapperProps {
  children: React.ReactNode;
}

export function WalletProviderWrapper({ children }: WalletProviderWrapperProps) {
  return (
    <SolanaWalletProvider>
      {children}
    </SolanaWalletProvider>
  );
}
