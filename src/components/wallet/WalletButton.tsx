
import React from 'react';
import { Button } from '@/components/ui/button';
import { useWalletStatus } from '@/hooks/useWalletStatus';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export function WalletButton() {
  const { isConnected, isConnecting } = useWalletStatus();

  return (
    <div className="flex justify-end">
      {isConnected ? (
        <WalletMultiButton className="!bg-primary hover:!bg-primary/90 !text-white" />
      ) : (
        <WalletMultiButton 
          className="!bg-primary hover:!bg-primary/90 !text-white"
        >
          {isConnecting ? 'Σύνδεση...' : 'Σύνδεση Wallet'}
        </WalletMultiButton>
      )}
    </div>
  );
}
