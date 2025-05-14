
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpCircle, ArrowDownCircle, Wallet } from 'lucide-react';
import { formatAddress } from '@/utils/formatters';

interface WalletOverviewPanelProps {
  walletAddress: string;
  solBalance: number;
  totalValue: number;
  onRefresh: () => void;
}

export function WalletOverviewPanel({
  walletAddress,
  solBalance,
  totalValue,
  onRefresh
}: WalletOverviewPanelProps) {
  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Wallet Overview</CardTitle>
        <button
          onClick={onRefresh}
          className="inline-flex items-center justify-center rounded-md w-8 h-8 text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-refresh-cw">
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M3 21v-5h5" />
          </svg>
        </button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-6">
          <div className="flex items-center space-x-4">
            <Wallet className="h-10 w-10 text-primary p-2 bg-primary/10 rounded-full" />
            <div>
              <p className="text-sm text-muted-foreground">Wallet Address</p>
              <p className="font-medium">{formatAddress(walletAddress)}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">SOL Balance</p>
              <p className="text-2xl font-bold">{solBalance.toFixed(4)} SOL</p>
            </div>
            
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Total Value</p>
              <p className="text-2xl font-bold">${totalValue.toFixed(2)}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-500/10 rounded-full">
                <ArrowUpCircle className="h-4 w-4 text-green-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Received (24h)</p>
                <p className="font-medium">+2.5 SOL</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="p-2 bg-red-500/10 rounded-full">
                <ArrowDownCircle className="h-4 w-4 text-red-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Sent (24h)</p>
                <p className="font-medium">-1.2 SOL</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
