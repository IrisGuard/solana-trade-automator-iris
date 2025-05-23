
import React, { useState, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "sonner";
import { displayError } from "@/utils/error-handling/displayError";
import { useErrorReporting } from "@/hooks/useErrorReporting";

interface AppErrorBoundaryProps {
  children: React.ReactNode;
  fallbackComponent: React.ComponentType<{ error: Error, resetErrorBoundary: () => void }>;
}

export function AppErrorBoundary({ children, fallbackComponent }: AppErrorBoundaryProps) {
  const { reportError } = useErrorReporting();
  const [hasError, setHasError] = useState(false);

  // Reset error state when the component remounts
  useEffect(() => {
    setHasError(false);
  }, []);

  // Error logger
  const logError = (error: Error, info: { componentStack: string }) => {
    console.error("[ErrorBoundary] Caught React error:", error);
    console.error("[ErrorBoundary] Component stack:", info.componentStack);
    
    // Check if it's a network-related error
    const isNetworkError = error.message.includes('network') || 
                          error.message.includes('fetch') || 
                          error.message.includes('Failed to load');

    // Check if it's a rendering error
    const isRenderError = info.componentStack.includes('render') || 
                         error.message.includes('render') ||
                         error.message.includes('element type');
    
    displayError(error, {
      toastTitle: isNetworkError ? "Σφάλμα δικτύου" : 
                 isRenderError ? "Σφάλμα απεικόνισης" : 
                 "Σφάλμα εφαρμογής",
      showToast: true,
      component: 'AppErrorBoundary',
      sendToChat: true,
      useCollector: true,
      severity: isNetworkError ? 'high' : 'high', // Changed from 'critical' to 'high'
      details: {
        componentStack: info.componentStack,
        errorType: isNetworkError ? 'network' : 
                  isRenderError ? 'render' : 'unknown',
        url: window.location.href
      }
    });
    
    setHasError(true);
    
    // Αποθήκευση λεπτομερειών σφάλματος
    const errorDetails = {
      message: error.message,
      stack: error.stack,
      componentStack: info.componentStack,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      isNetworkError,
      isRenderError
    };
    
    // Αποθήκευση του σφάλματος στο localStorage για προσωρινή διατήρηση
    try {
      const storedErrors = JSON.parse(localStorage.getItem('app_errors') || '[]');
      storedErrors.push(errorDetails);
      localStorage.setItem('app_errors', JSON.stringify(storedErrors.slice(-10))); // Διατήρηση των τελευταίων 10 σφαλμάτων
    } catch (e) {
      console.error("Σφάλμα κατά την αποθήκευση του σφάλματος:", e);
      reportError(e instanceof Error ? e : new Error("Failed to store error"), {
        component: "AppErrorBoundary",
        severity: "low"
      });
    }

    // Auto-reload on specific errors that might be temporary
    if (isNetworkError && !localStorage.getItem('attempted_reload')) {
      toast.error("Προσπάθεια επαναφόρτωσης...", { duration: 3000 });
      localStorage.setItem('attempted_reload', 'true');
      
      // Set a timeout to reload the page
      setTimeout(() => {
        window.location.reload();
      }, 3500);
      
      // Clear the reload flag after 1 minute
      setTimeout(() => {
        localStorage.removeItem('attempted_reload');
      }, 60000);
    }
  };

  const handleReset = () => {
    console.log("[ErrorBoundary] Attempting to reset error state and retry rendering");
    setHasError(false);
    
    // Clear any error indicators
    localStorage.removeItem('attempted_reload');
  };

  return (
    <ErrorBoundary
      FallbackComponent={fallbackComponent}
      onError={logError}
      onReset={handleReset}
    >
      {children}
      {hasError && (
        <div style={{ display: 'none' }} id="error-boundary-triggered" data-error="true" />
      )}
    </ErrorBoundary>
  );
}
