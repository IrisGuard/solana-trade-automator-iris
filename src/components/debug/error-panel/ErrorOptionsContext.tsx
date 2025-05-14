
import { createContext, useContext, useState } from 'react';

interface ErrorOptionsContextType {
  errorMessage: string;
  showToast: boolean;
  logToConsole: boolean;
  sendToChat: boolean;
  useCollector: boolean;
  setErrorMessage: (message: string) => void;
  setShowToast: (show: boolean) => void;
  setLogToConsole: (log: boolean) => void;
  setSendToChat: (send: boolean) => void;
  setUseCollector: (use: boolean) => void;
}

const ErrorOptionsContext = createContext<ErrorOptionsContextType | undefined>(undefined);

export function ErrorOptionsProvider({ children }: { children: React.ReactNode }) {
  const [errorMessage, setErrorMessage] = useState('Δοκιμαστικό σφάλμα');
  const [showToast, setShowToast] = useState(true);
  const [logToConsole, setLogToConsole] = useState(true);
  const [sendToChat, setSendToChat] = useState(true);
  const [useCollector, setUseCollector] = useState(false);

  return (
    <ErrorOptionsContext.Provider
      value={{
        errorMessage,
        showToast,
        logToConsole,
        sendToChat,
        useCollector,
        setErrorMessage,
        setShowToast,
        setLogToConsole,
        setSendToChat,
        setUseCollector
      }}
    >
      {children}
    </ErrorOptionsContext.Provider>
  );
}

export function useErrorOptions() {
  const context = useContext(ErrorOptionsContext);
  if (!context) {
    throw new Error('useErrorOptions must be used within an ErrorOptionsProvider');
  }
  return context;
}
