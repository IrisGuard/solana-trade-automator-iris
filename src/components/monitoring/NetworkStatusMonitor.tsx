
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { errorCollector } from '@/utils/error-handling/collector';

export function NetworkStatusMonitor() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const offlineToastId = useRef<string | number | null>(null);
  const reconnectAttempts = useRef(0);
  
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (offlineToastId.current) {
        toast.dismiss(offlineToastId.current);
        offlineToastId.current = null;
      }
      
      toast.success('Επανασύνδεση στο δίκτυο', {
        description: 'Η σύνδεσή σας στο διαδίκτυο αποκαταστάθηκε.',
        duration: 3000
      });
      
      reconnectAttempts.current = 0;
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      
      // Log the event
      console.warn('[Network] Connection lost');
      
      // Record the offline event in the error collector
      errorCollector.captureError(
        new Error('Network connection lost'),
        { 
          component: 'NetworkStatusMonitor',
          source: 'network',
          severity: 'high',
          details: { timestamp: new Date().toISOString() }
        }
      );
      
      // Show persistent offline toast
      offlineToastId.current = toast.error('Χωρίς σύνδεση στο διαδίκτυο', {
        description: 'Δεν υπάρχει σύνδεση στο διαδίκτυο. Η εφαρμογή θα προσπαθήσει να επανασυνδεθεί αυτόματα.',
        duration: Infinity,
      });
      
      // Start reconnection attempts
      scheduleReconnectionCheck();
    };
    
    const scheduleReconnectionCheck = () => {
      setTimeout(() => {
        if (!navigator.onLine) {
          reconnectAttempts.current += 1;
          
          // Try to fetch something to verify connection
          fetch('/ping', { method: 'HEAD', cache: 'no-store' })
            .then(() => {
              // Connection works but browser hasn't updated status
              window.dispatchEvent(new Event('online'));
            })
            .catch(() => {
              if (reconnectAttempts.current % 5 === 0) {
                toast.error('Εξακολουθείτε να είστε εκτός σύνδεσης', {
                  description: `Προσπάθεια επανασύνδεσης ${reconnectAttempts.current}`,
                  duration: 3000
                });
              }
              scheduleReconnectionCheck();
            });
        }
      }, Math.min(reconnectAttempts.current * 5000, 30000)); // Gradually increase retry interval
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return null; // No UI
}
