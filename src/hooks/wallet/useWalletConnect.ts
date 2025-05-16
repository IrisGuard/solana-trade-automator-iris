
import { useState, useEffect, useCallback } from 'react';
import { isPhantomInstalled } from '@/utils/phantomWallet';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { toast } from 'sonner';
import { useErrorReporting } from '@/hooks/useErrorReporting';
import { useUser } from '@/hooks/useUser';
import { syncAllHeliusData } from '@/utils/syncHeliusKeys';

export function useWalletConnect() {
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
            component: 'useWalletConnect',
            source: 'refreshDataEffect'
          });
        }
      };
      
      refreshData();
    }
  }, [isConnected, refreshWalletData, user, reportError]);

  // Prevent rapid clicking
  const isThrottled = () => {
    const now = Date.now();
    if (now - lastAttempt < 2000) {
      return true;
    }
    setLastAttempt(now);
    return false;
  };

  // Update the handler to accept the event parameter - match the expected MouseEventHandler type
  const handleConnectClick = useCallback(async (event?: React.MouseEvent<HTMLButtonElement>) => {
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
  }, [isConnecting, phantomInstalled, isConnected, disconnectWallet, connectWallet, retryCount, reportError]);

  return {
    isConnected,
    isConnecting,
    showHeliusStatus,
    walletAddress,
    phantomInstalled,
    handleConnectClick
  };
}
