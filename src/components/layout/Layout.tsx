
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { HelpButton } from "@/components/help/HelpButton";

const pageTitles: Record<string, string> = {
  "/": "Αρχική",
  "/dashboard": "Dashboard",
  "/wallet": "Πορτοφόλι",
  "/transactions": "Συναλλαγές",
  "/security": "Ασφάλεια",
  "/settings": "Ρυθμίσεις",
  "/help": "Βοήθεια",
};

export function Layout() {
  const location = useLocation();
  const title = pageTitles[location.pathname] || "Solana Trade";

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col pl-16 sm:pl-64">
        <Header title={title} />
        <main className={cn("flex-1 overflow-auto p-6")}>
          <Outlet />
        </main>
        <Toaster />
      </div>
      
      {/* Προσθήκη του κουμπιού βοήθειας */}
      <HelpButton />
    </div>
  );
}
