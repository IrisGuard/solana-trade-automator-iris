
import React, { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WalletConnectedContent } from "@/components/home/WalletConnectedContent";
import { WalletDisconnectedContent } from "@/components/home/WalletDisconnectedContent";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Wallet } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

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
  
  const { t } = useLanguage();
  
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
              <CardTitle>{t("general.welcome", "Καλώς ήρθατε στο Solana Trade Automator")}</CardTitle>
              <CardDescription>
                {t("general.description", "Αυτοματοποιήστε τις συναλλαγές σας και διαχειριστείτε τα περιουσιακά σας στοιχεία με ασφάλεια")}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {connectionError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {t("general.connectionError", "Σφάλμα σύνδεσης")}: {connectionError}. {t("general.tryAgainLater", "Παρακαλώ δοκιμάστε ξανά αργότερα")}.
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
          <CardTitle>{t("general.getStarted", "Αρχίστε με το Solana Trading")}</CardTitle>
          <CardDescription>{t("general.stepsToStart", "Βήματα για να ξεκινήσετε με την πλατφόρμα")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-medium mb-2">1. {t("wallet.connectWallet", "Σύνδεση Πορτοφολιού")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("general.connectPhantomDesc", "Συνδέστε το Phantom Wallet σας για να αποκτήσετε πρόσβαση σε όλες τις λειτουργίες της πλατφόρμας.")}
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-medium mb-2">2. {t("makerBot.botSettings", "Ρύθμιση Bot")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("makerBot.configureDesc", "Διαμορφώστε τις παραμέτρους του trading bot σας σύμφωνα με τη στρατηγική σας.")}
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-medium mb-2">3. {t("general.monitoring", "Παρακολούθηση")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("general.monitoringDesc", "Παρακολουθήστε τις συναλλαγές και την απόδοση από το dashboard της πλατφόρμας.")}
                </p>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-primary/10 rounded-lg">
              <h3 className="text-lg font-medium mb-2">{t("general.automationBenefits", "Πλεονεκτήματα της Αυτοματοποίησης")}</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>{t("general.benefit1", "24/7 παρακολούθηση της αγοράς χωρίς ανθρώπινη παρέμβαση")}</li>
                <li>{t("general.benefit2", "Αυτόματη αναγνώριση ευκαιριών με βάση προκαθορισμένες παραμέτρους")}</li>
                <li>{t("general.benefit3", "Γρήγορη εκτέλεση συναλλαγών όταν εντοπίζονται ευκαιρίες")}</li>
                <li>{t("general.benefit4", "Λεπτομερείς αναφορές και αναλύσεις για τη βελτιστοποίηση της στρατηγικής σας")}</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
