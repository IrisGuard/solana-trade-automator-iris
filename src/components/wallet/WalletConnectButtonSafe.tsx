
import React, { useState, useEffect } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Loader2, Wallet, LogOut, AlertCircle } from "lucide-react";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { toast } from "sonner";
import { isPhantomInstalled } from "@/utils/phantomWallet";
import { useLanguage } from "@/hooks/use-language";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useErrorReporting } from "@/hooks/useErrorReporting";
import { syncAllHeliusData } from "@/utils/syncHeliusKeys";
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
  const [showHeliusStatus, setShowHeliusStatus] = useState(false);
  
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
  
  // Συνδυάζουμε την κατάσταση από το hook και την τοπική κατάσταση
  const isConnecting = hookConnecting || isAttemptingConnect;
  
  // Έλεγχος αν το Phantom είναι εγκατεστημένο
  const phantomInstalled = isPhantomInstalled();
  
  // Reset retry count when connection status changes
  useEffect(() => {
    if (isConnected) {
      setRetryCount(0);
      
      // Refresh wallet data when connected
      const refreshData = async () => {
        try {
          console.log("Ανανέωση δεδομένων πορτοφολιού μετά τη σύνδεση");
          await refreshWalletData();
          
          // Συγχρονισμός με Helius για να διασφαλίσουμε ότι τα κλειδιά είναι ενημερωμένα
          if (user && user.id) {
            setShowHeliusStatus(true);
            setTimeout(async () => {
              try {
                await syncAllHeliusData(user.id);
                setShowHeliusStatus(false);
              } catch (error) {
                console.error("Σφάλμα κατά τον συγχρονισμό Helius:", error);
                setShowHeliusStatus(false);
              }
            }, 1000);
          }
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
      reportError(error, {
        component: 'WalletConnectButtonSafe',
        source: 'client',
        details: { action: 'handleClick', retryCount }
      });
      
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
    
    if (showHeliusStatus) {
      return (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span>Συγχρονισμός Helius...</span>
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
          <TooltipContent className="bg-background border shadow-lg p-2">
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
      disabled={isConnecting || showHeliusStatus}
      {...props}
    >
      {getButtonContent()}
    </Button>
  );
}
