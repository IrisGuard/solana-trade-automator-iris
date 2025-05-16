
interface Window {
  solflare?: any;
  phantom?: any;
  SolflareApp?: any;
  lovableChat?: {
    createErrorDialog?: (errorData: any) => void;
    clearErrors?: () => void;
    [key: string]: any;
  };
  _lastErrorDisplayTime?: number;
  _lastErrorMessage?: string;
  _lastErrorDisplayTimes?: {
    [errorId: string]: number;
  };
  _errorQueue?: Array<{
    message: string;
    stack?: string;
    timestamp: string;
    type: string;
  }>;
  
  // Add React type for JSX runtime
  React: typeof import('react') & {
    jsx?: any;
    jsxs?: any;
    jsxDEV?: any;
    Fragment?: typeof import('react').Fragment;
  };
  
  // Property for router patch
  patchedReactRouter?: boolean;
  
  // Add errorCollector property with correct type
  errorCollector: any;
  
  // Add siteHealth property
  siteHealth?: {
    check: () => any;
    lastCheck?: any;
    repair: () => any;
    getLastCheck?: () => any;
  };
  
  // Add siteBackup property
  siteBackup: {
    create: (options?: any) => boolean;
    restore: (showNotification?: boolean) => boolean;
    check: () => boolean;
    countBackups: () => number;
    maxBackups: () => number;
  };
}
