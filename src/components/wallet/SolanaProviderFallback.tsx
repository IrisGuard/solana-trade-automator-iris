
import React from 'react';

interface SolanaProviderFallbackProps {
  children: React.ReactNode;
}

export function SolanaProviderFallback({ children }: SolanaProviderFallbackProps) {
  return <>{children}</>;
}
