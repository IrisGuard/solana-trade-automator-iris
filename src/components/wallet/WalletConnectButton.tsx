
import React from "react";
import { Button } from "@/components/ui/button";
import { Wallet, Loader } from "lucide-react";
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { toast } from "sonner";

interface WalletConnectButtonProps {
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  isLoading?: boolean;
  children?: React.ReactNode;
}

export const WalletConnectButton = ({ 
  className = "",
  variant = "default",
  size = "default",
  isLoading = false,
  children
}: WalletConnectButtonProps) => {
  const { connected, connecting } = useWallet();
  const { setVisible } = useWalletModal();

  const handleClick = () => {
    if (connecting) return;
    
    try {
      setVisible(true);
    } catch (error) {
      console.error("Error showing wallet modal:", error);
      toast.error("Δεν ήταν δυνατό το άνοιγμα του πορτοφολιού");
    }
  };

  return (
    <Button 
      onClick={handleClick}
      variant={variant}
      size={size}
      className={`flex items-center gap-2 ${className}`}
      disabled={isLoading || connecting}
    >
      {(isLoading || connecting) ? (
        <Loader className="h-4 w-4 animate-spin mr-2" />
      ) : (
        <Wallet className="h-4 w-4 mr-2" />
      )}
      {children || (connected ? "Συνδεδεμένο Wallet" : "Σύνδεση με Wallet")}
    </Button>
  );
};
