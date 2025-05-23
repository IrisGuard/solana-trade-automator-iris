
export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface ErrorContext {
  component?: string;
  source?: string;
  details?: any;
  severity?: ErrorSeverity;
  method?: string;
}

export interface BotError extends Error {
  errorCode?: string;
  context?: any;
  metadata?: any;
  status?: string;
  errorId?: string;
}
