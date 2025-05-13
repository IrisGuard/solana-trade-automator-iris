
import React from "react";
import { TransactionsCard } from "./TransactionsCard";
import { TokensCard } from "./TokensCard";
import { BotStatusCard } from "./BotStatusCard";
import { PlatformInfoCard } from "./PlatformInfoCard";
import { WalletInfoCard } from "./WalletInfoCard";
import { Token } from "@/types/wallet";

interface WalletConnectedContentProps {
  walletAddress: string;
  displayAddress?: string;
  solBalance?: number;
  tokens?: Token[];
  tokenPrices?: Record<string, number>;
  isLoadingTokens?: boolean;
  connectionError?: string | null;
  selectTokenForTrading?: (tokenAddress: string) => any;
}

export function WalletConnectedContent({ 
  walletAddress,
  displayAddress,
  solBalance,
  tokens,
  tokenPrices,
  isLoadingTokens,
  connectionError,
  selectTokenForTrading
}: WalletConnectedContentProps) {
  // Format wallet address for display if not provided
  const shortAddress = displayAddress || (walletAddress ? 
    `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}` : 
    '');
    
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <WalletInfoCard 
        walletAddress={walletAddress} 
        balance={solBalance || 0}
      />
      <PlatformInfoCard />
      <TokensCard 
        tokens={tokens || []}
        isLoadingTokens={isLoadingTokens}
        onSelectToken={selectTokenForTrading}
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
