
export interface ErrorData {
  id?: string;
  message: string;
  stack?: string;
  timestamp: Date;
  component?: string;
  source?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  data?: any;
  url?: string;
}

export interface ErrorOptions {
  component?: string;
  source?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  details?: any;
}

export interface ErrorContext {
  component?: string;
  source?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  details?: any;
}
