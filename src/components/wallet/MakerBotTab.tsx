
import React, { useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Bot, Loader2, RefreshCw } from "lucide-react";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { PriceBoost } from "./maker-bot/PriceBoost";
import { makerBotService, MakerBotConfig, BoostConfig } from "@/services/bot/makerBotService";
import { toast } from "sonner";

interface MakerBotTabProps {
  isConnected: boolean;
}

export function MakerBotTab({ isConnected }: MakerBotTabProps) {
  const { walletAddress, tokens } = useWalletConnection();
  const [botConfig, setBotConfig] = useState<MakerBotConfig>({
    baseToken: null,
    quoteToken: null,
    spreadPercentage: 2,
    orderQuantity: 100,
    rebalanceThreshold: 5,
    isSimulation: true,
    makers: 5,
    minDelay: 10,
    maxDelay: 30,
    tokenAmount: 100,
    solAmount: 0.1
  });
  const [selectedToken, setSelectedToken] = useState<string | undefined>(undefined);
  const [priceBoost, setPriceBoost] = useState(5);
  const [isBotRunning, setIsBotRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfigChange = (field: keyof MakerBotConfig, value: any) => {
    setBotConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleStartBot = async () => {
    if (!walletAddress || !isConnected) return;
    
    setIsLoading(true);
    
    try {
      // Update config with selected token
      const configWithToken: MakerBotConfig = {
        ...botConfig,
        selectedToken
      };
      
      const success = await makerBotService.startBot(walletAddress, configWithToken);
      
      if (success) {
        toast.success("Το Maker Bot ξεκίνησε με επιτυχία");
        setIsBotRunning(true);
      } else {
        toast.error("Πρόβλημα στην εκκίνηση του Maker Bot");
      }
    } catch (error) {
      console.error("Error starting maker bot:", error);
      toast.error("Σφάλμα", { 
        description: error instanceof Error ? error.message : "Πρόβλημα στην εκκίνηση του maker bot"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopBot = async () => {
    if (!walletAddress) return;
    
    setIsLoading(true);
    
    try {
      const success = await makerBotService.stopBot(walletAddress);
      
      if (success) {
        toast.success("Το Maker Bot σταμάτησε");
        setIsBotRunning(false);
      } else {
        toast.error("Πρόβλημα στη διακοπή του Maker Bot");
      }
    } catch (error) {
      console.error("Error stopping maker bot:", error);
      toast.error("Σφάλμα", { 
        description: error instanceof Error ? error.message : "Πρόβλημα στη διακοπή του maker bot"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBoostPrice = async () => {
    if (!walletAddress || !selectedToken) {
      toast.error("Παρακαλώ επιλέξτε ένα token");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const boostConfig: BoostConfig = {
        boostPercentage: priceBoost,
        duration: 10, // 10 minutes
        gradual: true
      };
      
      const success = await makerBotService.boostPrice(walletAddress, selectedToken, boostConfig);
      
      if (success) {
        toast.success(`Η τιμή του token αυξάνεται κατά ${priceBoost}%`);
      } else {
        toast.error("Πρόβλημα στην αύξηση τιμής");
      }
    } catch (error) {
      console.error("Error boosting price:", error);
      toast.error("Σφάλμα", { 
        description: error instanceof Error ? error.message : "Πρόβλημα στην αύξηση τιμής"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TabsContent value="maker-bot">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ρυθμίσεις Maker Bot</CardTitle>
            <CardDescription>
              Παραμετροποιήστε το maker bot για την αγορά και πώληση tokens
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!isConnected ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Bot className="h-12 w-12 mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Συνδέστε το wallet σας</h3>
                <p className="text-muted-foreground mb-4">
                  Για να χρησιμοποιήσετε το Maker Bot πρέπει πρώτα να συνδέσετε το wallet σας
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="token-select">Επιλογή Token</Label>
                  <select
                    id="token-select"
                    className="w-full p-2 border rounded-md"
                    value={selectedToken || ""}
                    onChange={(e) => setSelectedToken(e.target.value || undefined)}
                    disabled={isBotRunning || isLoading}
                  >
                    <option value="">Επιλέξτε Token</option>
                    {tokens.map((token) => (
                      <option key={token.address} value={token.address}>
                        {token.symbol} - {token.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="makers">Makers: {botConfig.makers}</Label>
                  </div>
                  <Slider
                    id="makers"
                    min={1}
                    max={20}
                    step={1}
                    value={[botConfig.makers]}
                    onValueChange={(values) => handleConfigChange("makers", values[0])}
                    disabled={isBotRunning || isLoading}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="min-delay">Min Delay (s): {botConfig.minDelay}</Label>
                    <Slider
                      id="min-delay"
                      min={1}
                      max={60}
                      step={1}
                      value={[botConfig.minDelay]}
                      onValueChange={(values) => handleConfigChange("minDelay", values[0])}
                      disabled={isBotRunning || isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-delay">Max Delay (s): {botConfig.maxDelay}</Label>
                    <Slider
                      id="max-delay"
                      min={1}
                      max={120}
                      step={1}
                      value={[botConfig.maxDelay]}
                      onValueChange={(values) => handleConfigChange("maxDelay", values[0])}
                      disabled={isBotRunning || isLoading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="token-amount">Token Amount</Label>
                    <Input
                      id="token-amount"
                      type="number"
                      value={botConfig.tokenAmount}
                      onChange={(e) => handleConfigChange("tokenAmount", Number(e.target.value))}
                      disabled={isBotRunning || isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sol-amount">SOL Amount</Label>
                    <Input
                      id="sol-amount"
                      type="number"
                      value={botConfig.solAmount}
                      onChange={(e) => handleConfigChange("solAmount", Number(e.target.value))}
                      disabled={isBotRunning || isLoading}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="simulation"
                    checked={botConfig.isSimulation}
                    onCheckedChange={(checked) => handleConfigChange("isSimulation", checked)}
                    disabled={isBotRunning || isLoading}
                  />
                  <Label htmlFor="simulation">Simulation Mode</Label>
                </div>

                <div>
                  <Button
                    className="w-full"
                    onClick={isBotRunning ? handleStopBot : handleStartBot}
                    disabled={!selectedToken || isLoading}
                    variant={isBotRunning ? "destructive" : "default"}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Επεξεργασία...
                      </>
                    ) : isBotRunning ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Διακοπή Bot
                      </>
                    ) : (
                      <>
                        <Bot className="mr-2 h-4 w-4" />
                        Εκκίνηση Bot
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <PriceBoost
          isConnected={isConnected}
          priceBoost={priceBoost}
          botActive={isBotRunning}
          setPriceBoost={setPriceBoost}
          handleBoostPrice={handleBoostPrice}
        />
      </div>
    </TabsContent>
  );
}
