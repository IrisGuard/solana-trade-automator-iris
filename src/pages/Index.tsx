
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

const Index = () => {
  const { connected, connecting } = useWallet();
  
  return (
    <div className="container mx-auto space-y-8 pb-8">
      {/* Hero Section */}
      <HeroSection />

      {/* API Key Action */}
      <div className="flex justify-center my-8">
        <AddHeliusButton />
      </div>
      
      {/* Supabase API Keys List */}
      <div className="my-8">
        <SupabaseApiKeysList />
      </div>

      {/* Main Content */}
      {!connected && (
        <WalletDisconnectedContent 
          isConnecting={connecting}
          isPhantomInstalled={true}
        />
      )}
      
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
