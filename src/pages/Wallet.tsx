
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWallet } from "@/hooks/useWallet";
import { WalletOverview } from "@/components/wallet/WalletOverview";
import { TokensTab } from "@/components/wallet/TokensTab";
import { MakerBotTab } from "@/components/wallet/MakerBotTab";
import { ApiVaultTab } from "@/components/wallet/ApiVaultTab";
import { SimulationTab } from "@/components/wallet/SimulationTab";
import { TradingBotTab } from "@/components/wallet/TradingBotTab";

export default function WalletPage() {
  const {
    isConnected,
    isSimulation,
    activeTab,
    setActiveTab,
    makers,
    setMakers,
    minDelay,
    setMinDelay,
    maxDelay,
    setMaxDelay,
    priceBoost,
    setPriceBoost,
    botActive,
    tokenAmount,
    setTokenAmount,
    solAmount,
    setSolAmount,
    apiKeys,
    isUnlocked,
    apiSettings,
    setApiSettings,
    walletAddress,
    solBalance,
    tokenBalance,
    handleConnectWallet,
    handleDisconnectWallet,
    toggleSimulation,
    handleStartBot,
    handleStopBot,
    handleBoostPrice,
    handleApiConnect,
    handleUnlockVault,
    handleLockVault,
    handleSaveApiSettings,
    handleExportKeys,
    handleImportKeys
  } = useWallet();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Wallet & Trading Bot</h2>
        {isConnected ? (
          <Button variant="outline" onClick={handleDisconnectWallet}>
            Disconnect Wallet
          </Button>
        ) : (
          <Button onClick={handleConnectWallet}>
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
          handleConnectWallet={handleConnectWallet}
          handleDisconnectWallet={handleDisconnectWallet}
        />

        <TokensTab 
          isConnected={isConnected}
          tokenBalance={tokenBalance}
          solBalance={solBalance}
          handleConnectWallet={handleConnectWallet}
        />
        
        <TradingBotTab />

        <MakerBotTab 
          isConnected={isConnected}
          isSimulation={isSimulation}
          makers={makers}
          minDelay={minDelay}
          maxDelay={maxDelay}
          priceBoost={priceBoost}
          botActive={botActive}
          tokenAmount={tokenAmount}
          solAmount={solAmount}
          handleConnectWallet={handleConnectWallet}
          toggleSimulation={toggleSimulation}
          setMakers={setMakers}
          setMinDelay={setMinDelay}
          setMaxDelay={setMaxDelay}
          setPriceBoost={setPriceBoost}
          setTokenAmount={setTokenAmount}
          setSolAmount={setSolAmount}
          handleStartBot={handleStartBot}
          handleStopBot={handleStopBot}
          handleBoostPrice={handleBoostPrice}
        />

        <ApiVaultTab 
          apiKeys={apiKeys}
          isUnlocked={isUnlocked}
          apiSettings={apiSettings}
          handleUnlockVault={handleUnlockVault}
          handleLockVault={handleLockVault}
          handleApiConnect={handleApiConnect}
          handleExportKeys={handleExportKeys}
          handleImportKeys={handleImportKeys}
          setApiSettings={setApiSettings}
          handleSaveApiSettings={handleSaveApiSettings}
        />

        <SimulationTab />
      </Tabs>
    </div>
  );
}
