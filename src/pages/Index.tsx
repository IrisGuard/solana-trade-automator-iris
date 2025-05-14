
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { WalletConnectButtonSafe } from "@/components/wallet/WalletConnectButtonSafe";
import { usePhantomConnection } from "@/hooks/usePhantomConnection";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { UserTokensSection } from "@/components/home/UserTokensSection";
import { UserBotsSection } from "@/components/home/UserBotsSection";
import { FaqSection } from "@/components/home/FaqSection";
import { FooterSection } from "@/components/home/FooterSection";

export default function Index() {
  const { t } = useLanguage();
  const { isConnected } = usePhantomConnection();
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-white">
      {/* Header navigation */}
      <header className="p-4 border-b border-gray-800">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Solana Trade Automator</h1>
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-blue-400 hover:text-blue-300 hidden sm:inline-block">
              {t("general.dashboard")}
            </Link>
            <Link to="/bot-control" className="text-blue-400 hover:text-blue-300 hidden sm:inline-block">
              {t("makerBot.botSettings")}
            </Link>
            <div className="hidden sm:block">
              <WalletConnectButtonSafe 
                variant="outline" 
                size="sm"
                className="bg-transparent border border-gray-700 text-white"
              />
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1">
        {/* Hero section */}
        <HeroSection />
        
        {/* Features section */}
        <FeaturesSection />
        
        {/* How it works section */}
        <HowItWorksSection />
        
        {/* User tokens section (or sample if not connected) */}
        <UserTokensSection />
        
        {/* User bots section (or sample if not connected) */}
        <UserBotsSection />
        
        {/* FAQ section */}
        <FaqSection />
      </main>
      
      {/* Footer */}
      <FooterSection />
    </div>
  );
}
