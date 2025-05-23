
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { ArrowRight } from "lucide-react";

interface ConnectWalletCardProps {
  isConnecting?: boolean;
  isPhantomInstalled?: boolean;
}

export function ConnectWalletCard({ isConnecting = false, isPhantomInstalled = true }: ConnectWalletCardProps) {
  const { setVisible } = useWalletModal();
  
  // Handle connect wallet button click
  const handleConnectClick = () => {
    setVisible(true);
  };

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to the Platform</CardTitle>
          <CardDescription>
            Connect your Phantom wallet to start trading and managing your crypto assets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">How it works</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="bg-primary/10 text-primary p-1 rounded-full">✓</span>
                  Connect your Phantom wallet securely
                </li>
                <li className="flex items-center gap-2">
                  <span className="bg-primary/10 text-primary p-1 rounded-full">✓</span>
                  View your real SOL and token balances
                </li>
                <li className="flex items-center gap-2">
                  <span className="bg-primary/10 text-primary p-1 rounded-full">✓</span>
                  Set up automated trading bots
                </li>
                <li className="flex items-center gap-2">
                  <span className="bg-primary/10 text-primary p-1 rounded-full">✓</span>
                  Monitor your trading performance
                </li>
                <li className="flex items-center gap-2">
                  <span className="bg-primary/10 text-primary p-1 rounded-full">✓</span>
                  Manage your crypto portfolio efficiently
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={handleConnectClick} 
            disabled={isConnecting || !isPhantomInstalled}
          >
            {!isPhantomInstalled ? (
              "Install Phantom Wallet"
            ) : isConnecting ? (
              "Connecting..."
            ) : (
              <>
                Connect Wallet <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-2">
                <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">1</div>
                <div>
                  <h4 className="font-medium">Install Phantom Wallet</h4>
                  <p className="text-sm text-muted-foreground">Download and install the Phantom browser extension</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">2</div>
                <div>
                  <h4 className="font-medium">Connect Your Wallet</h4>
                  <p className="text-sm text-muted-foreground">Click the connect button and approve the connection</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">3</div>
                <div>
                  <h4 className="font-medium">Start Trading</h4>
                  <p className="text-sm text-muted-foreground">Configure your trading bots and start automated trading</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
