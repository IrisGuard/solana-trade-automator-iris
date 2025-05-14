
import React from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/use-language";
import { Wallet } from "lucide-react";

export function ThemeToggleHeader() {
  const { t } = useLanguage();
  
  return (
    <div className="flex items-center gap-2 md:gap-4">
      <Link
        to="/wallet"
        className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <Wallet className="h-4 w-4" />
        <span className="hidden md:inline">{t("general.wallet")}</span>
      </Link>
      <ThemeToggle />
    </div>
  );
}
