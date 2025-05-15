
import React from "react";
import { useLanguage } from "@/hooks/use-language";
import { usePhantomConnection } from "@/hooks/usePhantomConnection";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Bot, ArrowRight, Play, Pause, Settings, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";

export function UserBotsSection() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { isConnected } = usePhantomConnection();
  
  // Sample bots data
  const sampleBots = [
    { 
      id: 1, 
      name: 'SOL/USDC DCA Bot', 
      status: 'active', 
      strategy: 'Dollar Cost Averaging',
      primaryToken: 'SOL', 
      secondaryToken: 'USDC',
      profit: 8.3,
      lastTransaction: '12 min ago',
      gradient: 'from-blue-500 to-cyan-400'
    },
    { 
      id: 2, 
      name: 'Ray Maker Bot', 
      status: 'paused', 
      strategy: 'Market Making',
      primaryToken: 'RAY', 
      secondaryToken: 'USDC',
      profit: 3.7,
      lastTransaction: '4h ago',
      gradient: 'from-purple-500 to-pink-400'
    },
    { 
      id: 3, 
      name: 'BONK/SOL Trading Bot', 
      status: 'active', 
      strategy: 'Grid Trading',
      primaryToken: 'BONK', 
      secondaryToken: 'SOL',
      profit: 12.5,
      lastTransaction: '3 min ago',
      gradient: 'from-amber-500 to-orange-400'
    },
  ];
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-500';
      case 'paused': return 'text-amber-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-400';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'paused': return <Pause className="h-4 w-4 text-amber-500" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gray-900 z-0"></div>
      <div className="absolute inset-y-0 left-0 w-1/3 bg-blue-900/5 blur-3xl z-0"></div>
      <div className="absolute inset-y-0 right-0 w-1/3 bg-purple-900/5 blur-3xl z-0"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {t("platform.sampleBots", "Διαθέσιμα Bots")}
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {isConnected 
                ? "Διαχειριστείτε τα ενεργά bots σας" 
                : t("hero.noActiveBotsDesc", "Συνδεθείτε για να δείτε ή να δημιουργήσετε bots συναλλαγών")}
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {sampleBots.map((bot) => (
              <div 
                key={bot.id}
                className={`bg-gradient-to-br ${bot.gradient} p-0.5 rounded-xl overflow-hidden shadow-lg shadow-${bot.gradient.split('-')[1]}-600/20 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]`}
              >
                <div className="bg-gray-900 h-full flex flex-col rounded-lg overflow-hidden">
                  {/* Header */}
                  <div className="border-b border-gray-800 p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <Bot className="h-5 w-5" />
                        <h3 className="font-medium">{bot.name}</h3>
                      </div>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(bot.status)}
                        <span className={`text-xs ${getStatusColor(bot.status)}`}>
                          {bot.status.charAt(0).toUpperCase() + bot.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">{bot.strategy}</div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-4 flex-1">
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-sm text-gray-300">Token Pair:</div>
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold">
                          {bot.primaryToken.substring(0, 1)}
                        </div>
                        <span>/</span>
                        <div className="h-6 w-6 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-xs font-bold">
                          {bot.secondaryToken.substring(0, 1)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-sm text-gray-300">Profit:</div>
                      <div className="flex items-center gap-1 text-green-500">
                        <TrendingUp className="h-4 w-4" />
                        <span>+{bot.profit}%</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-300">Last TX:</div>
                      <div className="text-sm">{bot.lastTransaction}</div>
                    </div>
                  </div>
                  
                  {/* Footer */}
                  <div className="border-t border-gray-800 p-4 flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 bg-transparent border-gray-700 hover:bg-gray-800 hover:text-white"
                    >
                      {bot.status === 'active' ? (
                        <>
                          <Pause className="h-4 w-4 mr-1" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-1" />
                          Start
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 bg-transparent border-gray-700 hover:bg-gray-800 hover:text-white"
                      onClick={() => navigate('/bot-control')}
                    >
                      <Settings className="h-4 w-4 mr-1" />
                      Settings
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-10 text-center">
            <Button 
              variant="default"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-8 py-6 text-lg shadow-lg shadow-blue-700/30 hover:shadow-blue-800/40 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
              onClick={() => navigate('/bot-control')}
            >
              <Bot className="h-5 w-5 mr-2" />
              {isConnected ? t("hero.createNewBot", "Δημιουργία Νέου Bot") : t("hero.connectWallet", "Σύνδεση Πορτοφολιού")}
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
