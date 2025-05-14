
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TradingBotContent } from "@/components/wallet/trading-bot/TradingBotContent";
import { EnhancedTradingBotTab } from "@/components/wallet/trading-bot/EnhancedTradingBotTab";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useTradingBot } from "@/hooks/useTradingBot";
import { useWalletConnection } from "@/hooks/useWalletConnection";

export default function BotControlPage() {
  const [activeTab, setActiveTab] = useState<string>("settings");
  const tradingBotState = useTradingBot();
  const { isConnected } = useWalletConnection();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Trading Bot</h2>
      </div>
      
      {!isConnected ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Παρακαλώ συνδέστε το πορτοφόλι σας για να χρησιμοποιήσετε το Trading Bot
          </AlertDescription>
        </Alert>
      ) : (
        <>
          <div className="grid gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Έλεγχος Trading Bot</CardTitle>
                <CardDescription>
                  Ρυθμίστε και παρακολουθήστε το αυτοματοποιημένο σύστημα συναλλαγών
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TradingBotContent 
                  tradingBotState={tradingBotState}
                  tab={activeTab}
                  setTab={setActiveTab}
                />
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Λειτουργία Αναβαθμισμένου Bot (Beta)</CardTitle>
                <CardDescription>
                  Δοκιμάστε τις νέες λειτουργίες της αναβαθμισμένης έκδοσης του trading bot
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EnhancedTradingBotTab />
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
