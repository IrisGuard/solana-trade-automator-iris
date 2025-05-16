
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
    <div className="space-y-6">
      {/* Navigation Menu */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Link to="/dashboard">
          <Button variant="outline" className="w-full flex items-center gap-2 h-16">
            <HomeIcon className="h-5 w-5" />
            <span>Dashboard</span>
          </Button>
        </Link>
        <Link to="/wallet">
          <Button variant="outline" className="w-full flex items-center gap-2 h-16">
            <Wallet className="h-5 w-5" />
            <span>Wallet</span>
          </Button>
        </Link>
        <Link to="/bot-control">
          <Button variant="outline" className="w-full flex items-center gap-2 h-16">
            <Bot className="h-5 w-5" />
            <span>Trading Bot</span>
          </Button>
        </Link>
        <Link to="/help">
          <Button variant="outline" className="w-full flex items-center gap-2 h-16">
            <HelpCircle className="h-5 w-5" />
            <span>Βοήθεια</span>
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="flex-1">
              <CardTitle className="text-xl sm:text-2xl">Καλώς ήρθατε στο Solana Trade Automator</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Αυτοματοποιήστε τις συναλλαγές σας και διαχειριστείτε τα περιουσιακά σας στοιχεία με ασφάλεια
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  );
}
