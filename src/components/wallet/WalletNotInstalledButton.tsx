
import React from 'react';
import { Button, type ButtonProps } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface WalletNotInstalledButtonProps extends ButtonProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>; // Update to correct event handler type
}

export function WalletNotInstalledButton({ 
  className = "", 
  size = "default",
  onClick,
  ...props 
}: WalletNotInstalledButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            className={`${className} focus:ring-destructive`}
            variant="outline"
            size={size}
            onClick={onClick}
            {...props}
          >
            <AlertCircle className="mr-2 h-4 w-4 text-destructive" />
            <span>Wallet Απαιτείται</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent className="bg-background border shadow-lg p-2">
          <p>Το Phantom wallet δεν είναι εγκατεστημένο. Κάντε κλικ για εγκατάσταση.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
