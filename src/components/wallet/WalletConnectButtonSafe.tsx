
import React from 'react';
import { Button } from "@/components/ui/button";
import { Wallet, Loader } from "lucide-react";
import { ButtonProps } from "@/components/ui/button";
import { toast } from "sonner";

interface WalletConnectButtonSafeProps extends ButtonProps {
  isLoading?: boolean;
  children?: React.ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export function WalletConnectButtonSafe({ 
  children, 
  isLoading = false,
  variant = "default",
  size = "default",
  ...props 
}: WalletConnectButtonSafeProps) {
  const handleWalletClick = () => {
    try {
      if (window.phantom?.solana) {
        // Attempt to connect, but wrapped in try/catch
        window.phantom.solana.connect().catch(err => {
          console.error("Wallet connection error:", err);
        });
      } else {
        toast.info("Το Phantom Wallet δεν είναι εγκατεστημένο. Παρακαλώ εγκαταστήστε το πρώτα.");
      }
    } catch (error) {
      console.error("Error handling wallet connection:", error);
    }
  };

  return (
    <Button 
      variant={variant} 
      size={size} 
      onClick={handleWalletClick}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        <Wallet className="mr-2 h-4 w-4" />
      )}
      {children || "Σύνδεση Wallet"}
    </Button>
  );
}
