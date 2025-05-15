
import React, { useState } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Loader2, Wallet } from "lucide-react";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { toast } from "sonner";
import { isPhantomInstalled } from "@/utils/phantomWallet";
import { useLanguage } from "@/hooks/use-language";

// Αυτό είναι μια ασφαλής έκδοση του WalletConnectButton που χειρίζεται καλύτερα σφάλματα
export function WalletConnectButtonSafe({
  children,
  variant = "default",
  size = "default",
  className = "",
  ...props
}: ButtonProps) {
  const { t } = useLanguage();
  const [isAttemptingConnect, setIsAttemptingConnect] = useState(false);
  const { 
    isConnected, 
    isConnecting: hookConnecting, 
    connectWallet, 
    disconnectWallet 
  } = useWalletConnection();
  
  // Συνδυάζουμε την κατάσταση από το hook και την τοπική κατάσταση
  const isConnecting = hookConnecting || isAttemptingConnect;
  
  // Έλεγχος αν το Phantom είναι εγκατεστημένο
  const phantomInstalled = isPhantomInstalled();
  
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
        await connectWallet();
        toast.success("Το wallet συνδέθηκε επιτυχώς");
      }
    } catch (error) {
      console.error("Σφάλμα στο WalletConnectButtonSafe:", error);
      toast.error("Πρόβλημα σύνδεσης με το wallet");
    } finally {
      setIsAttemptingConnect(false);
    }
  };
  
  const buttonContent = isConnecting ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      <span>Σύνδεση...</span>
    </>
  ) : isConnected ? (
    <>{children || "Αποσύνδεση Wallet"}</>
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
      onClick={handleClick}
      disabled={isConnecting}
      {...props}
    >
      {buttonContent}
    </Button>
  );
}
