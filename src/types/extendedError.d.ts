
/**
 * Extends the Error interface to include custom properties used in our error handling system
 */
interface ExtendedError extends Error {
  timestamp?: string;
  url?: string;
  component?: string;
  source?: string;
  details?: Record<string, unknown>;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

// Augment the Error interface
declare global {
  interface Error {
    timestamp?: string;
    url?: string;
  }
}
