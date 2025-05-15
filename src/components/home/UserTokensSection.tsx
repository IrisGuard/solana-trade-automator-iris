
import React from "react";
import { useLanguage } from "@/hooks/use-language";
import { usePhantomConnection } from "@/hooks/usePhantomConnection";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Wallet, ArrowRight, BarChart3, Coins, RefreshCw } from "lucide-react";

export function UserTokensSection() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { isConnected, tokens, isLoadingTokens } = usePhantomConnection();
  
  const sampleTokens = [
    { symbol: 'SOL', name: 'Solana', amount: 12.85, value: 1545.23, change: 3.2 },
    { symbol: 'USDC', name: 'USD Coin', amount: 580.50, value: 580.50, change: 0.01 },
    { symbol: 'RAY', name: 'Raydium', amount: 250, value: 175.25, change: -2.5 },
    { symbol: 'BONK', name: 'Bonk', amount: 15000000, value: 95.45, change: 12.7 },
  ];
  
  const tokensToShow = isConnected ? (tokens.length > 0 ? tokens : sampleTokens) : sampleTokens;
  
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gray-950 z-0"></div>
      <div className="absolute inset-y-0 left-0 w-1/4 bg-blue-900/5 blur-3xl z-0"></div>
      <div className="absolute inset-y-0 right-0 w-1/4 bg-purple-900/5 blur-3xl z-0"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {t("platform.sampleTokens", "Διαθέσιμα Tokens")}
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {isConnected 
                ? t("wallet.tokensBalance", "Λίστα tokens") 
                : t("hero.connectWalletToViewTokens", "Συνδέστε το Πορτοφόλι σας για να Δείτε τα Tokens")}
            </p>
          </div>
          
          <div className="relative bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-0.5 rounded-xl shadow-xl overflow-hidden">
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              {/* Header */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-800">
                <div className="flex items-center gap-2">
                  <Coins className="h-5 w-5 text-blue-400" />
                  <h3 className="text-xl font-semibold">
                    {isConnected ? t("wallet.tokensBalance") : t("platform.sampleTokens")}
                  </h3>
                </div>
                
                {isConnected && (
                  <Button variant="outline" size="sm" className="gap-1">
                    <RefreshCw className="h-4 w-4" />
                    <span>{t("general.refresh", "Ανανέωση")}</span>
                  </Button>
                )}
              </div>
              
              {/* Tokens Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-900/80">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Token</th>
                      <th className="px-6 py-3 text-right text-sm font-medium text-gray-300">Amount</th>
                      <th className="px-6 py-3 text-right text-sm font-medium text-gray-300">Value</th>
                      <th className="px-6 py-3 text-right text-sm font-medium text-gray-300">Change</th>
                      <th className="px-6 py-3 text-right text-sm font-medium text-gray-300"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {isLoadingTokens ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-10 text-center">
                          <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                          </div>
                        </td>
                      </tr>
                    ) : tokensToShow.map((token, index) => (
                      <tr key={index} className="hover:bg-gray-800/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold">
                              {token.symbol?.substring(0, 2)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium">{token.name || token.symbol}</div>
                              <div className="text-sm text-gray-400">{token.symbol}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="text-sm">{token.amount?.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="text-sm">${(token as any).value?.toLocaleString() || '-'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className={`text-sm ${(token as any).change > 0 ? 'text-green-500' : (token as any).change < 0 ? 'text-red-500' : 'text-gray-400'}`}>
                            {(token as any).change > 0 ? '+' : ''}{(token as any).change?.toFixed(2) || '0.00'}%
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="hover:text-blue-400"
                            onClick={() => navigate('/tokens')}
                          >
                            <BarChart3 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-800 flex justify-between items-center">
                {isConnected ? (
                  <Button 
                    variant="default"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all"
                    onClick={() => navigate('/tokens')}
                  >
                    {t("general.viewAll", "Προβολή Όλων")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button 
                    variant="default" 
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all"
                    onClick={() => navigate('/wallet')}
                  >
                    <Wallet className="mr-2 h-4 w-4" />
                    {t("wallet.connectWallet")}
                  </Button>
                )}
                
                <div className="text-sm text-gray-400">
                  {isConnected 
                    ? `${tokensToShow.length} tokens` 
                    : t("hero.needToConnectWallet")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
