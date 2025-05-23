
export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface ErrorContext {
  component?: string;
  source?: string;
  details?: any;
  severity?: ErrorSeverity;
}
