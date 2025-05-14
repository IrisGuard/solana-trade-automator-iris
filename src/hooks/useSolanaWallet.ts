
import { useState, useEffect } from "react";
import { useWallet as useSolanaAdapter } from "@solana/wallet-adapter-react";
import { errorCollector } from "@/utils/error-handling/collector";
import { ErrorOptions } from "@/utils/error-handling/types";

export function useSolanaWallet() {
  const solanaAdapter = useSolanaAdapter();
  const [isLoading, setIsLoading] = useState(false);
  const [solBalance, setSolBalance] = useState<number>(0);

  useEffect(() => {
    // Όταν συνδεθεί το πορτοφόλι, φόρτωσε το υπόλοιπο
    if (solanaAdapter.connected && solanaAdapter.publicKey) {
      loadSolBalance();
    } else {
      // Επαναφορά των δεδομένων όταν αποσυνδεθεί
      setSolBalance(0);
    }
  }, [solanaAdapter.connected, solanaAdapter.publicKey]);

  // Φόρτωση του υπόλοιπου SOL
  const loadSolBalance = async () => {
    if (!solanaAdapter.publicKey) {
      return;
    }

    try {
      setIsLoading(true);
      // Προσομοίωση αίτησης δικτύου - σε πραγματική εφαρμογή θα καλούσε μια API
      setTimeout(() => {
        // Τυχαίο υπόλοιπο για προσομοίωση
        const mockBalance = 5.24 + (Math.random() * 10);
        setSolBalance(mockBalance);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      errorCollector.captureError(error as Error, {
        source: "wallet-api",
        message: "Failed to load SOL balance",
        component: "SolanaWallet" 
      });
      setIsLoading(false);
      throw error;
    }
  };

  // Σύνδεση πορτοφολιού
  const connect = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      // Επιλογή του πρώτου διαθέσιμου wallet
      if (!solanaAdapter.wallet) {
        await solanaAdapter.select('Phantom');
      }
      
      await solanaAdapter.connect();
      return true;
    } catch (error) {
      errorCollector.captureError(error as Error, {
        source: "wallet-connection",
        message: "Failed to connect wallet",
        component: "SolanaWallet"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Αποσύνδεση πορτοφολιού
  const disconnect = async (): Promise<void> => {
    try {
      await solanaAdapter.disconnect();
    } catch (error) {
      errorCollector.captureError(error as Error, {
        source: "wallet-connection",
        message: "Failed to disconnect wallet",
        component: "SolanaWallet"
      });
    }
  };

  return {
    ...solanaAdapter,
    isLoading,
    solBalance,
    loadSolBalance,
    connect,
    disconnect
  };
}
