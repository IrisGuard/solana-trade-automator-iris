
import React, { useEffect, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Routes } from "@/routes";
import { Toaster } from "@/components/ui/toaster";
import { WalletProviderWrapper } from "@/components/wallet/WalletProviderWrapper";
import { SolanaWalletProvider } from "@/providers/SolanaWalletProvider";
import { WalletErrorFallback } from "@/components/wallet/WalletErrorFallback";
import { MonitoringSystem } from "@/components/monitoring/MonitoringComponents";
import { ConsoleMonitor } from "@/components/debug/ConsoleMonitor";
import { DOMErrorHandler } from "@/components/errors/DOMErrorHandler";
import { displayError } from "@/utils/errorUtils";
import { setupGlobalErrorHandling } from "@/utils/error-handling/setupGlobalErrorHandling";

// Loader component για το Suspense
const AppLoader = () => (
  <div className="flex items-center justify-center h-screen">
    Φόρτωση εφαρμογής...
  </div>
);

// Log error handler για τα wallet errors
const logWalletError = (error: Error, info: { componentStack: string }) => {
  displayError(error, {
    title: "Σφάλμα Wallet",
    showToast: true,
    logToConsole: true,
    sendToChat: true,
    useCollector: true
  });
};

export function AppContent() {
  // Ρύθμιση global error handling
  useEffect(() => {
    setupGlobalErrorHandling();
  }, []);
  
  return (
    <Suspense fallback={<AppLoader />}>
      <DOMErrorHandler />
      <MonitoringSystem />
      <ConsoleMonitor />
      
      <WalletProviderWrapper>
        <ErrorBoundary 
          FallbackComponent={WalletErrorFallback}
          onError={logWalletError}
          onReset={() => window.location.href = "/"}
        >
          <SolanaWalletProvider>
            <Routes />
            <Toaster />
          </SolanaWalletProvider>
        </ErrorBoundary>
      </WalletProviderWrapper>
    </Suspense>
  );
}
