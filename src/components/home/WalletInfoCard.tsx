
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface WalletInfoCardProps {
  walletAddress: string;
  solBalance: number;
}

export function WalletInfoCard({ walletAddress, solBalance }: WalletInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Στοιχεία Πορτοφολιού</CardTitle>
        <CardDescription>Πληροφορίες για το συνδεδεμένο πορτοφόλι σας</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Διεύθυνση:</span>
            <span className="font-mono text-sm">{walletAddress}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Υπόλοιπο:</span>
            <span className="text-sm">{solBalance} SOL</span>
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
        </div>
      </CardContent>
    </Card>
  );
}
