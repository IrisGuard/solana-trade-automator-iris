
import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "sonner";
import { displayError } from "@/utils/errorUtils";

interface AppErrorBoundaryProps {
  children: React.ReactNode;
  fallbackComponent: React.ComponentType<{ error: Error, resetErrorBoundary: () => void }>;
}

export function AppErrorBoundary({ children, fallbackComponent }: AppErrorBoundaryProps) {
  // Error logger
  const logError = (error: Error, info: { componentStack: string }) => {
    displayError(error, {
      title: "Σφάλμα εφαρμογής",
      showToast: true,
      logToConsole: true,
      sendToChat: true,
      useCollector: true
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

  return (
    <ErrorBoundary
      FallbackComponent={fallbackComponent}
      onError={logError}
    >
      {children}
    </ErrorBoundary>
  );
}
