
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { tradingService } from "@/services/solana/tradingService";

interface Order {
  id: string;
  type: 'stop-loss' | 'take-profit';
  price: number;
  amount: number;
}

interface OrdersTabProps {
  activeOrders: Order[];
}

export function OrdersTab({ activeOrders }: OrdersTabProps) {
  return (
    <>
      {activeOrders.length > 0 ? (
        <div className="space-y-3">
          {activeOrders.map((order) => (
            <div key={order.id} className="p-3 border rounded flex justify-between items-center">
              <div>
                <div className="font-medium">{order.type === 'stop-loss' ? 'Stop Loss' : 'Take Profit'}</div>
                <div className="text-sm text-muted-foreground">
                  Τιμή: ${order.price.toFixed(4)} • Ποσό: {order.amount} SOL
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => tradingService.cancelOrder(order.id)}>
                Ακύρωση
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center text-muted-foreground">
          <ArrowUpDown className="h-10 w-10 mx-auto mb-3 opacity-20" />
          <p>Δεν υπάρχουν ενεργές εντολές</p>
          <p className="text-sm mt-1">Ξεκινήστε το bot για να δημιουργηθούν εντολές</p>
        </div>
      )}
    </>
  );
}
