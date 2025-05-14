
import React from "react";
import { NavLink } from "react-router-dom";
import { 
  Activity, 
  BarChart3, 
  Bot, 
  FileText, 
  Home, 
  HelpCircle, 
  Key, 
  Layers, 
  Settings, 
  Wallet, 
  Coins
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/use-language";

export function Sidebar() {
  const { t } = useLanguage();

  const mainNavItems = [
    {
      title: t("general.home"),
      href: "/home",
      icon: Home,
    },
    {
      title: t("general.dashboard"),
      href: "/dashboard",
      icon: BarChart3,
    },
    {
      title: t("general.wallet"),
      href: "/wallet",
      icon: Wallet,
    },
    {
      title: t("general.portfolio"),
      href: "/portfolio",
      icon: Activity,
    },
    {
      title: t("general.transactions"),
      href: "/transactions",
      icon: FileText,
    },
    {
      title: t("general.tokens"),
      href: "/tokens",
      icon: Coins,
    }
  ];

  const botNavItems = [
    {
      title: t("makerBot.botSettings"),
      href: "/bot-control",
      icon: Settings,
    },
    {
      title: t("general.bots"),
      href: "/bots",
      icon: Bot,
    }
  ];

  const extraNavItems = [
    {
      title: t("api.title"),
      href: "/api-vault",
      icon: Key,
    },
    {
      title: t("general.help"),
      href: "/help",
      icon: HelpCircle,
    }
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-10 w-16 sm:w-64 overflow-y-auto border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex flex-col h-full">
        <div className="p-3 sm:p-6">
          <NavLink to="/" className="flex items-center gap-2 mb-6">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Layers className="h-4 w-4 text-primary" />
            </div>
            <span className="text-lg font-bold hidden sm:inline-block">
              Solana Trade
            </span>
          </NavLink>
          
          <nav className="space-y-6">
            <div className="space-y-2">
              <div className="hidden sm:block text-xs text-muted-foreground mb-2 px-2">
                {t("general.main")}
              </div>
              {mainNavItems.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center py-2 px-2 sm:px-3 rounded-md text-sm transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )
                  }
                >
                  <item.icon className="h-4 w-4 mr-0 sm:mr-2" />
                  <span className="hidden sm:inline">{item.title}</span>
                </NavLink>
              ))}
            </div>

            <div className="space-y-2">
              <div className="hidden sm:block text-xs text-muted-foreground mb-2 px-2">
                {t("general.bots")}
              </div>
              {botNavItems.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center py-2 px-2 sm:px-3 rounded-md text-sm transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )
                  }
                >
                  <item.icon className="h-4 w-4 mr-0 sm:mr-2" />
                  <span className="hidden sm:inline">{item.title}</span>
                </NavLink>
              ))}
            </div>

            <div className="space-y-2">
              <div className="hidden sm:block text-xs text-muted-foreground mb-2 px-2">
                {t("general.extra")}
              </div>
              {extraNavItems.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center py-2 px-2 sm:px-3 rounded-md text-sm transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )
                  }
                >
                  <item.icon className="h-4 w-4 mr-0 sm:mr-2" />
                  <span className="hidden sm:inline">{item.title}</span>
                </NavLink>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </aside>
  );
}
