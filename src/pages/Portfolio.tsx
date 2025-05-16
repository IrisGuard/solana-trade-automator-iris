
import React from "react";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { Button } from "@/components/ui/button";
import { WalletTokensList } from "@/components/wallet/WalletTokensList";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { PageHeader } from "@/components/layout/PageHeader";
import { AppNavigation } from "@/components/navigation/AppNavigation";
import { GradientCard } from "@/components/ui/gradient-card";
import { RefreshCw, Wallet } from "lucide-react";

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
        <PageHeader 
          title="Πορτοφόλι"
          description="Συνδεθείτε με το wallet σας για να δείτε τα tokens σας"
          breadcrumbs={[{ label: "Πορτοφόλι" }]}
          variant="pink"
        />
        
        {/* Quick Navigation */}
        <div className="mb-6">
          <AppNavigation variant="colorful" />
        </div>
        
        <GradientCard
          variant="purple"
          header={
            <>
              <CardTitle>Συνδεθείτε με το Wallet</CardTitle>
              <CardDescription>
                Συνδέστε το πορτοφόλι σας για να δείτε το χαρτοφυλάκιο και τα tokens σας
              </CardDescription>
            </>
          }
        >
          <div className="flex justify-center py-10">
            <Button 
              onClick={connectWallet}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Wallet className="h-4 w-4 mr-2" />
              Σύνδεση με Wallet
            </Button>
          </div>
        </GradientCard>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Χαρτοφυλάκιο"
        description="Αναλυτική παρουσίαση των tokens και της κατανομής του χαρτοφυλακίου σας"
        breadcrumbs={[{ label: "Χαρτοφυλάκιο" }]}
        variant="pink"
        actions={
          <Button variant="outline" onClick={() => refreshWalletData()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Ανανέωση
          </Button>
        }
      />
      
      {/* Quick Navigation */}
      <div className="mb-6">
        <AppNavigation variant="colorful" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <GradientCard
          variant="purple"
          header={
            <>
              <CardTitle>Τα Tokens Μου</CardTitle>
              <CardDescription>
                Λίστα με όλα τα tokens στο πορτοφόλι σας
              </CardDescription>
            </>
          }
        >
          <WalletTokensList tokens={tokens || []} isLoading={isLoadingTokens} />
        </GradientCard>
        
        <GradientCard
          variant="blue"
          header={
            <>
              <CardTitle>Κατανομή Portfolio</CardTitle>
              <CardDescription>
                Η οπτικοποίηση της κατανομής των tokens στο πορτοφόλι σας
              </CardDescription>
            </>
          }
        >
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
        </GradientCard>
      </div>
      
      {/* Portfolio stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GradientCard variant="green">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">Συνολική Αξία</h3>
            <p className="text-2xl font-bold">{solBalance?.toFixed(4) || '0'} SOL</p>
            <p className="text-sm text-muted-foreground mt-1">
              + {tokens?.length || '0'} Tokens
            </p>
          </div>
        </GradientCard>
        
        <GradientCard variant="amber">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">Ημερήσια Μεταβολή</h3>
            <p className="text-2xl font-bold text-emerald-500">+2.5%</p>
            <p className="text-sm text-muted-foreground mt-1">
              Σύγκριση με χθες
            </p>
          </div>
        </GradientCard>
        
        <GradientCard variant="pink">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">Bot Απόδοση</h3>
            <p className="text-2xl font-bold text-emerald-500">+15.8%</p>
            <p className="text-sm text-muted-foreground mt-1">
              Συνολική απόδοση
            </p>
          </div>
        </GradientCard>
      </div>
    </div>
  );
}
