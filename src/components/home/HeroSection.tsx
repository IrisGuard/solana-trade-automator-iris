
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Lock, Wallet } from "lucide-react";
import { WalletConnectButton } from "@/components/wallet/WalletConnectButton";
import { useWalletStatus } from "@/hooks/useWalletStatus";

export function HeroSection() {
  const navigate = useNavigate();
  const { isConnected } = useWalletStatus();
  
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
            onClick={() => navigate('/home')}
            className="gap-2 w-full md:w-auto"
          >
            Είσοδος στο Dashboard
          </Button>
        ) : (
          <WalletConnectButton
            variant="default"
            size="lg"
            className="gap-2 w-full md:w-auto"
          >
            <Wallet className="h-5 w-5" />
            Σύνδεση με Wallet
          </WalletConnectButton>
        )}
        <Button
          variant="outline"
          size="lg"
          onClick={() => navigate('/api-vault')}
          className="gap-2 w-full md:w-auto"
        >
          <Lock className="h-5 w-5" />
          <span>Κλειδοθήκη API</span>
        </Button>
      </div>
    </div>
  );
}
