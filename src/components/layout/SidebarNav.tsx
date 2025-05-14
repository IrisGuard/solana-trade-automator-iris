
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

// Navigation items data
const navItems = [
  { to: "/", icon: Home, label: "Αρχική", end: true },
  { to: "/dashboard", icon: BarChart2, label: "Dashboard" },
  { to: "/wallet", icon: Wallet, label: "Πορτοφόλι" },
  { to: "/transactions", icon: FileText, label: "Συναλλαγές" },
  { to: "/security", icon: Shield, label: "Ασφάλεια" },
  { to: "/settings", icon: Settings, label: "Ρυθμίσεις" },
  { to: "/help", icon: HelpCircle, label: "Βοήθεια" }
];

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

const CollapsedNavItem = ({ to, icon: Icon, end }: Omit<NavItemProps, 'children'>) => {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          "flex items-center justify-center rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
          isActive ? "active-nav-link bg-accent text-accent-foreground" : "text-muted-foreground"
        )
      }
    >
      <Icon className="h-4 w-4" />
    </NavLink>
  );
};

interface SidebarNavProps {
  isCollapsed?: boolean;
}

export function SidebarNav({ isCollapsed = false }: SidebarNavProps) {
  if (isCollapsed) {
    return (
      <div className="flex flex-col gap-2 py-2">
        {navItems.map((item) => (
          <CollapsedNavItem 
            key={item.to}
            to={item.to} 
            icon={item.icon}
            end={item.end}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 py-2">
      {navItems.map((item) => (
        <NavItem 
          key={item.to}
          to={item.to} 
          icon={item.icon} 
          end={item.end}
        >
          {item.label}
        </NavItem>
      ))}
    </div>
  );
}
