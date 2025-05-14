
export interface ErrorDisplayOptions {
  showToast?: boolean;
  logToConsole?: boolean;
  sendToChat?: boolean;
  useCollector?: boolean;
  component?: string;
  details?: any;
  source?: string;
}

export interface TestErrorOptions {
  errorType?: 'reference' | 'type' | 'syntax' | 'promise' | 'async' | 'timeout' | 'render' | 'prop' | 'state' | 'network';
  component?: string;
  details?: any;
  source?: string;
}
