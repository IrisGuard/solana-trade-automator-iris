
interface Window {
  // React globals
  React: typeof import('react');
  ReactDOM: typeof import('react-dom');
  
  // Site backup utility
  siteBackup: {
    create: (options?: any) => boolean;
    restore: (showNotification?: boolean) => boolean;
    check: () => boolean;
    countBackups: () => number;
    maxBackups: () => number;
  };
  
  // Error collector utility
  errorCollector?: any;
  
  // Buffer for crypto operations
  Buffer: typeof Buffer;
  
  // Process shim for Node.js compatibility
  process: {
    env: Record<string, string>;
    browser: boolean;
    version: string;
    nextTick: (fn: Function) => void;
  };
}
