
/**
 * Options for error handling
 */
export interface ErrorOptions {
  /**
   * Component where the error occurred
   */
  component?: string;
  
  /**
   * Custom error code
   */
  code?: string;
  
  /**
   * Additional context information about the error
   */
  context?: Record<string, any>;
  
  /**
   * Whether to suppress console logging
   */
  silent?: boolean;
  
  /**
   * Whether to show a toast notification
   */
  showToast?: boolean;
  
  /**
   * Whether to report the error to the server
   */
  reportToServer?: boolean;
  
  /**
   * Error severity level
   */
  severity?: 'low' | 'medium' | 'high' | 'critical';
}
