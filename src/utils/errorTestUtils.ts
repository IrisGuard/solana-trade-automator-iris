
// Add any additional types needed for the Error interface
interface ExtendedError extends Error {
  timestamp?: string;
  url?: string;
}

/**
 * Safely sanitizes error objects to ensure they have all expected properties
 * and can be safely used in error displays and logging.
 */
export function sanitizeErrorObject(error: unknown): ExtendedError {
  // If already an Error object, use it as the base
  const baseError: ExtendedError = error instanceof Error 
    ? error 
    : new Error(typeof error === 'string' ? error : 'Unknown error');
  
  // Ensure the error has a name
  if (!baseError.name) {
    baseError.name = 'Error';
  }
  
  // Ensure the error has a message
  if (!baseError.message) {
    baseError.message = 'An unknown error occurred';
  }
  
  // Add timestamp if not present
  if (!('timestamp' in baseError)) {
    baseError.timestamp = new Date().toISOString();
  }
  
  // Add URL if not present
  if (!('url' in baseError)) {
    baseError.url = typeof window !== 'undefined' ? window.location.href : 'unknown';
  }
  
  // Ensure the error has a stack trace
  if (!baseError.stack) {
    try {
      // This creates a stack trace
      Error.captureStackTrace(baseError);
    } catch (e) {
      baseError.stack = 'Stack trace not available';
    }
  }
  
  return baseError;
}

/**
 * Initialize the site protection system
 * This function implements site integrity checks and monitoring
 */
export function initProtectionSystem() {
  console.log("Initializing site protection system...");
  
  // Track startup time
  const startTime = Date.now();
  
  // Simple health check function that can be called periodically
  const checkHealth = () => {
    // Calculate uptime
    const uptime = Date.now() - startTime;
    
    // Check for DOM errors
    const domErrors = document.querySelectorAll('.error-indicator').length;
    
    // Basic browser compatibility check
    const isIE = 'documentMode' in document; // Safer way to check for IE
    
    console.log(`Health check - Uptime: ${uptime}ms, DOM Errors: ${domErrors}, Browser Issues: ${isIE ? 'Yes' : 'No'}`);
    
    return {
      healthy: !isIE && domErrors === 0,
      uptime,
      browserIssues: isIE,
      domErrors
    };
  };
  
  // Setup automatic health checks
  let healthCheckInterval: number;
  
  const startMonitoring = () => {
    healthCheckInterval = window.setInterval(() => {
      checkHealth();
    }, 30000) as unknown as number; // Run every 30 seconds
  };
  
  const stopMonitoring = () => {
    if (healthCheckInterval) {
      clearInterval(healthCheckInterval);
    }
  };
  
  // Start monitoring immediately
  startMonitoring();
  
  // Return the protection system API
  return {
    checkHealth,
    startMonitoring,
    stopMonitoring
  };
}

/**
 * Clear all collected errors from various error stores
 */
export function clearAllErrors() {
  // Clear errors from localStorage if available
  try {
    localStorage.removeItem('app_console_logs');
    localStorage.removeItem('app_errors');
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('lovable-clear-errors'));
    
    // Clear any errors in lovableChat if available
    if (window.lovableChat && window.lovableChat.clearErrors) {
      window.lovableChat.clearErrors();
    }
    
    console.log("All errors cleared successfully");
  } catch (e) {
    console.error("Error while clearing errors:", e);
  }
}
