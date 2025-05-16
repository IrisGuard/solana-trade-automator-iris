
import React, { useState, useEffect } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { ConnectPrompt } from "./maker-bot/ConnectPrompt";
import { BotSettings } from "./maker-bot/BotSettings";
import { PriceBoost } from "./maker-bot/PriceBoost";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, AlertCircle } from "lucide-react";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { toast } from "sonner";
import { botsService } from "@/services/botsService";

export function MakerBotTab() {
  const { 
    isConnected, 
    walletAddress, 
    solBalance, 
    tokens,
    connectWallet
  } = useWalletConnection();

  // Bot configuration state
  const [isSimulation, setIsSimulation] = useState<boolean>(true);
  const [makers, setMakers] = useState<number>(100);
  const [minDelay, setMinDelay] = useState<number>(5);
  const [maxDelay, setMaxDelay] = useState<number>(15);
  const [tokenAmount, setTokenAmount] = useState<number>(100);
  const [solAmount, setSolAmount] = useState<number>(0.5);
  const [botActive, setBotActive] = useState<boolean>(false);
  const [priceBoost, setPriceBoost] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Toggle simulation mode
  const toggleSimulation = () => {
    setIsSimulation(!isSimulation);
  };

  // Start the bot
  const handleStartBot = () => {
    if (solBalance < solAmount) {
      toast.error("Ανεπαρκές υπόλοιπο SOL", {
        description: `Χρειάζεστε τουλάχιστον ${solAmount} SOL για να εκκινήσετε το bot`
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setBotActive(true);
      setIsLoading(false);
      toast.success("Το Maker Bot ξεκίνησε επιτυχώς", {
        description: isSimulation ? "Λειτουργεί σε mode προσομοίωσης" : "Εκτελούνται πραγματικές συναλλαγές"
      });
    }, 1500);
  };

  // Stop the bot
  const handleStopBot = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setBotActive(false);
      setIsLoading(false);
      toast.success("Το Maker Bot σταμάτησε επιτυχώς");
    }, 1000);
  };

  // Handle price boost
  const handleBoostPrice = () => {
    if (priceBoost <= 0) {
      toast.error("Παρακαλώ επιλέξτε ένα θετικό ποσοστό αύξησης τιμής");
      return;
    }

    setIsLoading(true);
    
    // Simulate price boost API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success(`Η τιμή αυξήθηκε κατά ${priceBoost}%`, {
        description: "Η διαδικασία αύξησης της τιμής έχει ξεκινήσει και θα ολοκληρωθεί σύντομα"
      });
    }, 2000);
  };

  // Default connectWallet function
  const handleConnectWallet = async () => {
    await connectWallet();
  };

  return (
    <TabsContent value="maker-bot">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Maker Bot</CardTitle>
            <CardDescription>
              Παρέχετε ρευστότητα και κερδίστε από τα spreads με τον Maker Bot
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isConnected ? (
              <ConnectPrompt handleConnectWallet={handleConnectWallet} size="large" />
            ) : error ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <BotSettings 
                  isSimulation={isSimulation}
                  makers={makers}
                  minDelay={minDelay}
                  maxDelay={maxDelay}
                  tokenAmount={tokenAmount}
                  solAmount={solAmount}
                  botActive={botActive}
                  toggleSimulation={toggleSimulation}
                  setMakers={setMakers}
                  setMinDelay={setMinDelay}
                  setMaxDelay={setMaxDelay}
                  setTokenAmount={setTokenAmount}
                  setSolAmount={setSolAmount}
                  handleStartBot={handleStartBot}
                  handleStopBot={handleStopBot}
                />
                
                <PriceBoost 
                  isConnected={isConnected}
                  priceBoost={priceBoost}
                  botActive={botActive}
                  setPriceBoost={setPriceBoost}
                  handleBoostPrice={handleBoostPrice}
                />
              </div>
            )}
          </CardContent>
          {isConnected && (
            <CardFooter className="bg-muted/50 border-t">
              <div className="w-full text-sm text-muted-foreground">
                <p>
                  Ο Maker Bot δημιουργεί τεχνητή ρευστότητα και όγκο συναλλαγών για τα tokens σας, αυξάνοντας την 
                  ορατότητά τους και βοηθώντας στην αύξηση της τιμής. Με την επιλογή προσομοίωσης, μπορείτε να 
                  δοκιμάσετε τη λειτουργία χωρίς πραγματικές συναλλαγές.
                </p>
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
    </TabsContent>
  );
}
