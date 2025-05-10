
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader, Wallet } from "lucide-react";

interface ConnectWalletCardProps {
  connectWallet: () => void;
  isConnecting: boolean;
  isPhantomInstalled: boolean;
}

export function ConnectWalletCard({ connectWallet, isConnecting, isPhantomInstalled }: ConnectWalletCardProps) {
  return (
    <Card className="border-dashed border-2 border-primary">
      <CardHeader className="text-center">
        <CardTitle>Συνδεθείτε με το Phantom Wallet</CardTitle>
        <CardDescription>Συνδεθείτε για να δείτε τα tokens και το ιστορικό των συναλλαγών σας</CardDescription>
      </CardHeader>
      <CardContent className="py-10 text-center">
        <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
          <Wallet className="h-10 w-10 text-primary" />
        </div>
        <Button 
          onClick={connectWallet} 
          className="flex mx-auto items-center gap-2 text-base px-6 py-5 h-auto"
          size="lg"
          disabled={isConnecting || !isPhantomInstalled}
        >
          {isConnecting ? (
            <>
              <Loader className="h-5 w-5 animate-spin" />
              Γίνεται σύνδεση...
            </>
          ) : (
            <>
              <Wallet className="h-5 w-5" />
              Σύνδεση με Phantom Wallet
            </>
          )}
        </Button>
        
        {!isPhantomInstalled && (
          <div className="mt-4 text-sm text-muted-foreground">
            <p>Χρειάζεστε το Phantom Wallet για να συνδεθείτε.</p>
            <a 
              href="https://phantom.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline font-medium"
            >
              Κάντε εγκατάσταση από το phantom.app
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
