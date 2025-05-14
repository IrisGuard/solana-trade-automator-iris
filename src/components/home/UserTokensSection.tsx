
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/use-language";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { usePhantomConnection } from "@/hooks/usePhantomConnection";
import { Wallet } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Token } from "@/types/wallet";
import { toast } from "sonner";

export function UserTokensSection() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { isConnected, walletAddress } = usePhantomConnection();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Sample tokens for when user is not connected
  const sampleTokens: Token[] = [
    { address: 'sol1', symbol: 'SOL', name: 'Solana', amount: 2.5, decimals: 9 },
    { address: 'ray1', symbol: 'RAY', name: 'Raydium', amount: 25.74, decimals: 6 },
    { address: 'usdc1', symbol: 'USDC', name: 'USD Coin', amount: 150.50, decimals: 6 },
  ];
  
  useEffect(() => {
    const fetchTokens = async () => {
      if (!isConnected || !walletAddress) return;
      
      setIsLoading(true);
      try {
        // Fetch tokens data from Supabase
        const { data, error } = await supabase
          .from('tokens')
          .select('*')
          .eq('user_id', (await supabase.auth.getUser()).data.user?.id);
        
        if (error) throw error;
        
        // If no tokens in Supabase yet, use the wallet data
        if (data && data.length > 0) {
          const formattedTokens: Token[] = data.map(token => ({
            address: token.token_address,
            symbol: token.symbol,
            name: token.name,
            amount: token.amount || 0,
            decimals: 9
          }));
          setTokens(formattedTokens);
        } else {
          // Fallback to sample tokens if no data in Supabase
          setTokens(sampleTokens);
        }
      } catch (error) {
        console.error("Error fetching tokens:", error);
        toast.error("Σφάλμα κατά τη φόρτωση των tokens");
        // Fallback to sample tokens on error
        setTokens(sampleTokens);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTokens();
  }, [isConnected, walletAddress]);
  
  const displayedTokens = isConnected ? tokens : sampleTokens;
  
  return (
    <section className="py-12 bg-gray-900/70">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">
            {isConnected ? t("wallet.yourTokens") : t("platform.sampleTokens", "Διαθέσιμα Tokens")}
          </h2>
          
          <Button 
            variant="outline" 
            onClick={() => navigate('/tokens')}
            className="border-blue-500 text-blue-400 hover:bg-blue-500/10"
          >
            {t("general.viewAll")}
          </Button>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <Card key={i} className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-6">
                  <div className="h-16 bg-gray-700/50 animate-pulse rounded-md"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {displayedTokens.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedTokens.map((token, index) => (
                  <Card key={index} className="bg-gray-800/50 border-gray-700">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-4">
                            <span className="font-bold">{token.symbol.substring(0, 2)}</span>
                          </div>
                          <div>
                            <h3 className="font-medium">{token.name}</h3>
                            <p className="text-sm text-gray-400">{token.symbol}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{token.amount.toFixed(4)}</p>
                          <p className="text-sm text-gray-400">~$0.00</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center py-12">
                  <Wallet className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-xl font-medium mb-2">{t("hero.connectWalletToViewTokens")}</h3>
                  <p className="text-gray-400 mb-6">{t("hero.needToConnectWallet")}</p>
                  
                  <Button onClick={() => navigate('/wallet')} className="gap-2">
                    <Wallet className="h-4 w-4" />
                    {t("wallet.connectWallet")}
                  </Button>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </section>
  );
}
