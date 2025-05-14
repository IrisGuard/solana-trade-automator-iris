
export interface ErrorData {
  id: string;
  message: string;
  stack?: string;
  component: string;
  source: string;
  details?: any;
  timestamp: string;
}
