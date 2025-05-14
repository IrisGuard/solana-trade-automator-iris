
import React from 'react';
import { Grid } from '@mui/material';
import { ConnectWalletCard } from './ConnectWalletCard';
import { PlatformInfoCard } from './PlatformInfoCard';

export interface WalletDisconnectedContentProps {
  onConnect: () => Promise<boolean>;
  isConnecting: boolean;
}

export const WalletDisconnectedContent: React.FC<WalletDisconnectedContentProps> = ({
  onConnect,
  isConnecting
}) => {
  const handleConnect = async () => {
    try {
      await onConnect();
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };
  
  return (
    <>
      <Grid item xs={12} md={4}>
        <div className="space-y-4">
          <ConnectWalletCard onConnect={handleConnect} isConnecting={isConnecting} />
          <PlatformInfoCard />
        </div>
      </Grid>
      <Grid item xs={12} md={8}>
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm space-y-8">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">
              Connect your wallet to get started
            </h3>
            <p className="text-muted-foreground">
              Connect your Solana wallet to view your tokens and start using the platform
            </p>
          </div>
        </div>
      </Grid>
    </>
  );
};
