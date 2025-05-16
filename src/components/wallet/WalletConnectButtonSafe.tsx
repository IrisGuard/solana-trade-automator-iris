
import React, { useState, useEffect } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Loader2, Wallet, LogOut, AlertCircle } from "lucide-react";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { toast } from "sonner";
import { isPhantomInstalled } from "@/utils/phantomWallet";
import { useLanguage } from "@/hooks/use-language";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function WalletConnectButtonSafe({
  children,
  variant = "default",
  size = "default",
  className = "",
  ...props
}: ButtonProps) {
  const { t } = useLanguage();
  const [isAttemptingConnect, setIsAttemptingConnect] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  const { 
    isConnected, 
    isConnecting: hookConnecting, 
    connectWallet, 
    disconnectWallet,
    walletAddress
  } = useWalletConnection();
  
  // Συνδυάζουμε την κατάσταση από το hook και την τοπική κατάσταση
  const isConnecting = hookConnecting || isAttemptingConnect;
  
  // Έλεγχος αν το Phantom είναι εγκατεστημένο
  const phantomInstalled = isPhantomInstalled();
  
  // Reset retry count when connection status changes
  useEffect(() => {
    if (isConnected) {
      setRetryCount(0);
    }
  }, [isConnected]);
  
  const handleClick = async () => {
    if (isConnecting) return;
    
    try {
      setIsAttemptingConnect(true);
      
      if (!phantomInstalled) {
        toast.error("Το Phantom wallet δεν είναι εγκατεστημένο", {
          description: "Παρακαλώ εγκαταστήστε το Phantom Wallet για να συνδεθείτε",
          action: {
            label: "Εγκατάσταση",
            onClick: () => window.open("https://phantom.app/", "_blank")
          }
        });
        return;
      }
      
      if (isConnected) {
        await disconnectWallet();
        toast.success("Το wallet αποσυνδέθηκε");
      } else {
        // Increment retry count if attempting to connect
        setRetryCount(prev => prev + 1);
        
        await connectWallet();
        
        // Only show success toast if we actually connected (handled by the hook)
      }
    } catch (error) {
      console.error("Σφάλμα στο WalletConnectButtonSafe:", error);
      
      // Different message based on retry count
      if (retryCount > 2) {
        toast.error("Επίμονο πρόβλημα σύνδεσης", {
          description: "Δοκιμάστε να ανανεώσετε τη σελίδα ή να επανεκκινήσετε το Phantom",
          duration: 5000
        });
      } else {
        toast.error("Πρόβλημα σύνδεσης με το wallet");
      }
    } finally {
      setIsAttemptingConnect(false);
    }
  };
  
  const getButtonContent = () => {
    if (isConnecting) {
      return (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span>Σύνδεση...</span>
        </>
      );
    }
    
    if (isConnected) {
      return (
        <>
          {walletAddress && (
            <span className="mr-2 text-xs md:text-sm">
              {`${walletAddress.substring(0, 4)}...${walletAddress.substring(walletAddress.length - 4)}`}
            </span>
          )}
          <LogOut className="h-4 w-4" />
          {children || <span className="sr-only md:not-sr-only md:ml-1">Αποσύνδεση</span>}
        </>
      );
    }
    
    return (
      <>
        <Wallet className="mr-2 h-4 w-4" />
        {children || <span>Σύνδεση με Wallet</span>}
      </>
    );
  };
  
  // Display error with tooltip if phantom not installed
  if (!phantomInstalled) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              className={`${className} focus:ring-destructive`}
              variant="outline"
              size={size}
              onClick={handleClick}
            >
              <AlertCircle className="mr-2 h-4 w-4 text-destructive" />
              <span>Wallet Απαιτείται</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Το Phantom wallet δεν είναι εγκατεστημένο. Κάντε κλικ για εγκατάσταση.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return (
    <Button 
      className={className}
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={isConnecting}
      {...props}
    >
      {getButtonContent()}
    </Button>
  );
}
