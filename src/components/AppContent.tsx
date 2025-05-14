
import React, { Suspense, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Routes } from "@/routes";
import { Toaster } from "@/components/ui/toaster";
import { WalletProviderWrapper } from "@/components/wallet/WalletProviderWrapper";
import { SolanaWalletProvider } from "@/providers/SolanaWalletProvider";
import { WalletErrorFallback } from "@/components/wallet/WalletErrorFallback";
import { MonitoringSystem } from "@/components/monitoring/MonitoringComponents";
import { ConsoleMonitor } from "@/components/debug/ConsoleMonitor";
import { displayError } from "@/utils/errorUtils";
import { setupGlobalErrorHandling } from "@/utils/error-handling/setupGlobalErrorHandling";
import { useNavigate, useLocation } from "@/lib/router-exports";

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

  const navigate = useNavigate();
  const location = useLocation();
  
  // Redirect στη σωστή σελίδα μετά από ανανέωση αν είμαστε σε σφάλμα
  useEffect(() => {
    // Έλεγχος αν υπάρχει παράμετρος σφάλματος στο URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('error')) {
      navigate('/');
      return;
    }
    
    // Έλεγχος για token ή σύνδεση στην URL και ανακατεύθυνση στη σωστή σελίδα
    if (location.pathname === '/' && (location.hash.includes('access_token') || location.hash.includes('error'))) {
      navigate('/auth', { replace: true });
    }
  }, [navigate, location]);

  return (
    <Suspense fallback={<AppLoader />}>
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
