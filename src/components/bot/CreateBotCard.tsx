
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { botsService } from "@/services/botsService";
import { useAuth } from "@/providers/SupabaseAuthProvider";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface CreateBotCardProps {
  onCancel?: () => void;
}

export function CreateBotCard({ onCancel }: CreateBotCardProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  
  const [botName, setBotName] = useState("");
  const [baseToken, setBaseToken] = useState("sol");
  const [quoteToken, setQuoteToken] = useState("usdc");
  const [strategy, setStrategy] = useState("momentum");
  const [allocation, setAllocation] = useState("25");
  const [maxTrade, setMaxTrade] = useState("0.5");
  const [takeProfit, setTakeProfit] = useState("3");
  const [stopLoss, setStopLoss] = useState("1.5");
  const [riskLevel, setRiskLevel] = useState(30);
  const [autoCompound, setAutoCompound] = useState(true);

  // Load bot templates
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const templateData = await botsService.getBotTemplates();
        setTemplates(templateData);
      } catch (error) {
        console.error("Error loading templates:", error);
      }
    };
    
    loadTemplates();
  }, []);

  // Handle template selection
  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    
    const selectedTemplateData = templates.find(t => t.id === templateId);
    if (selectedTemplateData) {
      const config = selectedTemplateData.default_config as Record<string, any> || {};
      
      setBotName(`My ${selectedTemplateData.name}`);
      setBaseToken((config.selectedToken || "sol").toLowerCase());
      setQuoteToken((config.quoteToken || "usdc").toLowerCase());
      setStrategy(selectedTemplateData.strategy || "momentum");
      setAllocation(String(config.allocation || "25"));
      setMaxTrade(String(config.maxTrade || "0.5"));
      setTakeProfit(String(config.takeProfit || "3"));
      setStopLoss(String(config.stopLoss || "1.5"));
      setRiskLevel(typeof config.riskLevel === 'number' ? config.riskLevel : 30);
      setAutoCompound(config.autoCompound !== undefined ? config.autoCompound : true);
    }
  };

  const handleCreateBot = async () => {
    if (!user) {
      toast.error("Παρακαλώ συνδεθείτε για να δημιουργήσετε bot");
      return;
    }

    if (!botName) {
      toast.error("Παρακαλώ εισάγετε όνομα για το bot");
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Create bot configuration object
      const botConfig = {
        selectedToken: baseToken.toUpperCase(),
        quoteToken: quoteToken.toUpperCase(),
        allocation: parseInt(allocation),
        maxTrade: parseFloat(maxTrade),
        takeProfit: parseFloat(takeProfit),
        stopLoss: parseFloat(stopLoss),
        riskLevel: riskLevel, // This now matches our updated BotConfig type
        autoCompound,
        profit: "+0.0%",
        timeRunning: "0h 0m"
      };

      // Create bot in Supabase
      await botsService.createBot(user.id, {
        name: botName,
        strategy,
        active: false,
        config: botConfig
      });

      toast.success("Το bot δημιουργήθηκε επιτυχώς");
      
      // Reset form and close it
      if (onCancel) {
        onCancel();
      }
    } catch (error) {
      console.error("Error creating bot:", error);
      toast.error("Αποτυχία δημιουργίας bot");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Bot</CardTitle>
        <CardDescription>
          Configure a new trading bot with custom parameters
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {templates.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="template">Template (Optional)</Label>
            <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
              <SelectTrigger id="template">
                <SelectValue placeholder="Start from scratch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Start from scratch</SelectItem>
                {templates.map(template => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="bot-name">Bot Name</Label>
            <Input 
              id="bot-name" 
              placeholder="My Trading Bot" 
              value={botName}
              onChange={(e) => setBotName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="base-token">Base Token</Label>
            <Select value={baseToken} onValueChange={setBaseToken}>
              <SelectTrigger id="base-token">
                <SelectValue placeholder="Select token" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sol">SOL</SelectItem>
                <SelectItem value="btc">BTC</SelectItem>
                <SelectItem value="eth">ETH</SelectItem>
                <SelectItem value="ray">RAY</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="quote-token">Quote Token</Label>
            <Select value={quoteToken} onValueChange={setQuoteToken}>
              <SelectTrigger id="quote-token">
                <SelectValue placeholder="Select token" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usdc">USDC</SelectItem>
                <SelectItem value="usdt">USDT</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="strategy">Trading Strategy</Label>
            <Select value={strategy} onValueChange={setStrategy}>
              <SelectTrigger id="strategy">
                <SelectValue placeholder="Select strategy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="momentum">Momentum Trading</SelectItem>
                <SelectItem value="arbitrage">Arbitrage</SelectItem>
                <SelectItem value="grid">Grid Trading</SelectItem>
                <SelectItem value="scalping">Scalping</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="balance">Initial Balance Allocation</Label>
            <Input 
              id="balance" 
              placeholder="25%" 
              value={allocation}
              onChange={(e) => setAllocation(e.target.value)}
              suffix="%"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="max-trade">Max Trade Size</Label>
            <Input 
              id="max-trade" 
              placeholder="0.5 SOL" 
              value={maxTrade}
              onChange={(e) => setMaxTrade(e.target.value)}
              suffix="SOL"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="take-profit">Take Profit (%)</Label>
            <Input 
              id="take-profit" 
              placeholder="3%" 
              value={takeProfit}
              onChange={(e) => setTakeProfit(e.target.value)}
              suffix="%"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stop-loss">Stop Loss (%)</Label>
            <Input 
              id="stop-loss" 
              placeholder="1.5%" 
              value={stopLoss}
              onChange={(e) => setStopLoss(e.target.value)}
              suffix="%"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Risk Level</Label>
          <div className="flex items-center gap-2">
            <span className="text-xs">Conservative</span>
            <Slider 
              value={[riskLevel]} 
              max={100} 
              step={1} 
              className="flex-grow" 
              onValueChange={([value]) => setRiskLevel(value)}
            />
            <span className="text-xs">Aggressive</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch 
            id="auto-compound" 
            checked={autoCompound}
            onCheckedChange={setAutoCompound}
          />
          <Label htmlFor="auto-compound">Auto-compound profits</Label>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button 
          className="ml-auto" 
          onClick={handleCreateBot}
          disabled={isSubmitting}
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Bot
        </Button>
      </CardFooter>
    </Card>
  );
}
