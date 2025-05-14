
import React from 'react';
import { Container } from '@mui/material';
import { useWallet } from '@/hooks/useWallet';
import { WalletOverviewPanel } from '@/components/dashboard/WalletOverviewPanel';
import { TokensPanel } from '@/components/dashboard/TokensPanel';
import { TransactionsPanel } from '@/components/dashboard/TransactionsPanel';

export default function Dashboard() {
  const {
    isConnected,
    walletAddress,
    tokens,
    solBalance,
    balance,
    tokenPrices,
    isLoadingTokens,
    refreshWalletData,
    selectTokenForTrading
  } = useWallet();

  // Calculate total portfolio value
  const calculateTotalValue = () => {
    if (!tokens.length || !tokenPrices) return solBalance;
    
    const tokensValue = tokens.reduce((total, token) => {
      const price = tokenPrices[token.address] || 0;
      return total + (token.amount * price);
    }, 0);
    
    return solBalance + tokensValue;
  };

  const totalValue = calculateTotalValue();

  return (
    <Container maxWidth="lg">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      {!isConnected ? (
        <div className="bg-muted/50 rounded-lg p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Connect your wallet to view dashboard</h2>
          <p className="text-muted-foreground mb-6">
            Connect your Solana wallet to see your balances, tokens, and transactions
          </p>
          <button 
            onClick={() => refreshWalletData()}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Connect Wallet
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <WalletOverviewPanel 
            walletAddress={walletAddress}
            solBalance={solBalance}
            totalValue={totalValue}
            onRefresh={refreshWalletData}
          />
          
          <TokensPanel 
            tokens={tokens}
            tokenPrices={tokenPrices}
            isLoading={isLoadingTokens}
          />
          
          <TransactionsPanel />
        </div>
      )}
    </Container>
  );
}
