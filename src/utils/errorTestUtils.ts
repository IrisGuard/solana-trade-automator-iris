
import { errorCollector } from "./error-handling/collector";
import { toast } from "sonner";
import { ErrorOptions } from "./error-handling/types";

/**
 * Generates an error for testing purposes
 */
export function generateTestError(options: ErrorOptions = {}) {
  const {
    errorType = "type",
    component = "TestComponent",
    details = {},
    source = "test"
  } = options;

  let error: Error;

  switch (errorType) {
    case "reference":
      error = new ReferenceError("Test Reference Error");
      break;
    case "syntax":
      error = new SyntaxError("Test Syntax Error");
      break;
    case "type":
      error = new TypeError("Test Type Error");
      break;
    default:
      error = new Error(`Test Error (${errorType})`);
  }

  errorCollector.captureError(error, {
    component,
    details,
    source
  });

  return error;
}

/**
 * Generates various types of errors for testing
 */
export function generateVariousErrors() {
  generateTestError({ errorType: "type", component: "TypeErrorTest" });
  generateTestError({ errorType: "reference", component: "ReferenceErrorTest" });
  generateTestError({ errorType: "syntax", component: "SyntaxErrorTest" });
  
  // Async error
  setTimeout(() => {
    generateTestError({ errorType: "async", component: "AsyncErrorTest" });
  }, 100);
}

/**
 * Clear all errors from the collector
 */
export function clearAllErrors() {
  errorCollector.clearAllErrors();
  toast.success("All errors cleared");
}

export type { ErrorOptions };
