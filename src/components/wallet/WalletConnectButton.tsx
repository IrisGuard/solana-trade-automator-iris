
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, Wallet } from "lucide-react";
import { isPhantomInstalled, connectPhantomWallet } from '@/utils/phantomWallet';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface WalletConnectButtonProps {
  onConnect?: (address: string) => void;
  children?: React.ReactNode;
  size?: "sm" | "default" | "lg" | null;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null;
  className?: string;
  isLoading?: boolean;
}

export function WalletConnectButton({
  onConnect,
  children,
  size = "default",
  variant = "default",
  className = "",
  isLoading = false
}: WalletConnectButtonProps) {
  const [connecting, setConnecting] = useState<boolean>(false);
  
  const handleConnect = async () => {
    try {
      if (!isPhantomInstalled()) {
        toast.error("Το Phantom Wallet δεν είναι εγκατεστημένο", {
          description: "Παρακαλώ εγκαταστήστε το Phantom Wallet για να συνδεθείτε"
        });
        return;
      }
      
      setConnecting(true);
      
      const address = await connectPhantomWallet();
      if (address) {
        toast.success("Επιτυχής σύνδεση με το Phantom Wallet");
        if (onConnect) {
          onConnect(address);
        }
        
        // Αποθήκευση στο localStorage για γρήγορη επανασύνδεση
        localStorage.setItem('walletConnected', 'true');
        localStorage.removeItem('userDisconnected');
      }
    } catch (error) {
      console.error("Σφάλμα σύνδεσης:", error);
      if (error instanceof Error) {
        toast.error("Σφάλμα σύνδεσης", {
          description: error.message
        });
      } else {
        toast.error("Απρόσμενο σφάλμα κατά τη σύνδεση");
      }
    } finally {
      setConnecting(false);
    }
  };
  
  const isProcessing = isLoading || connecting;
  
  return (
    <Button
      size={size}
      variant={variant}
      onClick={handleConnect}
      disabled={isProcessing}
      className={cn("gap-2", className)}
    >
      {isProcessing ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Wallet className="h-4 w-4" />
      )}
      {children || "Σύνδεση Wallet"}
    </Button>
  );
}
