
interface ErrorContext {
  component?: string;
  source?: string;
  details?: Record<string, any>;
  additional?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  showToast?: boolean;
  toastTitle?: string;
  showUI?: boolean;
  sendToChat?: boolean;
  useCollector?: boolean;
  notifyUser?: boolean;
}

export function useErrorReporting() {
  const reportError = (error: unknown, context?: ErrorContext) => {
    // Extract meaningful information from the error
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    // Log to console with context
    console.error('Error reported:', {
      message: errorMessage,
      stack: errorStack,
      ...context
    });
    
    // In a production app, we would send this to an error tracking service
    
    return { reported: true, errorId: Date.now().toString() };
  };

  return { reportError };
}
