
// Sidebar navigation component with links to various pages
import React from "react";
import { NavLink } from "react-router-dom";

// Define navigation items
const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "dashboard",
  },
  {
    title: "Wallet",
    href: "/wallet",
    icon: "wallet",
  },
  {
    title: "Portfolio",
    href: "/portfolio",
    icon: "chart",
  },
  {
    title: "Transactions",
    href: "/transactions",
    icon: "transaction",
  },
  {
    title: "Bots",
    href: "/bot-control",
    icon: "robot",
  },
  {
    title: "API Vault",
    href: "/api-vault",
    icon: "key",
  },
  {
    title: "Security",
    href: "/security",
    icon: "shield",
  },
  {
    title: "Change Approval",
    href: "/change-approval",
    icon: "check",
  },
  {
    title: "Settings",
    href: "/settings",
    icon: "settings",
  },
  {
    title: "Help",
    href: "/help",
    icon: "help",
  },
];

export function SidebarNav() {
  return (
    <nav className="space-y-1">
      {navItems.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          className={({ isActive }) =>
            `flex items-center px-4 py-2 text-sm font-medium rounded-md ${
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }`
          }
        >
          <span className="truncate">{item.title}</span>
        </NavLink>
      ))}
    </nav>
  );
}
