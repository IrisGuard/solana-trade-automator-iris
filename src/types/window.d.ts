
interface Window {
  solana?: {
    isPhantom?: boolean;
    connect: (options?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: any }>;
    disconnect: () => Promise<void>;
  };
  solflare?: any;
  phantom?: any;
  SolflareApp?: any;
  lovableChat?: {
    createErrorDialog?: (errorData: any) => void;
    clearErrors?: () => void;
    [key: string]: any;
  };
  errorCollector?: {
    captureError: (error: any, context?: any) => void;
    getErrors: () => any[];
    clearErrors: () => void;
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
}
