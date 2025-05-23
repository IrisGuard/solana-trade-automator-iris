
import { toast } from 'sonner';
import { errorCollector } from './error-handling/collector';
import { displayError } from './error-handling/displayError';

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

export interface GenerateTestErrorOptions {
  message: string;
  errorType?: string;
  component?: string;
  details?: any;
  toastTitle?: string;
  showToast?: boolean;
  sendToChat?: boolean;
  logToConsole?: boolean;
  useCollector?: boolean;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

export function generateTestError(options: GenerateTestErrorOptions) {
  const {
    message,
    errorType = 'test',
    component = 'TestButton',
    details,
    toastTitle = 'Test Error',
    showToast = true,
    sendToChat = false,
    logToConsole = true,
    useCollector = true,
    severity = 'medium'
  } = options;

  const error = new Error(message);
  
  displayError(error, {
    title: toastTitle,
    showToast,
    logToConsole,
    useCollector,
    component,
    severity,
    source: errorType,
    details
  });
  
  if (sendToChat) {
    console.log(`[SendToChat] ${message}`, { errorType, component, details });
  }
}
