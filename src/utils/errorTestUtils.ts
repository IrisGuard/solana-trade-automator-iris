
import { toast } from "sonner";
import { errorCollector } from "./error-handling/collector";
import { TestErrorOptions } from "./error-handling/types";

/**
 * Creates a test error with the specified options
 */
export function createTestError(options: TestErrorOptions = {}) {
  const {
    message = "This is a test error",
    errorType = "Error",
    component = "ErrorTestComponent",
    details = null,
    simulateDelay = 0
  } = options;

  let error: Error;

  // Create different types of errors for testing
  switch (errorType) {
    case "TypeError":
      error = new TypeError(message);
      break;
    case "ReferenceError":
      error = new ReferenceError(message);
      break;
    case "SyntaxError":
      error = new SyntaxError(message);
      break;
    default:
      error = new Error(message);
  }

  // Add stack trace if not present
  if (!error.stack) {
    try {
      throw error;
    } catch (e) {
      error = e as Error;
    }
  }

  const captureError = () => {
    // Capture the error in the collector
    const errorId = errorCollector.captureError(error, {
      component,
      details,
      source: "test"
    });

    // Optionally show toast notification
    toast.error(`Test error: ${message}`);

    return errorId;
  };

  // Either capture immediately or after delay
  if (simulateDelay > 0) {
    return new Promise<string>(resolve => {
      setTimeout(() => {
        const errorId = captureError();
        resolve(errorId);
      }, simulateDelay);
    });
  } else {
    return captureError();
  }
}

/**
 * Creates an async test error
 */
export function createAsyncTestError(options: TestErrorOptions = {}) {
  return new Promise<string>((_, reject) => {
    setTimeout(() => {
      const error = new Error(options.message || "Async test error");
      
      // Add the error to the collector before rejecting
      const errorId = errorCollector.captureError(error, {
        component: options.component || "AsyncTestComponent",
        details: options.details,
        source: "test"
      });
      
      // Attach the ID to the error
      (error as any).id = errorId;
      
      reject(error);
    }, options.simulateDelay || 100);
  });
}

/**
 * Simulates a network error
 */
export function createNetworkTestError(options: TestErrorOptions = {}) {
  return new Promise<Response>((_, reject) => {
    setTimeout(() => {
      const error = new Error(options.message || "Network request failed");
      error.name = "NetworkError";
      
      // Add the error to the collector before rejecting
      const errorId = errorCollector.captureError(error, {
        component: options.component || "NetworkTestComponent",
        details: options.details || { request: { url: "https://api.example.com/test" } },
        source: "test"
      });
      
      // Attach the ID to the error
      (error as any).id = errorId;
      
      reject(error);
    }, options.simulateDelay || 100);
  });
}

/**
 * Simulates a UI error
 */
export function createUITestError(options: TestErrorOptions = {}) {
  const error = new Error(options.message || "UI rendering error");
  error.name = "UIError";
  
  // Add the error to the collector
  const errorId = errorCollector.captureError(error, {
    component: options.component || "UITestComponent",
    details: options.details || { element: "Button", props: { disabled: true } },
    source: "test"
  });
  
  // Optionally display in UI
  toast.error(`UI Test Error: ${error.message}`);
  
  return errorId;
}

/**
 * Clears all errors from the collector
 */
export function clearAllErrors() {
  errorCollector.clearErrors();
  toast.success("All errors cleared");
  return true;
}
