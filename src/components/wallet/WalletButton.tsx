
import React from 'react';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { cn } from '@/lib/utils';

export function WalletButton() {
  const { connected } = useWallet();
  const { setVisible } = useWalletModal();
  
  const handleClick = () => {
    setVisible(true);
  };
  
  return (
    <Button 
      variant="outline" 
      size="sm" 
      className={cn("h-8 w-8 p-0", 
        connected ? "border-green-500 text-green-500" : ""
      )}
      onClick={handleClick}
      aria-label="Wallet"
    >
      <Wallet className="h-4 w-4" />
    </Button>
  );
}
