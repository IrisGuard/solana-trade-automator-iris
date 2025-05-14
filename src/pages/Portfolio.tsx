
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { Button } from "@/components/ui/button";
import { WalletTokensList } from "@/components/wallet/WalletTokensList";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function Portfolio() {
  const {
    isConnected,
    walletAddress,
    solBalance,
    tokens,
    isLoadingTokens,
    connectWallet,
    refreshWalletData
  } = useWalletConnection();

  // Generate pie chart data from tokens
  const chartData = React.useMemo(() => {
    if (!tokens || tokens.length === 0) {
      return [{ name: "SOL", value: solBalance || 0 }];
    }

    return [
      { name: "SOL", value: solBalance || 0 },
      ...tokens.map(token => ({
        name: token.symbol,
        value: token.amount
      }))
    ];
  }, [tokens, solBalance]);

  if (!isConnected) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-3xl font-bold tracking-tight">Πορτοφόλι</h2>
        </div>
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Συνδεθείτε με το Wallet</CardTitle>
            <CardDescription>
              Συνδεθείτε για να δείτε το πορτοφόλι και τα tokens σας
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <Button onClick={connectWallet}>Σύνδεση με Wallet</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Πορτοφόλι</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => refreshWalletData()}>Ανανέωση</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <WalletTokensList tokens={tokens || []} isLoading={isLoadingTokens} />
        
        <Card>
          <CardHeader>
            <CardTitle>Κατανομή Portfolio</CardTitle>
            <CardDescription>
              Η κατανομή των tokens στο πορτοφόλι σας
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
