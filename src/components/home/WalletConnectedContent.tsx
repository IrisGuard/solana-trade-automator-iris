
import React from "react";
import { TransactionsCard } from "./TransactionsCard";
import { TokensCard } from "./TokensCard";
import { BotStatusCard } from "./BotStatusCard";
import { PlatformInfoCard } from "./PlatformInfoCard";
import { WalletInfoCard } from "./WalletInfoCard";
import { Token, TokenPrices } from "@/types/wallet";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

interface WalletConnectedContentProps {
  walletAddress: string;
  displayAddress?: string;
  solBalance?: number;
  tokens?: Token[];
  tokenPrices?: TokenPrices;
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
  const shortAddress = displayAddress || (walletAddress && typeof walletAddress === 'string' ? 
    `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}` : 
    '');

  // Convert TokenPrices to the format expected by TokensCard
  const tokenPricesFormatted = tokenPrices ? Object.fromEntries(
    Object.entries(tokenPrices).map(([key, value]) => [
      key, 
      { 
        price: value.price, 
        priceChange24h: value.priceChange24h || value.change24h || 0 
      }
    ])
  ) : {};
    
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <WalletInfoCard 
        walletAddress={walletAddress} 
        balance={solBalance || 0}
      />
      <PlatformInfoCard />
      {tokens && tokens.length > 0 ? (
        <TokensCard 
          walletAddress={walletAddress}
          tokens={tokens}
          tokenPrices={tokenPricesFormatted}
          isLoading={isLoadingTokens || false}
          onSelectToken={selectTokenForTrading}
        />
      ) : (
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>
            Δεν βρέθηκαν tokens στο πορτοφόλι σας ή δεν έχουν φορτωθεί ακόμη. Αν η φόρτωση είναι σε εξέλιξη, 
            παρακαλώ περιμένετε λίγο.
          </AlertDescription>
        </Alert>
      )}
      <BotStatusCard 
        isActive={false} 
        isLoading={false} 
        toggleBotStatus={() => Promise.resolve()}
      />
      <div className="md:col-span-2">
        <TransactionsCard 
          walletAddress={walletAddress}
          displayAddress={shortAddress}
        />
      </div>
    </div>
  );
}
