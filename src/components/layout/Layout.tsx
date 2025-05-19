
import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { AppErrorBoundary } from "../errors/AppErrorBoundary";
import { AppFallbackComponent } from "../errors/AppFallbackComponent";
import { useIsMobile } from "@/hooks/use-mobile";
import { ConsoleMonitor } from "@/components/debug/ConsoleMonitor";

export function Layout() {
  const isMobile = useIsMobile();
  const location = useLocation();

  useEffect(() => {
    console.log(`[Layout] Page mounted: ${location.pathname}`);
    
    // Log after a small delay to catch any immediate errors
    const timer = setTimeout(() => {
      console.log(`[Layout] Page render completed for: ${location.pathname}`);
    }, 1000);
    
    return () => {
      clearTimeout(timer);
      console.log(`[Layout] Page unmounted: ${location.pathname}`);
    };
  }, [location.pathname]);

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
      </div>
    </AppErrorBoundary>
  );
}
