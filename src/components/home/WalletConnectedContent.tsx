
import React from "react";
import { Token } from "@/types/wallet";
import { WalletInfoCard } from "./WalletInfoCard";
import { TokensCard } from "./TokensCard";
import { TransactionsCard } from "./TransactionsCard";
import { BotStatusCard } from "./BotStatusCard";

interface WalletConnectedContentProps {
  walletAddress: string;
  solBalance: number;
  tokens: Token[];
  displayAddress: string;
  tokenPrices?: Record<string, number>;
  isLoadingTokens?: boolean;
  selectTokenForTrading?: (tokenAddress: string) => Token | null;
}

export function WalletConnectedContent({ 
  walletAddress, 
  solBalance, 
  tokens, 
  displayAddress,
  tokenPrices,
  isLoadingTokens,
  selectTokenForTrading
}: WalletConnectedContentProps) {
  return (
    <div className="space-y-6">
      <WalletInfoCard walletAddress={walletAddress} solBalance={solBalance} />
      <TokensCard 
        tokens={tokens} 
        displayAddress={displayAddress} 
        tokenPrices={tokenPrices}
        isLoadingTokens={isLoadingTokens}
        selectTokenForTrading={selectTokenForTrading}
      />
      <TransactionsCard walletAddress={walletAddress} displayAddress={displayAddress} />
      <BotStatusCard />
    </div>
  );
}
