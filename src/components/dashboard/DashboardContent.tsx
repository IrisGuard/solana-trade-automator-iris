
import React from "react";
import { StatsCards } from "./StatsCards";
import { PortfolioChart } from "./PortfolioChart";
import { BotStatusCard } from "../home/BotStatusCard";
import { TokensCard } from "../home/TokensCard";
import { TransactionsCard } from "../home/TransactionsCard";
import { ApiKeysSection } from "./ApiKeysSection";
import { Token } from "@/types/wallet";
import { TokenPrices } from "@/services/solana/price/types";

interface ChartDataPoint {
  name: string;
  value: number;
  month: string;
}

interface DashboardContentProps {
  walletAddress: string;
  displayAddress: string;
  solBalance: number;
  tokens: Token[];
  tokenPrices: TokenPrices;
  isLoadingTokens: boolean;
  botActive: boolean;
  botLoading: boolean;
  chartData: ChartDataPoint[];
  toggleBotStatus: () => Promise<void>;
  selectTokenForTrading?: (tokenAddress: string) => any;
}

export function DashboardContent({
  walletAddress,
  displayAddress,
  solBalance,
  tokens,
  tokenPrices,
  isLoadingTokens,
  botActive,
  botLoading,
  chartData,
  toggleBotStatus,
  selectTokenForTrading
}: DashboardContentProps) {
  return (
    <>
      <StatsCards 
        solBalance={solBalance} 
        tokensCount={tokens?.length || 0} 
      />

      <PortfolioChart chartData={chartData} />

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
          onSelectToken={selectTokenForTrading}
        />
      </div>

      {/* API Keys Section */}
      <ApiKeysSection />

      <TransactionsCard 
        walletAddress={walletAddress} 
        displayAddress={displayAddress} 
      />
    </>
  );
}
