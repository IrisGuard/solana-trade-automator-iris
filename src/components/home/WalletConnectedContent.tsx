
import React from "react";
import { TransactionsCard } from "./TransactionsCard";
import { TokensCard } from "./TokensCard";
import { BotStatusCard } from "./BotStatusCard";
import { PlatformInfoCard } from "./PlatformInfoCard";
import { WalletInfoCard } from "./WalletInfoCard";
import { Token } from "@/types/wallet";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

interface WalletConnectedContentProps {
  walletAddress: string;
  displayAddress?: string;
  solBalance?: number;
  tokens?: Token[];
  tokenPrices?: Record<string, { price: number; priceChange24h: number }>;
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
  const shortAddress = displayAddress || (walletAddress && typeof walletAddress === 'string' ? 
    `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}` : 
    '');
    
  // Ensure connectionError is a string
  const errorMessage = connectionError ? String(connectionError) : null;
    
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
          tokenPrices={tokenPrices}
          isLoading={isLoadingTokens || false}
          onSelectToken={selectTokenForTrading}
        />
      ) : (
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>
            Δεν βρέθηκαν tokens στο πορτοφόλι σας ή δεν έχουν φορτωθεί ακόμη. Αν η φόρτωση είναι σε εξέλιξη, 
            παρακαλώ περιμένετε λίγο.
            {errorMessage && <p className="mt-2 text-red-500">{errorMessage}</p>}
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
