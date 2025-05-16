
import { useWalletConnect } from '@/providers/WalletConnectProvider';

export const usePhantomConnection = () => {
  const { isConnected, isConnecting, walletAddress, connectWallet, disconnectWallet } = useWalletConnect();
  
  return {
    isConnected,
    isConnecting,
    walletAddress,
    connectWallet,
    disconnectWallet
  };
};
