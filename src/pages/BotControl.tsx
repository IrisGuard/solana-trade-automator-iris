
import React, { useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Play, Square, Loader2, Plus, Trash2 } from "lucide-react";
import { BotCard } from "@/components/bot/BotCard";
import { BotTemplateCard } from "@/components/bot/BotTemplateCard";
import { CreateBotCard } from "@/components/bot/CreateBotCard";
import { EmptyBotState } from "@/components/bot/EmptyBotState";
import { useBotControl } from "@/hooks/useBotControl";
import { useWalletStatus } from "@/hooks/useWalletStatus";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function BotControl() {
  const { 
    bots, 
    activeTab, 
    setActiveTab, 
    templates, 
    botTemplates,
    startAllBots, 
    stopAllBots,
    toggleBotStatus,
    createBotFromTemplate,
    deleteBot,
    isLoading
  } = useBotControl();
  
  const { isConnected } = useWalletStatus();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [botToDelete, setBotToDelete] = useState<string | null>(null);

  const handleCreateFromTemplate = useCallback(async (templateId: string) => {
    await createBotFromTemplate(templateId);
  }, [createBotFromTemplate]);

  const handleDeleteBot = useCallback(async (botId: string) => {
    setBotToDelete(botId);
  }, []);

  const confirmDeleteBot = useCallback(async () => {
    if (botToDelete) {
      await deleteBot(botToDelete);
      setBotToDelete(null);
    }
  }, [botToDelete, deleteBot]);

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
                key={bot.id || index} 
                {...bot} 
                index={index} 
                onToggle={toggleBotStatus}
                onDelete={() => bot.id && handleDeleteBot(bot.id)}
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
                  key={bot.id || index} 
                  {...bot} 
                  index={index}
                  onToggle={toggleBotStatus}
                  onDelete={() => bot.id && handleDeleteBot(bot.id)}
                />
              ))
            ) : (
              <EmptyBotState />
            )}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="mt-4">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {botTemplates.length > 0 ? 
              botTemplates.map((template, index) => (
                <BotTemplateCard 
                  key={template.id || `template-${index}`}
                  title={template.name}
                  description={template.description || ''}
                  features={
                    template.strategy === 'momentum' ? [
                      "Auto-adjusting position sizes",
                      "Momentum indicators",
                      "Dollar-cost averaging"
                    ] : template.strategy === 'arbitrage' ? [
                      "Multi-exchange support",
                      "Real-time price comparison",
                      "Auto-execution"
                    ] : [
                      "Customizable price grid",
                      "Profit from price volatility",
                      "Auto grid rebalancing"
                    ]
                  }
                  templateId={template.id}
                  onCreateFromTemplate={handleCreateFromTemplate}
                />
              ))
            : templates.map((template, index) => (
              <BotTemplateCard 
                key={`template-${index}`}
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
          className="w-full gap-2" 
          variant="outline" 
          size="lg"
          onClick={() => setShowCreateForm(true)}
          disabled={!isConnected}
        >
          <Plus className="h-4 w-4" /> Create New Bot
        </Button>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!botToDelete} onOpenChange={(open) => !open && setBotToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your bot and all its trading history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={confirmDeleteBot}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Bot
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
