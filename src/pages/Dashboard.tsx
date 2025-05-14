
import React from 'react';
import { Container, Grid } from '@mui/material';
import { useWallet } from '@/hooks/useWallet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Dashboard components
import { WalletOverviewPanel } from '@/components/dashboard/WalletOverviewPanel';
import { TokensPanel } from '@/components/dashboard/TokensPanel';
import { TransactionsPanel } from '@/components/dashboard/TransactionsPanel';
import { TradingBotTab } from '@/components/wallet/TradingBotTab';
import { useSupabaseSync } from '@/components/security/apiVault/hooks/useSupabaseSync';

export default function Dashboard() {
  const { 
    isConnected,
    walletAddress,
    tokens,
    balance,
    connectWallet,
    disconnectWallet
  } = useWallet();

  // Sync API keys with Supabase
  const { 
    syncApiKeysToSupabase,
    fetchApiKeysFromSupabase,
    isSyncing,
    isAuthenticated 
  } = useSupabaseSync();
  
  // Handle token selection for trading
  const handleSelectToken = (tokenAddress: string) => {
    console.log('Selected token:', tokenAddress);
    // Implementation will be added later
  };
  
  // Handle refresh wallet data
  const handleRefreshWallet = async () => {
    try {
      // Implementation will be added later
      console.log('Refreshing wallet data');
    } catch (error) {
      console.error('Error refreshing wallet data:', error);
    }
  };

  return (
    <Container maxWidth="xl" className="py-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full justify-start mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tokens">Tokens</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="trading-bot">Trading Bot</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <WalletOverviewPanel 
                walletAddress={walletAddress}
                balance={balance}
                isConnected={isConnected}
                onRefresh={handleRefreshWallet}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <div className="space-y-4">
                <TokensPanel 
                  tokens={tokens} 
                  isLoading={false} 
                  onSelectToken={handleSelectToken}
                />
                <TransactionsPanel walletAddress={walletAddress} />
              </div>
            </Grid>
          </Grid>
        </TabsContent>
        
        <TabsContent value="tokens">
          <TokensPanel 
            tokens={tokens} 
            isLoading={false}
            onSelectToken={handleSelectToken}
          />
        </TabsContent>
        
        <TabsContent value="transactions">
          <TransactionsPanel 
            walletAddress={walletAddress} 
          />
        </TabsContent>
        
        <TradingBotTab />
      </Tabs>
    </Container>
  );
}
