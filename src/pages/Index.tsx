
import React from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { WalletDisconnectedContent } from "@/components/home/WalletDisconnectedContent";
import { FaqSection } from "@/components/home/FaqSection";
import { FooterSection } from "@/components/home/FooterSection";
import { BotExplanationSection } from "@/components/home/BotExplanationSection";

const Index = () => {
  // Απλοποιημένη έκδοση που δεν εξαρτάται από το wallet
  const isConnecting = false;
  const isPhantomInstalled = false;
  
  const handleConnectWallet = () => {
    // Προσωρινή συνάρτηση
    console.log("Connect wallet button clicked");
  };

  return (
    <div className="container mx-auto space-y-8 pb-8">
      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      <WalletDisconnectedContent 
        isConnecting={isConnecting}
        isPhantomInstalled={isPhantomInstalled}
        handleConnectWallet={handleConnectWallet}
      />
      
      {/* Bot Explanation Section */}
      <BotExplanationSection />
      
      {/* FAQ Section */}
      <FaqSection />
      
      {/* Footer */}
      <FooterSection />
    </div>
  );
};

export default Index;
