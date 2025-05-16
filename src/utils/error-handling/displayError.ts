
import { toast } from 'sonner';

interface DisplayErrorOptions {
  showToast?: boolean;
  toastTitle?: string;
  toastDescription?: string;
  duration?: number;
}

export function displayError(error: Error, options: DisplayErrorOptions = {}) {
  const {
    showToast = true,
    toastTitle = 'Σφάλμα',
    toastDescription,
    duration = 5000
  } = options;
  
  // Always log to console
  console.error('Error displayed:', error);
  
  // Show toast notification if requested
  if (showToast) {
    toast.error(toastTitle, {
      description: toastDescription || error.message,
      duration
    });
  }
  
  return error;
}
