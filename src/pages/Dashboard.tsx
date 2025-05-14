
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WalletConnectedContent } from "@/components/home/WalletConnectedContent";
import { ConnectWalletCard } from "@/components/home/ConnectWalletCard";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const chartData = [
  { name: 'Jan', value: 1200 },
  { name: 'Feb', value: 1900 },
  { name: 'Mar', value: 1500 },
  { name: 'Apr', value: 2400 },
  { name: 'May', value: 2200 },
  { name: 'Jun', value: 3000 },
  { name: 'Jul', value: 2800 },
];

export default function Dashboard() {
  const {
    isConnected,
    walletAddress,
    isConnecting,
    solBalance,
    tokens,
    tokenPrices,
    isLoadingTokens,
    connectWallet,
    refreshWalletData,
    selectTokenForTrading
  } = useWalletConnection();

  // Convert tokenPrices to the expected format for WalletConnectedContent
  const simplifiedTokenPrices: Record<string, number> = {};
  
  if (tokenPrices) {
    Object.entries(tokenPrices).forEach(([address, priceData]) => {
      simplifiedTokenPrices[address] = priceData.price;
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => refreshWalletData()}>Ανανέωση</Button>
        </div>
      </div>

      {isConnected && walletAddress ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Υπόλοιπο SOL</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{solBalance?.toFixed(4) || "0"} SOL</div>
                <p className="text-xs text-muted-foreground">
                  +2.5% από την προηγούμενη εβδομάδα
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tokens</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tokens?.length || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {tokens && tokens.length > 0 ? tokens[0]?.symbol : "Δεν υπάρχουν tokens"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bot Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Ανενεργό</div>
                <p className="text-xs text-muted-foreground">
                  Ενεργοποιήστε το bot για αυτόματες συναλλαγές
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Portfolio Performance</CardTitle>
              <CardDescription>
                Η απόδοση του χαρτοφυλακίου σας τους τελευταίους μήνες
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <WalletConnectedContent 
            walletAddress={walletAddress}
            solBalance={solBalance}
            tokens={tokens}
            tokenPrices={simplifiedTokenPrices}
            isLoadingTokens={isLoadingTokens}
            selectTokenForTrading={selectTokenForTrading}
          />
        </>
      ) : (
        <ConnectWalletCard 
          isConnecting={isConnecting} 
        />
      )}
    </div>
  );
}
