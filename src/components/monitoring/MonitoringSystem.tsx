
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
      
      // Check critical resources
      console.log("[Debug] localStorage available:", !!window.localStorage);
      console.log("[Debug] sessionStorage available:", !!window.sessionStorage);
      console.log("[Debug] fetch API available:", !!window.fetch);
      
      // Check Supabase connection with proper error handling
      const checkConnection = async () => {
        try {
          console.log("[Debug] Testing Supabase connection...");
          const connected = await checkSupabaseConnection();
          setSupabaseConnected(connected);
          console.log("[Debug] Supabase connected:", connected);
          
          if (connected) {
            console.log("[Success] Database connection established");
            toast.success("Database connection established", {
              duration: 3000,
              id: "db-connection-success"
            });
          } else {
            console.warn("[Warning] Database connection unavailable - using demo mode");
            toast.warning("Demo mode - Database connection unavailable", {
              duration: 5000,
              id: "db-connection-warning"
            });
          }
        } catch (error) {
          console.error("[Error] Supabase connection check failed:", error);
          setSupabaseConnected(false);
          toast.error("Database connection failed", {
            description: "Running in demo mode with local data",
            duration: 5000,
            id: "db-connection-error"
          });
        }
      };
      
      checkConnection();
      
      // Set monitoring as ready
      setMonitoringReady(true);
      console.log("[Debug] Monitoring system initialization complete");
    } catch (err) {
      console.error("[Error] Failed to initialize monitoring system:", err);
      
      toast.error("Monitoring system initialization failed", {
        description: "Some features may not work properly",
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
          Demo Mode - Database features limited
        </div>
      )}
      {supabaseConnected === true && (
        <div className="fixed top-0 left-0 right-0 bg-green-500 text-white p-2 text-center z-50 text-sm">
          ✓ Production Ready - All systems operational
        </div>
      )}
    </>
  );
}
