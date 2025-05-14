
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

interface MakerBotTabProps {
  isConnected: boolean;
  isSimulation?: boolean;
  makers?: number;
  minDelay?: number;
  maxDelay?: number;
  priceBoost?: number;
  botActive?: boolean;
  tokenAmount?: number;
  solAmount?: number;
  handleConnectWallet?: () => void;
  toggleSimulation?: () => void;
  setMakers?: (value: number) => void;
  setMinDelay?: (value: number) => void;
  setMaxDelay?: (value: number) => void;
  setPriceBoost?: (value: number) => void;
  setTokenAmount?: (value: number) => void;
  setSolAmount?: (value: number) => void;
  handleStartBot?: () => void;
  handleStopBot?: () => void;
  handleBoostPrice?: () => void;
}

export function MakerBotTab({
  isConnected,
  isSimulation = true,
  makers = 100,
  minDelay = 5,
  maxDelay = 10,
  priceBoost = 0,
  botActive = false,
  tokenAmount = 100000,
  solAmount = 0.5,
  handleConnectWallet = () => {},
  toggleSimulation = () => {},
  setMakers = () => {},
  setMinDelay = () => {},
  setMaxDelay = () => {},
  setPriceBoost = () => {},
  setTokenAmount = () => {},
  setSolAmount = () => {},
  handleStartBot = () => {},
  handleStopBot = () => {},
  handleBoostPrice = () => {}
}: MakerBotTabProps) {
  return (
    <TabsContent value="maker-bot">
      {!isConnected ? (
        <Card>
          <CardHeader>
            <CardTitle>Market Maker Bot</CardTitle>
            <CardDescription>Γίνετε market maker για το token σας</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Παρακαλώ συνδέστε το πορτοφόλι σας για να χρησιμοποιήσετε το Maker Bot
              </AlertDescription>
            </Alert>
            <div className="mt-4 flex justify-center">
              <Button onClick={handleConnectWallet}>Σύνδεση Πορτοφολιού</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Market Maker Bot</CardTitle>
            <CardDescription>
              Δημιουργήστε αυτόματα προσφορές και ζητήσεις για να αυξήσετε τη ρευστότητα
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Ρυθμίσεις Bot</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Simulation Mode</span>
                        <Button 
                          variant={isSimulation ? "default" : "outline"}
                          onClick={toggleSimulation}
                        >
                          {isSimulation ? "Ενεργό" : "Ανενεργό"}
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Αριθμός συναλλαγών: {makers}</p>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setMakers(Math.max(10, makers - 10))}
                          >
                            -
                          </Button>
                          <div className="flex-1 bg-secondary h-2 rounded-full overflow-hidden">
                            <div 
                              className="bg-primary h-full" 
                              style={{ width: `${(makers / 200) * 100}%` }}
                            />
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setMakers(Math.min(200, makers + 10))}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="flex flex-col space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Κατάσταση</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Κατάσταση Bot:</span>
                        <span className={botActive ? "text-green-500" : "text-red-500"}>
                          {botActive ? "Ενεργό" : "Ανενεργό"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Τύπος:</span>
                        <span>{isSimulation ? "Προσομοίωση" : "Πραγματικό"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Συναλλαγές:</span>
                        <span>{makers}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex gap-2">
                      {botActive ? (
                        <Button 
                          variant="destructive" 
                          className="w-full"
                          onClick={handleStopBot}
                        >
                          Διακοπή Bot
                        </Button>
                      ) : (
                        <Button 
                          className="w-full"
                          onClick={handleStartBot}
                        >
                          Έναρξη Bot
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </TabsContent>
  );
}
