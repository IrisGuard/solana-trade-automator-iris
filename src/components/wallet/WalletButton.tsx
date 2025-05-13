
import React from 'react';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';
import { useWalletStatus } from '@/hooks/useWalletStatus';
import { cn } from '@/lib/utils';

export function WalletButton() {
  const { isConnected } = useWalletStatus();
  
  return (
    <Button 
      variant="outline" 
      size="sm" 
      className={cn("h-8 w-8 p-0", 
        isConnected ? "border-green-500 text-green-500" : ""
      )}
      aria-label="Wallet"
    >
      <Wallet className="h-4 w-4" />
    </Button>
  );
}
