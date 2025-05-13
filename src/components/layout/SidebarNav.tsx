
import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  Settings,
  FileText,
  BarChart2,
  Wallet,
  Shield,
  HelpCircle,
} from "lucide-react";

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
          isActive ? "active-nav-link bg-accent text-accent-foreground font-medium" : "text-muted-foreground"
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
        Αρχική
      </NavItem>
      <NavItem to="/dashboard" icon={BarChart2}>
        Dashboard
      </NavItem>
      <NavItem to="/wallet" icon={Wallet}>
        Πορτοφόλι
      </NavItem>
      <NavItem to="/transactions" icon={FileText}>
        Συναλλαγές
      </NavItem>
      <NavItem to="/security" icon={Shield}>
        Ασφάλεια
      </NavItem>
      <NavItem to="/settings" icon={Settings}>
        Ρυθμίσεις
      </NavItem>
      <NavItem to="/help" icon={HelpCircle}>
        Βοήθεια
      </NavItem>
    </div>
  );
};
