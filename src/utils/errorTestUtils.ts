
import { toast } from 'sonner';
import { errorCollector } from './error-handling/collector';

export function clearAllErrors() {
  try {
    // Clear error collector
    errorCollector.clearErrors();
    
    // Clear any stored errors in localStorage
    localStorage.removeItem('app_errors');
    localStorage.removeItem('apiKeys_backup');
    
    // Clear console
    console.clear();
    
    toast.success('Όλα τα σφάλματα καθαρίστηκαν');
  } catch (error) {
    console.error('Error clearing errors:', error);
    toast.error('Σφάλμα κατά τον καθαρισμό σφαλμάτων');
  }
}
