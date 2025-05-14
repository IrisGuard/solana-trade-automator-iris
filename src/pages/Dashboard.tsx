import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ConnectWalletCard } from "@/components/home/ConnectWalletCard";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { Button } from "@/components/ui/button";
import { User, AreaChart, Wallet, Coins, Activity, ArrowUpDown } from "lucide-react";
import { AreaChart as RechartsAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useErrorReporting } from "@/hooks/useErrorReporting";
import { BotStatusCard } from "@/components/home/BotStatusCard";
import { TokensCard } from "@/components/home/TokensCard";
import { TransactionsCard } from "@/components/home/TransactionsCard";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/hooks/useUser";

// Sample chart data (we'll update this to use real data later)
const chartData = [
  { name: 'Ιαν', value: 1200, month: 'Ιανουάριος' },
  { name: 'Φεβ', value: 1900, month: 'Φεβρουάριος' },
  { name: 'Μαρ', value: 1500, month: 'Μάρτιος' },
  { name: 'Απρ', value: 2400, month: 'Απρίλιος' },
  { name: 'Μάι', value: 2200, month: 'Μάιος' },
  { name: 'Ιουν', value: 3000, month: 'Ιούνιος' },
  { name: 'Ιουλ', value: 2800, month: 'Ιούλιος' },
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

  const { user, loading: userLoading } = useUser();
  const { reportError } = useErrorReporting();
  const [botActive, setBotActive] = useState(false);
  const [botLoading, setBotLoading] = useState(false);
  
  // Fetch bot status on component mount
  useEffect(() => {
    const fetchBotStatus = async () => {
      if (!isConnected || !walletAddress) return;
      
      try {
        const { data, error } = await supabase
          .from('bots')
          .select('active')
          .eq('user_id', user?.id)
          .eq('is_primary', true)
          .maybeSingle();
        
        if (error) throw error;
        if (data) setBotActive(data.active || false);
      } catch (err) {
        console.error('Error fetching bot status:', err);
        reportError(err instanceof Error ? err : new Error('Failed to fetch bot status'));
      }
    };
    
    fetchBotStatus();
  }, [isConnected, walletAddress, user?.id, reportError]);

  // Format wallet address for display
  const displayAddress = walletAddress 
    ? `${walletAddress.substring(0, 4)}...${walletAddress.substring(walletAddress.length - 4)}`
    : '';

  // Toggle bot status
  const toggleBotStatus = async () => {
    if (!user?.id) return;
    
    setBotLoading(true);
    try {
      const newStatus = !botActive;
      const { error } = await supabase
        .from('bots')
        .update({ active: newStatus, updated_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('is_primary', true);
      
      if (error) throw error;
      setBotActive(newStatus);
    } catch (err) {
      console.error('Error updating bot status:', err);
      reportError(err instanceof Error ? err : new Error('Failed to update bot status'));
    } finally {
      setBotLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Πίνακας Ελέγχου</h2>
          {user && !userLoading && (
            <p className="text-muted-foreground">
              Καλωσήρθατε{user.username ? `, ${user.username}` : ''}!
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={() => refreshWalletData()}
            disabled={!isConnected}
          >
            Ανανέωση Δεδομένων
          </Button>
        </div>
      </div>

      {isConnected && walletAddress ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Υπόλοιπο SOL</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
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
                <Coins className="h-4 w-4 text-muted-foreground" />
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
                <CardTitle className="text-sm font-medium">Συναλλαγές</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 items-baseline">
                  <div className="text-2xl font-bold">12</div>
                  <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Τελευταίες 30 ημέρες
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Απόδοση Χαρτοφυλακίου</CardTitle>
              <CardDescription>
                Η απόδοση του χαρτοφυλακίου σας τους τελευταίους 7 μήνες (σε SOL)
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsAreaChart
                    data={chartData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 30,
                    }}
                  >
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      label={{ 
                        value: 'Μήνας', 
                        position: 'insideBottom', 
                        offset: -15 
                      }} 
                    />
                    <YAxis 
                      label={{ 
                        value: 'Αξία (SOL)', 
                        angle: -90, 
                        position: 'insideLeft', 
                        style: { textAnchor: 'middle' } 
                      }} 
                    />
                    <Tooltip 
                      formatter={(value: any) => [`${value} SOL`, 'Αξία']}
                      labelFormatter={(label) => {
                        const dataPoint = chartData.find(item => item.name === label);
                        return dataPoint ? dataPoint.month : label;
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#8884d8" 
                      fillOpacity={1} 
                      fill="url(#colorValue)" 
                      name="Αξία"
                    />
                  </RechartsAreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <BotStatusCard 
              isActive={botActive} 
              isLoading={botLoading} 
              toggleBotStatus={toggleBotStatus} 
            />
            
            <TokensCard 
              walletAddress={walletAddress} 
              tokens={tokens} 
              tokenPrices={tokenPrices} 
              isLoading={isLoadingTokens} 
            />
          </div>

          <TransactionsCard 
            walletAddress={walletAddress} 
            displayAddress={displayAddress} 
          />
        </>
      ) : (
        <ConnectWalletCard isConnecting={isConnecting} /> 
      )}
    </div>
  );
}
