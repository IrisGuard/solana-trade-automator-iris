
export interface ErrorData {
  id?: string;
  message: string;
  stack?: string;
  component?: string;
  details?: string | Record<string, any>;
  source?: string;
  url?: string;
  browserInfo?: Record<string, any>;
  timestamp: string | number;
}

export interface ErrorOptions {
  component?: string;
  details?: any;
  source?: string;
  url?: string;
  browserInfo?: Record<string, any>;
}

export type ErrorDisplayOptions = {
  toastDuration?: number;
  component?: string;
  details?: Record<string, any>;
  source?: string;
  showToast?: boolean;
  logToConsole?: boolean;
  sendToChat?: boolean;
  useCollector?: boolean;
  title?: string;
};
