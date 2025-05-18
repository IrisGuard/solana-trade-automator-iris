
import React from 'react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';

// This component serves as a fallback when the real provider fails or isn't available
export interface SolanaProviderFallbackProps {
  children: React.ReactNode;
}

export function SolanaProviderFallback({ children }: SolanaProviderFallbackProps) {
  return (
    <WalletModalProvider>
      {children}
    </WalletModalProvider>
  );
}
