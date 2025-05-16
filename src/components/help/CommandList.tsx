
import React, { useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { SearchBar } from "./command-list/SearchBar";
import { SearchableCommandList } from "./command-list/SearchableCommandList";
import { TabsView } from "./command-list/TabsView";
import { COMMANDS_BY_CATEGORY } from "./command-list/commandsData";

export function CommandList() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<keyof typeof COMMANDS_BY_CATEGORY>("wallet");
  
  const filteredCommands = searchTerm 
    ? Object.values(COMMANDS_BY_CATEGORY).flat().filter(cmd => 
        cmd.command.toLowerCase().includes(searchTerm.toLowerCase()) || 
        cmd.details.toLowerCase().includes(searchTerm.toLowerCase()))
    : COMMANDS_BY_CATEGORY[activeCategory];
  
  return (
    <div className="p-4">
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">{t("help.commandExplorer")}</h3>
        <p className="text-sm text-muted-foreground">
          {t("help.exploreAllCommands")}
        </p>
        
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>
      
      {searchTerm ? (
        <SearchableCommandList filteredCommands={filteredCommands} searchTerm={searchTerm} />
      ) : (
        <TabsView activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
      )}
    </div>
  );
}
