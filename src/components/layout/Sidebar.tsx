
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { SidebarNav } from "./SidebarNav";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  ArrowLeft, 
  ArrowRight, 
  Home, 
  Settings, 
  List,
  FileText,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

// Create a Bot icon component since it's not available directly in lucide-react
const Bot = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="18" height="10" x="3" y="11" rx="2" />
    <circle cx="12" cy="5" r="2" />
    <path d="M12 7v4" />
    <line x1="8" x2="8" y1="16" y2="16" />
    <line x1="16" x2="16" y1="16" y2="16" />
  </svg>
);

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
            <CollapsedNavLink to="/bot-control" icon={Bot} />
            <CollapsedNavLink to="/tokens" icon={List} />
            <CollapsedNavLink to="/transactions" icon={FileText} />
            <CollapsedNavLink to="/settings" icon={Settings} />
          </div>
        ) : (
          <SidebarNav />
        )}
      </div>
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

interface NavLinkProps {
  to: string;
  icon: React.ElementType;
  children?: React.ReactNode;
  collapsed?: boolean;
  end?: boolean;
}

const NavLink = ({ to, icon: Icon, children, collapsed, end }: NavLinkProps) => {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
          isActive ? "active-nav-link" : "text-muted-foreground",
          collapsed && "justify-center"
        )
      }
    >
      <Icon className="h-4 w-4" />
      {!collapsed && <span>{children}</span>}
    </NavLink>
  );
};

// Create a separate component for collapsed nav links to avoid naming conflict
const CollapsedNavLink = ({ to, icon: Icon }: { to: string; icon: React.ElementType }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center justify-center rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
          isActive ? "active-nav-link" : "text-muted-foreground"
        )
      }
    >
      <Icon className="h-4 w-4" />
    </NavLink>
  );
};
