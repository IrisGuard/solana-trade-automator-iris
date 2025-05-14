
import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RateLimitNotificationProps {
  isVisible: boolean;
  onClose: () => void;
  position?: 'top' | 'center';
  className?: string;
  message?: string;
}

export function RateLimitNotification({
  isVisible,
  onClose,
  position = 'top',
  className,
  message = 'Solana API rate limit exceeded'
}: RateLimitNotificationProps) {
  if (!isVisible) return null;

  return (
    <div 
      className={cn(
        "fixed z-50 left-1/2 transform -translate-x-1/2 px-4 w-full max-w-md", 
        position === 'top' ? "top-4" : "top-1/2 -translate-y-1/2",
        className
      )}
    >
      <div className="bg-rose-50 border border-rose-200 rounded-lg shadow-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-rose-500" />
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-rose-800">
              {message}
            </h3>
            <div className="mt-1 text-sm text-rose-700">
              <p>
                Please try again in a moment. The application will use cached data if available.
              </p>
            </div>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              type="button"
              className="inline-flex text-rose-500 hover:text-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Context για τη διαχείριση των rate limit notifications σε επίπεδο εφαρμογής
export const RateLimitContext = React.createContext({
  showRateLimitNotification: (_message?: string) => {},
  hideRateLimitNotification: () => {},
  isRateLimitNotificationVisible: false
});

export function RateLimitProvider({ children }: { children: React.ReactNode }) {
  const [isVisible, setIsVisible] = React.useState(false);
  const [message, setMessage] = React.useState('Solana API rate limit exceeded');
  const [autoHideTimer, setAutoHideTimer] = React.useState<NodeJS.Timeout | null>(null);
  
  // Αποφυγή πολλαπλών ειδοποιήσεων σε σύντομο χρονικό διάστημα
  const lastNotificationTime = React.useRef<number>(0);
  const MIN_NOTIFICATION_INTERVAL = 5000; // 5 δευτερόλεπτα
  
  const showNotification = React.useCallback((customMessage?: string) => {
    const now = Date.now();
    
    // Έλεγχος αν έχει περάσει αρκετός χρόνος από την τελευταία ειδοποίηση
    if (now - lastNotificationTime.current < MIN_NOTIFICATION_INTERVAL) {
      console.log("Throttling rate limit notification");
      return;
    }
    
    lastNotificationTime.current = now;
    
    if (customMessage) {
      setMessage(customMessage);
    }
    
    setIsVisible(true);
    
    // Αυτόματη απόκρυψη μετά από 5 δευτερόλεπτα
    if (autoHideTimer) clearTimeout(autoHideTimer);
    const timer = setTimeout(() => setIsVisible(false), 5000);
    setAutoHideTimer(timer);
  }, [autoHideTimer]);
  
  const hideNotification = React.useCallback(() => {
    setIsVisible(false);
    if (autoHideTimer) clearTimeout(autoHideTimer);
  }, [autoHideTimer]);
  
  React.useEffect(() => {
    return () => {
      if (autoHideTimer) clearTimeout(autoHideTimer);
    };
  }, [autoHideTimer]);
  
  // Προσθήκη global event listener για rate limit errors
  React.useEffect(() => {
    const handleRateLimitError = (e: CustomEvent) => {
      if (e.detail && e.detail.errorType === 'rate-limit') {
        showNotification(e.detail.message);
      }
    };
    
    window.addEventListener('rate-limit-error' as any, handleRateLimitError as EventListener);
    
    return () => {
      window.removeEventListener('rate-limit-error' as any, handleRateLimitError as EventListener);
    };
  }, [showNotification]);
  
  return (
    <RateLimitContext.Provider
      value={{
        showRateLimitNotification: showNotification,
        hideRateLimitNotification: hideNotification,
        isRateLimitNotificationVisible: isVisible
      }}
    >
      {children}
      <RateLimitNotification
        isVisible={isVisible}
        onClose={hideNotification}
        message={message}
      />
    </RateLimitContext.Provider>
  );
}

// Hook για τη χρήση του rate limit context
export function useRateLimitNotification() {
  return React.useContext(RateLimitContext);
}

