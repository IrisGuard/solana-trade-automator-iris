
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Token } from "@/types/wallet";
import { Activity, TrendingUp, TrendingDown, Clock } from "lucide-react";

interface StatusCardProps {
  botStatus: 'idle' | 'running' | 'paused';
  selectedTokenDetails: Token | undefined;
  selectedTokenPrice: { price: number; priceChange24h: number } | null;
  activeOrders: Array<any>;
}

export function StatusCard({ 
  botStatus,
  selectedTokenDetails,
  selectedTokenPrice,
  activeOrders
}: StatusCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Κατάσταση Bot
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="text-sm font-medium">Κατάσταση</div>
          <div className="flex">
            {botStatus === 'running' ? (
              <Badge className="bg-green-500">Ενεργό</Badge>
            ) : botStatus === 'paused' ? (
              <Badge variant="outline">Σε παύση</Badge>
            ) : (
              <Badge variant="secondary">Ανενεργό</Badge>
            )}
          </div>
        </div>
        
        {selectedTokenDetails && selectedTokenPrice && (
          <>
            <div className="space-y-2">
              <div className="text-sm font-medium">Επιλεγμένο Token</div>
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                  {selectedTokenDetails.logo ? (
                    <img src={selectedTokenDetails.logo} alt={selectedTokenDetails.symbol} className="h-5 w-5 rounded-full" />
                  ) : (
                    <span className="text-xs font-bold">{selectedTokenDetails.symbol.slice(0, 3)}</span>
                  )}
                </div>
                <span className="font-medium">{selectedTokenDetails.symbol}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-medium">Τρέχουσα Τιμή</div>
              <div className="flex items-center">
                <span className="text-xl font-bold">${selectedTokenPrice.price.toFixed(4)}</span>
                <div className="ml-2">
                  {selectedTokenPrice.priceChange24h > 0 ? (
                    <div className="flex items-center text-green-500 text-xs">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +{selectedTokenPrice.priceChange24h.toFixed(2)}%
                    </div>
                  ) : (
                    <div className="flex items-center text-red-500 text-xs">
                      <TrendingDown className="h-3 w-3 mr-1" />
                      {selectedTokenPrice.priceChange24h.toFixed(2)}%
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-medium">Διαθέσιμο</div>
              <div className="font-medium">
                {selectedTokenDetails.amount} {selectedTokenDetails.symbol}
              </div>
            </div>
          </>
        )}
        
        <div className="space-y-2">
          <div className="text-sm font-medium">Ενεργές Εντολές</div>
          {activeOrders.length > 0 ? (
            <div className="space-y-2">
              {activeOrders.map((order, index) => (
                <div key={index} className="text-sm flex justify-between p-2 bg-muted rounded">
                  <span>
                    {order.type === 'stop-loss' 
                      ? 'Stop Loss' 
                      : order.type === 'take-profit' 
                        ? 'Take Profit' 
                        : order.type === 'limit-buy' 
                          ? 'Limit Buy' 
                          : 'Limit Sell'}
                  </span>
                  <span>${order.price.toFixed(4)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              Δεν υπάρχουν ενεργές εντολές
            </div>
          )}
        </div>
        
        {botStatus === 'running' && (
          <div className="space-y-2">
            <div className="text-sm font-medium flex items-center gap-1">
              <Clock className="h-3 w-3" /> Χρόνος Λειτουργίας
            </div>
            <div className="text-sm">00:15:32</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
