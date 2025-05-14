
import React from 'react';
import { ThemeProvider } from "@/contexts/ThemeContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SupabaseAuthProvider } from '@/providers/SupabaseAuthProvider';
import { SolanaWalletProvider } from '@/providers/SolanaWalletProvider';
import { WalletErrorFallback } from '@/components/wallet/WalletErrorFallback';
import { ErrorBoundary } from 'react-error-boundary';
import { LanguageProvider } from '@/providers/LanguageProvider';

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
    <ThemeProvider defaultTheme="system">
      <LanguageProvider>
        <QueryClientProvider client={queryClient}>
          <SupabaseAuthProvider>
            <ErrorBoundary 
              FallbackComponent={WalletErrorFallback}
              onError={(error, info) => {
                console.error("Error in Solana Provider:", error);
                console.error("Component Stack:", info.componentStack);
              }}
            >
              <SolanaWalletProvider>
                {children}
              </SolanaWalletProvider>
            </ErrorBoundary>
          </SupabaseAuthProvider>
        </QueryClientProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
