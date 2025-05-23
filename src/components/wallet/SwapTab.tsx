
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JupiterSwapForm } from "./swap/JupiterSwapForm";
import { RaydiumSwapForm } from "./swap/RaydiumSwapForm";
import { useWalletConnection } from "@/hooks/useWalletConnection";

interface SwapTabProps {
  isConnected: boolean;
}

export function SwapTab({ isConnected }: SwapTabProps) {
  const { connectWallet } = useWalletConnection();

  return (
    <TabsContent value="swap" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Token Swap</CardTitle>
          <CardDescription>
            Ανταλλάξτε tokens στο Solana network
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="jupiter" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="jupiter">Jupiter</TabsTrigger>
              <TabsTrigger value="raydium">Raydium</TabsTrigger>
            </TabsList>
            
            <TabsContent value="jupiter" className="mt-6">
              <JupiterSwapForm />
            </TabsContent>
            
            <TabsContent value="raydium" className="mt-6">
              <RaydiumSwapForm 
                isConnected={isConnected} 
                connectWallet={async () => connectWallet()} 
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
