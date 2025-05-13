
import React from 'react';
import { Button } from "@/components/ui/button";
import { Wallet, Loader } from "lucide-react";
import { ButtonProps } from "@/components/ui/button";
import { toast } from "sonner";
import { handleWalletError } from "@/utils/walletUtils";

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
        // Εμφάνιση toast ότι η σύνδεση είναι σε εξέλιξη
        toast.info("Αίτημα σύνδεσης στο Phantom Wallet...", {
          id: "phantom-connect-request",
          duration: 3000
        });
        
        // Attempt to connect with proper error handling
        window.phantom.solana.connect()
          .then(response => {
            console.log("Wallet connected successfully:", response.publicKey.toString());
            toast.success("Επιτυχής σύνδεση με το Phantom Wallet");
            
            // Διακοπή του προηγούμενου toast
            toast.dismiss("phantom-connect-request");
          })
          .catch(err => {
            console.error("Wallet connection error:", err);
            const errorMessage = handleWalletError(err);
            toast.error(`Σφάλμα: ${errorMessage}`);
            
            // Διακοπή του προηγούμενου toast
            toast.dismiss("phantom-connect-request");
          });
      } else {
        toast.error("Το Phantom Wallet δεν είναι εγκατεστημένο", {
          description: "Παρακαλώ εγκαταστήστε το πρώτα από το phantom.app",
          duration: 5000
        });
      }
    } catch (error) {
      console.error("Error handling wallet connection:", error);
      toast.error("Απρόσμενο σφάλμα κατά τη σύνδεση του wallet");
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
