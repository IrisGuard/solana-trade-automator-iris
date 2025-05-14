
import React from 'react';
import { Grid } from '@mui/material';
import { WalletInfoCard } from './WalletInfoCard';
import { TokensCard } from './TokensCard';
import { TransactionsCard } from './TransactionsCard';
import { BotStatusCard } from './BotStatusCard';
import { PlatformInfoCard } from './PlatformInfoCard';
import type { Token } from '@/types/wallet';

export interface WalletConnectedContentProps {
  walletAddress: string;
  tokens: Token[];
  balance: number;
  onDisconnect: () => void;
}

export const WalletConnectedContent: React.FC<WalletConnectedContentProps> = ({
  walletAddress,
  tokens,
  balance,
  onDisconnect
}) => {
  return (
    <>
      <Grid container item xs={12} md={4}>
        <div className="space-y-4">
          <WalletInfoCard 
            walletAddress={walletAddress}
            balance={balance}
            onDisconnect={onDisconnect}
          />
          <PlatformInfoCard />
        </div>
      </Grid>
      
      <Grid container item xs={12} md={8}>
        <div className="space-y-4">
          <TokensCard tokens={tokens} />
          <Grid container spacing={4}>
            <Grid container item xs={12} md={6}>
              <TransactionsCard 
                walletAddress={walletAddress} 
                displayAddress={walletAddress}
              />
            </Grid>
            <Grid container item xs={12} md={6}>
              <BotStatusCard />
            </Grid>
          </Grid>
        </div>
      </Grid>
    </>
  );
};
