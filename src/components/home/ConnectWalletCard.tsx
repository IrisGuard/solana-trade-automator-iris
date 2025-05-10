
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

interface ConnectWalletCardProps {
  connectWallet: () => void;
}

export function ConnectWalletCard({ connectWallet }: ConnectWalletCardProps) {
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
        >
          <Wallet className="h-5 w-5" />
          Σύνδεση με Phantom Wallet
        </Button>
      </CardContent>
    </Card>
  );
}
