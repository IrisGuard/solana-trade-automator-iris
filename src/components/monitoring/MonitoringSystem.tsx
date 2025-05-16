
import { useEffect } from 'react';
import { consoleLogger } from '@/utils/error-handling/ConsoleLogger';
import { SiteHealthMonitor } from '@/utils/error-handling/SiteHealthMonitor';
import { toast } from 'sonner';
import { GlobalErrorHandler } from '@/components/errors/GlobalErrorHandler';
import { NetworkStatusMonitor } from './NetworkStatusMonitor';

// Track initialization state
let monitoringInitialized = false;

export function MonitoringSystem() {
  useEffect(() => {
    // Prevent double initialization
    if (monitoringInitialized) {
      console.log("Monitoring system already initialized");
      return () => {};
    }
    
    // Initialize console logging
    consoleLogger.initialize();
    
    // Start site health monitoring
    SiteHealthMonitor.start();
    
    console.log("Monitoring system initialized");
    monitoringInitialized = true;
    
    // Clean up when component unmounts
    return () => {
      consoleLogger.restore();
      monitoringInitialized = false;
    };
  }, []);
  
  return (
    <>
      <GlobalErrorHandler />
      <NetworkStatusMonitor />
    </>
  );
}
