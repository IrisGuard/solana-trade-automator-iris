
import React, { Suspense } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AppContent } from "./components/AppContent";
import { ErrorBoundary } from "react-error-boundary";
import { Toaster } from "sonner";
import { ThemeProvider } from "./providers/ThemeProvider";
import { LanguageProvider } from "./providers/LanguageProvider";
import { WalletProviderWrapper } from "./components/wallet/WalletProviderWrapper";
import { SolanaWalletProvider } from "./providers/SolanaWalletProvider";

function App() {
  return (
    <ErrorBoundary fallback={<div>Σφάλμα εφαρμογής</div>}>
      <ThemeProvider>
        <LanguageProvider>
          <Router>
            <WalletProviderWrapper>
              <SolanaWalletProvider>
                <AppContent />
                <Toaster position="top-right" richColors />
              </SolanaWalletProvider>
            </WalletProviderWrapper>
          </Router>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
