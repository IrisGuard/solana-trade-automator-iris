
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

// Import the ErrorOptions from the central types file
export type { ErrorOptions } from '../types';

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
