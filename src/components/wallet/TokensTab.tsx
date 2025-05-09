
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";

interface TokensTabProps {
  isConnected: boolean;
  tokenBalance: number;
  solBalance: number;
  handleConnectWallet: () => void;
}

export function TokensTab({
  isConnected,
  tokenBalance,
  solBalance,
  handleConnectWallet
}: TokensTabProps) {
  return (
    <TabsContent value="tokens" className="space-y-4">
      {isConnected ? (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Token Balance</CardTitle>
              <CardDescription>Your Solana SPL tokens</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b">
                <div className="flex items-center gap-2">
                  <div className="bg-primary rounded-full h-8 w-8 flex items-center justify-center">
                    <span className="text-primary-foreground">SOL</span>
                  </div>
                  <div>
                    <p className="font-medium">Solana</p>
                    <p className="text-sm text-muted-foreground">SOL</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{solBalance} SOL</p>
                  <p className="text-sm text-muted-foreground">≈ $1,245.00</p>
                </div>
              </div>

              <div className="flex items-center justify-between pb-2 border-b">
                <div className="flex items-center gap-2">
                  <div className="bg-green-500 rounded-full h-8 w-8 flex items-center justify-center">
                    <span className="text-white text-xs">TOKEN</span>
                  </div>
                  <div>
                    <p className="font-medium">Your Token</p>
                    <p className="text-sm text-muted-foreground">TOKEN</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{tokenBalance} TOKEN</p>
                  <p className="text-sm text-muted-foreground">≈ $2,500.00</p>
                </div>
              </div>

              <div className="flex items-center justify-between pb-2 border-b">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-500 rounded-full h-8 w-8 flex items-center justify-center">
                    <span className="text-white text-xs">USDC</span>
                  </div>
                  <div>
                    <p className="font-medium">USD Coin</p>
                    <p className="text-sm text-muted-foreground">USDC</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">1,532.25 USDC</p>
                  <p className="text-sm text-muted-foreground">≈ $1,532.25</p>
                </div>
              </div>

              <Button variant="outline" className="w-full">
                Add New Token
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Latest transactions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { type: "Transfer", time: new Date(Date.now() - 1 * 3600000), amount: "+0.1 SOL", to: "4fY2..sD8j" },
                { type: "Swap", time: new Date(Date.now() - 5 * 3600000), amount: "-10 USDC", to: "0.05 SOL" },
                { type: "Transfer", time: new Date(Date.now() - 12 * 3600000), amount: "-0.2 SOL", to: "8hK3..j2Lm" }
              ].map((tx, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium">{tx.type}</p>
                    <p className="text-sm text-muted-foreground">
                      {tx.time.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${tx.amount.startsWith('+') ? 'text-green-400' : ''}`}>{tx.amount}</p>
                    <p className="text-sm text-muted-foreground">{tx.type === "Swap" ? "For: " : "To: "}{tx.to}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Connect Wallet to View Tokens</CardTitle>
            <CardDescription>You need to connect your wallet to manage your tokens</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <Button onClick={handleConnectWallet}>Connect Wallet</Button>
          </CardContent>
        </Card>
      )}
    </TabsContent>
  );
}
