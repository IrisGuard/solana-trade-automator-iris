
import React from 'react';
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { ButtonProps } from "@/components/ui/button";

interface WalletConnectButtonSafeProps extends ButtonProps {
  isLoading?: boolean;
}

export function WalletConnectButtonSafe({ 
  children, 
  isLoading, 
  ...props 
}: WalletConnectButtonSafeProps) {
  return (
    <Button {...props}>
      {isLoading ? (
        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        <Wallet className="mr-2 h-4 w-4" />
      )}
      {children || "Σύνδεση Wallet"}
    </Button>
  );
}
