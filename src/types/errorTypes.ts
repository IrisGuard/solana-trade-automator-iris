
/**
 * Enhanced Error interface supporting custom properties commonly used in our application
 */
export interface EnhancedError extends Error {
  // Common custom properties used in our error system
  status?: number;
  code?: string;
  errors?: Record<string, string[]>;
  details?: string;
  table?: string;
  constraint?: string;
  // Any additional properties can be added via index signature
  [key: string]: any;
}

/**
 * Creates an enhanced error with custom properties
 */
export function createEnhancedError(message: string, properties: Partial<EnhancedError> = {}): EnhancedError {
  const error = new Error(message) as EnhancedError;
  
  // Add all provided properties to the error object
  Object.assign(error, properties);
  
  return error;
}
