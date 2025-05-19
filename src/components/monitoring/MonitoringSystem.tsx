
import { useEffect, useState } from 'react';
import { consoleLogger } from '@/utils/error-handling/ConsoleLogger';
import { SiteHealthMonitor } from '@/utils/error-handling/SiteHealthMonitor';
import { toast } from 'sonner';
import { GlobalErrorHandler } from '@/components/errors/GlobalErrorHandler';
import { NetworkStatusMonitor } from './NetworkStatusMonitor';
import { ConsoleMonitor } from '@/components/debug/ConsoleMonitor';

export function MonitoringSystem() {
  const [monitoringReady, setMonitoringReady] = useState(false);

  useEffect(() => {
    // Initialize console logging
    try {
      console.log("[Debug] Starting monitoring system initialization...");
      consoleLogger.initialize();
      
      // Start site health monitoring
      SiteHealthMonitor.start();
      
      // Perform initial health check
      const initialHealth = SiteHealthMonitor.checkHealth();
      console.log("[Debug] Initial health check result:", initialHealth);
      
      // Log system information
      console.log("[Debug] User Agent:", navigator.userAgent);
      console.log("[Debug] App Version:", "1.0.0");
      console.log("[Debug] Current URL:", window.location.href);
      console.log("[Debug] Screen Size:", `${window.innerWidth}x${window.innerHeight}`);
      
      // Check if critical resources are loaded
      const rootElement = document.getElementById('root');
      console.log("[Debug] Root element exists:", !!rootElement);
      
      // Check browser features
      console.log("[Debug] localStorage available:", !!window.localStorage);
      console.log("[Debug] sessionStorage available:", !!window.sessionStorage);
      console.log("[Debug] fetch API available:", !!window.fetch);
      
      setMonitoringReady(true);
      console.log("[Debug] Monitoring system initialization complete");
      
      // Display startup toast to confirm UI is working
      toast.info("Το σύστημα παρακολούθησης ενεργοποιήθηκε", {
        id: "monitoring-system-init",
        duration: 3000
      });
      
      // Check if we're on the home page and display a help message
      if (window.location.pathname === '/' || window.location.pathname === '') {
        setTimeout(() => {
          toast.info("Καλώς ήρθατε στην εφαρμογή", {
            description: "Πατήστε το κουμπί 'Test API' για να δοκιμάσετε το API",
            duration: 5000
          });
        }, 3500);
      }
    } catch (err) {
      console.error("[Error] Failed to initialize monitoring system:", err);
      
      // Still try to show a toast in case UI is working
      toast.error("Σφάλμα στην αρχικοποίηση του συστήματος παρακολούθησης", {
        duration: 5000
      });
    }
    
    // Clean up when component unmounts
    return () => {
      try {
        consoleLogger.restore();
        console.log("[Debug] Monitoring system cleanup complete");
      } catch (err) {
        console.error("[Error] Error during monitoring system cleanup:", err);
      }
    };
  }, []);
  
  return (
    <>
      <GlobalErrorHandler />
      <NetworkStatusMonitor />
      <ConsoleMonitor />
      {monitoringReady && <div id="monitoring-ready" style={{ display: 'none' }} />}
    </>
  );
}
