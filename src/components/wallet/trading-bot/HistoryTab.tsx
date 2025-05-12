
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { History, Check, X } from "lucide-react";

// Δημιουργία δεδομένων για demo
const demoHistory = [
  {
    id: '1',
    type: 'take_profit',
    price: 62.15,
    amount: 0.5,
    status: 'filled',
    tokenSymbol: 'SOL',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    profit: 3.1
  },
  {
    id: '2',
    type: 'stop_loss',
    price: 58.20,
    amount: 1.2,
    status: 'filled',
    tokenSymbol: 'SOL',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    profit: -2.4
  },
  {
    id: '3',
    type: 'buy',
    price: 0.98,
    amount: 100,
    status: 'filled',
    tokenSymbol: 'USDC',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '4',
    type: 'sell',
    price: 60.75,
    amount: 0.3,
    status: 'cancelled',
    tokenSymbol: 'SOL',
    timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export function HistoryTab() {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('el-GR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'stop_loss':
        return 'Stop Loss';
      case 'take_profit':
        return 'Take Profit';
      case 'buy':
        return 'Αγορά';
      case 'sell':
        return 'Πώληση';
      default:
        return type;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'filled':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <Check className="h-3 w-3 mr-1" /> Εκτελέστηκε
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <X className="h-3 w-3 mr-1" /> Ακυρώθηκε
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">{status}</Badge>
        );
    }
  };

  return (
    <div>
      <ScrollArea className="h-72">
        <div className="space-y-3">
          {demoHistory.length === 0 ? (
            <div className="text-center py-6">
              <History className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
              <p className="font-medium">Δεν υπάρχει ιστορικό συναλλαγών</p>
            </div>
          ) : (
            demoHistory.map((item) => (
              <div 
                key={item.id}
                className="p-3 border rounded-md space-y-2"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{getTypeLabel(item.type)}</span>
                      <span className="text-sm text-muted-foreground">
                        {item.amount} {item.tokenSymbol} @ ${item.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {formatDate(item.timestamp)}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    {getStatusBadge(item.status)}
                    
                    {item.profit && (
                      <span 
                        className={`text-sm font-medium mt-1 ${
                          item.profit > 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {item.profit > 0 ? '+' : ''}{item.profit}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
