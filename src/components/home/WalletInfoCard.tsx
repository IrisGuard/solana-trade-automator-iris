
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, LogOut } from 'lucide-react';
import { formatAddress } from '@/utils/formatters';
import { toast } from 'sonner';

export interface WalletInfoCardProps {
  walletAddress: string;
  balance: number;
  onDisconnect: () => void;
}

export const WalletInfoCard: React.FC<WalletInfoCardProps> = ({
  walletAddress,
  balance,
  onDisconnect
}) => {
  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress)
      .then(() => toast.success('Wallet address copied to clipboard'))
      .catch((err) => {
        console.error('Failed to copy address:', err);
        toast.error('Failed to copy address');
      });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Wallet</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={onDisconnect}
          className="h-8 gap-1"
        >
          <LogOut className="h-4 w-4" />
          Disconnect
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">
              Address
            </div>
            <div className="flex items-center gap-2">
              <div className="font-mono text-sm truncate max-w-[200px]">
                {formatAddress(walletAddress)}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={handleCopyAddress}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">
              SOL Balance
            </div>
            <div className="font-medium">{balance.toFixed(4)} SOL</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
