
import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RateLimitNotificationProps {
  isVisible: boolean;
  onClose: () => void;
  position?: 'top' | 'center';
  className?: string;
}

export function RateLimitNotification({
  isVisible,
  onClose,
  position = 'top',
  className
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
              Solana API rate limit exceeded
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

// Context to manage rate limit notifications globally
export const RateLimitContext = React.createContext({
  showRateLimitNotification: () => {},
  hideRateLimitNotification: () => {},
  isRateLimitNotificationVisible: false
});

export function RateLimitProvider({ children }: { children: React.ReactNode }) {
  const [isVisible, setIsVisible] = React.useState(false);
  const [autoHideTimer, setAutoHideTimer] = React.useState<NodeJS.Timeout | null>(null);
  
  const showNotification = React.useCallback(() => {
    setIsVisible(true);
    
    // Auto-hide after 5 seconds
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
      />
    </RateLimitContext.Provider>
  );
}

// Hook to use the rate limit context
export function useRateLimitNotification() {
  return React.useContext(RateLimitContext);
}
