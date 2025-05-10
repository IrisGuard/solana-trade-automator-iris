
import React from "react";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { HeroSection } from "@/components/home/HeroSection";
import { WalletConnectedContent } from "@/components/home/WalletConnectedContent";
import { WalletDisconnectedContent } from "@/components/home/WalletDisconnectedContent";
import { FaqSection } from "@/components/home/FaqSection";
import { FooterSection } from "@/components/home/FooterSection";
import { BotExplanationSection } from "@/components/home/BotExplanationSection";
import { formatWalletAddress } from "@/utils/walletUtils";

const Index = () => {
  const { 
    isConnected, 
    walletAddress, 
    solBalance, 
    tokens, 
    tokenPrices,
    connectWallet, 
    isConnecting,
    error,
    isPhantomInstalled,
    selectTokenForTrading,
    isLoadingTokens
  } = useWalletConnection();
  
  const displayAddress = walletAddress ? formatWalletAddress(walletAddress) : "";

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
          tokenPrices={tokenPrices}
          isLoadingTokens={isLoadingTokens}
          selectTokenForTrading={selectTokenForTrading}
        />
      ) : (
        <WalletDisconnectedContent 
          connectWallet={connectWallet} 
          isConnecting={isConnecting}
          error={error}
          isPhantomInstalled={isPhantomInstalled}
        />
      )}
      
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
