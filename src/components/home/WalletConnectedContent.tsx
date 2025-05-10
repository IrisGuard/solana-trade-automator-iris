
import React from "react";
import { Token } from "@/hooks/useWalletConnection";
import { WalletInfoCard } from "./WalletInfoCard";
import { TokensCard } from "./TokensCard";
import { TransactionsCard } from "./TransactionsCard";
import { BotStatusCard } from "./BotStatusCard";

interface WalletConnectedContentProps {
  walletAddress: string;
  solBalance: number;
  tokens: Token[];
  displayAddress: string;
}

export function WalletConnectedContent({ 
  walletAddress, 
  solBalance, 
  tokens, 
  displayAddress 
}: WalletConnectedContentProps) {
  return (
    <div className="space-y-6">
      <WalletInfoCard walletAddress={walletAddress} solBalance={solBalance} />
      <TokensCard tokens={tokens} displayAddress={displayAddress} />
      <TransactionsCard walletAddress={walletAddress} displayAddress={displayAddress} />
      <BotStatusCard />
    </div>
  );
}
