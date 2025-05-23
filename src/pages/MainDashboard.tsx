
import React from 'react';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { useTokens } from '@/hooks/useTokens';
import { WalletSection } from '@/components/dashboard/WalletSection';
import { TokensSection } from '@/components/dashboard/TokensSection';
import { TradingBotSection } from '@/components/dashboard/TradingBotSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, RefreshCw } from 'lucide-react';

export default function MainDashboard() {
  const {
    connected,
    connecting,
    walletAddress,
    shortAddress,
    balance,
    isLoadingBalance,
    connectWallet,
    disconnectWallet,
    refreshBalance,
  } = useWalletConnection();

  const {
    tokens,
    isLoading: isLoadingTokens,
    error: tokensError,
    refreshTokens,
  } = useTokens();

  const handleRefreshAll = () => {
    refreshBalance();
    refreshTokens();
  };

  if (!connected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Wallet className="h-6 w-6" />
              Solana Trading Bot
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-muted-foreground">
              Συνδεθείτε με το Phantom wallet για να ξεκινήσετε το trading
            </p>
            <Button
              onClick={connectWallet}
              disabled={connecting}
              className="w-full"
              size="lg"
            >
              {connecting ? 'Σύνδεση...' : 'Σύνδεση Πορτοφολιού'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Solana Trading Dashboard</h1>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleRefreshAll}
              variant="outline"
              size="sm"
              disabled={isLoadingBalance || isLoadingTokens}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${(isLoadingBalance || isLoadingTokens) ? 'animate-spin' : ''}`} />
              Ανανέωση
            </Button>
            <Button
              onClick={disconnectWallet}
              variant="destructive"
              size="sm"
            >
              Αποσύνδεση
            </Button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Wallet & Tokens */}
          <div className="lg:col-span-2 space-y-6">
            <WalletSection
              connected={connected}
              walletAddress={walletAddress}
              shortAddress={shortAddress}
              balance={balance}
              isLoadingBalance={isLoadingBalance}
            />
            
            <TokensSection
              tokens={tokens}
              isLoading={isLoadingTokens}
              error={tokensError}
              onRefresh={refreshTokens}
            />
          </div>

          {/* Right Column - Trading Bot */}
          <div className="space-y-6">
            <TradingBotSection
              connected={connected}
              tokens={tokens}
              walletAddress={walletAddress}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
