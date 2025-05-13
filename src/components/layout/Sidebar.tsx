
import React, { useState } from "react";
import { NavLink as RouterNavLink } from "react-router-dom";
import { SidebarNav } from "./SidebarNav";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  ArrowLeft, 
  ArrowRight, 
  Home, 
  Settings, 
  FileText,
  BarChart2,
  Wallet,
  Shield,
  HelpCircle
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = useState(isMobile);

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-sidebar transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        className
      )}
    >
      <div className={cn("flex h-14 items-center px-4", isCollapsed ? "justify-center" : "justify-between")}>
        {!isCollapsed && (
          <div className="font-bold text-lg text-primary">
            <span>Solana Bot</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8"
        >
          {isCollapsed ? (
            <ArrowRight className="h-4 w-4" />
          ) : (
            <ArrowLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      <div className="flex-1 overflow-auto px-4">
        {isCollapsed ? (
          <div className="flex flex-col gap-2 py-2">
            <CollapsedNavLink to="/" icon={Home} />
            <CollapsedNavLink to="/dashboard" icon={BarChart2} />
            <CollapsedNavLink to="/wallet" icon={Wallet} />
            <CollapsedNavLink to="/transactions" icon={FileText} />
            <CollapsedNavLink to="/security" icon={Shield} />
            <CollapsedNavLink to="/settings" icon={Settings} />
            <CollapsedNavLink to="/help" icon={HelpCircle} />
          </div>
        ) : (
          <SidebarNav />
        )}
      </div>
      
      {/* User profile section */}
      <div className="border-t p-4">
        <div className={cn("flex items-center", isCollapsed ? "justify-center" : "justify-start gap-3")}>
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
            S
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <p className="text-sm font-medium">Solana Trader</p>
              <p className="text-xs text-muted-foreground">Connected</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface CollapsedNavLinkProps {
  to: string;
  icon: React.ElementType;
}

// Create a separate component for collapsed nav links to avoid naming conflict
const CollapsedNavLink = ({ to, icon: Icon }: CollapsedNavLinkProps) => {
  return (
    <RouterNavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center justify-center rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
          isActive ? "active-nav-link" : "text-muted-foreground"
        )
      }
    >
      <Icon className="h-4 w-4" />
    </RouterNavLink>
  );
};
