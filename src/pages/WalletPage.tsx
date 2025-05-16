
import React from 'react';
import { WalletTabs } from '@/components/wallet/WalletTabs';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { ConnectWalletScreen } from '@/components/wallet/ConnectWalletScreen';
import { WalletHeader } from '@/components/wallet/WalletHeader';

export function WalletPage() {
  const { isConnected } = useWalletConnection();

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Το Πορτοφόλι Μου</h1>
      
      {!isConnected ? (
        <ConnectWalletScreen />
      ) : (
        <div className="space-y-6">
          <WalletHeader />
          <WalletTabs />
        </div>
      )}
    </div>
  );
}
