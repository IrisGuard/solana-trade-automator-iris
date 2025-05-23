
import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { WalletOverview } from "@/components/wallet/WalletOverview";
import { TokensTab } from "@/components/wallet/TokensTab";
import { SwapTab } from "@/components/wallet/SwapTab";
import { PageHeader } from "@/components/layout/PageHeader";
import { AppNavigation } from "@/components/navigation/AppNavigation";
import { TokensDisplay } from "@/components/wallet/TokensDisplay";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function WalletPage() {
  const {
    isConnected,
    walletAddress,
    solBalance,
    tokens,
    isLoadingTokens,
    error,
    connectWallet,
    disconnectWallet,
    refreshWalletData
  } = useWalletConnection();

  // Default tab
  const [activeTab, setActiveTab] = React.useState("overview");

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Wallet & Crypto Display"
        description="Διαχειριστείτε το πορτοφόλι και δείτε τα κρυπτονομίσματά σας"
        breadcrumbs={[{ label: "Wallet" }]}
        variant="purple"
        actions={
          <div className="flex gap-2">
            {isConnected ? (
              <Button variant="outline" onClick={disconnectWallet}>
                Αποσύνδεση
              </Button>
            ) : (
              <Button onClick={connectWallet}>
                Σύνδεση Wallet
              </Button>
            )}
            
            {isConnected && (
              <Button onClick={refreshWalletData}>
                Ανανέωση
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

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="overview" className="text-sm">Overview</TabsTrigger>
          <TabsTrigger value="tokens" className="text-sm">Tokens</TabsTrigger>
          <TabsTrigger value="swap" className="text-sm">Swap</TabsTrigger>
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
          <SwapTab isConnected={isConnected} />
        </TabsContent>
      </Tabs>
      
      {/* User guidance information */}
      {isConnected && (
        <Alert variant="info" className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
          <AlertDescription className="text-blue-700 dark:text-blue-300">
            💡 <strong>Πληροφορία:</strong> Η εφαρμογή τώρα εμφανίζει πραγματικά δεδομένα από το Solana mainnet. 
            Συνδεθείτε με το Phantom wallet σας για να δείτε τα tokens σας.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
