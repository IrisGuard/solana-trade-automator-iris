
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Wallet, AlertCircle } from "lucide-react";
import { WalletConnectButton } from "@/components/wallet/WalletConnectButton";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

interface ConnectWalletCardProps {
  isConnecting?: boolean;
  isPhantomInstalled?: boolean;
}

export function ConnectWalletCard({ isConnecting = false, isPhantomInstalled = true }: ConnectWalletCardProps) {
  return (
    <Card className="border-dashed border-2 border-primary transition-all hover:shadow-md">
      <CardHeader className="text-center">
        <CardTitle>Συνδεθείτε με το Wallet σας</CardTitle>
        <CardDescription>Συνδεθείτε για να δείτε τα tokens και το ιστορικό των συναλλαγών σας</CardDescription>
      </CardHeader>
      <CardContent className="py-10 text-center">
        <div className={`mx-auto mb-6 h-20 w-20 rounded-full ${isConnecting ? 'bg-primary/20 animate-pulse' : 'bg-primary/10'} flex items-center justify-center transition-all`}>
          <Wallet className={`${isConnecting ? 'text-primary/80' : 'text-primary'} h-10 w-10 transition-all`} />
        </div>
        
        <div className="flex justify-center">
          <WalletMultiButton className="bg-primary text-white hover:bg-primary/90 rounded-md flex items-center gap-2 px-4 py-2">
            Σύνδεση με Wallet
          </WalletMultiButton>
        </div>
        
        {!isPhantomInstalled && (
          <div className="mt-6 text-sm p-3 rounded-md bg-muted">
            <div className="flex items-center gap-2 text-orange-600 mb-1">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">Απαιτείται το Phantom Wallet</span>
            </div>
            <p>Χρειάζεστε το Phantom Wallet για να συνδεθείτε.</p>
            <a 
              href="https://phantom.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline font-medium mt-2 inline-block hover:text-primary/80 transition-colors"
            >
              Κάντε εγκατάσταση από το phantom.app
            </a>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0 pb-4 text-center justify-center text-sm text-muted-foreground">
        <p>Το trading bot χρησιμοποιεί το Solana Wallet για την εκτέλεση συναλλαγών</p>
      </CardFooter>
    </Card>
  );
}
