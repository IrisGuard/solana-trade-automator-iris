
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { WalletConnectButton } from "./WalletConnectButton";
import { Wallet, LogOut } from "lucide-react";
import { useWallet } from '@solana/wallet-adapter-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export function WalletButton() {
  const { connected, disconnect, publicKey } = useWallet();
  const [isLoading, setIsLoading] = useState(false);

  const handleDisconnect = async () => {
    try {
      setIsLoading(true);
      await disconnect();
      toast.success("Το πορτοφόλι αποσυνδέθηκε επιτυχώς");
    } catch (error) {
      console.error("Σφάλμα αποσύνδεσης:", error);
      toast.error("Σφάλμα κατά την αποσύνδεση του πορτοφολιού");
    } finally {
      setIsLoading(false);
    }
  };

  // Αν δεν έχει συνδεθεί ακόμα, εμφάνισε το κουμπί σύνδεσης
  if (!connected) {
    return <WalletConnectButton isLoading={isLoading} />;
  }

  // Συντόμευση της διεύθυνσης του wallet για εμφάνιση
  const shortenedAddress = publicKey 
    ? `${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}`
    : '';

  // Αν είναι συνδεδεμένος, εμφάνισε το dropdown με τα στοιχεία του wallet και την επιλογή αποσύνδεσης
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Wallet className="h-4 w-4" />
          <span>{shortenedAddress}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleDisconnect} className="text-destructive cursor-pointer">
          <LogOut className="h-4 w-4 mr-2" />
          Αποσύνδεση
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
