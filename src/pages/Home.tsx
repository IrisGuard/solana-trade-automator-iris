
import { useEffect } from 'react';
import { Container, Grid } from '@mui/material';
import { useWallet } from '@/hooks/useWallet';
import { WalletConnectedContent } from '@/components/home/WalletConnectedContent';
import { WalletDisconnectedContent } from '@/components/home/WalletDisconnectedContent';
import { HeroSection } from '@/components/home/HeroSection';
import { FooterSection } from '@/components/home/FooterSection';
import { FaqSection } from '@/components/home/FaqSection';
import { BotExplanationSection } from '@/components/home/BotExplanationSection';
import { useAuth } from '@/providers/SupabaseAuthProvider';

export default function Home() {
  const { 
    isConnected,
    walletAddress,
    tokens,
    balance,
    connectWallet,
    disconnectWallet
  } = useWallet();

  const { user } = useAuth();

  useEffect(() => {
    // Initialize the page
    console.log("Home page initialized, auth status:", !!user);
  }, [user]);

  const handleConnect = async () => {
    try {
      await connectWallet();
      return true;
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      return false;
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
  };

  return (
    <Container maxWidth="xl">
      <HeroSection />
      
      <Grid container spacing={4} sx={{ mt: 4, mb: 8 }}>
        {isConnected ? (
          <WalletConnectedContent 
            walletAddress={walletAddress}
            tokens={tokens}
            balance={balance} 
            onDisconnect={handleDisconnect}
          />
        ) : (
          <WalletDisconnectedContent 
            onConnect={handleConnect}
          />
        )}
      </Grid>
      
      <BotExplanationSection />
      <FaqSection />
      <FooterSection />
    </Container>
  );
}
