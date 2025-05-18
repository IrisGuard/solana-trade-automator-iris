
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { NavItem } from "@/types/nav";
import { Home, Wallet, ArrowLeftRight, Bot, KeyRound } from "@/components/icons";
import { useLanguage } from "@/hooks/use-language";

interface SidebarNavProps {
  items: NavItem[];
  isCollapsed?: boolean;
}

export function SidebarNav({ items = [], isCollapsed = false }: SidebarNavProps) {
  const location = useLocation();
  const { t } = useLanguage();
  
  return (
    <div className="flex h-screen flex-col gap-2">
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          <Link
            to="/"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
              location.pathname === "/" ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Home className={cn("h-4 w-4", isCollapsed ? "mr-0" : "mr-2")} />
            <span>{t('general.dashboard')}</span>
          </Link>
          <Link
            to="/wallet"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
              location.pathname === "/wallet" ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Wallet className={cn("h-4 w-4", isCollapsed ? "mr-0" : "mr-2")} />
            <span>{t('general.wallet')}</span>
          </Link>
          <Link
            to="/transactions"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
              location.pathname === "/transactions" ? "text-primary" : "text-muted-foreground"
            )}
          >
            <ArrowLeftRight className={cn("h-4 w-4", isCollapsed ? "mr-0" : "mr-2")} />
            <span>{t('general.transactions')}</span>
          </Link>
          <Link
            to="/bots"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
              location.pathname === "/bots" ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Bot className={cn("h-4 w-4", isCollapsed ? "mr-0" : "mr-2")} />
            <span>{t('general.bots')}</span>
          </Link>
          <Link
            to="/api-vault"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
              location.pathname === "/api-vault" ? "text-primary" : "text-muted-foreground"
            )}
          >
            <KeyRound className={cn("h-4 w-4", isCollapsed ? "mr-0" : "mr-2")} />
            <span>{t('general.apiVault')}</span>
          </Link>
          
          {/* Temporary link for adding Helius key */}
          <Link
            to="/add-helius-key"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary bg-green-50 text-green-700 my-2 border border-green-200",
              location.pathname === "/add-helius-key" ? "bg-green-100" : ""
            )}
          >
            <KeyRound className={cn("h-4 w-4", isCollapsed ? "mr-0" : "mr-2")} />
            <span>{t('apiVault.addHelius')}</span>
          </Link>
          
          <div className="my-2 border-t"></div>
          
          {items && items.map((item, index) => {
            const Icon = item.icon;
            return (
              item.href && (
                <TooltipProvider key={index}>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Link
                        to={item.href}
                        className={cn(
                          buttonVariants({ variant: "ghost", size: "sm" }),
                          location.pathname === item.href
                            ? "bg-muted hover:bg-muted"
                            : "hover:bg-transparent hover:underline",
                          "justify-start",
                          isCollapsed && "h-9 w-9 p-0 justify-center"
                        )}
                      >
                        {Icon && <Icon className={cn("h-4 w-4", isCollapsed ? "mr-0" : "mr-2")} />}
                        {!isCollapsed && <span>{item.title}</span>}
                      </Link>
                    </TooltipTrigger>
                    {isCollapsed && (
                      <TooltipContent side="right" className="flex items-center gap-4">
                        {item.title}
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              )
            );
          })}
        </nav>
      </div>
    </div>
  );
}
