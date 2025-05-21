
import React, { useEffect } from 'react';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SwapTab } from '@/components/wallet/SwapTab';
import { TokensTab } from '@/components/wallet/TokensTab';
import { TransactionHistory } from '@/components/wallet/TransactionHistory';
import { TradingBotTab } from '@/components/wallet/TradingBotTab';
import { WalletOverview } from '@/components/wallet/WalletOverview';
import { ApiVaultTab } from '@/components/wallet/ApiVaultTab';

export default function Wallet() {
  const { 
    isConnected,
    walletAddress,
    solBalance,
    tokens,
    tokenPrices,
    isLoadingTokens
  } = useWalletConnection();
  
  useEffect(() => {
    // Check if wallet is connected on initial load
    if (isConnected) {
      console.log("Wallet connected on Wallet page:", walletAddress);
    }
  }, [isConnected, walletAddress]);
  
  return (
    <div className="container py-6 space-y-6">
      <WalletOverview 
        isConnected={isConnected}
        walletAddress={walletAddress}
        solBalance={solBalance}
        tokenCount={tokens?.length || 0}
      />
      
      <Tabs defaultValue="tokens">
        <TabsList className="grid grid-cols-5">
          <TabsTrigger value="tokens">Tokens</TabsTrigger>
          <TabsTrigger value="swap">Swap</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="trading-bot">Trading Bot</TabsTrigger>
          <TabsTrigger value="api-vault">API Vault</TabsTrigger>
        </TabsList>
        
        <TokensTab />
        <SwapTab />
        <TabsContent value="transactions">
          <TransactionHistory />
        </TabsContent>
        <TradingBotTab />
        <ApiVaultTab />
      </Tabs>
    </div>
  );
}
