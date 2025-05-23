
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

interface SwapTabProps {
  isConnected: boolean;
}

export function SwapTab({ isConnected }: SwapTabProps) {
  if (!isConnected) {
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Connect Wallet to Swap</CardTitle>
          <CardDescription>You need to connect your wallet to use the swap feature</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <p className="text-muted-foreground">Wallet connection required</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowUpDown className="h-5 w-5" />
          Token Swap
        </CardTitle>
        <CardDescription>
          Swap between different tokens on Solana
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center py-8">
          <ArrowUpDown className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">Swap Feature Coming Soon</h3>
          <p className="text-muted-foreground mb-4">
            Token swapping functionality will be available in a future update.
          </p>
          <Button variant="outline" disabled>
            Coming Soon
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
