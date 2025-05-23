
import React from "react";
import { ConnectWalletCard } from "./ConnectWalletCard";
import { PlatformInfoCard } from "./PlatformInfoCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface WalletDisconnectedContentProps {
  isConnecting: boolean;
  isPhantomInstalled?: boolean;
}

export function WalletDisconnectedContent({ 
  isConnecting,
  isPhantomInstalled = true,
}: WalletDisconnectedContentProps) {
  return (
    <div className="space-y-6">
      {!isPhantomInstalled && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Phantom Wallet is not installed. Please install it to connect.
          </AlertDescription>
        </Alert>
      )}
      
      {/* Grid content */}
      <div className="grid md:grid-cols-2 gap-6">
        <ConnectWalletCard 
          isConnecting={isConnecting}
          isPhantomInstalled={isPhantomInstalled}
        />
        <PlatformInfoCard />
      </div>

      {/* Additional Info */}
      <Card>
        <CardHeader>
          <CardTitle>Welcome to Solana Trade Automator</CardTitle>
          <CardDescription>
            To use all features of the application, please connect your Phantom Wallet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>
              Solana Trade Automator is an application for automated trading on the Solana network.
              You can browse some pages without connecting, but full functionality requires wallet connection.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <Link to="/home" className="text-primary hover:underline text-center py-2 border rounded-md hover:bg-primary/5">
                View Dashboard
              </Link>
              <Link to="/help" className="text-primary hover:underline text-center py-2 border rounded-md hover:bg-primary/5">
                Usage Instructions
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
