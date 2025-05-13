
import React, { useEffect } from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { WalletConnectedContent } from "@/components/home/WalletConnectedContent";
import { WalletDisconnectedContent } from "@/components/home/WalletDisconnectedContent";
import { FaqSection } from "@/components/home/FaqSection";
import { FooterSection } from "@/components/home/FooterSection";
import { BotExplanationSection } from "@/components/home/BotExplanationSection";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { formatWalletAddress } from "@/utils/walletUtils";
import { useSolanaWallet } from "@/hooks/useSolanaWallet";
import { toast } from "sonner";

const Index = () => {
  console.log("Index component initialized");
  
  const { 
    connected,
    walletAddress,
    balance,
    tokens,
    connecting,
    isLoadingTokens,
    isLoadingBalance,
    connectionError,
    selectWallet,
    connectWallet
  } = useSolanaWallet();
  
  console.log("SolanaWallet hook loaded, connection status:", connected);
  
  const displayAddress = walletAddress ? formatWalletAddress(walletAddress) : "";
  const isPhantomInstalled = typeof window !== 'undefined' && window.phantom?.solana;
  
  // Εμφάνιση σφάλματος σύνδεσης αν υπάρχει
  useEffect(() => {
    if (connectionError) {
      toast.error(`Σφάλμα σύνδεσης: ${connectionError}`, {
        duration: 5000,
      });
    }
    
    console.log("Index component mounted, wallet status:", connected ? "Connected" : "Not connected");
  }, [connectionError, connected]);

  return (
    <div className="container mx-auto space-y-8 pb-8">
      {/* Hero Section */}
      <HeroSection />

      {/* Εμφάνιση σφάλματος αν υπάρχει */}
      {connectionError && (
        <Alert variant="destructive" className="my-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {connectionError}. Παρακαλώ δοκιμάστε ξανά ή επικοινωνήστε με την υποστήριξη.
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      {connected && walletAddress ? (
        <WalletConnectedContent 
          walletAddress={walletAddress} 
          solBalance={balance || 0} 
          tokens={tokens} 
          displayAddress={displayAddress}
          isLoadingTokens={isLoadingTokens || isLoadingBalance}
          connectionError={connectionError}
        />
      ) : (
        <WalletDisconnectedContent 
          isConnecting={connecting}
          isPhantomInstalled={!!isPhantomInstalled}
        />
      )}
      
      {/* Bot Explanation Section */}
      <BotExplanationSection />
      
      {/* FAQ Section */}
      <FaqSection />
      
      {/* Footer */}
      <FooterSection />
    </div>
  );
};

export default Index;
