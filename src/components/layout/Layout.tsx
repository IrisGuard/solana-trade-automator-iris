
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { cn } from "@/lib/utils";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/dashboard": "Dashboard",
  "/bot-control": "Bot Control",
  "/tokens": "Tokens",
  "/wallet": "Wallet",
  "/transactions": "Transactions",
  "/settings": "Settings",
  "/security": "Security",
  "/notifications": "Notifications",
};

export function Layout() {
  const location = useLocation();
  const title = pageTitles[location.pathname] || "Solana Trade Automator";

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col pl-16 sm:pl-64">
        <Header title={title} />
        <main className={cn("flex-1 overflow-auto p-6")}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
