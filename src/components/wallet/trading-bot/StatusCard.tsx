
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Check } from "lucide-react";

interface StatusCardProps {
  botStatus: 'running' | 'stopped';
  selectedTokenDetails: { amount: number; symbol: string } | null;
  selectedTokenPrice: { price: number; priceChange24h: number } | null;
  activeOrders: any[];
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
        <CardTitle>Κατάσταση</CardTitle>
        <CardDescription>Πληροφορίες για το trading bot</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Κατάσταση:</span>
            <span className={`text-sm font-medium ${
              botStatus === 'running' ? 'text-green-600' : 'text-amber-600'
            }`}>
              {botStatus === 'running' ? 'Ενεργό' : 'Ανενεργό'}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Επιλεγμένο token:</span>
            <span className="text-sm font-medium">
              {selectedTokenDetails ? `${selectedTokenDetails.symbol}` : '-'}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Τρέχουσα τιμή:</span>
            <span className="text-sm font-medium">
              {selectedTokenPrice ? `$${selectedTokenPrice.price.toFixed(4)}` : '-'}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">24ωρη μεταβολή:</span>
            <span className={`text-sm font-medium ${
              selectedTokenPrice && selectedTokenPrice.priceChange24h >= 0 
                ? 'text-green-600' 
                : 'text-red-600'
            }`}>
              {selectedTokenPrice 
                ? `${selectedTokenPrice.priceChange24h >= 0 ? '+' : ''}${selectedTokenPrice.priceChange24h.toFixed(2)}%` 
                : '-'}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Ενεργές εντολές:</span>
            <span className="text-sm font-medium">{activeOrders.length}</span>
          </div>
        </div>
        
        {botStatus === 'running' && (
          <Alert variant="default" className="bg-green-50 border-green-200">
            <Check className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Το trading bot λειτουργεί κανονικά και παρακολουθεί τις τιμές.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
