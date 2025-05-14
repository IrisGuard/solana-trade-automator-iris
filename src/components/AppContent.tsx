
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Routes } from "@/routes";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SolanaWalletProvider } from "@/providers/SolanaWalletProvider";
import { WalletProviderWrapper } from "@/components/wallet/WalletProviderWrapper";
import { ErrorBoundary } from "react-error-boundary";
import { errorCollector } from "@/utils/error-handling/collector";
import { captureException } from "@/utils/error-handling/errorReporting";
import { TooltipProvider } from "@/components/ui/tooltip"; 

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function logWalletError(error: Error, info: { componentStack: string }) {
  // Capture error for debugging
  console.error("[unknown]", error, info);
  
  // Collect error for display in error panel
  errorCollector.addError({
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    component: "WalletProvider",
    source: "wallet",
  });
  
  // Send to error reporting service if available
  captureException(error);
}

export function AppContent() {
  return (
    <ErrorBoundary
      FallbackComponent={({ error }) => (
        <div className="text-center p-4">
          <h2 className="text-xl font-bold text-red-500">Something went wrong!</h2>
          <pre className="mt-2 text-sm">{error.message}</pre>
        </div>
      )}
      onError={logWalletError}
    >
      <BrowserRouter>
        <SolanaWalletProvider>
          <WalletProviderWrapper>
            <QueryClientProvider client={queryClient}>
              <TooltipProvider>
                <Routes />
                <Toaster position="top-right" />
              </TooltipProvider>
            </QueryClientProvider>
          </WalletProviderWrapper>
        </SolanaWalletProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
