
import { useEffect } from 'react';
import { setupGlobalErrorHandling } from '@/utils/error-handling/setupGlobalErrorHandling';

export function useConsoleErrorMonitor() {
  useEffect(() => {
    // Εγκατάσταση του global error handling
    const cleanup = setupGlobalErrorHandling();
    
    // Καθαρισμός κατά την απομόντωση
    return cleanup;
  }, []);
}
