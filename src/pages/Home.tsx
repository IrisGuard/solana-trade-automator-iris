
import React, { useEffect } from 'react';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { HeroSection } from '@/components/home/HeroSection';
import { WalletConnectedContent } from '@/components/home/WalletConnectedContent';
import { WalletDisconnectedContent } from '@/components/home/WalletDisconnectedContent';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { HowItWorksSection } from '@/components/home/HowItWorksSection';
import { FaqSection } from '@/components/home/FaqSection';
import { FooterSection } from '@/components/home/FooterSection';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function Home() {
  const { 
    isConnected,
    walletAddress,
    tokens,
    tokenPrices,
    isLoadingTokens
  } = useWalletConnection();
  
  useEffect(() => {
    // Check if wallet is connected on initial load
    if (isConnected) {
      console.log("Wallet connected on Home page:", walletAddress);
    }
  }, [isConnected, walletAddress]);
  
  return (
    <div className="min-h-screen">
      {/* Hero Section with Wallet Connection Status */}
      <HeroSection>
        <div className="w-full max-w-xs mx-auto">
          <WalletMultiButton 
            className="w-full bg-primary hover:bg-primary/90 text-white p-4 rounded-lg transition-colors"
          />
        </div>
      </HeroSection>
      
      {/* Dynamic Content Based on Wallet Connection Status */}
      {isConnected ? (
        <WalletConnectedContent 
          tokens={tokens}
          tokenPrices={tokenPrices}
          isLoadingTokens={isLoadingTokens}
        />
      ) : (
        <WalletDisconnectedContent />
      )}
      
      {/* Standard Marketing Sections */}
      <FeaturesSection />
      <HowItWorksSection />
      <FaqSection />
      <FooterSection />
    </div>
  );
}
