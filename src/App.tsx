
import { Routes } from "./routes";
import { BrowserRouter } from "./lib/router-exports";
import { ThemeProvider } from "./contexts/ThemeContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/sonner";
import { SolanaWalletProvider } from "./providers/SolanaWalletProvider";
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "sonner";
import { WalletProviderWrapper } from "./components/wallet/WalletProviderWrapper";
import { SolanaProviderFallback } from "./components/wallet/SolanaProviderFallback";
import { Suspense } from "react";
import { SupabaseAuthProvider } from "./providers/SupabaseAuthProvider";
import { LanguageProvider } from "./providers/LanguageProvider";
import { GlobalErrorHandler } from "./components/errors/GlobalErrorHandler";
import { useConsoleErrorMonitor } from "./hooks/useConsoleErrorMonitor";
import { ConsoleMonitor } from "./components/debug/ConsoleMonitor";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      meta: {
        // Move error handling logic to the meta object
        onError: (error: Error) => {
          console.error("Σφάλμα αιτήματος:", error);
          toast.error(
            "Σφάλμα αιτήματος δεδομένων",
            { description: error instanceof Error ? error.message : "Παρουσιάστηκε σφάλμα κατά την ανάκτηση δεδομένων" }
          );
        }
      }
    },
  },
});

// Fallback component for wallet provider errors
function FallbackComponent() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <div className="mb-4 text-red-500">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <h1 className="text-2xl font-bold">Πρόβλημα φόρτωσης</h1>
      <p className="mt-2 text-muted-foreground">Υπήρξε πρόβλημα κατά τη φόρτωση της εφαρμογής Solana Trade Automator.</p>
      <button 
        className="mt-4 rounded bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        onClick={() => window.location.reload()}
      >
        Επαναφόρτωση σελίδας
      </button>
    </div>
  );
}

// Error logger
const logError = (error: Error, info: { componentStack: string }) => {
  console.error("Σφάλμα εφαρμογής:", error);
  
  // Αποθήκευση λεπτομερειών σφάλματος
  const errorDetails = {
    message: error.message,
    stack: error.stack,
    componentStack: info.componentStack,
    url: window.location.href,
    timestamp: new Date().toISOString(),
  };
  
  // Αποθήκευση του σφάλματος στο localStorage για προσωρινή διατήρηση
  try {
    const storedErrors = JSON.parse(localStorage.getItem('app_errors') || '[]');
    storedErrors.push(errorDetails);
    localStorage.setItem('app_errors', JSON.stringify(storedErrors.slice(-10))); // Διατήρηση των τελευταίων 10 σφαλμάτων
  } catch (e) {
    console.error("Σφάλμα κατά την αποθήκευση του σφάλματος:", e);
  }
  
  // Εμφάνιση toast
  toast.error("Σφάλμα εφαρμογής: " + error.message);
};

function ErrorMonitor() {
  useConsoleErrorMonitor();
  return null;
}

function App() {
  return (
    <GlobalErrorHandler>
      <ThemeProvider defaultTheme="system">
        <LanguageProvider>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <SupabaseAuthProvider>
                <ErrorBoundary FallbackComponent={FallbackComponent} onError={logError}>
                  <Suspense fallback={<div className="flex items-center justify-center h-screen">Φόρτωση εφαρμογής...</div>}>
                    <ErrorMonitor />
                    <ConsoleMonitor /> {/* Προσθήκη του νέου ConsoleMonitor για παρακολούθηση των σφαλμάτων */}
                    <WalletProviderWrapper>
                      <ErrorBoundary 
                        FallbackComponent={() => (
                          <SolanaProviderFallback>
                            <Routes />
                            <Toaster position="bottom-right" />
                          </SolanaProviderFallback>
                        )} 
                        onError={logError}
                      >
                        <SolanaWalletProvider>
                          <Routes />
                          <Toaster position="bottom-right" />
                        </SolanaWalletProvider>
                      </ErrorBoundary>
                    </WalletProviderWrapper>
                  </Suspense>
                </ErrorBoundary>
              </SupabaseAuthProvider>
            </BrowserRouter>
          </QueryClientProvider>
        </LanguageProvider>
      </ThemeProvider>
    </GlobalErrorHandler>
  );
}

export default App;
