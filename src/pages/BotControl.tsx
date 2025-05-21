
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TradingBotContent } from "@/components/wallet/trading-bot/TradingBotContent";
import { EnhancedTradingBotTab } from "@/components/wallet/trading-bot/EnhancedTradingBotTab";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useTradingBot } from "@/hooks/useTradingBot";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { PageHeader } from "@/components/layout/PageHeader";
import { AppNavigation } from "@/components/navigation/AppNavigation";
import { ConnectivityStatus } from "@/components/wallet/trading-bot/components/ConnectivityStatus";
import { GradientCard } from "@/components/ui/gradient-card";
import { HeliusSyncComponent } from "@/components/wallet/HeliusSyncComponent";

export default function BotControlPage() {
  const [activeTab, setActiveTab] = useState<string>("settings");
  const { isConnected, refreshWalletData, walletAddress, tokens } = useWalletConnection();
  const tradingBotState = useTradingBot(tokens);

  // Handle HeliusSync callback
  const handleHeliusSync = () => {
    if (isConnected && walletAddress) {
      refreshWalletData();
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Trading Bot"
        description="Αυτοματοποιημένη διαχείριση συναλλαγών στο Solana blockchain"
        breadcrumbs={[{ label: "Trading Bot" }]}
        variant="green"
        actions={
          isConnected && <HeliusSyncComponent onSync={handleHeliusSync} />
        }
      />
      
      {/* Quick Navigation */}
      <div className="mb-6">
        <AppNavigation variant="colorful" />
      </div>
      
      <ConnectivityStatus connected={isConnected} />
      
      {isConnected && (
        <>
          <div className="grid gap-6">
            <GradientCard 
              variant="green"
              header={
                <>
                  <CardTitle>Έλεγχος Trading Bot</CardTitle>
                  <CardDescription>
                    Ρυθμίστε και παρακολουθήστε το αυτοματοποιημένο σύστημα συναλλαγών
                  </CardDescription>
                </>
              }
            >
              <TradingBotContent 
                tradingBotState={tradingBotState}
                tab={activeTab}
                setTab={setActiveTab}
              />
            </GradientCard>
          </div>
          
          <div className="grid gap-6">
            <GradientCard 
              variant="purple"
              header={
                <>
                  <CardTitle>Λειτουργία Αναβαθμισμένου Bot (Beta)</CardTitle>
                  <CardDescription>
                    Δοκιμάστε τις νέες λειτουργίες της αναβαθμισμένης έκδοσης του trading bot
                  </CardDescription>
                </>
              }
            >
              <EnhancedTradingBotTab />
            </GradientCard>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <GradientCard variant="blue">
              <div className="p-4 text-center">
                <div className="bg-blue-500/10 p-3 rounded-full inline-flex mb-4">
                  <svg className="h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5-1.5m-.5 1.5h-9.5m0-1.5.5 1.5" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Παρακολούθηση Αγοράς</h3>
                <p className="text-muted-foreground">Ανάλυση τάσεων και παρακολούθηση τιμών σε πραγματικό χρόνο.</p>
              </div>
            </GradientCard>
            
            <GradientCard variant="pink">
              <div className="p-4 text-center">
                <div className="bg-pink-500/10 p-3 rounded-full inline-flex mb-4">
                  <svg className="h-8 w-8 text-pink-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Αυτόματη Εκτέλεση</h3>
                <p className="text-muted-foreground">Εκτέλεση συναλλαγών βάσει προκαθορισμένων στρατηγικών.</p>
              </div>
            </GradientCard>
            
            <GradientCard variant="amber">
              <div className="p-4 text-center">
                <div className="bg-amber-500/10 p-3 rounded-full inline-flex mb-4">
                  <svg className="h-8 w-8 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m6.75 7.5 3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Price Boost</h3>
                <p className="text-muted-foreground">Αλγόριθμος υποστήριξης τιμών για προστασία των επενδύσεών σας.</p>
              </div>
            </GradientCard>
          </div>
        </>
      )}
    </div>
  );
}
