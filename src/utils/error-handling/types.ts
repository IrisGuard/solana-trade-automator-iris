
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
  
  /**
   * Title for the error message
   */
  title?: string;
  
  /**
   * Whether to send error to chat
   */
  sendToChat?: boolean;
  
  /**
   * Whether to use the error collector
   */
  useCollector?: boolean;
}

/**
 * Options for displaying errors
 */
export interface ErrorDisplayOptions extends ErrorOptions {
  /**
   * Whether to log to console
   */
  logToConsole?: boolean;
  
  /**
   * Source of the error
   */
  source?: string;
  
  /**
   * Additional details about the error
   */
  details?: any;
}
