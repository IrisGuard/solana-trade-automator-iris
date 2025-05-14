
import React from "react";
import { WalletConnectButtonSafe } from "@/components/wallet/WalletConnectButtonSafe";
import { Button } from "@/components/ui/button";
import { RefreshCw, Bell } from "lucide-react";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/use-language";

interface HeaderProps {
  title?: string;
}

export function Header({ title = "Solana Trade" }: HeaderProps) {
  const { isConnected, refreshWalletData } = useWalletConnection();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const handleRefresh = () => {
    refreshWalletData();
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex flex-1 items-center justify-between">
        <h1 className="text-xl font-semibold">{title}</h1>
        
        <div className="flex items-center gap-2">
          {isConnected && (
            <Button variant="ghost" size="icon" onClick={handleRefresh} title={t("general.refresh")}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
          
          <Button variant="ghost" size="icon" title={t("notifications.title")}>
            <Bell className="h-4 w-4" />
          </Button>
          
          <WalletConnectButtonSafe variant="outline" size="sm" />
          
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
