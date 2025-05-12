
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  CoinbaseWalletAdapter,
  TorusWalletAdapter,
  LedgerWalletAdapter,
  BackpackWalletAdapter,
  BraveWalletAdapter,
  CloverWalletAdapter,
  Coin98WalletAdapter,
  ExodusWalletAdapter,
  SlopeWalletAdapter,
  TrustWalletAdapter,
  NightlyWalletAdapter
} from '@solana/wallet-adapter-wallets';
import { RPC_ENDPOINTS, CONNECTION_CONFIG } from '@/services/solana/config';
import React, { FC, ReactNode, useMemo, useState } from 'react';
import { SolanaProviderFallback } from '@/components/wallet/SolanaProviderFallback';

// Import the CSS as an ES module
import '@solana/wallet-adapter-react-ui/styles.css';

interface Props {
  children: ReactNode;
}

export const SolanaWalletProvider: FC<Props> = ({ children }) => {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const [network, setNetwork] = useState<WalletAdapterNetwork>(WalletAdapterNetwork.MainnetBeta);
  
  // Μπορείτε να αλλάξετε το δίκτυο με αυτήν τη συνάρτηση
  const changeNetwork = (newNetwork: WalletAdapterNetwork) => {
    setNetwork(newNetwork);
  };

  // Endpoint με βάση το επιλεγμένο δίκτυο
  const endpoint = useMemo(() => {
    if (network === WalletAdapterNetwork.Devnet) {
      return RPC_ENDPOINTS.DEVNET;
    }
    if (network === WalletAdapterNetwork.Testnet) {
      return RPC_ENDPOINTS.TESTNET;
    }
    // Mainnet-Beta
    return RPC_ENDPOINTS.PRIMARY;
  }, [network]);

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
  // Only the wallets you configure here will be compiled into your application, and only the dependencies
  // of wallets that your users connect to will be loaded.
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new CoinbaseWalletAdapter(),
      new LedgerWalletAdapter(),
      new TorusWalletAdapter(),
      new BackpackWalletAdapter(),
      new BraveWalletAdapter(),
      new CloverWalletAdapter(),
      new Coin98WalletAdapter(),
      new ExodusWalletAdapter(),
      new SlopeWalletAdapter(),
      new TrustWalletAdapter(),
      new NightlyWalletAdapter()
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint} config={CONNECTION_CONFIG}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

// Simple Error Boundary component
class ErrorBoundary extends React.Component<{children: ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Solana Wallet Error:', error, errorInfo);
  }

  resetErrorBoundary = () => {
    this.setState({ hasError: false, error: null });
  }

  render() {
    if (this.state.hasError) {
      return (
        <SolanaProviderFallback 
          error={this.state.error} 
          resetErrorBoundary={this.resetErrorBoundary}
        />
      );
    }

    return this.props.children;
  }
}
