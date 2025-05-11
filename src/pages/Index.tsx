
import React from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { WalletConnectedContent } from "@/components/home/WalletConnectedContent";
import { WalletDisconnectedContent } from "@/components/home/WalletDisconnectedContent";
import { FaqSection } from "@/components/home/FaqSection";
import { FooterSection } from "@/components/home/FooterSection";
import { BotExplanationSection } from "@/components/home/BotExplanationSection";
import { formatWalletAddress } from "@/utils/walletUtils";
import { useSolanaWallet } from "@/hooks/useSolanaWallet";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const Index = () => {
  const { 
    connected,
    walletAddress,
    balance,
    tokens,
    connecting,
    isLoadingTokens,
    isLoadingBalance
  } = useSolanaWallet();
  
  const displayAddress = walletAddress ? formatWalletAddress(walletAddress) : "";

  return (
    <div className="container mx-auto space-y-8 pb-8">
      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      {connected && walletAddress ? (
        <WalletConnectedContent 
          walletAddress={walletAddress} 
          solBalance={balance || 0} 
          tokens={tokens} 
          displayAddress={displayAddress}
          isLoadingTokens={isLoadingTokens || isLoadingBalance}
        />
      ) : (
        <WalletDisconnectedContent 
          isConnecting={connecting}
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
