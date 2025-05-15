
import { BotError } from '../errorTypes';

export interface ErrorData {
  id: string;
  error: BotError | Error;
  timestamp: Date;
  component?: string;
  source?: string;
  severity?: 'low' | 'medium' | 'high';
  details?: any;
  resolved?: boolean;
}

export interface ErrorOptions {
  component?: string;
  source?: string;
  severity?: 'low' | 'medium' | 'high';
  details?: any;
  showUI?: boolean;
  showToast?: boolean;
}

export interface ErrorCollector {
  captureError(error: Error, options?: ErrorOptions): string;
  getErrors(): ErrorData[];
  clearErrors(): void;
  markResolved(errorId: string): boolean;
}
