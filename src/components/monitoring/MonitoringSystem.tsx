
import { useEffect } from 'react';
import { consoleLogger } from '@/utils/error-handling/ConsoleLogger';
import { SiteHealthMonitor } from '@/utils/error-handling/SiteHealthMonitor';
import { toast } from 'sonner';
import { GlobalErrorHandler } from '@/components/errors/GlobalErrorHandler';
import { NetworkStatusMonitor } from './NetworkStatusMonitor';

export function MonitoringSystem() {
  useEffect(() => {
    // Initialize console logging
    consoleLogger.initialize();
    
    // Start site health monitoring
    SiteHealthMonitor.start();
    
    console.log("Monitoring system initialized");
    
    // Clean up when component unmounts
    return () => {
      consoleLogger.restore();
    };
  }, []);
  
  return (
    <>
      <GlobalErrorHandler />
      <NetworkStatusMonitor />
    </>
  );
}
