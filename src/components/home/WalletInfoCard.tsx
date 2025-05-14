import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface WalletInfoCardProps {
  walletAddress: string;
  balance: number;
}

export function WalletInfoCard({ walletAddress, balance }: WalletInfoCardProps) {
  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    toast.success("Wallet address copied to clipboard!");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Πληροφορίες Πορτοφολιού</h3>
            <p className="text-sm text-muted-foreground">
              Διεύθυνση: {walletAddress}
            </p>
          </div>
          <Button variant="outline" size="icon" onClick={handleCopyAddress}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p>
            <strong>Υπόλοιπο SOL:</strong> {balance}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
