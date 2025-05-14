
import { useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useConfig } from './trading-bot/useConfig';
import { useBotActions } from './trading-bot/useBotActions';
import { usePriceSubscription } from './trading-bot/usePriceSubscription';
import { useTokens } from './trading-bot/useTokens';
import { TradingBotHook } from './trading-bot/types';

export function useTradingBot(): TradingBotHook {
  const { connected } = useWallet();
  const { config, updateConfig } = useConfig();
  const { tokens, findTokenDetails } = useTokens();
  const {
    bots,
    activeBot,
    setActiveBot,
    isCreating,
    isLoading,
    botStatus,
    activeOrders,
    loadBots,
    startBot: startBotAction,
    stopBot,
    createBot
  } = useBotActions();
  
  const {
    price: tokenPrice,
    selectedTokenPrice,
    selectedTokenDetails,
    setupPriceSubscription,
    cleanupSubscription
  } = usePriceSubscription();

  // Select token for trading
  const selectToken = useCallback(async (token: string | null) => {
    updateConfig({ selectedToken: token });
    
    // Find token details and setup price subscription
    const tokenDetails = findTokenDetails(token);
    await setupPriceSubscription(token);
    
  }, [updateConfig, findTokenDetails, setupPriceSubscription]);

  // Start the trading bot with current configuration
  const startBot = useCallback(() => {
    startBotAction(config, selectedTokenPrice);
  }, [startBotAction, config, selectedTokenPrice]);

  // Cleanup on unmount
  const cleanup = useCallback(() => {
    cleanupSubscription();
    
    if (botStatus === 'running') {
      stopBot();
    }
  }, [cleanupSubscription, botStatus, stopBot]);

  return {
    // Bot state
    bots,
    activeBot,
    isCreating,
    isLoading,
    selectedToken: config.selectedToken,
    tokenPrice,
    botStatus,
    activeOrders,
    selectedTokenPrice,
    selectedTokenDetails,
    tokens,
    connected,
    
    // Bot configuration
    config,
    updateConfig,
    
    // Bot actions
    loadBots,
    selectToken,
    setActiveBot,
    createBot,
    startBot,
    stopBot,
    cleanup
  };
}

export default useTradingBot;
