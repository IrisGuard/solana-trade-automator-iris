
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, Copy, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface WalletSectionProps {
  connected: boolean;
  walletAddress: string | null;
  shortAddress: string | null;
  balance: number;
  isLoadingBalance: boolean;
}

export function WalletSection({
  connected,
  walletAddress,
  shortAddress,
  balance,
  isLoadingBalance,
}: WalletSectionProps) {
  const copyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      toast.success('Η διεύθυνση αντιγράφηκε');
    }
  };

  const openInExplorer = () => {
    if (walletAddress) {
      window.open(`https://solscan.io/account/${walletAddress}`, '_blank');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Πορτοφόλι
          <Badge variant={connected ? 'default' : 'secondary'}>
            {connected ? 'Συνδεδεμένο' : 'Αποσυνδεδεμένο'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {connected && walletAddress && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Διεύθυνση:</span>
              <div className="flex items-center gap-2">
                <code className="bg-muted px-2 py-1 rounded text-sm">
                  {shortAddress}
                </code>
                <Button
                  onClick={copyAddress}
                  variant="ghost"
                  size="sm"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  onClick={openInExplorer}
                  variant="ghost"
                  size="sm"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Υπόλοιπο SOL:</span>
              <div className="text-right">
                {isLoadingBalance ? (
                  <div className="animate-pulse bg-muted h-6 w-20 rounded"></div>
                ) : (
                  <div className="font-mono">
                    <span className="text-xl font-bold">{balance.toFixed(4)}</span>
                    <span className="text-sm text-muted-foreground ml-1">SOL</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Δίκτυο:</span>
                  <div className="font-medium">Solana Mainnet</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Κατάσταση:</span>
                  <div className="font-medium text-green-600">Ενεργό</div>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
