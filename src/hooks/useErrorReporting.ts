
import { useCallback } from "react";
import { displayError, ErrorDisplayOptions } from "@/utils/error-handling/displayError";
import { errorCollector } from "@/utils/error-handling/collector";

export function useErrorReporting() {
  // Συνάρτηση για αναφορά σφάλματος
  const reportError = useCallback((error: Error | string, options?: ErrorDisplayOptions) => {
    return displayError(error, options);
  }, []);

  // Συνάρτηση για καταγραφή σφάλματος στο Supabase
  const captureError = useCallback(async (error: Error, options: { component?: string, details?: any, source?: string } = {}) => {
    return await errorCollector.captureError(error, options);
  }, []);

  // Συνάρτηση για λήψη όλων των σφαλμάτων
  const getAllErrors = useCallback(() => {
    return errorCollector.getErrors();
  }, []);

  // Συνάρτηση για καθαρισμό όλων των σφαλμάτων
  const clearAllErrors = useCallback(() => {
    errorCollector.clearErrors();
  }, []);

  return {
    reportError,
    captureError,
    getAllErrors,
    clearAllErrors
  };
}
