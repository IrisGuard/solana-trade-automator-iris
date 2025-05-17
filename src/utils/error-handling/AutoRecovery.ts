
import { errorCollector } from './collector';
import { SiteBackupService } from '../site-protection/SiteBackupService';
import { SiteHealthMonitor } from './SiteHealthMonitor';

// Define patterns for errors that are considered critical
const CRITICAL_ERROR_PATTERNS = [
  "Uncaught TypeError: Cannot read properties of",
  "Uncaught TypeError: undefined is not a function",
  "Maximum update depth exceeded",
  "Failed to fetch",
  "Network Error",
  "ChunkLoadError",
  "Loading chunk",
  "Script error",
  "SecurityError",
];

// Track error count within time window
const ERROR_WINDOW_MS = 60000; // 1 minute
const CRITICAL_ERROR_THRESHOLD = 5;

const errorTimestamps: number[] = [];

/**
 * Auto-recovery system that monitors errors and can perform automatic recovery
 */
export class AutoRecovery {
  /**
   * Initialize the auto-recovery system
   */
  public static init() {
    // Integrate with error collector
    this.patchErrorCollector();
    
    // Set up window error handler
    this.setupGlobalErrorHandler();
    
    // Initialize health monitor
    SiteHealthMonitor.start();
    
    console.log("Auto-recovery system initialized");
  }
  
  /**
   * Analyze an error to determine if it's critical
   * @param error The error to analyze
   */
  public static analyzeError(error: Error | string): { isCritical: boolean; recoveryRecommended: boolean } {
    const errorMessage = typeof error === 'string' ? error : error.message;
    
    // Check if error matches any critical patterns
    const isCriticalPattern = CRITICAL_ERROR_PATTERNS.some(pattern => 
      errorMessage.includes(pattern)
    );
    
    // Record error timestamp and clean up old entries
    const now = Date.now();
    errorTimestamps.push(now);
    errorTimestamps.splice(0, errorTimestamps.findIndex(ts => ts >= now - ERROR_WINDOW_MS));
    
    // Check if we've exceeded the threshold for errors in the time window
    const recentErrorsCount = errorTimestamps.length;
    const frequentErrors = recentErrorsCount >= CRITICAL_ERROR_THRESHOLD;
    
    return {
      isCritical: isCriticalPattern,
      recoveryRecommended: isCriticalPattern || frequentErrors
    };
  }
  
  /**
   * Attempt recovery based on error analysis
   * @param error The error that triggered recovery
   */
  public static attemptRecovery(error: Error | string): boolean {
    const analysis = this.analyzeError(error);
    
    if (analysis.recoveryRecommended) {
      console.warn("Critical error detected, attempting recovery", 
        typeof error === 'string' ? error : error.message
      );
      
      // Perform health check first
      const healthCheck = SiteHealthMonitor.checkHealth();
      
      // If health check also shows issues or error is critical, restore from backup
      if (healthCheck.criticalIssuesFound || analysis.isCritical) {
        return SiteBackupService.restoreFromBackup();
      }
    }
    
    return false;
  }
  
  /**
   * Patch the error collector to integrate auto-recovery
   */
  private static patchErrorCollector() {
    // Store the original captureError method
    const originalCaptureError = errorCollector.captureError;
    
    // Replace with our version that includes recovery logic
    errorCollector.captureError = function(error: Error | string, options = {}) {
      // First, call the original method to ensure errors are properly logged
      const errorId = originalCaptureError.call(this, error, options);
      
      // Then perform our auto-recovery analysis
      AutoRecovery.attemptRecovery(error);
      
      return errorId;
    };
  }
  
  /**
   * Set up global error handler for unhandled errors
   */
  private static setupGlobalErrorHandler() {
    // Store original handler
    const originalOnError = window.onerror;
    
    // Replace with enhanced handler
    window.onerror = (message, source, lineno, colno, error) => {
      // Call original handler if it exists
      if (originalOnError) {
        originalOnError.call(window, message, source, lineno, colno, error);
      }
      
      // Analyze and potentially recover from error
      const errorObject = error || new Error(String(message));
      AutoRecovery.attemptRecovery(errorObject);
      
      // Return false to allow error to propagate to console
      return false;
    };
  }
}
