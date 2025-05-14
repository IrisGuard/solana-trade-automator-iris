
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
import { ThemeProvider } from "@/providers/ThemeProvider";
import { LanguageProvider } from "@/providers/LanguageProvider";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 60000 // 1 minute
    }
  }
});

function logWalletError(error: Error, info: React.ErrorInfo) {
  console.error("[AppContent error]", error, info);
  
  errorCollector.captureError(error, {
    component: "AppContent",
    source: "app",
    details: info,
    severity: 'high'
  });
  
  captureException(error);
}

export function AppContent() {
  return (
    <ErrorBoundary
      FallbackComponent={({ error }) => (
        <div className="text-center p-4">
          <h2 className="text-xl font-bold text-red-500">Κάτι πήγε λάθος!</h2>
          <pre className="mt-2 text-sm">{error.message}</pre>
        </div>
      )}
      onError={logWalletError}
    >
      <BrowserRouter>
        <ThemeProvider>
          <LanguageProvider>
            <SolanaWalletProvider>
              <WalletProviderWrapper>
                <QueryClientProvider client={queryClient}>
                  <TooltipProvider>
                    <Routes />
                    <Toaster position="top-right" richColors />
                  </TooltipProvider>
                </QueryClientProvider>
              </WalletProviderWrapper>
            </SolanaWalletProvider>
          </LanguageProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
