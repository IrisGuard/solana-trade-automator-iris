
import { useEffect, useState } from 'react';
import { consoleLogger } from '@/utils/error-handling/ConsoleLogger';
import { SiteHealthMonitor } from '@/utils/error-handling/SiteHealthMonitor';
import { toast } from 'sonner';
import { GlobalErrorHandler } from '@/components/errors/GlobalErrorHandler';
import { ConsoleMonitor } from '@/components/debug/ConsoleMonitor';
import { SystemLoaderFallback } from './SystemLoaderFallback';
import { checkSupabaseConnection } from '@/integrations/supabase/client';

export function MonitoringSystem() {
  const [monitoringReady, setMonitoringReady] = useState(false);
  const [supabaseConnected, setSupabaseConnected] = useState<boolean | null>(null);

  useEffect(() => {
    // Initialize console logging
    try {
      console.log("[Debug] Starting monitoring system initialization...");
      consoleLogger.initialize();
      
      // Start site health monitoring
      SiteHealthMonitor.start();
      
      // Check if critical resources are loaded
      const rootElement = document.getElementById('root');
      console.log("[Debug] Root element exists:", !!rootElement);
      
      // Check browser features
      console.log("[Debug] localStorage available:", !!window.localStorage);
      console.log("[Debug] sessionStorage available:", !!window.sessionStorage);
      console.log("[Debug] fetch API available:", !!window.fetch);
      
      // Check Supabase connection with error handling
      checkSupabaseConnection()
        .then(connected => {
          setSupabaseConnected(connected);
          console.log("[Debug] Supabase connected:", connected);
          if (!connected) {
            console.warn("[Warning] Supabase connection failed - running in demo mode");
          }
        })
        .catch(error => {
          console.error("[Error] Supabase connection check failed:", error);
          setSupabaseConnected(false);
        });
      
      // Set monitoring as ready
      setMonitoringReady(true);
      console.log("[Debug] Monitoring system initialization complete");
      
      // Display startup toast to confirm UI is working (only show once per session)
      if (!sessionStorage.getItem('system-monitoring-init')) {
        toast.info("System ready - running in demo mode", {
          id: "monitoring-system-init",
          duration: 3000
        });
        sessionStorage.setItem('system-monitoring-init', 'true');
      }
    } catch (err) {
      console.error("[Error] Failed to initialize monitoring system:", err);
      
      // Still try to show a toast in case UI is working
      toast.error("Error initializing monitoring system", {
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
      <ConsoleMonitor />
      
      <SystemLoaderFallback />
      
      {monitoringReady && <div id="monitoring-ready" style={{ display: 'none' }} />}
      {supabaseConnected === false && (
        <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-black p-2 text-center z-50 text-sm">
          Running in demo mode - Database connection unavailable
        </div>
      )}
    </>
  );
}
