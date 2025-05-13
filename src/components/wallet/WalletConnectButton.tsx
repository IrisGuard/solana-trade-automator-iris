
import React from "react";
import { Button } from "@/components/ui/button";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export const WalletConnectButton = () => {
  return (
    <div>
      <WalletMultiButton className="text-sm font-medium" />
    </div>
  );
};
