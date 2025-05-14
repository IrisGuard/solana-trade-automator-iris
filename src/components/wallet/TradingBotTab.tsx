
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useTradingBot } from '@/hooks/useTradingBot';
import { BotControlPanel } from './BotControlPanel';
import { BotStatusPanel } from './BotStatusPanel';

export function TradingBotTab() {
  const {
    connected,
    botStatus,
    startBot,
    stopBot,
    transactions
  } = useTradingBot();
  
  const botRunning = botStatus === 'running';
  
  const resetBot = () => {
    if (botRunning) {
      stopBot();
      setTimeout(() => {
        startBot();
      }, 1000);
    }
  };
  
  if (!connected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trading Bot</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-8 text-muted-foreground">
            Connect your wallet to use the trading bot
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Tabs defaultValue="control">
      <TabsList className="grid grid-cols-3 mb-6">
        <TabsTrigger value="control">Control</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
      </TabsList>
      
      <TabsContent value="control" className="space-y-4">
        <BotControlPanel
          isRunning={botRunning}
          startBot={startBot}
          stopBot={stopBot}
          resetBot={resetBot}
        />
        
        <BotStatusPanel
          trades={transactions.length}
          profits="+0.23 SOL"
          timeRunning="2h 34m"
          profitPercentage={2.4}
        />
      </TabsContent>
      
      <TabsContent value="settings">
        <Card>
          <CardHeader>
            <CardTitle>Bot Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Settings content will go here...</p>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="history">
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <p>History content will go here...</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
