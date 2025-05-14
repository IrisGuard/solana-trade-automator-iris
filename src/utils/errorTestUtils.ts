// Simple utility functions for testing error handling system

import { errorCollector, type ErrorData } from "@/utils/error-handling/collector";

/**
 * Generates a test error with specified details
 */
export function generateTestError(message: string = "This is a test error", options?: {
  component?: string;
  details?: any;
  source?: string;
}) {
  const error = new Error(message);
  errorCollector.captureError(error, {
    component: options?.component || "TestComponent",
    details: options?.details || { testMode: true },
    source: options?.source || "client",
  });
  return error;
}

/**
 * Generates test error data for display without throwing an error
 */
export function generateTestErrorData(message: string = "This is a test error"): ErrorData {
  return {
    id: `test-${Date.now()}`,
    timestamp: new Date().toISOString(),
    message: message,
    stack: "Test stack trace\n  at TestFunction (test.js:1:1)\n  at AnotherFunction (test.js:2:1)",
    component: "TestComponent",
    details: { testMode: true },
    source: "client",
    resolved: false
  };
}

/**
 * Generates various errors for testing the error handling system
 */
export function generateVariousErrors() {
  // Simple error
  generateTestError("Simple test error");
  
  // Error with component
  generateTestError("Component error", { component: "ButtonComponent" });
  
  // Error with details
  generateTestError("Error with details", { 
    details: { 
      userId: "123", 
      action: "checkout",
      code: "PAYMENT_FAILED"
    }
  });
  
  // Server error
  generateTestError("Server error", { source: "server" });
  
  // API error
  generateTestError("API error", { 
    component: "ApiClient", 
    details: { 
      endpoint: "/api/users", 
      statusCode: 404,
      response: { error: "Not found" }
    },
    source: "client"
  });
}

/**
 * Clears all errors in the collector
 */
export function clearAllErrors() {
  // This is a placeholder - actual implementation will depend on the error collector's API
  console.log("Clearing all errors");
  // In a real implementation, you would call something like:
  // errorCollector.clearErrors();
}
