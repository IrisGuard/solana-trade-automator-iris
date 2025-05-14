
import { useState, useEffect } from "react";
import { useWallet as useSolanaWallet } from "@solana/wallet-adapter-react";
import { Token } from "@/types/wallet";
import { v4 as uuidv4 } from "uuid";

// Διασύνδεση που ορίζει τη δομή του hook
export interface UseWalletReturn {
  isConnected: boolean;
  isConnecting: boolean;
  walletAddress: string;
  tokens: Token[];
  balance: number;
  solBalance: number;
  tokenPrices: Record<string, number>;
  isLoadingTokens: boolean;
  connectWallet: () => Promise<boolean>;
  disconnectWallet: () => void;
  refreshWalletData: () => Promise<boolean>;
  selectTokenForTrading: (token: Token) => void;
  isSimulation: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  makers: number;
  setMakers: (makers: number) => void;
  minDelay: number;
  setMinDelay: (delay: number) => void;
  maxDelay: number;
  setMaxDelay: (delay: number) => void;
  priceBoost: number;
  setPriceBoost: (boost: number) => void;
  botActive: boolean;
  tokenAmount: number;
  solAmount: number;
  apiKeys: any[];
  isUnlocked: boolean;
  apiSettings: any;
  setApiSettings: (settings: any) => void;
  setTokenAmount: (amount: number) => void;
  setSolAmount: (amount: number) => void;
  toggleSimulation: () => void;
  handleConnectWallet: () => Promise<void>;
  handleDisconnectWallet: () => void;
  handleStartBot: () => void;
  handleStopBot: () => void;
  handleBoostPrice: () => void;
  handleApiConnect: () => void;
  handleUnlockVault: () => void;
  handleLockVault: () => void;
  handleSaveApiSettings: () => void;
  handleExportKeys: () => void;
  handleImportKeys: () => void;
}

export function useWallet(): UseWalletReturn {
  const solanaWallet = useSolanaWallet();
  const [isConnecting, setIsConnecting] = useState(false);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [solBalance, setSolBalance] = useState(0);
  const [isLoadingTokens, setIsLoadingTokens] = useState(false);
  const [tokenPrices, setTokenPrices] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState("overview");
  const [isSimulation, setIsSimulation] = useState(false);
  const [makers, setMakers] = useState(5);
  const [minDelay, setMinDelay] = useState(1000);
  const [maxDelay, setMaxDelay] = useState(5000);
  const [priceBoost, setPriceBoost] = useState(5);
  const [botActive, setBotActive] = useState(false);
  const [tokenAmount, setTokenAmount] = useState(1000);
  const [solAmount, setSolAmount] = useState(5);
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [apiSettings, setApiSettings] = useState({});

  const toggleSimulation = () => setIsSimulation(prev => !prev);

  // Ανάκτηση δεδομένων πορτοφολιού
  useEffect(() => {
    if (solanaWallet.connected) {
      refreshWalletData();
    } else {
      // Καθαρισμός δεδομένων όταν το πορτοφόλι αποσυνδεθεί
      setTokens([]);
      setSolBalance(0);
    }
  }, [solanaWallet.connected]);

  // Συνάρτηση για ανανέωση των δεδομένων του πορτοφολιού
  const refreshWalletData = async (): Promise<boolean> => {
    if (!solanaWallet.connected || !solanaWallet.publicKey) return false;
    
    setIsLoadingTokens(true);
    
    try {
      // Προσομοίωση ανάκτησης SOL balance
      const mockSolBalance = 5 + Math.random() * 2;
      setSolBalance(mockSolBalance);
      
      // Προσομοίωση ανάκτησης tokens
      const mockTokens: Token[] = [
        {
          address: "mock-token-1",
          symbol: "SOL",
          name: "Solana",
          amount: mockSolBalance,
          logo: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png"
        },
        {
          address: "mock-token-2",
          symbol: "USDC",
          name: "USD Coin",
          amount: 100 + Math.random() * 50,
          logo: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png"
        },
        {
          address: "mock-token-3",
          symbol: "BONK",
          name: "Bonk",
          amount: 1000000 + Math.random() * 500000,
          logo: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263/logo.png"
        }
      ];
      
      setTokens(mockTokens);
      
      // Προσομοίωση τιμών tokens
      const mockPrices: Record<string, number> = {
        "mock-token-1": 70 + Math.random() * 10,
        "mock-token-2": 0.98 + Math.random() * 0.04,
        "mock-token-3": 0.00001 + Math.random() * 0.000005
      };
      
      setTokenPrices(mockPrices);
      
      return true;
    } catch (error) {
      console.error("Failed to load wallet data:", error);
      return false;
    } finally {
      setIsLoadingTokens(false);
    }
  };

  // Σύνδεση πορτοφολιού
  const connectWallet = async (): Promise<boolean> => {
    try {
      setIsConnecting(true);
      await solanaWallet.select('Phantom');
      await solanaWallet.connect();
      return true;
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  // Αποσύνδεση πορτοφολιού
  const disconnectWallet = () => {
    solanaWallet.disconnect();
  };

  // Επιλογή token για trading
  const selectTokenForTrading = (token: Token) => {
    console.log(`Selected token for trading: ${token.symbol}`);
  };

  // Handlers για το UI
  const handleConnectWallet = async () => {
    await connectWallet();
  };

  const handleDisconnectWallet = () => {
    disconnectWallet();
  };

  const handleStartBot = () => {
    setBotActive(true);
  };

  const handleStopBot = () => {
    setBotActive(false);
  };

  const handleBoostPrice = () => {
    console.log(`Boosting price by ${priceBoost}%`);
  };

  const handleApiConnect = () => {
    console.log('Connecting to API');
  };

  const handleUnlockVault = () => {
    setIsUnlocked(true);
  };

  const handleLockVault = () => {
    setIsUnlocked(false);
  };

  const handleSaveApiSettings = () => {
    console.log('Saving API settings');
  };

  const handleExportKeys = () => {
    console.log('Exporting keys');
  };

  const handleImportKeys = () => {
    console.log('Importing keys');
  };

  return {
    isConnected: solanaWallet.connected,
    isConnecting,
    walletAddress: solanaWallet.publicKey?.toString() || '',
    tokens,
    balance: solBalance,
    solBalance,
    tokenPrices,
    isLoadingTokens,
    connectWallet,
    disconnectWallet,
    refreshWalletData,
    selectTokenForTrading,
    isSimulation,
    activeTab,
    setActiveTab,
    makers,
    setMakers,
    minDelay,
    setMinDelay,
    maxDelay,
    setMaxDelay,
    priceBoost,
    setPriceBoost,
    botActive,
    tokenAmount,
    solAmount,
    apiKeys,
    isUnlocked,
    apiSettings,
    setApiSettings,
    setTokenAmount,
    setSolAmount,
    toggleSimulation,
    handleConnectWallet,
    handleDisconnectWallet,
    handleStartBot,
    handleStopBot,
    handleBoostPrice,
    handleApiConnect,
    handleUnlockVault,
    handleLockVault,
    handleSaveApiSettings,
    handleExportKeys,
    handleImportKeys
  };
}
