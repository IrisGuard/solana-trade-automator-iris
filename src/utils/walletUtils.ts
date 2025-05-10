
import { toast } from 'sonner';

// Helper function to check if Phantom is installed
export const checkPhantomWalletInstalled = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.phantom?.solana && window.phantom.solana.isPhantom;
};

// Helper function to fetch balance
export const fetchSolanaBalance = async (address: string): Promise<number> => {
  try {
    const phantom = window.phantom?.solana;
    if (!phantom) return 0;

    // For demo purposes, we'll just return a mock balance
    // In a real app, you'd fetch this from the Solana blockchain
    return 5.25;
  } catch (err) {
    console.error('Error fetching balance:', err);
    toast.error('Αποτυχία λήψης υπολοίπου πορτοφολιού');
    return 0;
  }
};

// Helper function to format wallet address for display
export const formatWalletAddress = (address: string | null): string => {
  if (!address) return '';
  return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
};

// Helper function to handle connection errors
export const handleWalletError = (err: unknown): string => {
  console.error('Error connecting wallet:', err);
  let errorMsg = 'Αποτυχία σύνδεσης πορτοφολιού';
  if (err instanceof Error) {
    errorMsg += `: ${err.message}`;
  }
  toast.error(errorMsg);
  return errorMsg;
};
