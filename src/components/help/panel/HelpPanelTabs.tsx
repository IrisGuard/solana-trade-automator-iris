
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListChecks, BookOpen, FileText, Shield, Search, Plus, Bot, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CommandList } from "../CommandList";
import { PlatformGuide } from "../PlatformGuide";
import { HelpSearch } from "../HelpSearch";
import { SolanaDocumentation } from "../SolanaDocumentation";
import { SystemProtectionGuide } from "../SystemProtectionGuide";

interface HelpPanelTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  showAddCommand: boolean;
  setShowAddCommand: (show: boolean) => void;
}

export function HelpPanelTabs({ 
  activeTab, 
  setActiveTab, 
  showAddCommand, 
  setShowAddCommand 
}: HelpPanelTabsProps) {
  return (
    <Tabs 
      defaultValue="commands" 
      value={activeTab} 
      onValueChange={setActiveTab}
      className="w-full"
    >
      <div className="flex justify-between items-center px-4 py-2 border-b overflow-x-auto">
        <TabsList>
          <TabsTrigger value="commands" className="flex items-center gap-2">
            <ListChecks className="h-4 w-4" />
            Εντολές
          </TabsTrigger>
          <TabsTrigger value="guide" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Οδηγός Πλατφόρμας
          </TabsTrigger>
          <TabsTrigger value="wallet" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            Πορτοφόλι
          </TabsTrigger>
          <TabsTrigger value="bots" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            Οδηγός Bot
          </TabsTrigger>
          <TabsTrigger value="documentation" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Τεκμηρίωση Solana
          </TabsTrigger>
          <TabsTrigger value="protection" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Προστασία Συστήματος
          </TabsTrigger>
          <TabsTrigger value="search" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Αναζήτηση
          </TabsTrigger>
        </TabsList>

        {activeTab === "commands" && !showAddCommand && (
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1 whitespace-nowrap"
            onClick={() => setShowAddCommand(true)}
          >
            <Plus className="h-4 w-4" />
            Προσθήκη εντολής
          </Button>
        )}
      </div>
    </Tabs>
  );
}
