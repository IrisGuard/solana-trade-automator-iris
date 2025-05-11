
import { Button } from "@/components/ui/button";
import { Wallet, Loader, AlertTriangle } from "lucide-react";
import { useSolanaWallet } from "@/hooks/useSolanaWallet";
import { useState } from "react";
import {
  useWalletModal,
} from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from "sonner";

interface WalletConnectButtonProps {
  variant?: "default" | "secondary" | "outline";
  size?: "default" | "sm" | "lg";
  fullWidth?: boolean;
  showDisconnect?: boolean;
}

export function WalletConnectButton({
  variant = "default",
  size = "default",
  fullWidth = false,
  showDisconnect = true
}: WalletConnectButtonProps) {
  const { setVisible } = useWalletModal();
  const { publicKey, connecting, connected, disconnecting, disconnect } = useWallet();
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const handleConnectClick = () => {
    setVisible(true);
  };

  const handleDisconnectClick = async () => {
    try {
      setIsDisconnecting(true);
      await disconnect();
      toast.success("Το πορτοφόλι αποσυνδέθηκε");
    } catch (error) {
      console.error("Σφάλμα αποσύνδεσης:", error);
      toast.error("Δεν ήταν δυνατή η αποσύνδεση του πορτοφολιού");
    } finally {
      setIsDisconnecting(false);
    }
  };

  if (connected && publicKey && showDisconnect) {
    return (
      <Button
        variant="outline"
        size={size}
        className={`${fullWidth ? "w-full" : ""} flex items-center gap-2`}
        onClick={handleDisconnectClick}
        disabled={disconnecting || isDisconnecting}
      >
        {disconnecting || isDisconnecting ? (
          <>
            <Loader className="h-4 w-4 animate-spin" />
            Αποσύνδεση...
          </>
        ) : (
          <>
            <Wallet className="h-4 w-4" />
            Αποσύνδεση
          </>
        )}
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={`${fullWidth ? "w-full" : ""} flex items-center gap-2`}
      onClick={handleConnectClick}
      disabled={connecting}
    >
      {connecting ? (
        <>
          <Loader className="h-4 w-4 animate-spin" />
          Σύνδεση...
        </>
      ) : (
        <>
          <Wallet className="h-4 w-4" />
          Σύνδεση με Wallet
        </>
      )}
    </Button>
  );
}
