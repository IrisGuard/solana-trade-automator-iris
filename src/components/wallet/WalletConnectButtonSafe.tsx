
import React from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { useWalletConnect } from "@/hooks/wallet/useWalletConnect";
import { WalletButtonContent } from "./WalletButtonContent";
import { WalletNotInstalledButton } from "./WalletNotInstalledButton";

export function WalletConnectButtonSafe({
  children,
  variant = "default",
  size = "default",
  className = "",
  ...props
}: ButtonProps) {
  const {
    isConnected,
    isConnecting,
    showHeliusStatus,
    walletAddress,
    phantomInstalled,
    handleConnectClick
  } = useWalletConnect();
  
  // Display error with tooltip if phantom not installed
  if (!phantomInstalled) {
    return (
      <WalletNotInstalledButton 
        className={className}
        size={size}
        onClick={handleConnectClick}
        {...props}
      />
    );
  }
  
  return (
    <Button 
      className={className}
      variant={variant}
      size={size}
      onClick={handleConnectClick}
      disabled={isConnecting || showHeliusStatus}
      {...props}
    >
      <WalletButtonContent 
        isConnecting={isConnecting}
        showHeliusStatus={showHeliusStatus}
        isConnected={isConnected}
        walletAddress={walletAddress}
      >
        {children}
      </WalletButtonContent>
    </Button>
  );
}
