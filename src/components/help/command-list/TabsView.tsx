
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CommandCategory } from "./CommandCategory";
import { COMMANDS_BY_CATEGORY } from "./commandsData";
import { useLanguage } from "@/hooks/use-language";

interface TabsViewProps {
  activeCategory: keyof typeof COMMANDS_BY_CATEGORY;
  setActiveCategory: (category: keyof typeof COMMANDS_BY_CATEGORY) => void;
}

export function TabsView({ activeCategory, setActiveCategory }: TabsViewProps) {
  const { t } = useLanguage();
  
  return (
    <Tabs 
      defaultValue="wallet" 
      value={activeCategory} 
      onValueChange={(value) => setActiveCategory(value as keyof typeof COMMANDS_BY_CATEGORY)}
    >
      <TabsList className="mb-4 grid grid-cols-4 w-full">
        <TabsTrigger value="wallet">Πορτοφόλι</TabsTrigger>
        <TabsTrigger value="bots">Bots</TabsTrigger>
        <TabsTrigger value="api">API</TabsTrigger>
        <TabsTrigger value="system">Σύστημα</TabsTrigger>
      </TabsList>
      
      {Object.entries(COMMANDS_BY_CATEGORY).map(([category, commands]) => (
        <TabsContent key={category} value={category} className="space-y-2">
          <CommandCategory commands={commands} t={t} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
