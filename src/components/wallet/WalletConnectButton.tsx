
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Wallet } from "lucide-react";
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

interface WalletConnectButtonProps {
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  isLoading?: boolean;
}

export function WalletConnectButton({ 
  className = "",
  variant = "default",
  size = "default",
  isLoading = false,
}: WalletConnectButtonProps) {
  const { connected } = useWallet();

  if (isLoading) {
    return (
      <Button
        variant={variant}
        size={size}
        className={`button-glow ${className}`}
        disabled
      >
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Σύνδεση...
      </Button>
    );
  }

  return (
    <WalletMultiButton className={`bg-primary text-white hover:bg-primary/90 rounded-md flex items-center gap-2 px-4 py-2 button-glow ${className}`}>
      <Wallet className="h-4 w-4" />
      {connected ? "Συνδεδεμένο Wallet" : "Σύνδεση με Wallet"}
    </WalletMultiButton>
  );
}
