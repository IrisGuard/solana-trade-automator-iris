
import React from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { WalletDisconnectedContent } from "@/components/home/WalletDisconnectedContent";
import { FaqSection } from "@/components/home/FaqSection";
import { FooterSection } from "@/components/home/FooterSection";
import { BotExplanationSection } from "@/components/home/BotExplanationSection";
import { useWallet } from '@solana/wallet-adapter-react';
import { Toaster } from "sonner";
import { AddHeliusButton } from "@/components/security/apiVault/AddHeliusButton";
import { SupabaseApiKeysList } from "@/components/security/SupabaseApiKeysList";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  const { connected, connecting } = useWallet();
  
  return (
    <div className="container mx-auto space-y-8 pb-8">
      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      {!connected && (
        <WalletDisconnectedContent 
          isConnecting={connecting}
          isPhantomInstalled={true}
        />
      )}

      {/* Additional Navigation for Preview */}
      <div className="flex flex-col gap-4 my-8 border p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold text-center">Άμεση Πρόσβαση στις Σελίδες</h2>
        <p className="text-center text-muted-foreground mb-4">
          Μπορείτε να περιηγηθείτε στις βασικές σελίδες της εφαρμογής παρακάτω
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/home">
            <Button variant="outline" className="w-full">Dashboard</Button>
          </Link>
          <Link to="/wallet">
            <Button variant="outline" className="w-full">Wallet & Trading</Button>
          </Link>
          <Link to="/security">
            <Button variant="outline" className="w-full">Security & API</Button>
          </Link>
        </div>
      </div>
      
      {/* API Key Action */}
      <div className="flex justify-center my-8">
        <AddHeliusButton />
      </div>
      
      {/* Supabase API Keys List */}
      <div className="my-8">
        <SupabaseApiKeysList />
      </div>
      
      {/* Bot Explanation Section */}
      <BotExplanationSection />
      
      {/* FAQ Section */}
      <FaqSection />
      
      {/* Footer */}
      <FooterSection />
      
      <Toaster position="top-center" richColors closeButton />
    </div>
  );
};

export default Index;
