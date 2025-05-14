
import React from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Loader2, Wallet } from "lucide-react";

interface WalletConnectButtonProps extends ButtonProps {
  isLoading?: boolean;
}

export function WalletConnectButton({
  children,
  isLoading = false,
  variant = "default",
  size = "default",
  className = "",
  ...props
}: WalletConnectButtonProps) {
  const buttonContent = isLoading ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      <span>Σύνδεση...</span>
    </>
  ) : (
    <>{children || 
      <>
        <Wallet className="mr-2 h-4 w-4" />
        <span>Σύνδεση με Wallet</span>
      </>
    }</>
  );
  
  return (
    <Button 
      className={className}
      variant={variant}
      size={size}
      disabled={isLoading}
      {...props}
    >
      {buttonContent}
    </Button>
  );
}
