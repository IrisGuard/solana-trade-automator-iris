
import { useState, useEffect, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { TokenPriceInfo } from "./trading-bot/types";
import { TradingBotConfig, TradingBotHook } from "./trading-bot/types";
import { useBotActions } from "./trading-bot/useBotActions";
import { errorCollector } from "@/utils/error-handling/collector";
import { toast } from "sonner";
import { useUser } from "./useUser";
import { heliusService } from "@/services/helius/HeliusService";
import { useWalletTransactions } from "@/services/wallet/WalletTransactionService";
import { botTransactionService } from "@/services/bot/botTransactionService";

export function useTradingBot(): TradingBotHook {
  const { connected, publicKey } = useWallet();
  const { user } = useUser();
  const { sendToken } = useWalletTransactions();
  
  // Bot actions
  const {
    bots,
    activeBot,
    botStatus,
    activeOrders,
    isLoading: isBotLoading,
    startBot: startBotAction,
    stopBot: stopBotAction,
    loadBots
  } = useBotActions();
  
  // State
  const [config, setConfig] = useState<TradingBotConfig>({
    selectedToken: null,
    buyThreshold: 5,
    sellThreshold: 5,
    stopLoss: 10,
    takeProfit: 20,
    tradeAmount: 10,
    maxBudget: 1000,
    strategy: 'simple',
    autoRebalance: false,
    trailingStop: false,
    enabledStrategies: {
      dca: false,
      grid: false,
      momentum: false
    }
  });
  const [selectedTokenPrice, setSelectedTokenPrice] = useState<TokenPriceInfo | null>(null);
  const [selectedTokenDetails, setSelectedTokenDetails] = useState<any>(undefined);
  const [tokens, setTokens] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [priceCheckInterval, setPriceCheckInterval] = useState<NodeJS.Timeout | null>(null);
  
  // Load bots on initial render
  useEffect(() => {
    if (user?.id) {
      loadBots().catch(error => {
        console.error("Failed to load bots:", error);
      });
    }
  }, [user?.id, loadBots]);
  
  // Load available tokens
  useEffect(() => {
    if (connected && publicKey) {
      const loadTokens = async () => {
        try {
          const tokenBalances = await heliusService.fetchTokenBalances(publicKey.toString());
          
          const processedTokens = Array.isArray(tokenBalances?.tokens) 
            ? tokenBalances.tokens.map((token: any) => ({
                address: token.address || token.mint || '',
                symbol: token.symbol || 'Unknown',
                name: token.name || 'Unknown Token',
                amount: token.amount || 0,
                decimals: token.decimals || 0,
                logo: token.logo || null
              }))
            : [];
            
          setTokens(processedTokens);
        } catch (error) {
          console.error("Error loading tokens:", error);
          errorCollector.captureError(error, {
            component: 'useTradingBot',
            method: 'loadTokens'
          });
        }
      };
      
      loadTokens();
    }
  }, [connected, publicKey]);
  
  // Update config with partial changes
  const updateConfig = useCallback((newConfig: Partial<TradingBotConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  }, []);
  
  // Select a token for trading
  const selectToken = useCallback(async (tokenAddress: string | null) => {
    try {
      if (!tokenAddress) {
        setSelectedTokenPrice(null);
        setSelectedTokenDetails(undefined);
        updateConfig({ selectedToken: null });
        return;
      }
      
      setIsLoading(true);
      updateConfig({ selectedToken: tokenAddress });
      
      // Find token details from our list
      const token = tokens.find(t => t.address === tokenAddress);
      setSelectedTokenDetails(token);
      
      // Fetch token price (simulated here)
      const price = Math.random() * 100;
      const priceChange24h = (Math.random() * 20) - 10;
      
      setSelectedTokenPrice({
        price,
        change24h: priceChange24h,
        highPrice24h: price * 1.05,
        lowPrice24h: price * 0.95,
        volume24h: price * 10000,
        marketCap: price * 1000000,
        lastUpdated: new Date()
      });
      
    } catch (error) {
      console.error("Error selecting token:", error);
      toast.error("Failed to select token");
      errorCollector.captureError(error, {
        component: 'useTradingBot',
        method: 'selectToken'
      });
    } finally {
      setIsLoading(false);
    }
  }, [tokens, updateConfig]);
  
  // Start periodic price updates when a token is selected
  useEffect(() => {
    if (config.selectedToken && botStatus === 'running') {
      // Clear any existing interval
      if (priceCheckInterval) {
        clearInterval(priceCheckInterval);
      }
      
      // Set up new interval
      const intervalId = setInterval(async () => {
        try {
          // In a real implementation, fetch actual price data
          // For now, simulate price changes
          const currentPrice = selectedTokenPrice?.price || 100;
          const randomChange = (Math.random() * 2 - 1) * (currentPrice * 0.01); // Up to 1% change
          const newPrice = currentPrice + randomChange;
          
          setSelectedTokenPrice(prev => {
            if (!prev) return null;
            
            return {
              ...prev,
              price: newPrice,
              change24h: prev.change24h + (randomChange / currentPrice * 100) / 24, // Adjust 24h change
              lastUpdated: new Date()
            };
          });
          
          // Check for price triggers
          if (selectedTokenPrice) {
            checkPriceTriggers(newPrice);
          }
        } catch (error) {
          console.error("Error updating price:", error);
        }
      }, 10000); // Update every 10 seconds
      
      setPriceCheckInterval(intervalId);
      
      // Clean up on unmount
      return () => clearInterval(intervalId);
    } else {
      // Clear interval if bot is not running
      if (priceCheckInterval) {
        clearInterval(priceCheckInterval);
        setPriceCheckInterval(null);
      }
    }
  }, [config.selectedToken, botStatus, selectedTokenPrice?.price]);
  
  // Check if any price triggers should execute
  const checkPriceTriggers = useCallback((currentPrice: number) => {
    if (!config.selectedToken || !user?.id || botStatus !== 'running') return;
    
    // Get market conditions
    const isPriceRising = Math.random() > 0.5; // Simplified for demo
    
    // Check take profit
    if (activeOrders.some(order => order.type === 'buy')) {
      const buyPrice = activeOrders.find(order => order.type === 'buy')?.price || 0;
      const profitPercentage = ((currentPrice - buyPrice) / buyPrice) * 100;
      
      if (profitPercentage >= config.takeProfit) {
        // Execute take profit order
        executeBotTransaction('sell', 'Take profit triggered');
      }
    }
    
    // Check stop loss
    if (activeOrders.some(order => order.type === 'buy')) {
      const buyPrice = activeOrders.find(order => order.type === 'buy')?.price || 0;
      const lossPercentage = ((buyPrice - currentPrice) / buyPrice) * 100;
      
      if (lossPercentage >= config.stopLoss) {
        // Execute stop loss order
        executeBotTransaction('sell', 'Stop loss triggered');
      }
    }
    
    // Strategy-based trading
    switch (config.strategy) {
      case 'simple':
        // Simple threshold-based trading
        if (isPriceRising && Math.random() < 0.1) { // 10% chance to buy when rising
          executeBotTransaction('buy', 'Simple strategy buy signal');
        } else if (!isPriceRising && Math.random() < 0.1) { // 10% chance to sell when falling
          executeBotTransaction('sell', 'Simple strategy sell signal');
        }
        break;
        
      case 'dca':
        // Dollar cost averaging - buy small amounts periodically
        if (Math.random() < 0.05) { // 5% chance each check (spread out buys)
          executeBotTransaction('buy', 'DCA strategy periodic buy');
        }
        break;
        
      case 'momentum':
        // Momentum strategy - buy when price rising strongly, sell when falling
        if (isPriceRising && Math.random() < 0.2) { // 20% chance to buy when rising
          executeBotTransaction('buy', 'Momentum strategy buy signal');
        } else if (!isPriceRising && Math.random() < 0.15) { // 15% chance to sell when falling
          executeBotTransaction('sell', 'Momentum strategy sell signal');
        }
        break;
        
      case 'grid':
        // Grid trading - buy at support levels, sell at resistance levels
        const supportLevel = currentPrice * 0.95;
        const resistanceLevel = currentPrice * 1.05;
        const randomPrice = currentPrice * (0.9 + Math.random() * 0.2); // Random price between ±10%
        
        if (randomPrice <= supportLevel) {
          executeBotTransaction('buy', 'Grid strategy buy at support');
        } else if (randomPrice >= resistanceLevel) {
          executeBotTransaction('sell', 'Grid strategy sell at resistance');
        }
        break;
    }
  }, [config, botStatus, activeOrders, user?.id]);
  
  // Execute a bot transaction
  const executeBotTransaction = useCallback(async (type: 'buy' | 'sell', reason: string) => {
    if (!config.selectedToken || !user?.id || !selectedTokenDetails) return;
    
    try {
      const token = selectedTokenDetails;
      const price = selectedTokenPrice?.price || 0;
      const amount = config.tradeAmount / price;
      
      console.log(`Executing ${type} order for ${token.symbol} at $${price}`);
      toast.info(`Bot ${type} signal: ${reason}`);
      
      // For real transactions, use the wallet adapter
      if (type === 'buy') {
        // In real implementation, this would buy the token
        // For now, just record the transaction
        await botTransactionService.recordBotTransaction({
          bot_id: activeBot?.id || 'simulation',
          transaction_type: type,
          amount,
          token_symbol: token.symbol,
          price,
          status: 'completed'
        });
      } else {
        // In real implementation, this would sell the token
        // For now, just record the transaction
        await botTransactionService.recordBotTransaction({
          bot_id: activeBot?.id || 'simulation',
          transaction_type: type,
          amount,
          token_symbol: token.symbol,
          price,
          status: 'completed'
        });
      }
      
    } catch (error) {
      console.error(`Error executing ${type} transaction:`, error);
      toast.error(`Failed to execute ${type} order`);
      errorCollector.captureError(error, {
        component: 'useTradingBot',
        method: 'executeBotTransaction',
        details: { type, tokenSymbol: selectedTokenDetails?.symbol }
      });
    }
  }, [config, user?.id, selectedTokenDetails, selectedTokenPrice, activeBot?.id]);
  
  // Start the trading bot
  const startBot = useCallback(() => {
    if (!config.selectedToken) {
      toast.error("Please select a token first");
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Start the bot
      startBotAction(config, selectedTokenPrice);
      
      toast.success("Bot started successfully");
    } catch (error) {
      console.error("Error starting bot:", error);
      toast.error("Failed to start bot");
      errorCollector.captureError(error, {
        component: 'useTradingBot',
        method: 'startBot'
      });
    } finally {
      setIsLoading(false);
    }
  }, [config, selectedTokenPrice, startBotAction]);
  
  // Stop the trading bot
  const stopBot = useCallback(() => {
    try {
      setIsLoading(true);
      
      // Stop the bot
      stopBotAction();
      
      toast.success("Bot stopped successfully");
    } catch (error) {
      console.error("Error stopping bot:", error);
      toast.error("Failed to stop bot");
      errorCollector.captureError(error, {
        component: 'useTradingBot',
        method: 'stopBot'
      });
    } finally {
      setIsLoading(false);
    }
  }, [stopBotAction]);
  
  return {
    config,
    updateConfig,
    selectToken,
    startBot,
    stopBot,
    isLoading: isLoading || isBotLoading,
    botStatus,
    activeOrders,
    selectedTokenPrice,
    selectedTokenDetails,
    tokens,
    connected
  };
}
