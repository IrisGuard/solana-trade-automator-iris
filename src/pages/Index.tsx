
import React from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { WalletConnectedContent } from "@/components/home/WalletConnectedContent";
import { WalletDisconnectedContent } from "@/components/home/WalletDisconnectedContent";
import { FaqSection } from "@/components/home/FaqSection";
import { FooterSection } from "@/components/home/FooterSection";
import { BotExplanationSection } from "@/components/home/BotExplanationSection";
import { formatWalletAddress } from "@/utils/walletUtils";
import { useSolanaWallet } from "@/hooks/useSolanaWallet";
import { ApiVaultCard } from "@/components/security/apiVault/ApiVaultCard";

const Index = () => {
  const { 
    connected,
    walletAddress,
    balance,
    tokens,
    connecting,
    isLoadingTokens,
    isLoadingBalance,
    connectionError,
    selectWallet,
    connectWallet
  } = useSolanaWallet();
  
  const displayAddress = walletAddress ? formatWalletAddress(walletAddress) : "";
  const isPhantomInstalled = typeof window !== 'undefined' && window.phantom?.solana;

  return (
    <div className="container mx-auto space-y-8 pb-8">
      {/* Hero Section */}
      <HeroSection />

      {/* API Vault Card */}
      <div className="my-8">
        <h2 className="text-2xl font-bold mb-4">Κλειδοθήκη API</h2>
        <ApiVaultCard />
      </div>

      {/* Main Content */}
      {connected && walletAddress ? (
        <WalletConnectedContent 
          walletAddress={walletAddress} 
          solBalance={balance || 0} 
          tokens={tokens} 
          displayAddress={displayAddress}
          isLoadingTokens={isLoadingTokens || isLoadingBalance}
          connectionError={connectionError}
        />
      ) : (
        <WalletDisconnectedContent 
          isConnecting={connecting}
          isPhantomInstalled={!!isPhantomInstalled}
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
