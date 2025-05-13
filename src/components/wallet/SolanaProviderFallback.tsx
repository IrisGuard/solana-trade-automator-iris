
import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

interface SolanaProviderFallbackProps {
  children: React.ReactNode;
}

export function SolanaProviderFallback({ children }: SolanaProviderFallbackProps) {
  const { wallet, connecting } = useWallet();
  
  // We'll always render children - the individual components will handle
  // their own fallbacks/loading states as needed
  return <>{children}</>;
}
