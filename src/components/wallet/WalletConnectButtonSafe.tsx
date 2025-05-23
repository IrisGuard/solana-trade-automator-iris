
import React, { useState, useEffect } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Loader2, Wallet, LogOut, AlertCircle } from "lucide-react";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { toast } from "sonner";
import { isPhantomInstalled } from "@/utils/phantomWallet";
import { useLanguage } from "@/hooks/use-language";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useErrorReporting } from "@/hooks/useErrorReporting";
import { useUser } from "@/hooks/useUser";

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
  const [lastAttempt, setLastAttempt] = useState(0);
  
  const { user } = useUser();
  const { reportError } = useErrorReporting();
  
  const { 
    isConnected, 
    isConnecting: hookConnecting, 
    connectWallet, 
    disconnectWallet,
    walletAddress,
    refreshWalletData
  } = useWalletConnection();
  
  // Combine state from hook and local state
  const isConnecting = hookConnecting || isAttemptingConnect;
  
  // Check if Phantom is installed
  const phantomInstalled = isPhantomInstalled();
  
  // Reset retry count when connection status changes
  useEffect(() => {
    if (isConnected) {
      setRetryCount(0);
      
      // Refresh wallet data when connected
      const refreshData = async () => {
        try {
          console.log("Refreshing wallet data after connection");
          await refreshWalletData();
        } catch (err) {
          console.error("Error refreshing wallet data:", err);
          reportError(err, {
            component: 'WalletConnectButtonSafe',
            source: 'refreshDataEffect'
          });
        }
      };
      
      refreshData();
    }
  }, [isConnected, refreshWalletData, user]);
  
  // Prevent rapid clicking
  const isThrottled = () => {
    const now = Date.now();
    if (now - lastAttempt < 2000) {
      return true;
    }
    setLastAttempt(now);
    return false;
  };
  
  const handleClick = async () => {
    if (isConnecting || isThrottled()) return;
    
    try {
      setIsAttemptingConnect(true);
      
      if (!phantomInstalled) {
        toast.error("Phantom wallet is not installed", {
          description: "Please install Phantom Wallet to connect",
          action: {
            label: "Install",
            onClick: () => window.open("https://phantom.app/", "_blank")
          }
        });
        return;
      }
      
      if (isConnected) {
        await disconnectWallet();
        toast.success("Wallet disconnected");
      } else {
        // Increment retry count if attempting to connect
        setRetryCount(prev => prev + 1);
        
        await connectWallet();
        
        // Only show success toast if we actually connected (handled by the hook)
      }
    } catch (error) {
      console.error("Error in WalletConnectButtonSafe:", error);
      reportError(error, {
        component: 'WalletConnectButtonSafe',
        source: 'client',
        details: { action: 'handleClick', retryCount }
      });
      
      // Different message based on retry count
      if (retryCount > 2) {
        toast.error("Persistent connection problem", {
          description: "Try refreshing the page or restart Phantom",
          duration: 5000
        });
      } else {
        toast.error("Problem connecting to wallet");
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
          <span>Connecting...</span>
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
          {children || <span className="sr-only md:not-sr-only md:ml-1">Disconnect</span>}
        </>
      );
    }
    
    return (
      <>
        <Wallet className="mr-2 h-4 w-4" />
        {children || <span>Connect Wallet</span>}
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
              <span>Wallet Required</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-background border shadow-lg p-2">
            <p>Phantom wallet is not installed. Click to install.</p>
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
