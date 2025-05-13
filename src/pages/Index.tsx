
import React from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { WalletDisconnectedContent } from "@/components/home/WalletDisconnectedContent";
import { FaqSection } from "@/components/home/FaqSection";
import { FooterSection } from "@/components/home/FooterSection";
import { BotExplanationSection } from "@/components/home/BotExplanationSection";
import { useWallet } from '@solana/wallet-adapter-react';
import { Toaster } from "sonner";

const Index = () => {
  const { connected, connecting } = useWallet();
  
  return (
    <div className="container mx-auto space-y-8 pb-8">
      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      {!connected && (
        <WalletDisconnectedContent 
          isConnecting={connecting}
          isPhantomInstalled={true}
        />
      )}
      
      {/* Bot Explanation Section */}
      <BotExplanationSection />
      
      {/* FAQ Section */}
      <FaqSection />
      
      {/* Footer */}
      <FooterSection />
      
      <Toaster position="top-center" richColors closeButton />
    </div>
  );
};

export default Index;
