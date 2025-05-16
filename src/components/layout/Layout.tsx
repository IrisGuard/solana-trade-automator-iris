
import React, { ReactNode } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { AppErrorBoundary } from "../errors/AppErrorBoundary";
import { AppFallbackComponent } from "../errors/AppFallbackComponent";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const isMobile = useIsMobile();

  return (
    <AppErrorBoundary fallbackComponent={AppFallbackComponent}>
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          {!isMobile && <Sidebar />}
          <main id="main-content" className="flex-1 px-3 py-3 md:px-6 md:py-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </AppErrorBoundary>
  );
}
