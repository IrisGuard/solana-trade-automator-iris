
import React, { ReactNode } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { AppErrorBoundary } from "../errors/AppErrorBoundary";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <AppErrorBoundary>
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 px-4 py-4 md:px-6 md:py-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </AppErrorBoundary>
  );
}
