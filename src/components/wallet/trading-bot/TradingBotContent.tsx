
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MonitorTab } from "./MonitorTab";
import { OrdersTab } from "./OrdersTab";
import { HistoryTab } from "./HistoryTab";
import { TradingBotHook } from "@/hooks/trading-bot/types";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface TradingBotContentProps {
  tradingBotState: TradingBotHook;
  tab: string;
  setTab: (tab: string) => void;
}

export function TradingBotContent({ tradingBotState, tab, setTab }: TradingBotContentProps) {
  const { 
    config, 
    updateConfig, 
    startBot, 
    stopBot, 
    selectToken,
    isLoading,
    botStatus,
    tokens,
    connected,
    activeOrders,
    selectedTokenPrice,
    selectedTokenDetails
  } = tradingBotState;

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (botStatus === 'running') {
      stopBot();
    } else {
      startBot();
    }
  };

  // Function to render proper tab content
  const renderTabContent = () => {
    switch (tab) {
      case "monitor":
        return (
          <MonitorTab
            botStatus={botStatus}
            selectedTokenDetails={selectedTokenDetails}
            selectedTokenPrice={selectedTokenPrice}
            activeOrders={activeOrders}
          />
        );
      case "orders":
        return <OrdersTab orders={activeOrders} />;
      case "history":
        return <HistoryTab />;
      case "settings":
      default:
        return (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                {/* Token Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Token</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={config.selectedToken || ''}
                    onChange={(e) => selectToken(e.target.value || null)}
                    disabled={isLoading || botStatus === 'running'}
                  >
                    <option value="">Επιλέξτε Token</option>
                    {tokens.map((token) => (
                      <option key={token.address} value={token.address}>
                        {token.symbol} - {token.name} ({token.amount})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Strategy Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Στρατηγική</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={config.strategy}
                    onChange={(e) => updateConfig({ strategy: e.target.value as any })}
                    disabled={isLoading || botStatus === 'running'}
                  >
                    <option value="simple">Simple - Απλή στρατηγική</option>
                    <option value="advanced">Advanced - Προηγμένη στρατηγική</option>
                    <option value="dca">DCA - Dollar-cost Averaging</option>
                    <option value="grid">Grid - Πλέγμα εντολών</option>
                    <option value="momentum">Momentum - Ανίχνευση τάσης</option>
                  </select>
                </div>
              </div>

              <div className="space-y-6">
                {/* Trade Amount */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ποσό Συναλλαγής: {config.tradeAmount}</label>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={config.tradeAmount}
                    onChange={(e) => updateConfig({ tradeAmount: Number(e.target.value) })}
                    disabled={isLoading || botStatus === 'running'}
                    className="w-full"
                  />
                </div>

                {/* Stop Loss */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Stop Loss (%): {config.stopLoss}%</label>
                  <input
                    type="range"
                    min="0.5"
                    max="20"
                    step="0.5"
                    value={config.stopLoss}
                    onChange={(e) => updateConfig({ stopLoss: Number(e.target.value) })}
                    disabled={isLoading || botStatus === 'running'}
                    className="w-full"
                  />
                </div>

                {/* Take Profit */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Take Profit (%): {config.takeProfit}%</label>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    step="1"
                    value={config.takeProfit}
                    onChange={(e) => updateConfig({ takeProfit: Number(e.target.value) })}
                    disabled={isLoading || botStatus === 'running'}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button 
                type="submit" 
                disabled={isLoading || !config.selectedToken} 
                variant={botStatus === 'running' ? "destructive" : "default"}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Επεξεργασία...</span>
                  </>
                ) : (
                  <span>{botStatus === 'running' ? 'Διακοπή Bot' : 'Εκκίνηση Bot'}</span>
                )}
              </Button>
            </div>
          </form>
        );
    }
  };

  if (!connected) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Παρακαλώ συνδέστε το πορτοφόλι σας για να χρησιμοποιήσετε το Trading Bot
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={tab} onValueChange={setTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="settings">Ρυθμίσεις</TabsTrigger>
          <TabsTrigger value="monitor">Παρακολούθηση</TabsTrigger>
          <TabsTrigger value="orders">Εντολές</TabsTrigger>
          <TabsTrigger value="history">Ιστορικό</TabsTrigger>
        </TabsList>

        <Card>
          <CardHeader>
            <CardTitle>
              {tab === "settings" && "Ρυθμίσεις Trading Bot"}
              {tab === "monitor" && "Παρακολούθηση Bot"}
              {tab === "orders" && "Ενεργές Εντολές"}
              {tab === "history" && "Ιστορικό Συναλλαγών"}
            </CardTitle>
            <CardDescription>
              {tab === "settings" && "Διαμορφώστε τις παραμέτρους του trading bot"}
              {tab === "monitor" && "Παρακολουθήστε την απόδοση του bot σε πραγματικό χρόνο"}
              {tab === "orders" && "Δείτε τις τρέχουσες εντολές που έχουν τοποθετηθεί από το bot"}
              {tab === "history" && "Δείτε το ιστορικό συναλλαγών που έχουν πραγματοποιηθεί από το bot"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderTabContent()}
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
}
