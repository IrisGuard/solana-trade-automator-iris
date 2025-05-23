
import React, { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  Activity, 
  BarChart3, 
  Bot, 
  FileText, 
  HelpCircle, 
  Key, 
  Layers, 
  Settings, 
  Wallet, 
  Coins,
  Search
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const mainNavItems = [
    {
      title: "Πίνακας Ελέγχου",
      href: "/dashboard",
      icon: BarChart3,
    },
    {
      title: "Πορτοφόλι",
      href: "/wallet",
      icon: Wallet,
    },
    {
      title: "Χαρτοφυλάκιο",
      href: "/portfolio",
      icon: Activity,
    },
    {
      title: "Συναλλαγές",
      href: "/transactions",
      icon: FileText,
    },
    {
      title: "Tokens",
      href: "/tokens",
      icon: Coins,
    },
    {
      title: "Test API",
      href: "/test-api",
      icon: Search,
      highlight: true,
    }
  ];

  const botNavItems = [
    {
      title: "Ρυθμίσεις Bot",
      href: "/bot-control",
      icon: Settings,
    },
    {
      title: "Τα Bots μου",
      href: "/bots",
      icon: Bot,
    }
  ];

  const extraNavItems = [
    {
      title: "API Vault",
      href: "/api-vault",
      icon: Key,
    },
    {
      title: "Βοήθεια",
      href: "/help",
      icon: HelpCircle,
    }
  ];

  useEffect(() => {
    console.log("[Debug] Sidebar mounted, current path:", currentPath);
    
    // Highlight the Test API button if we're on the home page to encourage navigation
    if (currentPath === "/" || currentPath === "") {
      const testApiItem = mainNavItems.find(item => item.href === "/test-api");
      if (testApiItem) {
        console.log("[Debug] On homepage, highlighting Test API navigation");
      }
    }
    
    return () => {
      console.log("[Debug] Sidebar unmounted");
    };
  }, [currentPath]);

  const handleNavLinkClick = (title: string, href: string) => {
    console.log(`[Navigation] Clicked on ${title}, navigating to ${href}`);
    
    // Show navigation toast for Test API to confirm click handler works
    if (href === '/test-api') {
      toast.info(`Μετάβαση στο ${title}`, {
        id: "navigation-test-api",
        duration: 2000
      });
    }
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-10 w-16 sm:w-64 overflow-y-auto border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex flex-col h-full">
        <div className="p-3 sm:p-6">
          <NavLink 
            to="/" 
            className="flex items-center gap-2 mb-6"
            onClick={() => console.log("[Navigation] Clicked on home logo")}
          >
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
                Κύριο Μενού
              </div>
              {mainNavItems.map((item) => {
                const isActive = currentPath === item.href;
                
                return (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center py-2 px-2 sm:px-3 rounded-md text-sm transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : item.highlight 
                            ? "text-blue-400 hover:bg-blue-900/20 hover:text-blue-300" 
                            : "text-muted-foreground hover:bg-accent hover:text-foreground",
                        item.title === "Test API" && !isActive && "animate-pulse"
                      )
                    }
                    onClick={() => handleNavLinkClick(item.title, item.href)}
                  >
                    <item.icon className={cn("h-4 w-4 mr-0 sm:mr-2", item.highlight ? "text-blue-400" : "")} />
                    <span className="hidden sm:inline">{item.title}</span>
                  </NavLink>
                );
              })}
            </div>

            <div className="space-y-2">
              <div className="hidden sm:block text-xs text-muted-foreground mb-2 px-2">
                Trading Bots
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
                Επιπλέον
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
