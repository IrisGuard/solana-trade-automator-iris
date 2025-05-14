
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
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Wallet & Trading Bot</h2>
        {isConnected ? (
          <Button variant="outline" onClick={disconnectWallet}>
            Disconnect Wallet
          </Button>
        ) : (
          <Button onClick={connectWallet}>
            Connect Wallet
          </Button>
        )}
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tokens">Tokens</TabsTrigger>
          <TabsTrigger value="trading-bot">Trading Bot</TabsTrigger>
          <TabsTrigger value="maker-bot">Maker Bot</TabsTrigger>
          <TabsTrigger value="api-vault">API Vault</TabsTrigger>
          <TabsTrigger value="simulation">Simulation</TabsTrigger>
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
    </div>
  );
}
