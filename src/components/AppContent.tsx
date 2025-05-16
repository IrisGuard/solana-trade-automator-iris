
import React, { useEffect } from "react";
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
import { ensureRouterCompatibility } from "@/utils/routerPatches";
import { SupabaseAuthProvider } from "@/providers/SupabaseAuthProvider";
import { EmergencyRecovery } from "@/components/emergency/EmergencyRecovery";
import { initProtectionSystem } from "@/utils/errorTestUtils";
import { HelpButton } from "@/components/help/HelpButton";

// Εφαρμογή διορθώσεων συμβατότητας του React Router
ensureRouterCompatibility();

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

function logError(error: Error, info: React.ErrorInfo) {
  console.error("[AppContent error]", error, info);
  
  errorCollector.captureError(error, {
    component: "AppContent",
    source: "app",
    details: { 
      componentStack: info.componentStack
    },
    severity: 'high'
  });
  
  captureException(error);
}

export function AppContent() {
  // Initialize the site protection system
  useEffect(() => {
    const protectionSystem = initProtectionSystem();
    console.log("Site protection system initialized");
    
    // Schedule periodic health checks
    const healthCheckInterval = setInterval(() => {
      protectionSystem.checkHealth();
    }, 5 * 60 * 1000); // Every 5 minutes
    
    return () => {
      clearInterval(healthCheckInterval);
    };
  }, []);
  
  return (
    <ErrorBoundary
      FallbackComponent={({ error }) => (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-4">
          <div className="max-w-md w-full p-6 border border-gray-800 rounded-lg bg-gray-950 shadow-lg">
            <h2 className="text-xl font-bold text-red-400 mb-2">Σφάλμα εφαρμογής</h2>
            <p className="text-gray-300 mb-4">Παρουσιάστηκε ένα σφάλμα κατά τη φόρτωση της εφαρμογής.</p>
            <pre className="mt-2 text-sm bg-gray-800 p-3 rounded overflow-auto max-h-48">{error.message}</pre>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
            >
              Επαναφόρτωση Σελίδας
            </button>
            <button 
              onClick={() => {
                // Try automatic recovery
                try {
                  const { SiteBackupService } = require("@/utils/site-protection/SiteBackupService");
                  SiteBackupService.restoreFromBackup();
                } catch (e) {
                  console.error("Failed to restore from backup:", e);
                  window.location.reload();
                }
              }}
              className="mt-2 w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded transition-colors"
            >
              Αυτόματη Αποκατάσταση
            </button>
          </div>
        </div>
      )}
      onError={logError}
    >
      <BrowserRouter>
        <ThemeProvider>
          <LanguageProvider defaultLanguage="el">
            <QueryClientProvider client={queryClient}>
              <SupabaseAuthProvider>
                <TooltipProvider>
                  <SolanaWalletProvider>
                    <WalletProviderWrapper>
                      <Routes />
                      <EmergencyRecovery />
                      <Toaster position="top-right" richColors />
                    </WalletProviderWrapper>
                  </SolanaWalletProvider>
                </TooltipProvider>
              </SupabaseAuthProvider>
            </QueryClientProvider>
          </LanguageProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
