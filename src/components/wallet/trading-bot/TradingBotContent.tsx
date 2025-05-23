
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ConnectPrompt } from '../maker-bot/ConnectPrompt';

interface TradingBotContentProps {
  isConnected: boolean;
  walletAddress?: string | null;
  handleConnectWallet: () => void;
}

export function TradingBotContent({ 
  isConnected, 
  walletAddress, 
  handleConnectWallet 
}: TradingBotContentProps) {
  if (!isConnected) {
    return (
      <ConnectPrompt 
        handleConnectWallet={handleConnectWallet}
        size="large"
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trading Bot</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Trading bot functionality has been disabled in the cleanup process.
          This feature will be available in a future update.
        </p>
      </CardContent>
    </Card>
  );
}

export default TradingBotContent;
