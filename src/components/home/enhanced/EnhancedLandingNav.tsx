
import React from "react";
import { 
  Home, 
  BarChart3, 
  Wallet, 
  Bot, 
  Activity, 
  Coins,
  Shield, 
  Settings, 
  HelpCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { GradientBorder } from "@/components/ui/gradient-card";

interface NavItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  gradient: "purple" | "blue" | "green" | "amber" | "pink" | "indigo" | "cyan" | "emerald";
}

export function EnhancedNavItem({ icon, title, description, href, gradient }: NavItemProps) {
  return (
    <GradientBorder variant={gradient} className="hover:scale-[1.02] transition-all duration-200">
      <Link to={href} className="block h-full">
        <div className={cn(
          "flex flex-col h-full rounded-md p-4",
          "bg-gradient-to-br from-gray-900/60 to-gray-950/60"
        )}>
          <div className={cn(
            "p-2 rounded-lg w-10 h-10 flex items-center justify-center mb-3",
            {
              "bg-purple-500/10": gradient === "purple",
              "bg-blue-500/10": gradient === "blue",
              "bg-emerald-500/10": gradient === "green" || gradient === "emerald",
              "bg-amber-500/10": gradient === "amber",
              "bg-pink-500/10": gradient === "pink",
              "bg-indigo-500/10": gradient === "indigo",
              "bg-cyan-500/10": gradient === "cyan",
            }
          )}>
            {icon}
          </div>
          <h3 className="font-medium text-base mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </Link>
    </GradientBorder>
  );
}

export function EnhancedLandingNav() {
  const items: NavItemProps[] = [
    {
      icon: <BarChart3 className="h-5 w-5 text-blue-500" />,
      title: "Dashboard",
      description: "Επισκόπηση του χαρτοφυλακίου σας",
      href: "/dashboard",
      gradient: "blue"
    },
    {
      icon: <Wallet className="h-5 w-5 text-purple-500" />,
      title: "Πορτοφόλι",
      description: "Διαχείριση του πορτοφολιού σας",
      href: "/wallet",
      gradient: "purple"
    },
    {
      icon: <Bot className="h-5 w-5 text-emerald-500" />,
      title: "Trading Bot",
      description: "Ρυθμίσεις αυτόματου trading",
      href: "/bot-control",
      gradient: "green"
    },
    {
      icon: <Activity className="h-5 w-5 text-pink-500" />,
      title: "Χαρτοφυλάκιο",
      description: "Παρακολούθηση επιδόσεων",
      href: "/portfolio",
      gradient: "pink"
    },
    {
      icon: <Coins className="h-5 w-5 text-amber-500" />,
      title: "Tokens",
      description: "Τα tokens σας στο Solana",
      href: "/tokens",
      gradient: "amber"
    },
    {
      icon: <Shield className="h-5 w-5 text-cyan-500" />,
      title: "Ασφάλεια",
      description: "Ρυθμίσεις ασφαλείας",
      href: "/api-vault",
      gradient: "cyan"
    },
    {
      icon: <HelpCircle className="h-5 w-5 text-indigo-500" />,
      title: "Βοήθεια",
      description: "Οδηγίες χρήσης",
      href: "/help",
      gradient: "indigo"
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item, i) => (
        <EnhancedNavItem key={i} {...item} />
      ))}
    </div>
  );
}
