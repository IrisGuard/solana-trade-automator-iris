
import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  Settings,
  List,
  FileText,
  BarChart2,
  Wallet,
  Shield,
  Bell,
} from "lucide-react";

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
      <NavItem to="/bot-control" icon={Bot}>
        Bot Control
      </NavItem>
      <NavItem to="/tokens" icon={List}>
        Tokens
      </NavItem>
      <NavItem to="/wallet" icon={Wallet}>
        Wallet
      </NavItem>
      <NavItem to="/transactions" icon={FileText}>
        Transactions
      </NavItem>
      <NavItem to="/security" icon={Shield}>
        Security
      </NavItem>
      <NavItem to="/notifications" icon={Bell}>
        Notifications
      </NavItem>
      <NavItem to="/settings" icon={Settings}>
        Settings
      </NavItem>
    </div>
  );
}
