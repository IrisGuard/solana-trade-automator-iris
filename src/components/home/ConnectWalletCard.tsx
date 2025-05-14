
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useWalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useLanguage } from "@/hooks/use-language";
import { ArrowRight } from "lucide-react";

interface ConnectWalletCardProps {
  isConnecting?: boolean;
  isPhantomInstalled?: boolean;
}

export function ConnectWalletCard({ isConnecting = false, isPhantomInstalled = true }: ConnectWalletCardProps) {
  const { t } = useLanguage();
  const { setVisible } = useWalletMultiButton();
  
  // Handle connect wallet button click
  const handleConnectClick = () => {
    setVisible(true);
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle>{t("platform.welcomeMessage")}</CardTitle>
          <CardDescription>
            {t("platform.welcomeDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-background/80 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Για να ξεκινήσετε:</h3>
            <ul className="space-y-2 list-disc pl-5">
              <li>Συνδέστε το πορτοφόλι Phantom Wallet</li>
              <li>Εξερευνήστε τα διαθέσιμα tokens σας</li>
              <li>Δημιουργήστε το πρώτο σας trading bot</li>
              <li>Ρυθμίστε τις παραμέτρους συναλλαγών</li>
              <li>Παρακολουθήστε την απόδοση σε πραγματικό χρόνο</li>
            </ul>
          </div>
          
          {!isPhantomInstalled && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg text-yellow-600 dark:text-yellow-400">
              <h4 className="font-medium mb-1">Το Phantom Wallet δεν είναι εγκατεστημένο</h4>
              <p className="text-sm">
                Για να χρησιμοποιήσετε την πλατφόρμα μας, χρειάζεστε το Phantom Wallet. 
                <a href="https://phantom.app/" target="_blank" rel="noopener noreferrer" className="font-medium underline ml-1">
                  Εγκαταστήστε το Phantom
                </a>
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            size="lg" 
            onClick={handleConnectClick}
            disabled={isConnecting || !isPhantomInstalled}
          >
            {isConnecting ? "Σύνδεση..." : "Σύνδεση Πορτοφολιού"} 
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("platform.title")}</CardTitle>
          <CardDescription>{t("platform.subtitle")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>{t("platform.description")}</p>
          
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-medium mb-2">{t("platform.howItWorks")}</h3>
            <ul className="space-y-2 list-disc pl-5 text-sm">
              <li>{t("platform.feature1")}</li>
              <li>{t("platform.feature2")}</li>
              <li>{t("platform.feature3")}</li>
              <li>{t("platform.feature4")}</li>
              <li>{t("platform.feature5")}</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
