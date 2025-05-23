
import React, { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { WalletOverview } from "@/components/wallet/WalletOverview";
import { TokensTab } from "@/components/wallet/TokensTab";
import { EnhancedTradingBotTab } from "@/components/wallet/trading-bot/EnhancedTradingBotTab";
import { MakerBotTab } from "@/components/wallet/MakerBotTab";
import { ApiVaultTab } from "@/components/wallet/ApiVaultTab";
import { SimulationTab } from "@/components/wallet/SimulationTab";
import { SwapTab } from "@/components/wallet/SwapTab";
import { PageHeader } from "@/components/layout/PageHeader";
import { AppNavigation } from "@/components/navigation/AppNavigation";
import { GradientCard } from "@/components/ui/gradient-card";
import { HeliusSyncComponent } from "@/components/wallet/HeliusSyncComponent";
import { TokensDisplay } from "@/components/wallet/TokensDisplay";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function WalletPage() {
  const {
    isConnected,
    walletAddress,
    solBalance,
    tokens,
    tokenPrices,
    isLoadingTokens,
    error,
    connectWallet,
    disconnectWallet,
    refreshWalletData,
    selectTokenForTrading,
    isPhantomInstalled
  } = useWalletConnection();

  // Default tab
  const [activeTab, setActiveTab] = React.useState("overview");

  // Handle HeliusSyncComponent callback
  const handleHeliusSync = () => {
    if (isConnected && walletAddress) {
      refreshWalletData(walletAddress);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Wallet & Trading Bot"
        description="Διαχειριστείτε το πορτοφόλι και τα trading bots σας"
        breadcrumbs={[{ label: "Wallet" }]}
        variant="purple"
        actions={
          <div className="flex gap-2">
            {isConnected && (
              <HeliusSyncComponent onSync={handleHeliusSync} />
            )}
            {isConnected ? (
              <Button variant="outline" onClick={disconnectWallet}>
                Αποσύνδεση
              </Button>
            ) : (
              <Button onClick={connectWallet}>
                Σύνδεση Wallet
              </Button>
            )}
          </div>
        }
      />
      
      {/* Quick Navigation */}
      <div className="mb-6">
        <AppNavigation variant="colorful" />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Main Crypto Display */}
      <TokensDisplay 
        tokens={tokens || []}
        isLoading={isLoadingTokens}
        error={error}
        onRefresh={() => refreshWalletData()}
        isConnected={isConnected}
      />

      <GradientCard variant="purple">
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-7 w-full">
            <TabsTrigger value="overview" className="text-sm">Overview</TabsTrigger>
            <TabsTrigger value="tokens" className="text-sm">Tokens</TabsTrigger>
            <TabsTrigger value="swap" className="text-sm">Swap</TabsTrigger>
            <TabsTrigger value="trading-bot" className="text-sm">Trading Bot</TabsTrigger>
            <TabsTrigger value="maker-bot" className="text-sm">Maker Bot</TabsTrigger>
            <TabsTrigger value="api-vault" className="text-sm">API Vault</TabsTrigger>
            <TabsTrigger value="simulation" className="text-sm">Simulation</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <WalletOverview 
              isConnected={isConnected}
              walletAddress={walletAddress}
              solBalance={solBalance}
              handleConnectWallet={connectWallet}
              handleDisconnectWallet={disconnectWallet}
            />
          </TabsContent>

          <TabsContent value="tokens">
            <TokensTab 
              isConnected={isConnected}
              tokenBalance={tokens && tokens.length > 0 ? tokens[0].amount : 0}
              solBalance={solBalance}
              handleConnectWallet={connectWallet}
            />
          </TabsContent>
          
          <TabsContent value="swap">
            <SwapTab />
          </TabsContent>

          <TabsContent value="trading-bot">
            <EnhancedTradingBotTab />
          </TabsContent>

          <TabsContent value="maker-bot">
            <MakerBotTab />
          </TabsContent>

          <TabsContent value="api-vault">
            <ApiVaultTab />
          </TabsContent>

          <TabsContent value="simulation">
            <SimulationTab />
          </TabsContent>
        </Tabs>
      </GradientCard>
      
      {/* Features description cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <GradientCard variant="blue">
          <div className="p-4 text-center">
            <h3 className="text-xl font-bold mb-2">Διαχείριση Tokens</h3>
            <p className="text-muted-foreground mb-4">
              Διαχειριστείτε τα tokens σας στο blockchain του Solana με ασφάλεια.
            </p>
          </div>
        </GradientCard>
        
        <GradientCard variant="green">
          <div className="p-4 text-center">
            <h3 className="text-xl font-bold mb-2">Αυτόματο Trading</h3>
            <p className="text-muted-foreground mb-4">
              Ρυθμίστε Trading Bot για αυτόματες συναλλαγές βάσει των προτιμήσεών σας.
            </p>
          </div>
        </GradientCard>
        
        <GradientCard variant="amber">
          <div className="p-4 text-center">
            <h3 className="text-xl font-bold mb-2">Προστασία Επενδύσεων</h3>
            <p className="text-muted-foreground mb-4">
              Προστατέψτε τις επενδύσεις σας από απότομες πτώσεις της αγοράς.
            </p>
          </div>
        </GradientCard>
      </div>
    </div>
  );
}
