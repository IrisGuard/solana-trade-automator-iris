
import React from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageToggle } from "./LanguageToggle";
import { Link } from "@/lib/router-exports";
import { useLanguage } from "@/providers/LanguageProvider";

export function ThemeToggleHeader() {
  const { t } = useLanguage();
  
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
      <Link to="/" className="lg:hidden">
        <img src="/logo.svg" alt="SolApp" className="h-6" />
      </Link>
      <div className="ml-auto flex items-center gap-2">
        <LanguageToggle />
        <ThemeToggle />
      </div>
    </header>
  );
}
