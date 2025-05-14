
import { useEffect } from 'react';
import { setupGlobalErrorHandling } from '@/utils/errorUtils';

export function useConsoleErrorMonitor() {
  useEffect(() => {
    // Εγκατάσταση του global error handling
    const cleanup = setupGlobalErrorHandling();
    
    // Καθαρισμός κατά την απομόντωση
    return () => {
      cleanup();
    };
  }, []);
}
