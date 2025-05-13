
import React from "react";
import { TransactionsCard } from "./TransactionsCard";
import { TokensCard } from "./TokensCard";
import { BotStatusCard } from "./BotStatusCard";
import { PlatformInfoCard } from "./PlatformInfoCard";
import { WalletInfoCard } from "./WalletInfoCard";

interface WalletConnectedContentProps {
  walletAddress: string;
}

export function WalletConnectedContent({ walletAddress }: WalletConnectedContentProps) {
  // Μορφοποίηση της διεύθυνσης για εμφάνιση
  const shortAddress = walletAddress ? 
    `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}` : 
    '';
    
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <WalletInfoCard 
        address={walletAddress} 
        displayAddress={shortAddress}
      />
      <PlatformInfoCard />
      <TokensCard 
        walletAddress={walletAddress} 
        displayAddress={shortAddress}
      />
      <BotStatusCard />
      <div className="md:col-span-2">
        <TransactionsCard 
          walletAddress={walletAddress}
          displayAddress={shortAddress}
        />
      </div>
    </div>
  );
}
