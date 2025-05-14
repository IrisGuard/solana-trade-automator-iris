
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, ArrowDownIcon, ArrowUpIcon, Loader2 } from "lucide-react";
import { ActiveOrder } from "@/hooks/trading-bot/types";
import { Token } from "@/types/wallet";

interface MonitorTabProps {
  botStatus: string;
  selectedTokenDetails?: Token;
  selectedTokenPrice: any;
  activeOrders: ActiveOrder[];
}

export function MonitorTab({
  botStatus,
  selectedTokenDetails,
  selectedTokenPrice,
  activeOrders
}: MonitorTabProps) {
  const formatPrice = (price: number) => {
    return price?.toFixed(4) || "N/A";
  };

  const formatChange = (change: number) => {
    if (!change && change !== 0) return "N/A";
    const isPositive = change >= 0;
    return (
      <span className={`flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {isPositive ? <ArrowUpIcon className="h-3 w-3 mr-1" /> : <ArrowDownIcon className="h-3 w-3 mr-1" />}
        {Math.abs(change).toFixed(2)}%
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Κατάσταση Bot</CardTitle>
            <StatusBadge status={botStatus} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Token</p>
              <p className="font-medium">{selectedTokenDetails?.symbol || "Δεν έχει επιλεγεί"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Τρέχουσα Τιμή</p>
              <p className="font-medium">${formatPrice(selectedTokenPrice?.currentPrice)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Αλλαγή 24h</p>
              <p className="font-medium">
                {selectedTokenPrice ? formatChange(selectedTokenPrice.priceChange24h) : "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Τελευταία Ενημέρωση</p>
              <p className="font-medium">
                {selectedTokenPrice?.lastUpdated
                  ? new Date(selectedTokenPrice.lastUpdated).toLocaleTimeString()
                  : "N/A"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Ενεργές Εντολές</CardTitle>
        </CardHeader>
        <CardContent>
          {activeOrders.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              Δεν υπάρχουν ενεργές εντολές αυτή τη στιγμή
            </div>
          ) : (
            <div className="space-y-4">
              {activeOrders.map((order) => (
                <div key={order.id} className="border rounded-md p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <OrderTypeBadge type={order.type} />
                      <span className="ml-2 font-medium">{order.token}</span>
                    </div>
                    <Badge variant={order.status === 'pending' ? 'outline' : 'default'}>
                      {order.status === 'pending' ? 'Εκκρεμεί' : 'Εκτελέστηκε'}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Τιμή:</span> ${order.price}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Ποσότητα:</span> {order.amount}
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Ημερομηνία:</span> {new Date(order.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Στατιστικά Bot</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Συναλλαγές Σήμερα</p>
              <p className="font-medium">0</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Συνολικές Συναλλαγές</p>
              <p className="font-medium">0</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Κέρδος/Ζημιά</p>
              <p className="font-medium text-green-500">$0.00</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Επιτυχημένες Συναλλαγές</p>
              <p className="font-medium">0%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'running':
      return (
        <Badge className="bg-green-500">
          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
          Ενεργό
        </Badge>
      );
    case 'paused':
      return <Badge className="bg-yellow-500">Σε παύση</Badge>;
    case 'idle':
    default:
      return <Badge variant="outline">Ανενεργό</Badge>;
  }
}

function OrderTypeBadge({ type }: { type: string }) {
  switch (type) {
    case 'buy':
      return <Badge className="bg-green-500">Αγορά</Badge>;
    case 'sell':
      return <Badge className="bg-red-500">Πώληση</Badge>;
    case 'stop-loss':
      return <Badge className="bg-yellow-500">Stop Loss</Badge>;
    case 'take-profit':
      return <Badge className="bg-blue-500">Take Profit</Badge>;
    default:
      return <Badge variant="outline">{type}</Badge>;
  }
}
