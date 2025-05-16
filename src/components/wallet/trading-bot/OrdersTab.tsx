
import React from "react";
import { TradingOrder } from "@/hooks/trading-bot/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface OrdersTabProps {
  activeOrders: TradingOrder[];
}

export function OrdersTab({ activeOrders }: OrdersTabProps) {
  if (!activeOrders || activeOrders.length === 0) {
    return (
      <div className="text-center p-4 text-muted-foreground">
        Δεν υπάρχουν ενεργές εντολές αυτή τη στιγμή.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activeOrders.map(order => (
        <Card key={order.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="p-4 border-b bg-muted/20">
              <div className="flex items-center justify-between">
                <Badge 
                  variant={
                    order.type.includes('buy') ? "default" : 
                    order.type.includes('sell') ? "destructive" : 
                    "outline"
                  }
                >
                  {order.type}
                </Badge>
                <span className="text-sm font-medium">
                  {new Date(order.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Τιμή</p>
                  <p className="font-medium">${order.price.toFixed(4)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ποσότητα</p>
                  <p className="font-medium">{order.amount}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Token</p>
                  <p className="font-medium">{order.token}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Κατάσταση</p>
                  <p className="font-medium">{order.status}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
