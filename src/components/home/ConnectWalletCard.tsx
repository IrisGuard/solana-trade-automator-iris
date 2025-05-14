
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useLanguage } from "@/hooks/use-language";
import { ArrowRight } from "lucide-react";

interface ConnectWalletCardProps {
  isConnecting?: boolean;
  isPhantomInstalled?: boolean;
}

export function ConnectWalletCard({ isConnecting = false, isPhantomInstalled = true }: ConnectWalletCardProps) {
  const { t } = useLanguage();
  const { setVisible } = useWalletModal();
  
  // Handle connect wallet button click
  const handleConnectClick = () => {
    setVisible(true);
  };

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("platform.welcomeMessage")}</CardTitle>
          <CardDescription>
            {t("platform.welcomeDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">{t("platform.howItWorks")}</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="bg-primary/10 text-primary p-1 rounded-full">✓</span>
                  {t("platform.feature1")}
                </li>
                <li className="flex items-center gap-2">
                  <span className="bg-primary/10 text-primary p-1 rounded-full">✓</span>
                  {t("platform.feature2")}
                </li>
                <li className="flex items-center gap-2">
                  <span className="bg-primary/10 text-primary p-1 rounded-full">✓</span>
                  {t("platform.feature3")}
                </li>
                <li className="flex items-center gap-2">
                  <span className="bg-primary/10 text-primary p-1 rounded-full">✓</span>
                  {t("platform.feature4")}
                </li>
                <li className="flex items-center gap-2">
                  <span className="bg-primary/10 text-primary p-1 rounded-full">✓</span>
                  {t("platform.feature5")}
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={handleConnectClick} 
            disabled={isConnecting || !isPhantomInstalled}
          >
            {!isPhantomInstalled ? (
              "Εγκατάσταση Phantom Wallet"
            ) : isConnecting ? (
              "Σύνδεση..."
            ) : (
              <>
                {t("hero.connectWallet")} <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>{t("platform.gettingStarted")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-2">
                <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">1</div>
                <div>
                  <h4 className="font-medium">{t("platform.step1Title")}</h4>
                  <p className="text-sm text-muted-foreground">{t("platform.step1Desc")}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">2</div>
                <div>
                  <h4 className="font-medium">{t("platform.step2Title")}</h4>
                  <p className="text-sm text-muted-foreground">{t("platform.step2Desc")}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">3</div>
                <div>
                  <h4 className="font-medium">{t("platform.step3Title")}</h4>
                  <p className="text-sm text-muted-foreground">{t("platform.step3Desc")}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
