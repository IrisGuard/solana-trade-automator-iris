
import React, { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WalletConnectedContent } from "@/components/home/WalletConnectedContent";
import { WalletDisconnectedContent } from "@/components/home/WalletDisconnectedContent";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Wallet } from "lucide-react";

export default function Home() {
  console.log("Home component initialized");
  
  const { 
    isConnected, 
    walletAddress, 
    solBalance, 
    tokens, 
    isConnecting, 
    tokenPrices, 
    isLoadingTokens, 
    error: connectionError,
    isPhantomInstalled,
    selectTokenForTrading
  } = useWalletConnection();
  
  console.log("WalletConnection hook loaded, connection status:", isConnected);
  
  const displayAddress = walletAddress ? 
    `${walletAddress.substring(0, 4)}...${walletAddress.substring(walletAddress.length - 4)}` : 
    "Δεν έχει συνδεθεί πορτοφόλι";
  
  useEffect(() => {
    console.log("Home page loaded. Connection status:", isConnected ? "Connected" : "Not connected");
  }, [isConnected]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            <div>
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
              solBalance={solBalance}
              tokens={tokens}
              tokenPrices={tokenPrices}
              isLoadingTokens={isLoadingTokens}
              connectionError={connectionError}
              selectTokenForTrading={selectTokenForTrading}
            />
          ) : (
            <WalletDisconnectedContent 
              isConnecting={isConnecting}
              isPhantomInstalled={isPhantomInstalled}
            />
          )}
        </CardContent>
      </Card>
      
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
  );
}
