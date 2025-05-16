
import { errorCollector } from './collector';
import type { ErrorSeverity, SystemError } from './errorTypes';

class ErrorManager {
  private errors: SystemError[] = [];
  private maxErrors: number = 100;
  
  constructor() {
    // Initialize with empty array
    this.errors = [];
    
    // Set up periodic sync with errorCollector
    this.setupPeriodicSync();
  }
  
  /**
   * Add a new error to the error manager
   */
  public addError(error: SystemError): void {
    this.errors.unshift(error);
    
    // Limit the number of stored errors
    if (this.errors.length > this.maxErrors) {
      this.errors.pop();
    }
  }
  
  /**
   * Log an error message
   */
  public logError(
    message: string, 
    source: string = 'application', 
    level: 'CRITICAL' | 'WARNING' | 'INFO' = 'INFO'
  ): string {
    const errorId = `err_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    
    const newError: SystemError = {
      id: errorId,
      message,
      timestamp: new Date().toISOString(),
      level,
      source,
    };
    
    this.addError(newError);
    
    // Pass to error collector as well for unified collection
    const severity: ErrorSeverity = level === 'CRITICAL' ? 'critical' : 
                                   level === 'WARNING' ? 'medium' : 'low';
    
    errorCollector.captureError(new Error(message), {
      component: source,
      source: 'system',
      severity
    });
    
    return errorId;
  }
  
  /**
   * Get recent errors
   */
  public getRecentErrors(limit: number = 10): SystemError[] {
    return this.errors.slice(0, limit);
  }
  
  /**
   * Clear all errors
   */
  public clearErrors(): void {
    this.errors = [];
  }
  
  /**
   * Mark an error as resolved
   */
  public resolveError(id: string): boolean {
    const error = this.errors.find(e => e.id === id);
    if (error) {
      error.resolved = true;
      return true;
    }
    return false;
  }
  
  /**
   * Mark an error as auto-resolved
   */
  public autoResolveError(id: string): boolean {
    const error = this.errors.find(e => e.id === id);
    if (error) {
      error.autoResolved = true;
      error.resolved = true;
      return true;
    }
    return false;
  }
  
  /**
   * Set up periodic sync with errorCollector
   */
  private setupPeriodicSync() {
    // Every minute, sync errors from collector to manager
    setInterval(() => {
      this.syncFromCollector();
    }, 60000);
  }
  
  /**
   * Sync errors from collector to manager
   */
  private syncFromCollector() {
    try {
      const collectorErrors = errorCollector.getErrors();
      
      for (const error of collectorErrors) {
        // Skip if we already have this error
        if (this.errors.some(e => e.id === error.id)) continue;
        
        // Map severity to level
        let level: 'CRITICAL' | 'WARNING' | 'INFO';
        switch (error.severity) {
          case 'critical':
          case 'high':
            level = 'CRITICAL';
            break;
          case 'medium':
            level = 'WARNING';
            break;
          default:
            level = 'INFO';
        }
        
        // Add to our errors
        this.addError({
          id: error.id,
          message: error.message || 'Unknown error',
          timestamp: error.timestamp,
          level,
          source: error.component || error.source || 'unknown',
          stackTrace: error.stack,
        });
      }
    } catch (e) {
      console.error('[ErrorManager] Failed to sync from collector:', e);
    }
  }
}

// Export singleton instance
export const errorManager = new ErrorManager();
