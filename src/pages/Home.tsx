
import React, { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WalletConnectedContent } from "@/components/home/WalletConnectedContent";
import { ConnectWalletCard } from "@/components/home/ConnectWalletCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Wallet } from "lucide-react";
import { usePhantomConnection } from "@/hooks/usePhantomConnection";
import { TokenBot } from "@/components/wallet/TokenBot";

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
  
  console.log("WalletConnection hook loaded, connection status:", isConnected);
  
  const displayAddress = walletAddress ? 
    `${walletAddress.substring(0, 4)}...${walletAddress.substring(walletAddress.length - 4)}` : 
    "Δεν έχει συνδεθεί πορτοφόλι";
  
  // Convert complex token prices to simple format for compatibility
  const tokenPrices: Record<string, number> = {};
  tokens.forEach(token => {
    tokenPrices[token.address] = Math.random() * 10; // Mock prices for demo
  });
  
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
          onConnectWallet={connectWallet}
        />
        
        <Card>
          <CardHeader>
            <CardTitle>Αρχίστε με το Solana Trading</CardTitle>
            <CardDescription>Βήματα για να ξεκινήσετε με την πλατφόρμα</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium mb-2">1. Σύνδεση Πορτοφολιού</h3>
                  <p className="text-sm text-muted-foreground">
                    Συνδέστε το Phantom Wallet σας για να αποκτήσετε πρόσβαση σε όλες τις λειτουργίες της πλατφόρμας.
                  </p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium mb-2">2. Ρύθμιση Bot</h3>
                  <p className="text-sm text-muted-foreground">
                    Διαμορφώστε τις παραμέτρους του trading bot σας σύμφωνα με τη στρατηγική σας.
                  </p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium mb-2">3. Παρακολούθηση</h3>
                  <p className="text-sm text-muted-foreground">
                    Παρακολουθήστε τις συναλλαγές και την απόδοση από το dashboard της πλατφόρμας.
                  </p>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-primary/10 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Πλεονεκτήματα της Αυτοματοποίησης</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>24/7 παρακολούθηση της αγοράς χωρίς ανθρώπινη παρέμβαση</li>
                  <li>Αυτόματη αναγνώριση ευκαιριών με βάση προκαθορισμένες παραμέτρους</li>
                  <li>Γρήγορη εκτέλεση συναλλαγών όταν εντοπίζονται ευκαιρίες</li>
                  <li>Λεπτομερείς αναφορές και αναλύσεις για τη βελτιστοποίηση της στρατηγικής σας</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
