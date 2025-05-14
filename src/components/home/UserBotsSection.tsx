
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/use-language";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Plus, Bot } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePhantomConnection } from "@/hooks/usePhantomConnection";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import type { BotRow } from "@/types/supabase-extensions";

export function UserBotsSection() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { isConnected } = usePhantomConnection();
  const [bots, setBots] = useState<BotRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Sample bots for when user is not connected
  const sampleBots: BotRow[] = [
    { 
      id: '1', 
      user_id: '1',
      name: 'SOL Trading Bot', 
      strategy: 'grid', 
      active: true, 
      config: { 
        selectedToken: 'SOL', 
        buyThreshold: 3,
        sellThreshold: 5,
        profit: '+12.5%',
        timeRunning: '5d 3h'
      }
    },
    { 
      id: '2', 
      user_id: '1',
      name: 'USDC Market Maker', 
      strategy: 'maker', 
      active: false,
      config: { 
        selectedToken: 'USDC', 
        buyThreshold: 0.5,
        sellThreshold: 1.2,
        profit: '+3.2%',
        timeRunning: '12h'
      }
    },
  ];
  
  useEffect(() => {
    const fetchBots = async () => {
      if (!isConnected) return;
      
      setIsLoading(true);
      try {
        // Fetch bots data from Supabase
        const { data, error } = await supabase
          .from('bots')
          .select('*')
          .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
          .order('updated_at', { ascending: false })
          .limit(3);
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          setBots(data);
        } else {
          // Show sample bots if no data
          setBots(sampleBots);
        }
      } catch (error) {
        console.error("Error fetching bots:", error);
        toast.error("Σφάλμα κατά τη φόρτωση των bots");
        setBots(sampleBots);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBots();
  }, [isConnected]);
  
  const displayedBots = isConnected ? bots : sampleBots;
  
  return (
    <section className="py-12 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">
            {isConnected ? t("makerBot.yourBots") : t("platform.sampleBots", "Διαθέσιμα Bots")}
          </h2>
          
          <Button 
            variant="outline" 
            onClick={() => navigate('/bot-control')}
            className="border-blue-500 text-blue-400 hover:bg-blue-500/10"
          >
            {t("general.viewAll")}
          </Button>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2].map(i => (
              <Card key={i} className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-6">
                  <div className="h-32 bg-gray-700/50 animate-pulse rounded-md"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedBots.map((bot, index) => (
                <Card key={index} className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{bot.name}</CardTitle>
                        <CardDescription>{t(`makerBot.${bot.strategy}Strategy`, bot.strategy)}</CardDescription>
                      </div>
                      <Badge variant={bot.active ? "success" : "secondary"}>
                        {bot.active ? t("general.active") : t("general.inactive")}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">{t("makerBot.token")}</span>
                        <span className="font-medium">{bot.config?.selectedToken || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">{t("makerBot.profitLabel")}</span>
                        <span className="font-medium text-green-500">{bot.config?.profit || "+0.00%"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">{t("makerBot.timeRunning")}</span>
                        <span className="font-medium">{bot.config?.timeRunning || "0h"}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full gap-2" 
                      onClick={() => navigate(`/bot-control?id=${bot.id}`)}
                      variant="outline"
                    >
                      <Zap className="h-4 w-4" />
                      {t("general.manage")}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              
              {/* Create bot card */}
              <Card className="bg-gray-800/50 border-gray-700 border-dashed">
                <CardContent className="p-6 flex flex-col items-center justify-center h-full text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
                    <Plus className="h-8 w-8 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">{t("hero.createNewBot")}</h3>
                  <p className="text-gray-400 mb-6">
                    {isConnected 
                      ? t("makerBot.createNewBotDesc", "Δημιουργήστε ένα νέο bot για αυτόματο trading") 
                      : t("hero.needToConnectWallet")}
                  </p>
                  
                  <Button 
                    onClick={() => navigate('/bot-control')} 
                    className="gap-2"
                    disabled={!isConnected}
                  >
                    <Bot className="h-4 w-4" />
                    {t("makerBot.createBot")}
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            {displayedBots.length === 0 && (
              <Card className="mt-6 bg-gray-800/50 border-gray-700">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center py-12">
                  <Bot className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-xl font-medium mb-2">{t("hero.noActiveBots")}</h3>
                  <p className="text-gray-400 mb-6">{t("hero.noActiveBotsDesc")}</p>
                  
                  <Button onClick={() => navigate('/bot-control')} className="gap-2">
                    <Plus className="h-4 w-4" />
                    {t("hero.createNewBot")}
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
