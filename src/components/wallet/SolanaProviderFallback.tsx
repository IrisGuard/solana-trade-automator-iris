
import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

interface SolanaProviderFallbackProps {
  children: React.ReactNode;
}

export function SolanaProviderFallback({ children }: SolanaProviderFallbackProps) {
  // We're simply passing through the children
  return <>{children}</>;
}
