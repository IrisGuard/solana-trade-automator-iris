
import React from "react";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { HeroSection } from "@/components/home/HeroSection";
import { WalletConnectedContent } from "@/components/home/WalletConnectedContent";
import { WalletDisconnectedContent } from "@/components/home/WalletDisconnectedContent";
import { FaqSection } from "@/components/home/FaqSection";
import { FooterSection } from "@/components/home/FooterSection";

const Index = () => {
  const { 
    isConnected, 
    walletAddress, 
    solBalance, 
    tokens, 
    connectWallet, 
    isConnecting,
    error,
    isPhantomInstalled
  } = useWalletConnection();
  
  const displayAddress = walletAddress ? 
    `${walletAddress.substring(0, 4)}...${walletAddress.substring(walletAddress.length - 4)}` : "";

  return (
    <div className="container mx-auto space-y-8 pb-8">
      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      {isConnected ? (
        <WalletConnectedContent 
          walletAddress={walletAddress} 
          solBalance={solBalance} 
          tokens={tokens} 
          displayAddress={displayAddress}
        />
      ) : (
        <WalletDisconnectedContent 
          connectWallet={connectWallet} 
          isConnecting={isConnecting}
          error={error}
          isPhantomInstalled={isPhantomInstalled}
        />
      )}
      
      {/* FAQ Section */}
      <FaqSection />
      
      {/* Footer */}
      <FooterSection />
    </div>
  );
};

export default Index;
