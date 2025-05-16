
import React, { useEffect, useState } from "react";
import { ConnectWalletCard } from "@/components/home/ConnectWalletCard";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { useErrorReporting } from "@/hooks/useErrorReporting";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/hooks/useUser";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardContent } from "@/components/dashboard/DashboardContent";

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

// Define a simple interface for bot data to avoid infinite type instantiation
interface BotData {
  id: string;
  active: boolean;
  user_id: string;
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
  
  // Fetch bot status on component mount
  useEffect(() => {
    const fetchBotStatus = async () => {
      if (!isConnected || !walletAddress || !user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('bots')
          .select('active')
          .eq('user_id', user.id)
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
  const toggleBotStatus = async (): Promise<void> => {
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
      <DashboardHeader
        username={user?.username}
        userLoading={userLoading}
        isConnected={isConnected}
        onRefreshData={refreshWalletData}
      />

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
