
import { ErrorData, ErrorOptions } from "../types";

/**
 * Interface defining the functionality of the error collector
 */
export interface ErrorCollector {
  captureError(error: Error | string, options?: ErrorOptions): string;
  getErrors(): ErrorData[];
  clearErrors(): void;
  hasCriticalErrors(): boolean;
  getRecentErrors(count?: number): ErrorData[];
  collectError(error: Error | string, options?: ErrorOptions): string;
}

/**
 * Options for configuring an error 
 */
export { type ErrorOptions, type ErrorData } from "../types";
