
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Wallet } from "lucide-react";
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';

interface WalletConnectButtonProps {
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  isLoading?: boolean;
  children?: React.ReactNode;  // Προσθήκη υποστήριξης για children
}

export function WalletConnectButton({ 
  className = "",
  variant = "default",
  size = "default",
  isLoading = false,
  children
}: WalletConnectButtonProps) {
  const { connected } = useWallet();
  const { setVisible } = useWalletModal();

  const handleClick = () => {
    setVisible(true);
  };

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
    <Button 
      onClick={handleClick}
      variant={variant || "default"}
      size={size || "default"}
      className={`flex items-center gap-2 ${className}`}
    >
      <Wallet className="h-4 w-4" />
      {children || (connected ? "Συνδεδεμένο Wallet" : "Σύνδεση με Wallet")}
    </Button>
  );
}
