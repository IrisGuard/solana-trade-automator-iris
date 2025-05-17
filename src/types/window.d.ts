
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
}
