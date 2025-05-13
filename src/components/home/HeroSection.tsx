
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Lock, Wallet, Zap } from "lucide-react";
import { WalletConnectButton } from "@/components/wallet/WalletConnectButton";
import { WalletConnectButtonSafe } from "@/components/wallet/WalletConnectButtonSafe";
import { toast } from "sonner";

export function HeroSection() {
  const navigate = useNavigate();
  
  // Αφαιρώ το useWalletStatus που προκαλεί σφάλματα
  const isConnected = false; // default to false for landing page
  
  const handleNavigateWithToast = (path: string, message: string) => {
    toast.success(message);
    navigate(path);
  };
  
  return (
    <div className="py-10 md:py-16 px-4 flex flex-col items-center text-center">
      <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
        Solana Trade Automator
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mb-8">
        Διαχειριστείτε τα κρυπτονομίσματά σας, αυτοματοποιήστε τις συναλλαγές σας και παρακολουθήστε τα κεφάλαιά σας - όλα από ένα μέρος
      </p>
      
      <div className="flex flex-col md:flex-row gap-4 w-full max-w-md justify-center">
        {isConnected ? (
          <Button
            size="lg"
            onClick={() => handleNavigateWithToast('/home', 'Μετάβαση στο Dashboard')}
            className="gap-2 w-full md:w-auto"
          >
            <Zap className="h-5 w-5" />
            Είσοδος στο Dashboard
          </Button>
        ) : (
          <WalletConnectButtonSafe
            variant="default"
            size="lg"
            className="gap-2 w-full md:w-auto"
          >
            <Wallet className="h-5 w-5" />
            Σύνδεση με Wallet
          </WalletConnectButtonSafe>
        )}
        <Button
          variant="outline"
          size="lg"
          onClick={() => handleNavigateWithToast('/bot-control', 'Μετάβαση στα Trading Bots')}
          className="gap-2 w-full md:w-auto"
        >
          <Zap className="h-5 w-5" />
          <span>Trading Bots</span>
        </Button>
      </div>
    </div>
  );
}
