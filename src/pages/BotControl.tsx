
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Play, Square, Loader2 } from "lucide-react";
import { BotCard } from "@/components/bot/BotCard";
import { BotTemplateCard } from "@/components/bot/BotTemplateCard";
import { CreateBotCard } from "@/components/bot/CreateBotCard";
import { EmptyBotState } from "@/components/bot/EmptyBotState";
import { useBotControl } from "@/hooks/useBotControl";
import { useWalletStatus } from "@/hooks/useWalletStatus";

export default function BotControl() {
  const { 
    bots, 
    activeTab, 
    setActiveTab, 
    templates, 
    startAllBots, 
    stopAllBots,
    toggleBotStatus,
    isLoading
  } = useBotControl();
  
  const { isConnected } = useWalletStatus();
  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="active">Active Bots</TabsTrigger>
            <TabsTrigger value="all">All Bots</TabsTrigger>
            <TabsTrigger value="templates">Bot Templates</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Button 
              variant="secondary" 
              size="sm" 
              className="gap-1" 
              onClick={stopAllBots}
              disabled={isLoading || !isConnected}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Square className="h-4 w-4" />
              )}
              Stop All
            </Button>
            <Button 
              size="sm" 
              className="gap-1" 
              onClick={startAllBots}
              disabled={isLoading || !isConnected}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              Start All
            </Button>
          </div>
        </div>

        <TabsContent value="active" className="mt-4">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bots.filter(bot => bot.isActive).map((bot, index) => (
              <BotCard 
                key={index} 
                {...bot} 
                index={index} 
                onToggle={toggleBotStatus}
              />
            ))}
          </div>
          {bots.filter(bot => bot.isActive).length === 0 && (
            <EmptyBotState />
          )}
        </TabsContent>

        <TabsContent value="all" className="mt-4">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bots.length > 0 ? (
              bots.map((bot, index) => (
                <BotCard 
                  key={index} 
                  {...bot} 
                  index={index}
                  onToggle={toggleBotStatus}
                />
              ))
            ) : (
              <EmptyBotState />
            )}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="mt-4">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((template, index) => (
              <BotTemplateCard 
                key={index}
                title={template.title}
                description={template.description}
                features={template.features}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {showCreateForm ? (
        <CreateBotCard onCancel={() => setShowCreateForm(false)} />
      ) : (
        <Button 
          className="w-full" 
          variant="outline" 
          size="lg"
          onClick={() => setShowCreateForm(true)}
          disabled={!isConnected}
        >
          + Create New Bot
        </Button>
      )}
    </div>
  );
}
