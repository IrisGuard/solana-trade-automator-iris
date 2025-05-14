
/**
 * Options for error handling
 */
export interface ErrorOptions {
  title?: string;
  showToast?: boolean;
  logToConsole?: boolean;
  useCollector?: boolean;
  component?: string;
  details?: any;
  source?: string;
}
