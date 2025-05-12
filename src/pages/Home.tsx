
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WalletConnectedContent } from "@/components/home/WalletConnectedContent";
import { WalletDisconnectedContent } from "@/components/home/WalletDisconnectedContent";
import { useWalletConnection } from "@/hooks/useWalletConnection";

export default function Home() {
  const { 
    isConnected, 
    walletAddress, 
    solBalance, 
    tokens, 
    isConnecting, 
    tokenPrices, 
    isLoadingTokens, 
    error: connectionError,
    selectTokenForTrading
  } = useWalletConnection();
  
  const displayAddress = walletAddress ? 
    `${walletAddress.substring(0, 4)}...${walletAddress.substring(walletAddress.length - 4)}` : 
    "Δεν έχει συνδεθεί πορτοφόλι";

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Καλώς ήρθατε στο Solana Trade Automator</CardTitle>
          <CardDescription>
            Αυτοματοποιήστε τις συναλλαγές σας και διαχειριστείτε τα περιουσιακά σας στοιχεία με ασφάλεια
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isConnected ? (
            <WalletConnectedContent 
              walletAddress={walletAddress} 
              displayAddress={displayAddress}
              solBalance={solBalance}
              tokens={tokens}
              tokenPrices={tokenPrices}
              isLoadingTokens={isLoadingTokens}
              connectionError={connectionError}
              selectTokenForTrading={selectTokenForTrading}
            />
          ) : (
            <WalletDisconnectedContent 
              isConnecting={isConnecting}
              isPhantomInstalled={true}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
