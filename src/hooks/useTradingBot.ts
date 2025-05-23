
import { useState, useCallback } from 'react';
import { useWalletConnection } from './useWalletConnection';

export interface TradingBotState {
  isActive: boolean;
  selectedToken: string;
  strategy: string;
  isLoading: boolean;
}

export function useTradingBot() {
  const { tokens, connected } = useWalletConnection();
  const [botState, setBotState] = useState<TradingBotState>({
    isActive: false,
    selectedToken: '',
    strategy: 'basic',
    isLoading: false
  });

  const toggleBot = useCallback(async () => {
    if (!botState.selectedToken) {
      alert('Παρακαλώ επιλέξτε ένα token πρώτα');
      return;
    }
    
    setBotState(prev => ({ 
      ...prev, 
      isLoading: true 
    }));

    // Simulate bot toggle
    setTimeout(() => {
      setBotState(prev => ({ 
        ...prev, 
        isActive: !prev.isActive,
        isLoading: false 
      }));
    }, 1000);
  }, [botState.selectedToken]);

  const selectToken = useCallback((tokenAddress: string) => {
    setBotState(prev => ({ 
      ...prev, 
      selectedToken: tokenAddress 
    }));
  }, []);

  const setStrategy = useCallback((strategy: string) => {
    setBotState(prev => ({ 
      ...prev, 
      strategy 
    }));
  }, []);

  return {
    ...botState,
    toggleBot,
    selectToken,
    setStrategy,
    availableTokens: tokens || [],
    isConnected: connected
  };
}
