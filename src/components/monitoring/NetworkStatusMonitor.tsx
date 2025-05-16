
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { errorCollector } from '@/utils/error-handling/collector';
import { useTranslation } from '@/hooks/useTranslation';

export function NetworkStatusMonitor() {
  const { t } = useTranslation();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    // Network status handling
    const handleOnline = () => {
      setIsOnline(true);
      toast.success(t('general.connectionRestored'), {
        description: t('general.internetConnectionRestored')
      });
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      
      // Report network error
      errorCollector.captureError(new Error('Network connection lost'), {
        component: 'NetworkStatusMonitor',
        source: 'network',
        severity: 'high',
      });
      
      toast.error(t('general.connectionLost'), {
        description: t('general.checkYourConnection'),
        duration: 0 // Toast stays until dismissed or connection restored
      });
    };
    
    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Clean up
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [t]);
  
  return null; // This is a monitoring component, no UI
}
