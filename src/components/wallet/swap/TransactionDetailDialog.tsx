
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { solscanService } from "@/services/solscan/solscanService";
import { formatDate } from "@/utils/transactionUtils";

interface TransactionDetailDialogProps {
  transaction: {
    id: string;
    signature: string;
    amount: string;
    source: string;
    destination: string;
    status: string;
    block_time?: string;
    created_at: string;
  };
  solscanData?: any;
  children: React.ReactNode;
}

export function TransactionDetailDialog({ transaction, solscanData, children }: TransactionDetailDialogProps) {
  const isMockTx = transaction.signature.startsWith('raydium-');
  const solscanLink = solscanService.getSolscanLink(transaction.signature);
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Transaction Details
            {transaction.status === "success" && 
              <Badge variant="success" className="ml-2">Success</Badge>
            }
            {transaction.status === "error" && 
              <Badge variant="destructive" className="ml-2">Failed</Badge>
            }
          </DialogTitle>
          <DialogDescription>
            {formatDate(transaction.created_at || transaction.block_time || "")}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-5 items-center gap-4">
            <span className="text-sm font-medium col-span-1">Amount:</span>
            <span className="col-span-4">{transaction.amount}</span>
          </div>
          
          <div className="grid grid-cols-5 items-center gap-4">
            <span className="text-sm font-medium col-span-1">From:</span>
            <span className="col-span-4 text-xs md:text-sm font-mono truncate">{transaction.source}</span>
          </div>
          
          <div className="grid grid-cols-5 items-center gap-4">
            <span className="text-sm font-medium col-span-1">To:</span>
            <span className="col-span-4 text-xs md:text-sm font-mono truncate">{transaction.destination}</span>
          </div>
          
          <div className="grid grid-cols-5 items-center gap-4">
            <span className="text-sm font-medium col-span-1">Txn:</span>
            <span className="col-span-4 text-xs md:text-sm font-mono truncate">
              {transaction.signature}
              {!isMockTx && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="ml-2 h-6 px-2" 
                  onClick={() => window.open(solscanLink, '_blank')}
                >
                  <ExternalLink size={14} />
                </Button>
              )}
            </span>
          </div>
          
          {solscanData && !isMockTx && (
            <>
              <div className="grid grid-cols-5 items-center gap-4">
                <span className="text-sm font-medium col-span-1">Fee:</span>
                <span className="col-span-4">
                  {solscanData.fee ? `${solscanData.fee / 1000000000} SOL` : 'Unknown'}
                </span>
              </div>
              
              <div className="grid grid-cols-5 items-center gap-4">
                <span className="text-sm font-medium col-span-1">Slot:</span>
                <span className="col-span-4">{solscanData.slot || 'Unknown'}</span>
              </div>
            </>
          )}
          
          {isMockTx && (
            <div className="flex items-center gap-2 bg-yellow-50 dark:bg-yellow-950 p-3 mt-2 rounded-md">
              <Info size={16} className="text-yellow-600 dark:text-yellow-400" />
              <p className="text-xs text-yellow-700 dark:text-yellow-300">
                This is a simulated transaction for demonstration purposes.
              </p>
            </div>
          )}
        </div>
        
        <div className="flex justify-end">
          {!isMockTx && (
            <Button 
              variant="outline" 
              onClick={() => window.open(solscanLink, '_blank')}
            >
              View on Solscan
              <ExternalLink size={14} className="ml-2" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
