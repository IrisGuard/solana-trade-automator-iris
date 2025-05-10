
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Wallet, Copy } from "lucide-react";
import { toast } from "sonner";
import { formatWalletAddress } from "@/utils/walletUtils";

interface WalletInfoCardProps {
  walletAddress: string;
  solBalance: number;
}

export function WalletInfoCard({ walletAddress, solBalance }: WalletInfoCardProps) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);
    toast.success("Η διεύθυνση πορτοφολιού αντιγράφηκε!");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-primary" />
          <div>
            <CardTitle>Στοιχεία Πορτοφολιού</CardTitle>
            <CardDescription>Πληροφορίες για το συνδεδεμένο πορτοφόλι σας</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-3 bg-muted rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Διεύθυνση:</span>
            <div className="flex items-center gap-1">
              <span className="font-mono text-sm">{formatWalletAddress(walletAddress)}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0" 
                onClick={copyToClipboard}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Υπόλοιπο:</span>
            <span className="text-sm font-bold">{solBalance} SOL</span>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            Τελευταία ενημέρωση: {new Date().toLocaleTimeString()}
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full flex items-center justify-center gap-2"
          onClick={() => window.open(`https://solscan.io/account/${walletAddress}`, '_blank')}
        >
          <ExternalLink className="h-4 w-4" />
          Προβολή στο Solscan
        </Button>
      </CardContent>
      <CardFooter className="pt-2 text-xs text-center text-muted-foreground">
        <p className="w-full">Συνδεδεμένο μέσω Phantom Wallet</p>
      </CardFooter>
    </Card>
  );
}
