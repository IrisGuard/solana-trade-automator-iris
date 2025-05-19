
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ExternalLink, ArrowRightLeft, Clock } from "lucide-react";
import { formatDate } from "@/utils/transactionUtils";

interface TransactionDetailDialogProps {
  children: React.ReactNode;
  transaction: any;
  solscanData: any;
}

export function TransactionDetailDialog({ children, transaction, solscanData }: TransactionDetailDialogProps) {
  const isRaydium = transaction.signature.startsWith("raydium-");
  const hasDetails = !!solscanData || isRaydium;

  const getTransactionStatus = () => {
    if (isRaydium) {
      return "success"; // Mock transactions are always successful
    }
    
    if (solscanData) {
      return solscanData.status || "pending";
    }
    
    return transaction.status;
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Transaction Details
            <Badge variant={getTransactionStatus() === "success" ? "success" : "destructive"}>
              {getTransactionStatus()}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Card className="p-4 space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-1 text-muted-foreground text-sm">Service</div>
              <div className="col-span-2 font-medium">
                <Badge variant={isRaydium ? "purple" : "blue"} className="text-xs">
                  {isRaydium ? "Raydium" : "Jupiter"}
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-1 text-muted-foreground text-sm">Signature</div>
              <div className="col-span-2 font-mono text-xs break-all">
                {transaction.signature}
                {!isRaydium && (
                  <a
                    href={`https://solscan.io/tx/${transaction.signature}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block ml-2 text-blue-500 hover:text-blue-700"
                  >
                    <ExternalLink className="h-3 w-3 inline" />
                  </a>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-1 text-muted-foreground text-sm">Amount</div>
              <div className="col-span-2">{transaction.amount}</div>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-1 text-muted-foreground text-sm">Type</div>
              <div className="col-span-2 flex items-center">
                <ArrowRightLeft className="h-4 w-4 mr-2" />
                Swap
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-1 text-muted-foreground text-sm">Time</div>
              <div className="col-span-2 flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                {formatDate(transaction.created_at || transaction.block_time || "")}
              </div>
            </div>
          </Card>
          
          {hasDetails && (
            <div>
              <h3 className="text-sm font-medium mb-2">Transaction Details</h3>
              <Card className="p-4 text-sm">
                {isRaydium ? (
                  <div className="italic text-muted-foreground">
                    This is a simulated transaction (not on-chain)
                  </div>
                ) : (
                  <div className="space-y-2">
                    {solscanData && (
                      <>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="col-span-1 text-muted-foreground">Fee</div>
                          <div className="col-span-2">{solscanData.fee / 1e9} SOL</div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="col-span-1 text-muted-foreground">Slot</div>
                          <div className="col-span-2">{solscanData.slot}</div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </Card>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
