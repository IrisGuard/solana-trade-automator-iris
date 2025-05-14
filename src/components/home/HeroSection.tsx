
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Lock, Wallet, Zap } from "lucide-react";
import { WalletConnectButtonSafe } from "@/components/wallet/WalletConnectButtonSafe";
import { toast } from "sonner";
import { useLanguage } from "@/hooks/use-language";
import { usePhantomConnection } from "@/hooks/usePhantomConnection";

export function HeroSection() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { isConnected } = usePhantomConnection();
  
  const handleNavigateWithToast = (path: string, message: string) => {
    toast.success(message);
    navigate(path);
  };
  
  const handleGetStarted = () => {
    if (isConnected) {
      handleNavigateWithToast('/dashboard', t("hero.dashboardToast"));
    } else {
      handleNavigateWithToast('/wallet', t("hero.walletToast", "Παρακαλώ συνδέστε το πορτοφόλι σας"));
    }
  };
  
  return (
    <div className="relative py-12 md:py-24 px-4 bg-gradient-to-b from-gray-900 to-gray-950">
      <div className="container mx-auto max-w-5xl flex flex-col items-center text-center">
        {/* Blue floating shape */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 md:w-64 md:h-64 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-32 h-32 md:w-48 md:h-48 bg-purple-500/10 rounded-full blur-3xl" />
        
        {/* Content */}
        <div className="relative">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Solana Trade Automator
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mb-8">
            {t("hero.tagline")}
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 w-full justify-center">
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="gap-2 w-full md:w-auto"
            >
              <Zap className="h-5 w-5" />
              {t("hero.getStartedButton")}
            </Button>
            
            {!isConnected && (
              <WalletConnectButtonSafe
                variant="outline"
                size="lg"
                className="gap-2 w-full md:w-auto bg-white/5 backdrop-blur-sm"
              >
                <Wallet className="h-5 w-5" />
                {t("wallet.connectWallet")}
              </WalletConnectButtonSafe>
            )}
            
            <Button
              variant="outline"
              size="lg"
              onClick={() => handleNavigateWithToast('/bot-control', t("hero.botControlToast"))}
              className="gap-2 w-full md:w-auto bg-white/5 backdrop-blur-sm"
            >
              <Zap className="h-5 w-5" />
              <span>{t("makerBot.botSettings")}</span>
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4">
              <p className="text-3xl font-bold text-blue-400">24/7</p>
              <p className="text-sm text-gray-400">{t("platform.tradingModes")}</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4">
              <p className="text-3xl font-bold text-purple-400">+25%</p>
              <p className="text-sm text-gray-400">{t("platform.avgReturns")}</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4">
              <p className="text-3xl font-bold text-green-400">0.1%</p>
              <p className="text-sm text-gray-400">{t("platform.lowFees")}</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4">
              <p className="text-3xl font-bold text-amber-400">100%</p>
              <p className="text-sm text-gray-400">{t("platform.controlFunds")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
