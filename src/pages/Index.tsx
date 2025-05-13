
import React from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { BotExplanationSection } from "@/components/home/BotExplanationSection";
import { FooterSection } from "@/components/home/FooterSection";
import { FaqSection } from "@/components/home/FaqSection";
import { WalletConnectedContent } from "@/components/home/WalletConnectedContent";
import { WalletDisconnectedContent } from "@/components/home/WalletDisconnectedContent";
import { useWalletStatus } from "@/hooks/useWalletStatus";

export default function Index() {
  const { isConnected, isConnecting, walletAddress } = useWalletStatus();

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {!isConnected ? (
          <>
            <HeroSection />
            <BotExplanationSection />
            <FaqSection />
          </>
        ) : walletAddress ? (
          <div className="container max-w-7xl py-6">
            <WalletConnectedContent walletAddress={walletAddress} />
          </div>
        ) : (
          <WalletDisconnectedContent isConnecting={isConnecting} />
        )}
      </main>
      <FooterSection />
    </div>
  );
}
