
import React from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card";
import { 
  Check, 
  Clock, 
  Loader2, 
  TrendingDown, 
  TrendingUp,
  AlertTriangle
} from "lucide-react";

interface StatusCardProps {
  botStatus: 'idle' | 'running' | 'paused';
  selectedTokenDetails: { 
    symbol: string;
    amount?: number; 
  } | null;
  selectedTokenPrice: { 
    price: number;
    priceChange24h: number;
  } | null;
  activeOrders: Array<{
    id: string;
    type: string;
    price: number;
    tokenAddress: string;
  }>;
}

export function StatusCard({ 
  botStatus, 
  selectedTokenDetails, 
  selectedTokenPrice, 
  activeOrders
}: StatusCardProps) {
  // Βρίσκουμε τις τιμές stop loss και take profit αν υπάρχουν
  const stopLossOrder = activeOrders.find(order => order.type === 'stop_loss');
  const takeProfitOrder = activeOrders.find(order => order.type === 'take_profit');

  // Υπολογισμός ποσοστών για stop loss και take profit
  let stopLossPercent = 0;
  let takeProfitPercent = 0;
  
  if (selectedTokenPrice?.price && stopLossOrder) {
    stopLossPercent = ((selectedTokenPrice.price - stopLossOrder.price) / selectedTokenPrice.price) * 100;
  }
  
  if (selectedTokenPrice?.price && takeProfitOrder) {
    takeProfitPercent = ((takeProfitOrder.price - selectedTokenPrice.price) / selectedTokenPrice.price) * 100;
  }

  // Render διαφορετικό περιεχόμενο ανάλογα με την κατάσταση του bot
  const renderStatusContent = () => {
    if (botStatus === 'idle') {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <Clock className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-2" />
            <p className="text-lg font-medium">Το bot είναι ανενεργό</p>
            <p className="text-sm text-muted-foreground">
              Ρυθμίστε τις παραμέτρους και πατήστε "Εκκίνηση Bot" για να ξεκινήσει
            </p>
          </div>
        </div>
      );
    }
    
    if (!selectedTokenDetails || !selectedTokenPrice) {
      return (
        <div className="flex items-center justify-center h-full">
          <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
          <p>Επιλέξτε token πρώτα</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {/* Current Price & Change */}
        <div className="bg-muted rounded-md p-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm">Τιμή {selectedTokenDetails.symbol}</span>
            <span className="text-lg font-bold">${selectedTokenPrice.price.toFixed(4)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">24ώρη αλλαγή</span>
            <div className={`flex items-center ${selectedTokenPrice.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {selectedTokenPrice.priceChange24h >= 0 ? 
                <TrendingUp className="h-3 w-3 mr-1" /> : 
                <TrendingDown className="h-3 w-3 mr-1" />
              }
              <span className="text-sm font-medium">
                {selectedTokenPrice.priceChange24h.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
        
        {/* Stop Loss */}
        {stopLossOrder && (
          <div className="bg-red-50 dark:bg-red-900/20 rounded-md p-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-red-700 dark:text-red-300">Stop Loss</span>
              <span className="text-red-700 dark:text-red-300 font-bold">${stopLossOrder.price.toFixed(4)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-red-600/70 dark:text-red-300/70">Απόσταση από τιμή</span>
              <span className="text-sm font-medium text-red-600 dark:text-red-300">{Math.abs(stopLossPercent).toFixed(2)}%</span>
            </div>
          </div>
        )}
        
        {/* Take Profit */}
        {takeProfitOrder && (
          <div className="bg-green-50 dark:bg-green-900/20 rounded-md p-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-green-700 dark:text-green-300">Take Profit</span>
              <span className="text-green-700 dark:text-green-300 font-bold">${takeProfitOrder.price.toFixed(4)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-green-600/70 dark:text-green-300/70">Στόχος κέρδους</span>
              <span className="text-sm font-medium text-green-600 dark:text-green-300">{takeProfitPercent.toFixed(2)}%</span>
            </div>
          </div>
        )}
        
        {/* Active Orders Status */}
        <div className="mt-4">
          <div className="flex items-center mb-3">
            <div className={`h-2 w-2 rounded-full mr-2 ${botStatus === 'running' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
            <span className="text-sm font-medium">
              {botStatus === 'running' ? 'Bot Ενεργό' : 'Bot σε Παύση'}
            </span>
          </div>
          
          <div className="text-xs text-muted-foreground">
            {activeOrders.length === 0 ? (
              <span>Δεν υπάρχουν ενεργές εντολές</span>
            ) : (
              <span>{activeOrders.length} ενεργές εντολές</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Κατάσταση Bot</CardTitle>
        <CardDescription>
          {botStatus === 'running' ? 
            'Το bot είναι ενεργό και παρακολουθεί την αγορά' : 
            'Το bot είναι ανενεργό'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderStatusContent()}
      </CardContent>
    </Card>
  );
}
