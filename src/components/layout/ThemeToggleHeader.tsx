
import React from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Link } from "react-router-dom";
import { useLanguage } from "@/providers/LanguageProvider";
import { Wallet } from "lucide-react";

export function ThemeToggleHeader() {
  const { t } = useLanguage();
  
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
      <Link to="/" className="lg:hidden flex items-center">
        <Wallet className="h-6 w-6 text-primary" />
        <span className="ml-2 font-semibold text-primary">SolApp</span>
      </Link>
      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  );
}
