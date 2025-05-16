
import React from "react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyBotState } from "@/components/bot/EmptyBotState";
import { BotCard } from "@/components/bot/BotCard";
import { CreateBotCard } from "@/components/bot/CreateBotCard";
import { BotTemplateCard } from "@/components/bot/BotTemplateCard";
import { useBotControl } from "@/hooks/useBotControl";
import { BotRow } from "@/services/bot/types";
import { PageHeader } from "@/components/layout/PageHeader";
import { AppNavigation } from "@/components/navigation/AppNavigation";
import { GradientCard } from "@/components/ui/gradient-card";

// Mock template data - typically this would come from an API
const mockTemplates = [
  {
    title: "DCA Trading Bot",
    description: "Dollar-cost averaging strategy for automated trading",
    features: ["Scheduled purchases", "Risk management", "Performance analytics"]
  },
  {
    title: "Momentum Trading",
    description: "Advanced trading based on market momentum indicators",
    features: ["Technical indicators", "Customizable thresholds", "Automatic execution"]
  },
  {
    title: "Price Boost Bot",
    description: "Προστασία επενδύσεων από πτώσεις τιμών στην αγορά",
    features: ["Αυτόματη υποστήριξη τιμών", "Έξυπνοι αλγόριθμοι", "Διαχείριση ρίσκου"]
  }
];

export default function Bots() {
  const { bots, loading } = useBotControl();
  
  // We'll use the bot data from useBotControl
  const hasBots = bots.length > 0;

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Διαχείριση Bots"
        description="Δημιουργήστε και διαχειριστείτε τα trading bots σας"
        breadcrumbs={[{ label: "Bots" }]}
        variant="green"
      />
      
      {/* Quick Navigation */}
      <div className="mb-6">
        <AppNavigation variant="colorful" />
      </div>
      
      <GradientCard
        variant="green"
        header={<CardTitle>Trading Bots</CardTitle>}
      >
        {hasBots ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {bots.map((bot, index) => (
              <BotCard 
                key={`bot-${bot.id}`}
                botName={bot.name}
                isActive={bot.active}
                tokens={bot.config?.quoteToken ? [bot.config.quoteToken] : ["Unknown"]}
                profit={bot.config?.profit || "0%"}
                timeRunning={bot.config?.timeRunning || "0h"}
                index={index}
                id={bot.id}
              />
            ))}
            <CreateBotCard />
            {mockTemplates.map((template, index) => (
              <BotTemplateCard 
                key={`template-${index}`}
                title={template.title}
                description={template.description}
                features={template.features}
              />
            ))}
          </div>
        ) : (
          <EmptyBotState />
        )}
      </GradientCard>
      
      {/* Bot features description */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <GradientCard variant="blue">
          <div className="p-4 text-center">
            <h3 className="text-xl font-bold mb-2">Αυτοματοποιημένο Trading</h3>
            <p className="text-muted-foreground mb-4">
              Δημιουργήστε bots που εκτελούν συναλλαγές αυτόματα βάσει των παραμέτρων που ορίζετε.
            </p>
          </div>
        </GradientCard>
        
        <GradientCard variant="purple">
          <div className="p-4 text-center">
            <h3 className="text-xl font-bold mb-2">Διαφορετικές Στρατηγικές</h3>
            <p className="text-muted-foreground mb-4">
              Επιλέξτε από μια ποικιλία στρατηγικών trading για να βελτιστοποιήσετε τις αποδόσεις σας.
            </p>
          </div>
        </GradientCard>
        
        <GradientCard variant="amber">
          <div className="p-4 text-center">
            <h3 className="text-xl font-bold mb-2">Προστασία Επενδύσεων</h3>
            <p className="text-muted-foreground mb-4">
              Η λειτουργία Price Boost προστατεύει τις επενδύσεις σας από απότομες πτώσεις στην αγορά.
            </p>
          </div>
        </GradientCard>
      </div>
    </div>
  );
}
