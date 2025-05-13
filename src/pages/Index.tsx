
import React from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { BotExplanationSection } from "@/components/home/BotExplanationSection";
import { FooterSection } from "@/components/home/FooterSection";
import { FaqSection } from "@/components/home/FaqSection";
import { ThemeToggleHeader } from "@/components/layout/ThemeToggleHeader";
import { WalletConnectButton } from "@/components/wallet/WalletConnectButton";
import { useWalletStatus } from "@/hooks/useWalletStatus";

export default function Index() {
  const { isConnected, isPhantomInstalled } = useWalletStatus();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Solana Trade Automator</h1>
          <div className="flex items-center gap-4">
            <a href="/home" className="text-primary hover:underline">Είσοδος στο Dashboard</a>
            <a href="/bot-control" className="text-primary hover:underline">Trading Bots</a>
            <WalletConnectButton variant="outline" size="sm" />
            <ThemeToggleHeader />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <HeroSection />
        <BotExplanationSection />
        <FaqSection />
      </main>
      <FooterSection />
    </div>
  );
}
