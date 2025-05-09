
import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  Settings,
  List,
  Bot,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  children: React.ReactNode;
  end?: boolean;
}

const NavItem = ({ to, icon: Icon, children, end }: NavItemProps) => {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
          isActive ? "active-nav-link" : "text-muted-foreground"
        )
      }
    >
      <Icon className="h-4 w-4" />
      <span>{children}</span>
    </NavLink>
  );
};

export function SidebarNav() {
  return (
    <div className="flex flex-col gap-2 py-2">
      <NavItem to="/" icon={Home} end>
        Dashboard
      </NavItem>
      <NavItem to="/bot-control" icon={Bot}>
        Bot Control
      </NavItem>
      <NavItem to="/tokens" icon={List}>
        Tokens
      </NavItem>
      <NavItem to="/transactions" icon={FileText}>
        Transactions
      </NavItem>
      <NavItem to="/settings" icon={Settings}>
        Settings
      </NavItem>
    </div>
  );
}
