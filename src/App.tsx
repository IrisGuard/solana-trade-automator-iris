
import { Routes } from "./routes";
import { BrowserRouter } from "./lib/router-exports";
import { ThemeProvider } from "./contexts/ThemeContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { SolanaWalletProvider } from "./providers/SolanaWalletProvider";
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "sonner";
import { WalletProviderWrapper } from "./components/wallet/WalletProviderWrapper";
import { SolanaProviderFallback } from "./components/wallet/SolanaProviderFallback";
import { Suspense, useEffect } from "react";
import { SupabaseAuthProvider } from "./providers/SupabaseAuthProvider";
import { LanguageProvider } from "./providers/LanguageProvider";
import { GlobalErrorHandler } from "./components/errors/GlobalErrorHandler";
import { useConsoleErrorMonitor } from "./hooks/useConsoleErrorMonitor";
import { ConsoleMonitor } from "./components/debug/ConsoleMonitor";
import { useErrorDialogInChat } from "./components/debug/ErrorDialogInChat";
import { displayError } from "./utils/errorUtils";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      meta: {
        // Move error handling logic to the meta object
        onError: (error: Error) => {
          displayError(error, {
            title: "Σφάλμα αιτήματος δεδομένων",
            showToast: true,
            logToConsole: true,
            sendToChat: true
          });
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
  displayError(error, {
    title: "Σφάλμα εφαρμογής",
    showToast: true,
    logToConsole: true,
    sendToChat: true
  });
  
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
};

function ErrorMonitor() {
  useConsoleErrorMonitor();
  return null;
}

// Component για την εμφάνιση των διαλογικών παραθύρων σφάλματος
function ErrorDialogsRenderer() {
  const { ErrorDialogs } = useErrorDialogInChat();
  return <ErrorDialogs />;
}

function NetworkErrorDetector() {
  useEffect(() => {
    // Παρακολούθηση για σφάλματα δικτύου
    const handleOnline = () => {
      toast.success("Επανασύνδεση δικτύου", {
        description: "Η σύνδεση στο διαδίκτυο αποκαταστάθηκε"
      });
    };

    const handleOffline = () => {
      toast.error("Απώλεια δικτύου", {
        description: "Η σύνδεση στο διαδίκτυο διακόπηκε. Ελέγξτε τη σύνδεσή σας.",
        duration: 0 // Μόνιμο μέχρι να επανασυνδεθεί
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return null;
}

function PublishErrorMonitor() {
  useEffect(() => {
    // Έλεγχος για σφάλματα κατά τη δημοσίευση
    const handlePublishErrors = () => {
      try {
        // Έλεγχος αν βρισκόμαστε σε περιβάλλον production
        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
          console.log("Εκτελείται έλεγχος για σφάλματα δημοσίευσης...");
          
          // Έλεγχος Supabase σύνδεσης
          fetch('https://lvkbyfocssuzcdphpmfu.supabase.co/rest/v1/', {
            headers: {
              'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2a2J5Zm9jc3N1emNkcGhwbWZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4MDk3NTIsImV4cCI6MjA2MjM4NTc1Mn0.fkQe2TgniccYP-AvrYnFL_ladauqL7-ULiTagMDszhc'
            }
          })
            .then(response => {
              if (!response.ok) throw new Error("Αδυναμία σύνδεσης με το Supabase");
              console.log("Επιτυχής σύνδεση με το Supabase");
            })
            .catch(error => {
              displayError(`Σφάλμα σύνδεσης με το Supabase: ${error.message}`, {
                title: "Σφάλμα κατά τη δημοσίευση",
                showToast: true,
                sendToChat: true
              });
            });
            
          // Άλλοι έλεγχοι που μπορείτε να προσθέσετε...
        }
      } catch (e) {
        console.error("Σφάλμα κατά τον έλεγχο σφαλμάτων δημοσίευσης:", e);
      }
    };
    
    // Εκτέλεση του ελέγχου μετά από λίγο για να επιτρέψουμε στην εφαρμογή να φορτώσει πλήρως
    const timer = setTimeout(handlePublishErrors, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
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
                    <ConsoleMonitor />
                    <NetworkErrorDetector />
                    <PublishErrorMonitor />
                    <ErrorDialogsRenderer />
                    <WalletProviderWrapper>
                      <ErrorBoundary 
                        FallbackComponent={() => (
                          <SolanaProviderFallback>
                            <Routes />
                            <Toaster />
                          </SolanaProviderFallback>
                        )} 
                        onError={logError}
                      >
                        <SolanaWalletProvider>
                          <Routes />
                          <Toaster />
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
