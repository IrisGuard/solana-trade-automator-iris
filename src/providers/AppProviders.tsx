
import React from 'react';
import { ThemeProvider } from "@/providers/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SupabaseProvider } from '@/providers/SupabaseAuthProvider';
import { SolanaWalletProvider } from '@/providers/SolanaWalletProvider';
import { WalletErrorFallback } from '@/components/wallet/WalletErrorFallback';
import { ErrorBoundary } from 'react-error-boundary';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false
    }
  }
});

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <SupabaseProvider>
          <ErrorBoundary 
            FallbackComponent={({ error }) => <WalletErrorFallback error={error} />}
            onError={(error, info) => {
              console.error("Error in Solana Provider:", error);
              console.error("Component Stack:", info.componentStack);
            }}
          >
            <SolanaWalletProvider>
              {children}
            </SolanaWalletProvider>
          </ErrorBoundary>
        </SupabaseProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
