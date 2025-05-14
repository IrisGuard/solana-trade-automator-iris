
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyIcon, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface WalletInfoCardProps {
  walletAddress: string;
  balance: number;
  onDisconnect?: () => void;
}

export function WalletInfoCard({ walletAddress, balance, onDisconnect }: WalletInfoCardProps) {
  const shortAddress = walletAddress && typeof walletAddress === 'string' ? 
    `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 
    "Δεν έχει συνδεθεί πορτοφόλι";
  
  const handleCopyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      toast.success("Η διεύθυνση αντιγράφηκε στο πρόχειρο");
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div>
            <CardTitle>Πορτοφόλι</CardTitle>
            <CardDescription>Συνδεδεμένη διεύθυνση</CardDescription>
          </div>
          {onDisconnect && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2"
              onClick={onDisconnect}
            >
              <LogOut className="h-4 w-4 mr-1" />
              <span className="sr-only sm:not-sr-only">Αποσύνδεση</span>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-full">
              <img 
                src="/solana-logo.png" 
                alt="Solana Logo" 
                className="h-6 w-6"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://cryptologos.cc/logos/solana-sol-logo.png?v=024';
                }} 
              />
            </div>
            <div className="font-medium">{shortAddress}</div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleCopyAddress}>
              <CopyIcon className="h-4 w-4" />
              <span className="sr-only">Αντιγραφή διεύθυνσης</span>
            </Button>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">SOL Balance:</span>
            <span className="font-bold">{balance.toFixed(4)} SOL</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
