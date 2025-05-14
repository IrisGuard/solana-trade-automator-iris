
import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Settings, 
  Shield, 
  Wallet, 
  HelpCircle,
  Bell,
  FileText,
  BarChart2,
  Coins
} from "lucide-react";

export interface SidebarNavProps {
  isCollapsed: boolean;
}

export function SidebarNav({ isCollapsed }: SidebarNavProps) {
  const items = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      title: "Wallet",
      href: "/wallet",
      icon: Wallet,
    },
    {
      title: "Tokens",
      href: "/tokens",
      icon: Coins,
    },
    {
      title: "Transactions",
      href: "/transactions",
      icon: FileText,
    },
    {
      title: "Portfolio",
      href: "/portfolio",
      icon: BarChart2,
    },
    {
      title: "Bots",
      href: "/bots",
      icon: BarChart2,
    },
    {
      title: "Change Approval",
      href: "/change-approval",
      icon: FileText,
    },
    {
      title: "API Vault",
      href: "/api-vault",
      icon: Shield,
    },
    {
      title: "Security",
      href: "/security",
      icon: Shield,
    },
    {
      title: "Notifications",
      href: "/notifications",
      icon: Bell,
    },
    {
      title: "Help",
      href: "/help",
      icon: HelpCircle,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  return (
    <nav className="space-y-1 px-2">
      {items.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          className={({ isActive }) =>
            cn(
              "flex items-center rounded-md px-3 py-2 text-sm transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
              isCollapsed && "justify-center py-2 px-3"
            )
          }
        >
          <item.icon className={cn("h-5 w-5", isCollapsed ? "mr-0" : "mr-2")} />
          {!isCollapsed && <span>{item.title}</span>}
        </NavLink>
      ))}
    </nav>
  );
}
