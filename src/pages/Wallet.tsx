
import React from "react";
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
import { PageHeader } from "@/components/layout/PageHeader";
import { AppNavigation } from "@/components/navigation/AppNavigation";
import { GradientCard } from "@/components/ui/gradient-card";

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

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Wallet & Trading Bot"
        description="Διαχειριστείτε το πορτοφόλι σας και τα trading bots"
        breadcrumbs={[{ label: "Wallet" }]}
        variant="purple"
        actions={
          isConnected ? (
            <Button variant="outline" onClick={disconnectWallet}>
              Αποσύνδεση
            </Button>
          ) : (
            <Button onClick={connectWallet}>
              Σύνδεση Πορτοφολιού
            </Button>
          )
        }
      />
      
      {/* Quick Navigation */}
      <div className="mb-6">
        <AppNavigation variant="colorful" />
      </div>

      <GradientCard variant="purple">
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-6 w-full">
            <TabsTrigger value="overview" className="text-sm">Επισκόπηση</TabsTrigger>
            <TabsTrigger value="tokens" className="text-sm">Tokens</TabsTrigger>
            <TabsTrigger value="trading-bot" className="text-sm">Trading Bot</TabsTrigger>
            <TabsTrigger value="maker-bot" className="text-sm">Maker Bot</TabsTrigger>
            <TabsTrigger value="api-vault" className="text-sm">API Vault</TabsTrigger>
            <TabsTrigger value="simulation" className="text-sm">Προσομοίωση</TabsTrigger>
          </TabsList>

          <WalletOverview 
            isConnected={isConnected}
            walletAddress={walletAddress}
            solBalance={solBalance}
            handleConnectWallet={connectWallet}
            handleDisconnectWallet={disconnectWallet}
          />

          <TokensTab 
            isConnected={isConnected}
            tokenBalance={tokens && tokens.length > 0 ? tokens[0].amount : 0}
            solBalance={solBalance}
            handleConnectWallet={connectWallet}
          />
          
          <EnhancedTradingBotTab />

          <MakerBotTab 
            isConnected={isConnected}
          />

          <ApiVaultTab />

          <SimulationTab />
        </Tabs>
      </GradientCard>
      
      {/* Features description cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <GradientCard variant="blue">
          <div className="p-4 text-center">
            <h3 className="text-xl font-bold mb-2">Διαχείριση Tokens</h3>
            <p className="text-muted-foreground mb-4">
              Διαχειριστείτε τα tokens σας στο Solana blockchain με ασφάλεια και ευκολία.
            </p>
          </div>
        </GradientCard>
        
        <GradientCard variant="green">
          <div className="p-4 text-center">
            <h3 className="text-xl font-bold mb-2">Αυτοματοποιημένο Trading</h3>
            <p className="text-muted-foreground mb-4">
              Ρυθμίστε το Trading Bot για αυτόματες συναλλαγές βάσει των προτιμήσεών σας.
            </p>
          </div>
        </GradientCard>
        
        <GradientCard variant="amber">
          <div className="p-4 text-center">
            <h3 className="text-xl font-bold mb-2">Price Boost Protection</h3>
            <p className="text-muted-foreground mb-4">
              Προστατέψτε τις επενδύσεις σας από απότομες πτώσεις στην αγορά.
            </p>
          </div>
        </GradientCard>
      </div>
    </div>
  );
}
