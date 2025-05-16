
import React from 'react';
import { Button } from '@/components/ui/button';
import { useWalletConnect } from '@/providers/WalletConnectProvider';
import { RefreshCw } from 'lucide-react';

export function WalletHeader() {
  const { walletAddress, disconnectWallet } = useWalletConnect();
  
  // Format wallet address for display
  const displayAddress = walletAddress 
    ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`
    : '';

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-6 rounded-lg border">
      <div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-green-500"></span>
          <h2 className="text-xl font-bold">Συνδεδεμένο Πορτοφόλι</h2>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-muted-foreground">Διεύθυνση:</span>
          <span className="font-mono">{displayAddress}</span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => {
              if (walletAddress) {
                navigator.clipboard.writeText(walletAddress);
              }
            }}
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 2V1H10V2H5ZM4.75 0C4.33579 0 4 0.335786 4 0.75V1H3.5C2.67157 1 2 1.67157 2 2.5V12.5C2 13.3284 2.67157 14 3.5 14H11.5C12.3284 14 13 13.3284 13 12.5V2.5C13 1.67157 12.3284 1 11.5 1H11V0.75C11 0.335786 10.6642 0 10.25 0H4.75ZM11 2V2.25C11 2.66421 10.6642 3 10.25 3H4.75C4.33579 3 4 2.66421 4 2.25V2H3.5C3.22386 2 3 2.22386 3 2.5V12.5C3 12.7761 3.22386 13 3.5 13H11.5C11.7761 13 12 12.7761 12 12.5V2.5C12 2.22386 11.7761 2 11.5 2H11Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
            </svg>
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Ανανέωση
        </Button>
        <Button variant="outline" size="sm" onClick={disconnectWallet}>
          Αποσύνδεση
        </Button>
      </div>
    </div>
  );
}
