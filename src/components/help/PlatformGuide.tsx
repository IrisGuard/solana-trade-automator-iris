
import React from "react";
import { ExternalLink } from "lucide-react";
import { useLanguage } from "@/providers/LanguageProvider";

export function PlatformGuide() {
  const { t } = useLanguage();
  
  return (
    <div className="p-4 space-y-6">
      <section className="space-y-2">
        <h3 className="text-lg font-medium">{t("help.platformGuide")}</h3>
        <p className="text-sm text-muted-foreground">
          {t("help.shortGuide")}
        </p>
      </section>
      
      <section className="space-y-2">
        <h4 className="font-medium">{t("help.walletConnection")}</h4>
        <p className="text-sm">
          {t("Connect your Phantom wallet by clicking the 'Connect' button in the top right corner. This will allow you to see your balance, tokens and make transactions.", "Συνδέστε το Phantom πορτοφόλι σας πατώντας το κουμπί \"Connect\" στην επάνω δεξιά γωνία. Αυτό θα σας επιτρέψει να δείτε το υπόλοιπό σας, τα tokens και να πραγματοποιήσετε συναλλαγές.")}
        </p>
      </section>
      
      <section className="space-y-2">
        <h4 className="font-medium">{t("help.tradingBots")}</h4>
        <p className="text-sm">
          {t("Our platform provides two types of bots:", "Η πλατφόρμα μας παρέχει δύο τύπους bots:")}
        </p>
        <ul className="list-disc pl-5 text-sm space-y-1">
          <li><strong>Trading Bot:</strong> {t("Automatic buys and sells with adjustable stop-loss and take-profit", "Αυτόματες αγορές και πωλήσεις με ρυθμιζόμενα stop-loss και take-profit")}</li>
          <li><strong>Maker Bot:</strong> {t("Creates liquidity in the market with automatic buy and sell orders", "Δημιουργία ρευστότητας στην αγορά με αυτόματες εντολές αγοράς και πώλησης")}</li>
        </ul>
      </section>
      
      <section className="space-y-2">
        <h4 className="font-medium">{t("help.apiVaultHelp")}</h4>
        <p className="text-sm">
          {t("In the API Vault section, you can securely store and manage your API keys for various services like Helius, Coingecko, and other platforms.", "Στην ενότητα API Vault μπορείτε να αποθηκεύσετε και να διαχειριστείτε με ασφάλεια τα API κλειδιά σας για διάφορες υπηρεσίες όπως Helius, Coingecko, και άλλες πλατφόρμες.")}
        </p>
      </section>
      
      <section className="space-y-2">
        <h4 className="font-medium">{t("help.usefulLinks")}</h4>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <a 
            href="https://solana.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-primary hover:underline"
          >
            Solana Website <ExternalLink className="h-3 w-3" />
          </a>
          <a 
            href="https://phantom.app" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-primary hover:underline"
          >
            Phantom Wallet <ExternalLink className="h-3 w-3" />
          </a>
          <a 
            href="https://jup.ag" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-primary hover:underline"
          >
            Jupiter Aggregator <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </section>
    </div>
  );
}
