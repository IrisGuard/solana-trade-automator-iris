
import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { AppErrorBoundary } from "../errors/AppErrorBoundary";
import { AppFallbackComponent } from "../errors/AppFallbackComponent";
import { useIsMobile } from "@/hooks/use-mobile";
import { ConsoleMonitor } from "@/components/debug/ConsoleMonitor";
import { toast } from "sonner";
import { useErrorReporting } from "@/hooks/useErrorReporting";

export function Layout() {
  const isMobile = useIsMobile();
  const location = useLocation();
  const { reportError } = useErrorReporting();
  const [isLayoutMounted, setIsLayoutMounted] = useState(false);

  // Log DOM initialization and layout rendering
  useEffect(() => {
    try {
      console.log(`[Layout] Page mount started: ${location.pathname}`);
      
      // Check if main DOM elements exist
      const mainContent = document.getElementById('main-content');
      console.log(`[Debug] Main content element exists: ${!!mainContent}`);
      
      // Mark layout as mounted
      setIsLayoutMounted(true);
      
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
      }, 1000);
      
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
  }, [location.pathname, reportError]);

  return (
    <AppErrorBoundary fallbackComponent={AppFallbackComponent}>
      <div className="min-h-screen flex flex-col bg-background">
        <ConsoleMonitor />
        <Header />
        <div className="flex flex-1 overflow-hidden">
          {!isMobile && <Sidebar />}
          <main id="main-content" className="flex-1 px-3 py-3 md:px-6 md:py-6 overflow-auto">
            <Outlet />
          </main>
        </div>
        {isLayoutMounted && <div id="layout-mounted" style={{ display: 'none' }} />}
      </div>
    </AppErrorBoundary>
  );
}
