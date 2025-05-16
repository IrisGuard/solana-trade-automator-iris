
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WalletConnectedContent } from "@/components/home/WalletConnectedContent";
import { WalletDisconnectedContent } from "@/components/home/WalletDisconnectedContent";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2, Home as HomeIcon, Wallet, Bot, Shield, HelpCircle } from "lucide-react";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { useLanguage } from "@/hooks/use-language";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { EnhancedLandingNav } from "@/components/home/enhanced/EnhancedLandingNav";
import { GradientHeading } from "@/components/ui/gradient-heading";
import { GradientCard } from "@/components/ui/gradient-card";

export default function Home() {
  const [isPageLoading, setIsPageLoading] = useState(true);
  
  const { 
    isConnected, 
    walletAddress, 
    solBalance, 
    tokens, 
    isConnecting, 
    isLoadingTokens, 
    error: connectionError,
    isPhantomInstalled,
    connectWallet,
    disconnectWallet,
    refreshWalletData,
    selectTokenForTrading,
    tokenPrices
  } = useWalletConnection();
  
  const { t } = useLanguage();
  
  // Διασφαλίζουμε ότι το walletAddress είναι string πριν χρησιμοποιήσουμε substring
  const displayAddress = typeof walletAddress === 'string' && walletAddress ? 
    `${walletAddress.substring(0, 4)}...${walletAddress.substring(walletAddress.length - 4)}` : 
    "Δεν έχει συνδεθεί πορτοφόλι";
  
  // Wrapper for connectWallet to match expected return type
  const handleConnectWallet = async () => {
    await connectWallet();
  };
  
  useEffect(() => {
    console.log("Home page loaded. Connection status:", isConnected ? "Connected" : "Not connected");
    
    // Simulate page loading to ensure components are properly initialized
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [isConnected]);
  
  // Handle error with page load
  if (isPageLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
          <p className="text-muted-foreground">Φόρτωση σελίδας...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <GradientHeading as="h1" variant="blue" className="mb-2">
          Καλώς ήρθατε στο Solana Trade Automator
        </GradientHeading>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Αυτοματοποιήστε τις συναλλαγές σας στο Solana blockchain και διαχειριστείτε τα περιουσιακά σας στοιχεία με ασφάλεια και ευκολία.
        </p>
      </div>

      {/* Enhanced Navigation Menu */}
      <EnhancedLandingNav />

      {/* Main Card */}
      <GradientCard
        variant="blue"
        header={
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="flex-1">
              <CardTitle className="text-xl sm:text-2xl">Κατάσταση Πορτοφολιού</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Συνδεθείτε με το πορτοφόλι σας για να διαχειριστείτε τα tokens σας
              </CardDescription>
            </div>
          </div>
        }
      >
        {connectionError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Σφάλμα σύνδεσης: {connectionError}. Παρακαλώ δοκιμάστε ξανά αργότερα.
            </AlertDescription>
          </Alert>
        )}
        
        {isConnected ? (
          <WalletConnectedContent 
            walletAddress={walletAddress} 
            displayAddress={displayAddress}
            solBalance={solBalance}
            tokens={tokens}
            tokenPrices={tokenPrices}
            isLoadingTokens={isLoadingTokens}
            connectionError={connectionError}
            selectTokenForTrading={selectTokenForTrading}
          />
        ) : (
          <WalletDisconnectedContent 
            isConnecting={isConnecting}
            isPhantomInstalled={isPhantomInstalled}
          />
        )}
      </GradientCard>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <GradientCard variant="purple">
          <div className="flex flex-col items-center text-center p-4">
            <div className="bg-purple-500/10 p-3 rounded-full mb-4">
              <Bot className="h-8 w-8 text-purple-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">Trading Bot</h3>
            <p className="text-muted-foreground mb-4">
              Αυτοματοποιήστε τις συναλλαγές σας με τη χρήση προηγμένων αλγορίθμων και στρατηγικών.
            </p>
            <Link to="/bot-control">
              <Button variant="outline" className="border-purple-400/30 hover:bg-purple-500/10">
                Ρυθμίσεις Bot
              </Button>
            </Link>
          </div>
        </GradientCard>

        <GradientCard variant="green">
          <div className="flex flex-col items-center text-center p-4">
            <div className="bg-emerald-500/10 p-3 rounded-full mb-4">
              <Wallet className="h-8 w-8 text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">Διαχείριση Πορτοφολιού</h3>
            <p className="text-muted-foreground mb-4">
              Παρακολουθήστε το υπόλοιπο και τα tokens σας με απλό και εύχρηστο τρόπο.
            </p>
            <Link to="/wallet">
              <Button variant="outline" className="border-emerald-400/30 hover:bg-emerald-500/10">
                Το Πορτοφόλι μου
              </Button>
            </Link>
          </div>
        </GradientCard>

        <GradientCard variant="amber">
          <div className="flex flex-col items-center text-center p-4">
            <div className="bg-amber-500/10 p-3 rounded-full mb-4">
              <Shield className="h-8 w-8 text-amber-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">Ασφάλεια</h3>
            <p className="text-muted-foreground mb-4">
              Προηγμένα χαρακτηριστικά ασφαλείας για την προστασία των περιουσιακών σας στοιχείων.
            </p>
            <Link to="/api-vault">
              <Button variant="outline" className="border-amber-400/30 hover:bg-amber-500/10">
                Ρυθμίσεις Ασφαλείας
              </Button>
            </Link>
          </div>
        </GradientCard>
      </div>
    </div>
  );
}
