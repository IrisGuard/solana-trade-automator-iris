
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/providers/SupabaseAuthProvider";
import { botsService } from "@/services/botsService";
import { Loader2 } from "lucide-react";
import { BotNameField } from "./BotNameField";
import { TokenSelectionFields } from "./TokenSelectionFields";
import { StrategyField } from "./StrategyField";
import { AllocationField } from "./AllocationField";
import { TradeParametersFields } from "./TradeParametersFields";
import { RiskLevelSlider } from "./RiskLevelSlider";
import { AutoCompoundToggle } from "./AutoCompoundToggle";
import { TemplateSelector } from "./TemplateSelector";

interface CreateBotFormProps {
  onCancel?: () => void;
}

export function CreateBotForm({ onCancel }: CreateBotFormProps) {
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
        console.error("Σφάλμα φόρτωσης προτύπων:", error);
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
      
      setBotName(`Το ${selectedTemplateData.name} μου`);
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
        riskLevel: riskLevel, 
        autoCompound,
        profit: "+0.0%",
        timeRunning: "0h 0m"
      };

      // Create bot in Supabase
      await botsService.createBot({
        name: botName,
        strategy,
        user_id: user.id,
        active: false,
        config: botConfig
      });

      toast.success("Το bot δημιουργήθηκε επιτυχώς");
      
      // Reset form and close it
      if (onCancel) {
        onCancel();
      }
    } catch (error) {
      console.error("Σφάλμα δημιουργίας bot:", error);
      toast.error("Αποτυχία δημιουργίας bot");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {templates.length > 0 && (
        <TemplateSelector
          templates={templates}
          selectedTemplate={selectedTemplate}
          handleTemplateChange={handleTemplateChange}
        />
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <BotNameField botName={botName} setBotName={setBotName} />
        
        <TokenSelectionFields
          baseToken={baseToken}
          setBaseToken={setBaseToken}
          quoteToken={quoteToken}
          setQuoteToken={setQuoteToken}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <StrategyField strategy={strategy} setStrategy={setStrategy} />
        <AllocationField allocation={allocation} setAllocation={setAllocation} />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <TradeParametersFields
          maxTrade={maxTrade}
          setMaxTrade={setMaxTrade}
          takeProfit={takeProfit}
          setTakeProfit={setTakeProfit}
          stopLoss={stopLoss}
          setStopLoss={setStopLoss}
        />
      </div>

      <RiskLevelSlider riskLevel={riskLevel} setRiskLevel={setRiskLevel} />
      <AutoCompoundToggle autoCompound={autoCompound} setAutoCompound={setAutoCompound} />

      <div className="flex justify-between">
        <Button variant="ghost" onClick={onCancel}>Άκυρο</Button>
        <Button 
          onClick={handleCreateBot}
          disabled={isSubmitting}
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Δημιουργία Bot
        </Button>
      </div>
    </div>
  );
}
