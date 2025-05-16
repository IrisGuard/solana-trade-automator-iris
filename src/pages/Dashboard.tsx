
import React, { useEffect, useState } from "react";
import { ConnectWalletCard } from "@/components/home/ConnectWalletCard";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { useErrorReporting } from "@/hooks/useErrorReporting";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/hooks/useUser";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardContent } from "@/components/dashboard/DashboardContent";

// Define simple interfaces for bot data
interface SimpleBotData {
  id: string;
  active: boolean;
  user_id: string;
}

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
      if (!isConnected || !walletAddress || !user?.id) return;
      
      try {
        // Use a simpler approach with specific column selection and no complex type inference
        const { data, error } = await supabase
          .from('bots')
          .select('id,active,user_id')
          .eq('user_id', user.id)
          .eq('is_primary', true);
          
        // Handle potential errors directly
        if (error) throw error;
        
        // Set bot status if data exists
        if (data && data.length > 0) {
          const isActive = typeof data[0].active === 'boolean' ? data[0].active : false;
          setBotActive(isActive);
        }
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
      
      // First, check if a bot exists for this user
      const { data: existingBots, error: fetchError } = await supabase
        .from('bots')
        .select('id')
        .eq('user_id', user.id)
        .eq('is_primary', true);
      
      if (fetchError) throw fetchError;
      
      if (existingBots && existingBots.length > 0) {
        // Update existing bot
        const { error: updateError } = await supabase
          .from('bots')
          .update({ 
            active: newStatus, 
            updated_at: new Date().toISOString() 
          })
          .eq('id', existingBots[0].id);
        
        if (updateError) throw updateError;
      } else {
        // Create new bot
        const { error: insertError } = await supabase
          .from('bots')
          .insert({ 
            user_id: user.id, 
            active: newStatus, 
            name: 'Default Bot', 
            strategy: 'basic',
            is_primary: true 
          });
        
        if (insertError) throw insertError;
      }
      
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
