
export interface ErrorData {
  id?: string;
  message: string;
  stack?: string;
  timestamp: Date | string | number;
  component?: string;
  code?: string;
  context?: Record<string, any>;
  handled: boolean;
  source?: string;
}

export interface ErrorCollectorOptions {
  maxErrors?: number;
  reportToServer?: boolean;
}
