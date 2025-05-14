
import { useEffect } from 'react';
import { setupGlobalErrorHandling } from '@/utils/error-handling/setupGlobalErrorHandling';

export function useConsoleErrorMonitor() {
  useEffect(() => {
    // Εγκατάσταση του global error handling
    setupGlobalErrorHandling();
    
    // Καθαρισμός κατά την απομόντωση - nothing to clean up since setupGlobalErrorHandling doesn't return a cleanup function
    return () => {
      // Nothing to clean up as setupGlobalErrorHandling doesn't return a cleanup function
    };
  }, []);
}
