import React, { useEffect, useState } from "react";
import { ConnectWalletCard } from "@/components/home/ConnectWalletCard";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { useErrorReporting } from "@/hooks/useErrorReporting";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/hooks/useUser";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { PageHeader } from "@/components/layout/PageHeader";
import { AppNavigation } from "@/components/navigation/AppNavigation";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

// Define simple interfaces for bot data
interface BotData {
  id: string;
  active: boolean;
  user_id: string;
}

interface ChartDataPoint {
  name: string;
  value: number;
  month: string;
}

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
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  
  // Fetch bot status on component mount
  useEffect(() => {
    const fetchBotStatus = async () => {
      if (!isConnected || !walletAddress || !user?.id) return;
      
      try {
        // Simplified query without the problematic is_primary condition
        const { data, error } = await supabase
          .from('bots')
          .select('id,active,user_id')
          .eq('user_id', user.id)
          .limit(1);
          
        // Handle potential errors directly
        if (error) throw error;
        
        // Set bot status if data exists
        if (data && data.length > 0) {
          setBotActive(!!data[0].active);
        }
      } catch (err) {
        console.error('Error fetching bot status:', err);
        reportError(err instanceof Error ? err : new Error('Failed to fetch bot status'));
      }
    };
    
    fetchBotStatus();
    fetchPerformanceData();
  }, [isConnected, walletAddress, user?.id, reportError]);

  // Fetch performance data for the chart
  const fetchPerformanceData = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('bot_performance')
        .select('timestamp, profit_percentage')
        .eq('bot_id', (await getBotId()) || '')
        .order('timestamp', { ascending: true })
        .limit(7);
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Transform data for chart
        const chartPoints = data.map((point, index) => {
          const date = new Date(point.timestamp);
          const months = ['Ιαν', 'Φεβ', 'Μαρ', 'Απρ', 'Μάι', 'Ιουν', 'Ιουλ', 'Αυγ', 'Σεπ', 'Οκτ', 'Νοε', 'Δεκ'];
          const fullMonths = ['Ιανουάριος', 'Φεβρουάριος', 'Μάρτιος', 'Απρίλιος', 'Μάιος', 'Ιούνιος', 
                             'Ιούλιος', 'Αύγουστος', 'Σεπτέμβριος', 'Οκτώβριος', 'Νοέμβριος', 'Δεκέμβριος'];
          return {
            name: months[date.getMonth()],
            value: Math.round(point.profit_percentage * 100) / 100 * 1000, // Convert to reasonable chart value
            month: fullMonths[date.getMonth()]
          };
        });
        
        setChartData(chartPoints);
      } else {
        // Fallback chart data if no real data exists
        setChartData([
          { name: 'Ιαν', value: 1200, month: 'Ιανουάριος' },
          { name: 'Φεβ', value: 1900, month: 'Φεβρουάριος' },
          { name: 'Μαρ', value: 1500, month: 'Μάρτιος' },
          { name: 'Απρ', value: 2400, month: 'Απρίλιος' },
          { name: 'Μάι', value: 2200, month: 'Μάιος' },
          { name: 'Ιουν', value: 3000, month: 'Ιούνιος' },
          { name: 'Ιουλ', value: 2800, month: 'Ιούλιος' },
        ]);
      }
    } catch (err) {
      console.error('Error fetching performance data:', err);
      reportError(err instanceof Error ? err : new Error('Failed to fetch performance data'));
    }
  };

  // Helper function to get the bot ID
  const getBotId = async (): Promise<string | null> => {
    if (!user?.id) return null;
    
    try {
      const { data, error } = await supabase
        .from('bots')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);
        
      if (error) throw error;
      
      return data && data.length > 0 ? data[0].id : null;
    } catch (err) {
      console.error('Error getting bot ID:', err);
      return null;
    }
  };

  // Format wallet address for display
  const displayAddress = walletAddress 
    ? `${walletAddress.substring(0, 4)}...${walletAddress.substring(walletAddress.length - 4)}`
    : '';

  // Toggle bot status
  const toggleBotStatus = async (): Promise<void> => {
    if (!user?.id) return;
    
    setBotLoading(true);
    try {
      const newStatus = !botActive;
      
      // First, check if a bot exists for this user - without using is_primary
      const { data, error } = await supabase
        .from('bots')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Update existing bot
        const { error: updateError } = await supabase
          .from('bots')
          .update({ 
            active: newStatus, 
            updated_at: new Date().toISOString() 
          })
          .eq('id', data[0].id);
        
        if (updateError) throw updateError;
      } else {
        // Create new bot
        const { error: insertError } = await supabase
          .from('bots')
          .insert({ 
            user_id: user.id, 
            active: newStatus, 
            name: 'Default Bot', 
            strategy: 'basic'
          });
        
        if (insertError) throw insertError;
      }
      
      setBotActive(newStatus);
      // Update performance after toggling
      setTimeout(() => fetchPerformanceData(), 1000);
    } catch (err) {
      console.error('Error updating bot status:', err);
      reportError(err instanceof Error ? err : new Error('Failed to update bot status'));
    } finally {
      setBotLoading(false);
    }
  };

  // Fix the refreshWalletData handler for the button
  const handleRefreshClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    refreshWalletData();
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Πίνακας Ελέγχου"
        description={!userLoading && user?.username ? `Καλωσήρθατε, ${user.username}!` : "Συνολική επισκόπηση του χαρτοφυλακίου σας"}
        breadcrumbs={[{ label: "Dashboard" }]}
        variant="blue"
        actions={
          <Button 
            variant="outline" 
            onClick={handleRefreshClick}
            disabled={!isConnected || isLoadingTokens}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Ανανέωση Δεδομένων
          </Button>
        }
      />
      
      {/* Quick Navigation */}
      <div className="mb-6">
        <AppNavigation variant="colorful" />
      </div>

      {isConnected && walletAddress ? (
        <DashboardContent
          walletAddress={walletAddress}
          displayAddress={displayAddress}
          solBalance={solBalance}
          tokens={tokens}
          tokenPrices={tokenPrices}
          isLoadingTokens={isLoadingTokens}
          botActive={botActive}
          botLoading={botLoading}
          chartData={chartData}
          toggleBotStatus={toggleBotStatus}
          selectTokenForTrading={selectTokenForTrading}
        />
      ) : (
        <ConnectWalletCard isConnecting={isConnecting} /> 
      )}
    </div>
  );
}
