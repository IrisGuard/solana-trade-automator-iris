
import { useEffect } from 'react';
import { consoleLogger } from '@/utils/error-handling/ConsoleLogger';
import { SiteHealthMonitor } from '@/utils/error-handling/SiteHealthMonitor';
import { toast } from 'sonner';
import { GlobalErrorHandler } from '@/components/errors/GlobalErrorHandler';
import { NetworkStatusMonitor } from './NetworkStatusMonitor';
import { ConsoleMonitor } from '@/components/debug/ConsoleMonitor';

export function MonitoringSystem() {
  useEffect(() => {
    // Initialize console logging
    consoleLogger.initialize();
    
    // Start site health monitoring
    SiteHealthMonitor.start();
    
    console.log("[Debug] Monitoring system initialized");

    // Display startup toast to confirm UI is working
    toast.info("Το σύστημα παρακολούθησης ενεργοποιήθηκε", {
      id: "monitoring-system-init",
      duration: 3000
    });
    
    // Clean up when component unmounts
    return () => {
      consoleLogger.restore();
      console.log("[Debug] Monitoring system cleanup complete");
    };
  }, []);
  
  return (
    <>
      <GlobalErrorHandler />
      <NetworkStatusMonitor />
      <ConsoleMonitor />
    </>
  );
}
