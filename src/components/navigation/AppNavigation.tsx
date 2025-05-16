
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Home,
  BarChart3, 
  Wallet, 
  Bot, 
  HelpCircle, 
  Activity,
  Settings,
  FileText,
  Coins
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  variant?: "default" | "colorful";
}

export function NavItem({ icon, label, href, variant = "default" }: NavItemProps) {
  if (variant === "colorful") {
    return (
      <Link to={href}>
        <Button 
          variant="outline" 
          className="w-full flex items-center gap-2 h-16 hover:scale-105 transition-transform bg-gradient-to-br from-gray-800/40 to-gray-900/40 border-gray-800/60 hover:bg-gray-800/60"
        >
          {icon}
          <span>{label}</span>
        </Button>
      </Link>
    );
  }
  
  return (
    <Link to={href}>
      <Button 
        variant="ghost" 
        className="flex items-center gap-2 w-full justify-start"
      >
        {icon}
        <span>{label}</span>
      </Button>
    </Link>
  );
}

export function AppNavigation({ variant = "default", className }: { variant?: "default" | "colorful", className?: string }) {
  const items = [
    {
      icon: <Home className="h-5 w-5" />,
      label: "Αρχική",
      href: "/"
    },
    {
      icon: <BarChart3 className="h-5 w-5" />,
      label: "Dashboard",
      href: "/dashboard"
    },
    {
      icon: <Wallet className="h-5 w-5" />,
      label: "Πορτοφόλι",
      href: "/wallet"
    },
    {
      icon: <Activity className="h-5 w-5" />,
      label: "Χαρτοφυλάκιο",
      href: "/portfolio"
    },
    {
      icon: <Bot className="h-5 w-5" />,
      label: "Trading Bot",
      href: "/bot-control"
    },
    {
      icon: <Coins className="h-5 w-5" />,
      label: "Tokens",
      href: "/tokens"
    },
    {
      icon: <HelpCircle className="h-5 w-5" />,
      label: "Βοήθεια",
      href: "/help"
    }
  ];
  
  return (
    <div className={cn("grid gap-2", 
      variant === "colorful" ? "grid-cols-2 md:grid-cols-4 lg:grid-cols-7" : "",
      className
    )}>
      {items.map((item, i) => (
        <NavItem 
          key={i}
          icon={item.icon}
          label={item.label}
          href={item.href}
          variant={variant}
        />
      ))}
    </div>
  );
}
