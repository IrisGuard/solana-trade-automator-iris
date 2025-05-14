
export interface ErrorOptions {
  title?: string; 
  message?: string;
  code?: string | number;
  source?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  showToast?: boolean;
  showDialog?: boolean;
  details?: string | Record<string, unknown>;
}
