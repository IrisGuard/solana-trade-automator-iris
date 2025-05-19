
import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { AppErrorBoundary } from "../errors/AppErrorBoundary";
import { AppFallbackComponent } from "../errors/AppFallbackComponent";
import { useIsMobile } from "@/hooks/use-mobile";
import { ConsoleMonitor } from "@/components/debug/ConsoleMonitor";
import { toast } from "sonner";
import { useErrorReporting } from "@/hooks/useErrorReporting";
import { useAuth } from "@/providers/AuthProvider";
import { MonitoringSystem } from "../monitoring/MonitoringSystem";

export function Layout() {
  const isMobile = useIsMobile();
  const location = useLocation();
  const { reportError } = useErrorReporting();
  const { user } = useAuth();

  // Log Layout initialization and rendering
  useEffect(() => {
    try {
      console.log(`[Layout] Page mount started: ${location.pathname}`);
      
      // Check if main DOM elements exist
      const mainContent = document.getElementById('main-content');
      console.log(`[Debug] Main content element exists: ${!!mainContent}`);
      
      // Log after a small delay to catch any immediate errors
      const timer = setTimeout(() => {
        console.log(`[Layout] Page render completed for: ${location.pathname}`);
        
        // Add a toast to confirm UI is working (only on specific routes)
        if (location.pathname === '/test-api') {
          toast.success("Σελίδα Test API φορτώθηκε", {
            description: "Η σελίδα φορτώθηκε επιτυχώς",
            duration: 3000
          });
        }
        
        // Welcome users after login
        if (user && location.pathname === '/') {
          toast.success(`Καλώς ήρθατε${user.email ? ` ${user.email}` : ''}!`, {
            description: "Η πλατφόρμα είναι έτοιμη για χρήση",
            duration: 5000
          });
        }
      }, 1000);
      
      // Cleanup timer on unmount
      return () => {
        clearTimeout(timer);
        console.log(`[Layout] Page unmounted: ${location.pathname}`);
      };
    } catch (err) {
      console.error('[Layout] Error during layout initialization:', err);
      reportError(err instanceof Error ? err : new Error('Layout initialization failed'), {
        component: 'Layout',
        severity: 'high',
        showToast: true
      });
    }
  }, [location.pathname, reportError, user]);

  return (
    <AppErrorBoundary fallbackComponent={AppFallbackComponent}>
      <div className="min-h-screen flex flex-col bg-background">
        <MonitoringSystem />
        <Header />
        <div className="flex flex-1 overflow-hidden">
          {!isMobile && <Sidebar />}
          <main id="main-content" className="flex-1 px-3 py-3 md:px-6 md:py-6 overflow-auto">
            <Outlet />
          </main>
        </div>
        <div id="layout-mounted" style={{ display: 'none' }} data-testid="layout-initialized" />
      </div>
    </AppErrorBoundary>
  );
}
