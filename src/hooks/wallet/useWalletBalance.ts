
import { useState, useCallback } from '../../react-compatibility';

export function useWalletBalance() {
  const [solBalance, setSolBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  const loadSolBalance = useCallback(async (address: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      const balance = Math.random() * 10;
      setSolBalance(balance);
      return balance;
    } catch (error) {
      console.error('Error loading SOL balance:', error);
      return 0;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  return { solBalance, isLoading, loadSolBalance };
}
