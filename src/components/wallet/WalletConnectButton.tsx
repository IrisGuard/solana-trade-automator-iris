
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
  const { connected, connecting, publicKey, disconnect } = useWallet();
  const { setVisible } = useWalletModal();

  const handleClick = () => {
    if (connecting) return;
    
    try {
      if (connected && publicKey) {
        disconnect();
        toast.success("Το πορτοφόλι αποσυνδέθηκε");
      } else {
        setVisible(true);
      }
    } catch (error) {
      console.error("Error handling wallet connection:", error);
      toast.error("Παρουσιάστηκε σφάλμα κατά τη διαχείριση σύνδεσης");
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
      {children || (connected ? "Αποσύνδεση Wallet" : "Σύνδεση με Wallet")}
    </Button>
  );
};
