
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

interface ConnectWalletCardProps {
  connectWallet: () => void;
}

export function ConnectWalletCard({ connectWallet }: ConnectWalletCardProps) {
  return (
    <Card className="border-dashed">
      <CardHeader className="text-center">
        <CardTitle>Συνδεθείτε με το Phantom Wallet</CardTitle>
        <CardDescription>Συνδεθείτε για να δείτε τα tokens και το ιστορικό των συναλλαγών σας</CardDescription>
      </CardHeader>
      <CardContent className="py-10 text-center">
        <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-muted flex items-center justify-center">
          <Wallet className="h-10 w-10 text-muted-foreground" />
        </div>
        <Button onClick={connectWallet} className="flex mx-auto items-center gap-2">
          <Wallet className="h-4 w-4" />
          Σύνδεση με Phantom Wallet
        </Button>
      </CardContent>
    </Card>
  );
}
