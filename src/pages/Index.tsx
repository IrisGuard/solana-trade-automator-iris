
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Wallet, ExternalLink } from "lucide-react";

const Index = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [solBalance, setSolBalance] = useState(0);

  const connectWallet = async () => {
    try {
      const phantom = window.phantom?.solana;
      
      if (!phantom) {
        toast.error("Phantom wallet not found! Please install it.");
        return;
      }

      const response = await phantom.connect();
      
      if (response && response.publicKey) {
        const address = response.publicKey.toString();
        setWalletAddress(address);
        setSolBalance(5.25); // Mock balance
        setIsConnected(true);
        toast.success("Wallet connected successfully");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast.error("Failed to connect wallet");
    }
  };
  
  const disconnectWallet = async () => {
    try {
      const phantom = window.phantom?.solana;
      
      if (phantom) {
        await phantom.disconnect();
        setIsConnected(false);
        setWalletAddress("");
        setSolBalance(0);
        toast.success("Wallet disconnected");
      }
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      toast.error("Failed to disconnect wallet");
    }
  };

  // Mock tokens data
  const tokens = [
    { 
      address: 'So11111111111111111111111111111111111111112', 
      name: 'Solana', 
      symbol: 'SOL', 
      amount: 2.5,
      logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png'
    },
    { 
      address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', 
      name: 'USD Coin', 
      symbol: 'USDC', 
      amount: 158.42,
      logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png'
    },
    { 
      address: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R', 
      name: 'Raydium', 
      symbol: 'RAY', 
      amount: 50,
      logo: 'https://raw.githubusercontent.com/raydium-io/media-assets/master/logo.png'
    }
  ];

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Home Page</h2>
        {isConnected ? (
          <Button variant="outline" onClick={disconnectWallet} className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            Disconnect Wallet
          </Button>
        ) : (
          <Button onClick={connectWallet} className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            Connect with Phantom Wallet
          </Button>
        )}
      </div>

      {isConnected ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Wallet Details</CardTitle>
              <CardDescription>Information about your connected wallet</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Address:</span>
                  <span className="font-mono text-sm">{walletAddress}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Balance:</span>
                  <span className="text-sm">{solBalance} SOL</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => window.open(`https://solscan.io/account/${walletAddress}`, '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                  View on Solscan
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Token Balance</CardTitle>
              <CardDescription>Your Solana SPL tokens</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {tokens.map((token, index) => (
                <div key={index} className="flex items-center justify-between pb-2 border-b last:border-0 last:pb-0">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 rounded-full h-8 w-8 flex items-center justify-center">
                      {token.logo ? (
                        <img src={token.logo} alt={token.symbol} className="h-6 w-6 rounded-full" />
                      ) : (
                        <span className="text-primary-foreground text-xs">{token.symbol}</span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{token.name}</p>
                      <p className="text-sm text-muted-foreground">{token.symbol}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{token.amount.toLocaleString()} {token.symbol}</p>
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="h-auto p-0 text-xs" 
                      onClick={() => window.open(`https://solscan.io/token/${token.address}`, '_blank')}
                    >
                      View <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Latest activity on your wallet</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { 
                  signature: "4ZjPsQuVrLh5U6gFiDMzJHwdKVZhm7GYmAKbpvV4KSH5qhVb9TyQVypF5yQBiZcZwAJTCTUGEobYYgBfynUYdHcf",
                  blockTime: Date.now() - 1000 * 60 * 5,
                  type: "Transfer",
                  status: "confirmed",
                  amount: "+0.1 SOL",
                  from: "3xT...9hN",
                  to: walletAddress.substring(0, 4) + "..." + walletAddress.substring(walletAddress.length - 4)
                },
                {
                  signature: "4PqRdnw9qZpU5gTC9Eqob2hsZXxVnB9GULsmgfJkJVgQZbp7sYMZYJPABAw9LJE6Y9fFQzL1FLSpnEE7zzRNc9X6",
                  blockTime: Date.now() - 1000 * 60 * 30,
                  type: "Swap",
                  status: "confirmed",
                  amount: "-10 USDC",
                  from: walletAddress.substring(0, 4) + "..." + walletAddress.substring(walletAddress.length - 4),
                  to: "0.05 SOL"
                },
                {
                  signature: "5HvAyNxRJhY6RwtZ4QwzPJ21ZBU9f5P8rdBzx2pMRAQrMZoJWQ8YehJdhxmYw4GPDCYQXoJ6r6f1QphMTkTMLTUV",
                  blockTime: Date.now() - 1000 * 60 * 120,
                  type: "Transfer",
                  status: "confirmed",
                  amount: "-0.2 SOL",
                  from: walletAddress.substring(0, 4) + "..." + walletAddress.substring(walletAddress.length - 4),
                  to: "5zT...j2Lm"
                }
              ].map((tx, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{tx.type}</p>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 px-2 text-xs"
                        onClick={() => window.open(`https://solscan.io/tx/${tx.signature}`, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(tx.blockTime).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${tx.amount?.startsWith('+') ? 'text-green-500' : ''}`}>{tx.amount}</p>
                    <p className="text-xs text-muted-foreground">
                      {tx.type === "Swap" ? "For: " : "To: "}{tx.to}
                    </p>
                  </div>
                </div>
              ))}
              {walletAddress && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => window.open(`https://solscan.io/account/${walletAddress}?cluster=mainnet`, '_blank')}
                >
                  View All Transactions <ExternalLink className="ml-2 h-3 w-3" />
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="border-dashed">
          <CardHeader className="text-center">
            <CardTitle>Connect with Phantom Wallet</CardTitle>
            <CardDescription>Connect to see your tokens and transaction history</CardDescription>
          </CardHeader>
          <CardContent className="py-10 text-center">
            <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-muted flex items-center justify-center">
              <Wallet className="h-10 w-10 text-muted-foreground" />
            </div>
            <Button onClick={connectWallet} className="flex mx-auto items-center gap-2">
              <Wallet className="h-4 w-4" />
              Connect with Phantom Wallet
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Index;
