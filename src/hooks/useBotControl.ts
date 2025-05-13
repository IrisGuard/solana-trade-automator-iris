
import { useState, useEffect } from "react";
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

  // Load bots from Supabase when the component mounts or user changes
  useEffect(() => {
    const fetchBots = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const userBots = await botsService.getBotsByUser(user.id);
        
        // Transform bots to match our UI format
        const transformedBots = userBots.map(bot => ({
          botName: bot.name,
          isActive: bot.active || false,
          tokens: bot.config?.selectedToken ? [bot.config.selectedToken, "USDC"] : ["SOL", "USDC"],
          profit: bot.config?.profit || "+0.0%",
          timeRunning: bot.config?.timeRunning || "0h 0m",
          id: bot.id
        }));
        
        setBots(transformedBots);
      } catch (error) {
        console.error("Error fetching bots:", error);
        toast.error("Αποτυχία φόρτωσης bots");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBots();
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
      const updatedBots = [...bots];
      const bot = updatedBots[index];
      
      if (bot.id) {
        await botsService.updateBot(bot.id, { active: !bot.isActive });
        bot.isActive = !bot.isActive;
        setBots(updatedBots);
        
        toast.success(bot.isActive 
          ? `Το bot ${bot.botName} ξεκίνησε` 
          : `Το bot ${bot.botName} σταμάτησε`);
      }
    } catch (error) {
      console.error("Error toggling bot status:", error);
      toast.error("Αποτυχία αλλαγής κατάστασης bot");
    }
  };

  return {
    bots,
    isLoading,
    activeTab,
    setActiveTab,
    templates,
    startAllBots,
    stopAllBots,
    toggleBotStatus
  };
}
