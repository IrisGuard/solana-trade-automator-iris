
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ConnectPrompt } from "./maker-bot/ConnectPrompt";

interface MakerBotTabProps {
  isConnected: boolean;
  handleConnectWallet?: () => Promise<void>;
}

export function MakerBotTab({ isConnected, handleConnectWallet }: MakerBotTabProps) {
  // Placeholder function if none is provided
  const connectWallet = handleConnectWallet || (() => Promise.resolve());

  return (
    <TabsContent value="maker-bot">
      <Card>
        <CardHeader>
          <CardTitle>Maker Bot</CardTitle>
          <CardDescription>
            Παρέχετε ρευστότητα και κερδίστε από τα spreads με τον Maker Bot
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isConnected ? (
            <ConnectPrompt handleConnectWallet={connectWallet} size="large" />
          ) : (
            <div className="space-y-4">
              <div className="p-6 border-2 border-dashed rounded-md text-center">
                <h3 className="text-lg font-medium mb-2">Maker Bot - Coming Soon</h3>
                <p className="text-sm text-muted-foreground">
                  Η λειτουργία Maker Bot θα είναι διαθέσιμη σε μια μελλοντική έκδοση. 
                  Μείνετε συντονισμένοι για περισσότερες πληροφορίες!
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
}
