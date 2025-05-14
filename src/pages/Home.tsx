
import React, { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WalletConnectedContent } from "@/components/home/WalletConnectedContent";
import { ConnectWalletCard } from "@/components/home/ConnectWalletCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Wallet } from "lucide-react";
import { usePhantomConnection } from "@/hooks/usePhantomConnection";
import { TokenBot } from "@/components/wallet/TokenBot";
import { useLanguage } from "@/hooks/use-language";

export default function Home() {
  const { 
    isConnected, 
    walletAddress, 
    solBalance, 
    tokens, 
    isConnecting, 
    isLoadingTokens, 
    error: connectionError,
    isPhantomInstalled,
    connectWallet,
    disconnectWallet,
    refreshWalletData,
    selectTokenForTrading
  } = usePhantomConnection();
  
  const { t } = useLanguage();
  
  console.log("WalletConnection hook loaded, connection status:", isConnected);
  
  // Διασφαλίζουμε ότι το walletAddress είναι string πριν χρησιμοποιήσουμε substring
  const displayAddress = typeof walletAddress === 'string' && walletAddress ? 
    `${walletAddress.substring(0, 4)}...${walletAddress.substring(walletAddress.length - 4)}` : 
    "Δεν έχει συνδεθεί πορτοφόλι";
  
  // Convert complex token prices to simple format for compatibility
  const tokenPrices: Record<string, { price: number, priceChange24h: number }> = {};
  tokens.forEach(token => {
    tokenPrices[token.address] = {
      price: Math.random() * 10,  // Mock prices for demo
      priceChange24h: (Math.random() * 2) - 1  // Between -1 and 1
    };
  });
  
  // Wrapper for connectWallet to match expected return type
  const handleConnectWallet = async () => {
    await connectWallet();
  };
  
  useEffect(() => {
    console.log("Home page loaded. Connection status:", isConnected ? "Connected" : "Not connected");
  }, [isConnected]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <CardTitle>Καλώς ήρθατε στο Solana Trade Automator</CardTitle>
              <CardDescription>
                Αυτοματοποιήστε τις συναλλαγές σας και διαχειριστείτε τα περιουσιακά σας στοιχεία με ασφάλεια
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {connectionError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Σφάλμα σύνδεσης: {connectionError}. Παρακαλώ δοκιμάστε ξανά αργότερα.
              </AlertDescription>
            </Alert>
          )}
          
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
            <ConnectWalletCard 
              isConnecting={isConnecting}
              isPhantomInstalled={isPhantomInstalled}
            />
          )}
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TokenBot 
          tokens={tokens}
          isConnected={isConnected}
          onConnectWallet={handleConnectWallet}
        />
        
        <Card>
          <CardHeader>
            <CardTitle>Αρχίστε με το Solana Trading</CardTitle>
            <CardDescription>{t("platform.gettingStarted")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium mb-2">1. {t("platform.step1Title")}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t("platform.step1Desc")}
                  </p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium mb-2">2. {t("platform.step2Title")}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t("platform.step2Desc")}
                  </p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium mb-2">3. {t("platform.step3Title")}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t("platform.step3Desc")}
                  </p>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-primary/10 rounded-lg">
                <h3 className="text-lg font-medium mb-2">{t("platform.automationTitle")}</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>{t("platform.benefit1")}</li>
                  <li>{t("platform.benefit2")}</li>
                  <li>{t("platform.benefit3")}</li>
                  <li>{t("platform.benefit4")}</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
