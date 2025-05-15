
import { toast } from "sonner";
import { errorCollector } from "./collector";
import { ErrorOptions } from "./collector/types";

interface DisplayErrorOptions extends ErrorOptions {
  toastTitle?: string;
  toastDescription?: string;
}

export function displayError(error: Error, options: DisplayErrorOptions = {}): string {
  // First, capture the error with the collector
  const errorId = errorCollector.captureError(error, options);
  
  // Determine if we should show a toast notification
  if (options.showToast) {
    const title = options.toastTitle || 'Error';
    const description = options.toastDescription || error.message;
    
    // Show toast with severity-based variant
    toast.error(title, {
      description,
      id: errorId
    });
  }
  
  return errorId;
}
