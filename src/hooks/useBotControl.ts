
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useAuth } from "@/providers/SupabaseAuthProvider";
import { botsService } from "@/services/botsService";

export interface Bot {
  botName: string;
  isActive: boolean;
  tokens: string[];
  profit: string;
  timeRunning: string;
  id?: string;
}

export function useBotControl() {
  const { user } = useAuth();
  const [bots, setBots] = useState<Bot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("active");
  const [botTemplates, setBotTemplates] = useState<any[]>([]);

  const templates = [
    {
      title: "DCA Momentum Bot",
      description: "Dollar-cost averaging with momentum indicators",
      features: [
        "Auto-adjusting position sizes",
        "Momentum indicators",
        "Dollar-cost averaging"
      ]
    },
    {
      title: "Arbitrage Bot",
      description: "Profit from price differences across exchanges",
      features: [
        "Multi-exchange support",
        "Real-time price comparison",
        "Auto-execution"
      ]
    },
    {
      title: "Grid Trading Bot",
      description: "Place buy/sell orders at regular price intervals",
      features: [
        "Customizable price grid",
        "Profit from price volatility",
        "Auto grid rebalancing"
      ]
    }
  ];

  // Load bots and templates from Supabase
  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // Load user bots
        const userBots = await botsService.getBotsByUser(user.id);
        
        // Transform bots to match our UI format
        const transformedBots = userBots.map(bot => {
          const config = bot.config as Record<string, any> || {};
          return {
            botName: bot.name,
            isActive: bot.active || false,
            tokens: config.selectedToken ? [config.selectedToken, config.quoteToken || "USDC"] : ["SOL", "USDC"],
            profit: config.profit || "+0.0%",
            timeRunning: config.timeRunning || "0h 0m",
            id: bot.id
          };
        });
        
        setBots(transformedBots);
        
        // Load bot templates
        const templates = await botsService.getBotTemplates();
        setBotTemplates(templates);
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Αποτυχία φόρτωσης bots");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [user]);

  const startAllBots = async () => {
    if (!user) {
      toast.error("Συνδεθείτε πρώτα για να ξεκινήσετε τα bots");
      return;
    }
    
    try {
      setIsLoading(true);
      const updatedBots = [...bots];
      
      for (const bot of updatedBots) {
        if (bot.id) {
          await botsService.updateBot(bot.id, { active: true });
          bot.isActive = true;
        }
      }
      
      setBots(updatedBots);
      toast.success("Όλα τα bots ξεκίνησαν");
    } catch (error) {
      console.error("Error starting bots:", error);
      toast.error("Αποτυχία εκκίνησης bots");
    } finally {
      setIsLoading(false);
    }
  };

  const stopAllBots = async () => {
    if (!user) {
      toast.error("Συνδεθείτε πρώτα για να σταματήσετε τα bots");
      return;
    }
    
    try {
      setIsLoading(true);
      const updatedBots = [...bots];
      
      for (const bot of updatedBots) {
        if (bot.id) {
          await botsService.updateBot(bot.id, { active: false });
          bot.isActive = false;
        }
      }
      
      setBots(updatedBots);
      toast.success("Όλα τα bots σταμάτησαν");
    } catch (error) {
      console.error("Error stopping bots:", error);
      toast.error("Αποτυχία διακοπής bots");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleBotStatus = async (index: number) => {
    if (!user) {
      toast.error("Συνδεθείτε πρώτα για να διαχειριστείτε τα bots");
      return;
    }
    
    try {
      setIsLoading(true);
      const updatedBots = [...bots];
      const bot = updatedBots[index];
      
      if (bot.id) {
        await botsService.updateBot(bot.id, { active: !bot.isActive });
        bot.isActive = !bot.isActive;
        
        // Record performance for this bot
        await botsService.updateBotPerformance(bot.id, {
          profit_percentage: 0,
          profit_amount: 0,
          total_trades: 0,
          successful_trades: 0
        });
        
        setBots(updatedBots);
        
        toast.success(bot.isActive 
          ? `Το bot ${bot.botName} ξεκίνησε` 
          : `Το bot ${bot.botName} σταμάτησε`);
      }
    } catch (error) {
      console.error("Error toggling bot status:", error);
      toast.error("Αποτυχία αλλαγής κατάστασης bot");
    } finally {
      setIsLoading(false);
    }
  };

  const createBotFromTemplate = useCallback(async (templateId: string, customName?: string) => {
    if (!user) {
      toast.error("Συνδεθείτε πρώτα για να δημιουργήσετε bot");
      return null;
    }
    
    try {
      setIsLoading(true);
      const result = await botsService.createBotFromTemplate(user.id, templateId, customName);
      
      if (result && result.length > 0) {
        const newBot = result[0];
        const config = newBot.config as Record<string, any> || {};
        
        const botForUI = {
          botName: newBot.name,
          isActive: newBot.active || false,
          tokens: config.selectedToken ? [config.selectedToken, config.quoteToken || "USDC"] : ["SOL", "USDC"],
          profit: "+0.0%",
          timeRunning: "0h 0m",
          id: newBot.id
        };
        
        setBots(prev => [botForUI, ...prev]);
        toast.success(`Το bot ${newBot.name} δημιουργήθηκε επιτυχώς`);
        return botForUI;
      }
      return null;
    } catch (error) {
      console.error("Error creating bot from template:", error);
      toast.error("Αποτυχία δημιουργίας bot από πρότυπο");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const deleteBot = useCallback(async (botId: string) => {
    if (!user) {
      toast.error("Συνδεθείτε πρώτα για να διαγράψετε το bot");
      return false;
    }
    
    try {
      setIsLoading(true);
      await botsService.deleteBot(botId);
      
      setBots(prev => prev.filter(bot => bot.id !== botId));
      toast.success("Το bot διαγράφηκε επιτυχώς");
      return true;
    } catch (error) {
      console.error("Error deleting bot:", error);
      toast.error("Αποτυχία διαγραφής bot");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  return {
    bots,
    isLoading,
    activeTab,
    setActiveTab,
    templates,
    botTemplates,
    startAllBots,
    stopAllBots,
    toggleBotStatus,
    createBotFromTemplate,
    deleteBot
  };
}
