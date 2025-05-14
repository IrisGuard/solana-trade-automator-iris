
import React from "react";
import { Outlet, useLocation } from "@/lib/router-exports";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { cn } from "@/lib/utils";
import { HelpButton } from "@/components/help/HelpButton";
import { useLanguage } from "@/providers/LanguageProvider";

export function Layout() {
  const location = useLocation();
  const { t } = useLanguage();
  
  const pageTitles: Record<string, string> = {
    "/": t("general.home"),
    "/home": t("general.home"),
    "/dashboard": t("general.dashboard"),
    "/wallet": t("general.wallet"),
    "/transactions": t("general.transactions"),
    "/security": t("general.security"),
    "/settings": t("general.settings"),
    "/help": t("general.help"),
  };

  const title = pageTitles[location.pathname] || "Solana Trade";

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col pl-16 sm:pl-64">
        <Header title={title} />
        <main className={cn("flex-1 overflow-auto p-6")}>
          <Outlet />
        </main>
      </div>
      
      <HelpButton />
    </div>
  );
}
