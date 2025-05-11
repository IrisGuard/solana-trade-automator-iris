
import React, { useEffect } from "react";
import { Token } from "@/types/wallet";
import { WalletInfoCard } from "./WalletInfoCard";
import { TokensCard } from "./TokensCard";
import { TransactionsCard } from "./TransactionsCard";
import { BotStatusCard } from "./BotStatusCard";
import { toast } from "sonner";

interface WalletConnectedContentProps {
  walletAddress: string;
  solBalance: number;
  tokens: Token[];
  displayAddress: string;
  tokenPrices?: Record<string, number>;
  isLoadingTokens?: boolean;
  connectionError?: string | null;
  selectTokenForTrading?: (tokenAddress: string) => Token | null;
}

export function WalletConnectedContent({ 
  walletAddress, 
  solBalance, 
  tokens, 
  displayAddress,
  tokenPrices,
  isLoadingTokens,
  connectionError,
  selectTokenForTrading
}: WalletConnectedContentProps) {
  // Εμφάνιση μηνύματος καλωσορίσματος όταν φορτώνεται το component
  useEffect(() => {
    if (walletAddress && !connectionError) {
      toast.success(`Το πορτοφόλι σας συνδέθηκε επιτυχώς: ${displayAddress}`, {
        duration: 4000,
        position: "top-center"
      });
    }
  }, [walletAddress, displayAddress, connectionError]);

  return (
    <div className="space-y-6">
      <WalletInfoCard walletAddress={walletAddress} solBalance={solBalance} />
      <TokensCard 
        tokens={tokens} 
        displayAddress={displayAddress} 
        tokenPrices={tokenPrices}
        isLoadingTokens={isLoadingTokens}
        connectionError={connectionError}
        selectTokenForTrading={selectTokenForTrading}
      />
      <TransactionsCard walletAddress={walletAddress} displayAddress={displayAddress} />
      <BotStatusCard />
    </div>
  );
}
