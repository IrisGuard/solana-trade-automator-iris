
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Wallet, TrendingDown, TrendingUp, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Order } from "@/types/orders";

interface OrdersTabProps {
  activeOrders: Order[];
  onCancelOrder?: (orderId: string) => void;
}

export function OrdersTab({ activeOrders, onCancelOrder }: OrdersTabProps) {
  // Αν δεν υπάρχουν ενεργές εντολές
  if (activeOrders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <Ban className="h-10 w-10 text-muted-foreground mb-2" />
        <h3 className="text-lg font-medium">Δεν υπάρχουν ενεργές εντολές</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Ξεκινήστε το bot για να δημιουργηθούν εντολές αγοράς/πώλησης
        </p>
      </div>
    );
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'stop_loss':
      case 'stop-loss':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'take_profit':
      case 'take-profit':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'buy':
      case 'limit-buy':
        return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case 'sell':
      case 'limit-sell':
        return <TrendingDown className="h-4 w-4 text-orange-500" />;
      default:
        return <Wallet className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'stop_loss':
      case 'stop-loss':
        return 'Stop Loss';
      case 'take_profit':
      case 'take-profit':
        return 'Take Profit';
      case 'buy':
      case 'limit-buy':
        return 'Αγορά';
      case 'sell':
      case 'limit-sell':
        return 'Πώληση';
      default:
        return type;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'stop_loss':
      case 'stop-loss':
        return 'border-red-200 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'take_profit':
      case 'take-profit':
        return 'border-green-200 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'buy':
      case 'limit-buy':
        return 'border-blue-200 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'sell':
      case 'limit-sell':
        return 'border-orange-200 bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      default:
        return '';
    }
  };

  return (
    <div>
      <ScrollArea className="h-72">
        <div className="space-y-2">
          {activeOrders.map((order) => (
            <div 
              key={order.id} 
              className="p-3 border rounded-md flex items-center justify-between hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="rounded-full bg-background p-1.5 border">
                  {getTypeIcon(order.type)}
                </div>
                
                <div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className={getTypeBadgeColor(order.type)}>
                      {getTypeLabel(order.type)}
                    </Badge>
                    <span className="text-sm font-medium">
                      ${order.price.toFixed(4)}
                    </span>
                  </div>
                  
                  <div className="text-xs text-muted-foreground mt-1">
                    Ποσότητα: {order.amount} | ID: {order.id.substring(0, 8)}...
                  </div>
                </div>
              </div>
              
              {onCancelOrder && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-destructive hover:text-destructive/90"
                  onClick={() => onCancelOrder(order.id)}
                >
                  Ακύρωση
                </Button>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
