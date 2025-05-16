
import React from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { TransactionsCard } from '@/components/home/TransactionsCard';

export function HomePage() {
  const { walletAddress, isConnected } = useWalletConnection();
  
  const displayAddress = walletAddress 
    ? `${walletAddress.substring(0, 4)}...${walletAddress.substring(walletAddress.length - 4)}` 
    : '';

  return (
    <div className="min-h-screen">
      <HeroSection />
      <div className="container py-8 md:py-12">
        <FeaturesSection />
        
        {isConnected && walletAddress && (
          <div className="mt-8">
            <TransactionsCard walletAddress={walletAddress} displayAddress={displayAddress} />
          </div>
        )}
      </div>
    </div>
  );
}
