
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface ApiKey {
  name: string;
  connected: boolean;
}

export interface ApiSettings {
  rpcUrl: string;
  customRpc: boolean;
  fallbackRpc: boolean;
  rateLimit: number;
}

export function useWallet() {
  const [isConnected, setIsConnected] = useState(false);
  const [isSimulation, setIsSimulation] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [makers, setMakers] = useState(100);
  const [minDelay, setMinDelay] = useState(5);
  const [maxDelay, setMaxDelay] = useState(10);
  const [priceBoost, setPriceBoost] = useState(0);
  const [botActive, setBotActive] = useState(false);
  const [tokenAmount, setTokenAmount] = useState(100000);
  const [solAmount, setSolAmount] = useState(0.5);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    { name: "Jupiter API", connected: false },
    { name: "Solana RPC", connected: true },
    { name: "Exchange API", connected: false }
  ]);
  const [botRunningTime, setBotRunningTime] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [apiSettings, setApiSettings] = useState<ApiSettings>({
    rpcUrl: "https://api.mainnet-beta.solana.com",
    customRpc: false,
    fallbackRpc: true,
    rateLimit: 10
  });

  const walletAddress = "3eDZ...f9Kt";
  const solBalance = 12.45;
  const tokenBalance = 250000;

  // Simulate bot running time
  useEffect(() => {
    let timer: number;
    if (botActive) {
      timer = window.setInterval(() => {
        setBotRunningTime(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [botActive]);

  // Format running time
  const formatRunningTime = () => {
    const hours = Math.floor(botRunningTime / 3600);
    const minutes = Math.floor((botRunningTime % 3600) / 60);
    const seconds = botRunningTime % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleConnectWallet = () => {
    setIsConnected(true);
    toast.success("Wallet connected successfully");
  };

  const handleDisconnectWallet = () => {
    setIsConnected(false);
    setBotActive(false);
    toast.info("Wallet disconnected");
  };

  const toggleSimulation = () => {
    setIsSimulation(!isSimulation);
    toast.info(isSimulation ? "Live trading enabled" : "Simulation mode enabled");
  };

  const handleStartBot = () => {
    if (isConnected) {
      setBotActive(true);
      setBotRunningTime(0);
      toast.success(
        isSimulation 
          ? "Bot started in simulation mode" 
          : "Bot started with live trading"
      );
    } else {
      toast.error("Please connect your wallet first");
    }
  };

  const handleStopBot = () => {
    setBotActive(false);
    toast.info("Bot stopped");
  };

  const handleBoostPrice = () => {
    if (priceBoost > 0) {
      toast.success(`Boosting price by ${priceBoost}%`);
    } else {
      toast.error("Please set a price boost percentage first");
    }
  };

  const handleApiConnect = (index: number) => {
    const updatedKeys = [...apiKeys];
    updatedKeys[index].connected = !updatedKeys[index].connected;
    setApiKeys(updatedKeys);
    
    if (updatedKeys[index].connected) {
      toast.success(`${updatedKeys[index].name} connected successfully`);
    } else {
      toast.info(`${updatedKeys[index].name} disconnected`);
    }
  };

  const handleUnlockVault = () => {
    setIsUnlocked(true);
    toast.success("API vault unlocked");
  };

  const handleLockVault = () => {
    setIsUnlocked(false);
    toast.info("API vault locked");
  };

  const handleSaveApiSettings = () => {
    toast.success("API settings saved successfully");
  };

  const handleExportKeys = () => {
    toast.success("API keys exported (encrypted)");
  };

  const handleImportKeys = () => {
    toast.success("API keys imported successfully");
  };

  return {
    isConnected,
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
    setTokenAmount,
    solAmount,
    setSolAmount,
    apiKeys,
    botRunningTime,
    isUnlocked,
    apiSettings,
    setApiSettings,
    walletAddress,
    solBalance,
    tokenBalance,
    formatRunningTime,
    handleConnectWallet,
    handleDisconnectWallet,
    toggleSimulation,
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
